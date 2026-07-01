"""
ProposalPilot AI - FastAPI Backend
Main application entry point
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from routers import auth, documents, analysis, proposals
from database import create_tables

app = FastAPI(
    title="ProposalPilot AI API",
    description="AI-powered assistant for RFPs, tenders, and technical proposals",
    version="1.0.0"
)

cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(documents.router, prefix="/api/documents", tags=["Documents"])
app.include_router(analysis.router, prefix="/api/analysis", tags=["Analysis"])
app.include_router(proposals.router, prefix="/api/proposals", tags=["Proposals"])

os.makedirs(os.getenv("UPLOAD_DIR", "/app/uploads"), exist_ok=True)


@app.on_event("startup")
async def startup_event():
    await create_tables()
    print(f"Started with model: {os.getenv('OLLAMA_MODEL', 'qwen2.5:7b-instruct')}")


@app.get("/")
async def root():
    return {"app": "ProposalPilot AI", "version": "1.0.0", "status": "running"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
