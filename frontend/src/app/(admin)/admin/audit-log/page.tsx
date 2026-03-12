"use client";

import { useState, useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

import { PageHeader } from "@/components/shared/page-header";
import { DataTable, SortableHeader } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { SearchInput } from "@/components/shared/search-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockAuditLogs } from "@/lib/mock-data";
import type { AuditLog } from "@/types";

type Variant = "success" | "info" | "danger";

const actionVariantMap: Record<string, { label: string; variant: Variant }> = {
  create: { label: "Tạo mới", variant: "success" },
  update: { label: "Cập nhật", variant: "info" },
  delete: { label: "Xóa", variant: "danger" },
};

const entityTypeLabels: Record<string, string> = {
  supplier: "Nhà cung cấp",
  order: "Đơn hàng",
  user: "Người dùng",
  product: "Sản phẩm",
  qc_inspection: "Kiểm tra QC",
  allocation: "Phân bổ",
  delivery: "Giao hàng",
  inventory: "Tồn kho",
};

const columns: ColumnDef<AuditLog>[] = [
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <SortableHeader column={column} label="Thời gian" />
    ),
    cell: ({ row }) => (
      <span className="text-sm text-earth-600 whitespace-nowrap">
        {format(new Date(row.original.created_at), "dd/MM/yyyy HH:mm:ss", {
          locale: vi,
        })}
      </span>
    ),
  },
  {
    id: "user_name",
    header: "Người thực hiện",
    cell: ({ row }) => (
      <span className="font-medium text-earth-900">
        {row.original.user?.full_name ?? row.original.user_id}
      </span>
    ),
  },
  {
    accessorKey: "action",
    header: "Hành động",
    cell: ({ row }) => {
      const action = row.original.action;
      const mapped = actionVariantMap[action] ?? {
        label: action,
        variant: "info" as Variant,
      };
      return <StatusBadge label={mapped.label} variant={mapped.variant} />;
    },
  },
  {
    accessorKey: "entity_type",
    header: "Loại đối tượng",
    cell: ({ row }) => (
      <span className="text-sm text-earth-700">
        {entityTypeLabels[row.original.entity_type] ?? row.original.entity_type}
      </span>
    ),
  },
  {
    accessorKey: "entity_id",
    header: "ID đối tượng",
    cell: ({ row }) => (
      <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
        {row.original.entity_id}
      </code>
    ),
  },
  {
    accessorKey: "ip_address",
    header: "Địa chỉ IP",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground font-mono">
        {row.original.ip_address}
      </span>
    ),
  },
];

export default function AuditLogPage() {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [entityFilter, setEntityFilter] = useState<string>("all");

  const entityTypes = useMemo(() => {
    const types = new Set(mockAuditLogs.map((log) => log.entity_type));
    return Array.from(types);
  }, []);

  const filteredData = useMemo(() => {
    return mockAuditLogs.filter((log) => {
      const matchesSearch =
        search === "" ||
        (log.user?.full_name ?? "")
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesAction =
        actionFilter === "all" || log.action === actionFilter;

      const matchesEntity =
        entityFilter === "all" || log.entity_type === entityFilter;

      return matchesSearch && matchesAction && matchesEntity;
    });
  }, [search, actionFilter, entityFilter]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Nhật ký Hệ thống"
        description="Theo dõi lịch sử các thao tác trên hệ thống"
        breadcrumbs={[
          { label: "Home", href: "/app" },
          { label: "Quản trị", href: "/admin/users" },
          { label: "Nhật ký" },
        ]}
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Tìm theo tên người dùng..."
          className="sm:w-72"
        />
        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger className="sm:w-44">
            <SelectValue placeholder="Hành động" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả hành động</SelectItem>
            <SelectItem value="create">Tạo mới</SelectItem>
            <SelectItem value="update">Cập nhật</SelectItem>
            <SelectItem value="delete">Xóa</SelectItem>
          </SelectContent>
        </Select>
        <Select value={entityFilter} onValueChange={setEntityFilter}>
          <SelectTrigger className="sm:w-52">
            <SelectValue placeholder="Loại đối tượng" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả đối tượng</SelectItem>
            {entityTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {entityTypeLabels[type] ?? type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <DataTable columns={columns} data={filteredData} pageSize={10} />
    </div>
  );
}
