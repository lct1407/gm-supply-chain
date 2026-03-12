# Backend — GM Supply API

## Stack
- Python 3.11+, FastAPI, SQLAlchemy 2.0 async, Pydantic v2
- Database: PostgreSQL 16 via asyncpg
- Migrations: Alembic (autogenerate)
- Queue: Celery + Redis

## Commands
- Dev server: `uvicorn app.main:app --reload --port 8000`
- Tests: `pytest -v`
- Single test: `pytest tests/test_xxx.py::test_name -v`
- Migration create: `alembic revision --autogenerate -m "description"`
- Migration run: `alembic upgrade head`
- Lint: `ruff check .`
- Format: `ruff format .`

## Conventions
- Routes in `app/api/v1/endpoints/`, registered in `app/api/v1/__init__.py`
- Business logic in `app/services/`, NOT in route handlers
- DB session via `from app.core.database import get_db`
- Config via `from app.core.config import settings`
- All endpoints async (`async def`)
- Type hints required on all functions
- Pydantic v2: use `model_validator` not `validator`
