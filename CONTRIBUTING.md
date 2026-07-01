# Contributing to ProposalPilot AI

Thank you for your interest in contributing! This document provides guidelines for contributing to ProposalPilot AI.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/proposalpilot-ai.git`
3. Create a feature branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Run tests
6. Push and create a Pull Request

## Development Setup

```bash
# Clone the repo
git clone https://github.com/majaber1/proposalpilot-ai.git
cd proposalpilot-ai

# Copy env file
cp .env.example .env

# Pull AI model
ollama pull qwen2.5:7b-instruct

# Start all services
docker compose up -d

# View logs
docker compose logs -f backend
```

## Project Structure

- `frontend/` - Next.js 14 frontend application
- `backend/` - FastAPI Python backend
- `backend/prompts/` - AI prompt templates
- `backend/routers/` - API route handlers
- `backend/services/` - Business logic services
- `backend/db/` - Database migrations and seeds

## Code Style

### Python (Backend)
- Follow PEP 8
- Use type hints for all functions
- Write docstrings for public functions
- Run: `black backend/ && isort backend/`

### TypeScript (Frontend)
- Use TypeScript strict mode
- Follow Next.js App Router conventions
- Use Tailwind CSS for styling
- Run: `cd frontend && npm run lint`

## Adding AI Prompts

Prompt templates are in `backend/prompts/`. To add a new prompt:

1. Create a `.txt` file in `backend/prompts/`
2. Use `{variable_name}` for dynamic content
3. Register the prompt in `backend/services/ollama_service.py`

Example prompt template:
```
You are an expert proposal writer. Given the following RFP text:

{rfp_text}

Generate {count} clarification questions that should be asked to the client.
Format your response as a numbered list.
```

## Pull Request Process

1. Update the README.md if needed
2. Add tests for new features
3. Ensure all existing tests pass
4. Request review from maintainers
5. Address all review comments

## Reporting Issues

- Use GitHub Issues
- Include steps to reproduce
- Include logs from `docker compose logs`
- Specify your OS and Docker version

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help newcomers learn

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
