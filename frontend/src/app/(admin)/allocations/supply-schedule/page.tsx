"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  TrendingUp,
  Package,
  Users,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts";
import { cn } from "@/lib/utils";
import { mockProducts, mockSuppliers } from "@/lib/mock-data";

// --- Types ---
interface DailySchedule {
  date: string; // YYYY-MM-DD
  dayLabel: string; // T2, T3...
  dayNum: number;
  entries: SupplierDailyEntry[];
}

interface SupplierDailyEntry {
  supplierId: string;
  supplierName: string;
  productId: string;
  productName: string;
  plannedQty: number;
  confirmedQty: number | null;
  actualQty: number | null;
  status: "planned" | "confirmed" | "delivered" | "adjusted" | "cancelled";
}

interface ATPRow {
  date: string;
  dayLabel: string;
  product: string;
  committed: number;
  confirmed: number;
  allocated: number;
  atp: number; // committed - allocated
  demand: number;
  gap: number; // atp - demand (positive = surplus, negative = shortage)
}

// --- Mock Data Generator ---
const weekDays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
const activeProducts = mockProducts.filter((p) => p.is_active && p.category === "Nấm tươi");
const activeSuppliers = mockSuppliers.filter((s) => s.status === "active");

function generateWeekDates(weekOffset: number): { date: string; dayLabel: string; dayNum: number }[] {
  const today = new Date(2026, 2, 13); // 2026-03-13 (Friday)
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + 1 + weekOffset * 7); // Monday

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return {
      date: d.toISOString().split("T")[0],
      dayLabel: weekDays[d.getDay()],
      dayNum: d.getDate(),
    };
  });
}

function generateScheduleData(weekOffset: number): DailySchedule[] {
  const dates = generateWeekDates(weekOffset);
  return dates.map((d) => ({
    ...d,
    entries: activeSuppliers.flatMap((s) => {
      const products = s.id === "s1" ? ["p1", "p2", "p3"] : s.id === "s2" ? ["p2", "p4"] : ["p1", "p6"];
      return products.map((pid) => {
        const product = mockProducts.find((p) => p.id === pid);
        const base = pid === "p1" ? 40 : pid === "p2" ? 30 : pid === "p4" ? 50 : 20;
        const variation = Math.round((Math.random() - 0.5) * 10);
        const planned = d.dayLabel === "CN" ? Math.round(base * 0.5) : base + variation;
        const isPast = weekOffset < 0 || (weekOffset === 0 && d.dayNum <= 13);
        const isCurrent = weekOffset === 0 && d.dayNum === 13;
        const confirmed = isPast ? planned + Math.round((Math.random() - 0.5) * 5) : (isCurrent || d.dayNum === 14) ? planned - Math.round(Math.random() * 3) : null;
        const actual = isPast && !isCurrent ? (confirmed ?? planned) - Math.round(Math.random() * 4) : null;
        const status: SupplierDailyEntry["status"] = actual !== null ? "delivered" : confirmed !== null ? "confirmed" : "planned";
        return {
          supplierId: s.id,
          supplierName: s.name,
          productId: pid,
          productName: product?.name ?? pid,
          plannedQty: planned,
          confirmedQty: confirmed,
          actualQty: actual,
          status,
        };
      });
    }),
  }));
}

function generateATPData(weekOffset: number): ATPRow[] {
  const dates = generateWeekDates(weekOffset);
  const rows: ATPRow[] = [];
  for (const d of dates) {
    for (const product of activeProducts.slice(0, 4)) {
      const committed = product.id === "p1" ? 120 : product.id === "p2" ? 90 : product.id === "p3" ? 60 : 150;
      const variation = Math.round((Math.random() - 0.3) * 20);
      const confirmed = d.dayLabel === "CN" ? Math.round(committed * 0.4) : committed + variation;
      const demand = d.dayLabel === "CN" ? Math.round(committed * 0.6) : committed + Math.round((Math.random() - 0.4) * 30);
      const allocated = Math.min(Math.round(confirmed * 0.85), demand);
      const atp = confirmed - allocated;
      const gap = confirmed - demand;

      rows.push({
        date: d.date,
        dayLabel: d.dayLabel,
        product: product.name,
        committed: d.dayLabel === "CN" ? Math.round(committed * 0.5) : committed,
        confirmed,
        allocated,
        atp,
        demand,
        gap,
      });
    }
  }
  return rows;
}

