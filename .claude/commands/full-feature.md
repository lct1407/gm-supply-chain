# End-to-end feature development

Build a complete feature from backend to frontend for: $ARGUMENTS

## Phase 0: Understand
1. Read the FRD in `docs/frd/README.md` — find the module and requirements for this feature
2. Read the FDD in `docs/fdd/README.md` — find the DB schema, API design, algorithms
3. Read the UI/UX in `docs/ui-ux/README.md` — find the wireframe and design tokens
4. Use code-explorer agent to understand existing codebase patterns

## Phase 1: Database
1. Create/update SQLAlchemy model in `backend/app/models/`
2. Import model in `backend/app/models/__init__.py`
3. Create Alembic migration: `cd backend && alembic revision --autogenerate -m "<description>"`
4. Run migration: `cd backend && alembic upgrade head`

## Phase 2: Backend
1. Pydantic schemas in `backend/app/schemas/` (Create, Update, Response, List)
2. Service layer in `backend/app/services/` (ALL business logic here)
3. API routes in `backend/app/api/v1/endpoints/`
4. Register routes in `backend/app/api/v1/__init__.py`
5. Write tests in `backend/tests/`
6. Run tests: `cd backend && pytest -v`

## Phase 3: Frontend
1. Types in `frontend/src/types/`
2. API client in `frontend/src/lib/api/`
3. TanStack Query hooks in `frontend/src/hooks/`
4. Components in `frontend/src/components/<feature>/` (use shadcn/ui)
5. Pages in `frontend/src/app/(dashboard)/<feature>/`
6. Zod forms if needed
7. Add to sidebar navigation

## Phase 4: Verify
1. Run backend tests: `cd backend && pytest -v`
2. Run frontend lint: `cd frontend && npm run lint`
3. Run type check: `cd frontend && npx tsc --noEmit`
4. Manual test if Docker is running

## Phase 5: Clean up
- Use code-simplifier agent to simplify the code
- Use code-reviewer agent to review for bugs/security
