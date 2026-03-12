# Development Workflows & Agent Teams
# GM Supply — Supply Chain Management System

---

## 1. Development Workflow Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                    GM SUPPLY — Dev Workflow                       │
│                                                                  │
│  ┌─────────┐    ┌──────────┐    ┌─────────┐    ┌─────────────┐ │
│  │ PLAN    │───>│  BUILD   │───>│ REVIEW  │───>│   DEPLOY    │ │
│  │         │    │          │    │         │    │             │ │
│  │ FRD/FDD │    │ Feature  │    │ PR      │    │ Docker      │ │
│  │ UI/UX   │    │ Dev      │    │ Review  │    │ Staging     │ │
│  │ Tasks   │    │ Tests    │    │ QA      │    │ Production  │ │
│  └─────────┘    └──────────┘    └─────────┘    └─────────────┘ │
│       │              │              │                │          │
│       ▼              ▼              ▼                ▼          │
│  Claude Code    Claude Code    Claude Code      Docker         │
│  Plan Agent     Feature Dev    Code Review      Compose        │
│                 Agents         Agents                          │
└──────────────────────────────────────────────────────────────────┘
```

---

## 2. Agent Teams & Roles

### 2.1 Planning Team

| Agent | Skill/Tool | Nhiệm vụ |
|-------|-----------|----------|
| **Architect** | `/feature-dev` → code-architect | Phân tích FRD → thiết kế kiến trúc, chọn pattern, data flow |
| **Explorer** | `/feature-dev` → code-explorer | Khảo sát codebase hiện tại, tìm pattern, dependency |
| **Plan Agent** | Plan mode | Tạo implementation plan chi tiết, phân rã task |

### 2.2 Development Team

| Agent | Skill/Tool | Nhiệm vụ |
|-------|-----------|----------|
| **Feature Dev** | `/feature-dev` | Phát triển feature end-to-end (model → service → API → UI) |
| **Frontend Design** | `/frontend-design` | Tạo UI components, pages với shadcn/ui |
| **API Builder** | Claude Code + context7 | Viết FastAPI endpoints, Pydantic schemas |
| **DB Migration** | Claude Code + Alembic | Tạo migration scripts, seed data |

### 2.3 Quality Team

| Agent | Skill/Tool | Nhiệm vụ |
|-------|-----------|----------|
| **Code Reviewer** | `/code-review` hoặc `pr-review-toolkit` | Review PR: bugs, security, conventions |
| **Code Simplifier** | `code-simplifier` agent | Simplify code sau khi viết |
| **Test Writer** | Claude Code | Viết unit tests, integration tests |
| **Type Analyzer** | `type-design-analyzer` agent | Kiểm tra type design, interface consistency |

### 2.4 DevOps Team

| Agent | Tool | Nhiệm vụ |
|-------|------|----------|
| **Docker** | Bash + Docker Compose | Build, run, debug containers |
| **DB Admin** | Bash + psql/Alembic | Migration, seed, backup |

---

## 3. Development Workflow Chi tiết

### 3.1 Feature Development Flow

```
Step 1: UNDERSTAND
├── Đọc FRD requirement (docs/frd/)
├── Đọc FDD technical design (docs/fdd/)
├── Dùng code-explorer agent để hiểu codebase hiện tại
└── Output: Hiểu rõ what + how

Step 2: PLAN
├── Dùng /feature-dev skill
├── code-architect agent → thiết kế chi tiết
├── Tạo task list (TaskCreate)
└── Output: Implementation plan + tasks

Step 3: BUILD (theo thứ tự)
├── 3a. Database
│   ├── Tạo/update SQLAlchemy model (backend/app/models/)
│   ├── Tạo Alembic migration
│   └── Seed data nếu cần
├── 3b. Backend
│   ├── Pydantic schemas (backend/app/schemas/)
│   ├── Service layer (backend/app/services/)
│   ├── API routes (backend/app/api/v1/endpoints/)
│   └── Unit tests (backend/tests/)
├── 3c. Frontend
│   ├── Types (frontend/src/types/)
│   ├── API hooks (frontend/src/hooks/)
│   ├── Components (frontend/src/components/)
│   ├── Pages (frontend/src/app/)
│   └── Dùng /frontend-design cho UI phức tạp
└── Output: Working feature

Step 4: REVIEW
├── Dùng code-simplifier agent
├── Dùng /code-review skill
├── Fix issues
└── Output: Clean, reviewed code

