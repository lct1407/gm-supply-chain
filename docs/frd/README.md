# FRD — Functional Requirements Document
# GM Supply — Supply Chain Management System

> Version: 2.0 | Status: Draft | Last Updated: 2026-03-12

---

## 1. Giới thiệu

### 1.1 Mục đích tài liệu
Tài liệu mô tả chi tiết các yêu cầu chức năng của hệ thống GM Supply — quản lý & phân bổ nguồn cung nấm tươi. Đây là tài liệu tham chiếu chính cho đội phát triển, QA, và stakeholders.

### 1.2 Phạm vi hệ thống
GM Supply quản lý toàn bộ chuỗi cung ứng nấm tươi thông qua **kiến trúc hai cổng (Dual-Portal)**:

**Admin Portal** — dành cho nhân viên Nham Xanh (Procurement, QC, Warehouse, Manager, Director):
- **Upstream**: Quản lý nhà cung cấp (NCC), duyệt đăng ký NCC mới, thu mua, kiểm tra chất lượng
- **Core**: Phân bổ chỉ tiêu, matching đơn hàng - NCC, tái phân bổ, quản lý thương lượng
- **Downstream**: Quản lý đơn hàng khách hàng, giao hàng, tồn kho
- **Integration**: Nhận đơn hàng từ KiotViet (webhook real-time + manual sync), quản lý mapping sản phẩm
- **Cross-cutting**: Báo cáo, dự báo, quản trị hệ thống, nhắn tin nội bộ

**Supplier Portal** — dành cho nhà cung cấp (NCC Owner, NCC Staff):
- Tự đăng ký tài khoản, cập nhật hồ sơ
- Xem chỉ tiêu phân bổ, phản hồi/thương lượng chỉ tiêu
- Nhập lịch thu hoạch, xác nhận giao hàng
- Xem điểm đánh giá, lịch sử giao hàng
- Nhắn tin với Nham Xanh
- Hỗ trợ song ngữ (Tiếng Việt / English)

### 1.3 Đặc thù ngành
| Yếu tố | Ảnh hưởng đến hệ thống |
|---------|----------------------|
| Shelf life ngắn (2-14 ngày) | FEFO bắt buộc, cảnh báo hết hạn real-time |
| Hao hụt cao (2-12%) | Buffer khi phân bổ, tracking từng chặng |
| Chuỗi lạnh (2-8°C) | Ghi nhận nhiệt độ, cảnh báo gián đoạn |
| Biến động mùa vụ | Hệ số điều chỉnh theo mùa, dự báo nhu cầu |
| Chất lượng không đồng nhất | QC đầu vào, phân loại lại, scoring NCC |

### 1.4 Thuật ngữ

| Thuật ngữ | Viết tắt | Định nghĩa |
|-----------|----------|------------|
| Nhà cung cấp | NCC | Đơn vị trồng/cung cấp nấm |
| Remaining Shelf Life | RSL | % thời hạn sử dụng còn lại khi giao cho khách |
| First Expired First Out | FEFO | Xuất hàng hết hạn trước, không phải nhập trước |
| Fill Rate | FR | Tỷ lệ đơn hàng được đáp ứng đầy đủ |
| Lead Time | LT | Thời gian từ đặt hàng đến nhận hàng |
| Landed Cost | LC | Giá vốn toàn phần (mua + vận chuyển + hao hụt) |
| Supplier Portal | SP | Cổng dành cho NCC truy cập hệ thống |
| Admin Portal | AP | Cổng dành cho nhân viên Nham Xanh |
| KiotViet | KV | Hệ thống bán hàng bên ngoài (POS), nguồn đơn hàng chính |
| Negotiation | - | Quy trình thương lượng chỉ tiêu phân bổ giữa NCC và Nham Xanh |
| Internationalization | i18n | Hỗ trợ đa ngôn ngữ (Tiếng Việt + English) |
| Self-Registration | - | NCC tự đăng ký tài khoản, chờ Admin duyệt |

---

## 2. Actors & Roles

### 2.1 Admin Portal Roles

| Role | Mô tả | Modules chính |
|------|--------|--------------|
| **Admin** | Quản trị hệ thống, cấu hình, phân quyền | M7 Administration |
| **Director** | Duyệt phân bổ lớn, xem báo cáo tổng hợp, mô phỏng, xử lý escalation | M3, M4, M6 |
| **Manager** | Quản lý phân bổ, duyệt điều chuyển, giám sát NCC, duyệt đăng ký NCC, quản lý thương lượng | M1-M6, M15, M16 |
| **Procurement Staff** | Thu thập đơn hàng, liên hệ NCC, xử lý phân bổ ngày, nhắn tin NCC | M1, M2, M3, M15 |
| **QC Staff** | Kiểm tra chất lượng đầu vào, phân loại, reject hàng | M8 QC |
| **Warehouse Staff** | Nhận hàng, quản lý tồn kho, xuất hàng FEFO | M5 Inventory |
| **Viewer** | Chỉ xem báo cáo, dashboard | M6 Reports |

### 2.2 Supplier Portal Roles

| Role | Mô tả | Permissions |
|------|--------|------------|
| **NCC Owner** | Chủ/đại diện NCC. Đăng ký tài khoản, quản lý toàn bộ thông tin NCC | Full access trên Supplier Portal: profile, allocations, negotiations, deliveries, schedules, scores, messages, quản lý NCC Staff |
| **NCC Staff** | Nhân viên NCC được Owner thêm vào | Xem allocations, nhập lịch thu hoạch, xác nhận giao hàng, nhắn tin. Không được thương lượng chỉ tiêu, không sửa profile NCC |

---

## 3. Yêu cầu chức năng theo Module

### M1: Supplier Management (Quản lý NCC)

