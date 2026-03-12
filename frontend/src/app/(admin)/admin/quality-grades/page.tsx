"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Plus, Pencil } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockQualityGrades } from "@/lib/mock-data";
import type { QualityGrade } from "@/types";

const columns: ColumnDef<QualityGrade>[] = [
  {
    accessorKey: "code",
    header: "Mã phân loại",
    cell: ({ row }) => (
      <StatusBadge
        label={row.original.code}
        variant={
          row.original.code === "L1"
            ? "success"
            : row.original.code === "L2"
              ? "info"
              : "warning"
        }
      />
    ),
  },
  {
    accessorKey: "name",
    header: "Tên",
    cell: ({ row }) => (
      <span className="font-medium text-earth-900">{row.original.name}</span>
    ),
  },
  {
    accessorKey: "description",
    header: "Mô tả",
    cell: ({ row }) => (
      <span className="text-sm text-earth-600 max-w-md truncate block">
        {row.original.description}
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

export default function QualityGradesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Phân loại Chất lượng"
        description="Quản lý các mức phân loại chất lượng nấm"
        breadcrumbs={[
          { label: "Home", href: "/app" },
          { label: "Quản trị", href: "/admin/users" },
          { label: "Phân loại chất lượng" },
        ]}
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Thêm phân loại
          </Button>
        }
      />

      <DataTable columns={columns} data={mockQualityGrades} pageSize={10} />
    </div>
  );
}
