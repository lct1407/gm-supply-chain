"use client";

import { useState, useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  User,
  FileText,
  CheckCircle2,
  Package,
  Truck,
  ClipboardList,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { PageHeader } from "@/components/shared/page-header";
import { DataTable, SortableHeader } from "@/components/shared/data-table";
import { OrderStatusBadge, StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { mockOrders } from "@/lib/mock-data";
import type { Order, OrderStatus } from "@/types";

// Inline mock order items for detail page
const mockOrderItems = [
  {
    id: "oi1",
    product: "Nấm rơm",
    quality_grade: "Loại 1",
    quantity: 50,
    unit: "kg",
    unit_price: 85000,
    total: 4250000,
  },
  {
    id: "oi2",
    product: "Nấm bào ngư",
    quality_grade: "Loại 1",
    quantity: 30,
    unit: "kg",
    unit_price: 65000,
    total: 1950000,
  },
  {
    id: "oi3",
    product: "Nấm đùi gà",
    quality_grade: "Loại 2",
    quantity: 20,
    unit: "kg",
    unit_price: 90000,
    total: 1800000,
  },
  {
    id: "oi4",
    product: "Nấm kim châm",
    quality_grade: "Loại 1",
    quantity: 15,
    unit: "thùng (5kg)",
    unit_price: 280000,
    total: 4200000,
  },
];

interface OrderItemRow {
  id: string;
  product: string;
  quality_grade: string;
  quantity: number;
  unit: string;
  unit_price: number;
  total: number;
}

const itemColumns: ColumnDef<OrderItemRow, unknown>[] = [
  {
    accessorKey: "product",
    header: "Sản phẩm",
    cell: ({ row }) => <span className="font-medium">{row.original.product}</span>,
  },
  {
    accessorKey: "quality_grade",
    header: "Chất lượng",
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => <SortableHeader column={column} label="Số lượng" />,
  },
  {
    accessorKey: "unit",
    header: "Đơn vị",
  },
  {
    accessorKey: "unit_price",
    header: "Đơn giá",
    cell: ({ row }) =>
      new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
        row.original.unit_price,
      ),
  },
  {
    accessorKey: "total",
    header: "Thành tiền",
    cell: ({ row }) => (
      <span className="font-semibold">
        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
          row.original.total,
        )}
      </span>
    ),
  },
];

const statusFlow: { key: OrderStatus; label: string; icon: React.ElementType }[] = [
  { key: "new", label: "Mới", icon: Clock },
  { key: "allocated", label: "Đã phân bổ", icon: ClipboardList },
  { key: "preparing", label: "Đang chuẩn bị", icon: Package },
  { key: "delivering", label: "Đang giao", icon: Truck },
  { key: "completed", label: "Hoàn thành", icon: CheckCircle2 },
];

function getStatusIndex(status: OrderStatus): number {
  if (status === "cancelled") return -1;
  return statusFlow.findIndex((s) => s.key === status);
}

const sourceLabels: Record<string, string> = {
  manual: "Nhập tay",
  excel: "Import Excel",
  kiotviet: "KiotViet",
};

function getActionButtons(status: OrderStatus): { label: string; variant: "default" | "outline" }[] {
  switch (status) {
    case "new":
      return [{ label: "Phân bổ", variant: "default" }];
    case "allocated":
      return [{ label: "Bắt đầu chuẩn bị", variant: "default" }];
    case "preparing":
      return [{ label: "Xuất giao", variant: "default" }];
    case "delivering":
      return [{ label: "Hoàn thành", variant: "default" }];
    default:
      return [];
  }
}

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const order = mockOrders.find((o) => o.id === params.id) ?? mockOrders[0];
  const currentIndex = getStatusIndex(order.status);
  const actions = getActionButtons(order.status);

  const grandTotal = mockOrderItems.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title={order.code}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Đơn hàng", href: "/orders" },
          { label: order.code },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/orders">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại
              </Button>
            </Link>
            {actions.map((a) => (
              <Button key={a.label} variant={a.variant} size="sm">
                {a.label}
              </Button>
            ))}
          </div>
        }
      />

      {/* Header summary */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-bold">{order.customer?.name ?? "—"}</h2>
                <OrderStatusBadge status={order.status} />
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Giao:{" "}
                  {new Date(order.delivery_date).toLocaleDateString("vi-VN")}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {order.delivery_address}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Tổng giá trị</p>
              <p className="text-2xl font-bold text-primary">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(grandTotal)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Thông tin đơn hàng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Khách hàng</span>
              <span className="font-medium">{order.customer?.name}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Địa chỉ giao</span>
              <span className="font-medium text-right max-w-[200px]">
                {order.delivery_address}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ưu tiên</span>
              <span className="font-medium">P{order.priority}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nguồn</span>
              <span className="font-medium">{sourceLabels[order.source] ?? order.source}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ngày tạo</span>
              <span className="font-medium">
                {new Date(order.created_at).toLocaleDateString("vi-VN")}
              </span>
            </div>
            {order.notes && (
              <>
                <Separator />
                <div>
                  <span className="text-muted-foreground">Ghi chú</span>
                  <p className="mt-1 font-medium">{order.notes}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Tiến trình đơn hàng</CardTitle>
          </CardHeader>
          <CardContent>
            {order.status === "cancelled" ? (
              <div className="flex items-center justify-center py-8">
                <StatusBadge label="Đơn hàng đã bị hủy" variant="danger" className="text-base px-4 py-2" />
              </div>
            ) : (
              <div className="flex items-center justify-between">
                {statusFlow.map((step, i) => {
                  const Icon = step.icon;
                  const isActive = i === currentIndex;
                  const isDone = i < currentIndex;
                  return (
                    <div key={step.key} className="flex flex-col items-center flex-1 relative">
                      {/* Connector line */}
                      {i > 0 && (
                        <div
                          className={`absolute top-5 right-1/2 w-full h-0.5 -z-10 ${
                            isDone ? "bg-green-500" : "bg-muted"
                          }`}
                        />
                      )}
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                          isActive
                            ? "border-primary bg-primary text-primary-foreground"
                            : isDone
                              ? "border-green-500 bg-green-50 text-green-600"
                              : "border-muted bg-muted/30 text-muted-foreground"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <span
                        className={`text-xs mt-2 text-center ${
                          isActive
                            ? "font-semibold text-primary"
                            : isDone
                              ? "font-medium text-green-600"
                              : "text-muted-foreground"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Order items table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Package className="h-4 w-4" />
            Sản phẩm trong đơn ({mockOrderItems.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={itemColumns} data={mockOrderItems} pageSize={20} />
        </CardContent>
      </Card>
    </div>
  );
}
