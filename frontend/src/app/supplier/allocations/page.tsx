"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { Eye, FileText } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, SortableHeader } from "@/components/shared/data-table";
import { NegotiationStatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { NegotiationStatus } from "@/types";

// --- Types ---
interface SupplierAllocation {
  id: string;
  period: string;
  product: string;
  allocatedQty: number;
  negotiationStatus: NegotiationStatus;
  deadline: string;
}

// --- Mock data ---
const mockAllocations: SupplierAllocation[] = [
  { id: "a1", period: "2026-03", product: "Nấm rơm", allocatedQty: 500, negotiationStatus: "proposed", deadline: "2026-03-15" },
  { id: "a2", period: "2026-03", product: "Nấm bào ngư", allocatedQty: 300, negotiationStatus: "proposed", deadline: "2026-03-14" },
  { id: "a3", period: "2026-03", product: "Nấm đùi gà", allocatedQty: 200, negotiationStatus: "counter_proposed", deadline: "2026-03-16" },
  { id: "a4", period: "2026-02", product: "Nấm rơm", allocatedQty: 480, negotiationStatus: "agreed", deadline: "2026-02-10" },
  { id: "a5", period: "2026-02", product: "Nấm bào ngư", allocatedQty: 280, negotiationStatus: "agreed", deadline: "2026-02-10" },
  { id: "a6", period: "2026-01", product: "Nấm rơm", allocatedQty: 450, negotiationStatus: "agreed", deadline: "2026-01-08" },
];

const statusFilterOptions: { label: string; value: string }[] = [
  { label: "Tất cả", value: "all" },
  { label: "Chờ NCC", value: "proposed" },
  { label: "NCC counter", value: "counter_proposed" },
  { label: "Đã sửa", value: "revised" },
  { label: "Đồng ý", value: "agreed" },
  { label: "Từ chối", value: "rejected" },
];

export default function SupplierAllocationsPage() {
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredData = useMemo(() => {
    if (statusFilter === "all") return mockAllocations;
    return mockAllocations.filter((a) => a.negotiationStatus === statusFilter);
  }, [statusFilter]);

  const columns: ColumnDef<SupplierAllocation, unknown>[] = useMemo(
    () => [
      {
        accessorKey: "period",
        header: ({ column }) => <SortableHeader column={column} label="Kỳ" />,
        cell: ({ row }) => (
          <span className="font-medium text-teal-600">{row.original.period}</span>
        ),
      },
      {
        accessorKey: "product",
        header: ({ column }) => <SortableHeader column={column} label="Sản phẩm" />,
      },
      {
        accessorKey: "allocatedQty",
        header: ({ column }) => <SortableHeader column={column} label="SL phân bổ (kg)" />,
        cell: ({ row }) => (
          <span className="font-medium">{row.original.allocatedQty.toLocaleString()}</span>
        ),
      },
      {
        accessorKey: "negotiationStatus",
        header: "Trạng thái",
        cell: ({ row }) => (
          <NegotiationStatusBadge status={row.original.negotiationStatus} />
        ),
      },
      {
        accessorKey: "deadline",
        header: ({ column }) => <SortableHeader column={column} label="Hạn phản hồi" />,
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <Link href={`/supplier/allocations/${row.original.id}`}>
            <Button variant="ghost" size="sm" className="text-teal-600 hover:text-teal-700 hover:bg-teal-50">
              <Eye className="h-4 w-4 mr-1" />
              Xem chi tiết
            </Button>
          </Link>
        ),
      },
    ],
    [],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Phân bổ của tôi"
        description="Xem và phản hồi các kế hoạch phân bổ"
        breadcrumbs={[
          { label: "Dashboard", href: "/supplier" },
          { label: "Phân bổ" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {filteredData.length} phân bổ
            </span>
          </div>
        }
      />

      {/* Status filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {statusFilterOptions.map((opt) => (
              <Button
                key={opt.value}
                variant={statusFilter === opt.value ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(opt.value)}
                className={
                  statusFilter === opt.value
                    ? "bg-teal-600 hover:bg-teal-700"
                    : ""
                }
              >
                {opt.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <DataTable columns={columns} data={filteredData} pageSize={10} />
    </div>
  );
}
