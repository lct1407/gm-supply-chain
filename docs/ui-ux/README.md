# UI/UX Design Specification
# GM Supply — Supply Chain Management

> Thiết kế đơn giản, tập trung vào chức năng, dễ dùng cho nhân viên kho/thu mua (Admin Portal) và nhà cung cấp (Supplier Portal)

---

## 1. Design Principles

| Nguyên tắc | Áp dụng |
|-----------|---------|
| **Data-first** | Dashboard và bảng dữ liệu là trung tâm, không phải hình ảnh |
| **Action-oriented** | Mỗi màn hình có hành động chính rõ ràng (nút primary) |
| **Minimal clicks** | Tối đa 3 click để đến hành động thường dùng |
| **Mobile-friendly** | Tablet-first cho nhân viên kho, desktop cho quản lý |
| **Dual-portal clarity** | Admin Portal và Supplier Portal có visual identity riêng biệt (color, layout) để tránh nhầm lẫn |
| **Supplier-friendly** | Supplier Portal tối giản, NCC không cần training, UX như app consumer |
| **Bilingual-ready** | Supplier Portal hỗ trợ Vi/En. Mọi text qua i18n keys, layout chịu được text dài/ngắn khác nhau |
| **Alert-driven** | Cảnh báo chủ động (hết hạn, hao hụt, thiếu hụt, deadline thương lượng) |

---

## 2. Layout Structure

### 2.1 Admin Portal — Desktop Layout (≥1024px)
```
┌──────────────────────────────────────────────────────────────┐
│  Logo  │        Header: Search | Notifications | User       │
├────────┼─────────────────────────────────────────────────────┤
│        │                                                     │
│  Side  │              Main Content Area                      │
│  bar   │                                                     │
│        │  ┌──────────────────────────────────────────────┐   │
│  Nav   │  │  Page Header: Title + Breadcrumb + Actions   │   │
│  Menu  │  ├──────────────────────────────────────────────┤   │
│        │  │                                              │   │
│ ────── │  │  Content: Tables / Forms / Charts            │   │
│        │  │                                              │   │
│ Quick  │  │                                              │   │
│ Stats  │  │                                              │   │
│        │  │                                              │   │
│        │  └──────────────────────────────────────────────┘   │
└────────┴─────────────────────────────────────────────────────┘
         │←── 240px ──→│←──────── fluid ──────────────────→│
```

### 2.2 Supplier Portal — Desktop Layout (≥1024px)
```
┌──────────────────────────────────────────────────────────────┐
│  Logo  │  Nav: Dashboard | Phân bổ | Lịch | Giao hàng |   │
│        │        Điểm | Tin nhắn         | [Vi/En] | User   │
├────────┴─────────────────────────────────────────────────────┤
│                                                              │
│                    Main Content Area                          │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐    │
│  │  Page Header: Title + Actions                         │    │
│  ├──────────────────────────────────────────────────────┤    │
│  │                                                      │    │
│  │  Content: Cards / Forms / Calendar                   │    │
│  │                                                      │    │
│  │                                                      │    │
│  └──────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────┘
│←────────────────────── fluid (max 1200px) ────────────────→│
```

**Key differences**: Supplier Portal dùng top navigation (không sidebar), max-width 1200px, đơn giản hơn Admin.

### 2.3 Tablet Layout (768-1023px)
- **Admin**: Sidebar collapsed (icons only, expand on tap), content full width
- **Supplier**: Top nav collapse thành hamburger menu, content full width
- Tables scroll horizontally

### 2.4 Navigation Structure

#### Admin Portal Navigation
```
📊 Tổng quan (Dashboard)
📦 Nhà cung cấp
   ├── Danh sách NCC
   ├── Sản phẩm NCC
   ├── Điểm & Xếp hạng
   └── Đăng ký NCC mới              ← NEW (registration review queue)
📋 Đơn hàng
   ├── Danh sách đơn hàng
   ├── Nhập từ Excel
   └── Khách hàng
📊 Phân bổ
   ├── Kế hoạch tháng
   ├── Phân bổ ngày
   ├── Thương lượng                  ← NEW (negotiation management)
   └── Quy tắc phân bổ
🏭 Kho
   ├── Tồn kho
   ├── Nhập/Xuất kho
   └── Hàng sắp hết hạn
💬 Tin nhắn                          ← NEW (messaging center)
📈 Báo cáo
   ├── Cung - Cầu
   ├── Hiệu suất NCC
   └── Hao hụt
🔗 Tích hợp                          ← NEW
   └── KiotViet                      ← NEW (sync dashboard)
⚙️ Quản trị
   ├── Người dùng
   ├── Danh mục nấm
   └── Cấu hình
```

