# FRD — Functional Requirements Document
# GM Supply — Supply Chain Management System

> Version: 1.0 | Status: Draft | Last Updated: 2026-03-12

---

## 1. Giới thiệu

### 1.1 Mục đích tài liệu
Tài liệu mô tả chi tiết các yêu cầu chức năng của hệ thống GM Supply — quản lý & phân bổ nguồn cung nấm tươi. Đây là tài liệu tham chiếu chính cho đội phát triển, QA, và stakeholders.

### 1.2 Phạm vi hệ thống
GM Supply quản lý toàn bộ chuỗi cung ứng nấm tươi:
- **Upstream**: Quản lý nhà cung cấp (NCC), thu mua, kiểm tra chất lượng
- **Core**: Phân bổ chỉ tiêu, matching đơn hàng - NCC, tái phân bổ
- **Downstream**: Quản lý đơn hàng khách hàng, giao hàng, tồn kho
- **Cross-cutting**: Báo cáo, dự báo, quản trị hệ thống

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

---

## 2. Actors & Roles

| Role | Mô tả | Modules chính |
|------|--------|--------------|
| **Admin** | Quản trị hệ thống, cấu hình, phân quyền | M7 Administration |
| **Director** | Duyệt phân bổ lớn, xem báo cáo tổng hợp, mô phỏng | M3, M4, M6 |
| **Manager** | Quản lý phân bổ, duyệt điều chuyển, giám sát NCC | M1-M6 |
| **Procurement Staff** | Thu thập đơn hàng, liên hệ NCC, xử lý phân bổ ngày | M1, M2, M3 |
| **QC Staff** | Kiểm tra chất lượng đầu vào, phân loại, reject hàng | M8 QC |
| **Warehouse Staff** | Nhận hàng, quản lý tồn kho, xuất hàng FEFO | M5 Inventory |
| **Viewer** | Chỉ xem báo cáo, dashboard | M6 Reports |

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

#### M1.2 Danh mục sản phẩm theo NCC
| ID | Yêu cầu | Priority | Acceptance Criteria |
|----|---------|----------|-------------------|
| M1.2.1 | Gán loại nấm cho NCC với: chất lượng, giá, công suất, shelf life | P0 | 1 NCC có nhiều sản phẩm, mỗi SP có giá + công suất riêng |
| M1.2.2 | Cập nhật giá theo mùa/thời điểm | P1 | Lịch sử giá được lưu, hiệu lực theo ngày |
| M1.2.3 | Xem ma trận NCC × Sản phẩm | P1 | Bảng pivot: hàng = NCC, cột = loại nấm, giá trị = giá/công suất |

#### M1.3 Kế hoạch cung cấp
| ID | Yêu cầu | Priority | Acceptance Criteria |
|----|---------|----------|-------------------|
| M1.3.1 | Nhập lịch thu hoạch dự kiến theo tuần/tháng | P0 | Calendar view, nhập số lượng theo ngày |
| M1.3.2 | Ghi nhận cam kết cung cấp (hợp đồng) | P0 | Min/max theo tháng, liên kết với hợp đồng |
| M1.3.3 | Cảnh báo khi NCC chưa cập nhật lịch trình > 7 ngày | P1 | Notification tự động |

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
| M2.1.3 | Xem danh sách đơn hàng: filter theo trạng thái, khách hàng, ngày, sản phẩm | P0 | Pagination, search, export |
| M2.1.4 | Workflow đơn hàng: Mới → Đã phân bổ → Đang chuẩn bị → Đang giao → Hoàn thành / Hủy | P0 | State machine, không skip bước |
| M2.1.5 | API nhận đơn hàng từ hệ thống bán hàng bên ngoài | P2 | REST API, webhook, authentication |

#### M2.2 Quản lý khách hàng
| ID | Yêu cầu | Priority | Acceptance Criteria |
|----|---------|----------|-------------------|
| M2.2.1 | CRUD khách hàng: tên, loại (Đại lý/Siêu thị/Nhà hàng/Xuất khẩu/Lẻ), liên hệ, địa chỉ | P0 | Phân loại ảnh hưởng mức ưu tiên |
| M2.2.2 | Yêu cầu RSL tối thiểu theo khách hàng | P1 | Siêu thị ≥70%, nhà hàng ≥50% |
| M2.2.3 | Lịch sử mua hàng & phân tích xu hướng | P2 | Chart theo tháng, so sánh YoY |

#### M2.3 Dự báo nhu cầu
| ID | Yêu cầu | Priority | Acceptance Criteria |
|----|---------|----------|-------------------|
| M2.3.1 | Forecast bằng Moving Average (4-12 tuần) | P2 | Chọn window, xem accuracy vs thực tế |
| M2.3.2 | Điều chỉnh forecast theo mùa/sự kiện | P2 | Hệ số nhân, ghi chú lý do |
| M2.3.3 | Dashboard tổng hợp nhu cầu: đơn hàng + forecast + hợp đồng | P1 | Stacked bar chart, gap analysis |

---

### M3: Allocation Engine (Phân bổ Chỉ tiêu)

