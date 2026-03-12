"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Copy, Save, AlertTriangle, CalendarDays } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// --- Types ---
interface ScheduleProduct {
  id: string;
  name: string;
  commitmentMonthly: number;
}

interface WeekSchedule {
  [productId: string]: {
    [day: string]: number;
  };
}

// --- Mock data ---
const products: ScheduleProduct[] = [
  { id: "p1", name: "Nấm rơm", commitmentMonthly: 500 },
  { id: "p2", name: "Nấm bào ngư", commitmentMonthly: 300 },
  { id: "p3", name: "Nấm đùi gà", commitmentMonthly: 200 },
];

const dayLabels = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

const initialSchedule: WeekSchedule = {
  p1: { T2: 20, T3: 18, T4: 22, T5: 20, T6: 25, T7: 15, CN: 0 },
  p2: { T2: 12, T3: 10, T4: 14, T5: 12, T6: 12, T7: 8, CN: 0 },
  p3: { T2: 8, T3: 7, T4: 8, T5: 8, T6: 10, T7: 5, CN: 0 },
};

const lastUpdated = "2026-03-05";
const daysSinceUpdate = 7;

type ProductFilter = "all" | string;

export default function SupplierSchedulePage() {
  const [month, setMonth] = useState("2026-03");
  const [schedule, setSchedule] = useState<WeekSchedule>(initialSchedule);
  const [productFilter, setProductFilter] = useState<ProductFilter>("all");

  const displayedProducts = useMemo(() => {
    if (productFilter === "all") return products;
    return products.filter((p) => p.id === productFilter);
  }, [productFilter]);

  const updateCell = (productId: string, day: string, value: string) => {
    const numValue = parseInt(value, 10);
    setSchedule((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [day]: isNaN(numValue) ? 0 : numValue,
      },
    }));
  };

  const getWeekTotal = (productId: string): number => {
    const days = schedule[productId];
    if (!days) return 0;
    return Object.values(days).reduce((sum, v) => sum + v, 0);
  };

  const getMonthEstimate = (weekTotal: number): number => {
    return Math.round(weekTotal * 4.3);
  };

  const getAchievementPct = (productId: string): number => {
    const product = products.find((p) => p.id === productId);
    if (!product) return 0;
    const monthEst = getMonthEstimate(getWeekTotal(productId));
    return Math.round((monthEst / product.commitmentMonthly) * 100);
  };

  const handleCopyLastWeek = () => {
    // In real app, copy from previous week data
    alert("Đã copy dữ liệu từ tuần trước");
  };

  const handleSave = () => {
    alert("Lịch thu hoạch đã được lưu!");
  };

  const prevMonth = () => {
    const [y, m] = month.split("-").map(Number);
    const newM = m === 1 ? 12 : m - 1;
    const newY = m === 1 ? y - 1 : y;
    setMonth(`${newY}-${String(newM).padStart(2, "0")}`);
  };

  const nextMonth = () => {
    const [y, m] = month.split("-").map(Number);
    const newM = m === 12 ? 1 : m + 1;
    const newY = m === 12 ? y + 1 : y;
    setMonth(`${newY}-${String(newM).padStart(2, "0")}`);
  };

  const formatMonth = (m: string): string => {
    const [year, mo] = m.split("-");
    return `${mo}/${year}`;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lịch thu hoạch"
        description="Cập nhật kế hoạch sản lượng hàng tuần"
        breadcrumbs={[
          { label: "Dashboard", href: "/supplier" },
          { label: "Lịch thu hoạch" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleCopyLastWeek}>
              <Copy className="h-4 w-4 mr-1" />
              Copy tuần trước
            </Button>
            <Button size="sm" onClick={handleSave} className="bg-teal-600 hover:bg-teal-700">
              <Save className="h-4 w-4 mr-1" />
              Lưu
            </Button>
          </div>
        }
      />

      {/* Warning if not updated */}
      {daysSinceUpdate >= 7 && (
        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <p className="text-sm text-amber-800">
              Lịch thu hoạch chưa được cập nhật {daysSinceUpdate} ngày (lần cuối: {lastUpdated}).
              Vui lòng cập nhật để đảm bảo phân bổ chính xác.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Month selector & product filter */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-lg font-semibold w-24 text-center">{formatMonth(month)}</span>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          <select
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
          >
            <option value="all">Tất cả sản phẩm</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Weekly calendar grid */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Kế hoạch tuần (kg)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground w-36">
                    Sản phẩm
                  </th>
                  {dayLabels.map((d) => (
                    <th key={d} className="text-center py-2 px-2 font-medium text-muted-foreground w-20">
                      {d}
                    </th>
                  ))}
                  <th className="text-center py-2 px-3 font-medium text-teal-600 w-24">
                    Tổng tuần
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayedProducts.map((product) => (
                  <tr key={product.id} className="border-b last:border-b-0">
                    <td className="py-2 px-3 font-medium">{product.name}</td>
                    {dayLabels.map((day) => (
                      <td key={day} className="py-2 px-2">
                        <Input
                          type="number"
                          min={0}
                          value={schedule[product.id]?.[day] ?? 0}
                          onChange={(e) => updateCell(product.id, day, e.target.value)}
                          className="w-16 h-8 text-center text-sm mx-auto"
                        />
                      </td>
                    ))}
                    <td className="py-2 px-3 text-center font-semibold text-teal-600">
                      {getWeekTotal(product.id)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Bottom summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {displayedProducts.map((product) => {
          const weekTotal = getWeekTotal(product.id);
          const monthEst = getMonthEstimate(weekTotal);
          const pct = getAchievementPct(product.id);
          return (
            <Card key={product.id}>
              <CardContent className="p-4">
                <p className="text-sm font-medium text-muted-foreground">{product.name}</p>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Tổng tuần</span>
                    <span className="font-medium">{weekTotal} kg</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Cam kết tháng</span>
                    <span className="font-medium">{product.commitmentMonthly} kg</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Ước tính tháng</span>
                    <span className="font-medium">{monthEst} kg</span>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-2">
                    <span>% đạt</span>
                    <Badge
                      variant="secondary"
                      className={
                        pct >= 95
                          ? "bg-green-100 text-green-800"
                          : pct >= 80
                            ? "bg-amber-100 text-amber-800"
                            : "bg-red-100 text-red-800"
                      }
                    >
                      {pct}%
                    </Badge>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-2 bg-gray-100 rounded-full mt-2">
                    <div
                      className={`h-2 rounded-full ${
                        pct >= 95 ? "bg-green-500" : pct >= 80 ? "bg-amber-500" : "bg-red-500"
                      }`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
