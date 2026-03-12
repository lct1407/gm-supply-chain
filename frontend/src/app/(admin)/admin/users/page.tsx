"use client";

import { useState, useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Plus, UserCheck, UserX } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

import { PageHeader } from "@/components/shared/page-header";
import { DataTable, SortableHeader } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { SearchInput } from "@/components/shared/search-input";
import { Button } from "@/components/ui/button";
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
import { mockUsers } from "@/lib/mock-data";
import type { User, UserRole, PortalType } from "@/types";

type Variant = "default" | "success" | "warning" | "danger" | "info" | "muted";

const roleLabels: Record<UserRole, string> = {
  admin: "Admin",
  director: "Director",
  manager: "Manager",
  procurement_staff: "Procurement",
  qc_staff: "QC",
  warehouse_staff: "Warehouse",
  viewer: "Viewer",
  ncc_owner: "NCC Owner",
  ncc_staff: "NCC Staff",
};

const roleVariants: Record<UserRole, Variant> = {
  admin: "danger",
  director: "info",
  manager: "info",
  procurement_staff: "default",
  qc_staff: "warning",
  warehouse_staff: "success",
  viewer: "muted",
  ncc_owner: "default",
  ncc_staff: "muted",
};

const portalLabels: Record<PortalType, string> = {
  admin: "Admin Portal",
  supplier: "Supplier Portal",
};

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "full_name",
    header: ({ column }) => <SortableHeader column={column} label="Họ tên" />,
    cell: ({ row }) => (
      <div>
        <p className="font-medium text-earth-900">{row.original.full_name}</p>
        <p className="text-xs text-muted-foreground">{row.original.email}</p>
      </div>
    ),
  },
  {
    accessorKey: "role",
    header: "Vai trò",
    cell: ({ row }) => {
      const role = row.original.role;
      return (
        <StatusBadge
          label={roleLabels[role]}
          variant={roleVariants[role]}
        />
      );
    },
  },
  {
    accessorKey: "portal_type",
    header: "Portal",
    cell: ({ row }) => (
      <span className="text-sm text-earth-600">
        {portalLabels[row.original.portal_type]}
      </span>
    ),
  },
  {
    accessorKey: "is_active",
    header: "Trạng thái",
    cell: ({ row }) =>
      row.original.is_active ? (
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-700">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          Hoạt động
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500">
          <span className="w-2 h-2 rounded-full bg-gray-400" />
          Ngừng HĐ
        </span>
      ),
  },
  {
    accessorKey: "last_login",
    header: ({ column }) => (
      <SortableHeader column={column} label="Đăng nhập cuối" />
    ),
    cell: ({ row }) => {
      const lastLogin = row.original.last_login;
      if (!lastLogin) return <span className="text-muted-foreground">--</span>;
      return (
        <span className="text-sm text-earth-600">
          {format(new Date(lastLogin), "dd/MM/yyyy HH:mm", { locale: vi })}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <UserCheck className="mr-2 h-4 w-4" />
            Chỉnh sửa
          </DropdownMenuItem>
          <DropdownMenuItem className="text-red-600">
            <UserX className="mr-2 h-4 w-4" />
            Vô hiệu hóa
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [portalFilter, setPortalFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredData = useMemo(() => {
    return mockUsers.filter((user) => {
      const matchesSearch =
        search === "" ||
        user.full_name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());

      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesPortal =
        portalFilter === "all" || user.portal_type === portalFilter;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && user.is_active) ||
        (statusFilter === "inactive" && !user.is_active);

      return matchesSearch && matchesRole && matchesPortal && matchesStatus;
    });
  }, [search, roleFilter, portalFilter, statusFilter]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản lý Người dùng"
        description="Quản lý tài khoản người dùng trên hệ thống"
        breadcrumbs={[
          { label: "Home", href: "/app" },
          { label: "Quản trị", href: "/admin/users" },
          { label: "Người dùng" },
        ]}
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Thêm người dùng
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Tìm theo tên hoặc email..."
          className="sm:w-72"
        />
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="sm:w-48">
            <SelectValue placeholder="Vai trò" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả vai trò</SelectItem>
            {Object.entries(roleLabels).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={portalFilter} onValueChange={setPortalFilter}>
          <SelectTrigger className="sm:w-48">
            <SelectValue placeholder="Portal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả portal</SelectItem>
            <SelectItem value="admin">Admin Portal</SelectItem>
            <SelectItem value="supplier">Supplier Portal</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="sm:w-40">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="active">Hoạt động</SelectItem>
            <SelectItem value="inactive">Ngừng HĐ</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <DataTable columns={columns} data={filteredData} pageSize={10} />
    </div>
  );
}
