# GM Supply — Supply Chain Management

## Dự án
Hệ thống quản lý & phân bổ nguồn cung Nấm tươi (Mushroom Supply Chain Management).
Nấm là nông sản tươi sống (shelf life 2-14 ngày), cần phân bổ nhanh, tracking hao hụt chặt chẽ.

## Tech Stack
- **Frontend**: Next.js 14 + TypeScript + shadcn/ui + TanStack Query
- **Backend**: FastAPI (Python 3.11+) + SQLAlchemy + Alembic
- **Database**: PostgreSQL 16 (primary), ClickHouse (analytics), Redis (cache + queue)
- **Task Queue**: Celery + Redis
- **Deployment**: Docker + Docker Compose
- **Testing**: pytest (backend), vitest + Playwright (frontend)

## Common Commands
- Backend dev: `cd backend && uvicorn app.main:app --reload --port 8000`
- Frontend dev: `cd frontend && npm run dev`
- Backend tests: `cd backend && pytest -v`
- Frontend lint: `cd frontend && npm run lint`
- Frontend typecheck: `cd frontend && npx tsc --noEmit`
- DB migration create: `cd backend && alembic revision --autogenerate -m "description"`
- DB migration run: `cd backend && alembic upgrade head`
- Docker up: `docker compose up -d`
- Docker logs: `docker compose logs backend --tail 50`

## Custom Slash Commands
- `/new-api-endpoint <resource>` — Create backend endpoint (model → schema → service → route → test)
- `/new-frontend-page <feature>` — Create frontend page (types → api → hooks → components → page)
- `/full-feature <feature>` — End-to-end feature (read FRD/FDD → backend → frontend → verify)
- `/debug <issue>` — Debug workflow (reproduce → trace → fix → test)
- `/db-migrate <description>` — Create and run DB migration

## Cấu trúc dự án
```
gm-supply-chain/
├── backend/          # FastAPI application
│   ├── app/
│   │   ├── api/      # API routes (versioned: /api/v1/)
│   │   ├── core/     # Config, security, dependencies
│   │   ├── models/   # SQLAlchemy models
│   │   ├── schemas/  # Pydantic schemas
│   │   ├── services/ # Business logic
│   │   ├── tasks/    # Celery tasks
│   │   └── utils/    # Helpers
│   ├── alembic/      # DB migrations
│   ├── tests/
│   └── requirements.txt
├── frontend/         # Next.js application
│   ├── src/
│   │   ├── app/      # App router pages
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/      # API client, utils
│   │   ├── types/
│   │   └── stores/
│   └── package.json
├── docker/           # Dockerfiles
├── docker-compose.yml
└── CLAUDE.md
```

## Quy tắc Code

### Backend (Python)
- Sử dụng type hints cho tất cả function signatures
- Pydantic v2 cho schemas (model_validator thay vì validator)
- Async endpoints khi có I/O (database, external API)
- Alembic cho mọi thay đổi DB schema — không sửa trực tiếp
- Business logic nằm trong services/, không trong routes
- Naming: snake_case cho variables/functions, PascalCase cho classes

### Frontend (TypeScript)
- Strict TypeScript — không dùng `any`
- shadcn/ui components — không tự viết UI primitives
- TanStack Query cho server state — không dùng useEffect fetch
- Zod cho form validation
- Naming: camelCase cho variables/functions, PascalCase cho components

### Database
- Table names: snake_case, số nhiều (suppliers, orders, allocations)
- Luôn có: id (UUID), created_at, updated_at
- Soft delete với deleted_at (nấm có audit trail quan trọng)
- Index cho các trường thường query: supplier_id, product_id, status, date ranges

### API
- RESTful, versioned: /api/v1/
- Response format: { data, meta, errors }
- Pagination: cursor-based cho lists lớn
- Tiếng Anh cho code/API, tiếng Việt cho UI labels

## Ngôn ngữ
- Code, comments, API, git commits: **Tiếng Anh**
- UI labels, messages, docs cho user: **Tiếng Việt**
- Giao tiếp với developer (conversation): **Tiếng Việt**

## Đặc thù ngành cần nhớ
- Hao hụt (shrinkage) là yếu tố sống còn — luôn tính buffer khi phân bổ
- FEFO (First Expired First Out) — không phải FIFO
- Shelf life ngắn → mọi xử lý phải nhanh, không để hàng chờ
- Cold chain 2-8°C — gián đoạn = giảm shelf life
- Remaining Shelf Life (RSL) tối thiểu cho từng kênh khách hàng

## Documentation
- `docs/frd/` — Functional Requirements Document (yêu cầu chức năng chi tiết)
- `docs/fdd/` — Functional Design Document (kiến trúc, DB schema, API, algorithms)
- `docs/ui-ux/` — UI/UX specification (wireframes, design tokens, layout)
- `docs/workflows/` — Development workflows, agent teams, skills usage

## Development Workflow
Khi phát triển feature mới, tuân theo quy trình:
1. **Plan**: Đọc FRD → FDD → dùng `/feature-dev` (code-architect + code-explorer)
2. **Build**: DB model → Alembic migration → Service → API → UI (dùng `/frontend-design` cho UI)
3. **Review**: Dùng `/simplify` → `/code-review`
4. **Commit**: Dùng `/commit`

## Skills Reference (Built-in)
| Skill | Khi dùng |
|-------|---------|
| `/feature-dev` | Feature mới — architect + explore codebase |
| `/frontend-design` | Tạo UI pages/components đẹp |
| `/code-review` | Review code/PR |
| `/simplify` | Simplify code sau khi viết |
| `/commit` | Commit với message chuẩn |
| `/review-pr` | Review pull request |

## Custom Agents (`.claude/agents/`)
| Agent | Khi dùng |
|-------|---------|
| `qa-tester` | Viết và chạy tests (pytest, vitest), edge cases cho nấm tươi |
| `db-architect` | Thiết kế DB schema, tạo migration, seed data |
| `api-builder` | Build FastAPI endpoints theo convention (schema → service → route) |
| `ui-builder` | Build frontend pages/components với shadcn/ui |
| `docs-writer` | Cập nhật FRD, FDD, UI/UX docs khi requirements thay đổi |
| `devops` | Docker, DB admin, CI/CD, troubleshoot infrastructure |
