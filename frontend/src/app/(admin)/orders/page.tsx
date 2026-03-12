"use client";

import { useState, useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import {
  ShoppingCart,
  Plus,
  FileSpreadsheet,
  Eye,
  Sparkles,
  Truck,
  CheckCircle2,
  Clock,
} from "lucide-react";
import Link from "next/link";

import { PageHeader } from "@/components/shared/page-header";
import { DataTable, SortableHeader } from "@/components/shared/data-table";
import { OrderStatusBadge, StatusBadge } from "@/components/shared/status-badge";
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
import { mockOrders } from "@/lib/mock-data";
import type { Order, OrderStatus, OrderSource } from "@/types";

const sourceLabels: Record<OrderSource, { label: string; variant: "default" | "info" | "muted" }> = {
  manual: { label: "Nhập tay", variant: "muted" },
  excel: { label: "Excel", variant: "info" },
  kiotviet: { label: "KiotViet", variant: "default" },
};

const sourceBadgeStyles: Record<OrderSource, string> = {
  manual: "bg-gray-100 text-gray-600 hover:bg-gray-100",
  excel: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  kiotviet: "bg-purple-100 text-purple-700 hover:bg-purple-100",
};

function SourceBadge({ source }: { source: OrderSource }) {
  const cfg = sourceLabels[source];
  return (
    <StatusBadge label={cfg.label} variant={cfg.variant} className={sourceBadgeStyles[source]} />
  );
}

const columns: ColumnDef<Order, unknown>[] = [
  {
    accessorKey: "code",
    header: ({ column }) => <SortableHeader column={column} label="Mã đơn" />,
    cell: ({ row }) => (
      <Link
        href={`/orders/${row.original.id}`}
        className="font-medium text-primary hover:underline"
      >
        {row.original.code}
      </Link>
    ),
  },
  {
    accessorKey: "customer.name",
    header: ({ column }) => <SortableHeader column={column} label="Khách hàng" />,
    cell: ({ row }) => row.original.customer?.name ?? "—",
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => <OrderStatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "priority",
    header: ({ column }) => <SortableHeader column={column} label="Ưu tiên" />,
    cell: ({ row }) => {
      const p = row.original.priority;
      const color =
        p === 1
          ? "text-red-600 font-semibold"
          : p === 2
            ? "text-amber-600 font-medium"
            : "text-muted-foreground";
      return <span className={color}>P{p}</span>;
    },
  },
  {
    accessorKey: "delivery_date",
    header: ({ column }) => <SortableHeader column={column} label="Ngày giao" />,
    cell: ({ row }) =>
      new Date(row.original.delivery_date).toLocaleDateString("vi-VN"),
  },
  {
    accessorKey: "source",
    header: "Nguồn",
    cell: ({ row }) => <SourceBadge source={row.original.source} />,
  },
  {
    accessorKey: "items",
    header: "Số SP",
    cell: ({ row }) => row.original.items.length || "—",
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <Link href={`/orders/${row.original.id}`}>
        <Button variant="ghost" size="sm">
          <Eye className="h-4 w-4" />
        </Button>
      </Link>
    ),
  },
];

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");

  const filteredOrders = useMemo(() => {
    return mockOrders.filter((o) => {
      const matchSearch =
        !search ||
        o.code.toLowerCase().includes(search.toLowerCase()) ||
        o.customer?.name.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || o.status === statusFilter;
      const matchSource = sourceFilter === "all" || o.source === sourceFilter;
      return matchSearch && matchStatus && matchSource;
    });
  }, [search, statusFilter, sourceFilter]);

  const stats = useMemo(() => {
    const total = mockOrders.length;
    const newCount = mockOrders.filter((o) => o.status === "new").length;
    const delivering = mockOrders.filter((o) => o.status === "delivering").length;
    const completed = mockOrders.filter((o) => o.status === "completed").length;
    return { total, newCount, delivering, completed };
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Đơn hàng"
        description="Quản lý tất cả đơn hàng từ các kênh bán"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Đơn hàng" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Import Excel
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Tạo đơn hàng
            </Button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Tổng đơn"
          value={stats.total}
          icon={ShoppingCart}
          iconColor="text-primary"
        />
        <StatCard
          title="Mới"
          value={stats.newCount}
          icon={Sparkles}
          iconColor="text-blue-500"
        />
        <StatCard
          title="Đang giao"
          value={stats.delivering}
          icon={Truck}
          iconColor="text-amber-500"
        />
        <StatCard
          title="Hoàn thành"
          value={stats.completed}
          icon={CheckCircle2}
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
              placeholder="Tìm theo mã đơn, khách hàng..."
              className="sm:w-72"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="sm:w-44">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="new">Mới</SelectItem>
                <SelectItem value="allocated">Đã phân bổ</SelectItem>
                <SelectItem value="preparing">Đang chuẩn bị</SelectItem>
                <SelectItem value="delivering">Đang giao</SelectItem>
                <SelectItem value="completed">Hoàn thành</SelectItem>
                <SelectItem value="cancelled">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="sm:w-40">
                <SelectValue placeholder="Nguồn đơn" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả nguồn</SelectItem>
                <SelectItem value="manual">Nhập tay</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
                <SelectItem value="kiotviet">KiotViet</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <DataTable columns={columns} data={filteredOrders} />
    </div>
  );
}
