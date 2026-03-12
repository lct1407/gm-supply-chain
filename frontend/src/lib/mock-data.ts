// ============================================================
// Mock Data for Admin Portal — Development Only
// ============================================================

import type {
  User, Product, QualityGrade, Unit, Supplier, SupplierProduct, SupplierScore,
  Customer, Order, OrderItem, AllocationPlan, Allocation, Delivery,
  InventoryLot, InventoryMovement, QcInspection, MessageThread, Message,
  SupplierRegistration, KiotVietSyncLog, KiotVietProductMapping, AuditLog,
} from "@/types";

// --- Users ---
export const mockUsers: User[] = [
  { id: "u1", email: "admin@namxanh.vn", full_name: "Nguyễn Văn Admin", role: "admin", portal_type: "admin", preferred_language: "vi", supplier_id: null, is_active: true, email_verified_at: "2026-01-01T00:00:00Z", last_login: "2026-03-12T08:00:00Z", created_at: "2026-01-01T00:00:00Z", updated_at: "2026-03-12T08:00:00Z", deleted_at: null },
  { id: "u2", email: "director@namxanh.vn", full_name: "Trần Thị Director", role: "director", portal_type: "admin", preferred_language: "vi", supplier_id: null, is_active: true, email_verified_at: "2026-01-01T00:00:00Z", last_login: "2026-03-11T10:00:00Z", created_at: "2026-01-01T00:00:00Z", updated_at: "2026-03-11T10:00:00Z", deleted_at: null },
  { id: "u3", email: "manager@namxanh.vn", full_name: "Lê Văn Manager", role: "manager", portal_type: "admin", preferred_language: "vi", supplier_id: null, is_active: true, email_verified_at: "2026-01-01T00:00:00Z", last_login: "2026-03-12T07:30:00Z", created_at: "2026-01-01T00:00:00Z", updated_at: "2026-03-12T07:30:00Z", deleted_at: null },
  { id: "u4", email: "procurement@namxanh.vn", full_name: "Phạm Thị Lan", role: "procurement_staff", portal_type: "admin", preferred_language: "vi", supplier_id: null, is_active: true, email_verified_at: "2026-01-01T00:00:00Z", last_login: "2026-03-12T08:15:00Z", created_at: "2026-01-15T00:00:00Z", updated_at: "2026-03-12T08:15:00Z", deleted_at: null },
  { id: "u5", email: "qc@namxanh.vn", full_name: "Hoàng Văn QC", role: "qc_staff", portal_type: "admin", preferred_language: "vi", supplier_id: null, is_active: true, email_verified_at: "2026-01-01T00:00:00Z", last_login: "2026-03-12T06:00:00Z", created_at: "2026-01-15T00:00:00Z", updated_at: "2026-03-12T06:00:00Z", deleted_at: null },
  { id: "u6", email: "warehouse@namxanh.vn", full_name: "Đỗ Văn Kho", role: "warehouse_staff", portal_type: "admin", preferred_language: "vi", supplier_id: null, is_active: true, email_verified_at: "2026-01-01T00:00:00Z", last_login: "2026-03-12T05:30:00Z", created_at: "2026-02-01T00:00:00Z", updated_at: "2026-03-12T05:30:00Z", deleted_at: null },
  { id: "u7", email: "viewer@namxanh.vn", full_name: "Ngô Thị Xem", role: "viewer", portal_type: "admin", preferred_language: "vi", supplier_id: null, is_active: true, email_verified_at: "2026-01-01T00:00:00Z", last_login: "2026-03-10T09:00:00Z", created_at: "2026-02-01T00:00:00Z", updated_at: "2026-03-10T09:00:00Z", deleted_at: null },
  { id: "u8", email: "ncc_abc@gmail.com", full_name: "Nguyễn A (TT ABC)", role: "ncc_owner", portal_type: "supplier", preferred_language: "vi", supplier_id: "s1", is_active: true, email_verified_at: "2026-02-01T00:00:00Z", last_login: "2026-03-12T09:00:00Z", created_at: "2026-02-01T00:00:00Z", updated_at: "2026-03-12T09:00:00Z", deleted_at: null },
  { id: "u9", email: "inactive@namxanh.vn", full_name: "Vũ Văn Cũ", role: "procurement_staff", portal_type: "admin", preferred_language: "vi", supplier_id: null, is_active: false, email_verified_at: "2026-01-01T00:00:00Z", last_login: "2026-01-15T00:00:00Z", created_at: "2026-01-01T00:00:00Z", updated_at: "2026-02-01T00:00:00Z", deleted_at: null },
];

