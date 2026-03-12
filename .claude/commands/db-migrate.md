# Database migration

Create and run a database migration for: $ARGUMENTS

Steps:
1. Review the model changes needed based on the description
2. Update/create SQLAlchemy model in `backend/app/models/`
3. Make sure the model is imported in `backend/app/models/__init__.py`
4. Generate migration: `cd backend && alembic revision --autogenerate -m "$ARGUMENTS"`
5. Review the generated migration file in `backend/alembic/versions/`
6. Run migration: `cd backend && alembic upgrade head`
7. Verify: check that tables/columns were created correctly