#### M1.1 CRUD Nhà cung cấp
| ID | Yêu cầu | Priority | Acceptance Criteria |
|----|---------|----------|-------------------|
| M1.1.1 | Tạo mới NCC với đầy đủ thông tin: tên, mã, địa chỉ, MST, liên hệ, vùng trồng | P0 | Form validation, mã NCC unique, lưu thành công |
| M1.1.2 | Xem danh sách NCC với filter: trạng thái, vùng, loại nấm, xếp hạng | P0 | Pagination, search, sort đa cột |
| M1.1.3 | Cập nhật thông tin NCC | P0 | Audit log ghi nhận thay đổi |
| M1.1.4 | Soft-delete NCC (chuyển trạng thái Chấm dứt) | P0 | Không xóa vật lý, cảnh báo nếu có allocation đang active |
| M1.1.5 | Import danh sách NCC từ Excel | P1 | Template Excel download, validate trước khi import, báo lỗi từng dòng |
| M1.1.6 | **NCC tự đăng ký tài khoản (Self-Registration)**: NCC truy cập Supplier Portal, điền form đăng ký gồm: thông tin doanh nghiệp, giấy phép kinh doanh, vùng trồng, loại nấm, công suất. Upload tài liệu (GPKD, chứng nhận). Hệ thống gửi email xác minh (verify email). Admin/Manager review và approve/reject | P0 | Multi-step form, email verification, document upload (PDF/image), trạng thái: Pending → Approved/Rejected, notification cho cả 2 phía |
| M1.1.7 | **NCC tự cập nhật profile**: NCC Owner có thể sửa thông tin liên hệ, địa chỉ, vùng trồng, công suất trên Supplier Portal. Thay đổi quan trọng (MST, tên pháp lý) cần Admin approve | P1 | Phân biệt field tự sửa được vs cần duyệt, audit log, notification khi có thay đổi chờ duyệt |

#### M1.2 Danh mục sản phẩm theo NCC
| ID | Yêu cầu | Priority | Acceptance Criteria |
|----|---------|----------|-------------------|
| M1.2.1 | Gán loại nấm cho NCC với: chất lượng, giá, công suất, shelf life | P0 | 1 NCC có nhiều sản phẩm, mỗi SP có giá + công suất riêng |
| M1.2.2 | Cập nhật giá theo mùa/thời điểm | P1 | Lịch sử giá được lưu, hiệu lực theo ngày |
| M1.2.3 | Xem ma trận NCC × Sản phẩm | P1 | Bảng pivot: hàng = NCC, cột = loại nấm, giá trị = giá/công suất |

#### M1.3 Kế hoạch cung cấp & Năng lực NCC

> **Đây là phần cốt lõi của hệ thống phân bổ.** Năng lực cung ứng của NCC phải được theo dõi ở 3 cấp độ:
> - **Capacity (công suất tối đa)**: Khả năng sản xuất tối đa theo ngày/tuần/tháng
> - **Committed (cam kết)**: Số lượng đã cam kết với Nấm Xanh (qua hợp đồng hoặc xác nhận)
> - **Confirmed (đã xác nhận)**: NCC đã confirm sẽ giao (từ Supplier Portal)
> - **Available-to-Promise (ATP)**: Committed − Đã phân bổ = Còn có thể phân bổ thêm

| ID | Yêu cầu | Priority | Acceptance Criteria |
|----|---------|----------|-------------------|
| M1.3.1 | **Capacity Profile**: Đăng ký công suất tối đa theo NCC × sản phẩm × tháng. Bao gồm: peak capacity (mùa cao điểm), normal capacity, minimum order. Admin nhập khi onboard NCC hoặc NCC tự cập nhật trên Supplier Portal | P0 | Form nhập capacity per product per month, lịch sử thay đổi, NCC có thể self-update (cần approve nếu giảm >20%) |
| M1.3.2 | **Monthly Supply Commitment**: Bảng cam kết cung ứng tháng — NCC × sản phẩm × số lượng cam kết (min/max). Liên kết trực tiếp với hợp đồng (M10). Phân biệt rõ: cam kết hợp đồng (binding) vs cam kết miệng (soft) | P0 | Min/max per month per product, trạng thái: Draft → Confirmed → Active, liên kết contract_id, hiển thị % hoàn thành cam kết |
| M1.3.3 | **Daily Supply Schedule (Lịch cung ứng ngày)**: NCC nhập lịch giao hàng dự kiến theo ngày cho 1-4 tuần tới. Breakdown theo sản phẩm × ngày × số lượng dự kiến. Trạng thái mỗi dòng: Planned → Confirmed → Delivered → Adjusted | P0 | Calendar view (tuần/tháng), nhập SL theo ngày, bulk input (copy tuần trước), trạng thái per line item, deadline nhập (trước thứ 5 tuần trước) |
| M1.3.4 | **Supply Confirmation Flow**: Mỗi tuần, NCC phải confirm lịch giao tuần sau trên Supplier Portal. Admin gửi reminder tự động. NCC confirm = chuyển trạng thái Planned → Confirmed. Nếu không confirm trước deadline → cảnh báo Manager | P0 | Reminder email T+3 ngày trước deadline, trạng thái: Unconfirmed/Confirmed/Overdue, dashboard hiển thị % NCC đã confirm |
| M1.3.5 | **Available-to-Promise (ATP) Dashboard**: Bảng tổng hợp real-time: cho mỗi ngày × sản phẩm, hiển thị: Committed total, Confirmed total, Already Allocated, ATP remaining, Gap (nhu cầu − ATP). Highlight các ngày có gap > 0 (thiếu hụt) | P0 | Matrix view ngày × sản phẩm, color-coded (xanh: dư, vàng: vừa đủ, đỏ: thiếu), drill-down xem chi tiết per NCC, export Excel |
| M1.3.6 | **Seasonal Capacity Adjustment**: Hệ số điều chỉnh theo mùa vụ nấm. VD: Bào Ngư Xám capacity mùa đông ×1.3, mùa hè ×0.7. Admin cấu hình hệ số theo sản phẩm × tháng | P1 | Calendar config, auto-apply vào capacity calculation, cảnh báo khi actual khác seasonal pattern |
| M1.3.7 | Cảnh báo khi NCC chưa cập nhật lịch trình > 3 ngày so với deadline | P0 | Notification tự động (email + in-app), escalate lên Manager sau 2 lần reminder |
| M1.3.8 | **Supply vs Demand Gap Analysis**: So sánh nguồn cung dự kiến (committed + confirmed) vs nhu cầu (orders + forecast) theo ngày/tuần/tháng. Hiển thị gap, trend, và đề xuất hành động (tìm NCC bổ sung, điều chỉnh đơn hàng) | P1 | Stacked bar chart (supply vs demand per day), gap trend line, action suggestions, drill-down |

