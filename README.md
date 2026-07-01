# ProposalPilot AI

> AI-powered assistant for RFPs, tenders, and technical proposals. Built with Next.js, FastAPI, PostgreSQL, and Ollama (100% local AI no paid APIs).

## What It Does

ProposalPilot AI helps IT companies, presales teams, and consultants win more deals:

- Upload RFP/Tender (PDF or DOCX)
- Extract Requirements
- Generate Clarification Questions
- Identify Risks
- Build Proposal Outline
- Write Executive Summary
- Export to Markdown

## Tech Stack

- Frontend: Next.js 14, Tailwind CSS
- Backend: FastAPI (Python)
- Database: PostgreSQL
- AI Engine: Ollama (local, free)
- Vector DB: ChromaDB
- Container: Docker Compose

## Quick Start

```bash
git clone https://github.com/majaber1/proposalpilot-ai.git
cd proposalpilot-ai
cp .env.example .env
ollama pull qwen2.5:7b-instruct
docker compose up -d
```

Open http://localhost:3000 and login with admin@demo.com / demo123

## License

MIT
