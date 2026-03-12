"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, SortableHeader } from "@/components/shared/data-table";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { SearchInput } from "@/components/shared/search-input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Wifi,
  ShoppingCart,
  AlertCircle,
  HelpCircle,
  RefreshCw,
  Pencil,
  CheckCircle2,
  XCircle,
  Link2,
} from "lucide-react";
import { mockProducts } from "@/lib/mock-data";
import { type ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";

// --- Mock KiotViet Product Mappings ---
interface ProductMappingRow {
  id: string;
  kiotvietName: string;
  kiotvietId: string;
  mappedProduct: string | null;
  qualityGrade: string | null;
  isActive: boolean;
}

const productMappings: ProductMappingRow[] = [
  { id: "km1", kiotvietName: "Nấm rơm tươi loại 1", kiotvietId: "KV-P001", mappedProduct: "Nấm rơm", qualityGrade: "L1", isActive: true },
  { id: "km2", kiotvietName: "Nấm bào ngư xám", kiotvietId: "KV-P002", mappedProduct: "Nấm bào ngư", qualityGrade: "L1", isActive: true },
  { id: "km3", kiotvietName: "Nấm đùi gà nhập", kiotvietId: "KV-P003", mappedProduct: "Nấm đùi gà", qualityGrade: "L2", isActive: true },
  { id: "km4", kiotvietName: "Nấm kim châm Hàn Quốc", kiotvietId: "KV-P004", mappedProduct: "Nấm kim châm", qualityGrade: "L1", isActive: true },
  { id: "km5", kiotvietName: "Nấm mèo sấy", kiotvietId: "KV-P005", mappedProduct: null, qualityGrade: null, isActive: true },
  { id: "km6", kiotvietName: "Nấm hương khô", kiotvietId: "KV-P006", mappedProduct: null, qualityGrade: null, isActive: false },
];

// --- Mock Sync Logs ---
interface SyncLogRow {
  id: string;
  timestamp: string;
  syncType: "webhook" | "manual" | "scheduled";
  kiotvietOrderId: string;
  status: "success" | "failed" | "duplicate";
  mappedOrder: string | null;
  errorMessage: string | null;
}

const syncLogs: SyncLogRow[] = [
  { id: "sl1", timestamp: "2026-03-12T09:45:00Z", syncType: "webhook", kiotvietOrderId: "KV-891", status: "success", mappedOrder: "DH-0045", errorMessage: null },
  { id: "sl2", timestamp: "2026-03-12T08:30:00Z", syncType: "webhook", kiotvietOrderId: "KV-890", status: "success", mappedOrder: "DH-0044", errorMessage: null },
  { id: "sl3", timestamp: "2026-03-12T07:15:00Z", syncType: "scheduled", kiotvietOrderId: "KV-889", status: "failed", mappedOrder: null, errorMessage: "Sản phẩm chưa mapping: Nấm mèo sấy" },
  { id: "sl4", timestamp: "2026-03-11T18:00:00Z", syncType: "webhook", kiotvietOrderId: "KV-888", status: "duplicate", mappedOrder: "DH-0043", errorMessage: "Đơn đã tồn tại" },
  { id: "sl5", timestamp: "2026-03-11T16:30:00Z", syncType: "manual", kiotvietOrderId: "KV-887", status: "success", mappedOrder: "DH-0042", errorMessage: null },
  { id: "sl6", timestamp: "2026-03-11T14:00:00Z", syncType: "webhook", kiotvietOrderId: "KV-886", status: "success", mappedOrder: "DH-0041", errorMessage: null },
  { id: "sl7", timestamp: "2026-03-11T10:00:00Z", syncType: "scheduled", kiotvietOrderId: "KV-885", status: "failed", mappedOrder: null, errorMessage: "Timeout kết nối KiotViet API" },
];

const mappingColumns: ColumnDef<ProductMappingRow>[] = [
  {
    accessorKey: "kiotvietName",
    header: ({ column }) => <SortableHeader column={column} label="Sản phẩm KiotViet" />,
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.original.kiotvietName}</p>
        <p className="text-xs text-muted-foreground">{row.original.kiotvietId}</p>
      </div>
    ),
  },
  {
    accessorKey: "mappedProduct",
    header: "Sản phẩm nội bộ",
    cell: ({ row }) =>
      row.original.mappedProduct ? (
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <span className="font-medium">{row.original.mappedProduct}</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-amber-500" />
          <span className="text-muted-foreground italic">Chưa mapping</span>
        </div>
      ),
  },
  {
    accessorKey: "qualityGrade",
    header: "Phân loại CL",
    cell: ({ row }) =>
      row.original.qualityGrade ? (
        <Badge variant="secondary">{row.original.qualityGrade}</Badge>
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
  },
  {
    id: "actions",
    header: "",
    cell: () => (
      <Button variant="ghost" size="sm">
        <Pencil className="h-3.5 w-3.5 mr-1" />
        Sửa
      </Button>
    ),
  },
];