#### M1.4 Giao hàng & Đánh giá
| ID | Yêu cầu | Priority | Acceptance Criteria |
|----|---------|----------|-------------------|
| M1.4.1 | Tạo phiếu nhận hàng: NCC, loại nấm, SL đặt vs thực nhận, chất lượng | P0 | So sánh với PO, tính fill rate |
| M1.4.2 | Upload ảnh hàng nhận | P1 | Max 5 ảnh/phiếu, resize tự động |
| M1.4.3 | Đánh giá lần giao: đúng hẹn, đủ SL, chất lượng (1-5 sao) | P0 | Bắt buộc đánh giá khi confirm nhận hàng |

#### M1.5 Scoring NCC
| ID | Yêu cầu | Priority | Acceptance Criteria |
|----|---------|----------|-------------------|
| M1.5.1 | Tự động tính điểm NCC theo 5 tiêu chí (OTD 25%, FR 25%, Quality 30%, Price 10%, Flex 10%) | P1 | Rolling 3/6/12 tháng, cập nhật sau mỗi lần giao |
| M1.5.2 | Xếp hạng A/B/C/D tự động | P1 | A≥85, B=70-84, C=55-69, D<55 |
| M1.5.3 | Dashboard xu hướng điểm NCC theo thời gian | P2 | Line chart, so sánh nhiều NCC |

---

### M2: Demand & Order Management (Quản lý Nhu cầu)

#### M2.1 Quản lý đơn hàng
| ID | Yêu cầu | Priority | Acceptance Criteria |
|----|---------|----------|-------------------|
| M2.1.1 | Tạo đơn hàng: khách hàng, loại nấm, SL, ngày giao, địa chỉ, mức ưu tiên | P0 | Validate ngày giao ≥ today + lead time |
| M2.1.2 | Import đơn hàng từ Excel/CSV | P0 | Template download, validate, báo lỗi, preview trước import |
| M2.1.3 | Xem danh sách đơn hàng: filter theo trạng thái, khách hàng, ngày, sản phẩm, kênh bán (KiotViet/manual/Shopee) | P0 | Pagination, search, export, source indicator |
| M2.1.4 | Workflow đơn hàng: Mới → Đã phân bổ → Đang chuẩn bị → Đang giao → Hoàn thành / Hủy | P0 | State machine, không skip bước |
| M2.1.5 | **Tích hợp KiotViet** (xem chi tiết M2.4) | P0 | Xem M2.4 |

#### M2.2 Quản lý khách hàng

> **Dữ liệu thực tế từ KiotViet**: 27,555 khách hàng, phân thành 2 loại:
> - `type=0`: Khách cá nhân (retail, Shopee buyers)
> - `type=1`: Tổ chức (nhà hàng, siêu thị, đại lý)
> - Customer groups: "Khách HRC" (Hotels/Restaurants/Cafes), etc.
> - **194 bảng giá riêng** per customer (Pizza 4Ps, Kamereo, Ministop, Lotte, SAFCO, REDSUN, Finelife...)

| ID | Yêu cầu | Priority | Acceptance Criteria |
|----|---------|----------|-------------------|
| M2.2.1 | CRUD khách hàng: tên, loại, nhóm khách hàng, liên hệ, địa chỉ. Phân loại ảnh hưởng mức ưu tiên và RSL requirement | P0 | Phân loại: **B2B** (Siêu thị/Nhà hàng-HRC/Đại lý/Xuất khẩu) vs **B2C** (Shopee/Lẻ). Sync từ KiotViet |
| M2.2.2 | **Nhóm khách hàng (Customer Groups)**: Quản lý nhóm KH với quy tắc riêng: RSL tối thiểu, mức ưu tiên phân bổ, lead time, pricing tier. Mapping với groups trong KiotViet (string-based, vd: "Khách HRC") | P0 | CRUD groups, config RSL/priority/lead time per group, sync groups từ KiotViet |
| M2.2.3 | **RSL Requirements theo nhóm khách**: Siêu thị ≥70% RSL, HRC ≥50%, Đại lý ≥60%, Shopee/Lẻ ≥40%. Cảnh báo khi phân bổ lot có RSL thấp hơn yêu cầu | P0 | Config per group, validation khi tạo phiếu xuất, cảnh báo real-time |
| M2.2.4 | **Price Books (Bảng giá riêng)**: Mỗi khách hàng B2B có thể có bảng giá riêng. Sync từ KiotViet price books (194 bảng giá). Dùng để tính revenue, margin analysis | P1 | Sync price books từ KiotViet, hiển thị per customer, effective date range |
| M2.2.5 | Lịch sử mua hàng & phân tích xu hướng: theo tháng, theo sản phẩm, so sánh YoY | P2 | Chart, drill-down, export |
| M2.2.6 | **Demand Pattern Analysis**: Phân tích pattern đặt hàng theo nhóm KH. VD: HRC đặt T2-T7 (cao điểm T5-T6), Siêu thị đặt đều, Shopee spike cuối tuần. Dùng cho forecast & phân bổ ngày | P2 | Heatmap ngày trong tuần × nhóm KH, trend detection |

