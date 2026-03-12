"use client";

import { useState, useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Plus, Pencil, ToggleLeft, ToggleRight, Thermometer } from "lucide-react";

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
import { mockProducts } from "@/lib/mock-data";
import type { Product } from "@/types";

const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <SortableHeader column={column} label="Tên sản phẩm" />
    ),
    cell: ({ row }) => (
      <span className="font-medium text-earth-900">{row.original.name}</span>
    ),
  },
  {
    accessorKey: "category",
    header: "Danh mục",
    cell: ({ row }) => (
      <StatusBadge label={row.original.category} variant="default" />
    ),
  },
  {
    accessorKey: "shelf_life_days",
    header: ({ column }) => (
      <SortableHeader column={column} label="Shelf life" />
    ),
    cell: ({ row }) => (
      <span className="text-sm text-earth-700 font-medium">
        {row.original.shelf_life_days} ngày
      </span>
    ),
  },
  {
    accessorKey: "shrinkage_rate",
    header: ({ column }) => (
      <SortableHeader column={column} label="Hao hụt" />
    ),
    cell: ({ row }) => (
      <span className="text-sm text-earth-700">
        {(row.original.shrinkage_rate * 100).toFixed(1)}%
      </span>
    ),
  },
  {
    id: "temp_range",
    header: "Nhiệt độ",
    cell: ({ row }) => (
      <span className="inline-flex items-center gap-1 text-sm text-earth-600">
        <Thermometer className="h-3.5 w-3.5 text-blue-500" />
        {row.original.temp_min}-{row.original.temp_max}°C
      </span>
    ),
  },
  {
    accessorKey: "is_active",
    header: "Trạng thái",
    cell: ({ row }) =>
      row.original.is_active ? (
        <StatusBadge label="Hoạt động" variant="success" />
      ) : (
        <StatusBadge label="Ngừng" variant="muted" />
      ),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Pencil className="mr-2 h-4 w-4" />
            Chỉnh sửa
          </DropdownMenuItem>
          <DropdownMenuItem>
            {row.original.is_active ? (
              <>
                <ToggleLeft className="mr-2 h-4 w-4" />
                Tắt hoạt động
              </>
            ) : (
              <>
                <ToggleRight className="mr-2 h-4 w-4" />
                Bật hoạt động
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredData = useMemo(() => {
    return mockProducts.filter((product) => {
      const matchesSearch =
        search === "" ||
        product.name.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && product.is_active) ||
        (statusFilter === "inactive" && !product.is_active);

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Danh mục Sản phẩm"
        description="Quản lý danh mục các loại nấm trong hệ thống"
        breadcrumbs={[
          { label: "Home", href: "/app" },
          { label: "Quản trị", href: "/admin/users" },
          { label: "Sản phẩm" },
        ]}
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Thêm sản phẩm
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Tìm theo tên sản phẩm..."
          className="sm:w-72"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="sm:w-48">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="active">Hoạt động</SelectItem>
            <SelectItem value="inactive">Ngừng</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <DataTable columns={columns} data={filteredData} pageSize={10} />
    </div>
  );
}
