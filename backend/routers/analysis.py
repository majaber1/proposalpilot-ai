"""
Analysis Router - Handles AI analysis of uploaded documents
"""
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from pydantic import BaseModel
from typing import Optional
import json

from database import get_db, Document, Analysis
from services.ollama_service import analyze_rfp, check_ollama_health

router = APIRouter()


class AnalysisRequest(BaseModel):
    document_id: int
    analysis_types: list[str] = ["rfp_summarizer", "clarification_questions", "risk_extractor", "assumptions_generator", "proposal_outline", "executive_summary"]


class AnalysisResponse(BaseModel):
    id: int
    document_id: int
    status: str
    requirements: Optional[str] = None
    clarification_questions: Optional[str] = None
    risks: Optional[str] = None
    assumptions: Optional[str] = None
    proposal_outline: Optional[str] = None
    executive_summary: Optional[str] = None
    model_used: Optional[str] = None


@router.get("/health")
async def analysis_health():
    """Check Ollama AI service health"""
    return await check_ollama_health()


@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_document(
    request: AnalysisRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db)
):
    """Start AI analysis of a document"""
    # Get document
    result = await db.execute(select(Document).where(Document.id == request.document_id))
    document = result.scalar_one_or_none()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    if not document.extracted_text:
        raise HTTPException(status_code=400, detail="Document has no extracted text. Please re-upload.")
    
    # Create analysis record
    analysis = Analysis(
        document_id=document.id,
        user_id=document.user_id,
        status="processing"
    )
    db.add(analysis)
    await db.commit()
    await db.refresh(analysis)
    
    # Run analysis in background
    background_tasks.add_task(run_analysis, analysis.id, document.extracted_text, db)
    
    return AnalysisResponse(
        id=analysis.id,
        document_id=document.id,
        status="processing",
        model_used="qwen2.5:7b-instruct"
    )


async def run_analysis(analysis_id: int, rfp_text: str, db: AsyncSession):
    """Background task to run all AI analyses"""
    import os
    model = os.getenv("OLLAMA_MODEL", "qwen2.5:7b-instruct")
    
    try:
        results = {}
        analysis_types = {
            "requirements": "rfp_summarizer",
            "clarification_questions": "clarification_questions",
            "risks": "risk_extractor",
            "assumptions": "assumptions_generator",
            "proposal_outline": "proposal_outline",
            "executive_summary": "executive_summary"
        }
        
        for field, analysis_type in analysis_types.items():
            result_text = await analyze_rfp(rfp_text, analysis_type)
            results[field] = result_text
        
        # Update analysis record
        async with db.begin():
            await db.execute(
                update(Analysis)
                .where(Analysis.id == analysis_id)
                .values(**results, status="completed", model_used=model)
            )
    except Exception as e:
        async with db.begin():
            await db.execute(
                update(Analysis)
                .where(Analysis.id == analysis_id)
                .values(status="error")
            )


@router.get("/{analysis_id}", response_model=AnalysisResponse)
async def get_analysis(analysis_id: int, db: AsyncSession = Depends(get_db)):
    """Get analysis results"""
    result = await db.execute(select(Analysis).where(Analysis.id == analysis_id))
    analysis = result.scalar_one_or_none()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return analysis


@router.get("/document/{document_id}")
async def get_document_analyses(document_id: int, db: AsyncSession = Depends(get_db)):
    """Get all analyses for a document"""
    result = await db.execute(select(Analysis).where(Analysis.document_id == document_id))
    analyses = result.scalars().all()
    return analyses
