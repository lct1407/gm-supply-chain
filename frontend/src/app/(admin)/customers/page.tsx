"use client";

import { useState, useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Plus, MoreHorizontal, Eye, Pencil, Star } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { DataTable, SortableHeader } from "@/components/shared/data-table";
import { CustomerTypeBadge } from "@/components/shared/status-badge";
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
import { mockCustomers } from "@/lib/mock-data";
import type { Customer } from "@/types";

function PriorityDisplay({ level }: { level: number }) {
  return (
    <div className="flex items-center gap-1">
      <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
      <span className="font-medium">{level}</span>
    </div>
  );
}

const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: "code",
    header: ({ column }) => <SortableHeader column={column} label="Mã KH" />,
    cell: ({ row }) => (
      <span className="font-mono text-sm">{row.getValue("code")}</span>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => <SortableHeader column={column} label="Tên khách hàng" />,
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("name")}</span>
    ),
  },
  {
    accessorKey: "type",
    header: "Loại",
    cell: ({ row }) => <CustomerTypeBadge type={row.getValue("type")} />,
  },
  {
    accessorKey: "priority_level",
    header: ({ column }) => <SortableHeader column={column} label="Ưu tiên" />,
    cell: ({ row }) => <PriorityDisplay level={row.getValue("priority_level")} />,
  },
  {
    accessorKey: "rsl_requirement",
    header: "RSL yêu cầu",
    cell: ({ row }) => (
      <span className="font-medium">
        {(row.getValue<number>("rsl_requirement") * 100).toFixed(0)}%
      </span>
    ),
  },
  {
    accessorKey: "address",
    header: "Địa chỉ",
    cell: ({ row }) => (
      <span className="text-sm">{row.getValue("address")}</span>
    ),
  },
  {
    accessorKey: "contact_name",
    header: "Liên hệ",
    cell: ({ row }) => (
      <div className="text-sm">
        <p className="font-medium">{row.original.contact_name}</p>
        <p className="text-muted-foreground">{row.original.contact_phone}</p>
      </div>
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
            <Eye className="mr-2 h-4 w-4" />
            Xem chi tiết
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Pencil className="mr-2 h-4 w-4" />
            Chỉnh sửa
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const filteredData = useMemo(() => {
    return mockCustomers.filter((c) => {
      const matchSearch =
        !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.code.toLowerCase().includes(search.toLowerCase());
      const matchType = typeFilter === "all" || c.type === typeFilter;
      return matchSearch && matchType;
    });
  }, [search, typeFilter]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Khách hàng"
        description="Quản lý danh sách khách hàng đặt hàng nấm tươi"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Đơn hàng", href: "/orders" },
          { label: "Khách hàng" },
        ]}
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Thêm khách hàng
          </Button>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Tìm theo tên hoặc mã KH..."
          className="sm:w-72"
        />
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Loại khách hàng" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả loại</SelectItem>
            <SelectItem value="sieu_thi">Siêu thị</SelectItem>
            <SelectItem value="nha_hang">Nhà hàng</SelectItem>
            <SelectItem value="dai_ly">Đại lý</SelectItem>
            <SelectItem value="xuat_khau">Xuất khẩu</SelectItem>
            <SelectItem value="le">Bán lẻ</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable columns={columns} data={filteredData} />
    </div>
  );
}
