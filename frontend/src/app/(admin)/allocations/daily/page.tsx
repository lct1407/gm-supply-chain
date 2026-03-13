"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Package,
  ChevronLeft,
  ChevronRight,
  Truck,
  ArrowRight,
  Zap,
  RefreshCw,
  ShoppingCart,
  XCircle,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { mockProducts, mockSuppliers, mockCustomers } from "@/lib/mock-data";
import Link from "next/link";

// --- Types ---
interface DailyOrder {
  id: string;
  orderCode: string;
  customerName: string;
  customerType: string;
  productName: string;
  productId: string;
  requiredQty: number;
  allocatedQty: number;
  allocatedFrom: { supplierName: string; qty: number; lotCode: string | null }[];
  status: "unmatched" | "partial" | "matched" | "fulfilled";
  deliveryDate: string;
  rslRequired: number;
  priority: number;
}

interface DailySupply {
  supplierId: string;
  supplierName: string;
  supplierRank: string;
  productName: string;
  confirmedQty: number;
  allocatedQty: number;
  availableQty: number;
  status: "available" | "partial" | "fully_allocated";
}

// --- Mock Data ---
const today = "2026-03-13";
const products = mockProducts.filter((p) => p.is_active && p.category === "Nấm tươi");

const dailyOrders: DailyOrder[] = [
  {
    id: "do1", orderCode: "DH-0045", customerName: "Siêu thị CoopMart", customerType: "sieu_thi",
    productName: "Nấm rơm", productId: "p1", requiredQty: 80, allocatedQty: 80,
    allocatedFrom: [
      { supplierName: "Trang trại ABC", qty: 50, lotCode: "LT-051" },
      { supplierName: "Farm Đà Lạt Green", qty: 30, lotCode: null },
    ],
    status: "matched", deliveryDate: today, rslRequired: 0.7, priority: 1,
  },
  {
    id: "do2", orderCode: "DH-0044", customerName: "Nhà hàng Sen Vàng", customerType: "nha_hang",
    productName: "Nấm bào ngư", productId: "p2", requiredQty: 45, allocatedQty: 45,
    allocatedFrom: [{ supplierName: "HTX Nấm Củ Chi", qty: 45, lotCode: "LT-048" }],
    status: "matched", deliveryDate: today, rslRequired: 0.5, priority: 2,
  },
  {
    id: "do3", orderCode: "DH-0046", customerName: "Export FreshViet", customerType: "xuat_khau",
    productName: "Nấm bào ngư", productId: "p2", requiredQty: 60, allocatedQty: 35,
    allocatedFrom: [{ supplierName: "Trang trại ABC", qty: 35, lotCode: null }],
    status: "partial", deliveryDate: today, rslRequired: 0.8, priority: 1,
  },
  {
    id: "do4", orderCode: "DH-0047", customerName: "Đại lý Thanh Hà", customerType: "dai_ly",
    productName: "Nấm rơm", productId: "p1", requiredQty: 40, allocatedQty: 0,
    allocatedFrom: [],
    status: "unmatched", deliveryDate: today, rslRequired: 0.5, priority: 3,
  },
  {
    id: "do5", orderCode: "DH-0048", customerName: "Siêu thị CoopMart", customerType: "sieu_thi",
    productName: "Nấm đùi gà", productId: "p3", requiredQty: 30, allocatedQty: 30,
    allocatedFrom: [{ supplierName: "Trang trại ABC", qty: 30, lotCode: "LT-050" }],
    status: "fulfilled", deliveryDate: today, rslRequired: 0.7, priority: 1,
  },
  {
    id: "do6", orderCode: "DH-0049", customerName: "Bán lẻ chợ Bà Chiểu", customerType: "le",
    productName: "Nấm kim châm", productId: "p4", requiredQty: 20, allocatedQty: 0,
    allocatedFrom: [],
    status: "unmatched", deliveryDate: today, rslRequired: 0.3, priority: 4,
  },
];

