"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, Phone, Mail, Calendar, Ruler, FileText } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { DataTable, SortableHeader } from "@/components/shared/data-table";
import { SupplierStatusBadge, RankBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  mockSuppliers,
  mockSupplierProducts,
  mockSupplierScores,
  mockDeliveries,
  mockProducts,
} from "@/lib/mock-data";
import type { SupplierProduct, SupplierScore, Delivery } from "@/types";
import { type ColumnDef } from "@tanstack/react-table";

function ScoreDisplay({ score }: { score: number | null }) {
  if (score === null) return <span className="text-muted-foreground text-sm">--</span>;
  let color = "text-red-600";
  if (score >= 85) color = "text-green-600";
  else if (score >= 70) color = "text-blue-600";
  else if (score >= 55) color = "text-amber-600";
  return <span className={`text-3xl font-bold ${color}`}>{score}</span>;
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  let bgColor = "bg-red-500";
  if (score >= 85) bgColor = "bg-green-500";
  else if (score >= 70) bgColor = "bg-blue-500";
  else if (score >= 55) bgColor = "bg-amber-500";

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm w-28 shrink-0">{label}</span>
      <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${bgColor}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-sm font-semibold w-10 text-right">{score}</span>
    </div>
  );
}

const productColumns: ColumnDef<SupplierProduct>[] = [
  {
    accessorFn: (row) => row.product?.name ?? "--",
    id: "product_name",
    header: "Sản phẩm",
    cell: ({ getValue }) => <span className="font-medium">{getValue<string>()}</span>,
  },
  {
    accessorFn: (row) => row.quality_grade?.name ?? "--",
    id: "quality",
    header: "Chất lượng",
  },
  {
    accessorKey: "max_capacity_monthly",
    header: ({ column }) => <SortableHeader column={column} label="Sản lượng (kg/tháng)" />,
    cell: ({ row }) => (
      <span>{row.getValue<number>("max_capacity_monthly").toLocaleString("vi-VN")}</span>
    ),
  },
  {
    accessorKey: "price",
    header: ({ column }) => <SortableHeader column={column} label="Giá (VNĐ/kg)" />,
    cell: ({ row }) => (
      <span>{row.getValue<number>("price").toLocaleString("vi-VN")}đ</span>
    ),
  },
  {
    accessorKey: "lead_time_days",
    header: "Lead time",
    cell: ({ row }) => <span>{row.getValue<number>("lead_time_days")} ngày</span>,
  },
  {
    accessorKey: "shrinkage_rate",
    header: "Hao hụt",
    cell: ({ row }) => (
      <span>{(row.getValue<number>("shrinkage_rate") * 100).toFixed(1)}%</span>
    ),
  },
];

const deliveryColumns: ColumnDef<Delivery>[] = [
  {
    accessorKey: "delivery_date",
    header: ({ column }) => <SortableHeader column={column} label="Ngày giao" />,
  },
  {
    accessorKey: "ordered_qty",
    header: "SL đặt (kg)",
    cell: ({ row }) => <span>{row.getValue<number>("ordered_qty")}</span>,
  },
  {
    accessorKey: "received_qty",
    header: "SL nhận (kg)",
    cell: ({ row }) => {
      const received = row.getValue<number | null>("received_qty");
      return <span>{received !== null ? received : "--"}</span>;
    },
  },
  {
    accessorKey: "on_time",
    header: "Đúng giờ",
    cell: ({ row }) => {
      const onTime = row.getValue<boolean | null>("on_time");
      if (onTime === null) return <span className="text-muted-foreground">--</span>;
      return onTime ? (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          Đúng giờ
        </Badge>
      ) : (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          Trễ
        </Badge>
      );
    },
  },
  {
    accessorKey: "quality_grade_actual",
    header: "Kết quả QC",
    cell: ({ row }) => (
      <span>{row.getValue<string | null>("quality_grade_actual") ?? "--"}</span>
    ),
  },
];

