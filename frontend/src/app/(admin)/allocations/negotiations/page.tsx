"use client";

import { useState, useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  AlertTriangle,
  Check,
  X,
  RotateCcw,
  MessageSquare,
} from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { DataTable, SortableHeader } from "@/components/shared/data-table";
import { NegotiationStatusBadge } from "@/components/shared/status-badge";
import { SearchInput } from "@/components/shared/search-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import type { NegotiationStatus } from "@/types";

interface NegotiationRow {
  id: string;
  supplier_name: string;
  product: string;
  round: number;
  max_rounds: number;
  status: NegotiationStatus;
  deadline: string;
  proposed_qty: number;
  counter_qty: number | null;
  counter_reason: string | null;
}

const mockNegotiations: NegotiationRow[] = [
  {
    id: "n1",
    supplier_name: "Trang trại ABC",
    product: "Nấm rơm",
    round: 1,
    max_rounds: 3,
    status: "proposed",
    deadline: "2026-03-13T08:00:00Z",
    proposed_qty: 500,
    counter_qty: null,
    counter_reason: null,
  },
  {
    id: "n2",
    supplier_name: "HTX Nấm Củ Chi",
    product: "Nấm bào ngư",
    round: 2,
    max_rounds: 3,
    status: "counter_proposed",
    deadline: "2026-03-12T18:00:00Z",
    proposed_qty: 300,
    counter_qty: 220,
    counter_reason: "Năng suất tháng này giảm do thời tiết nóng, chỉ cung ứng tối đa 220kg",
  },
  {
    id: "n3",
    supplier_name: "Farm Đà Lạt Green",
    product: "Nấm đùi gà",
    round: 3,
    max_rounds: 3,
    status: "revised",
    deadline: "2026-03-14T23:59:59Z",
    proposed_qty: 400,
    counter_qty: 350,
    counter_reason: "Đã thương lượng giảm 50kg, đề xuất giữ 350kg",
  },
  {
    id: "n4",
    supplier_name: "Trang trại ABC",
    product: "Nấm kim châm",
    round: 1,
    max_rounds: 3,
    status: "agreed",
    deadline: "2026-03-11T23:59:59Z",
    proposed_qty: 200,
    counter_qty: 200,
    counter_reason: null,
  },
  {
    id: "n5",
    supplier_name: "NCC Phú Yên",
    product: "Nấm mèo",
    round: 2,
    max_rounds: 3,
    status: "rejected",
    deadline: "2026-03-10T23:59:59Z",
    proposed_qty: 150,
    counter_qty: 50,
    counter_reason: "Không đủ năng lực giao hàng, từ chối toàn bộ",
  },
  {
    id: "n6",
    supplier_name: "HTX Nấm Củ Chi",
    product: "Nấm rơm",
    round: 1,
    max_rounds: 3,
    status: "escalated",
    deadline: "2026-03-12T10:00:00Z",
    proposed_qty: 600,
    counter_qty: 250,
    counter_reason: "NCC không phản hồi sau 2 vòng, cần escalate lên quản lý",
  },
];

function getDeadlineDisplay(deadline: string): { text: string; isUrgent: boolean } {
  const now = new Date("2026-03-12T09:00:00Z"); // mock current time
  const dl = new Date(deadline);
  const diffMs = dl.getTime() - now.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffMs < 0) {
    return { text: "Đã hết hạn", isUrgent: true };
  }
  if (diffHours < 12) {
    return { text: `${diffHours}h còn lại`, isUrgent: true };
  }
  if (diffDays < 1) {
    return { text: `${diffHours}h còn lại`, isUrgent: false };
  }
  return { text: `${diffDays} ngày còn lại`, isUrgent: false };
}