const dailySupply: DailySupply[] = [
  { supplierId: "s1", supplierName: "Trang trại ABC", supplierRank: "A", productName: "Nấm rơm", confirmedQty: 50, allocatedQty: 50, availableQty: 0, status: "fully_allocated" },
  { supplierId: "s1", supplierName: "Trang trại ABC", supplierRank: "A", productName: "Nấm bào ngư", confirmedQty: 40, allocatedQty: 35, availableQty: 5, status: "partial" },
  { supplierId: "s1", supplierName: "Trang trại ABC", supplierRank: "A", productName: "Nấm đùi gà", confirmedQty: 35, allocatedQty: 30, availableQty: 5, status: "partial" },
  { supplierId: "s2", supplierName: "HTX Nấm Củ Chi", supplierRank: "A", productName: "Nấm bào ngư", confirmedQty: 55, allocatedQty: 45, availableQty: 10, status: "partial" },
  { supplierId: "s2", supplierName: "HTX Nấm Củ Chi", supplierRank: "A", productName: "Nấm kim châm", confirmedQty: 60, allocatedQty: 0, availableQty: 60, status: "available" },
  { supplierId: "s3", supplierName: "Farm Đà Lạt Green", supplierRank: "B", productName: "Nấm rơm", confirmedQty: 30, allocatedQty: 30, availableQty: 0, status: "fully_allocated" },
  { supplierId: "s3", supplierName: "Farm Đà Lạt Green", supplierRank: "B", productName: "Nấm mèo", confirmedQty: 20, allocatedQty: 0, availableQty: 20, status: "available" },
  { supplierId: "s4", supplierName: "NCC Phú Yên", supplierRank: "B", productName: "Nấm rơm", confirmedQty: 25, allocatedQty: 0, availableQty: 25, status: "available" },
];

const orderStatusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  fulfilled: { label: "Đã giao", color: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle2 },
  matched: { label: "Đã match", color: "bg-blue-100 text-blue-700 border-blue-200", icon: Zap },
  partial: { label: "Thiếu", color: "bg-amber-100 text-amber-700 border-amber-200", icon: AlertTriangle },
  unmatched: { label: "Chưa match", color: "bg-red-100 text-red-700 border-red-200", icon: XCircle },
};

const supplyStatusConfig: Record<string, { label: string; color: string }> = {
  available: { label: "Còn trống", color: "bg-green-100 text-green-700" },
  partial: { label: "Đã dùng 1 phần", color: "bg-blue-100 text-blue-700" },
  fully_allocated: { label: "Hết", color: "bg-gray-100 text-gray-500" },
};

