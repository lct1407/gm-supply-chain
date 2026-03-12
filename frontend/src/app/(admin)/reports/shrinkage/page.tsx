"use client";

import { useMemo } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, SortableHeader } from "@/components/shared/data-table";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Weight,
} from "lucide-react";
import { mockProducts } from "@/lib/mock-data";
import { type ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";

interface ShrinkageRow {
  productId: string;
  productName: string;
  standardRate: number;
  actualRate: number;
  difference: number;
  trend: "up" | "down";
  totalKg: number;
}

const shrinkageData: ShrinkageRow[] = mockProducts
  .filter((p) => p.is_active && p.category === "Nấm tươi")
  .map((p) => {
    const standardRate = p.shrinkage_rate * 100;
    const variance = (Math.random() - 0.4) * 4;
    const actualRate = Math.round((standardRate + variance) * 10) / 10;
    const diff = Math.round((actualRate - standardRate) * 10) / 10;
    return {
      productId: p.id,
      productName: p.name,
      standardRate: Math.round(standardRate * 10) / 10,
      actualRate,
      difference: diff,
      trend: diff > 0 ? "up" as const : "down" as const,
      totalKg: Math.round(Math.random() * 50 + 10),
    };
  });

const columns: ColumnDef<ShrinkageRow>[] = [
  {
    accessorKey: "productName",
    header: ({ column }) => <SortableHeader column={column} label="Sản phẩm" />,
    cell: ({ row }) => <span className="font-medium">{row.original.productName}</span>,
  },
  {
    accessorKey: "standardRate",
    header: ({ column }) => <SortableHeader column={column} label="Tỷ lệ chuẩn (%)" />,
    cell: ({ row }) => <span>{row.original.standardRate}%</span>,
  },
  {
    accessorKey: "actualRate",
    header: ({ column }) => <SortableHeader column={column} label="Tỷ lệ thực tế (%)" />,
    cell: ({ row }) => {
      const exceeds = row.original.actualRate > row.original.standardRate;
      return (
        <span className={cn("font-semibold", exceeds ? "text-red-600" : "text-green-600")}>
          {row.original.actualRate}%
        </span>
      );
    },
  },
  {
    accessorKey: "difference",
    header: ({ column }) => <SortableHeader column={column} label="Chênh lệch" />,
    cell: ({ row }) => {
      const diff = row.original.difference;
      return (
        <span className={cn("font-medium", diff > 0 ? "text-red-600" : "text-green-600")}>
          {diff > 0 ? "+" : ""}
          {diff}%
        </span>
      );
    },
  },
  {
    accessorKey: "trend",
    header: "Xu hướng",
    cell: ({ row }) =>
      row.original.trend === "up" ? (
        <TrendingUp className="h-4 w-4 text-red-500" />
      ) : (
        <TrendingDown className="h-4 w-4 text-green-500" />
      ),
  },
  {
    accessorKey: "totalKg",
    header: ({ column }) => <SortableHeader column={column} label="Tổng hao hụt (kg)" />,
    cell: ({ row }) => <span className="font-medium">{row.original.totalKg} kg</span>,
  },
];

export default function ShrinkageReportPage() {
  const avgRate = useMemo(() => {
    const sum = shrinkageData.reduce((s, r) => s + r.actualRate, 0);
    return Math.round((sum / shrinkageData.length) * 10) / 10;
  }, []);

  const highestProduct = useMemo(() => {
    return shrinkageData.reduce((max, r) => (r.actualRate > max.actualRate ? r : max), shrinkageData[0]);
  }, []);

  const totalKg = useMemo(() => {
    return shrinkageData.reduce((s, r) => s + r.totalKg, 0);
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Báo cáo Hao hụt"
        description="Theo dõi tỷ lệ hao hụt thực tế so với tiêu chuẩn"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Báo cáo", href: "/reports" },
          { label: "Hao hụt" },
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

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Hao hụt trung bình"
          value={`${avgRate}%`}
          icon={AlertTriangle}
          iconColor="text-amber-600"
        />
        <StatCard
          title="Hao hụt cao nhất"
          value={`${highestProduct.productName} (${highestProduct.actualRate}%)`}
          icon={TrendingUp}
          iconColor="text-red-600"
        />
        <StatCard
          title="Tổng hao hụt"
          value={`${totalKg} kg`}
          icon={Weight}
          iconColor="text-purple-600"
        />
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Chi tiết hao hụt theo sản phẩm</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={shrinkageData} pageSize={10} />
        </CardContent>
      </Card>
    </div>
  );
}