#### M3.1 Phân bổ tháng
| ID | Yêu cầu | Priority | Acceptance Criteria |
|----|---------|----------|-------------------|
| M3.1.1 | Tạo bảng phân bổ tháng: NCC × loại nấm × số lượng | P0 | Tự động tính dựa trên nhu cầu + năng lực + điểm NCC |
| M3.1.2 | Ưu tiên cam kết hợp đồng → phân bổ theo điểm → giới hạn công suất → đa dạng hóa (≤40%/NCC) | P0 | 4 quy tắc tuần tự, hiển thị lý do phân bổ |
| M3.1.3 | Cho phép điều chỉnh thủ công sau khi tự động phân bổ | P0 | Lock/unlock, audit log |
| M3.1.4 | Duyệt bảng phân bổ tháng (Manager/Director) | P0 | Workflow: Draft → Review → Approved |

#### M3.2 Phân bổ ngày
| ID | Yêu cầu | Priority | Acceptance Criteria |
|----|---------|----------|-------------------|
| M3.2.1 | Chia chỉ tiêu tháng → ngày theo trọng số (T2-T7 cao, CN thấp) | P1 | Configurable trọng số, xem calendar |
| M3.2.2 | Điều chỉnh phân bổ ngày theo đơn hàng thực tế | P1 | So sánh plan vs actual |

#### M3.3 Order-to-Supplier Matching
| ID | Yêu cầu | Priority | Acceptance Criteria |
|----|---------|----------|-------------------|
| M3.3.1 | Tự động match đơn hàng → NCC theo: lead time, khoảng cách, quality score, tải | P1 | Multi-criteria scoring, hiển thị lý do match |
| M3.3.2 | Split đơn hàng cho nhiều NCC khi cần | P1 | Hiển thị phần chia, tổng = SL đơn hàng |
| M3.3.3 | Lock allocation sau khi confirm | P1 | Cần quyền Manager để unlock |

#### M3.4 Cấu hình quy tắc
| ID | Yêu cầu | Priority | Acceptance Criteria |
|----|---------|----------|-------------------|
| M3.4.1 | CRUD quy tắc phân bổ: trọng số, ràng buộc, template | P2 | UI kéo thả trọng số slider |
| M3.4.2 | Quy tắc theo loại nấm (mỗi loại có thể khác nhau) | P2 | Template gán cho product category |

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

### M14: Shrinkage Management (Hao hụt)

| ID | Yêu cầu | Priority | Acceptance Criteria |
|----|---------|----------|-------------------|
| M14.1 | Định nghĩa tỷ lệ hao hụt chuẩn theo loại nấm | P0 | Admin configurable |
| M14.2 | Ghi nhận hao hụt theo chặng: NCC → vận chuyển → kho → giao | P0 | So sánh vs chuẩn |
| M14.3 | Buffer hao hụt trong phân bổ (cần 100kg → đặt 108kg) | P0 | Tự động tính theo hao hụt trung bình NCC |
| M14.4 | Cảnh báo khi hao hụt thực tế > chuẩn | P0 | Trigger điều tra nguyên nhân |

---

## 4. Yêu cầu phi chức năng

| # | Hạng mục | Yêu cầu | Metric |
|---|----------|---------|--------|
| NFR1 | Hiệu suất | Phân bổ 50 NCC × 10 loại nấm | < 5 giây |
| NFR2 | Hiệu suất | Dashboard load time | < 2 giây |
| NFR3 | Hiệu suất | Import 1000 đơn hàng từ Excel | < 30 giây |
| NFR4 | Khả dụng | Uptime | ≥ 99.5% |
| NFR5 | Bảo mật | Authentication | JWT + refresh token |
| NFR6 | Bảo mật | Authorization | RBAC per module |
| NFR7 | Bảo mật | Data encryption | AES-256 cho dữ liệu nhạy cảm |
| NFR8 | Responsive | Thiết bị | Desktop + Tablet (iPad) |
| NFR9 | Data | Lưu trữ | 3 năm giao dịch |
| NFR10 | Data | Backup | Daily automated |
| NFR11 | Ngôn ngữ | UI | Tiếng Việt (primary) |
| NFR12 | Accessibility | WCAG | Level AA |

---

## 5. Phân kỳ triển khai

### Phase 1 — MVP (8-10 tuần)
**Mục tiêu**: Thay thế Excel, quản lý NCC + đơn hàng + phân bổ cơ bản

| Tuần | Deliverable |
|------|------------|
| 1-2 | Setup infra, DB schema, Auth, User management |
| 3-4 | M1: Supplier CRUD + Product catalog |
| 5-6 | M2: Order management + Excel import |
| 7-8 | M3: Monthly allocation (basic) |
| 9-10 | M6: Dashboard + M7: Admin config |

### Phase 2 — Core (6-8 tuần)
M3.2 Daily allocation, M1.5 Scoring, M5 Inventory FEFO, M8 QC, M14 Shrinkage

### Phase 3 — Intelligence (6-8 tuần)
M2.3 Forecast, M4 Rebalancing, M4.3 What-if, Workflow approvals

### Phase 4 — Optimization (4-6 tuần)
M9 Pricing, API integrations, Advanced reports, Notifications