Step 5: COMMIT
├── /commit skill
└── Output: Clean git history
```

### 3.2 Bug Fix Flow

```
Step 1: REPRODUCE
├── Đọc bug report
├── Dùng code-explorer để trace code path
└── Xác định root cause

Step 2: FIX
├── Viết failing test trước
├── Fix bug
├── Verify test passes
└── Dùng code-simplifier

Step 3: REVIEW + COMMIT
├── /code-review
└── /commit
```

### 3.3 PR Review Flow

```
/review-pr <PR-number>
├── code-reviewer agent: bugs, logic errors
├── silent-failure-hunter agent: edge cases
├── type-design-analyzer agent: type consistency
├── comment-analyzer agent: actionable feedback
└── Output: Comprehensive review
```

---

## 4. Quy trình phát triển theo Phase

### Phase 1 — MVP Sprint Plan

```
Sprint 1 (Week 1-2): Foundation
├── Setup Docker, DB, Auth
├── User CRUD + RBAC
├── Base layout (sidebar, header)
└── Login page

Sprint 2 (Week 3-4): Supplier Module
├── Supplier CRUD (model → API → UI)
├── Product catalog
├── Supplier-Product assignment
└── Supplier list + detail pages

Sprint 3 (Week 5-6): Order Module
├── Customer CRUD
├── Order CRUD
├── Excel import wizard
├── Order list + detail pages

Sprint 4 (Week 7-8): Allocation Module
├── Allocation plan CRUD
├── Monthly allocation algorithm
├── Allocation table UI (editable grid)
├── Approval workflow (basic)

Sprint 5 (Week 9-10): Dashboard & Polish
├── Dashboard with KPI cards
├── Supply vs Demand chart
├── Alert system (basic)
├── Admin config pages
├── Testing + bug fixes
```

---

## 5. MCP Servers Configuration

### 5.1 Recommended MCP Servers

| MCP Server | Mục đích | Config |
|-----------|----------|--------|
| **context7** | Tra cứu docs Next.js, FastAPI, shadcn/ui, SQLAlchemy | Đã cài |
| **chrome-devtools** | Debug frontend, screenshot, Lighthouse audit | Đã cài |
| **stitch** | Generate UI screens from text, variants | Đã cài |
| **postgres** | Query DB trực tiếp, inspect schema | Cần cài |
| **filesystem** | Read/write files outside project | Optional |
| **github** | PR management, issues | Cần cài |

### 5.2 Cách sử dụng MCP trong workflow

```
# Tra cứu docs khi code
context7 → resolve-library-id("fastapi") → query-docs("async sqlalchemy session")

# Debug UI
chrome-devtools → navigate_page → take_screenshot → lighthouse_audit

# Generate UI nhanh
stitch → generate_screen_from_text("supplier list with filters and data table")

# Kiểm tra DB
postgres → query("SELECT * FROM suppliers WHERE rank = 'A'")
```

---

## 6. Claude Code Skills Usage

| Skill | Khi nào dùng | Command |
|-------|-------------|---------|
| `/feature-dev` | Bắt đầu feature mới, cần architect + explore | `/feature-dev` |
| `/frontend-design` | Tạo UI component/page đẹp | `/frontend-design` |
| `/code-review` | Review code trước commit | `/code-review` |
| `/review-pr` | Review pull request | `/review-pr <number>` |
| `/commit` | Tạo commit với message chuẩn | `/commit` |
| `/simplify` | Simplify code sau khi viết | `/simplify` |
| `/claude-api` | Nếu cần tích hợp Claude AI (forecast) | `/claude-api` |

---

## 7. Quality Gates

### 7.1 Before Commit
- [ ] Code passes linting (ruff for Python, ESLint for TS)
- [ ] No TypeScript `any` types
- [ ] Business logic in services/, not routes
- [ ] New DB fields have migration
- [ ] API follows response format convention

### 7.2 Before PR Merge
- [ ] `/code-review` passed
- [ ] Unit tests pass
- [ ] No security vulnerabilities (OWASP top 10)
- [ ] UI responsive on desktop + tablet
- [ ] Vietnamese labels correct

### 7.3 Before Deploy
- [ ] Docker build succeeds
- [ ] Migration runs cleanly
- [ ] Health check endpoint responds
- [ ] Lighthouse score ≥ 80 (performance)