#### Supplier Portal Navigation
```
🏠 Dashboard (Tổng quan)
📊 Phân bổ & Thương lượng (Allocations)
📅 Lịch thu hoạch (Harvest Schedule)
🚚 Giao hàng (Deliveries)
⭐ Điểm đánh giá (My Scores)
💬 Tin nhắn (Messages)
[Vi/En] Language Switcher             ← Always visible in nav
```

---

## 3. Key Screens — Admin Portal

### 3.1 Dashboard — Tổng quan
```
┌──────────────────────────────────────────────────────────────┐
│  Tổng quan                                    Hôm nay ▼     │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐    │
│  │ Đơn    │ │ NCC    │ │ Fill   │ │ Hao hụt│ │ Sắp hết│    │
│  │ hàng   │ │ active │ │ Rate   │ │ TB     │ │ hạn    │    │
│  │  45    │ │   12   │ │ 92.3%  │ │  5.2%  │ │  8 lot │    │
│  │ +12%▲  │ │        │ │ -1.5%▼ │ │ +0.3%▲ │ │ ⚠️     │    │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘    │
│                                                              │
│  ┌─────────────────────────┐ ┌─────────────────────────┐    │
│  │  Cung vs Cầu (7 ngày)  │ │  Cảnh báo (5)           │    │
│  │                         │ │                         │    │
│  │  ████ Cung              │ │  🔴 Nấm rơm thiếu 200kg│    │
│  │  ░░░░ Cầu               │ │  🟡 NCC Minh Tân chưa  │    │
│  │                         │ │     cập nhật lịch       │    │
│  │  [bar chart by day]     │ │  🟡 Lot #A023 hết hạn  │    │
│  │                         │ │     trong 24h           │    │
│  └─────────────────────────┘ │  🟢 Phân bổ T4 chờ     │    │
│                              │     duyệt               │    │
│  ┌─────────────────────────┐ └─────────────────────────┘    │
│  │  Top NCC (Điểm)        │                                 │
│  │                         │ ┌─────────────────────────┐    │
│  │  1. Trang trại ABC  92 │ │  Đơn hàng gần đây      │    │
│  │  2. NCC Kim Châm    88 │ │                         │    │
│  │  3. Hợp tác xã XY  85 │ │  #DH-0045  Siêu thị A  │    │
│  │  4. Farm Đà Lạt    78 │ │  #DH-0044  Nhà hàng B  │    │
│  │  5. NCC Phú Yên    71 │ │  #DH-0043  Đại lý C    │    │
│  └─────────────────────────┘ └─────────────────────────┘    │
└──────────────────────────────────────────────────────────────┘
```

### 3.2 Danh sách NCC
```
┌──────────────────────────────────────────────────────────────┐
│  Nhà cung cấp                          [+ Thêm NCC] [Import]│
│  Home > Nhà cung cấp                                        │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  [🔍 Tìm kiếm...    ] [Trạng thái ▼] [Xếp hạng ▼] [Vùng ▼]│
│                                                              │
│  ┌────┬──────────┬────────┬──────────┬──────┬──────┬───────┐│
│  │ #  │ Tên NCC  │ Vùng   │ Loại nấm │ Điểm │ Hạng │      ││
│  ├────┼──────────┼────────┼──────────┼──────┼──────┼───────┤│
│  │ 1  │ TT ABC   │ Đà Lạt │ Bào ngư, │  92  │  A   │ •••  ││
│  │    │          │        │ Đùi gà   │      │ 🟢   │      ││
│  ├────┼──────────┼────────┼──────────┼──────┼──────┼───────┤│
│  │ 2  │ HTX XY   │ Củ Chi │ Rơm,     │  85  │  A   │ •••  ││
│  │    │          │        │ Kim châm │      │ 🟢   │      ││
│  ├────┼──────────┼────────┼──────────┼──────┼──────┼───────┤│
│  │ 3  │ Farm DL  │ Đà Lạt │ Linh chi │  78  │  B   │ •••  ││
│  │    │          │        │          │      │ 🔵   │      ││
│  └────┴──────────┴────────┴──────────┴──────┴──────┴───────┘│
│                                                              │
│  Hiển thị 1-10 / 25          [< 1 2 3 >]                    │
└──────────────────────────────────────────────────────────────┘
```