export default function DailyAllocationPage() {
  const [dayOffset, setDayOffset] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [productFilter, setProductFilter] = useState<string>("all");

  const currentDate = useMemo(() => {
    const d = new Date(2026, 2, 13);
    d.setDate(d.getDate() + dayOffset);
    return d;
  }, [dayOffset]);

  const dateLabel = currentDate.toLocaleDateString("vi-VN", { weekday: "long", day: "numeric", month: "numeric", year: "numeric" });

  const filteredOrders = useMemo(() => {
    return dailyOrders.filter((o) => {
      const matchStatus = statusFilter === "all" || o.status === statusFilter;
      const matchProduct = productFilter === "all" || o.productId === productFilter;
      return matchStatus && matchProduct;
    });
  }, [statusFilter, productFilter]);

  // Stats
  const stats = useMemo(() => {
    const total = dailyOrders.length;
    const matched = dailyOrders.filter((o) => o.status === "matched" || o.status === "fulfilled").length;
    const partial = dailyOrders.filter((o) => o.status === "partial").length;
    const unmatched = dailyOrders.filter((o) => o.status === "unmatched").length;
    const totalRequired = dailyOrders.reduce((s, o) => s + o.requiredQty, 0);
    const totalAllocated = dailyOrders.reduce((s, o) => s + o.allocatedQty, 0);
    const fillRate = totalRequired > 0 ? Math.round((totalAllocated / totalRequired) * 100) : 0;
    const totalAvailable = dailySupply.reduce((s, r) => s + r.availableQty, 0);
    return { total, matched, partial, unmatched, totalRequired, totalAllocated, fillRate, totalAvailable };
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Phân bổ Ngày"
        description="Daily Allocation Board — Match đơn hàng → NCC → lots hàng ngày"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Phân bổ", href: "/allocations" },
          { label: "Phân bổ ngày" },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-1" />
              Auto-match
            </Button>
            <Link href="/allocations/supply-schedule">
              <Button variant="outline" size="sm">
                <CalendarCheck className="h-4 w-4 mr-1" />
                Xem ATP
              </Button>
            </Link>
          </div>
        }
      />

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
        <StatCard title="Đơn hôm nay" value={stats.total} icon={ShoppingCart} iconColor="text-blue-600" />
        <StatCard title="Đã match" value={stats.matched} icon={CheckCircle2} iconColor="text-green-600" />
        <StatCard title="Thiếu hàng" value={stats.partial} icon={AlertTriangle} iconColor="text-amber-600" />
        <StatCard title="Chưa match" value={stats.unmatched} icon={XCircle} iconColor="text-red-600" />
        <StatCard
          title="Fill Rate"
          value={`${stats.fillRate}%`}
          icon={Truck}
          iconColor={stats.fillRate >= 90 ? "text-green-600" : "text-amber-600"}
          change={`${stats.totalAllocated}/${stats.totalRequired} kg`}
          changeType={stats.fillRate >= 90 ? "up" : "down"}
        />
      </div>

      {/* Date Navigation + Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setDayOffset((d) => d - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-semibold min-w-[200px] text-center capitalize">{dateLabel}</span>
          <Button variant="outline" size="sm" onClick={() => setDayOffset((d) => d + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          {dayOffset !== 0 && (
            <Button variant="ghost" size="sm" onClick={() => setDayOffset(0)} className="text-xs">
              Hôm nay
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="unmatched">Chưa match</SelectItem>
              <SelectItem value="partial">Thiếu</SelectItem>
              <SelectItem value="matched">Đã match</SelectItem>
              <SelectItem value="fulfilled">Đã giao</SelectItem>
            </SelectContent>
          </Select>
          <Select value={productFilter} onValueChange={setProductFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sản phẩm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả SP</SelectItem>
              {products.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Content: Orders + Supply side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders (left 2/3) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Đơn hàng cần fulfill ({filteredOrders.length})
            </h3>
            <div className="flex gap-1">
              {Object.entries(orderStatusConfig).map(([key, cfg]) => {
                const count = dailyOrders.filter((o) => o.status === key).length;
                if (count === 0) return null;
                return (
                  <Badge key={key} variant="outline" className={cn("text-xs", cfg.color)}>
                    {cfg.label}: {count}
                  </Badge>
                );
              })}
            </div>
          </div>

          {filteredOrders.map((order) => {
            const cfg = orderStatusConfig[order.status];
            const StatusIcon = cfg.icon;
            const shortageQty = order.requiredQty - order.allocatedQty;
            return (
              <Card key={order.id} className={cn("transition-all hover:shadow-md", order.status === "unmatched" && "border-red-200", order.status === "partial" && "border-amber-200")}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", cfg.color)}>
                        <StatusIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <Link href={`/orders/${order.id}`} className="font-semibold text-primary hover:underline">
                            {order.orderCode}
                          </Link>
                          <Badge variant="outline" className="text-xs">P{order.priority}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{order.customerName} · {order.customerType === "sieu_thi" ? "Siêu thị" : order.customerType === "nha_hang" ? "Nhà hàng" : order.customerType === "xuat_khau" ? "Xuất khẩu" : order.customerType === "dai_ly" ? "Đại lý" : "Bán lẻ"}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <Package className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm font-medium">{order.productName}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">RSL ≥{(order.rslRequired * 100).toFixed(0)}%</p>
                    </div>
                  </div>

                  {/* Allocation progress */}
                  <div className="mb-2">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Phân bổ: {order.allocatedQty}/{order.requiredQty} kg</span>
                      {shortageQty > 0 && (
                        <span className="text-red-600 font-medium">Thiếu {shortageQty} kg</span>
                      )}
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          order.allocatedQty >= order.requiredQty ? "bg-green-500" : order.allocatedQty > 0 ? "bg-amber-500" : "bg-red-300"
                        )}
                        style={{ width: `${Math.min(100, (order.allocatedQty / order.requiredQty) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Allocated sources */}
                  {order.allocatedFrom.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {order.allocatedFrom.map((src, i) => (
                        <div key={i} className="flex items-center gap-1.5 bg-muted/50 rounded-lg px-2 py-1 text-xs">
                          <Truck className="h-3 w-3 text-muted-foreground" />
                          <span className="font-medium">{src.supplierName}</span>
                          <ArrowRight className="h-3 w-3 text-muted-foreground" />
                          <span>{src.qty}kg</span>
                          {src.lotCode && <Badge variant="secondary" className="text-[10px] px-1">{src.lotCode}</Badge>}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Actions for unmatched/partial */}
                  {(order.status === "unmatched" || order.status === "partial") && (
                    <div className="flex gap-2 mt-3 pt-3 border-t">
                      <Button size="sm" variant="default" className="text-xs h-7">
                        <Zap className="h-3 w-3 mr-1" />
                        Auto-match
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs h-7">
                        <Search className="h-3 w-3 mr-1" />
                        Tìm NCC
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Supply Available (right 1/3) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Nguồn cung hôm nay
            </h3>
            <Badge variant="secondary">{stats.totalAvailable} kg trống</Badge>
          </div>

          {/* Group by product */}
          {products.map((product) => {
            const supplies = dailySupply.filter((s) => s.productName === product.name);
            if (supplies.length === 0) return null;
            const totalAvailable = supplies.reduce((s, r) => s + r.availableQty, 0);
            const totalConfirmed = supplies.reduce((s, r) => s + r.confirmedQty, 0);

            return (
              <Card key={product.id}>
                <CardHeader className="pb-2 pt-3 px-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      {product.name}
                    </CardTitle>
                    <div className="text-xs text-muted-foreground">
                      <span className="font-medium text-green-600">{totalAvailable}</span>/{totalConfirmed} kg
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-3 space-y-2">
                  {supplies.map((supply, i) => {
                    const statusCfg = supplyStatusConfig[supply.status];
                    const pct = supply.confirmedQty > 0 ? Math.round((supply.allocatedQty / supply.confirmedQty) * 100) : 0;
                    return (
                      <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-medium truncate">{supply.supplierName}</span>
                            <Badge variant="outline" className="text-[10px] px-1">{supply.supplierRank}</Badge>
                          </div>
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden mt-1">
                            <div
                              className={cn("h-full rounded-full", supply.availableQty > 0 ? "bg-green-400" : "bg-gray-300")}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className={cn("text-sm font-bold", supply.availableQty > 0 ? "text-green-600" : "text-muted-foreground")}>
                            {supply.availableQty > 0 ? `${supply.availableQty}kg` : "—"}
                          </p>
                          <p className="text-[10px] text-muted-foreground">{supply.allocatedQty}/{supply.confirmedQty}</p>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            );
          })}

          {/* Quick Actions */}
          <Card className="bg-amber-50/50 border-amber-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-amber-800">Thiếu hụt phát hiện</p>
                  <p className="text-xs text-amber-600 mt-1">
                    Nấm bào ngư: thiếu 25kg cho DH-0046 (Export FreshViet, P1).
                    NCC Phú Yên có 25kg Nấm rơm available.
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" variant="outline" className="text-xs h-7 border-amber-300 text-amber-700 hover:bg-amber-100">
                      Xem gợi ý NCC
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs h-7 border-amber-300 text-amber-700 hover:bg-amber-100">
                      Kiểm tồn kho
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
