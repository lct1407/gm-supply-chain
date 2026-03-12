// ============================================================
// GM Supply — Entity Type Definitions
// ============================================================

// --- Common ---
export type ID = string; // UUID

export interface Timestamps {
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface PaginationMeta {
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface ApiResponse<T> {
  data: T;
  meta: PaginationMeta | null;
  errors: ApiError[] | null;
}

export interface ApiError {
  code: string;
  field?: string;
  message: string;
}

// --- Auth ---
export type PortalType = "admin" | "supplier";
export type Language = "vi" | "en";

export interface User extends Timestamps {
  id: ID;
  email: string;
  full_name: string;
  role: UserRole;
  portal_type: PortalType;
  preferred_language: Language;
  supplier_id: ID | null;
  is_active: boolean;
  email_verified_at: string | null;
  last_login: string | null;
}

export type UserRole =
  | "admin"
  | "director"
  | "manager"
  | "procurement_staff"
  | "qc_staff"
  | "warehouse_staff"
  | "viewer"
  | "ncc_owner"
  | "ncc_staff";

// --- Products (Master Data) ---
export interface Product extends Timestamps {
  id: ID;
  name: string;
  category: string;
  shelf_life_days: number;
  shrinkage_rate: number;
  temp_min: number;
  temp_max: number;
  is_active: boolean;
}

export interface QualityGrade extends Timestamps {
  id: ID;
  code: string; // L1, L2, L3
  name: string;
  description: string;
}

export interface Unit extends Timestamps {
  id: ID;
  name: string; // kg, thùng, bó
  conversion_rate: number; // to kg
}

// --- Suppliers ---
export type SupplierStatus = "active" | "inactive" | "suspended" | "terminated";
export type SupplierRank = "A" | "B" | "C" | "D";

export interface Supplier extends Timestamps {
  id: ID;
  code: string;
  name: string;
  address: string;
  tax_code: string;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  farm_location: string;
  farm_area: number | null;
  status: SupplierStatus;
  started_at: string;
  score: number | null;
  rank: SupplierRank | null;
}

export interface SupplierProduct extends Timestamps {
  id: ID;
  supplier_id: ID;
  product_id: ID;
  product?: Product;
  quality_grade_id: ID;
  quality_grade?: QualityGrade;
  max_capacity_monthly: number;
  price: number;
  price_effective_date: string;
  lead_time_days: number;
  shrinkage_rate: number;
}

export interface SupplierScore extends Timestamps {
  id: ID;
  supplier_id: ID;
  period: string; // YYYY-MM
  otd_score: number;
  fill_rate_score: number;
  quality_score: number;
  price_score: number;
  flexibility_score: number;
  total_score: number;
  rank: SupplierRank;
}

export interface SupplySchedule extends Timestamps {
  id: ID;
  supplier_id: ID;
  product_id: ID;
  period_start: string;
  period_end: string;
  planned_quantity: number;
  committed_min: number;
  committed_max: number;
}

// --- Customers ---
export type CustomerType = "dai_ly" | "sieu_thi" | "nha_hang" | "xuat_khau" | "le";

export interface Customer extends Timestamps {
  id: ID;
  code: string;
  name: string;
  type: CustomerType;
  priority_level: number; // 1=highest
  rsl_requirement: number; // 0-1
  address: string;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
}

// --- Orders ---
export type OrderStatus = "new" | "allocated" | "preparing" | "delivering" | "completed" | "cancelled";
export type OrderSource = "manual" | "excel" | "kiotviet";

export interface Order extends Timestamps {
  id: ID;
  code: string;
  customer_id: ID;
  customer?: Customer;
  status: OrderStatus;
  priority: number;
  ordered_at: string;
  delivery_date: string;
  delivery_address: string;
  notes: string;
  source: OrderSource;
  external_id: string | null;
  created_by: ID;
  items: OrderItem[];
}

export interface OrderItem extends Timestamps {
  id: ID;
  order_id: ID;
  product_id: ID;
  product?: Product;
  quality_grade_id: ID;
  quality_grade?: QualityGrade;
  quantity: number;
  unit_id: ID;
  unit_price: number;
}

// --- Allocations ---
export type AllocationPlanStatus = "draft" | "review" | "approved" | "active";
export type NegotiationStatus = "proposed" | "counter_proposed" | "revised" | "agreed" | "rejected" | "escalated";

export interface AllocationPlan extends Timestamps {
  id: ID;
  period: string; // YYYY-MM
  status: AllocationPlanStatus;
  negotiation_deadline: string | null;
  created_by: ID;
  approved_by: ID | null;
  approved_at: string | null;
}

export interface Allocation extends Timestamps {
  id: ID;
  plan_id: ID;
  supplier_id: ID;
  supplier?: Supplier;
  product_id: ID;
  product?: Product;
  order_item_id: ID | null;
  allocated_qty: number;
  actual_qty: number | null;
  status: string;
  negotiation_status: NegotiationStatus | null;
  locked: boolean;
  lock_reason: string | null;
}

export interface AllocationNegotiation extends Timestamps {
  id: ID;
  allocation_id: ID;
  round: number;
  proposed_qty: number;
  counter_qty: number | null;
  counter_reason: string | null;
  status: NegotiationStatus;
  proposed_by: ID;
  responded_by: ID | null;
  deadline: string;
}

// --- Deliveries ---
export interface Delivery extends Timestamps {
  id: ID;
  supplier_id: ID;
  supplier?: Supplier;
  allocation_id: ID;
  delivery_date: string;
  ordered_qty: number;
  received_qty: number | null;
  quality_grade_actual: string | null;
  temperature_log: string | null;
  on_time: boolean | null;
  notes: string;
  photos: string[];
  received_by: ID | null;
}

// --- Inventory ---
export type LotStatus = "available" | "reserved" | "depleted" | "expired";
export type MovementType = "IN" | "OUT" | "ADJ";

export interface InventoryLot extends Timestamps {
  id: ID;
  product_id: ID;
  product?: Product;
  supplier_id: ID;
  supplier?: Supplier;
  delivery_id: ID;
  quality_grade: string;
  quantity_initial: number;
  quantity_remaining: number;
  harvest_date: string;
  received_date: string;
  expiry_date: string;
  lot_code: string;
  storage_zone: string;
  temperature: number | null;
  status: LotStatus;
}

export interface InventoryMovement extends Timestamps {
  id: ID;
  lot_id: ID;
  lot?: InventoryLot;
  type: MovementType;
  quantity: number;
  reason: string;
  reference_id: ID | null;
  performed_by: ID;
  performed_at: string;
}

// --- QC ---
export interface QcInspection extends Timestamps {
  id: ID;
  delivery_id: ID;
  inspector_id: ID;
  checklist: Record<string, unknown>;
  overall_result: "pass" | "fail" | "conditional";
  grade_original: string;
  grade_actual: string;
  is_rejected: boolean;
  reject_reason: string | null;
  photos: string[];
  inspected_at: string;
}

// --- Messaging ---
export type ThreadStatus = "open" | "closed";
export type EntityType = "allocation" | "delivery" | "order" | "registration";

export interface MessageThread extends Timestamps {
  id: ID;
  subject: string;
  entity_type: EntityType | null;
  entity_id: ID | null;
  supplier_id: ID;
  supplier?: Supplier;
  status: ThreadStatus;
  created_by: ID;
  closed_at: string | null;
  last_message_at: string;
  unread_count: number;
}

export interface Message extends Timestamps {
  id: ID;
  thread_id: ID;
  sender_id: ID;
  sender?: User;
  body: string;
  attachments: MessageAttachment[];
  reply_to_id: ID | null;
  read_at: string | null;
}

export interface MessageAttachment {
  url: string;
  name: string;
  size: number;
  content_type: string;
}

// --- Supplier Registration ---
export type RegistrationStatus = "pending" | "approved" | "rejected";

export interface SupplierRegistration extends Timestamps {
  id: ID;
  business_name: string;
  tax_code: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  farm_location: string;
  farm_area: number | null;
  products: RegistrationProduct[];
  documents: RegistrationDocument[];
  status: RegistrationStatus;
  reviewed_by: ID | null;
  reviewed_at: string | null;
  review_notes: string | null;
  email_verified_at: string | null;
}

export interface RegistrationProduct {
  product_name: string;
  capacity_monthly: number;
  quality: string;
}

export interface RegistrationDocument {
  type: string;
  url: string;
  name: string;
}

// --- KiotViet ---
export type SyncStatus = "success" | "failed" | "duplicate";
export type SyncType = "webhook" | "manual" | "scheduled";

export interface KiotVietSyncLog extends Timestamps {
  id: ID;
  sync_type: SyncType;
  kiotviet_order_id: string;
  status: SyncStatus;
  error_message: string | null;
  order_id: ID | null;
  processed_at: string;
}

export interface KiotVietProductMapping extends Timestamps {
  id: ID;
  kiotviet_product_id: string;
  kiotviet_product_name: string;
  product_id: ID | null;
  product?: Product;
  quality_grade_id: ID | null;
  is_active: boolean;
}

// --- Audit ---
export interface AuditLog {
  id: ID;
  user_id: ID;
  user?: User;
  action: "create" | "update" | "delete";
  entity_type: string;
  entity_id: ID;
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  ip_address: string;
  created_at: string;
}

// --- Shrinkage ---
export type ShrinkageStage = "transport" | "storage" | "delivery";

export interface ShrinkageRecord extends Timestamps {
  id: ID;
  lot_id: ID;
  stage: ShrinkageStage;
  expected_qty: number;
  actual_qty: number;
  shrinkage_qty: number;
  shrinkage_pct: number;
  cause: string;
  recorded_at: string;
}

// --- Config ---
export interface SystemConfig {
  key: string;
  value: string;
  description: string;
  updated_at: string;
}