### 3.3 Phân bổ Chỉ tiêu Tháng
```
┌──────────────────────────────────────────────────────────────┐
│  Phân bổ tháng 04/2026                [Tự động phân bổ]     │
│  Home > Phân bổ > Kế hoạch T4         [Lưu nháp] [Gửi duyệt]│
│  Trạng thái: 📝 Nháp                                        │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Tổng nhu cầu: 5,200 kg    Tổng phân bổ: 5,460 kg (+5% buffer)│
│                                                              │
│  ┌──────────┬────────┬────────┬────────┬────────┬──────────┐│
│  │ NCC      │Nấm rơm│Bào ngư │Đùi gà  │Kim châm│ Tổng    ││
│  │          │(kg)    │(kg)    │(kg)    │(kg)    │          ││
│  ├──────────┼────────┼────────┼────────┼────────┼──────────┤│
│  │ TT ABC   │  500   │  800 ✏│  300   │   -    │ 1,600   ││
│  │ (A, 92đ) │  [9%]  │ [25%] │ [15%]  │        │ [29%]   ││
│  ├──────────┼────────┼────────┼────────┼────────┼──────────┤│
│  │ HTX XY   │  800   │   -   │   -    │  600   │ 1,400   ││
│  │ (A, 85đ) │ [15%]  │       │        │ [30%]  │ [26%]   ││
│  ├──────────┼────────┼────────┼────────┼────────┼──────────┤│
│  │ Farm DL  │  300   │  400  │  200   │  400   │ 1,300   ││
│  │ (B, 78đ) │  [5%]  │ [13%] │ [10%]  │ [20%]  │ [24%]   ││
│  ├──────────┼────────┼────────┼────────┼────────┼──────────┤│
│  │ NCC PY   │  400   │  200  │  160   │  400   │ 1,160   ││
│  │ (B, 71đ) │  [7%]  │  [6%] │  [8%]  │ [20%]  │ [21%]   ││
│  ├──────────┼────────┼────────┼────────┼────────┼──────────┤│
│  │ TỔNG     │ 2,000  │ 1,400 │  660   │ 1,400  │ 5,460   ││
│  │ Nhu cầu  │ 1,900  │ 1,350 │  630   │ 1,320  │ 5,200   ││
│  │ Chênh    │ +100   │  +50  │  +30   │  +80   │ +260    ││
│  └──────────┴────────┴────────┴────────┴────────┴──────────┘│
│                                                              │
│  ⚠️ Cảnh báo: NCC PY chiếm 21% — OK (< 40%)                │
│  ✅ Buffer hao hụt: 5% đã được tính vào                     │
└──────────────────────────────────────────────────────────────┘
```

### 3.4 Tồn kho — Hàng sắp hết hạn
```
┌──────────────────────────────────────────────────────────────┐
│  ⚠️ Hàng sắp hết hạn                   [Xuất FEFO] [Export]│
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  🔴 Hết hạn trong 24h (3 lot)                               │
│  ┌────────┬──────────┬────────┬──────────┬─────────────────┐│
│  │ Mã lot │ Sản phẩm │ SL còn │ Hết hạn  │ Hành động      ││
│  ├────────┼──────────┼────────┼──────────┼─────────────────┤│
│  │ A-0023 │ Nấm rơm  │  45 kg │ 13/03/26 │ [Xuất] [Chuyển]││
│  │ A-0021 │ Nấm rơm  │  30 kg │ 13/03/26 │ [Xuất] [Chuyển]││
│  │ B-0089 │ Bào ngư  │  20 kg │ 13/03/26 │ [Xuất] [Chuyển]││
│  └────────┴──────────┴────────┴──────────┴─────────────────┘│
│                                                              │
│  🟡 Hết hạn trong 48h (5 lot)                               │
│  ┌────────┬──────────┬────────┬──────────┬─────────────────┐│
│  │ A-0025 │ Nấm rơm  │  60 kg │ 14/03/26 │ [Xuất] [Chuyển]││
│  │ ...    │          │        │          │                 ││
│  └────────┴──────────┴────────┴──────────┴─────────────────┘│
│                                                              │
│  [Chuyển] = Chuyển sang chế biến (sấy/đóng hộp)            │
└──────────────────────────────────────────────────────────────┘
```