#### M2.3 Dự báo nhu cầu
| ID | Yêu cầu | Priority | Acceptance Criteria |
|----|---------|----------|-------------------|
| M2.3.1 | Forecast bằng Moving Average (4-12 tuần), có weighted option (gần hơn = trọng số cao hơn) | P2 | Chọn window, xem accuracy vs thực tế, MAPE metric |
| M2.3.2 | Điều chỉnh forecast theo mùa/sự kiện (Tết, lễ, mùa mưa) | P2 | Hệ số nhân, ghi chú lý do, recurring events |
| M2.3.3 | **Dashboard Cung-Cầu tổng hợp**: Một view thống nhất hiển thị 4 lớp data theo ngày/tuần/tháng: (1) Nhu cầu: đơn hàng confirmed + pending + forecast, (2) Nguồn cung: committed + confirmed + ATP, (3) Gap analysis: thiếu/dư per sản phẩm per ngày, (4) Actions: đề xuất điều chỉnh | P0 | Stacked bar/area chart, toggle layers, drill-down per product, export, alert khi gap > threshold |

#### M2.4 Tích hợp KiotViet (Chi tiết)

> **Dữ liệu thực tế từ KiotViet API**:
> - **Retailer**: "Nong Trai Nam Xanh" (ID: 1282123), branch: "Store Nam Xanh" (ID: 278336)
> - **589 sản phẩm** trong 10 danh mục (Nấm Tươi, Nấm Khô, Nấm Chế Biến, Bột Nấm, Nấm Dược Liệu, Phơi Nấm, Quà Tặng, Nguyên Vật Liệu/Hồ Sơ/Đóng gói & Bao bì)
> - **Multi-unit products**: VD "Bào Ngư Xám" có đơn vị gốc "Cái" (base) + đơn vị "Xấp 6 Cái" (conversionValue=6). Product variants với `masterProductId`
> - **28,201 orders** + **217,093 invoices** + **34,581 purchase orders**
> - **Kênh bán hàng**: Manual + **Shopee** (prefix `DHSPE_*` cho orders, `HDSPE_*` cho invoices)
> - **Order statuses**: 1=Phiếu tạm (draft), 4=Đã hủy
> - **Invoice = chứng từ bán chính** (có `orderId` link ngược về order)
> - **Purchase Orders = nhập hàng từ NCC**: có `supplierId`, `supplierName`, `purchaseOrderDetails[]`
> - **Chưa có batch/expiry tracking** trong KiotViet → GM Supply phải bù gap này
> - **0 webhook đã đăng ký** → cần register webhook khi setup

| ID | Yêu cầu | Priority | Acceptance Criteria |
|----|---------|----------|-------------------|
| M2.4.1 | **Webhook Registration**: Đăng ký webhook với KiotViet cho events: order.create, order.update, invoice.create, invoice.update, product.update. Validate bằng HMAC-SHA256 | P0 | Auto-register on setup, health check, re-register on failure |
| M2.4.2 | **Order Sync**: Nhận order từ KiotViet, dedup bằng `kiotviet_order_id`, map products (code → internal product). Xử lý cả manual orders và Shopee orders (detect by `SaleChannelName` hoặc code prefix `DHSPE_*`) | P0 | Dedup, product mapping, source tagging (manual/shopee), error log |
| M2.4.3 | **Invoice Sync**: Nhận invoices (chứng từ bán), link với order nếu có `orderId`. Invoice = confirmed sale. Dùng invoice data cho reporting (total, discount, payment) | P0 | Invoice-order linking, financial data sync |
| M2.4.4 | **Purchase Order Sync (Inbound)**: Sync purchase orders từ KiotViet — đây là dữ liệu nhập hàng từ NCC. Map `supplierId` → internal supplier. Dùng PO data để: verify delivery quantities, tính fill rate, reconcile | P0 | PO sync, supplier mapping, delivery reconciliation |
| M2.4.5 | **Product Mapping**: UI để map 589 sản phẩm KiotViet → sản phẩm nội bộ. Xử lý multi-unit: base unit + derived units (conversionValue). Auto-suggest mapping dựa trên tên/code. Bulk mapping | P0 | Mapping UI, auto-suggest, conversion handling, unmapped product alerts |
| M2.4.6 | **Customer & Price Book Sync**: Sync khách hàng + customer groups + 194 price books từ KiotViet. Dùng cho customer management và pricing analysis | P1 | Customer sync, group mapping, price book import |
| M2.4.7 | **Supplier Sync**: Sync 193 suppliers từ KiotViet. Auto-match với NCC đã có trong hệ thống (by code/name). Dùng cho PO reconciliation | P1 | Supplier sync, auto-match, conflict resolution UI |
| M2.4.8 | **Manual Sync Fallback**: Nút manual sync cho từng entity type (orders, invoices, POs, products, customers). Sync theo date range. Progress indicator | P0 | Per-entity sync, date range picker, progress bar, error handling |
| M2.4.9 | **Sync Dashboard**: Hiển thị: last sync time, records synced today, errors pending, unmapped products/suppliers. Health status indicator (green/yellow/red) | P0 | Real-time status, error drill-down, retry failed items |

---

### M3: Allocation Engine (Phân bổ Chỉ tiêu)

> **Triết lý phân bổ**: Phân bổ nấm tươi khác hàng công nghiệp ở 3 điểm:
> 1. **Supply-driven**: Nguồn cung biến động theo mùa vụ, thời tiết → phải xem ATP trước khi phân bổ
> 2. **Time-critical**: Shelf life 2-14 ngày → phân bổ ngày quan trọng hơn phân bổ tháng
> 3. **Quality-variable**: Mỗi lô hàng chất lượng khác nhau → phải match RSL requirement của từng nhóm KH

#### M3.1 Phân bổ tháng (Monthly Allocation Plan)

> Flow: **Xem ATP (M1.3.5) → Xem Demand (M2.3.3) → Tạo plan → Auto-allocate → Manual adjust → Approve → Gửi NCC thương lượng → Confirmed plan**

