# FDD — Functional Design Document
# GM Supply — Supply Chain Management System

> Version: 2.0 | Status: Draft | Last Updated: 2026-03-12

---

## 1. Kiến trúc Hệ thống

### 1.1 High-Level Architecture

```
┌──────────────────────────────────────────────────────────────────────────┐
│                            CLIENTS                                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐  ┌───────────────────┐    │
│  │  Admin   │  │ Supplier │  │   Tablet     │  │  External API     │    │
│  │  Portal  │  │  Portal  │  │   (Kho/QC)   │  │  (KiotViet, etc)  │    │
│  │ (Desktop)│  │(Desktop/ │  │              │  │                   │    │
│  │          │  │  Mobile) │  │              │  │                   │    │
│  └────┬─────┘  └────┬─────┘  └──────┬───────┘  └────────┬──────────┘    │
└───────┼──────────────┼───────────────┼───────────────────┼───────────────┘
        │              │               │                   │
        ▼              ▼               ▼                   ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                     FRONTEND (Next.js 14)                                 │
│  ┌────────────────────────────────────────────────────────────────┐      │
│  │  App Router (SSR/SSG)                                          │      │
│  │  ┌──────────────────┐  ┌──────────────────┐                   │      │
│  │  │  (admin)/         │  │  (supplier)/      │                   │      │
│  │  │  Admin Portal     │  │  Supplier Portal  │                   │      │
│  │  │  Pages & Layouts  │  │  Pages & Layouts  │                   │      │
│  │  └──────────────────┘  └──────────────────┘                   │      │
│  │  ┌──────────────────────────────────────────────────────────┐ │      │
│  │  │  Shared: Components, Hooks, Stores, i18n (Vi/En)         │ │      │
│  │  └──────────────────────────────────────────────────────────┘ │      │
│  │  ┌──────────────────────────────────────────────────────────┐ │      │
│  │  │  TanStack Query (Server State) + Zustand (UI State)      │ │      │
│  │  └──────────────────────────────────────────────────────────┘ │      │
│  └────────────────────────────────────────────────────────────────┘      │
└───────────────────────────┬──────────────────────────────────────────────┘
                            │ REST API (JSON)
                            ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                     BACKEND (FastAPI)                                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────────────┐          │
│  │API Routes│ │ Services │ │  Models  │ │   Celery Tasks     │          │
│  │  /api/v1 │ │ (Logic)  │ │(SQLAlch) │ │ (async jobs)       │          │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────────┬───────────┘          │
│       │            │            │                │                       │
│  ┌────┴────────────┴────────────┴────────────────┴──────────────────┐    │
│  │  Core (Auth, Config, Middleware, Portal Guard, KiotViet Client)   │    │
│  └──────────────────────────────────────────────────────────────────┘    │
└───────┬──────────────┬──────────────┬──────────────┬─────────────────────┘
        │              │              │              │
        ▼              ▼              ▼              ▼
┌──────────────┐┌──────────────┐┌──────────┐┌──────────────┐
│ PostgreSQL   ││    Redis     ││ClickHouse││  File Store  │
│ (Primary DB) ││(Cache+Queue) ││(Analytics)││  (Images)    │
└──────────────┘└──────────────┘└──────────┘└──────────────┘

        ▲ (External Integration)
        │
┌───────┴──────────┐
│    KiotViet API   │
│  (Webhook + REST) │
└──────────────────┘
```

### 1.2 Tech Stack Chi tiết

| Layer | Technology | Version | Lý do chọn |
|-------|-----------|---------|------------|
| **Frontend** | Next.js | 14.x | App Router, SSR, API routes cho BFF pattern |
| **UI Library** | shadcn/ui | latest | Accessible, customizable, Radix-based |
| **Styling** | Tailwind CSS | 3.x | Utility-first, responsive dễ |
| **Data Fetching** | TanStack Query | 5.x | Cache, retry, optimistic updates |
| **UI State** | Zustand | 4.x | Lightweight, simple API |
| **Forms** | React Hook Form + Zod | latest | Performance + type-safe validation |
| **Charts** | Recharts | 2.x | React-native, composable |
| **Tables** | TanStack Table | 8.x | Headless, sorting/filter/pagination |
| **Date** | date-fns | 3.x | Tree-shakable, immutable |
| **Excel** | SheetJS (xlsx) | latest | Import/export Excel |
| **i18n** | next-intl | latest | App Router compatible, server components support |
| **Backend** | FastAPI | 0.115.x | Async, auto-docs, type-safe |
| **ORM** | SQLAlchemy | 2.0.x | Async support, mature |
| **Migration** | Alembic | 1.14.x | Auto-generate migrations |
| **Auth** | python-jose | 3.3.x | JWT tokens |
| **Task Queue** | Celery | 5.4.x | Distributed tasks |
| **Database** | PostgreSQL | 16 | JSONB, full-text search, reliability |
| **Cache** | Redis | 7.x | Session, cache, Celery broker |
| **Analytics** | ClickHouse | latest | Columnar, fast aggregation |
| **Container** | Docker Compose | 2.x | Local dev + deployment |

---

## 2. Database Design

### 2.1 Entity Relationship Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│                          MASTER DATA                                  │
│                                                                      │
│  ┌─────────────┐    ┌─────────────────┐    ┌──────────────────┐     │
│  │  products    │    │ quality_grades  │    │  units           │     │
│  │─────────────│    │─────────────────│    │──────────────────│     │
│  │ id (UUID)   │    │ id              │    │ id               │     │
│  │ name        │    │ code (L1/L2/L3) │    │ name (kg/thùng)  │     │
│  │ category    │    │ name            │    │ conversion_rate  │     │
│  │ shelf_life  │    │ description     │    └──────────────────┘     │
│  │ shrinkage   │    └─────────────────┘                             │
│  │ temp_min/max│                                                     │
│  └──────┬──────┘                                                     │
└─────────┼────────────────────────────────────────────────────────────┘
          │
          │ 1:N
          ▼