export default function SupplierDetailPage({ params }: { params: { id: string } }) {
  const supplier = mockSuppliers.find((s) => s.id === params.id);

  const supplierProducts = useMemo(
    () => mockSupplierProducts.filter((sp) => sp.supplier_id === params.id),
    [params.id]
  );

  const supplierScore = useMemo(
    () => mockSupplierScores.find((ss) => ss.supplier_id === params.id),
    [params.id]
  );

  const supplierDeliveries = useMemo(
    () => mockDeliveries.filter((d) => d.supplier_id === params.id),
    [params.id]
  );

  if (!supplier) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Không tìm thấy NCC"
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Nhà cung cấp", href: "/suppliers" },
            { label: "Không tìm thấy" },
          ]}
        />
        <p className="text-muted-foreground">Nhà cung cấp không tồn tại hoặc đã bị xóa.</p>
        <Button asChild variant="outline">
          <Link href="/suppliers">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại danh sách
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={supplier.name}
        description={supplier.code}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Nhà cung cấp", href: "/suppliers" },
          { label: supplier.name },
        ]}
        actions={
          <Button asChild variant="outline">
            <Link href="/suppliers">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Link>
          </Button>
        }
      />

      {/* Top summary */}
      <div className="flex flex-wrap items-center gap-3">
        <SupplierStatusBadge status={supplier.status} />
        <RankBadge rank={supplier.rank} />
        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Điểm tổng:</span>
          <ScoreDisplay score={supplier.score} />
        </div>
      </div>

      {/* Info cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Thông tin liên hệ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground w-24 shrink-0">Người liên hệ</span>
              <span className="font-medium">{supplier.contact_name}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{supplier.contact_phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{supplier.contact_email}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Thông tin trang trại</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{supplier.farm_location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Ruler className="h-4 w-4 text-muted-foreground" />
              <span>{supplier.farm_area ? `${supplier.farm_area} ha` : "--"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span>MST: {supplier.tax_code}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Hợp tác từ: {supplier.started_at}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="products">
        <TabsList>
          <TabsTrigger value="products">Sản phẩm</TabsTrigger>
          <TabsTrigger value="scores">Điểm số</TabsTrigger>
          <TabsTrigger value="deliveries">Giao hàng</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="mt-4">
          {supplierProducts.length > 0 ? (
            <DataTable columns={productColumns} data={supplierProducts} pageSize={10} />
          ) : (
            <p className="text-sm text-muted-foreground py-8 text-center">
              Chưa có sản phẩm nào được đăng ký.
            </p>
          )}
        </TabsContent>

        <TabsContent value="scores" className="mt-4">
          {supplierScore ? (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">
                  Bảng điểm kỳ {supplierScore.period}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ScoreBar label="OTD (Giao đúng hẹn)" score={supplierScore.otd_score} />
                <ScoreBar label="Fill Rate" score={supplierScore.fill_rate_score} />
                <ScoreBar label="Chất lượng" score={supplierScore.quality_score} />
                <ScoreBar label="Giá cả" score={supplierScore.price_score} />
                <ScoreBar label="Linh hoạt" score={supplierScore.flexibility_score} />
                <div className="border-t pt-4 flex items-center justify-between">
                  <span className="font-semibold">Tổng điểm</span>
                  <div className="flex items-center gap-2">
                    <ScoreDisplay score={supplierScore.total_score} />
                    <RankBadge rank={supplierScore.rank} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <p className="text-sm text-muted-foreground py-8 text-center">
              Chưa có dữ liệu điểm số.
            </p>
          )}
        </TabsContent>

        <TabsContent value="deliveries" className="mt-4">
          {supplierDeliveries.length > 0 ? (
            <DataTable columns={deliveryColumns} data={supplierDeliveries} pageSize={10} />
          ) : (
            <p className="text-sm text-muted-foreground py-8 text-center">
              Chưa có lịch sử giao hàng.
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