| ID | Yêu cầu | Priority | Acceptance Criteria |
|----|---------|----------|-------------------|
| M3.1.1 | **Tạo bảng phân bổ tháng**: Matrix NCC × sản phẩm × số lượng. Inputs tự động: (1) Nhu cầu tháng (orders confirmed + forecast), (2) ATP per NCC per product (từ M1.3.5), (3) Điểm NCC (scoring), (4) Cam kết hợp đồng. Output: suggested allocation per NCC per product | P0 | Hiển thị rõ: demand total, supply total, gap, per NCC: capacity/committed/suggested/allocated |
| M3.1.2 | **Quy tắc phân bổ tự động** (4 bước tuần tự): **(1) Contract First**: Ưu tiên cam kết hợp đồng (committed qty từ M1.3.2), **(2) Score-based**: Phân bổ phần còn lại theo điểm NCC (A > B > C, D chỉ nhận nếu thiếu), **(3) Capacity Cap**: Không vượt quá capacity NCC (từ M1.3.1), **(4) Diversification**: Không quá 40% tổng cung cho 1 NCC (giảm rủi ro). **Hiển thị lý do phân bổ** cho mỗi dòng | P0 | 4 rules sequential, per-line reasoning visible, override per rule configurable |
| M3.1.3 | **Manual Override**: Sau auto-allocate, cho phép điều chỉnh thủ công từng dòng. Khi override, hệ thống cảnh báo nếu vi phạm rules (vượt capacity, phá diversification). Lock/unlock per NCC hoặc per product | P0 | Lock/unlock, warning on rule violation, audit log ghi rõ lý do override |
| M3.1.4 | Duyệt bảng phân bổ tháng (Manager/Director) | P0 | Workflow: Draft → Review → Approved. Director duyệt nếu total > threshold |
| M3.1.5 | **Gửi phân bổ cho NCC thương lượng**: Sau approve, gửi notification + email cho từng NCC. NCC xem trên Supplier Portal: sản phẩm × số lượng × lịch giao dự kiến (chia theo tuần). Deadline phản hồi configurable (default 48h) | P0 | Notification push + email, deadline config, hiển thị trên Supplier Portal dashboard |
| M3.1.6 | **NCC phản hồi (Counter-Propose)**: NCC Owner Đồng ý toàn bộ, hoặc counter-propose per line item (qty đề xuất + lý do). Lý do dropdown: "Không đủ capacity", "Mùa vụ giảm", "Giá chưa phù hợp", "Lịch giao cần điều chỉnh", "Khác" + free text | P0 | Per-line counter, reason required, NCC thấy total impact of changes |
| M3.1.7 | **Negotiation Rounds** (max 3): Vòng 1: NCC counter → Manager review → Revised/Agree/Reject. Vòng 2-3: lặp lại. Sau 3 vòng → auto-escalate Director. Timeline hiển thị toàn bộ lịch sử | P0 | State machine: Proposed → CounterProposed → Revised → Agreed/Rejected/Escalated. History timeline |
| M3.1.8 | **Dashboard thương lượng**: Tổng hợp tất cả negotiations active. Filter NCC/trạng thái/deadline. Quick stats: % agreed, % pending, % escalated. Inline actions | P1 | Real-time, countdown deadline, batch actions |

#### M3.2 Phân bổ ngày (Daily Allocation)

> **Quan trọng hơn phân bổ tháng** vì nấm tươi shelf life ngắn. Daily allocation = matching orders cụ thể → NCC cụ thể → lots cụ thể.

| ID | Yêu cầu | Priority | Acceptance Criteria |
|----|---------|----------|-------------------|
| M3.2.1 | **Daily Allocation Board**: Mỗi ngày, hiển thị: (1) Orders cần fulfill hôm nay/mai, (2) NCC confirmed delivery hôm nay (từ M1.3.4), (3) Inventory available (lots + RSL). Auto-suggest matching: order → NCC/lot | P0 | Board view per day, drag-drop matching, unmatched orders highlighted red |
| M3.2.2 | **Monthly → Daily Breakdown**: Chia chỉ tiêu tháng → ngày theo: (1) Trọng số ngày trong tuần (T2-T7 cao, CN thấp — configurable), (2) Confirmed supply schedule per NCC, (3) Actual orders per day | P0 | Calendar view, configurable weights, compare plan vs actual |
| M3.2.3 | **NCC Daily Confirmation**: Sáng mỗi ngày, NCC confirm số lượng thực tế sẽ giao hôm nay trên Supplier Portal (có thể khác với planned). Hệ thống recalculate allocation nếu actual ≠ planned | P0 | Morning confirmation deadline (configurable, default 7AM), variance alert, auto-rebalance suggestion |
| M3.2.4 | **Shortage Handling**: Khi NCC báo giảm hoặc không giao, hệ thống: (1) Identify affected orders, (2) Suggest alternative NCC (có ATP), (3) Suggest inventory lots (FEFO), (4) Escalate nếu không đủ thay thế | P0 | Auto-detect shortage, suggestion engine, escalation workflow |
| M3.2.5 | **Surplus Handling**: Khi NCC giao dư hoặc demand giảm (order cancel), hệ thống: (1) Suggest chuyển cho orders khác, (2) Suggest nhập kho (track RSL), (3) Alert nếu risk expire | P1 | Auto-detect surplus, reallocation suggestion, waste risk alert |

#### M3.3 Order-to-Supplier Matching
| ID | Yêu cầu | Priority | Acceptance Criteria |
|----|---------|----------|-------------------|
| M3.3.1 | **Multi-criteria Matching**: Tự động match order → NCC theo: (1) NCC có ATP, (2) Quality score đủ cho nhóm KH này, (3) RSL requirement match, (4) Lead time, (5) Proximity/route. Hiển thị scoring per match | P1 | Scoring breakdown visible, override allowed, audit log |
| M3.3.2 | **Order Splitting**: Split đơn hàng lớn cho nhiều NCC khi 1 NCC không đủ ATP. Hiển thị split plan, total = SL đơn hàng. Ưu tiên minimize số NCC (giảm complexity giao nhận) | P1 | Split UI, min-NCC optimization, total validation |
| M3.3.3 | **Lock & Confirm**: Lock allocation sau confirm. Unlock cần quyền Manager + lý do | P0 | Lock/unlock, reason required for unlock, audit trail |

