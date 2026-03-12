"use client";

import { useState, useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import {
  Plus,
  Eye,
  Send,
  Play,
  CalendarRange,
  ClipboardCheck,
  FileBarChart,
  Users,
} from "lucide-react";
import Link from "next/link";

import { PageHeader } from "@/components/shared/page-header";
import { DataTable, SortableHeader } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { AllocationPlanStatus } from "@/types";

// Inline mock allocation plans
interface AllocationPlanRow {
  id: string;
  period: string;
  status: AllocationPlanStatus;
  total_demand: number;
  total_allocated: number;
  negotiation_deadline: string | null;
  created_by: string;
  approved_by: string | null;
}

const mockPlans: AllocationPlanRow[] = [
  {
    id: "ap1",
    period: "2026-03",
    status: "active",
    total_demand: 12500,
    total_allocated: 11800,
    negotiation_deadline: "2026-02-25T23:59:59Z",
    created_by: "Phạm Thị Lan",
    approved_by: "Trần Thị Director",
  },
  {
    id: "ap2",
    period: "2026-04",
    status: "approved",
    total_demand: 14200,
    total_allocated: 13500,
    negotiation_deadline: "2026-03-25T23:59:59Z",
    created_by: "Phạm Thị Lan",
    approved_by: "Trần Thị Director",
  },
  {
    id: "ap3",
    period: "2026-05",
    status: "review",
    total_demand: 15000,
    total_allocated: 9200,
    negotiation_deadline: "2026-04-20T23:59:59Z",
    created_by: "Phạm Thị Lan",
    approved_by: null,
  },
  {
    id: "ap4",
    period: "2026-06",
    status: "draft",
    total_demand: 13800,
    total_allocated: 0,
    negotiation_deadline: null,
    created_by: "Phạm Thị Lan",
    approved_by: null,
  },
];

const planStatusMap: Record<AllocationPlanStatus, { label: string; variant: "default" | "success" | "warning" | "info" | "muted" }> = {
  draft: { label: "Nháp", variant: "muted" },
  review: { label: "Đang duyệt", variant: "warning" },
  approved: { label: "Đã duyệt", variant: "success" },
  active: { label: "Đang hoạt động", variant: "info" },
};

function PlanStatusBadge({ status }: { status: AllocationPlanStatus }) {
  const s = planStatusMap[status];
  return <StatusBadge label={s.label} variant={s.variant} />;
}

const columns: ColumnDef<AllocationPlanRow, unknown>[] = [
  {
    accessorKey: "period",
    header: ({ column }) => <SortableHeader column={column} label="Kỳ" />,
    cell: ({ row }) => <span className="font-semibold">{row.original.period}</span>,
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => <PlanStatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "total_demand",
    header: ({ column }) => <SortableHeader column={column} label="Tổng nhu cầu (kg)" />,
    cell: ({ row }) =>
      new Intl.NumberFormat("vi-VN").format(row.original.total_demand),
  },
  {
    accessorKey: "total_allocated",
    header: ({ column }) => <SortableHeader column={column} label="Đã phân bổ (kg)" />,
    cell: ({ row }) => {
      const pct =
        row.original.total_demand > 0
          ? Math.round(
              (row.original.total_allocated / row.original.total_demand) * 100,
            )
          : 0;
      return (
        <div className="flex items-center gap-2">
          <span>{new Intl.NumberFormat("vi-VN").format(row.original.total_allocated)}</span>
          <span className="text-xs text-muted-foreground">({pct}%)</span>
        </div>
      );
    },
  },
  {
    accessorKey: "negotiation_deadline",
    header: "Hạn thương lượng",
    cell: ({ row }) =>
      row.original.negotiation_deadline
        ? new Date(row.original.negotiation_deadline).toLocaleDateString("vi-VN")
        : "—",
  },
  {
    accessorKey: "created_by",
    header: "Người tạo",
  },
  {
    accessorKey: "approved_by",
    header: "Người duyệt",
    cell: ({ row }) => row.original.approved_by ?? "—",
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const plan = row.original;
      return (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" title="Xem chi tiết">
            <Eye className="h-4 w-4" />
          </Button>
          {plan.status === "draft" && (
            <Button variant="ghost" size="sm" title="Tạo phân bổ">
              <Play className="h-4 w-4" />
            </Button>
          )}
          {(plan.status === "approved" || plan.status === "review") && (
            <Button variant="ghost" size="sm" title="Gửi NCC">
              <Send className="h-4 w-4" />
            </Button>
          )}
        </div>
      );
    },
  },
];

export default function AllocationPlansPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Kế hoạch Phân bổ"
        description="Quản lý kế hoạch phân bổ nguồn cung theo tháng"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Phân bổ", href: "/allocations" },
          { label: "Kế hoạch tháng" },
        ]}
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tạo kế hoạch tháng
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50">
              <CalendarRange className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tổng kế hoạch</p>
              <p className="text-xl font-bold">{mockPlans.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-50">
              <ClipboardCheck className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Đang hoạt động</p>
              <p className="text-xl font-bold">
                {mockPlans.filter((p) => p.status === "active").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-50">
              <FileBarChart className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Đang duyệt</p>
              <p className="text-xl font-bold">
                {mockPlans.filter((p) => p.status === "review").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-50">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tổng phân bổ (kg)</p>
              <p className="text-xl font-bold">
                {new Intl.NumberFormat("vi-VN").format(
                  mockPlans.reduce((s, p) => s + p.total_allocated, 0),
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation to negotiations */}
      <div className="flex gap-2">
        <Link href="/allocations">
          <Button variant="default" size="sm">
            Kế hoạch tháng
          </Button>
        </Link>
        <Link href="/allocations/negotiations">
          <Button variant="outline" size="sm">
            Thương lượng
          </Button>
        </Link>
      </div>

      <DataTable columns={columns} data={mockPlans} />
    </div>
  );
}