┌──────────────────────────────────────────────────────────────────────┐
│                       SUPPLY SIDE                                     │
│                                                                      │
│  ┌─────────────────┐     ┌──────────────────────┐                   │
│  │   suppliers      │────<│  supplier_products    │                   │
│  │─────────────────│     │──────────────────────│                   │
│  │ id (UUID)       │     │ id                   │                   │
│  │ code (unique)   │     │ supplier_id (FK)     │                   │
│  │ name            │     │ product_id (FK)      │                   │
│  │ address         │     │ quality_grade_id     │                   │
│  │ tax_code        │     │ max_capacity_monthly │                   │
│  │ contact_name    │     │ price                │                   │
│  │ contact_phone   │     │ price_effective_date │                   │
│  │ contact_email   │     │ lead_time_days       │                   │
│  │ farm_location   │     │ shrinkage_rate       │                   │
│  │ farm_area       │     └──────────────────────┘                   │
│  │ status          │                                                 │
│  │ started_at      │     ┌──────────────────────┐                   │
│  │ score           │────<│  supply_schedules     │                   │
│  │ rank (A/B/C/D)  │     │──────────────────────│                   │
│  └────────┬────────┘     │ id                   │                   │
│           │              │ supplier_id (FK)     │                   │
│           │              │ product_id (FK)      │                   │
│           │              │ period_start         │                   │
│           │              │ period_end           │                   │
│           │              │ planned_quantity     │                   │
│           │              │ committed_min        │                   │
│           │              │ committed_max        │                   │
│           │              └──────────────────────┘                   │
│           │                                                          │
│           │              ┌──────────────────────┐                   │
│           └─────────────<│  supplier_scores      │                   │
│                          │──────────────────────│                   │
│                          │ id                   │                   │
│                          │ supplier_id (FK)     │                   │
│                          │ period (month)       │                   │
│                          │ otd_score            │                   │
│                          │ fill_rate_score      │                   │
│                          │ quality_score        │                   │
│                          │ price_score          │                   │
│                          │ flexibility_score    │                   │
│                          │ total_score          │                   │
│                          │ rank                 │                   │
│                          └──────────────────────┘                   │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                       DEMAND SIDE                                     │
│                                                                      │
│  ┌─────────────────┐     ┌──────────────────────┐                   │
│  │   customers      │────<│     orders            │                   │
│  │─────────────────│     │──────────────────────│                   │
│  │ id (UUID)       │     │ id (UUID)            │                   │
│  │ code            │     │ code (unique)        │                   │
│  │ name            │     │ customer_id (FK)     │                   │
│  │ type            │     │ status               │                   │
│  │ priority_level  │     │ priority             │                   │
│  │ rsl_requirement │     │ ordered_at           │                   │
│  │ address         │     │ delivery_date        │                   │
│  │ contact_info    │     │ delivery_address     │                   │
│  └─────────────────┘     │ notes                │                   │
│                          │ source (manual/      │                   │
│                          │   excel/kiotviet)    │                   │
│                          │ external_id          │                   │
│                          │ created_by (FK)      │                   │
│                          └──────────┬───────────┘                   │
│                                     │ 1:N                           │
│                          ┌──────────▼───────────┐                   │
│                          │   order_items         │                   │
│                          │──────────────────────│                   │
│                          │ id                   │                   │
│                          │ order_id (FK)        │                   │
│                          │ product_id (FK)      │                   │
│                          │ quality_grade_id     │                   │
│                          │ quantity             │                   │
│                          │ unit_id              │                   │
│                          │ unit_price           │                   │
│                          └──────────────────────┘                   │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                     ALLOCATION & DELIVERY                             │
│                                                                      │
│  ┌──────────────────────┐    ┌──────────────────────┐               │
│  │  allocation_plans     │    │   allocations         │               │
│  │──────────────────────│───<│──────────────────────│               │
│  │ id (UUID)            │    │ id (UUID)            │               │
│  │ period (month)       │    │ plan_id (FK)         │               │
│  │ status (draft/       │    │ supplier_id (FK)     │               │
│  │   approved/active)   │    │ product_id (FK)      │               │
│  │ negotiation_deadline │    │ order_item_id (FK)   │               │
│  │ created_by           │    │ allocated_qty        │               │
│  │ approved_by          │    │ actual_qty           │               │
│  │ approved_at          │    │ status               │               │
│  └──────────────────────┘    │ negotiation_status   │               │
│                              │ locked               │               │
│                              │ lock_reason          │               │
│                              └──────────┬───────────┘               │
│                                         │                           │
│  ┌──────────────────────┐    ┌──────────▼───────────┐               │
│  │  deliveries           │    │  reallocations        │               │
│  │──────────────────────│    │──────────────────────│               │
│  │ id (UUID)            │    │ id                   │               │
│  │ supplier_id (FK)     │    │ allocation_id (FK)   │               │
│  │ allocation_id (FK)   │    │ reason               │               │
│  │ delivery_date        │    │ old_supplier_id      │               │
│  │ ordered_qty          │    │ new_supplier_id      │               │
│  │ received_qty         │    │ old_qty              │               │
│  │ quality_grade_actual │    │ new_qty              │               │
│  │ temperature_log      │    │ status (proposed/    │               │
│  │ on_time              │    │   approved/rejected) │               │
│  │ notes                │    │ proposed_by          │               │
│  │ photos (JSONB)       │    │ approved_by          │               │
│  │ received_by          │    └──────────────────────┘               │
│  └──────────────────────┘                                           │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                       INVENTORY                                       │
│                                                                      │
│  ┌──────────────────────┐    ┌──────────────────────┐               │
│  │  inventory_lots       │    │  inventory_movements  │               │
│  │──────────────────────│───<│──────────────────────│               │
│  │ id (UUID)            │    │ id                   │               │
│  │ product_id (FK)      │    │ lot_id (FK)          │               │
│  │ supplier_id (FK)     │    │ type (IN/OUT/ADJ)    │               │
│  │ delivery_id (FK)     │    │ quantity             │               │
│  │ quality_grade        │    │ reason               │               │
│  │ quantity_initial     │    │ reference_id (FK)    │               │
│  │ quantity_remaining   │    │ performed_by         │               │
│  │ harvest_date         │    │ performed_at         │               │
│  │ received_date        │    └──────────────────────┘               │
│  │ expiry_date          │                                           │
│  │ lot_code             │    ┌──────────────────────┐               │
│  │ storage_zone         │    │  shrinkage_records    │               │
│  │ temperature          │    │──────────────────────│               │
│  │ status               │    │ id                   │               │
│  └──────────────────────┘    │ lot_id (FK)          │               │
│                              │ stage (transport/    │               │
│                              │   storage/delivery)  │               │
│                              │ expected_qty         │               │
│                              │ actual_qty           │               │
│                              │ shrinkage_qty        │               │
│                              │ shrinkage_pct        │               │
│                              │ cause                │               │
│                              │ recorded_at          │               │
│                              └──────────────────────┘               │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                       QC & SYSTEM                                     │
│                                                                      │
│  ┌──────────────────────┐    ┌──────────────────────┐               │
│  │  qc_inspections       │    │  users                │               │
│  │──────────────────────│    │──────────────────────│               │
│  │ id                   │    │ id (UUID)            │               │
│  │ delivery_id (FK)     │    │ email                │               │
│  │ inspector_id (FK)    │    │ hashed_password      │               │
│  │ checklist (JSONB)    │    │ full_name            │               │
│  │ overall_result       │    │ role                 │               │
│  │ grade_original       │    │ portal_type          │               │
│  │ grade_actual         │    │   (admin/supplier)   │               │
│  │ is_rejected          │    │ preferred_language   │               │
│  │ reject_reason        │    │   (vi/en)            │               │
│  │ photos (JSONB)       │    │ supplier_id (FK)     │               │
│  │ inspected_at         │    │ is_active            │               │
│  └──────────────────────┘    │ email_verified_at    │               │
│                              │ last_login           │               │
│  ┌──────────────────────┐    └──────────────────────┘               │
│  │  allocation_rules     │                                           │
│  │──────────────────────│    ┌──────────────────────┐               │
│  │ id                   │    │  audit_logs           │               │
│  │ name                 │    │──────────────────────│               │
│  │ product_id (FK)      │    │ id                   │               │
│  │ weights (JSONB)      │    │ user_id (FK)         │               │
│  │ constraints (JSONB)  │    │ action               │               │
│  │ is_active            │    │ entity_type          │               │
│  └──────────────────────┘    │ entity_id            │               │
│                              │ old_values (JSONB)   │               │
│                              │ new_values (JSONB)   │               │
│                              │ ip_address           │               │
│                              │ created_at           │               │
│                              └──────────────────────┘               │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                   SUPPLIER PORTAL & MESSAGING                         │
│                                                                      │
│  ┌──────────────────────┐    ┌──────────────────────┐               │
│  │  supplier_users       │    │supplier_registrations │               │
│  │──────────────────────│    │──────────────────────│               │
│  │ id (UUID)            │    │ id (UUID)            │               │
│  │ user_id (FK)         │    │ business_name        │               │
│  │ supplier_id (FK)     │    │ tax_code             │               │
│  │ role (owner/staff)   │    │ contact_name         │               │
│  │ created_at           │    │ contact_email        │               │
│  │ updated_at           │    │ contact_phone        │               │
│  │ deleted_at           │    │ farm_location        │               │
│  └──────────────────────┘    │ farm_area            │               │
│                              │ products (JSONB)     │               │
│  ┌──────────────────────┐    │   [{product, capacity,│               │
│  │  message_threads      │    │     quality}]        │               │
│  │──────────────────────│    │ documents (JSONB)    │               │
│  │ id (UUID)            │    │   [{type, url, name}]│               │
│  │ subject              │    │ status (pending/     │               │
│  │ entity_type          │    │   approved/rejected) │               │
│  │   (allocation/       │    │ reviewed_by (FK)     │               │
│  │    delivery/order/   │    │ reviewed_at          │               │
│  │    registration)     │    │ review_notes         │               │
│  │ entity_id            │    │ email_verified_at    │               │
│  │ supplier_id (FK)     │    │ created_at           │               │
│  │ status (open/closed) │    │ updated_at           │               │
│  │ created_by (FK)      │    │ deleted_at           │               │
│  │ created_at           │    └──────────────────────┘               │
│  │ updated_at           │                                           │
│  │ closed_at            │                                           │
│  │ deleted_at           │                                           │
│  └──────────┬───────────┘                                           │
│             │ 1:N                                                    │
│  ┌──────────▼───────────┐                                           │
│  │  messages             │                                           │
│  │──────────────────────│                                           │
│  │ id (UUID)            │                                           │
│  │ thread_id (FK)       │                                           │
│  │ sender_id (FK)       │                                           │
│  │ body                 │                                           │
│  │ attachments (JSONB)  │                                           │
│  │   [{url, name, size, │                                           │
│  │     content_type}]   │                                           │
│  │ reply_to_id (FK)     │                                           │
│  │ read_at              │                                           │
│  │ created_at           │                                           │
│  │ deleted_at           │                                           │
│  └──────────────────────┘                                           │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                   NEGOTIATION & KIOTVIET                               │
│                                                                      │
│  ┌──────────────────────┐    ┌──────────────────────┐               │
│  │allocation_negotiations│    │  kiotviet_sync_logs   │               │
│  │──────────────────────│    │──────────────────────│               │
│  │ id (UUID)            │    │ id (UUID)            │               │
│  │ allocation_id (FK)   │    │ sync_type (webhook/  │               │
│  │ round                │    │   manual/scheduled)  │               │
│  │   (1/2/3)            │    │ kiotviet_order_id    │               │
│  │ proposed_qty         │    │ status (success/     │               │
│  │ counter_qty          │    │   failed/duplicate)  │               │
│  │ counter_reason       │    │ request_payload      │               │
│  │ status (proposed/    │    │   (JSONB)            │               │
│  │   counter_proposed/  │    │ response_payload     │               │
│  │   revised/agreed/    │    │   (JSONB)            │               │
│  │   rejected/          │    │ error_message        │               │
│  │   escalated)         │    │ order_id (FK)        │               │
│  │ proposed_by (FK)     │    │ processed_at         │               │
│  │ responded_by (FK)    │    │ created_at           │               │
│  │ deadline             │    │ deleted_at           │               │
│  │ created_at           │    └──────────────────────┘               │
│  │ updated_at           │                                           │
│  │ deleted_at           │    ┌──────────────────────┐               │
│  └──────────────────────┘    │kiotviet_product_     │               │
│                              │  mappings             │               │
│                              │──────────────────────│               │
│                              │ id (UUID)            │               │
│                              │ kiotviet_product_id  │               │
│                              │ kiotviet_product_name│               │
│                              │ product_id (FK)      │               │
│                              │ quality_grade_id (FK)│               │
│                              │ is_active            │               │
│                              │ created_at           │               │
│                              │ updated_at           │               │
│                              │ deleted_at           │               │
│                              └──────────────────────┘               │
└──────────────────────────────────────────────────────────────────────┘
```

### 2.2 Additional Tables: Supply Schedule & Daily Allocation

```
┌──────────────────────────────────────────────────────────────────────┐
│                  SUPPLY CAPACITY & SCHEDULE                            │
│                                                                      │
│  ┌──────────────────────────┐    ┌──────────────────────────┐       │
│  │  supplier_capacities      │    │  supply_daily_schedules   │       │
│  │──────────────────────────│    │──────────────────────────│       │
│  │ id (UUID)                │    │ id (UUID)                │       │
│  │ supplier_id (FK)         │    │ supplier_id (FK)         │       │
│  │ product_id (FK)          │    │ product_id (FK)          │       │
│  │ month (date, 1st of)    │    │ schedule_date (date)     │       │
│  │ peak_capacity_kg         │    │ planned_qty              │       │
│  │ normal_capacity_kg       │    │ confirmed_qty            │       │
│  │ min_order_qty            │    │ actual_qty               │       │
│  │ seasonal_factor          │    │ status (planned/         │       │
│  │   (default 1.0)          │    │   confirmed/delivered/   │       │
│  │ notes                    │    │   adjusted/cancelled)    │       │
│  │ updated_by (FK)          │    │ confirmed_at             │       │
│  │ created_at / updated_at  │    │ notes                    │       │
│  │ deleted_at               │    │ created_at / updated_at  │       │
│  └──────────────────────────┘    │ deleted_at               │       │
│                                  └──────────────────────────┘       │
│                                                                      │
│  ┌──────────────────────────┐    ┌──────────────────────────┐       │
│  │  supply_commitments       │    │  daily_allocations        │       │
│  │──────────────────────────│    │──────────────────────────│       │
│  │ id (UUID)                │    │ id (UUID)                │       │
│  │ supplier_id (FK)         │    │ allocation_date (date)   │       │
│  │ product_id (FK)          │    │ order_item_id (FK)       │       │
│  │ month (date, 1st of)    │    │ supplier_id (FK)         │       │
│  │ commitment_type          │    │ product_id (FK)          │       │
│  │   (contract/verbal/      │    │ lot_id (FK, nullable)    │       │
│  │    self_declared)         │    │ allocated_qty            │       │
│  │ committed_min_qty        │    │ actual_delivered_qty     │       │
│  │ committed_max_qty        │    │ status (planned/         │       │
│  │ contract_id (FK,         │    │   confirmed/fulfilled/   │       │
│  │   nullable)               │    │   shortage/surplus)      │       │
│  │ status (draft/confirmed/ │    │ matched_by (auto/manual) │       │
│  │   active/completed)       │    │ notes                    │       │
│  │ fulfillment_qty          │    │ created_by (FK)          │       │
│  │   (actual delivered)      │    │ created_at / updated_at  │       │
│  │ fulfillment_pct          │    │ deleted_at               │       │
│  │ created_at / updated_at  │    └──────────────────────────┘       │
│  │ deleted_at               │                                       │
│  └──────────────────────────┘                                       │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│               KIOTVIET EXTENDED SYNC                                   │
│                                                                      │
│  ┌──────────────────────────┐    ┌──────────────────────────┐       │
│  │  kiotviet_customers       │    │  kiotviet_price_books     │       │
│  │──────────────────────────│    │──────────────────────────│       │
│  │ id (UUID)                │    │ id (UUID)                │       │
│  │ kiotviet_id (int,unique) │    │ kiotviet_id (int,unique) │       │
│  │ code                     │    │ name                     │       │
│  │ name                     │    │ is_active                │       │
│  │ type (0=individual,      │    │ start_date               │       │
│  │   1=organization)        │    │ end_date                 │       │
│  │ groups (text)            │    │ customer_id (FK,         │       │
│  │   -- "Khach HRC" etc     │    │   nullable)              │       │
│  │ customer_id (FK,         │    │ customer_group_id (FK,   │       │
│  │   nullable) -- internal  │    │   nullable)              │       │
│  │ organization             │    │ last_synced_at           │       │
│  │ contact_number           │    │ created_at / updated_at  │       │
│  │ address                  │    │ deleted_at               │       │
│  │ debt                     │    └──────────────────────────┘       │
│  │ total_invoiced           │                                       │
│  │ total_revenue            │    ┌──────────────────────────┐       │
│  │ last_synced_at           │    │  kiotviet_purchase_orders │       │
│  │ created_at / updated_at  │    │──────────────────────────│       │
│  │ deleted_at               │    │ id (UUID)                │       │
│  └──────────────────────────┘    │ kiotviet_id (int,unique) │       │
│                                  │ code                     │       │
│  ┌──────────────────────────┐    │ purchase_date            │       │
│  │  kiotviet_supplier_      │    │ supplier_id (FK)         │       │
│  │    mappings               │    │ kiotviet_supplier_id     │       │
│  │──────────────────────────│    │ total                    │       │
│  │ id (UUID)                │    │ status                   │       │
│  │ kiotviet_supplier_id     │    │ details (JSONB)          │       │
│  │ kiotviet_supplier_name   │    │   [{productId, qty,      │       │
│  │ supplier_id (FK)         │    │     price, discount}]    │       │
│  │ is_active                │    │ last_synced_at           │       │
│  │ created_at / updated_at  │    │ created_at / updated_at  │       │
│  │ deleted_at               │    │ deleted_at               │       │
│  └──────────────────────────┘    └──────────────────────────┘       │
│                                                                      │
│  ┌──────────────────────────┐                                       │
│  │  customer_groups          │                                       │
│  │──────────────────────────│                                       │
│  │ id (UUID)                │                                       │
│  │ name                     │                                       │
│  │ code                     │                                       │
│  │ priority_level (1-5)     │                                       │
│  │ rsl_min_pct (0-100)      │                                       │
│  │ lead_time_days           │                                       │
│  │ pricing_tier             │                                       │
│  │ kiotviet_group_name      │ -- mapped from KiotViet "groups"      │
│  │ description              │                                       │
│  │ created_at / updated_at  │                                       │
│  │ deleted_at               │                                       │
│  └──────────────────────────┘                                       │
└──────────────────────────────────────────────────────────────────────┘
```

### 2.3 Key Design Decisions

| Quyết định | Lý do |
|-----------|-------|
| UUID cho primary key | Distributed-safe, không expose sequence |
| Soft delete (deleted_at) | Audit trail, khôi phục được |
| JSONB cho checklist, photos, config | Flexible schema cho QC items, allocation rules |
| Separate allocation_plans vs allocations | Plan = tháng (duyệt 1 lần), Allocation = chi tiết per NCC-product |
| inventory_lots + movements | Lot tracking cho FEFO, movements cho audit |
| shrinkage_records riêng | Track hao hụt chi tiết từng chặng |
| Single Next.js app, dual route groups | `(admin)/` + `(supplier)/` chia sẻ components, deploy đơn giản hơn 2 apps |
| supplier_users bridge table | 1 user có thể link nhiều supplier (future), 1 supplier có nhiều users (owner + staff) |
| messages + message_threads | Thread-based messaging liên kết entity, dễ track conversation history |
| allocation_negotiations per round | Mỗi round 1 record, max 3 rounds, state machine rõ ràng |
| KiotViet sync logs riêng | Dedup bằng kiotviet_order_id, debug dễ, retry tracking |
| **supplier_capacities** separate from supplier_products | Capacity thay đổi theo tháng/mùa, cần history riêng. supplier_products giữ thông tin tĩnh (giá, lead time) |
| **supply_daily_schedules** per day per NCC per product | Granularity ngày quan trọng với nấm tươi. Status flow: planned → confirmed → delivered cho tracking chặt |
| **supply_commitments** với commitment_type | Phân biệt binding (hợp đồng) vs soft (verbal) commitments. Track fulfillment_pct cho scoring |
| **daily_allocations** separate from monthly allocations | Daily = operational matching (order → NCC → lot). Monthly = strategic planning. Cần flexibility khác nhau |
| **customer_groups** with RSL & priority | Mỗi nhóm KH (HRC, Siêu thị, Retail) có RSL requirement và priority khác nhau → ảnh hưởng allocation logic |
| **kiotviet_customers** mirror table | Lưu raw KiotViet data, link soft tới internal customers. Cho phép reconciliation & sync conflict resolution |
| **kiotviet_purchase_orders** với details JSONB | PO details flexible, dùng cho reconciliation với delivery. JSONB vì structure có thể thay đổi theo KiotViet API |

### 2.4 New/Updated Tables Summary

| Table | Status | Purpose |
|-------|--------|---------|
| `users` | **Updated** | Added: `portal_type`, `preferred_language`, `supplier_id`, `email_verified_at` |
| `orders` | **Updated** | Added: `source` (manual/excel/kiotviet/shopee), `external_id`, `sale_channel` |
| `customers` | **Updated** | Added: `customer_group_id (FK)`, `kiotviet_customer_id` |
| `allocation_plans` | **Updated** | Added: `negotiation_deadline` |
| `allocations` | **Updated** | Added: `negotiation_status` |
| `supplier_capacities` | **New** | Monthly capacity per NCC × product, seasonal factor |
| `supply_daily_schedules` | **New** | Daily supply schedule per NCC × product, with confirmation flow |
| `supply_commitments` | **New** | Monthly commitment (contract/verbal) per NCC × product |
| `daily_allocations` | **New** | Daily operational matching: order → NCC → lot |
| `customer_groups` | **New** | Customer groups with RSL, priority, pricing rules |
| `supplier_users` | **New** | Links users to suppliers (owner/staff roles) |
| `supplier_registrations` | **New** | Self-registration requests with documents (JSONB) |
| `messages` | **New** | Cross-portal messages with attachments |
| `message_threads` | **New** | Conversation threads linked to entities |
| `allocation_negotiations` | **New** | Negotiation rounds with state machine |
| `kiotviet_sync_logs` | **New** | Sync tracking (webhook/manual/scheduled) |
| `kiotviet_product_mappings` | **New** | KiotViet product ↔ internal product mapping (multi-unit support) |
| `kiotviet_customers` | **New** | KiotViet customer mirror with group mapping |
| `kiotviet_price_books` | **New** | KiotViet per-customer pricing sync |
| `kiotviet_supplier_mappings` | **New** | KiotViet supplier ↔ internal NCC mapping |
| `kiotviet_purchase_orders` | **New** | KiotViet PO data for delivery reconciliation |

---

## 3. API Design

### 3.1 API Convention

```
Base URL: /api/v1