const syncTypeLabels: Record<string, { label: string; variant: "default" | "info" | "muted" }> = {
  webhook: { label: "Webhook", variant: "info" },
  manual: { label: "Thủ công", variant: "default" },
  scheduled: { label: "Lịch trình", variant: "muted" },
};

const syncStatusMap: Record<string, { label: string; variant: "success" | "danger" | "warning" }> = {
  success: { label: "Thành công", variant: "success" },
  failed: { label: "Lỗi", variant: "danger" },
  duplicate: { label: "Trùng", variant: "warning" },
};

const syncColumns: ColumnDef<SyncLogRow>[] = [
  {
    accessorKey: "timestamp",
    header: ({ column }) => <SortableHeader column={column} label="Thời gian" />,
    cell: ({ row }) => {
      const d = new Date(row.original.timestamp);
      return (
        <span className="text-sm">
          {d.toLocaleDateString("vi-VN")} {d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
        </span>
      );
    },
  },
  {
    accessorKey: "syncType",
    header: "Loại sync",
    cell: ({ row }) => {
      const st = syncTypeLabels[row.original.syncType];
      return <StatusBadge label={st.label} variant={st.variant} />;
    },
  },
  {
    accessorKey: "kiotvietOrderId",
    header: "Mã đơn KiotViet",
    cell: ({ row }) => <span className="font-mono text-sm">{row.original.kiotvietOrderId}</span>,
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const s = syncStatusMap[row.original.status];
      return <StatusBadge label={s.label} variant={s.variant} />;
    },
  },
  {
    accessorKey: "mappedOrder",
    header: "Đơn hàng",
    cell: ({ row }) =>
      row.original.mappedOrder ? (
        <span className="font-medium text-primary">{row.original.mappedOrder}</span>
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
  },
];

export default function KiotVietIntegrationPage() {
  const unmappedCount = productMappings.filter((m) => !m.mappedProduct).length;
  const errorCount = syncLogs.filter((l) => l.status === "failed").length;
  const todayOrders = syncLogs.filter(
    (l) => l.status === "success" && l.timestamp.startsWith("2026-03-12")
  ).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tích hợp KiotViet"
        description="Quản lý kết nối, mapping sản phẩm và đồng bộ đơn hàng từ KiotViet"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Tích hợp" },
          { label: "KiotViet" },
        ]}
        actions={
          <Button size="sm">
            <RefreshCw className="h-4 w-4 mr-1" />
            Manual Sync
          </Button>
        }
      />

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Trạng thái"
          value="Active"
          change="Kết nối ổn định"
          changeType="up"
          icon={Wifi}
          iconColor="text-green-600"
        />
        <StatCard
          title="Đơn hôm nay"
          value={todayOrders}
          icon={ShoppingCart}
          iconColor="text-blue-600"
        />
        <StatCard
          title="Lỗi (7 ngày)"
          value={errorCount}
          icon={AlertCircle}
          iconColor="text-red-600"
        />
        <StatCard
          title="Chưa mapping"
          value={unmappedCount}
          icon={HelpCircle}
          iconColor="text-amber-600"
        />
      </div>

      {/* Product Mappings */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Link2 className="h-4 w-4" />
              Product Mappings
            </CardTitle>
            <Badge variant="secondary">{productMappings.length} sản phẩm</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={mappingColumns} data={productMappings} pageSize={10} />
        </CardContent>
      </Card>

      {/* Sync Log */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Sync Log
            </CardTitle>
            <Badge variant="secondary">{syncLogs.length} bản ghi</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={syncColumns} data={syncLogs} pageSize={10} />
        </CardContent>
      </Card>
    </div>
  );
}