#### M3.4 Cấu hình quy tắc
| ID | Yêu cầu | Priority | Acceptance Criteria |
|----|---------|----------|-------------------|
| M3.4.1 | CRUD quy tắc phân bổ: trọng số tiêu chí, ràng buộc, template per product category | P2 | UI slider trọng số, preview impact |
| M3.4.2 | Quy tắc theo loại nấm: VD Bào Ngư Xám (sản lượng lớn, nhiều NCC) ≠ Đông Trùng Hạ Thảo (ít NCC, giá cao, allocation cẩn thận hơn) | P2 | Template gán cho product category, clone template |
| M3.4.3 | **Buffer Configuration**: Hệ số buffer hao hụt per product per NCC. VD: cần 100kg → đặt 108kg (buffer 8%). Auto-calculate dựa trên shrinkage history | P0 | Per product × NCC, auto-suggest from history, manual override |

---

### M4: Dynamic Rebalancing (Tái phân bổ)

#### M4.1 Phát hiện biến động
| ID | Yêu cầu | Priority | Acceptance Criteria |
|----|---------|----------|-------------------|
| M4.1.1 | Cảnh báo khi NCC báo giảm/tăng sản lượng | P1 | Notification, highlight trên dashboard |
| M4.1.2 | Cảnh báo khi chênh lệch cung-cầu > 15% | P1 | Tự động tính, configurable ngưỡng |
| M4.1.3 | Cảnh báo khi khách hủy đơn lớn | P1 | Trigger khi hủy > X kg |

#### M4.2 Đề xuất & Duyệt
| ID | Yêu cầu | Priority | Acceptance Criteria |
|----|---------|----------|-------------------|
| M4.2.1 | Hệ thống đề xuất NCC thay thế khi thiếu hụt | P1 | Danh sách NCC dự phòng + lý do |
| M4.2.2 | Workflow duyệt: <5% tự động, 5-15% Manager, >15% Director | P1 | Configurable ngưỡng |
| M4.2.3 | Audit trail toàn bộ thay đổi phân bổ | P0 | Who/when/what/why |

#### M4.3 What-if Simulation
| ID | Yêu cầu | Priority | Acceptance Criteria |
|----|---------|----------|-------------------|
| M4.3.1 | Mô phỏng "nếu NCC X ngừng cung cấp" | P2 | Hiển thị impact: đơn hàng ảnh hưởng, đề xuất thay thế |
| M4.3.2 | So sánh 2-3 phương án điều chuyển | P2 | Side-by-side: chi phí, rủi ro, fill rate |

---

### M5: Inventory & Logistics (Kho & Logistics)

#### M5.1 Tồn kho
| ID | Yêu cầu | Priority | Acceptance Criteria |
|----|---------|----------|-------------------|
| M5.1.1 | Xem tồn kho theo: loại nấm × chất lượng × ngày nhập × ngày hết hạn | P0 | Real-time, lot tracking |
| M5.1.2 | FEFO: đề xuất xuất hàng hết hạn trước | P0 | Auto-sort, highlight hàng gần hết hạn |
| M5.1.3 | Cảnh báo hàng hết hạn trong 24h/48h | P0 | Push notification, dashboard widget |
| M5.1.4 | Safety stock theo loại nấm | P1 | Cảnh báo khi dưới ngưỡng |

#### M5.2 Nhập/Xuất kho
| ID | Yêu cầu | Priority | Acceptance Criteria |
|----|---------|----------|-------------------|
| M5.2.1 | Phiếu nhập kho liên kết với phiếu giao hàng NCC | P0 | Auto-fill từ delivery, QC check trước nhập |
| M5.2.2 | Phiếu xuất kho liên kết với đơn hàng | P0 | FEFO tự động chọn lot, print phiếu |
| M5.2.3 | Kiểm kê tồn kho (stock count) | P1 | So sánh hệ thống vs thực tế, ghi nhận chênh lệch |

---

### M6: Reporting & Analytics (Báo cáo)

| ID | Yêu cầu | Priority | Acceptance Criteria |
|----|---------|----------|-------------------|
| M6.1 | Dashboard tổng quan: cung vs cầu, fill rate, top NCC, cảnh báo | P0 | Real-time, responsive |
| M6.2 | Báo cáo phân bổ: NCC × sản phẩm × thời gian | P1 | Filter, drill-down, export Excel |
| M6.3 | Báo cáo hiệu suất NCC: điểm, xu hướng, so sánh | P1 | Charts + table |
| M6.4 | Báo cáo tồn kho: aging, hao hụt, turnover | P1 | FEFO health check |
| M6.5 | Export Excel/PDF/CSV | P1 | Template đẹp, logo công ty |

---

### M7: Administration (Quản trị)

| ID | Yêu cầu | Priority | Acceptance Criteria |
|----|---------|----------|-------------------|
| M7.1 | CRUD Users + gán Role | P0 | Email invite, password reset |
| M7.2 | RBAC theo module + action | P0 | Matrix: Role × Module × Permission |
| M7.3 | Audit log: mọi thao tác CUD | P0 | Searchable, export |
| M7.4 | Cấu hình danh mục nấm, chất lượng, đơn vị | P0 | Master data management |
| M7.5 | Cấu hình mùa vụ + hệ số điều chỉnh | P2 | Calendar-based |

---

### M8: Quality Control (Kiểm tra Chất lượng)

| ID | Yêu cầu | Priority | Acceptance Criteria |
|----|---------|----------|-------------------|
| M8.1 | Checklist QC đầu vào: kích thước, màu sắc, độ tươi, tạp chất | P0 | Configurable checklist theo loại nấm |
| M8.2 | Phân loại lại chất lượng (đặt Loại 1 → thực nhận Loại 2) | P0 | Ảnh hưởng giá, ghi nhận vào điểm NCC |
| M8.3 | Reject lô hàng + chứng từ | P0 | Lý do, ảnh, thông báo NCC |
| M8.4 | Truy xuất nguồn gốc: lô → NCC → vùng trồng → ngày thu hoạch | P1 | QR code / barcode |

