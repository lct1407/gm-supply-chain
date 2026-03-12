"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Plus, Pencil } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { DataTable, SortableHeader } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockUnits } from "@/lib/mock-data";
import type { Unit } from "@/types";

const columns: ColumnDef<Unit>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <SortableHeader column={column} label="Tên đơn vị" />
    ),
    cell: ({ row }) => (
      <span className="font-medium text-earth-900">{row.original.name}</span>
    ),
  },
  {
    accessorKey: "conversion_rate",
    header: ({ column }) => (
      <SortableHeader column={column} label="Quy đổi sang kg" />
    ),
    cell: ({ row }) => (
      <span className="text-sm text-earth-700">
        1 {row.original.name} = {row.original.conversion_rate} kg
      </span>
    ),
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
            <Pencil className="mr-2 h-4 w-4" />
            Chỉnh sửa
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export default function UnitsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Đơn vị tính"
        description="Quản lý đơn vị tính và tỷ lệ quy đổi sang kg"
        breadcrumbs={[
          { label: "Home", href: "/app" },
          { label: "Quản trị", href: "/admin/users" },
          { label: "Đơn vị tính" },
        ]}
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Thêm đơn vị
          </Button>
        }
      />

      <DataTable columns={columns} data={mockUnits} pageSize={10} />
    </div>
  );
}