### 3.5 NCC Registration Review (Admin)
```
┌──────────────────────────────────────────────────────────────┐
│  Đăng ký NCC mới                                             │
│  Home > Nhà cung cấp > Đăng ký mới                          │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Chờ duyệt: 3  │  Đã duyệt: 12  │  Từ chối: 2             │
│                                                              │
│  ┌────┬──────────────┬────────────┬──────────┬──────┬──────┐│
│  │ #  │ Tên DN       │ Liên hệ    │ Ngày ĐK  │ Docs │      ││
│  ├────┼──────────────┼────────────┼──────────┼──────┼──────┤│
│  │ ▶ │ Trang trại   │ Nguyễn A   │ 10/03/26 │ 3 📎 │[Xem] ││
│  │    │ Hòa Bình    │ 090x...    │          │      │      ││
│  │────┼──────────────┼────────────┼──────────┼──────┼──────┤│
│  │    │ ┌─────────────────────────────────────────────┐    ││
│  │    │ │  Chi tiết đăng ký (expandable)              │    ││
│  │    │ │                                             │    ││
│  │    │ │  MST: 0123456789  │  Vùng: Hòa Bình       │    ││
│  │    │ │  Diện tích: 2ha   │  SP: Nấm rơm, Bào ngư │    ││
│  │    │ │  Công suất: 500kg/tháng                    │    ││
│  │    │ │                                             │    ││
│  │    │ │  Tài liệu: [GPKD.pdf] [Chứng nhận.jpg]    │    ││
│  │    │ │                                             │    ││
│  │    │ │  [✅ Duyệt] [❌ Từ chối] [💬 Nhắn tin]     │    ││
│  │    │ └─────────────────────────────────────────────┘    ││
│  ├────┼──────────────┼────────────┼──────────┼──────┼──────┤│
│  │ ▶ │ Farm Sài Gòn │ Trần B     │ 11/03/26 │ 2 📎 │[Xem] ││
│  └────┴──────────────┴────────────┴──────────┴──────┴──────┘│
└──────────────────────────────────────────────────────────────┘
```

### 3.6 KiotViet Sync Dashboard (Admin)
```
┌──────────────────────────────────────────────────────────────┐
│  KiotViet Integration                    [Manual Sync]       │
│  Home > Tích hợp > KiotViet                                  │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │ Trạng    │ │ Hôm nay  │ │ Lỗi      │ │ Chưa     │       │
│  │ thái     │ │          │ │          │ │ mapping  │       │
│  │ 🟢 Active│ │  23 đơn  │ │  1 lỗi   │ │  2 SP    │       │
│  │          │ │ synced   │ │          │ │          │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
│                                                              │
│  ── Product Mappings ──                                      │
│  ┌──────────────────┬──────────────────┬──────────┬────────┐│
│  │ SP KiotViet      │ SP Nội bộ        │ Chất lg  │        ││
│  ├──────────────────┼──────────────────┼──────────┼────────┤│
│  │ Nam rom tuoi     │ Nấm rơm         │ Loại 1   │ [Edit] ││
│  │ Nam bao ngu      │ Bào ngư          │ Loại 1   │ [Edit] ││
│  │ ⚠️ Nam dui ga   │ [Chọn SP ▼]      │ [Chọn ▼] │ [Save] ││
│  └──────────────────┴──────────────────┴──────────┴────────┘│
│                                                              │
│  ── Sync Log (gần đây) ──                                   │
│  ┌──────────┬──────────┬────────┬──────────┬───────────────┐│
│  │ Thời gian│ Type     │ KV ID  │ Status   │ Order         ││
│  ├──────────┼──────────┼────────┼──────────┼───────────────┤│
│  │ 10:23    │ Webhook  │ KV-891 │ ✅ OK    │ #DH-0046     ││
│  │ 10:15    │ Webhook  │ KV-890 │ ✅ OK    │ #DH-0045     ││
│  │ 09:45    │ Webhook  │ KV-889 │ ⚠️ Unmapped│ —           ││
│  │ 09:00    │ Manual   │ —      │ ✅ 5 synced│ —           ││
│  └──────────┴──────────┴────────┴──────────┴───────────────┘│
└──────────────────────────────────────────────────────────────┘
```

