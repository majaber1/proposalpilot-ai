"""
Ollama Service - Handles all AI/LLM interactions via Ollama
"""
import httpx
import os
from typing import Optional
import json

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://ollama:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "qwen2.5:7b-instruct")
AI_TEMPERATURE = float(os.getenv("AI_TEMPERATURE", "0.7"))
AI_MAX_TOKENS = int(os.getenv("AI_MAX_TOKENS", "4096"))
AI_TIMEOUT = int(os.getenv("AI_TIMEOUT_SECONDS", "120"))


async def generate_text(prompt: str, model: Optional[str] = None) -> str:
    """Generate text using Ollama API"""
    model = model or OLLAMA_MODEL
    
    payload = {
        "model": model,
        "prompt": prompt,
        "stream": False,
        "options": {
            "temperature": AI_TEMPERATURE,
            "num_predict": AI_MAX_TOKENS,
        }
    }
    
    async with httpx.AsyncClient(timeout=AI_TIMEOUT) as client:
        response = await client.post(
            f"{OLLAMA_BASE_URL}/api/generate",
            json=payload
        )
        response.raise_for_status()
        result = response.json()
        return result.get("response", "")


async def check_ollama_health() -> dict:
    """Check if Ollama is running and model is available"""
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.get(f"{OLLAMA_BASE_URL}/api/tags")
            models = response.json().get("models", [])
            model_names = [m["name"] for m in models]
            return {
                "status": "ok",
                "model": OLLAMA_MODEL,
                "model_available": any(OLLAMA_MODEL in m for m in model_names),
                "available_models": model_names
            }
    except Exception as e:
        return {"status": "error", "message": str(e)}


def load_prompt(prompt_name: str) -> str:
    """Load a prompt template from file"""
    prompt_dir = os.path.join(os.path.dirname(__file__), "..", "prompts")
    prompt_path = os.path.join(prompt_dir, f"{prompt_name}.txt")
    try:
        with open(prompt_path, "r") as f:
            return f.read()
    except FileNotFoundError:
        return ""


async def analyze_rfp(rfp_text: str, analysis_type: str) -> str:
    """Analyze RFP text for specific type of analysis"""
    prompt_template = load_prompt(analysis_type)
    
    if not prompt_template:
        prompt_templates = {
            "rfp_summarizer": "Summarize this RFP document, extracting all key requirements:\n\n{text}\n\nProvide a structured summary.",
            "clarification_questions": "Generate 10 clarification questions for this RFP:\n\n{text}\n\nFormat as numbered list.",
            "risk_extractor": "Identify and analyze project risks from this RFP:\n\n{text}\n\nList each risk with severity (High/Medium/Low) and mitigation.",
            "assumptions_generator": "Generate project assumptions for this RFP:\n\n{text}\n\nList 10-15 key assumptions.",
            "proposal_outline": "Create a proposal outline for this RFP:\n\n{text}\n\nProvide complete section structure.",
            "executive_summary": "Write an executive summary for this RFP proposal:\n\n{text}\n\nWrite 2-3 compelling paragraphs."
        }
        prompt_template = prompt_templates.get(analysis_type, "Analyze this RFP:\n\n{text}")
    
    prompt = prompt_template.replace("{text}", rfp_text[:8000])
    return await generate_text(prompt)