---

### M9: Pricing & Cost (Giá & Chi phí) — Phase 2+

| ID | Yêu cầu | Priority | Acceptance Criteria |
|----|---------|----------|-------------------|
| M9.1 | Bảng giá mua theo NCC × sản phẩm × mùa | P1 | Lịch sử giá, so sánh NCC |
| M9.2 | Tính landed cost: giá mua + vận chuyển + hao hụt | P2 | Tự động tính khi nhập phiếu giao hàng |
| M9.3 | Báo cáo chi phí: theo NCC, sản phẩm, thời gian | P2 | Trend analysis |

---

### M10: Contract Management (Quản lý Hợp đồng) — Phase 2+

| ID | Yêu cầu | Priority | Acceptance Criteria |
|----|---------|----------|-------------------|
| M10.1 | Tạo hợp đồng mua hàng với NCC: kỳ hạn, sản lượng cam kết min/max, giá, điều khoản | P1 | Template hợp đồng, trạng thái: Draft → Active → Expired |
| M10.2 | Theo dõi thực hiện hợp đồng: cam kết vs thực giao | P1 | % hoàn thành, cảnh báo khi thấp |
| M10.3 | Cảnh báo hợp đồng sắp hết hạn (30/60/90 ngày) | P2 | Notification tự động |
| M10.4 | NCC xem hợp đồng trên Supplier Portal | P2 | Read-only, download PDF |
| M10.5 | Liên kết hợp đồng → phân bổ (commitment first rule) | P1 | Auto-fill cam kết khi tạo allocation plan |

---

### M11: Cold Chain Monitoring (Giám sát Chuỗi lạnh) — Phase 3+

| ID | Yêu cầu | Priority | Acceptance Criteria |
|----|---------|----------|-------------------|
| M11.1 | Ghi nhận nhiệt độ tại các chặng: NCC → vận chuyển → kho → giao hàng | P2 | Manual input hoặc IoT sensor integration |
| M11.2 | Cảnh báo khi nhiệt độ vượt ngưỡng (>8°C hoặc <2°C) | P2 | Push notification, ghi vào lot record |
| M11.3 | Đánh giá ảnh hưởng gián đoạn chuỗi lạnh đến shelf life | P3 | Giảm RSL tự động, cảnh báo |

---

### M12: Waste Management (Quản lý Hàng hủy) — Phase 2+

| ID | Yêu cầu | Priority | Acceptance Criteria |
|----|---------|----------|-------------------|
| M12.1 | Ghi nhận hàng hủy: lot, số lượng, lý do (hết hạn/hỏng/reject QC) | P1 | Liên kết với lot, ảnh chứng từ |
| M12.2 | Báo cáo hàng hủy: theo sản phẩm, NCC, nguyên nhân, thời gian | P1 | Trend chart, so sánh tỷ lệ |
| M12.3 | Đề xuất giảm waste: chuyển sang chế biến (sấy/đóng hộp) khi hàng gần hết hạn | P2 | Auto-suggest dựa trên RSL |
| M12.4 | Chi phí hàng hủy tính vào landed cost NCC | P2 | Ảnh hưởng scoring |

---

### M13: Transport Management (Quản lý Vận chuyển) — Phase 3+

| ID | Yêu cầu | Priority | Acceptance Criteria |
|----|---------|----------|-------------------|
| M13.1 | Lập lịch xe giao/nhận hàng: route, NCC, thời gian, xe | P2 | Calendar view, conflict detection |
| M13.2 | Theo dõi trạng thái vận chuyển: đang đi → đã nhận | P2 | Status update, thời gian thực |
| M13.3 | Tính chi phí vận chuyển theo route, khối lượng | P3 | Tích hợp vào landed cost |
| M13.4 | Ghi nhận hao hụt vận chuyển | P2 | So sánh SL xuất vs SL nhận |

---

### M14: Shrinkage Management (Hao hụt)

| ID | Yêu cầu | Priority | Acceptance Criteria |
|----|---------|----------|-------------------|
| M14.1 | Định nghĩa tỷ lệ hao hụt chuẩn theo loại nấm | P0 | Admin configurable |
| M14.2 | Ghi nhận hao hụt theo chặng: NCC → vận chuyển → kho → giao | P0 | So sánh vs chuẩn |
| M14.3 | Buffer hao hụt trong phân bổ (cần 100kg → đặt 108kg) | P0 | Tự động tính theo hao hụt trung bình NCC |
| M14.4 | Cảnh báo khi hao hụt thực tế > chuẩn | P0 | Trigger điều tra nguyên nhân |

---

### M15: Messaging (Nhắn tin)

| ID | Yêu cầu | Priority | Acceptance Criteria |
|----|---------|----------|-------------------|
| M15.1 | Gửi tin nhắn giữa Admin Portal và Supplier Portal: text + đính kèm (ảnh, PDF, max 10MB) | P0 | Real-time delivery, hiển thị trạng thái (sent/read), hỗ trợ cả admin → NCC và NCC → admin |
| M15.2 | Tin nhắn theo thread (conversation): mỗi thread liên kết với 1 entity (allocation, delivery, order, registration) | P0 | Thread title auto-generated từ entity, xem timeline, entity link clickable |
| M15.3 | Reply trong thread: trả lời tin nhắn cũ, quote message gốc | P1 | Nested reply UI, scroll to quoted message |
| M15.4 | Notification preferences: NCC chọn nhận thông báo qua in-app, email, hoặc cả hai | P1 | Settings page trên Supplier Portal, default = cả hai |
| M15.5 | Message templates: Admin có bộ template tin nhắn thường dùng (xác nhận phân bổ, yêu cầu cập nhật lịch, nhắc giao hàng) | P2 | CRUD templates, insert vào compose, variables auto-fill (tên NCC, ngày, số lượng) |
| M15.6 | Admin xem tất cả threads: filter theo NCC, entity type, trạng thái (open/closed) | P0 | Search, sort by last message, unread count |
| M15.7 | Đóng thread khi issue resolved | P1 | Closed status, có thể reopen |

