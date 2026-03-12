"use client";

import { useMemo } from "react";
import { Award, TrendingUp, Target } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { RankBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// --- Types ---
interface ScoreCriteria {
  name: string;
  weight: number;
  score: number;
  notes: string;
}

interface TrendPoint {
  month: string;
  score: number;
}

// --- Mock data (matching supplier s1) ---
const currentRank = "A";
const totalScore = 92;
const topNote = "Top 3 NCC";

const criteria: ScoreCriteria[] = [
  { name: "OTD (Giao hàng đúng hẹn)", weight: 25, score: 95, notes: "Chỉ 1 lần trễ trong tháng" },
  { name: "Fill Rate (Tỷ lệ hoàn thành)", weight: 25, score: 96, notes: "Đạt mục tiêu > 95%" },
  { name: "Quality (Chất lượng)", weight: 25, score: 94, notes: "94% đạt L1, 6% L2" },
  { name: "Price (Giá cạnh tranh)", weight: 15, score: 85, notes: "Cao hơn TB 3%" },
  { name: "Flexibility (Linh hoạt)", weight: 10, score: 88, notes: "Nhận đơn gấp 2 lần" },
];

const trend: TrendPoint[] = [
  { month: "T10", score: 88 },
  { month: "T11", score: 90 },
  { month: "T12", score: 89 },
  { month: "T01", score: 91 },
  { month: "T02", score: 92 },
  { month: "T03", score: 92 },
];

function ProgressBar({ value, max = 100, color }: { value: number; max?: number; color: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function getScoreColor(score: number): string {
  if (score >= 90) return "bg-green-500";
  if (score >= 80) return "bg-teal-500";
  if (score >= 70) return "bg-amber-500";
  return "bg-red-500";
}

export default function SupplierScoresPage() {
  const maxScore = useMemo(() => Math.max(...criteria.map((c) => c.score)), []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Điểm đánh giá"
        description="Tổng hợp điểm hiệu suất và xếp hạng NCC"
        breadcrumbs={[
          { label: "Dashboard", href: "/supplier" },
          { label: "Điểm đánh giá" },
        ]}
      />

      {/* Top section: Rank + Score + Note */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-teal-200 bg-teal-50/30">
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <Award className="h-10 w-10 text-teal-600 mb-2" />
            <p className="text-sm text-muted-foreground mb-1">Xếp hạng</p>
            <div className="scale-150 my-2">
              <RankBadge rank={currentRank} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-teal-200 bg-teal-50/30">
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <Target className="h-10 w-10 text-teal-600 mb-2" />
            <p className="text-sm text-muted-foreground mb-1">Tổng điểm</p>
            <p className="text-4xl font-bold text-teal-700">{totalScore}</p>
            <p className="text-xs text-muted-foreground">/100</p>
          </CardContent>
        </Card>

        <Card className="border-teal-200 bg-teal-50/30">
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <TrendingUp className="h-10 w-10 text-teal-600 mb-2" />
            <p className="text-sm text-muted-foreground mb-1">Vị trí</p>
            <p className="text-lg font-semibold text-teal-700">{topNote}</p>
            <p className="text-xs text-muted-foreground">trong 6 NCC</p>
          </CardContent>
        </Card>
      </div>

      {/* Score bars (5 criteria) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Chi tiết theo tiêu chí</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {criteria.map((c) => (
            <div key={c.name} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{c.name}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs bg-gray-100">
                    x{c.weight}%
                  </Badge>
                  <span className="text-sm font-bold w-8 text-right">{c.score}</span>
                </div>
              </div>
              <ProgressBar value={c.score} color={getScoreColor(c.score)} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Trend section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-teal-600" />
            Xu hướng 6 tháng
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Simple visual timeline */}
          <div className="flex items-end justify-between gap-2 h-32">
            {trend.map((point) => {
              const barHeight = ((point.score - 80) / 20) * 100; // Scale 80-100 to 0-100%
              return (
                <div key={point.month} className="flex flex-col items-center flex-1 gap-1">
                  <span className="text-xs font-semibold">{point.score}</span>
                  <div className="w-full flex flex-col justify-end" style={{ height: "80px" }}>
                    <div
                      className={`w-full rounded-t ${getScoreColor(point.score)}`}
                      style={{ height: `${Math.max(barHeight, 10)}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{point.month}</span>
                </div>
              );
            })}
          </div>
          {/* Text timeline */}
          <Separator className="my-4" />
          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
            {trend.map((point, idx) => (
              <span key={point.month}>
                <span className="font-medium text-foreground">{point.month}</span>: {point.score}
                {idx < trend.length - 1 && <span className="mx-1">&rarr;</span>}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detail table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Bảng điểm chi tiết</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">Tiêu chí</th>
                  <th className="text-center py-2 px-3 font-medium text-muted-foreground">Trọng số</th>
                  <th className="text-center py-2 px-3 font-medium text-muted-foreground">Điểm</th>
                  <th className="text-center py-2 px-3 font-medium text-muted-foreground">Điểm quy đổi</th>
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                {criteria.map((c) => (
                  <tr key={c.name} className="border-b last:border-b-0">
                    <td className="py-2 px-3 font-medium">{c.name}</td>
                    <td className="py-2 px-3 text-center">{c.weight}%</td>
                    <td className="py-2 px-3 text-center font-semibold">{c.score}</td>
                    <td className="py-2 px-3 text-center text-teal-600 font-semibold">
                      {((c.score * c.weight) / 100).toFixed(1)}
                    </td>
                    <td className="py-2 px-3 text-muted-foreground">{c.notes}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2">
                  <td className="py-2 px-3 font-bold">Tổng</td>
                  <td className="py-2 px-3 text-center font-bold">100%</td>
                  <td className="py-2 px-3 text-center">-</td>
                  <td className="py-2 px-3 text-center font-bold text-teal-600">{totalScore}</td>
                  <td className="py-2 px-3"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
