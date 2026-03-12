# UI/UX Design Specification
# GM Supply — Supply Chain Management

> Thiết kế đơn giản, tập trung vào chức năng, dễ dùng cho nhân viên kho/thu mua

---

## 1. Design Principles

| Nguyên tắc | Áp dụng |
|-----------|---------|
| **Data-first** | Dashboard và bảng dữ liệu là trung tâm, không phải hình ảnh |
| **Action-oriented** | Mỗi màn hình có hành động chính rõ ràng (nút primary) |
| **Minimal clicks** | Tối đa 3 click để đến hành động thường dùng |
| **Mobile-friendly** | Tablet-first cho nhân viên kho, desktop cho quản lý |
| **Vietnamese-first** | Toàn bộ UI bằng tiếng Việt, dùng thuật ngữ ngành |
| **Alert-driven** | Cảnh báo chủ động (hết hạn, hao hụt, thiếu hụt) |

---

## 2. Layout Structure

### 2.1 Desktop Layout (≥1024px)
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

### 2.2 Tablet Layout (768-1023px)
- Sidebar collapsed (icons only, expand on tap)
- Content full width
- Tables scroll horizontally

### 2.3 Navigation Structure
```
📊 Tổng quan (Dashboard)
📦 Nhà cung cấp
   ├── Danh sách NCC
   ├── Sản phẩm NCC
   └── Điểm & Xếp hạng
📋 Đơn hàng
   ├── Danh sách đơn hàng
   ├── Nhập từ Excel
   └── Khách hàng
📊 Phân bổ
   ├── Kế hoạch tháng
   ├── Phân bổ ngày
   └── Quy tắc phân bổ
🏭 Kho
   ├── Tồn kho
   ├── Nhập/Xuất kho
   └── Hàng sắp hết hạn
📈 Báo cáo
   ├── Cung - Cầu
   ├── Hiệu suất NCC
   └── Hao hụt
⚙️ Quản trị
   ├── Người dùng
   ├── Danh mục nấm
   └── Cấu hình
```

---

## 3. Key Screens

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

---

## 4. Design Tokens (shadcn/ui theme)

### 4.1 Colors

| Token | Value | Dùng cho |
|-------|-------|---------|
| Primary | `hsl(142, 76%, 36%)` — Green | Buttons, links, active states (nấm = xanh lá) |
| Secondary | `hsl(217, 91%, 60%)` — Blue | Info badges, secondary actions |
| Destructive | `hsl(0, 84%, 60%)` — Red | Delete, reject, critical alerts |
| Warning | `hsl(38, 92%, 50%)` — Amber | Expiry warnings, medium alerts |
| Success | `hsl(142, 71%, 45%)` — Green | Confirmed, approved, on-time |
| Muted | `hsl(210, 40%, 96%)` | Backgrounds, disabled |

### 4.2 Status Colors

| Status | Color | Badge |
|--------|-------|-------|
| Rank A | 🟢 Green | `bg-green-100 text-green-800` |
| Rank B | 🔵 Blue | `bg-blue-100 text-blue-800` |
| Rank C | 🟡 Yellow | `bg-yellow-100 text-yellow-800` |
| Rank D | 🔴 Red | `bg-red-100 text-red-800` |
| Đang xử lý | Blue | Outline badge |
| Hoàn thành | Green | Solid badge |
| Hủy | Gray | Strikethrough |

### 4.3 Typography
- Font: `Inter` (Latin) + `Be Vietnam Pro` (Vietnamese)
- Size scale: 12/14/16/18/20/24/30px
- Table body: 14px, Header: 14px semibold

---

## 5. Responsive Breakpoints

| Breakpoint | Width | Target |
|-----------|-------|--------|
| sm | ≥640px | Mobile landscape |
| md | ≥768px | Tablet portrait |
| lg | ≥1024px | Tablet landscape / Small desktop |
| xl | ≥1280px | Desktop |
| 2xl | ≥1536px | Large desktop |

Priority: **lg** (tablet landscape) và **xl** (desktop) là hai target chính.
