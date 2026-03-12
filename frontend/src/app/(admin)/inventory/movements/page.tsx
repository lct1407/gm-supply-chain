"use client";

import { useState, useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Settings2,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

import { PageHeader } from "@/components/shared/page-header";
import { DataTable, SortableHeader } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { SearchInput } from "@/components/shared/search-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { MovementType } from "@/types";

interface MovementRow {
  id: string;
  performed_at: string;
  lot_code: string;
  type: MovementType;
  quantity: number;
  reason: string;
  performed_by: string;
}

const mockMovements: MovementRow[] = [
  {
    id: "mv1",
    performed_at: "2026-03-12T08:30:00Z",
    lot_code: "LOT-20260312-001",
    type: "IN",
    quantity: 150,
    reason: "Nhập kho từ delivery D-0089 (Trang trại ABC)",
    performed_by: "Đỗ Văn Kho",
  },
  {
    id: "mv2",
    performed_at: "2026-03-12T07:45:00Z",
    lot_code: "LOT-20260311-003",
    type: "OUT",
    quantity: 30,
    reason: "Xuất cho đơn DH-0044 (Nhà hàng Sen Vàng)",
    performed_by: "Đỗ Văn Kho",
  },
  {
    id: "mv3",
    performed_at: "2026-03-12T06:00:00Z",
    lot_code: "LOT-20260311-005",
    type: "OUT",
    quantity: 25,
    reason: "Xuất cho đơn DH-0043 (Đại lý Thanh Hà)",
    performed_by: "Đỗ Văn Kho",
  },
  {
    id: "mv4",
    performed_at: "2026-03-11T16:00:00Z",
    lot_code: "LOT-20260308-002",
    type: "ADJ",
    quantity: -5,
    reason: "Hao hụt tự nhiên — nấm rơm mềm, giảm trọng lượng",
    performed_by: "Hoàng Văn QC",
  },
  {
    id: "mv5",
    performed_at: "2026-03-11T14:00:00Z",
    lot_code: "LOT-20260310-002",
    type: "IN",
    quantity: 200,
    reason: "Nhập kho từ delivery D-0087 (Farm Đà Lạt Green)",
    performed_by: "Đỗ Văn Kho",
  },
  {
    id: "mv6",
    performed_at: "2026-03-11T10:00:00Z",
    lot_code: "LOT-20260310-004",
    type: "IN",
    quantity: 150,
    reason: "Nhập kho từ delivery D-0086 (Trang trại ABC)",
    performed_by: "Đỗ Văn Kho",
  },
  {
    id: "mv7",
    performed_at: "2026-03-11T08:00:00Z",
    lot_code: "LOT-20260309-001",
    type: "OUT",
    quantity: 20,
    reason: "Xuất cho đơn DH-0042 (Export FreshViet)",
    performed_by: "Đỗ Văn Kho",
  },
  {
    id: "mv8",
    performed_at: "2026-03-10T17:00:00Z",
    lot_code: "LOT-20260307-003",
    type: "ADJ",
    quantity: -10,
    reason: "Chuyển trạng thái expired — nấm bào ngư hết shelf life",
    performed_by: "Hoàng Văn QC",
  },
];

const typeConfig: Record<
  MovementType,
  { label: string; variant: "success" | "info" | "warning"; icon: React.ElementType }
> = {
  IN: { label: "Nhập kho", variant: "success", icon: ArrowDownToLine },
  OUT: { label: "Xuất kho", variant: "info", icon: ArrowUpFromLine },
  ADJ: { label: "Điều chỉnh", variant: "warning", icon: Settings2 },
};

function MovementTypeBadge({ type }: { type: MovementType }) {
  const cfg = typeConfig[type];
  const Icon = cfg.icon;
  return (
    <div className="flex items-center gap-1.5">
      <Icon className="h-3.5 w-3.5" />
      <StatusBadge label={cfg.label} variant={cfg.variant} />
    </div>
  );
}

const columns: ColumnDef<MovementRow, unknown>[] = [
  {
    accessorKey: "performed_at",
    header: ({ column }) => <SortableHeader column={column} label="Thời gian" />,
    cell: ({ row }) => {
      const d = new Date(row.original.performed_at);
      return (
        <div>
          <p className="font-medium">
            {d.toLocaleDateString("vi-VN")}
          </p>
          <p className="text-xs text-muted-foreground">
            {d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "lot_code",
    header: ({ column }) => <SortableHeader column={column} label="Mã lot" />,
    cell: ({ row }) => (
      <span className="font-mono text-xs font-medium">
        {row.original.lot_code}
      </span>
    ),
  },
  {
    accessorKey: "type",
    header: "Loại",
    cell: ({ row }) => <MovementTypeBadge type={row.original.type} />,
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => <SortableHeader column={column} label="Số lượng (kg)" />,
    cell: ({ row }) => {
      const qty = row.original.quantity;
      const isNegative = qty < 0;
      return (
        <span
          className={`font-semibold ${
            row.original.type === "IN"
              ? "text-green-600"
              : row.original.type === "OUT"
                ? "text-blue-600"
                : "text-amber-600"
          }`}
        >
          {row.original.type === "IN" ? "+" : ""}
          {qty}
        </span>
      );
    },
  },
  {
    accessorKey: "reason",
    header: "Lý do",
    cell: ({ row }) => (
      <span className="text-sm max-w-[300px] truncate block">
        {row.original.reason}
      </span>
    ),
  },
  {
    accessorKey: "performed_by",
    header: "Thực hiện",
    cell: ({ row }) => (
      <span className="text-sm">{row.original.performed_by}</span>
    ),
  },
];

export default function InventoryMovementsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const filteredMovements = useMemo(() => {
    return mockMovements.filter((m) => {
      const matchSearch =
        !search ||
        m.lot_code.toLowerCase().includes(search.toLowerCase()) ||
        m.reason.toLowerCase().includes(search.toLowerCase()) ||
        m.performed_by.toLowerCase().includes(search.toLowerCase());
      const matchType = typeFilter === "all" || m.type === typeFilter;
      return matchSearch && matchType;
    });
  }, [search, typeFilter]);

  const summary = useMemo(() => {
    const totalIn = mockMovements
      .filter((m) => m.type === "IN")
      .reduce((s, m) => s + m.quantity, 0);
    const totalOut = mockMovements
      .filter((m) => m.type === "OUT")
      .reduce((s, m) => s + m.quantity, 0);
    const totalAdj = mockMovements
      .filter((m) => m.type === "ADJ")
      .reduce((s, m) => s + m.quantity, 0);
    return { totalIn, totalOut, totalAdj };
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Nhập/Xuất kho"
        description="Lịch sử tất cả giao dịch nhập, xuất và điều chỉnh kho"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Kho", href: "/inventory" },
          { label: "Nhập/Xuất kho" },
        ]}
        actions={
          <Link href="/inventory">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Tồn kho
            </Button>
          </Link>
        }
      />

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-50">
              <ArrowDownToLine className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tổng nhập</p>
              <p className="text-xl font-bold text-green-600">
                +{new Intl.NumberFormat("vi-VN").format(summary.totalIn)} kg
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50">
              <ArrowUpFromLine className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tổng xuất</p>
              <p className="text-xl font-bold text-blue-600">
                -{new Intl.NumberFormat("vi-VN").format(summary.totalOut)} kg
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-50">
              <Settings2 className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Điều chỉnh</p>
              <p className="text-xl font-bold text-amber-600">
                {summary.totalAdj} kg
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Tìm mã lot, lý do, người thực hiện..."
              className="sm:w-72"
            />
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="sm:w-44">
                <SelectValue placeholder="Loại giao dịch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="IN">Nhập kho</SelectItem>
                <SelectItem value="OUT">Xuất kho</SelectItem>
                <SelectItem value="ADJ">Điều chỉnh</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <DataTable columns={columns} data={filteredMovements} />
    </div>
  );
}