---

### M16: Supplier Portal (Cổng NCC)

| ID | Yêu cầu | Priority | Acceptance Criteria |
|----|---------|----------|-------------------|
| M16.1 | **NCC Dashboard**: Tổng quan KPI (điểm, xếp hạng, fill rate gần nhất), lịch giao hàng sắp tới, phân bổ đang chờ phản hồi, tin nhắn chưa đọc | P0 | Personalized theo NCC đang login, real-time data |
| M16.2 | **Self-Registration Flow**: Form đăng ký multi-step (thông tin cơ bản → sản phẩm & công suất → upload tài liệu → xác nhận email → chờ duyệt). Màn hình trạng thái đăng ký | P0 | 4 steps, progress indicator, save draft, email verification, status page |
| M16.3 | **Harvest Schedule**: Calendar view để NCC nhập số lượng dự kiến thu hoạch theo ngày/tuần, phân theo loại nấm | P0 | Calendar UI, bulk input, copy từ tuần trước, deadline reminder |
| M16.4 | **Allocation Response**: Xem phân bổ nhận được, đồng ý hoặc counter-propose từng dòng, xem timeline thương lượng, deadline countdown | P0 | Card-based UI, per-line action, timer, history timeline |
| M16.5 | **Delivery Confirmation**: Xem lịch giao hàng, xác nhận đã giao, xem kết quả QC sau khi Nham Xanh kiểm tra | P1 | List + detail view, QC result read-only, notification khi QC done |
| M16.6 | **Performance & Score**: Xem điểm tổng hợp, chi tiết 5 tiêu chí, xu hướng theo tháng (radar chart + trend line), xếp hạng hiện tại (badge) | P1 | Radar chart, line chart, rank badge (A/B/C/D) |
| M16.7 | **Language Switcher**: Chuyển đổi ngôn ngữ Tiếng Việt ↔ English trên toàn bộ Supplier Portal | P0 | Persistent preference (lưu vào user profile), instant switch không reload, bao gồm cả labels, messages, notifications |
| M16.8 | **NCC Staff Management**: NCC Owner thêm/xóa staff users cho NCC của mình, gán quyền hạn chế | P2 | Invite by email, role = NCC Staff (fixed), max 5 staff per NCC |

---

## 4. Yêu cầu phi chức năng

| # | Hạng mục | Yêu cầu | Metric |
|---|----------|---------|--------|
| NFR1 | Hiệu suất | Phân bổ 50 NCC × 10 loại nấm | < 5 giây |
| NFR2 | Hiệu suất | Dashboard load time | < 2 giây |
| NFR3 | Hiệu suất | Import 1000 đơn hàng từ Excel | < 30 giây |
| NFR4 | Khả dụng | Uptime | ≥ 99.5% |
| NFR5 | Bảo mật | Authentication | JWT + refresh token |
| NFR6 | Bảo mật | Authorization | RBAC per module, portal-level data isolation (NCC chỉ xem data của mình) |
| NFR7 | Bảo mật | Data encryption | AES-256 cho dữ liệu nhạy cảm |
| NFR8 | Responsive | Thiết bị | Desktop + Tablet (iPad) |
| NFR9 | Data | Lưu trữ | 3 năm giao dịch |
| NFR10 | Data | Backup | Daily automated |
| NFR11 | Ngôn ngữ | UI | Tiếng Việt (primary), English cho Supplier Portal (i18n) |
| NFR12 | Accessibility | WCAG | Level AA |
| NFR13 | Bảo mật | Multi-portal isolation | Supplier Portal users không truy cập được Admin routes/data. Admin Portal users không impersonate NCC trừ khi có quyền Admin |
| NFR14 | Bảo mật | Self-registration | Email verification bắt buộc, rate limit đăng ký (max 5/IP/hour) |
| NFR15 | Integration | KiotViet SLA | Webhook processing < 2 giây, retry 3 lần (exponential backoff), manual sync available 24/7, sync lag dashboard |
| NFR16 | i18n | Supplier Portal bilingual | Tất cả UI text qua i18n keys, hỗ trợ Vi + En, date/number format theo locale |

---

## 5. Phân kỳ triển khai

### Phase 1 — MVP (10-12 tuần)
**Mục tiêu**: Thay thế Excel, quản lý NCC + đơn hàng + phân bổ cơ bản, Supplier Portal core, KiotViet integration

| Tuần | Deliverable |
|------|------------|
| 1-2 | Setup infra, DB schema, Auth (dual-portal), User management, i18n framework |
| 3-4 | M1: Supplier CRUD + Product catalog, M1.1.6 Self-Registration flow |
| 5-6 | M2: Order management + Excel import, M2.1.5 KiotViet webhook integration |
| 7-8 | M3: Monthly allocation (basic) + M3.1.5-M3.1.8 Negotiation workflow |
| 9-10 | M16: Supplier Portal (Dashboard, Allocation Response, Harvest Schedule, Language Switcher) |
| 11-12 | M15: Messaging, M6: Dashboard, M7: Admin config |

### Phase 2 — Core (6-8 tuần)
M3.2 Daily allocation, M1.5 Scoring, M5 Inventory FEFO, M8 QC, M14 Shrinkage, M10 Contracts, M12 Waste, M16.5-M16.6 Supplier Deliveries & Scores

### Phase 3 — Intelligence (6-8 tuần)
M2.3 Forecast, M4 Rebalancing, M4.3 What-if, Workflow approvals, M11 Cold Chain, M13 Transport

### Phase 4 — Optimization (4-6 tuần)
M9 Pricing, Advanced reports, Notifications optimization, M16.8 NCC Staff Management
