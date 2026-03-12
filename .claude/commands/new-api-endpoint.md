# Create a new API endpoint

Create a complete API endpoint for the resource: $ARGUMENTS

Follow this order:
1. Create/update the SQLAlchemy model in `backend/app/models/`
2. Create the Pydantic schemas (Create, Update, Response, List) in `backend/app/schemas/`
3. Create the service with CRUD operations in `backend/app/services/`
4. Create the API route in `backend/app/api/v1/endpoints/`
5. Register the route in `backend/app/api/v1/__init__.py`
6. Create an Alembic migration if model changed: `cd backend && alembic revision --autogenerate -m "add <resource>"`
7. Write pytest tests for the endpoint in `backend/tests/`
8. Run the tests to verify: `cd backend && pytest -v`

Rules:
- Check existing files and patterns first before creating new ones
- Use async endpoints with `async def`
- Business logic goes in services/, not in route handlers
- All models must have: id (UUID), created_at, updated_at, deleted_at (soft delete)
- Response format: `{ data, meta, errors }`
- Use dependency injection for database session via `get_db`
