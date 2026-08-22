# AgroSense — Project Instructions

## Project Overview

AgroSense is a soil pH analysis web application.

The project consists of:
- React + Vite frontend
- FastAPI backend
- Pre-trained scikit-learn/XGBoost model for soil pH classification

The frontend is responsible for UI, client-side validation, and API communication.

The backend is responsible for API endpoints, feature preparation, model loading, inference, and response formatting.

## Architecture

Frontend:
- React
- Vite
- Tailwind CSS
- JavaScript/JSX

Backend:
- Python
- FastAPI
- Uvicorn
- pandas
- numpy
- scikit-learn
- XGBoost
- joblib
- Pydantic

Communication:
- REST API using fetch
- Single prediction: POST /predict
- Batch prediction: POST /predict/batch
- Health check: GET /health

Deployment target:
- Frontend → Vercel
- Backend → Render

## Development Principles

- Inspect the existing codebase before making changes.
- Preserve existing architecture unless there is a clear reason to change it.
- Prefer simple, maintainable solutions.
- Reuse existing components and utilities when appropriate.
- Do not introduce new dependencies unless necessary.
- Do not rewrite working code unnecessarily.
- Keep frontend and backend responsibilities separated.

## Workflow

For non-trivial tasks:

1. Understand the requirement.
2. Inspect relevant files and existing patterns.
3. Identify potential side effects.
4. Propose an implementation plan.
5. Wait for approval before making significant changes.
6. Implement incrementally.
7. Run relevant tests, builds, or validation.
8. Review the resulting changes.
9. Summarize what changed and identify remaining risks.

For small, obvious changes, implementation can proceed directly.

## Security

Never expose, print, or intentionally read secrets.

Treat the following as sensitive:
- .env
- .env.*
- API keys
- access tokens
- passwords
- credentials
- private keys

Do not modify environment configuration unless explicitly requested.

Never commit secrets to Git.

## Git Safety

Do not automatically:
- git push
- force push
- reset --hard
- delete branches
- rewrite Git history

Ask for confirmation before destructive Git operations.

## Dependency Safety

Do not install packages automatically when they are not already part of the project.

Before adding a dependency:
1. Explain why it is needed.
2. Check whether the existing stack can solve the problem.
3. Ask for approval before installation.

## Code Quality

Prioritize:
- readability
- maintainability
- consistency with the existing codebase
- clear naming
- minimal unnecessary abstraction

Avoid overengineering.

## Communication

When explaining technical decisions:
- State the recommendation.
- Explain the reasoning.
- Mention important trade-offs.
- Clearly distinguish facts from assumptions.

Do not claim that something was tested if it was not actually tested.