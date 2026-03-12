"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { Eye, CheckCircle, XCircle, Truck } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, SortableHeader } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { mockDeliveries } from "@/lib/mock-data";

// Filter deliveries for supplier s1
const supplierDeliveries = mockDeliveries.filter((d) => d.supplier_id === "s1");

const monthOptions = [
  { label: "Tất cả", value: "all" },
  { label: "03/2026", value: "2026-03" },
  { label: "02/2026", value: "2026-02" },
  { label: "01/2026", value: "2026-01" },
];

type QcGrade = "L1" | "L2" | "Reject";

function QcBadge({ grade }: { grade: string | null }) {
  if (!grade) return <span className="text-muted-foreground text-sm">-</span>;
  const map: Record<string, { variant: "success" | "warning" | "danger"; label: string }> = {
    L1: { variant: "success", label: "L1" },
    L2: { variant: "warning", label: "L2" },
    Reject: { variant: "danger", label: "Reject" },
  };
  const config = map[grade] ?? { variant: "success" as const, label: grade };
  return <StatusBadge label={config.label} variant={config.variant} />;
}

function OnTimeIcon({ onTime }: { onTime: boolean | null }) {
  if (onTime === null) return <span className="text-muted-foreground text-sm">-</span>;
  return onTime ? (
    <CheckCircle className="h-4 w-4 text-green-600" />
  ) : (
    <XCircle className="h-4 w-4 text-red-500" />
  );
}

export default function SupplierDeliveriesPage() {
  const [monthFilter, setMonthFilter] = useState("all");

  const filteredData = useMemo(() => {
    if (monthFilter === "all") return supplierDeliveries;
    return supplierDeliveries.filter((d) => d.delivery_date.startsWith(monthFilter));
  }, [monthFilter]);

  const columns: ColumnDef<typeof supplierDeliveries[number], unknown>[] = useMemo(
    () => [
      {
        accessorKey: "delivery_date",
        header: ({ column }) => <SortableHeader column={column} label="Ngày giao" />,
        cell: ({ row }) => (
          <span className="font-medium">{row.original.delivery_date}</span>
        ),
      },
      {
        id: "product",
        header: "Sản phẩm",
        cell: () => <span>Nấm rơm</span>, // Mock: s1 delivers Nấm rơm
      },
      {
        accessorKey: "ordered_qty",
        header: ({ column }) => <SortableHeader column={column} label="SL gửi (kg)" />,
        cell: ({ row }) => row.original.ordered_qty.toLocaleString(),
      },
      {
        accessorKey: "received_qty",
        header: ({ column }) => <SortableHeader column={column} label="SL nhận (kg)" />,
        cell: ({ row }) => (
          <span className={row.original.received_qty !== row.original.ordered_qty ? "text-amber-600 font-medium" : ""}>
            {row.original.received_qty?.toLocaleString() ?? "-"}
          </span>
        ),
      },
      {
        accessorKey: "quality_grade_actual",
        header: "QC",
        cell: ({ row }) => <QcBadge grade={row.original.quality_grade_actual} />,
      },
      {
        accessorKey: "on_time",
        header: "Đúng giờ",
        cell: ({ row }) => (
          <div className="flex justify-center">
            <OnTimeIcon onTime={row.original.on_time} />
          </div>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <Link href={`/supplier/deliveries/${row.original.id}`}>
            <Button variant="ghost" size="sm" className="text-teal-600 hover:text-teal-700 hover:bg-teal-50">
              <Eye className="h-4 w-4 mr-1" />
              Chi tiết
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
        title="Giao hàng"
        description="Theo dõi lịch sử giao hàng và kết quả QC"
        breadcrumbs={[
          { label: "Dashboard", href: "/supplier" },
          { label: "Giao hàng" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {filteredData.length} lượt giao
            </span>
          </div>
        }
      />

      {/* Month filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {monthOptions.map((opt) => (
              <Button
                key={opt.value}
                variant={monthFilter === opt.value ? "default" : "outline"}
                size="sm"
                onClick={() => setMonthFilter(opt.value)}
                className={monthFilter === opt.value ? "bg-teal-600 hover:bg-teal-700" : ""}
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