export default function NegotiationsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const filteredData = useMemo(() => {
    return mockNegotiations.filter((n) => {
      const matchSearch =
        !search ||
        n.supplier_name.toLowerCase().includes(search.toLowerCase()) ||
        n.product.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || n.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Thương lượng Phân bổ"
        description="Theo dõi tiến trình thương lượng với nhà cung cấp"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Phân bổ", href: "/allocations" },
          { label: "Thương lượng" },
        ]}
      />

      {/* Navigation */}
      <div className="flex gap-2">
        <Link href="/allocations">
          <Button variant="outline" size="sm">
            Kế hoạch tháng
          </Button>
        </Link>
        <Link href="/allocations/negotiations">
          <Button variant="default" size="sm">
            Thương lượng
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Tìm NCC, sản phẩm..."
              className="sm:w-72"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="sm:w-48">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="proposed">Chờ NCC</SelectItem>
                <SelectItem value="counter_proposed">NCC counter</SelectItem>
                <SelectItem value="revised">Đã sửa</SelectItem>
                <SelectItem value="agreed">Đồng ý</SelectItem>
                <SelectItem value="rejected">Từ chối</SelectItem>
                <SelectItem value="escalated">Escalated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table with expandable rows */}
      <Card>
        <CardContent className="p-0">
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-3 text-left font-medium w-8"></th>
                  <th className="p-3 text-left font-medium">Nhà cung cấp</th>
                  <th className="p-3 text-left font-medium">Sản phẩm</th>
                  <th className="p-3 text-left font-medium">Vòng</th>
                  <th className="p-3 text-left font-medium">Trạng thái</th>
                  <th className="p-3 text-left font-medium">Hạn chót</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row) => {
                  const isExpanded = expandedRow === row.id;
                  const deadline = getDeadlineDisplay(row.deadline);
                  return (
                    <>
                      <tr
                        key={row.id}
                        className="border-b hover:bg-muted/30 cursor-pointer transition-colors"
                        onClick={() =>
                          setExpandedRow(isExpanded ? null : row.id)
                        }
                      >
                        <td className="p-3">
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          )}
                        </td>
                        <td className="p-3 font-medium">{row.supplier_name}</td>
                        <td className="p-3">{row.product}</td>
                        <td className="p-3">
                          <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                            {row.round}/{row.max_rounds}
                          </span>
                        </td>
                        <td className="p-3">
                          <NegotiationStatusBadge status={row.status} />
                        </td>
                        <td className="p-3">
                          <span
                            className={`flex items-center gap-1 text-sm ${
                              deadline.isUrgent
                                ? "text-red-600 font-semibold"
                                : "text-muted-foreground"
                            }`}
                          >
                            {deadline.isUrgent ? (
                              <AlertTriangle className="h-3.5 w-3.5" />
                            ) : (
                              <Clock className="h-3.5 w-3.5" />
                            )}
                            {deadline.text}
                          </span>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr key={`${row.id}-detail`} className="border-b bg-muted/10">
                          <td colSpan={6} className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">
                                  SL đề xuất
                                </p>
                                <p className="font-semibold text-lg">
                                  {row.proposed_qty} kg
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">
                                  SL NCC counter
                                </p>
                                <p className="font-semibold text-lg">
                                  {row.counter_qty !== null
                                    ? `${row.counter_qty} kg`
                                    : "Chưa phản hồi"}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">
                                  Chênh lệch
                                </p>
                                <p className="font-semibold text-lg">
                                  {row.counter_qty !== null
                                    ? `${row.proposed_qty - row.counter_qty} kg (${Math.round(((row.proposed_qty - row.counter_qty) / row.proposed_qty) * 100)}%)`
                                    : "—"}
                                </p>
                              </div>
                            </div>
                            {row.counter_reason && (
                              <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-md">
                                <p className="text-xs text-amber-700 font-medium mb-1 flex items-center gap-1">
                                  <MessageSquare className="h-3 w-3" />
                                  Lý do từ NCC
                                </p>
                                <p className="text-sm text-amber-900">
                                  {row.counter_reason}
                                </p>
                              </div>
                            )}
                            {/* Action buttons */}
                            {row.status !== "agreed" &&
                              row.status !== "rejected" && (
                                <div className="mt-4 flex items-center gap-2">
                                  <Button size="sm" variant="default">
                                    <Check className="mr-1 h-3.5 w-3.5" />
                                    Chấp nhận
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    <RotateCcw className="mr-1 h-3.5 w-3.5" />
                                    Sửa & gửi lại
                                  </Button>
                                  <Button size="sm" variant="destructive">
                                    <X className="mr-1 h-3.5 w-3.5" />
                                    Từ chối
                                  </Button>
                                </div>
                              )}
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
                {filteredData.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-8 text-center text-muted-foreground"
                    >
                      Không có dữ liệu thương lượng
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
