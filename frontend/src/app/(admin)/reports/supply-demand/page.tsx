"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, SortableHeader } from "@/components/shared/data-table";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Calendar, Download } from "lucide-react";
import { mockProducts } from "@/lib/mock-data";
import { type ColumnDef } from "@tanstack/react-table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// --- Inline mock data ---
interface SupplyDemandRow {
  productId: string;
  productName: string;
  totalDemand: number;
  totalSupply: number;
  gap: number;
  gapPct: number;
}

const chartData = mockProducts
  .filter((p) => p.is_active && p.category === "Nấm tươi")
  .map((p) => {
    const demand = Math.round(800 + Math.random() * 1200);
    const supply = Math.round(demand * (0.8 + Math.random() * 0.35));
    return {
      name: p.name.replace("Nấm ", ""),
      supply,
      demand,
    };
  });

const tableData: SupplyDemandRow[] = mockProducts
  .filter((p) => p.is_active && p.category === "Nấm tươi")
  .map((p, i) => {
    const demand = chartData[i].demand;
    const supply = chartData[i].supply;
    const gap = supply - demand;
    return {
      productId: p.id,
      productName: p.name,
      totalDemand: demand,
      totalSupply: supply,
      gap,
      gapPct: Math.round((gap / demand) * 100 * 10) / 10,
    };
  });

const columns: ColumnDef<SupplyDemandRow>[] = [
  {
    accessorKey: "productName",
    header: ({ column }) => <SortableHeader column={column} label="Sản phẩm" />,
  },
  {
    accessorKey: "totalDemand",
    header: ({ column }) => <SortableHeader column={column} label="Tổng cầu (kg)" />,
    cell: ({ row }) => <span className="font-medium">{row.original.totalDemand.toLocaleString()}</span>,
  },
  {
    accessorKey: "totalSupply",
    header: ({ column }) => <SortableHeader column={column} label="Tổng cung (kg)" />,
    cell: ({ row }) => <span className="font-medium">{row.original.totalSupply.toLocaleString()}</span>,
  },
  {
    accessorKey: "gap",
    header: ({ column }) => <SortableHeader column={column} label="Chênh lệch (kg)" />,
    cell: ({ row }) => {
      const gap = row.original.gap;
      return (
        <span className={gap < 0 ? "text-red-600 font-semibold" : "text-green-600 font-semibold"}>
          {gap > 0 ? "+" : ""}
          {gap.toLocaleString()}
        </span>
      );
    },
  },
  {
    accessorKey: "gapPct",
    header: ({ column }) => <SortableHeader column={column} label="Chênh lệch (%)" />,
    cell: ({ row }) => {
      const pct = row.original.gapPct;
      return (
        <div className="flex items-center gap-1">
          {pct < 0 ? (
            <TrendingDown className="h-4 w-4 text-red-500" />
          ) : (
            <TrendingUp className="h-4 w-4 text-green-500" />
          )}
          <span className={pct < 0 ? "text-red-600 font-medium" : "text-green-600 font-medium"}>
            {pct > 0 ? "+" : ""}
            {pct}%
          </span>
        </div>
      );
    },
  },
];

export default function SupplyDemandReportPage() {
  const totalDemand = useMemo(() => tableData.reduce((s, r) => s + r.totalDemand, 0), []);
  const totalSupply = useMemo(() => tableData.reduce((s, r) => s + r.totalSupply, 0), []);
  const totalGap = totalSupply - totalDemand;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Báo cáo Cung - Cầu"
        description="Phân tích chênh lệch nguồn cung và nhu cầu theo sản phẩm"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Báo cáo", href: "/reports" },
          { label: "Cung - Cầu" },
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

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Tổng nhu cầu"
          value={`${totalDemand.toLocaleString()} kg`}
          icon={TrendingUp}
          iconColor="text-blue-600"
        />
        <StatCard
          title="Tổng nguồn cung"
          value={`${totalSupply.toLocaleString()} kg`}
          icon={TrendingUp}
          iconColor="text-green-600"
        />
        <StatCard
          title="Chênh lệch"
          value={`${totalGap > 0 ? "+" : ""}${totalGap.toLocaleString()} kg`}
          change={`${Math.round((totalGap / totalDemand) * 100 * 10) / 10}%`}
          changeType={totalGap >= 0 ? "up" : "down"}
          icon={totalGap >= 0 ? TrendingUp : TrendingDown}
          iconColor={totalGap >= 0 ? "text-green-600" : "text-red-600"}
        />
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Cung vs Cầu theo sản phẩm</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v: number) => `${v}kg`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Legend />
                <Bar dataKey="supply" name="Nguồn cung" fill="#16a34a" radius={[4, 4, 0, 0]} />
                <Bar dataKey="demand" name="Nhu cầu" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Chi tiết theo sản phẩm</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={tableData} pageSize={10} />
        </CardContent>
      </Card>
    </div>
  );
}