### 3.7 Negotiation Management (Admin)
```
┌──────────────────────────────────────────────────────────────┐
│  Thương lượng Phân bổ                                        │
│  Home > Phân bổ > Thương lượng                               │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  [Tất cả ▼] [Đang chờ NCC ▼] [Tháng 04/2026 ▼]            │
│                                                              │
│  ┌──────────┬──────────┬───────┬──────────┬────────┬───────┐│
│  │ NCC      │ Sản phẩm │ Vòng  │ Trạng    │ Deadline│       ││
│  │          │          │       │ thái     │        │       ││
│  ├──────────┼──────────┼───────┼──────────┼────────┼───────┤│
│  │ TT ABC   │ Bào ngư  │ 1/3   │ ⏳ Chờ   │ 14h    │[Xem] ││
│  │          │          │       │ NCC      │ còn    │       ││
│  ├──────────┼──────────┼───────┼──────────┼────────┼───────┤│
│  │ HTX XY   │ Nấm rơm  │ 2/3   │ 🔄 NCC   │ 36h    │[Xem] ││
│  │          │          │       │ counter  │ còn    │       ││
│  ├──────────┼──────────┼───────┼──────────┼────────┼───────┤│
│  │ Farm DL  │ Kim châm  │ —     │ ✅ Agreed│ —      │[Xem] ││
│  ├──────────┼──────────┼───────┼──────────┼────────┼───────┤│
│  │ NCC PY   │ Đùi gà   │ 3/3   │ 🚨Escalat│ —      │[Xem] ││
│  │          │          │       │ ed       │        │       ││
│  └──────────┴──────────┴───────┴──────────┴────────┴───────┘│
│                                                              │
│  ── Chi tiết: HTX XY — Nấm rơm (inline expand) ──          │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Phân bổ gốc: 800 kg  │  NCC đề xuất: 650 kg         │  │
│  │  Lý do: "Mùa này sản lượng giảm, max 650kg/tháng"    │  │
│  │                                                        │  │
│  │  [✅ Chấp nhận 650] [📝 Sửa lại] [❌ Từ chối]         │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

---

## 4. Key Screens — Supplier Portal

### 4.1 NCC Registration Flow (Multi-step)
```
┌──────────────────────────────────────────────────────────────┐
│  GM Supply — Đăng ký Nhà cung cấp              [Vi] [En]    │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Step:  ① Thông tin  ──  ② Sản phẩm  ──  ③ Tài liệu  ──  ④ Xác nhận│
│         [●]              [○]              [○]              [○]│
│                                                              │
│  ── Bước 1: Thông tin doanh nghiệp ──                       │
│                                                              │
│  Tên doanh nghiệp *    [                              ]     │
│  Mã số thuế *           [                              ]     │
│  Người đại diện *       [                              ]     │
│  Email *                [                              ]     │
│  Số điện thoại *        [                              ]     │
│  Địa chỉ trại          [                              ]     │
│  Vùng trồng             [Chọn vùng ▼]                       │
│  Diện tích (ha)         [        ]                           │
│                                                              │
│                                         [Tiếp theo →]       │
└──────────────────────────────────────────────────────────────┘
```

### 4.2 NCC Dashboard
```
┌──────────────────────────────────────────────────────────────┐
│  Logo  │  Dashboard | Phân bổ | Lịch | Giao hàng |         │
│        │  Điểm | Tin nhắn              [Vi/En] Nguyễn A ▼   │
├────────┴─────────────────────────────────────────────────────┤
│                                                              │
│  Xin chào, Trang trại ABC!                                  │
│                                                              │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌──────────┐ │
│  │ Xếp hạng   │ │ Điểm      │ │ Fill Rate  │ │ Tin nhắn │ │
│  │    A 🟢    │ │   92/100  │ │   95.2%   │ │  2 mới   │ │
│  └────────────┘ └────────────┘ └────────────┘ └──────────┘ │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐     │
│  │  ⚠️ Cần phản hồi (2)                                │     │
│  │                                                     │     │
│  │  📊 Phân bổ T04/2026 — Bào ngư: 800kg              │     │
│  │     Deadline: 14/03/2026 (còn 2 ngày)               │     │
│  │     [Xem & Phản hồi →]                              │     │
│  │                                                     │     │
│  │  📊 Phân bổ T04/2026 — Nấm rơm: 500kg              │     │
│  │     Deadline: 14/03/2026 (còn 2 ngày)               │     │
│  │     [Xem & Phản hồi →]                              │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                              │
│  ┌──────────────────────┐ ┌──────────────────────────┐      │
│  │  Giao hàng sắp tới   │ │  Tin nhắn gần đây        │      │
│  │                      │ │                          │      │
│  │  15/03 — Bào ngư     │ │  Procurement: Xác nhận   │      │
│  │         150kg         │ │  lịch giao tuần tới...  │      │
│  │  17/03 — Nấm rơm     │ │  12/03 10:30            │      │
│  │         200kg         │ │                          │      │
│  └──────────────────────┘ └──────────────────────────┘      │
└──────────────────────────────────────────────────────────────┘
```

### 4.3 Allocation Negotiation (Supplier)
```
┌──────────────────────────────────────────────────────────────┐
│  Phân bổ tháng 04/2026                                       │
│  Dashboard > Phân bổ > Chi tiết                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ⏰ Deadline phản hồi: 14/03/2026 14:00 (còn 1 ngày 4 giờ) │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐    │
│  │  Bào ngư — Loại 1                                    │    │
│  │                                                      │    │
│  │  Phân bổ: 800 kg/tháng                              │    │
│  │  Lịch giao: T2, T4, T6 (mỗi lần ~65kg)             │    │
│  │                                                      │    │
│  │  ○ Đồng ý 800 kg                                    │    │
│  │  ● Đề xuất điều chỉnh                               │    │
│  │                                                      │    │
│  │  Số lượng đề xuất: [  650  ] kg                     │    │
│  │  Lý do:  [Sản lượng mùa này giảm ▼]                 │    │
│  │  Ghi chú: [Max 650kg do thời tiết, cam kết tăng T5  │    │
│  │           ]                                          │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐    │
│  │  Nấm rơm — Loại 1                                    │    │
│  │  Phân bổ: 500 kg/tháng                              │    │
│  │                                                      │    │
│  │  ● Đồng ý 500 kg                                    │    │
│  │  ○ Đề xuất điều chỉnh                               │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                              │
│  ── Lịch sử thương lượng (Bào ngư) ──                       │
│  │ 12/03 10:00  Admin gửi phân bổ: 800kg                    │
│  │ 12/03 15:30  Bạn đề xuất: 650kg                          │
│  │ (hiện tại)   Chờ Admin phản hồi...                        │
│                                                              │
│                                    [Gửi phản hồi]           │
└──────────────────────────────────────────────────────────────┘
```

### 4.4 Harvest Schedule (Supplier)
```
┌──────────────────────────────────────────────────────────────┐
│  Lịch thu hoạch                      [Copy tuần trước]       │
│  Dashboard > Lịch thu hoạch          [Lưu]                  │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Tháng: [< 03/2026 >]     Sản phẩm: [Tất cả ▼]            │
│                                                              │
│  ┌─────┬─────┬─────┬─────┬─────┬─────┬─────┬──────────────┐│
│  │     │ T2  │ T3  │ T4  │ T5  │ T6  │ T7  │ CN           ││
│  │     │16/03│17/03│18/03│19/03│20/03│21/03│ 22/03        ││
│  ├─────┼─────┼─────┼─────┼─────┼─────┼─────┼──────────────┤│
│  │Bào  │[65] │[65] │[65] │[65] │[65] │[30] │ [—]          ││
│  │ngư  │     │     │     │     │     │     │              ││
│  ├─────┼─────┼─────┼─────┼─────┼─────┼─────┼──────────────┤│
│  │Nấm  │[80] │[80] │[80] │[80] │[80] │[50] │ [—]          ││
│  │rơm  │     │     │     │     │     │     │              ││
│  ├─────┼─────┼─────┼─────┼─────┼─────┼─────┼──────────────┤│
│  │Tổng │ 145 │ 145 │ 145 │ 145 │ 145 │  80 │  0           ││
│  └─────┴─────┴─────┴─────┴─────┴─────┴─────┴──────────────┘│
│                                                              │
│  Tổng tuần: 805 kg   │   Cam kết tháng: 1,300 kg            │
│  Đạt: 62% (tuần 3/4)                                        │
│                                                              │
│  ⚠️ Cần nhập lịch tuần 4 trước 19/03                        │
└──────────────────────────────────────────────────────────────┘
```

### 4.5 NCC Deliveries (Supplier)
```
┌──────────────────────────────────────────────────────────────┐
│  Giao hàng                              [Tháng 03/2026 ▼]   │
│  Dashboard > Giao hàng                                       │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────┬──────────┬─────────┬──────────┬────────┬───────┐│
│  │ Ngày   │ Sản phẩm │ SL giao │ SL nhận  │ QC     │       ││
│  ├────────┼──────────┼─────────┼──────────┼────────┼───────┤│
│  │ 12/03  │ Bào ngư  │  65 kg  │  63 kg   │ ✅ L1  │ [Chi  ││
│  │        │          │         │          │        │  tiết]││
│  ├────────┼──────────┼─────────┼──────────┼────────┼───────┤│
│  │ 12/03  │ Nấm rơm  │  80 kg  │  78 kg   │ ✅ L1  │ [Chi  ││
│  │        │          │         │          │        │  tiết]││
│  ├────────┼──────────┼─────────┼──────────┼────────┼───────┤│
│  │ 10/03  │ Bào ngư  │  65 kg  │  60 kg   │ ⚠️ L2  │ [Chi  ││
│  │        │          │         │          │        │  tiết]││
│  └────────┴──────────┴─────────┴──────────┴────────┴───────┘│
│                                                              │
│  ── Chi tiết: 10/03 Bào ngư (expand) ──                     │
│  ┌──────────────────────────────────────────────────────┐    │
│  │  Đặt: 65kg → Nhận: 60kg (hao hụt: 7.7%)            │    │
│  │  QC: Phân loại lại → Loại 2 (kích thước nhỏ)       │    │
│  │  Đánh giá: ⭐⭐⭐ (3/5)                              │    │
│  │  Ghi chú: "Kích thước không đồng đều"               │    │
│  └──────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────┘
```

### 4.6 NCC Performance / Score (Supplier)
```
┌──────────────────────────────────────────────────────────────┐
│  Điểm đánh giá                                              │
│  Dashboard > Điểm                                            │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐  ┌──────────────────────────────────┐ │
│  │  Xếp hạng: A 🟢  │  │         Radar Chart              │ │
│  │  Điểm: 92/100    │  │                                  │ │
│  │                   │  │        OTD (95)                  │ │
│  │  Top 3 NCC       │  │       ╱        ╲                 │ │
│  │  trong hệ thống  │  │ Flex ╱    ████   ╲ Fill Rate    │ │
│  │                   │  │ (88)╲    ████   ╱ (96)          │ │
│  │                   │  │       ╲        ╱                 │ │
│  │                   │  │        Price(85)                 │ │
│  │                   │  │       Quality(94)                │ │
│  └──────────────────┘  └──────────────────────────────────┘ │
│                                                              │
│  ── Xu hướng 6 tháng ──                                     │
│  ┌──────────────────────────────────────────────────────┐    │
│  │  100 ┤                                                │    │
│  │   90 ┤  ──●──●──●──●──●──●                           │    │
│  │   80 ┤                                                │    │
│  │   70 ┤                                                │    │
│  │      └──T10──T11──T12──T01──T02──T03                 │    │
│  │      Điểm: 88 → 90 → 89 → 91 → 92 → 92              │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                              │
│  ── Chi tiết tiêu chí ──                                    │
│  ┌──────────────────┬────────┬──────┬──────────────────┐    │
│  │ Tiêu chí         │ Trọng số│ Điểm │ Ghi chú          │    │
│  ├──────────────────┼────────┼──────┼──────────────────┤    │
│  │ Giao đúng hẹn   │  25%   │  95  │ 19/20 lần đúng   │    │
│  │ Đủ số lượng     │  25%   │  96  │ TB 97% fill rate  │    │
│  │ Chất lượng      │  30%   │  94  │ 1 lần hạ loại    │    │
│  │ Giá cạnh tranh  │  10%   │  85  │ Cao hơn TB 5%    │    │
│  │ Linh hoạt       │  10%   │  88  │ 2/3 lần ứng gấp  │    │
│  └──────────────────┴────────┴──────┴──────────────────┘    │
└──────────────────────────────────────────────────────────────┘
```

### 4.7 Messaging (Both Portals)
```
┌──────────────────────────────────────────────────────────────┐
│  Tin nhắn                                    [+ Tin nhắn mới]│
├──────────────┬───────────────────────────────────────────────┤
│              │                                               │
│  [🔍 Tìm...] │  Phân bổ T04 — Bào ngư                      │
│              │  Liên kết: Phân bổ #PB-0023                  │
│  ┌──────────┐│                                               │
│  │ 📊 Phân  ││  ┌─────────────────────────────────────┐     │
│  │ bổ T04   ││  │ Admin (Lan)           12/03 10:30   │     │
│  │ Bào ngư  ││  │ Xin chào TT ABC, phân bổ T04 đã    │     │
│  │ 🔵 2 mới ││  │ được gửi. Vui lòng phản hồi trước  │     │
│  ├──────────┤│  │ 14/03.                              │     │
│  │ 🚚 Giao  ││  └─────────────────────────────────────┘     │
│  │ hàng     ││                                               │
│  │ 10/03    ││  ┌─────────────────────────────────────┐     │
│  │          ││  │ TT ABC (Nguyễn A)    12/03 15:45   │     │
│  ├──────────┤│  │ Đã nhận. Tôi sẽ phản hồi trước     │     │
│  │ 📋 Đăng  ││  │ deadline. Có thể hỏi thêm về lịch  │     │
│  │ ký NCC   ││  │ giao cụ thể?                        │     │
│  │ mới      ││  └─────────────────────────────────────┘     │
│  │ ✅ Closed ││                                               │
│  └──────────┘│  ┌──────────────────────────────────────┐    │
│              │  │ [Nhập tin nhắn...          ] [Gửi]  │    │
│              │  │ [📎 Đính kèm]                        │    │
│              │  └──────────────────────────────────────┘    │
└──────────────┴───────────────────────────────────────────────┘
```

---

## 5. Design Tokens (shadcn/ui theme)

### 5.1 Colors

| Token | Value | Dùng cho |
|-------|-------|---------|
| Primary (Admin) | `hsl(142, 76%, 36%)` — Green | Admin Portal buttons, links, active states |
| Primary (Supplier) | `hsl(174, 72%, 40%)` — Teal | Supplier Portal accent, buttons, active nav |
| Secondary | `hsl(217, 91%, 60%)` — Blue | Info badges, secondary actions |
| Destructive | `hsl(0, 84%, 60%)` — Red | Delete, reject, critical alerts |
| Warning | `hsl(38, 92%, 50%)` — Amber | Expiry warnings, medium alerts, deadline approaching |
| Success | `hsl(142, 71%, 45%)` — Green | Confirmed, approved, on-time |
| Muted | `hsl(210, 40%, 96%)` | Backgrounds, disabled |

### 5.2 Portal Badge Colors

| Portal | Indicator | Usage |
|--------|-----------|-------|
| Admin Portal | Green sidebar accent | Visible in layout header/sidebar |
| Supplier Portal | Teal top-nav accent | Visible in top navigation bar |

### 5.3 Status Colors

| Status | Color | Badge |
|--------|-------|-------|
| Rank A | 🟢 Green | `bg-green-100 text-green-800` |
| Rank B | 🔵 Blue | `bg-blue-100 text-blue-800` |
| Rank C | 🟡 Yellow | `bg-yellow-100 text-yellow-800` |
| Rank D | 🔴 Red | `bg-red-100 text-red-800` |
| Đang xử lý | Blue | Outline badge |
| Hoàn thành | Green | Solid badge |
| Hủy | Gray | Strikethrough |
| Negotiation — Chờ NCC | Amber | Outline badge, pulse animation |
| Negotiation — Counter | Blue | Solid badge |
| Negotiation — Agreed | Green | Solid badge with checkmark |
| Negotiation — Escalated | Red | Solid badge with warning icon |

### 5.4 Typography
- Font: `Inter` (Latin) + `Be Vietnam Pro` (Vietnamese)
- Size scale: 12/14/16/18/20/24/30px
- Table body: 14px, Header: 14px semibold

---

## 6. i18n Architecture

### 6.1 File Structure
```
src/i18n/
├── vi.json              # Vietnamese (default)
├── en.json              # English
└── config.ts            # i18n configuration
```

### 6.2 Key Naming Convention
```json
{
  "common": {
    "save": "Lưu",
    "cancel": "Hủy",
    "confirm": "Xác nhận",
    "back": "Quay lại",
    "next": "Tiếp theo"
  },
  "supplier": {
    "dashboard": {
      "title": "Tổng quan",
      "welcome": "Xin chào, {name}!",
      "rank": "Xếp hạng",
      "score": "Điểm"
    },
    "allocation": {
      "title": "Phân bổ chỉ tiêu",
      "agree": "Đồng ý",
      "counterPropose": "Đề xuất điều chỉnh",
      "deadline": "Hạn phản hồi"
    }
  }
}
```

### 6.3 Language Switcher Spec
- Location: Supplier Portal top navigation (always visible)
- Format: `[Vi]` / `[En]` toggle buttons
- Behavior: Instant switch (no page reload), preference saved to user profile (`preferred_language`)
- Scope: Phase 1 — Supplier Portal only (~8 pages). Admin Portal stays Vietnamese.

### 6.4 Date/Number Formatting
| Locale | Date | Number | Currency |
|--------|------|--------|----------|
| vi | 12/03/2026 | 1.234,56 | 1.234.000 đ |
| en | 03/12/2026 | 1,234.56 | VND 1,234,000 |

---

## 7. Portal Routing & Auth Guard

### 7.1 Route Groups
```
(auth)/     → Public routes (login, register, verify-email)
(admin)/    → Admin Portal (requires portal_type='admin')
(supplier)/ → Supplier Portal (requires portal_type='supplier')
```

### 7.2 Auth Guard Logic
```
1. User logs in → JWT includes portal_type + role
2. Middleware checks:
   - (admin)/ routes → portal_type must be 'admin'
   - (supplier)/ routes → portal_type must be 'supplier'
   - Mismatch → redirect to correct portal's dashboard
3. After login, auto-redirect:
   - Admin users → /admin (dashboard)
   - Supplier users → /supplier (NCC dashboard)
```

### 7.3 Permission-Based Rendering
```
- Use <PortalGuard portal="admin"> for admin-only components
- Use <RoleGuard roles={['Manager', 'Director']}> for role-specific actions
- Supplier Portal: NCC Owner sees negotiate/edit buttons; NCC Staff sees read-only
```

---

## 8. Responsive Breakpoints

| Breakpoint | Width | Target |
|-----------|-------|--------|
| sm | ≥640px | Mobile landscape |
| md | ≥768px | Tablet portrait |
| lg | ≥1024px | Tablet landscape / Small desktop |
| xl | ≥1280px | Desktop |
| 2xl | ≥1536px | Large desktop |

Priority: **lg** (tablet landscape) và **xl** (desktop) là hai target chính.
Admin Portal: optimized cho xl. Supplier Portal: optimized cho md-lg (tablet-friendly).
