"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Variant = "default" | "success" | "warning" | "danger" | "info" | "muted";

const variantStyles: Record<Variant, string> = {
  default: "bg-slate-100 text-slate-800 hover:bg-slate-100",
  success: "bg-green-100 text-green-800 hover:bg-green-100",
  warning: "bg-amber-100 text-amber-800 hover:bg-amber-100",
  danger: "bg-red-100 text-red-800 hover:bg-red-100",
  info: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  muted: "bg-gray-100 text-gray-500 hover:bg-gray-100",
};

interface StatusBadgeProps {
  label: string;
  variant?: Variant;
  className?: string;
}

export function StatusBadge({ label, variant = "default", className }: StatusBadgeProps) {
  return (
    <Badge variant="secondary" className={cn("font-medium", variantStyles[variant], className)}>
      {label}
    </Badge>
  );
}

// --- Preset mappers ---

const supplierStatusMap: Record<string, { label: string; variant: Variant }> = {
  active: { label: "Hoạt động", variant: "success" },
  inactive: { label: "Tạm ngưng", variant: "warning" },
  suspended: { label: "Đình chỉ", variant: "danger" },
  terminated: { label: "Chấm dứt", variant: "muted" },
};

export function SupplierStatusBadge({ status }: { status: string }) {
  const s = supplierStatusMap[status] ?? { label: status, variant: "default" as Variant };
  return <StatusBadge label={s.label} variant={s.variant} />;
}

const rankMap: Record<string, { variant: Variant }> = {
  A: { variant: "success" },
  B: { variant: "info" },
  C: { variant: "warning" },
  D: { variant: "danger" },
};

export function RankBadge({ rank }: { rank: string | null }) {
  if (!rank) return <span className="text-muted-foreground text-sm">—</span>;
  const r = rankMap[rank] ?? { variant: "default" as Variant };
  return <StatusBadge label={`Hạng ${rank}`} variant={r.variant} />;
}

const orderStatusMap: Record<string, { label: string; variant: Variant }> = {
  new: { label: "Mới", variant: "info" },
  allocated: { label: "Đã phân bổ", variant: "default" },
  preparing: { label: "Đang chuẩn bị", variant: "warning" },
  delivering: { label: "Đang giao", variant: "info" },
  completed: { label: "Hoàn thành", variant: "success" },
  cancelled: { label: "Đã hủy", variant: "muted" },
};

export function OrderStatusBadge({ status }: { status: string }) {
  const s = orderStatusMap[status] ?? { label: status, variant: "default" as Variant };
  return <StatusBadge label={s.label} variant={s.variant} />;
}

const customerTypeMap: Record<string, string> = {
  dai_ly: "Đại lý",
  sieu_thi: "Siêu thị",
  nha_hang: "Nhà hàng",
  xuat_khau: "Xuất khẩu",
  le: "Bán lẻ",
};

export function CustomerTypeBadge({ type }: { type: string }) {
  return <StatusBadge label={customerTypeMap[type] ?? type} variant="default" />;
}

const negotiationStatusMap: Record<string, { label: string; variant: Variant }> = {
  proposed: { label: "Chờ NCC", variant: "warning" },
  counter_proposed: { label: "NCC counter", variant: "info" },
  revised: { label: "Đã sửa", variant: "default" },
  agreed: { label: "Đồng ý", variant: "success" },
  rejected: { label: "Từ chối", variant: "danger" },
  escalated: { label: "Escalated", variant: "danger" },
};

export function NegotiationStatusBadge({ status }: { status: string }) {
  const s = negotiationStatusMap[status] ?? { label: status, variant: "default" as Variant };
  return <StatusBadge label={s.label} variant={s.variant} />;
}

const registrationStatusMap: Record<string, { label: string; variant: Variant }> = {
  pending: { label: "Chờ duyệt", variant: "warning" },
  approved: { label: "Đã duyệt", variant: "success" },
  rejected: { label: "Từ chối", variant: "danger" },
};

export function RegistrationStatusBadge({ status }: { status: string }) {
  const s = registrationStatusMap[status] ?? { label: status, variant: "default" as Variant };
  return <StatusBadge label={s.label} variant={s.variant} />;
}