Response format:
{
  "data": { ... } | [ ... ],
  "meta": {
    "total": 100,
    "page": 1,
    "per_page": 20,
    "total_pages": 5
  },
  "errors": null
}

Error format:
{
  "data": null,
  "meta": null,
  "errors": [
    {
      "code": "VALIDATION_ERROR",
      "field": "email",
      "message": "Email không hợp lệ"
    }
  ]
}
```

### 3.2 API Endpoints

#### Auth
| Method | Path | Mô tả | Portal |
|--------|------|--------|--------|
| POST | /auth/login | Đăng nhập, trả JWT (tự detect portal_type) | Both |
| POST | /auth/refresh | Refresh token | Both |
| POST | /auth/logout | Invalidate token | Both |
| GET | /auth/me | Thông tin user hiện tại | Both |
| POST | /auth/register | NCC self-registration (tạo supplier_registrations) | Public |
| POST | /auth/verify-email | Xác minh email bằng token | Public |
| POST | /auth/forgot-password | Gửi email reset password | Public |
| POST | /auth/reset-password | Reset password bằng token | Public |

#### Suppliers (M1) — Admin Portal
| Method | Path | Mô tả |
|--------|------|--------|
| GET | /suppliers | Danh sách NCC (filter, sort, paginate) |
| POST | /suppliers | Tạo NCC |
| GET | /suppliers/:id | Chi tiết NCC |
| PUT | /suppliers/:id | Cập nhật NCC |
| DELETE | /suppliers/:id | Soft delete NCC |
| GET | /suppliers/:id/products | Sản phẩm của NCC |
| POST | /suppliers/:id/products | Gán sản phẩm cho NCC |
| GET | /suppliers/:id/scores | Lịch sử điểm NCC |
| GET | /suppliers/:id/deliveries | Lịch sử giao hàng |
| POST | /suppliers/import | Import NCC từ Excel |

#### Products (Master Data)
| Method | Path | Mô tả |
|--------|------|--------|
| GET | /products | Danh mục nấm |
| POST | /products | Tạo loại nấm |
| PUT | /products/:id | Cập nhật |
| GET | /products/:id/suppliers | NCC cung cấp loại nấm này |

#### Orders (M2)
| Method | Path | Mô tả |
|--------|------|--------|
| GET | /orders | Danh sách đơn hàng |
| POST | /orders | Tạo đơn hàng |
| GET | /orders/:id | Chi tiết đơn hàng |
| PUT | /orders/:id | Cập nhật |
| PATCH | /orders/:id/status | Chuyển trạng thái |
| POST | /orders/import | Import từ Excel |
| GET | /orders/summary | Tổng hợp nhu cầu |

#### Customers (M2)
| Method | Path | Mô tả |
|--------|------|--------|
| GET | /customers | Danh sách khách hàng |
| POST | /customers | Tạo KH |
| GET | /customers/:id | Chi tiết |
| GET | /customers/:id/orders | Đơn hàng của KH |

#### Allocations (M3)
| Method | Path | Mô tả |
|--------|------|--------|
| GET | /allocation-plans | Danh sách kế hoạch phân bổ |
| POST | /allocation-plans | Tạo kế hoạch phân bổ tháng |
| POST | /allocation-plans/:id/generate | Chạy thuật toán phân bổ |
| GET | /allocation-plans/:id/allocations | Chi tiết phân bổ |
| PUT | /allocation-plans/:id/allocations/:allocId | Điều chỉnh thủ công |
| PATCH | /allocation-plans/:id/approve | Duyệt kế hoạch |
| POST | /allocation-plans/:id/lock | Khóa phân bổ |
| POST | /allocation-plans/:id/send-to-suppliers | Gửi phân bổ cho NCC thương lượng |
| GET | /allocation-plans/:id/negotiations | Danh sách negotiations của plan |

#### Deliveries (M1.4)
| Method | Path | Mô tả |
|--------|------|--------|
| GET | /deliveries | Danh sách phiếu giao hàng |
| POST | /deliveries | Tạo phiếu nhận hàng |
| PUT | /deliveries/:id | Cập nhật |
| POST | /deliveries/:id/qc | Ghi nhận QC |
| POST | /deliveries/:id/photos | Upload ảnh |

#### Inventory (M5)
| Method | Path | Mô tả |
|--------|------|--------|
| GET | /inventory/lots | Tồn kho theo lot |
| GET | /inventory/summary | Tổng hợp tồn kho |
| GET | /inventory/expiring | Hàng sắp hết hạn |
| POST | /inventory/movements | Nhập/xuất/điều chỉnh |
| GET | /inventory/shrinkage | Báo cáo hao hụt |

#### Reports (M6)
| Method | Path | Mô tả |
|--------|------|--------|
| GET | /reports/dashboard | Dữ liệu dashboard |
| GET | /reports/supply-demand | Cung vs cầu |
| GET | /reports/supplier-performance | Hiệu suất NCC |
| GET | /reports/allocation | Báo cáo phân bổ |
| GET | /reports/inventory | Báo cáo tồn kho |
| GET | /reports/export/:type | Export Excel/PDF |

#### Admin (M7)
| Method | Path | Mô tả |
|--------|------|--------|
| GET | /users | Danh sách users |
| POST | /users | Tạo user |
| PUT | /users/:id | Cập nhật |
| GET | /audit-logs | Audit log |
| GET | /config/:key | Đọc cấu hình |
| PUT | /config/:key | Cập nhật cấu hình |

#### Admin — Registrations (M16)
| Method | Path | Mô tả |
|--------|------|--------|
| GET | /admin/registrations | Danh sách đăng ký NCC chờ duyệt (filter: status, date) |
| GET | /admin/registrations/:id | Chi tiết đăng ký (thông tin + documents) |
| PATCH | /admin/registrations/:id/approve | Duyệt đăng ký → tạo supplier + user |
| PATCH | /admin/registrations/:id/reject | Từ chối đăng ký (kèm lý do) |

#### Supplier Portal (~13 endpoints)
| Method | Path | Mô tả |
|--------|------|--------|
| GET | /supplier/dashboard | NCC dashboard: KPIs, upcoming, unread |
| GET | /supplier/profile | Thông tin NCC hiện tại |
| PUT | /supplier/profile | NCC tự cập nhật profile |
| GET | /supplier/allocations | Phân bổ cho NCC này |
| GET | /supplier/allocations/:id | Chi tiết phân bổ |
| POST | /supplier/allocations/:id/respond | Đồng ý / Counter-propose |
| GET | /supplier/schedules | Lịch thu hoạch |
| POST | /supplier/schedules | Tạo/cập nhật lịch thu hoạch |
| GET | /supplier/deliveries | Lịch sử giao hàng |
| PATCH | /supplier/deliveries/:id/confirm | Xác nhận đã giao |
| GET | /supplier/scores | Điểm & xếp hạng |
| GET | /supplier/messages | Danh sách threads |
| POST | /supplier/messages | Gửi tin nhắn mới |

#### Messaging (M15)
| Method | Path | Mô tả |
|--------|------|--------|
| GET | /messages/threads | Danh sách threads (filter: supplier, entity_type, status) |
| POST | /messages/threads | Tạo thread mới |
| GET | /messages/threads/:id | Chi tiết thread + messages |
| POST | /messages/threads/:id/reply | Reply trong thread |
| PATCH | /messages/threads/:id/close | Đóng thread |

#### KiotViet Integration (M2.1.5)
| Method | Path | Mô tả |
|--------|------|--------|
| POST | /integrations/kiotviet/webhook | Webhook receiver (HMAC validated) |
| GET | /integrations/kiotviet/sync-status | Trạng thái đồng bộ (last sync, errors) |
| POST | /integrations/kiotviet/sync | Trigger manual sync |
| GET | /integrations/kiotviet/mappings | Product mappings list |
| PUT | /integrations/kiotviet/mappings/:id | Cập nhật mapping |

---

## 4. Frontend Architecture

### 4.1 Page Structure (App Router)

```
src/app/
├── (auth)/
│   ├── login/page.tsx             # Shared login (detect portal by role)
│   ├── register/page.tsx          # NCC self-registration (multi-step)
│   ├── verify-email/page.tsx      # Email verification
│   ├── forgot-password/page.tsx
│   └── layout.tsx                 # Auth layout (no sidebar)
├── (admin)/
│   ├── layout.tsx                 # Admin layout (sidebar + header)
│   ├── page.tsx                   # Admin Dashboard overview
│   ├── suppliers/
│   │   ├── page.tsx               # Supplier list
│   │   ├── new/page.tsx           # Create supplier
│   │   ├── [id]/page.tsx          # Supplier detail
│   │   └── [id]/edit/page.tsx     # Edit supplier
│   ├── orders/
│   │   ├── page.tsx               # Order list
│   │   ├── new/page.tsx
│   │   ├── import/page.tsx        # Excel import
│   │   └── [id]/page.tsx
│   ├── allocations/
│   │   ├── page.tsx               # Allocation plans list
│   │   ├── [id]/page.tsx          # Plan detail + allocations
│   │   ├── negotiations/page.tsx  # Negotiation management dashboard
│   │   └── rules/page.tsx         # Allocation rules config
│   ├── inventory/
│   │   ├── page.tsx               # Inventory overview
│   │   ├── lots/page.tsx          # Lot list
│   │   └── movements/page.tsx     # In/out history
│   ├── reports/
│   │   ├── page.tsx               # Report hub
│   │   ├── supply-demand/page.tsx
│   │   ├── supplier-perf/page.tsx
│   │   └── shrinkage/page.tsx
│   ├── messages/
│   │   ├── page.tsx               # All message threads
│   │   └── [threadId]/page.tsx    # Thread detail
│   ├── registrations/
│   │   ├── page.tsx               # Registration review queue
│   │   └── [id]/page.tsx          # Registration detail (approve/reject)
│   ├── integrations/
│   │   └── kiotviet/page.tsx      # KiotViet sync dashboard + mappings
│   └── admin/
│       ├── users/page.tsx
│       ├── products/page.tsx
│       ├── config/page.tsx
│       └── audit-log/page.tsx
├── (supplier)/
│   ├── layout.tsx                 # Supplier layout (top nav, simpler, i18n)
│   ├── page.tsx                   # NCC Dashboard
│   ├── profile/page.tsx           # NCC profile edit
│   ├── allocations/
│   │   ├── page.tsx               # My allocations list
│   │   └── [id]/page.tsx          # Allocation detail + negotiate
│   ├── schedule/page.tsx          # Harvest schedule (calendar)
│   ├── deliveries/
│   │   ├── page.tsx               # Delivery list
│   │   └── [id]/page.tsx          # Delivery detail + QC results
│   ├── scores/page.tsx            # Performance & score dashboard
│   └── messages/
│       ├── page.tsx               # Message threads
│       └── [threadId]/page.tsx    # Thread detail
├── i18n/
│   ├── vi.json                    # Vietnamese translations
│   └── en.json                    # English translations
└── api/                           # Next.js API routes (BFF proxy if needed)
```

### 4.2 Component Architecture

```
src/components/
├── ui/                    # shadcn/ui primitives (auto-generated)
│   ├── button.tsx
│   ├── input.tsx
│   ├── dialog.tsx
│   ├── data-table.tsx     # TanStack Table wrapper
│   ├── date-picker.tsx
│   └── ...
├── layout/
│   ├── admin-sidebar.tsx  # Admin navigation sidebar
│   ├── supplier-topnav.tsx # Supplier top navigation bar
│   ├── header.tsx         # Top bar (user, notifications, language)
│   ├── breadcrumb.tsx
│   ├── page-header.tsx    # Title + actions pattern
│   └── language-switcher.tsx # Vi/En toggle
├── shared/
│   ├── data-table/        # Reusable data table with filter/sort/paginate
│   ├── stat-card.tsx      # Dashboard KPI card
│   ├── status-badge.tsx   # Order/allocation status badges
│   ├── file-upload.tsx    # Excel/image/document upload
│   ├── confirm-dialog.tsx
│   ├── empty-state.tsx
│   ├── timeline.tsx       # Negotiation / thread timeline
│   └── portal-guard.tsx   # Route protection by portal type
├── suppliers/
│   ├── supplier-form.tsx
│   ├── supplier-card.tsx
│   ├── score-chart.tsx
│   └── product-matrix.tsx
├── orders/
│   ├── order-form.tsx
│   ├── order-status-flow.tsx
│   ├── excel-import-wizard.tsx
│   └── demand-summary-chart.tsx
├── allocations/
│   ├── allocation-table.tsx       # Editable NCC × Product grid
│   ├── allocation-calendar.tsx    # Daily view
│   ├── rule-config.tsx
│   └── what-if-panel.tsx
├── negotiation/
│   ├── negotiation-card.tsx       # Single negotiation display
│   ├── negotiation-timeline.tsx   # Round history
│   ├── counter-propose-form.tsx   # NCC counter-propose form
│   └── negotiation-table.tsx      # Admin: all negotiations overview
├── messaging/
│   ├── thread-list.tsx            # Thread list with search/filter
│   ├── message-detail.tsx         # Thread messages view
│   ├── compose-message.tsx        # New message / reply form
│   └── message-templates.tsx      # Template selection
├── supplier-portal/
│   ├── ncc-dashboard.tsx          # Supplier dashboard components
│   ├── registration-form.tsx      # Multi-step registration
│   ├── registration-status.tsx    # Registration status tracker
│   ├── harvest-calendar.tsx       # Schedule input calendar
│   ├── delivery-list.tsx          # Supplier delivery view
│   ├── score-radar.tsx            # Performance radar chart
│   └── allocation-response.tsx    # Accept/counter-propose UI
├── registrations/
│   ├── registration-queue.tsx     # Admin: registration review queue
│   └── registration-detail.tsx    # Admin: expandable registration detail
├── integrations/
│   ├── kiotviet-dashboard.tsx     # Sync status, logs
│   └── product-mapping-table.tsx  # KiotViet ↔ internal mapping
├── inventory/
│   ├── lot-table.tsx
│   ├── expiry-alert.tsx
│   ├── fefo-suggest.tsx
│   └── shrinkage-chart.tsx
└── charts/
    ├── supply-demand-chart.tsx
    ├── supplier-rank-chart.tsx
    └── trend-line.tsx
