"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { Plus, Upload, MoreHorizontal, Eye, Pencil } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { DataTable, SortableHeader } from "@/components/shared/data-table";
import { SupplierStatusBadge, RankBadge } from "@/components/shared/status-badge";
import { SearchInput } from "@/components/shared/search-input";
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
import { mockSuppliers, mockSupplierProducts } from "@/lib/mock-data";
import { mockProducts } from "@/lib/mock-data";
import type { Supplier } from "@/types";

function ScoreDisplay({ score }: { score: number | null }) {
  if (score === null) return <span className="text-muted-foreground text-sm">--</span>;
  let color = "text-red-600";
  if (score >= 85) color = "text-green-600";
  else if (score >= 70) color = "text-blue-600";
  else if (score >= 55) color = "text-amber-600";
  return <span className={`font-semibold ${color}`}>{score}</span>;
}

function SupplierProductTags({ supplierId }: { supplierId: string }) {
  const products = mockSupplierProducts
    .filter((sp) => sp.supplier_id === supplierId)
    .map((sp) => sp.product?.name)
    .filter(Boolean);

  if (products.length === 0) {
    return <span className="text-muted-foreground text-sm">--</span>;
  }

  return (
    <div className="flex flex-wrap gap-1">
      {products.map((name, i) => (
        <Badge key={i} variant="outline" className="text-xs">
          {name}
        </Badge>
      ))}
    </div>
  );
}

const columns: ColumnDef<Supplier>[] = [
  {
    accessorKey: "code",
    header: ({ column }) => <SortableHeader column={column} label="Mã NCC" />,
    cell: ({ row }) => (
      <span className="font-mono text-sm">{row.getValue("code")}</span>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => <SortableHeader column={column} label="Tên NCC" />,
    cell: ({ row }) => (
      <Link
        href={`/suppliers/${row.original.id}`}
        className="font-medium text-primary hover:underline"
      >
        {row.getValue("name")}
      </Link>
    ),
  },
  {
    accessorKey: "farm_location",
    header: "Vùng trồng",
    cell: ({ row }) => <span>{row.getValue("farm_location")}</span>,
  },
  {
    id: "products",
    header: "Sản phẩm",
    cell: ({ row }) => <SupplierProductTags supplierId={row.original.id} />,
  },
  {
    accessorKey: "score",
    header: ({ column }) => <SortableHeader column={column} label="Điểm" />,
    cell: ({ row }) => <ScoreDisplay score={row.getValue("score")} />,
  },
  {
    accessorKey: "rank",
    header: "Hạng",
    cell: ({ row }) => <RankBadge rank={row.getValue("rank")} />,
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => <SupplierStatusBadge status={row.getValue("status")} />,
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
          <DropdownMenuItem asChild>
            <Link href={`/suppliers/${row.original.id}`}>
              <Eye className="mr-2 h-4 w-4" />
              Xem chi tiết
            </Link>
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

export default function SuppliersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [rankFilter, setRankFilter] = useState<string>("all");

  const filteredData = useMemo(() => {
    return mockSuppliers.filter((s) => {
      const matchSearch =
        !search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.code.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || s.status === statusFilter;
      const matchRank = rankFilter === "all" || s.rank === rankFilter;
      return matchSearch && matchStatus && matchRank;
    });
  }, [search, statusFilter, rankFilter]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Nhà cung cấp"
        description="Quản lý danh sách nhà cung cấp nấm tươi"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Nhà cung cấp" },
        ]}
        actions={
          <>
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Import Excel
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Thêm NCC
            </Button>
          </>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Tìm theo tên hoặc mã NCC..."
          className="sm:w-72"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="active">Hoạt động</SelectItem>
            <SelectItem value="inactive">Tạm ngưng</SelectItem>
            <SelectItem value="suspended">Đình chỉ</SelectItem>
            <SelectItem value="terminated">Chấm dứt</SelectItem>
          </SelectContent>
        </Select>
        <Select value={rankFilter} onValueChange={setRankFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Hạng" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả hạng</SelectItem>
            <SelectItem value="A">Hạng A</SelectItem>
            <SelectItem value="B">Hạng B</SelectItem>
            <SelectItem value="C">Hạng C</SelectItem>
            <SelectItem value="D">Hạng D</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable columns={columns} data={filteredData} />
    </div>
  );
}
