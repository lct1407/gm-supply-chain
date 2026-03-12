# FDD — Functional Design Document
# GM Supply — Supply Chain Management System

> Version: 1.0 | Status: Draft | Last Updated: 2026-03-12

---

## 1. Kiến trúc Hệ thống

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENTS                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐    │
│  │ Desktop  │  │  Tablet  │  │ Mobile   │  │ External API │    │
│  │ Browser  │  │  Browser │  │ (future) │  │   Clients    │    │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └──────┬───────┘    │
└───────┼──────────────┼──────────────┼──────────────┼────────────┘
        │              │              │              │
        ▼              ▼              ▼              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     FRONTEND (Next.js 14)                        │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  App Router (SSR/SSG)                                    │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────┐ │    │
│  │  │  Pages   │ │  Layouts │ │Components│ │   Stores   │ │    │
│  │  └──────────┘ └──────────┘ └──────────┘ └────────────┘ │    │
│  │  ┌──────────────────────────────────────────────────────┐│    │
│  │  │  TanStack Query (Server State) + Zustand (UI State) ││    │
│  │  └──────────────────────────────────────────────────────┘│    │
│  └─────────────────────────────────────────────────────────┘    │
└────────────────────────────┬────────────────────────────────────┘
                             │ REST API (JSON)
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                     BACKEND (FastAPI)                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────────────┐ │
│  │API Routes│ │ Services │ │  Models  │ │   Celery Tasks     │ │
│  │  /api/v1 │ │ (Logic)  │ │(SQLAlch) │ │ (async jobs)       │ │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────────┬───────────┘ │
│       │            │            │                │              │
│  ┌────┴────────────┴────────────┴────────────────┴────────┐    │
│  │              Core (Auth, Config, Middleware)             │    │
│  └─────────────────────────────────────────────────────────┘    │
└───────┬──────────────┬──────────────┬──────────────┬────────────┘
        │              │              │              │
        ▼              ▼              ▼              ▼
┌──────────────┐┌──────────────┐┌──────────┐┌──────────────┐
│ PostgreSQL   ││    Redis     ││ClickHouse││  File Store  │
│ (Primary DB) ││(Cache+Queue) ││(Analytics)││  (Images)    │
└──────────────┘└──────────────┘└──────────┘└──────────────┘
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
│  │ created_by           │    │ order_item_id (FK)   │               │
│  │ approved_by          │    │ allocated_qty        │               │
│  │ approved_at          │    │ actual_qty           │               │
│  └──────────────────────┘    │ status               │               │
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
│  │ grade_original       │    │ is_active            │               │
│  │ grade_actual         │    │ last_login           │               │
│  │ is_rejected          │    └──────────────────────┘               │
│  │ reject_reason        │                                           │
│  │ photos (JSONB)       │    ┌──────────────────────┐               │
│  │ inspected_at         │    │  audit_logs           │               │
│  └──────────────────────┘    │──────────────────────│               │
│                              │ id                   │               │
│  ┌──────────────────────┐    │ user_id (FK)         │               │
│  │  allocation_rules     │    │ action               │               │
│  │──────────────────────│    │ entity_type          │               │
│  │ id                   │    │ entity_id            │               │
│  │ name                 │    │ old_values (JSONB)   │               │
│  │ product_id (FK)      │    │ new_values (JSONB)   │               │
│  │ weights (JSONB)      │    │ ip_address           │               │
│  │ constraints (JSONB)  │    │ created_at           │               │
│  │ is_active            │    └──────────────────────┘               │
│  └──────────────────────┘                                           │
└──────────────────────────────────────────────────────────────────────┘
```

### 2.2 Key Design Decisions

| Quyết định | Lý do |
|-----------|-------|
| UUID cho primary key | Distributed-safe, không expose sequence |
| Soft delete (deleted_at) | Audit trail, khôi phục được |
| JSONB cho checklist, photos, config | Flexible schema cho QC items, allocation rules |
| Separate allocation_plans vs allocations | Plan = tháng (duyệt 1 lần), Allocation = chi tiết per NCC-product |
| inventory_lots + movements | Lot tracking cho FEFO, movements cho audit |
| shrinkage_records riêng | Track hao hụt chi tiết từng chặng |

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
| Method | Path | Mô tả |
|--------|------|--------|
| POST | /auth/login | Đăng nhập, trả JWT |
| POST | /auth/refresh | Refresh token |
| POST | /auth/logout | Invalidate token |
| GET | /auth/me | Thông tin user hiện tại |

#### Suppliers (M1)
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

---

## 4. Frontend Architecture

### 4.1 Page Structure (App Router)

```
src/app/
├── (auth)/
│   ├── login/page.tsx
│   └── layout.tsx              # Auth layout (no sidebar)
├── (dashboard)/
│   ├── layout.tsx              # Main layout (sidebar + header)
│   ├── page.tsx                # Dashboard overview
│   ├── suppliers/
│   │   ├── page.tsx            # Supplier list
│   │   ├── new/page.tsx        # Create supplier
│   │   ├── [id]/page.tsx       # Supplier detail
│   │   └── [id]/edit/page.tsx  # Edit supplier
│   ├── orders/
│   │   ├── page.tsx            # Order list
│   │   ├── new/page.tsx
│   │   ├── import/page.tsx     # Excel import
│   │   └── [id]/page.tsx
│   ├── allocations/
│   │   ├── page.tsx            # Allocation plans list
│   │   ├── [id]/page.tsx       # Plan detail + allocations
│   │   └── rules/page.tsx      # Allocation rules config
│   ├── inventory/
│   │   ├── page.tsx            # Inventory overview
│   │   ├── lots/page.tsx       # Lot list
│   │   └── movements/page.tsx  # In/out history
│   ├── reports/
│   │   ├── page.tsx            # Report hub
│   │   ├── supply-demand/page.tsx
│   │   ├── supplier-perf/page.tsx
│   │   └── shrinkage/page.tsx
│   └── admin/
│       ├── users/page.tsx
│       ├── products/page.tsx
│       ├── config/page.tsx
│       └── audit-log/page.tsx
└── api/                        # Next.js API routes (BFF proxy if needed)
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
│   ├── sidebar.tsx        # Navigation sidebar
│   ├── header.tsx         # Top bar (user, notifications)
│   ├── breadcrumb.tsx
│   └── page-header.tsx    # Title + actions pattern
├── shared/
│   ├── data-table/        # Reusable data table with filter/sort/paginate
│   ├── stat-card.tsx      # Dashboard KPI card
│   ├── status-badge.tsx   # Order/allocation status badges
│   ├── file-upload.tsx    # Excel/image upload
│   ├── confirm-dialog.tsx
│   └── empty-state.tsx
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
│   ├── allocation-table.tsx    # Editable NCC × Product grid
│   ├── allocation-calendar.tsx # Daily view
│   ├── rule-config.tsx
│   └── what-if-panel.tsx
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

---

## 6. Security Design

| Layer | Mechanism |
|-------|----------|
| Authentication | JWT access token (30min) + refresh token (7 days) |
| Authorization | RBAC middleware checking role × resource × action |
| API Security | Rate limiting (Redis), CORS whitelist, input validation (Pydantic) |
| Data | Passwords: bcrypt, Sensitive fields: AES-256 |
| Audit | All CUD operations logged with user, timestamp, old/new values |
| File Upload | Virus scan, file type whitelist (jpg/png/xlsx/csv), size limit 10MB |