```

---

## 5. Key Algorithms

### 5.1 Monthly Allocation Algorithm

```
Input:
  - demand[product] = tổng nhu cầu tháng theo loại nấm
  - suppliers[] = danh sách NCC active, mỗi NCC có:
    - capacity[product] = công suất tối đa
    - commitment[product] = cam kết hợp đồng
    - score = điểm tổng hợp (0-100)
    - shrinkage_rate[product] = tỷ lệ hao hụt trung bình

Algorithm:
  1. BUFFER: demand_with_buffer[p] = demand[p] × (1 + avg_shrinkage[p])

  2. COMMITMENT FIRST:
     for each supplier with commitment:
       allocate min(commitment[p], capacity[p])
       remaining_demand[p] -= allocated
       remaining_capacity[p] -= allocated

  3. SCORE-BASED ALLOCATION:
     sort suppliers by score DESC
     for each product with remaining_demand > 0:
       total_score = sum(score for suppliers with remaining_capacity)
       for each supplier (sorted by score):
         share = (supplier.score / total_score) × remaining_demand[p]
         allocate min(share, remaining_capacity[p])

  4. DIVERSIFICATION CHECK:
     for each product:
       if any supplier has > 40% of total allocation:
         redistribute excess to next-best suppliers

  5. OUTPUT: allocation[supplier][product] = quantity