// --- Products ---
export const mockProducts: Product[] = [
  { id: "p1", name: "Nấm rơm", category: "Nấm tươi", shelf_life_days: 3, shrinkage_rate: 0.08, temp_min: 4, temp_max: 8, is_active: true, created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z", deleted_at: null },
  { id: "p2", name: "Nấm bào ngư", category: "Nấm tươi", shelf_life_days: 7, shrinkage_rate: 0.05, temp_min: 2, temp_max: 6, is_active: true, created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z", deleted_at: null },
  { id: "p3", name: "Nấm đùi gà", category: "Nấm tươi", shelf_life_days: 10, shrinkage_rate: 0.04, temp_min: 2, temp_max: 6, is_active: true, created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z", deleted_at: null },
  { id: "p4", name: "Nấm kim châm", category: "Nấm tươi", shelf_life_days: 14, shrinkage_rate: 0.03, temp_min: 2, temp_max: 4, is_active: true, created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z", deleted_at: null },
  { id: "p5", name: "Nấm linh chi", category: "Nấm dược liệu", shelf_life_days: 30, shrinkage_rate: 0.02, temp_min: 15, temp_max: 25, is_active: true, created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z", deleted_at: null },
  { id: "p6", name: "Nấm mèo", category: "Nấm tươi", shelf_life_days: 5, shrinkage_rate: 0.06, temp_min: 4, temp_max: 8, is_active: true, created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z", deleted_at: null },
  { id: "p7", name: "Nấm hương", category: "Nấm tươi", shelf_life_days: 7, shrinkage_rate: 0.05, temp_min: 2, temp_max: 6, is_active: false, created_at: "2026-01-01T00:00:00Z", updated_at: "2026-03-01T00:00:00Z", deleted_at: null },
];

// --- Quality Grades ---
export const mockQualityGrades: QualityGrade[] = [
  { id: "qg1", code: "L1", name: "Loại 1", description: "Chất lượng cao nhất, kích thước đồng đều, không tạp chất", created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z", deleted_at: null },
  { id: "qg2", code: "L2", name: "Loại 2", description: "Chất lượng tốt, kích thước chấp nhận được, ít tạp chất", created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z", deleted_at: null },
  { id: "qg3", code: "L3", name: "Loại 3", description: "Chất lượng trung bình, kích thước không đều", created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z", deleted_at: null },
];

// --- Units ---
export const mockUnits: Unit[] = [
  { id: "un1", name: "kg", conversion_rate: 1, created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z", deleted_at: null },
  { id: "un2", name: "thùng (5kg)", conversion_rate: 5, created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z", deleted_at: null },
  { id: "un3", name: "bó", conversion_rate: 0.5, created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z", deleted_at: null },
];

// --- Suppliers ---
export const mockSuppliers: Supplier[] = [
  { id: "s1", code: "NCC-001", name: "Trang trại ABC", address: "Đà Lạt, Lâm Đồng", tax_code: "0123456789", contact_name: "Nguyễn Văn A", contact_phone: "0901234567", contact_email: "abc@farm.vn", farm_location: "Đà Lạt", farm_area: 5.2, status: "active", started_at: "2025-01-15", score: 92, rank: "A", created_at: "2025-01-15T00:00:00Z", updated_at: "2026-03-10T00:00:00Z", deleted_at: null },
  { id: "s2", code: "NCC-002", name: "HTX Nấm Củ Chi", address: "Củ Chi, TP.HCM", tax_code: "0987654321", contact_name: "Trần Thị B", contact_phone: "0912345678", contact_email: "htx@ncc.vn", farm_location: "Củ Chi", farm_area: 3.0, status: "active", started_at: "2025-03-01", score: 85, rank: "A", created_at: "2025-03-01T00:00:00Z", updated_at: "2026-03-08T00:00:00Z", deleted_at: null },
  { id: "s3", code: "NCC-003", name: "Farm Đà Lạt Green", address: "Đơn Dương, Lâm Đồng", tax_code: "1122334455", contact_name: "Lê Văn C", contact_phone: "0923456789", contact_email: "green@farm.vn", farm_location: "Đà Lạt", farm_area: 2.5, status: "active", started_at: "2025-05-01", score: 78, rank: "B", created_at: "2025-05-01T00:00:00Z", updated_at: "2026-03-05T00:00:00Z", deleted_at: null },
  { id: "s4", code: "NCC-004", name: "NCC Phú Yên", address: "Tuy Hòa, Phú Yên", tax_code: "5566778899", contact_name: "Phạm Văn D", contact_phone: "0934567890", contact_email: "phuyen@ncc.vn", farm_location: "Phú Yên", farm_area: 4.0, status: "active", started_at: "2025-06-01", score: 71, rank: "B", created_at: "2025-06-01T00:00:00Z", updated_at: "2026-03-02T00:00:00Z", deleted_at: null },
  { id: "s5", code: "NCC-005", name: "Trang trại Minh Tân", address: "Long An", tax_code: "9988776655", contact_name: "Hoàng Minh E", contact_phone: "0945678901", contact_email: "minhtan@farm.vn", farm_location: "Long An", farm_area: 1.8, status: "inactive", started_at: "2025-02-01", score: 62, rank: "C", created_at: "2025-02-01T00:00:00Z", updated_at: "2026-02-15T00:00:00Z", deleted_at: null },
  { id: "s6", code: "NCC-006", name: "NCC Kim Sơn", address: "Ninh Bình", tax_code: "3344556677", contact_name: "Vũ Thị F", contact_phone: "0956789012", contact_email: "kimson@ncc.vn", farm_location: "Ninh Bình", farm_area: 2.0, status: "suspended", started_at: "2025-04-01", score: 48, rank: "D", created_at: "2025-04-01T00:00:00Z", updated_at: "2026-01-20T00:00:00Z", deleted_at: null },
];

// --- Customers ---
export const mockCustomers: Customer[] = [
  { id: "c1", code: "KH-001", name: "Siêu thị CoopMart", type: "sieu_thi", priority_level: 1, rsl_requirement: 0.7, address: "Q.1, TP.HCM", contact_name: "Nguyễn Thị X", contact_phone: "0281234567", contact_email: "procurement@coopmart.vn", created_at: "2025-01-01T00:00:00Z", updated_at: "2026-03-01T00:00:00Z", deleted_at: null },
  { id: "c2", code: "KH-002", name: "Nhà hàng Sen Vàng", type: "nha_hang", priority_level: 2, rsl_requirement: 0.5, address: "Q.3, TP.HCM", contact_name: "Trần Văn Y", contact_phone: "0289876543", contact_email: "bep@senvang.vn", created_at: "2025-01-15T00:00:00Z", updated_at: "2026-02-20T00:00:00Z", deleted_at: null },
  { id: "c3", code: "KH-003", name: "Đại lý Thanh Hà", type: "dai_ly", priority_level: 3, rsl_requirement: 0.5, address: "Bình Dương", contact_name: "Lê Thanh Z", contact_phone: "0274123456", contact_email: "thanhha@daily.vn", created_at: "2025-02-01T00:00:00Z", updated_at: "2026-03-05T00:00:00Z", deleted_at: null },
  { id: "c4", code: "KH-004", name: "Export FreshViet", type: "xuat_khau", priority_level: 1, rsl_requirement: 0.8, address: "Q.7, TP.HCM", contact_name: "Phạm Quang W", contact_phone: "0287654321", contact_email: "order@freshviet.com", created_at: "2025-03-01T00:00:00Z", updated_at: "2026-03-10T00:00:00Z", deleted_at: null },
  { id: "c5", code: "KH-005", name: "Bán lẻ chợ Bà Chiểu", type: "le", priority_level: 4, rsl_requirement: 0.3, address: "Bình Thạnh, TP.HCM", contact_name: "Đỗ Thị V", contact_phone: "0901122334", contact_email: "v@gmail.com", created_at: "2025-04-01T00:00:00Z", updated_at: "2026-02-01T00:00:00Z", deleted_at: null },
];

// --- Orders ---
export const mockOrders: Order[] = [
  { id: "o1", code: "DH-0045", customer_id: "c1", customer: mockCustomers[0], status: "new", priority: 1, ordered_at: "2026-03-12T08:00:00Z", delivery_date: "2026-03-15", delivery_address: "Q.1, TP.HCM", notes: "", source: "kiotviet", external_id: "KV-891", created_by: "u4", items: [], created_at: "2026-03-12T08:00:00Z", updated_at: "2026-03-12T08:00:00Z", deleted_at: null },
  { id: "o2", code: "DH-0044", customer_id: "c2", customer: mockCustomers[1], status: "allocated", priority: 2, ordered_at: "2026-03-11T14:00:00Z", delivery_date: "2026-03-14", delivery_address: "Q.3, TP.HCM", notes: "Giao trước 10h sáng", source: "manual", external_id: null, created_by: "u4", items: [], created_at: "2026-03-11T14:00:00Z", updated_at: "2026-03-12T09:00:00Z", deleted_at: null },
  { id: "o3", code: "DH-0043", customer_id: "c3", customer: mockCustomers[2], status: "preparing", priority: 3, ordered_at: "2026-03-11T10:00:00Z", delivery_date: "2026-03-13", delivery_address: "Bình Dương", notes: "", source: "excel", external_id: null, created_by: "u4", items: [], created_at: "2026-03-11T10:00:00Z", updated_at: "2026-03-12T06:00:00Z", deleted_at: null },
  { id: "o4", code: "DH-0042", customer_id: "c4", customer: mockCustomers[3], status: "delivering", priority: 1, ordered_at: "2026-03-10T09:00:00Z", delivery_date: "2026-03-12", delivery_address: "Q.7, TP.HCM", notes: "Cần chứng từ xuất khẩu", source: "manual", external_id: null, created_by: "u4", items: [], created_at: "2026-03-10T09:00:00Z", updated_at: "2026-03-12T05:00:00Z", deleted_at: null },
  { id: "o5", code: "DH-0041", customer_id: "c1", customer: mockCustomers[0], status: "completed", priority: 1, ordered_at: "2026-03-09T08:00:00Z", delivery_date: "2026-03-11", delivery_address: "Q.1, TP.HCM", notes: "", source: "kiotviet", external_id: "KV-885", created_by: "u4", items: [], created_at: "2026-03-09T08:00:00Z", updated_at: "2026-03-11T15:00:00Z", deleted_at: null },
  { id: "o6", code: "DH-0040", customer_id: "c5", customer: mockCustomers[4], status: "cancelled", priority: 4, ordered_at: "2026-03-08T10:00:00Z", delivery_date: "2026-03-10", delivery_address: "Bình Thạnh", notes: "Khách hủy", source: "manual", external_id: null, created_by: "u4", items: [], created_at: "2026-03-08T10:00:00Z", updated_at: "2026-03-09T08:00:00Z", deleted_at: null },
];

// --- Registrations ---
export const mockRegistrations: SupplierRegistration[] = [
  { id: "r1", business_name: "Trang trại Hòa Bình", tax_code: "0112233445", contact_name: "Nguyễn Hòa", contact_email: "hoa@farm.vn", contact_phone: "0967891234", farm_location: "Hòa Bình", farm_area: 2.0, products: [{ product_name: "Nấm rơm", capacity_monthly: 300, quality: "L1" }, { product_name: "Nấm bào ngư", capacity_monthly: 200, quality: "L1" }], documents: [{ type: "GPKD", url: "/docs/gpkd.pdf", name: "GPKD.pdf" }, { type: "Chứng nhận", url: "/docs/cert.jpg", name: "Chứng nhận ATTP.jpg" }], status: "pending", reviewed_by: null, reviewed_at: null, review_notes: null, email_verified_at: "2026-03-10T10:00:00Z", created_at: "2026-03-10T09:00:00Z", updated_at: "2026-03-10T10:00:00Z", deleted_at: null },
  { id: "r2", business_name: "Farm Sài Gòn Xanh", tax_code: "0223344556", contact_name: "Trần Bình", contact_email: "binh@sgx.vn", contact_phone: "0978901234", farm_location: "Củ Chi, TP.HCM", farm_area: 1.5, products: [{ product_name: "Nấm đùi gà", capacity_monthly: 400, quality: "L1" }], documents: [{ type: "GPKD", url: "/docs/gpkd2.pdf", name: "GPKD.pdf" }], status: "pending", reviewed_by: null, reviewed_at: null, review_notes: null, email_verified_at: "2026-03-11T08:00:00Z", created_at: "2026-03-11T07:00:00Z", updated_at: "2026-03-11T08:00:00Z", deleted_at: null },
  { id: "r3", business_name: "NCC Bến Tre Mushroom", tax_code: "0334455667", contact_name: "Lê Cẩm", contact_email: "cam@bentre.vn", contact_phone: "0989012345", farm_location: "Bến Tre", farm_area: 3.0, products: [{ product_name: "Nấm mèo", capacity_monthly: 500, quality: "L2" }], documents: [{ type: "GPKD", url: "/docs/gpkd3.pdf", name: "GPKD.pdf" }, { type: "Chứng nhận", url: "/docs/cert3.pdf", name: "VietGAP.pdf" }], status: "approved", reviewed_by: "u3", reviewed_at: "2026-03-08T14:00:00Z", review_notes: "Đã xác minh, tạo NCC-007", email_verified_at: "2026-03-06T10:00:00Z", created_at: "2026-03-05T09:00:00Z", updated_at: "2026-03-08T14:00:00Z", deleted_at: null },
];

// --- Supplier Products ---
export const mockSupplierProducts: SupplierProduct[] = [
  { id: "sp1", supplier_id: "s1", product_id: "p1", product: mockProducts[0], quality_grade_id: "qg1", quality_grade: mockQualityGrades[0], max_capacity_monthly: 500, price: 45000, price_effective_date: "2026-01-01", lead_time_days: 1, shrinkage_rate: 0.06, created_at: "2025-01-15T00:00:00Z", updated_at: "2026-03-01T00:00:00Z", deleted_at: null },
  { id: "sp2", supplier_id: "s1", product_id: "p2", product: mockProducts[1], quality_grade_id: "qg1", quality_grade: mockQualityGrades[0], max_capacity_monthly: 300, price: 55000, price_effective_date: "2026-01-01", lead_time_days: 1, shrinkage_rate: 0.04, created_at: "2025-01-15T00:00:00Z", updated_at: "2026-03-01T00:00:00Z", deleted_at: null },
  { id: "sp3", supplier_id: "s1", product_id: "p3", product: mockProducts[2], quality_grade_id: "qg2", quality_grade: mockQualityGrades[1], max_capacity_monthly: 200, price: 65000, price_effective_date: "2026-02-01", lead_time_days: 2, shrinkage_rate: 0.03, created_at: "2025-03-01T00:00:00Z", updated_at: "2026-02-01T00:00:00Z", deleted_at: null },
  { id: "sp4", supplier_id: "s2", product_id: "p2", product: mockProducts[1], quality_grade_id: "qg1", quality_grade: mockQualityGrades[0], max_capacity_monthly: 400, price: 52000, price_effective_date: "2026-01-01", lead_time_days: 1, shrinkage_rate: 0.05, created_at: "2025-03-01T00:00:00Z", updated_at: "2026-03-01T00:00:00Z", deleted_at: null },
  { id: "sp5", supplier_id: "s2", product_id: "p4", product: mockProducts[3], quality_grade_id: "qg1", quality_grade: mockQualityGrades[0], max_capacity_monthly: 600, price: 40000, price_effective_date: "2026-01-01", lead_time_days: 2, shrinkage_rate: 0.02, created_at: "2025-03-01T00:00:00Z", updated_at: "2026-03-01T00:00:00Z", deleted_at: null },
  { id: "sp6", supplier_id: "s3", product_id: "p1", product: mockProducts[0], quality_grade_id: "qg2", quality_grade: mockQualityGrades[1], max_capacity_monthly: 250, price: 42000, price_effective_date: "2026-01-01", lead_time_days: 2, shrinkage_rate: 0.07, created_at: "2025-05-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z", deleted_at: null },
  { id: "sp7", supplier_id: "s3", product_id: "p6", product: mockProducts[5], quality_grade_id: "qg2", quality_grade: mockQualityGrades[1], max_capacity_monthly: 150, price: 38000, price_effective_date: "2026-01-01", lead_time_days: 2, shrinkage_rate: 0.05, created_at: "2025-05-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z", deleted_at: null },
];

// --- Supplier Scores ---
export const mockSupplierScores: SupplierScore[] = [
  { id: "ss1", supplier_id: "s1", period: "2026-02", otd_score: 95, fill_rate_score: 90, quality_score: 92, price_score: 88, flexibility_score: 95, total_score: 92, rank: "A", created_at: "2026-03-01T00:00:00Z", updated_at: "2026-03-01T00:00:00Z", deleted_at: null },
  { id: "ss2", supplier_id: "s2", period: "2026-02", otd_score: 88, fill_rate_score: 85, quality_score: 90, price_score: 80, flexibility_score: 82, total_score: 85, rank: "A", created_at: "2026-03-01T00:00:00Z", updated_at: "2026-03-01T00:00:00Z", deleted_at: null },
  { id: "ss3", supplier_id: "s3", period: "2026-02", otd_score: 75, fill_rate_score: 80, quality_score: 78, price_score: 82, flexibility_score: 75, total_score: 78, rank: "B", created_at: "2026-03-01T00:00:00Z", updated_at: "2026-03-01T00:00:00Z", deleted_at: null },
  { id: "ss4", supplier_id: "s4", period: "2026-02", otd_score: 70, fill_rate_score: 72, quality_score: 68, price_score: 78, flexibility_score: 67, total_score: 71, rank: "B", created_at: "2026-03-01T00:00:00Z", updated_at: "2026-03-01T00:00:00Z", deleted_at: null },
  { id: "ss5", supplier_id: "s5", period: "2026-02", otd_score: 60, fill_rate_score: 65, quality_score: 58, price_score: 70, flexibility_score: 57, total_score: 62, rank: "C", created_at: "2026-03-01T00:00:00Z", updated_at: "2026-03-01T00:00:00Z", deleted_at: null },
  { id: "ss6", supplier_id: "s6", period: "2026-02", otd_score: 45, fill_rate_score: 50, quality_score: 42, price_score: 55, flexibility_score: 48, total_score: 48, rank: "D", created_at: "2026-03-01T00:00:00Z", updated_at: "2026-03-01T00:00:00Z", deleted_at: null },
];

// --- Supplier Deliveries (mock) ---
export const mockDeliveries: Delivery[] = [
  { id: "d1", supplier_id: "s1", supplier: mockSuppliers[0], allocation_id: "a1", delivery_date: "2026-03-11", ordered_qty: 100, received_qty: 98, quality_grade_actual: "L1", temperature_log: "3.5°C avg", on_time: true, notes: "", photos: [], received_by: "u6", created_at: "2026-03-11T06:00:00Z", updated_at: "2026-03-11T08:00:00Z", deleted_at: null },
  { id: "d2", supplier_id: "s1", supplier: mockSuppliers[0], allocation_id: "a2", delivery_date: "2026-03-10", ordered_qty: 80, received_qty: 78, quality_grade_actual: "L1", temperature_log: "4.0°C avg", on_time: true, notes: "", photos: [], received_by: "u6", created_at: "2026-03-10T06:00:00Z", updated_at: "2026-03-10T08:00:00Z", deleted_at: null },
  { id: "d3", supplier_id: "s1", supplier: mockSuppliers[0], allocation_id: "a3", delivery_date: "2026-03-09", ordered_qty: 120, received_qty: 110, quality_grade_actual: "L2", temperature_log: "5.2°C avg", on_time: false, notes: "Giao trễ 2 giờ", photos: [], received_by: "u6", created_at: "2026-03-09T06:00:00Z", updated_at: "2026-03-09T10:00:00Z", deleted_at: null },
  { id: "d4", supplier_id: "s2", supplier: mockSuppliers[1], allocation_id: "a4", delivery_date: "2026-03-11", ordered_qty: 200, received_qty: 195, quality_grade_actual: "L1", temperature_log: "3.8°C avg", on_time: true, notes: "", photos: [], received_by: "u6", created_at: "2026-03-11T07:00:00Z", updated_at: "2026-03-11T09:00:00Z", deleted_at: null },
  { id: "d5", supplier_id: "s2", supplier: mockSuppliers[1], allocation_id: "a5", delivery_date: "2026-03-08", ordered_qty: 150, received_qty: 140, quality_grade_actual: "L1", temperature_log: "4.5°C avg", on_time: true, notes: "", photos: [], received_by: "u6", created_at: "2026-03-08T06:00:00Z", updated_at: "2026-03-08T08:00:00Z", deleted_at: null },
  { id: "d6", supplier_id: "s3", supplier: mockSuppliers[2], allocation_id: "a6", delivery_date: "2026-03-10", ordered_qty: 60, received_qty: 55, quality_grade_actual: "L2", temperature_log: "6.0°C avg", on_time: false, notes: "Nhiệt độ cao", photos: [], received_by: "u6", created_at: "2026-03-10T08:00:00Z", updated_at: "2026-03-10T11:00:00Z", deleted_at: null },
];

// --- Audit Logs ---
export const mockAuditLogs: AuditLog[] = [
  { id: "al1", user_id: "u3", user: mockUsers[2], action: "update", entity_type: "supplier", entity_id: "s1", old_values: { score: 90 }, new_values: { score: 92 }, ip_address: "192.168.1.10", created_at: "2026-03-12T08:30:00Z" },
  { id: "al2", user_id: "u4", user: mockUsers[3], action: "create", entity_type: "order", entity_id: "o1", old_values: null, new_values: { code: "DH-0045", customer_id: "c1" }, ip_address: "192.168.1.11", created_at: "2026-03-12T08:00:00Z" },
  { id: "al3", user_id: "u1", user: mockUsers[0], action: "update", entity_type: "user", entity_id: "u9", old_values: { is_active: true }, new_values: { is_active: false }, ip_address: "192.168.1.1", created_at: "2026-03-11T16:00:00Z" },
  { id: "al4", user_id: "u5", user: mockUsers[4], action: "create", entity_type: "qc_inspection", entity_id: "qc1", old_values: null, new_values: { delivery_id: "d1", overall_result: "pass" }, ip_address: "192.168.1.12", created_at: "2026-03-11T14:00:00Z" },
  { id: "al5", user_id: "u3", user: mockUsers[2], action: "delete", entity_type: "supplier", entity_id: "s6", old_values: { status: "active" }, new_values: { status: "suspended" }, ip_address: "192.168.1.10", created_at: "2026-03-10T09:00:00Z" },
];
