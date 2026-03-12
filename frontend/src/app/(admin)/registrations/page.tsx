"use client";

import { useState, useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Clock, CheckCircle2, XCircle, Eye, FileText } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { DataTable, SortableHeader } from "@/components/shared/data-table";
import { RegistrationStatusBadge } from "@/components/shared/status-badge";
import { SearchInput } from "@/components/shared/search-input";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockRegistrations } from "@/lib/mock-data";
import type { SupplierRegistration } from "@/types";

const columns: ColumnDef<SupplierRegistration>[] = [
  {
    accessorKey: "business_name",
    header: ({ column }) => <SortableHeader column={column} label="Tên doanh nghiệp" />,
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("business_name")}</span>
    ),
  },
  {
    id: "contact",
    header: "Liên hệ",
    cell: ({ row }) => (
      <div className="text-sm">
        <p className="font-medium">{row.original.contact_name}</p>
        <p className="text-muted-foreground">{row.original.contact_phone}</p>
      </div>
    ),
  },
  {
    accessorKey: "farm_location",
    header: "Vùng trồng",
  },
  {
    id: "products",
    header: "Sản phẩm đăng ký",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.products.map((p, i) => (
          <Badge key={i} variant="outline" className="text-xs">
            {p.product_name}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => <SortableHeader column={column} label="Ngày đăng ký" />,
    cell: ({ row }) => {
      const date = new Date(row.getValue<string>("created_at"));
      return <span className="text-sm">{date.toLocaleDateString("vi-VN")}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => <RegistrationStatusBadge status={row.getValue("status")} />,
  },
  {
    id: "docs",
    header: "Tài liệu",
    cell: ({ row }) => (
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <FileText className="h-4 w-4" />
        <span>{row.original.documents.length}</span>
      </div>
    ),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
        <Eye className="h-4 w-4" />
      </Button>
    ),
  },
];

export default function RegistrationsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const stats = useMemo(() => {
    const pending = mockRegistrations.filter((r) => r.status === "pending").length;
    const approved = mockRegistrations.filter((r) => r.status === "approved").length;
    const rejected = mockRegistrations.filter((r) => r.status === "rejected").length;
    return { pending, approved, rejected };
  }, []);

  const filteredData = useMemo(() => {
    if (statusFilter === "all") return mockRegistrations;
    return mockRegistrations.filter((r) => r.status === statusFilter);
  }, [statusFilter]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Đăng ký NCC mới"
        description="Duyệt đơn đăng ký trở thành nhà cung cấp"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Nhà cung cấp", href: "/suppliers" },
          { label: "Đăng ký NCC mới" },
        ]}
      />

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Chờ duyệt"
          value={stats.pending}
          icon={Clock}
          iconColor="text-amber-500"
        />
        <StatCard
          title="Đã duyệt"
          value={stats.approved}
          icon={CheckCircle2}
          iconColor="text-green-500"
        />
        <StatCard
          title="Từ chối"
          value={stats.rejected}
          icon={XCircle}
          iconColor="text-red-500"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="pending">Chờ duyệt</SelectItem>
            <SelectItem value="approved">Đã duyệt</SelectItem>
            <SelectItem value="rejected">Từ chối</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable columns={columns} data={filteredData} />
    </div>
  );
}