```

### 5.2 FEFO Algorithm

```
Input:
  - order_item: product, quantity, customer_rsl_requirement
  - lots[]: available lots sorted by expiry_date ASC

Algorithm:
  remaining = order_item.quantity
  selected_lots = []

  for each lot in lots (earliest expiry first):
    if lot.product != order_item.product: continue

    rsl = (lot.expiry_date - today) / lot.product.shelf_life
    if rsl < customer_rsl_requirement: skip (too close to expiry)

    take = min(remaining, lot.quantity_remaining)
    selected_lots.append({ lot, take })
    remaining -= take

    if remaining <= 0: break

  if remaining > 0: raise INSUFFICIENT_STOCK alert
  return selected_lots
```

### 5.3 Negotiation State Machine

```
States:
  - PROPOSED         # Admin gửi phân bổ cho NCC
  - COUNTER_PROPOSED # NCC đề xuất điều chỉnh
  - REVISED          # Admin gửi lại bản sửa
  - AGREED           # Cả 2 bên đồng ý (terminal)
  - REJECTED         # Admin từ chối counter (terminal)
  - ESCALATED        # Sau 3 rounds, escalate lên Director (terminal)

Transitions:
  PROPOSED → AGREED           # NCC chấp nhận ngay
  PROPOSED → COUNTER_PROPOSED # NCC counter-propose (round 1)

  COUNTER_PROPOSED → AGREED   # Admin chấp nhận counter
  COUNTER_PROPOSED → REJECTED # Admin từ chối
  COUNTER_PROPOSED → REVISED  # Admin sửa lại (round 2 begins)

  REVISED → AGREED            # NCC chấp nhận bản sửa
  REVISED → COUNTER_PROPOSED  # NCC counter lại (round 2/3)

  (any) → ESCALATED           # Round 3 không đồng ý → auto-escalate

