"use client";

import { useState, useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import {
  Package,
  AlertTriangle,
  Clock,
  Warehouse,
  Eye,
  Thermometer,
} from "lucide-react";
import Link from "next/link";

import { PageHeader } from "@/components/shared/page-header";
import { DataTable, SortableHeader } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { SearchInput } from "@/components/shared/search-input";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { LotStatus } from "@/types";

interface InventoryLotRow {
  id: string;
  lot_code: string;
  product: string;
  supplier: string;
  quality_grade: string;
  quantity_remaining: number;
  received_date: string;
  expiry_date: string;
  status: LotStatus;
  storage_zone: string;
  temperature: number | null;
}

// Mock current time for expiry calculations
const NOW = new Date("2026-03-12T09:00:00Z");

const mockLots: InventoryLotRow[] = [
  {
    id: "lot1",
    lot_code: "LOT-20260312-001",
    product: "Nấm rơm",
    supplier: "Trang trại ABC",
    quality_grade: "L1",
    quantity_remaining: 120,
    received_date: "2026-03-12T05:00:00Z",
    expiry_date: "2026-03-15T05:00:00Z",
    status: "available",
    storage_zone: "Kho lạnh A1",
    temperature: 4.2,
  },
  {
    id: "lot2",
    lot_code: "LOT-20260311-003",
    product: "Nấm bào ngư",
    supplier: "HTX Nấm Củ Chi",
    quality_grade: "L1",
    quantity_remaining: 85,
    received_date: "2026-03-11T06:00:00Z",
    expiry_date: "2026-03-18T06:00:00Z",
    status: "available",
    storage_zone: "Kho lạnh A2",
    temperature: 3.8,
  },
  {
    id: "lot3",
    lot_code: "LOT-20260311-005",
    product: "Nấm rơm",
    supplier: "Farm Đà Lạt Green",
    quality_grade: "L2",
    quantity_remaining: 45,
    received_date: "2026-03-11T04:00:00Z",
    expiry_date: "2026-03-13T04:00:00Z",
    status: "available",
    storage_zone: "Kho lạnh A1",
    temperature: 5.1,
  },
  {
    id: "lot4",
    lot_code: "LOT-20260310-002",
    product: "Nấm đùi gà",
    supplier: "Farm Đà Lạt Green",
    quality_grade: "L1",
    quantity_remaining: 200,
    received_date: "2026-03-10T05:30:00Z",
    expiry_date: "2026-03-20T05:30:00Z",
    status: "available",
    storage_zone: "Kho lạnh B1",
    temperature: 3.5,
  },
  {
    id: "lot5",
    lot_code: "LOT-20260310-004",
    product: "Nấm kim châm",
    supplier: "Trang trại ABC",
    quality_grade: "L1",
    quantity_remaining: 150,
    received_date: "2026-03-10T06:00:00Z",
    expiry_date: "2026-03-24T06:00:00Z",
    status: "reserved",
    storage_zone: "Kho lạnh B2",
    temperature: 2.8,
  },
  {
    id: "lot6",
    lot_code: "LOT-20260309-001",
    product: "Nấm mèo",
    supplier: "NCC Phú Yên",
    quality_grade: "L2",
    quantity_remaining: 30,
    received_date: "2026-03-09T05:00:00Z",
    expiry_date: "2026-03-12T17:00:00Z",
    status: "available",
    storage_zone: "Kho lạnh A1",
    temperature: 6.0,
  },
  {
    id: "lot7",
    lot_code: "LOT-20260308-002",
    product: "Nấm rơm",
    supplier: "HTX Nấm Củ Chi",
    quality_grade: "L1",
    quantity_remaining: 0,
    received_date: "2026-03-08T05:00:00Z",
    expiry_date: "2026-03-11T05:00:00Z",
    status: "depleted",
    storage_zone: "Kho lạnh A1",
    temperature: null,
  },
  {
    id: "lot8",
    lot_code: "LOT-20260307-003",
    product: "Nấm bào ngư",
    supplier: "Farm Đà Lạt Green",
    quality_grade: "L2",
    quantity_remaining: 15,
    received_date: "2026-03-07T06:00:00Z",
    expiry_date: "2026-03-12T06:00:00Z",
    status: "expired",
    storage_zone: "Kho lạnh A2",
    temperature: null,
  },
];

function getHoursToExpiry(expiryDate: string): number {
  const expiry = new Date(expiryDate);
  return (expiry.getTime() - NOW.getTime()) / (1000 * 60 * 60);
}

const lotStatusMap: Record<LotStatus, { label: string; variant: "default" | "success" | "warning" | "danger" | "info" | "muted" }> = {
  available: { label: "Sẵn sàng", variant: "success" },
  reserved: { label: "Đã giữ", variant: "info" },
  depleted: { label: "Hết hàng", variant: "muted" },
  expired: { label: "Hết hạn", variant: "danger" },
};

function LotStatusBadge({ status }: { status: LotStatus }) {
  const s = lotStatusMap[status];
  return <StatusBadge label={s.label} variant={s.variant} />;
}

const columns: ColumnDef<InventoryLotRow, unknown>[] = [
  {
    accessorKey: "lot_code",
    header: ({ column }) => <SortableHeader column={column} label="Mã lot" />,
    cell: ({ row }) => (
      <span className="font-mono text-xs font-medium">{row.original.lot_code}</span>
    ),
  },
  {
    accessorKey: "product",
    header: ({ column }) => <SortableHeader column={column} label="Sản phẩm" />,
    cell: ({ row }) => <span className="font-medium">{row.original.product}</span>,
  },
  {
    accessorKey: "supplier",
    header: "Nhà cung cấp",
  },
  {
    accessorKey: "quality_grade",
    header: "Chất lượng",
    cell: ({ row }) => (
      <StatusBadge
        label={row.original.quality_grade}
        variant={row.original.quality_grade === "L1" ? "success" : "warning"}
      />
    ),
  },
  {
    accessorKey: "quantity_remaining",
    header: ({ column }) => <SortableHeader column={column} label="Tồn (kg)" />,
    cell: ({ row }) => (
      <span className="font-semibold">
        {new Intl.NumberFormat("vi-VN").format(row.original.quantity_remaining)}
      </span>
    ),
  },
  {
    accessorKey: "received_date",
    header: "Ngày nhận",
    cell: ({ row }) =>
      new Date(row.original.received_date).toLocaleDateString("vi-VN"),
  },
  {
    accessorKey: "expiry_date",
    header: ({ column }) => <SortableHeader column={column} label="Hạn sử dụng" />,
    cell: ({ row }) => {
      const hours = getHoursToExpiry(row.original.expiry_date);
      const dateStr = new Date(row.original.expiry_date).toLocaleDateString("vi-VN");
      if (hours <= 0) {
        return <span className="text-red-600 font-semibold">{dateStr} (Hết hạn)</span>;
      }
      if (hours <= 24) {
        return (
          <span className="text-red-600 font-semibold flex items-center gap-1">
            <AlertTriangle className="h-3.5 w-3.5" />
            {dateStr} ({Math.round(hours)}h)
          </span>
        );
      }
      if (hours <= 48) {
        return (
          <span className="text-amber-600 font-medium flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {dateStr} ({Math.round(hours)}h)
          </span>
        );
      }
      return <span>{dateStr}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => <LotStatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "storage_zone",
    header: "Khu vực",
    cell: ({ row }) => (
      <span className="text-xs">{row.original.storage_zone}</span>
    ),
  },
  {
    id: "actions",
    header: "",
    cell: () => (
      <Link href="/inventory/movements">
        <Button variant="ghost" size="sm" title="Xem nhập/xuất">
          <Eye className="h-4 w-4" />
        </Button>
      </Link>
    ),
  },
];

export default function InventoryPage() {
  const [search, setSearch] = useState("");
  const [productFilter, setProductFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredLots = useMemo(() => {
    return mockLots.filter((lot) => {
      const matchSearch =
        !search ||
        lot.lot_code.toLowerCase().includes(search.toLowerCase()) ||
        lot.product.toLowerCase().includes(search.toLowerCase()) ||
        lot.supplier.toLowerCase().includes(search.toLowerCase());
      const matchProduct =
        productFilter === "all" || lot.product === productFilter;
      const matchStatus =
        statusFilter === "all" || lot.status === statusFilter;
      return matchSearch && matchProduct && matchStatus;
    });
  }, [search, productFilter, statusFilter]);

  const stats = useMemo(() => {
    const totalLots = mockLots.length;
    const expiring24h = mockLots.filter(
      (l) => {
        const hours = getHoursToExpiry(l.expiry_date);
        return hours > 0 && hours <= 24 && l.status !== "depleted" && l.status !== "expired";
      },
    ).length;
    const expiring48h = mockLots.filter(
      (l) => {
        const hours = getHoursToExpiry(l.expiry_date);
        return hours > 0 && hours <= 48 && l.status !== "depleted" && l.status !== "expired";
      },
    ).length;
    const totalKg = mockLots.reduce((s, l) => s + l.quantity_remaining, 0);
    return { totalLots, expiring24h, expiring48h, totalKg };
  }, []);

  const products = useMemo(() => {
    return Array.from(new Set(mockLots.map((l) => l.product)));
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tồn kho"
        description="Quản lý các lot hàng trong kho theo FEFO"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Kho", href: "/inventory" },
          { label: "Tồn kho" },
        ]}
        actions={
          <div className="flex gap-2">
            <Link href="/inventory/movements">
              <Button variant="outline">Nhập/Xuất kho</Button>
            </Link>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Tổng lot"
          value={stats.totalLots}
          icon={Package}
          iconColor="text-primary"
        />
        <StatCard
          title="Sắp hết hạn (24h)"
          value={stats.expiring24h}
          icon={AlertTriangle}
          iconColor="text-red-500"
          change={stats.expiring24h > 0 ? "Cần xử lý gấp!" : ""}
          changeType="down"
        />
        <StatCard
          title="Sắp hết hạn (48h)"
          value={stats.expiring48h}
          icon={Clock}
          iconColor="text-amber-500"
        />
        <StatCard
          title="Tổng tồn kho"
          value={`${new Intl.NumberFormat("vi-VN").format(stats.totalKg)} kg`}
          icon={Warehouse}
          iconColor="text-green-500"
        />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Tìm mã lot, sản phẩm, NCC..."
              className="sm:w-72"
            />
            <Select value={productFilter} onValueChange={setProductFilter}>
              <SelectTrigger className="sm:w-44">
                <SelectValue placeholder="Sản phẩm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả sản phẩm</SelectItem>
                {products.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="sm:w-40">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="available">Sẵn sàng</SelectItem>
                <SelectItem value="reserved">Đã giữ</SelectItem>
                <SelectItem value="depleted">Hết hàng</SelectItem>
                <SelectItem value="expired">Hết hạn</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <DataTable columns={columns} data={filteredLots} />
    </div>
  );
}
