"use client";

import { useMemo } from "react";
import { Thermometer, CheckCircle, XCircle, Star, ImageIcon, Package, Truck, ClipboardCheck } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// --- Mock data ---
interface DeliveryDetail {
  id: string;
  date: string;
  product: string;
  supplier: string;
  orderedQty: number;
  receivedQty: number;
  shrinkagePct: number;
  qcResult: "pass" | "fail" | "conditional";
  gradeOriginal: string;
  gradeActual: string;
  temperature: string;
  onTime: boolean;
  qcNotes: string;
  rating: number;
}

const mockDetail: DeliveryDetail = {
  id: "d1",
  date: "2026-03-11",
  product: "Nấm rơm",
  supplier: "Trang trại ABC",
  orderedQty: 100,
  receivedQty: 98,
  shrinkagePct: 2.0,
  qcResult: "pass",
  gradeOriginal: "L1",
  gradeActual: "L1",
  temperature: "3.5°C avg",
  onTime: true,
  qcNotes: "Chất lượng tốt, kích thước đồng đều, không có tạp chất",
  rating: 4,
};

function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          className={`h-5 w-5 ${
            i < rating ? "fill-amber-400 text-amber-400" : "text-gray-300"
          }`}
        />
      ))}
      <span className="ml-2 text-sm text-muted-foreground">{rating}/{max}</span>
    </div>
  );
}

function QcResultBadge({ result }: { result: "pass" | "fail" | "conditional" }) {
  const map = {
    pass: { label: "Đạt", variant: "success" as const },
    fail: { label: "Không đạt", variant: "danger" as const },
    conditional: { label: "Đạt có điều kiện", variant: "warning" as const },
  };
  const config = map[result];
  return <StatusBadge label={config.label} variant={config.variant} />;
}

export default function SupplierDeliveryDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const detail = useMemo(() => ({ ...mockDetail, id: params.id }), [params.id]);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Chi tiết Giao hàng — ${detail.date}`}
        description={`${detail.product} | ${detail.supplier}`}
        breadcrumbs={[
          { label: "Dashboard", href: "/supplier" },
          { label: "Giao hàng", href: "/supplier/deliveries" },
          { label: "Chi tiết" },
        ]}
      />

      {/* Info cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Ordered vs Received */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Package className="h-4 w-4 text-teal-600" />
              <span className="text-sm font-medium text-muted-foreground">Số lượng</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{detail.receivedQty}</span>
              <span className="text-sm text-muted-foreground">/ {detail.orderedQty} kg</span>
            </div>
          </CardContent>
        </Card>

        {/* Shrinkage */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Truck className="h-4 w-4 text-teal-600" />
              <span className="text-sm font-medium text-muted-foreground">Hao hụt</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-bold ${detail.shrinkagePct > 5 ? "text-red-600" : "text-green-600"}`}>
                {detail.shrinkagePct}%
              </span>
              <span className="text-sm text-muted-foreground">
                ({detail.orderedQty - detail.receivedQty} kg)
              </span>
            </div>
          </CardContent>
        </Card>

        {/* QC Result */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <ClipboardCheck className="h-4 w-4 text-teal-600" />
              <span className="text-sm font-medium text-muted-foreground">Kết quả QC</span>
            </div>
            <QcResultBadge result={detail.qcResult} />
          </CardContent>
        </Card>

        {/* Temperature */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Thermometer className="h-4 w-4 text-teal-600" />
              <span className="text-sm font-medium text-muted-foreground">Nhiệt độ</span>
            </div>
            <span className="text-lg font-semibold">{detail.temperature}</span>
          </CardContent>
        </Card>

        {/* On time */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              {detail.onTime ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <span className="text-sm font-medium text-muted-foreground">Đúng giờ</span>
            </div>
            <Badge variant="secondary" className={detail.onTime ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
              {detail.onTime ? "Đúng giờ" : "Trễ"}
            </Badge>
          </CardContent>
        </Card>

        {/* Rating */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-4 w-4 text-teal-600" />
              <span className="text-sm font-medium text-muted-foreground">Đánh giá</span>
            </div>
            <StarRating rating={detail.rating} />
          </CardContent>
        </Card>
      </div>

      {/* QC Detail Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4 text-teal-600" />
            Chi tiết kiểm tra chất lượng
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Kết quả tổng</p>
              <QcResultBadge result={detail.qcResult} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Loại gốc</p>
              <Badge variant="secondary" className="bg-teal-50 text-teal-700 mt-1">
                {detail.gradeOriginal}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Loại thực tế</p>
              <Badge variant="secondary" className="bg-teal-50 text-teal-700 mt-1">
                {detail.gradeActual}
              </Badge>
            </div>
          </div>
          <Separator />
          <div>
            <p className="text-sm text-muted-foreground mb-1">Ghi chú QC</p>
            <p className="text-sm">{detail.qcNotes}</p>
          </div>
        </CardContent>
      </Card>

      {/* Photos placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-teal-600" />
            Hình ảnh
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 border-2 border-dashed rounded-lg text-muted-foreground">
            <div className="text-center">
              <ImageIcon className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">Chưa có hình ảnh</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