Rules:
  - Max 3 rounds (configurable)
  - Deadline per round (default 48h, configurable)
  - Auto-escalate when: rounds > max OR deadline expired
  - Only NCC Owner can counter-propose (not NCC Staff)
  - Director can override: force AGREED or REJECTED
```

### 5.4 KiotViet Sync Algorithm

```
Webhook Flow:
  1. RECEIVE: POST /integrations/kiotviet/webhook
  2. VALIDATE: Verify HMAC-SHA256 signature (header: X-KiotViet-Signature)
     - If invalid → 401, log to kiotviet_sync_logs (status=failed)
  3. DEDUP: Check kiotviet_order_id in kiotviet_sync_logs
     - If exists with status=success → 200 OK (idempotent), log duplicate
  4. MAP PRODUCTS: For each line item:
     - Lookup kiotviet_product_mappings by kiotviet_product_id
     - If no mapping → log warning, skip item, flag for manual review
  5. CREATE ORDER:
     - Map KiotViet order → internal order (source='kiotviet', external_id=kv_order_id)
     - Set status = 'new'
  6. LOG: kiotviet_sync_logs (status=success, order_id=new_order_id)
  7. RESPOND: 200 OK

Manual Sync Flow:
  1. Admin triggers POST /integrations/kiotviet/sync
  2. Fetch orders from KiotViet REST API (date range filter)
  3. For each order: run steps 3-6 from webhook flow
  4. Return summary: created, skipped (duplicate), failed (unmapped)
```

---

## 6. Security Design

| Layer | Mechanism |
|-------|----------|
| Authentication | JWT access token (30min) + refresh token (7 days) |
| Authorization | RBAC middleware checking role × resource × action |
| Portal Isolation | Middleware checks `portal_type` on user → blocks cross-portal access. Supplier users only see own supplier's data (supplier_id filter on all queries) |
| Registration Security | Email verification required before account activation. Rate limit: max 5 registrations per IP per hour |
| KiotViet Security | HMAC-SHA256 signature validation on webhook. API key stored in environment variables, never in code |
| API Security | Rate limiting (Redis), CORS whitelist, input validation (Pydantic) |
| Data | Passwords: bcrypt, Sensitive fields: AES-256 |
| Audit | All CUD operations logged with user, timestamp, old/new values |
| File Upload | Virus scan, file type whitelist (jpg/png/pdf/xlsx/csv), size limit 10MB |