// --- Status display helpers ---
const scheduleStatusConfig: Record<string, { label: string; variant: "success" | "info" | "muted" | "warning" | "danger" }> = {
  delivered: { label: "Đã giao", variant: "success" },
  confirmed: { label: "Đã confirm", variant: "info" },
  planned: { label: "Kế hoạch", variant: "muted" },
  adjusted: { label: "Điều chỉnh", variant: "warning" },
  cancelled: { label: "Hủy", variant: "danger" },
};

function gapColor(gap: number): string {
  if (gap > 10) return "text-green-600 bg-green-50";
  if (gap >= 0) return "text-amber-600 bg-amber-50";
  return "text-red-600 bg-red-50";
}

function gapBgColor(gap: number): string {
  if (gap > 10) return "bg-green-100/50";
  if (gap >= 0) return "bg-amber-50/50";
  return "bg-red-100/50";
}

// --- Page Component ---
export default function SupplySchedulePage() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [productFilter, setProductFilter] = useState<string>("all");

  const scheduleData = useMemo(() => generateScheduleData(weekOffset), [weekOffset]);
  const atpData = useMemo(() => generateATPData(weekOffset), [weekOffset]);

  const weekDates = useMemo(() => generateWeekDates(weekOffset), [weekOffset]);
  const weekLabel = weekDates.length > 0
    ? `${weekDates[0].dayNum}/${new Date(weekDates[0].date).getMonth() + 1} – ${weekDates[6].dayNum}/${new Date(weekDates[6].date).getMonth() + 1}`
    : "";

  // Filter ATP data by product
  const filteredATP = useMemo(
    () => productFilter === "all" ? atpData : atpData.filter((r) => r.product === productFilter),
    [atpData, productFilter]
  );

  // ATP stats
  const stats = useMemo(() => {
    const totalCommitted = atpData.reduce((s, r) => s + r.committed, 0);
    const totalConfirmed = atpData.reduce((s, r) => s + r.confirmed, 0);
    const totalDemand = atpData.reduce((s, r) => s + r.demand, 0);
    const totalGap = atpData.reduce((s, r) => s + r.gap, 0);
    const confirmRate = totalCommitted > 0 ? Math.round((totalConfirmed / totalCommitted) * 100) : 0;
    const shortageDays = new Set(atpData.filter((r) => r.gap < 0).map((r) => r.date)).size;
    return { totalCommitted, totalConfirmed, totalDemand, totalGap, confirmRate, shortageDays };
  }, [atpData]);

  // Chart data: aggregate per day
  const chartData = useMemo(() => {
    const grouped: Record<string, { day: string; supply: number; demand: number; confirmed: number }> = {};
    for (const r of filteredATP) {
      if (!grouped[r.date]) {
        grouped[r.date] = { day: r.dayLabel, supply: 0, demand: 0, confirmed: 0 };
      }
      grouped[r.date].supply += r.committed;
      grouped[r.date].demand += r.demand;
      grouped[r.date].confirmed += r.confirmed;
    }
    return weekDates.map((d) => grouped[d.date] ?? { day: d.dayLabel, supply: 0, demand: 0, confirmed: 0 });
  }, [filteredATP, weekDates]);

  // NCC confirmation summary
  const nccConfirmSummary = useMemo(() => {
    const map = new Map<string, { name: string; total: number; confirmed: number; delivered: number }>();
    for (const day of scheduleData) {
      for (const entry of day.entries) {
        const existing = map.get(entry.supplierId) ?? { name: entry.supplierName, total: 0, confirmed: 0, delivered: 0 };
        existing.total++;
        if (entry.status === "confirmed") existing.confirmed++;
        if (entry.status === "delivered") existing.delivered++;
        map.set(entry.supplierId, existing);
      }
    }
    return Array.from(map.entries()).map(([id, data]) => ({ id, ...data }));
  }, [scheduleData]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lịch Cung Ứng & ATP"
        description="Available-to-Promise Dashboard — Nguồn cung theo ngày, cam kết vs đã confirm vs nhu cầu"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Phân bổ", href: "/allocations" },
          { label: "Lịch cung ứng & ATP" },
        ]}
      />

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard title="Cam kết (tuần)" value={`${(stats.totalCommitted / 1000).toFixed(1)}T`} icon={Package} iconColor="text-blue-600" />
        <StatCard title="Đã Confirm" value={`${stats.confirmRate}%`} icon={CheckCircle2} iconColor="text-green-600" change={stats.confirmRate >= 80 ? "Tốt" : "Cần theo dõi"} changeType={stats.confirmRate >= 80 ? "up" : "down"} />
        <StatCard title="Nhu cầu (tuần)" value={`${(stats.totalDemand / 1000).toFixed(1)}T`} icon={TrendingUp} iconColor="text-indigo-600" />
        <StatCard title="Gap tổng" value={`${stats.totalGap > 0 ? "+" : ""}${stats.totalGap}kg`} icon={ArrowUpDown} iconColor={stats.totalGap >= 0 ? "text-green-600" : "text-red-600"} />
        <StatCard title="Ngày thiếu hụt" value={stats.shortageDays} icon={AlertTriangle} iconColor="text-red-600" />
        <StatCard title="NCC Active" value={activeSuppliers.length} icon={Users} iconColor="text-teal-600" />
      </div>

      {/* Week Navigation + Product Filter */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setWeekOffset((w) => w - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-semibold min-w-[120px] text-center">
            {weekOffset === 0 ? "Tuần này" : weekOffset === 1 ? "Tuần sau" : weekOffset === -1 ? "Tuần trước" : `Tuần ${weekOffset > 0 ? "+" : ""}${weekOffset}`}
            {" "}({weekLabel})
          </span>
          <Button variant="outline" size="sm" onClick={() => setWeekOffset((w) => w + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          {weekOffset !== 0 && (
            <Button variant="ghost" size="sm" onClick={() => setWeekOffset(0)} className="text-xs">
              Hôm nay
            </Button>
          )}
        </div>
        <Select value={productFilter} onValueChange={setProductFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sản phẩm" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả sản phẩm</SelectItem>
            {activeProducts.slice(0, 4).map((p) => (
              <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="atp" className="space-y-4">
        <TabsList>
          <TabsTrigger value="atp">ATP Matrix</TabsTrigger>
          <TabsTrigger value="chart">Biểu đồ Cung-Cầu</TabsTrigger>
          <TabsTrigger value="ncc">Xác nhận NCC</TabsTrigger>
        </TabsList>

        {/* ATP Matrix Tab */}
        <TabsContent value="atp">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <CalendarCheck className="h-4 w-4" />
                ATP Matrix — Ngày × Sản phẩm
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Committed = cam kết | Confirmed = NCC đã xác nhận | Demand = nhu cầu | Gap = Confirmed − Demand
              </p>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <TooltipProvider>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-semibold sticky left-0 bg-card z-10 min-w-[120px]">Sản phẩm</th>
                      <th className="text-left p-2 font-semibold min-w-[60px]">Metric</th>
                      {weekDates.map((d) => (
                        <th
                          key={d.date}
                          className={cn(
                            "text-center p-2 font-semibold min-w-[80px]",
                            d.date === "2026-03-13" && "bg-primary/5 border-x border-primary/20"
                          )}
                        >
                          <div className="text-xs text-muted-foreground">{d.dayLabel}</div>
                          <div>{d.dayNum}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(productFilter === "all" ? activeProducts.slice(0, 4) : activeProducts.filter((p) => p.name === productFilter)).map((product) => {
                      const productRows = atpData.filter((r) => r.product === product.name);
                      return (
                        <React.Fragment key={product.id}>
                          {/* Committed row */}
                          <tr className="border-b border-dashed">
                            <td className="p-2 font-medium sticky left-0 bg-card z-10" rowSpan={4}>
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-primary"></div>
                                {product.name}
                              </div>
                              <div className="text-xs text-muted-foreground">SL {product.shelf_life_days}d</div>
                            </td>
                            <td className="p-2 text-xs text-muted-foreground">Cam kết</td>
                            {weekDates.map((d) => {
                              const row = productRows.find((r) => r.date === d.date);
                              return (
                                <td key={d.date} className={cn("text-center p-2", d.date === "2026-03-13" && "bg-primary/5 border-x border-primary/20")}>
                                  <span className="text-muted-foreground">{row?.committed ?? "—"}</span>
                                </td>
                              );
                            })}
                          </tr>
                          {/* Confirmed row */}
                          <tr className="border-b border-dashed">
                            <td className="p-2 text-xs text-blue-600 font-medium">Confirm</td>
                            {weekDates.map((d) => {
                              const row = productRows.find((r) => r.date === d.date);
                              return (
                                <td key={d.date} className={cn("text-center p-2", d.date === "2026-03-13" && "bg-primary/5 border-x border-primary/20")}>
                                  {row?.confirmed != null ? (
                                    <span className="font-medium text-blue-600">{row.confirmed}</span>
                                  ) : (
                                    <span className="text-muted-foreground">—</span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                          {/* Demand row */}
                          <tr className="border-b border-dashed">
                            <td className="p-2 text-xs text-indigo-600 font-medium">Nhu cầu</td>
                            {weekDates.map((d) => {
                              const row = productRows.find((r) => r.date === d.date);
                              return (
                                <td key={d.date} className={cn("text-center p-2", d.date === "2026-03-13" && "bg-primary/5 border-x border-primary/20")}>
                                  <span className="text-indigo-600">{row?.demand ?? "—"}</span>
                                </td>
                              );
                            })}
                          </tr>
                          {/* Gap row */}
                          <tr className="border-b">
                            <td className="p-2 text-xs font-medium">Gap</td>
                            {weekDates.map((d) => {
                              const row = productRows.find((r) => r.date === d.date);
                              const gap = row?.gap ?? 0;
                              return (
                                <td key={d.date} className={cn("text-center p-1", d.date === "2026-03-13" && "bg-primary/5 border-x border-primary/20")}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <span className={cn("inline-block px-2 py-1 rounded-md text-xs font-bold", gapColor(gap))}>
                                        {gap > 0 ? `+${gap}` : gap}
                                      </span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      {gap > 0 ? `Dư ${gap}kg` : gap < 0 ? `Thiếu ${Math.abs(gap)}kg` : "Vừa đủ"}
                                    </TooltipContent>
                                  </Tooltip>
                                </td>
                              );
                            })}
                          </tr>
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </TooltipProvider>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Supply-Demand Chart Tab */}
        <TabsContent value="chart">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Cung vs Cầu (7 ngày){productFilter !== "all" ? ` — ${productFilter}` : ""}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} barCategoryGap="20%">
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="day" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v: number) => `${v}kg`} />
                    <RechartsTooltip
                      contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                      formatter={(value: number, name: string) => [`${value} kg`, name]}
                    />
                    <Legend />
                    <Bar dataKey="supply" name="Cam kết" fill="#93c5fd" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="confirmed" name="Đã Confirm" fill="#16a34a" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="demand" name="Nhu cầu" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div className="p-3 rounded-xl bg-blue-50">
                  <p className="text-xs text-blue-600 font-medium">Tổng cam kết</p>
                  <p className="text-xl font-bold text-blue-700">{chartData.reduce((s, d) => s + d.supply, 0)} kg</p>
                </div>
                <div className="p-3 rounded-xl bg-green-50">
                  <p className="text-xs text-green-600 font-medium">Đã confirm</p>
                  <p className="text-xl font-bold text-green-700">{chartData.reduce((s, d) => s + d.confirmed, 0)} kg</p>
                </div>
                <div className="p-3 rounded-xl bg-indigo-50">
                  <p className="text-xs text-indigo-600 font-medium">Nhu cầu</p>
                  <p className="text-xl font-bold text-indigo-700">{chartData.reduce((s, d) => s + d.demand, 0)} kg</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* NCC Confirmation Tab */}
        <TabsContent value="ncc">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4" />
                Trạng thái xác nhận NCC
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {nccConfirmSummary.map((ncc) => {
                  const confirmPct = ncc.total > 0 ? Math.round(((ncc.confirmed + ncc.delivered) / ncc.total) * 100) : 0;
                  return (
                    <div key={ncc.id} className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
                      <div className="flex-1">
                        <p className="font-medium">{ncc.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {ncc.delivered} đã giao · {ncc.confirmed} đã confirm · {ncc.total - ncc.confirmed - ncc.delivered} chưa confirm
                        </p>
                      </div>
                      <div className="w-32">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Xác nhận</span>
                          <span className={cn("font-bold", confirmPct >= 80 ? "text-green-600" : confirmPct >= 50 ? "text-amber-600" : "text-red-600")}>
                            {confirmPct}%
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all",
                              confirmPct >= 80 ? "bg-green-500" : confirmPct >= 50 ? "bg-amber-500" : "bg-red-500"
                            )}
                            style={{ width: `${confirmPct}%` }}
                          />
                        </div>
                      </div>
                      <Badge variant={confirmPct >= 80 ? "default" : "secondary"} className={cn(confirmPct < 50 && "bg-red-100 text-red-700 hover:bg-red-100")}>
                        {confirmPct >= 80 ? "Tốt" : confirmPct >= 50 ? "Chờ" : "Cần nhắc"}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Need React import for Fragment
import React from "react";
