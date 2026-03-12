"use client";

import { useMemo } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, SortableHeader } from "@/components/shared/data-table";
import { RankBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Download } from "lucide-react";
import { mockSuppliers } from "@/lib/mock-data";
import { type ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";

interface SupplierPerfRow {
  id: string;
  name: string;
  code: string;
  otd: number;
  fillRate: number;
  quality: number;
  price: number;
  flexibility: number;
  totalScore: number;
  rank: string;
}

// Generate mock performance data based on existing suppliers
const perfData: SupplierPerfRow[] = mockSuppliers
  .filter((s) => s.status === "active" || s.status === "inactive")
  .map((s) => {
    const base = s.score ?? 50;
    const otd = Math.min(100, Math.round(base + (Math.random() - 0.3) * 15));
    const fillRate = Math.min(100, Math.round(base + (Math.random() - 0.4) * 12));
    const quality = Math.min(100, Math.round(base + (Math.random() - 0.2) * 10));
    const price = Math.min(100, Math.round(base + (Math.random() - 0.5) * 18));
    const flexibility = Math.min(100, Math.round(base + (Math.random() - 0.3) * 14));
    const totalScore = Math.round((otd + fillRate + quality + price + flexibility) / 5);
    const rank = totalScore >= 85 ? "A" : totalScore >= 70 ? "B" : totalScore >= 55 ? "C" : "D";
    return {
      id: s.id,
      name: s.name,
      code: s.code,
      otd,
      fillRate,
      quality,
      price,
      flexibility,
      totalScore,
      rank,
    };
  })
  .sort((a, b) => b.totalScore - a.totalScore);

function ScoreCell({ value }: { value: number }) {
  return (
    <span
      className={cn(
        "font-medium",
        value >= 85 && "text-green-700 bg-green-50 px-2 py-0.5 rounded",
        value >= 70 && value < 85 && "text-blue-700 bg-blue-50 px-2 py-0.5 rounded",
        value < 70 && "text-amber-700 bg-amber-50 px-2 py-0.5 rounded"
      )}
    >
      {value}
    </span>
  );
}

const columns: ColumnDef<SupplierPerfRow>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <SortableHeader column={column} label="NCC" />,
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.original.name}</p>
        <p className="text-xs text-muted-foreground">{row.original.code}</p>
      </div>
    ),
  },
  {
    accessorKey: "otd",
    header: ({ column }) => <SortableHeader column={column} label="OTD" />,
    cell: ({ row }) => <ScoreCell value={row.original.otd} />,
  },
  {
    accessorKey: "fillRate",
    header: ({ column }) => <SortableHeader column={column} label="Fill Rate" />,
    cell: ({ row }) => <ScoreCell value={row.original.fillRate} />,
  },
  {
    accessorKey: "quality",
    header: ({ column }) => <SortableHeader column={column} label="Chất lượng" />,
    cell: ({ row }) => <ScoreCell value={row.original.quality} />,
  },
  {
    accessorKey: "price",
    header: ({ column }) => <SortableHeader column={column} label="Giá" />,
    cell: ({ row }) => <ScoreCell value={row.original.price} />,
  },
  {
    accessorKey: "flexibility",
    header: ({ column }) => <SortableHeader column={column} label="Linh hoạt" />,
    cell: ({ row }) => <ScoreCell value={row.original.flexibility} />,
  },
  {
    accessorKey: "totalScore",
    header: ({ column }) => <SortableHeader column={column} label="Tổng điểm" />,
    cell: ({ row }) => (
      <span className="text-base font-bold">{row.original.totalScore}</span>
    ),
  },
  {
    accessorKey: "rank",
    header: "Hạng",
    cell: ({ row }) => <RankBadge rank={row.original.rank} />,
  },
];

export default function SupplierPerfReportPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Báo cáo Hiệu suất NCC"
        description="Đánh giá nhà cung cấp theo đa tiêu chí"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Báo cáo", href: "/reports" },
          { label: "Hiệu suất NCC" },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-1" />
              Tháng 3/2026
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Xuất Excel
            </Button>
          </div>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Bảng điểm NCC - Kỳ tháng 3/2026</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={perfData} pageSize={10} />
        </CardContent>
      </Card>

      <div className="flex gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-green-50 border border-green-200" />
          &ge; 85: Xuất sắc
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-blue-50 border border-blue-200" />
          70-84: Tốt
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-amber-50 border border-amber-200" />
          &lt; 70: Cần cải thiện
        </span>
      </div>
    </div>
  );
}
