"use client";

import { useState, useMemo } from "react";
import { Clock, Send, Calendar, CheckCircle2, MessageSquare, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { NegotiationStatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import type { NegotiationStatus } from "@/types";

// --- Types ---
interface AllocationLine {
  id: string;
  product: string;
  allocatedQty: number;
  schedule: string;
  response: "agree" | "counter";
  counterQty: number;
  counterReason: string;
  counterNotes: string;
}

interface TimelineEvent {
  id: string;
  date: string;
  actor: string;
  action: string;
  detail: string;
  type: "admin" | "supplier" | "system";
}

// --- Mock data ---
const mockAllocation = {
  id: "a1",
  period: "2026-03",
  product: "Nấm rơm",
  totalQty: 500,
  status: "proposed" as NegotiationStatus,
  deadlineDate: "2026-03-15",
  daysLeft: 3,
  hoursLeft: 8,
};

const mockLines: AllocationLine[] = [
  {
    id: "al1",
    product: "Nấm rơm - L1",
    allocatedQty: 350,
    schedule: "T2, T4, T6",
    response: "agree",
    counterQty: 350,
    counterReason: "",
    counterNotes: "",
  },
  {
    id: "al2",
    product: "Nấm rơm - L2",
    allocatedQty: 150,
    schedule: "T3, T5",
    response: "counter",
    counterQty: 120,
    counterReason: "capacity",
    counterNotes: "Do thời tiết xấu, năng suất giảm trong tuần 2-3",
  },
];

const mockTimeline: TimelineEvent[] = [
  { id: "t1", date: "2026-03-10 09:00", actor: "Hệ thống", action: "Tạo phân bổ", detail: "Kế hoạch phân bổ T03/2026 được tạo tự động", type: "system" },
  { id: "t2", date: "2026-03-10 10:30", actor: "Phạm Thị Lan (Admin)", action: "Gửi cho NCC", detail: "Phân bổ 500 kg Nấm rơm cho Trang trại ABC", type: "admin" },
  { id: "t3", date: "2026-03-11 08:00", actor: "Bạn", action: "Đã xem", detail: "NCC đã mở và xem phân bổ", type: "supplier" },
];

const counterReasons = [
  { value: "capacity", label: "Năng lực không đủ" },
  { value: "weather", label: "Thời tiết ảnh hưởng" },
  { value: "quality", label: "Chất lượng không đạt" },
  { value: "price", label: "Giá chưa phù hợp" },
  { value: "schedule", label: "Lịch giao không phù hợp" },
  { value: "other", label: "Lý do khác" },
];

export default function SupplierAllocationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [lines, setLines] = useState<AllocationLine[]>(mockLines);

  const updateLine = (lineId: string, field: keyof AllocationLine, value: string) => {
    setLines((prev) =>
      prev.map((line) =>
        line.id === lineId ? { ...line, [field]: value } : line,
      ),
    );
  };

  const handleSubmit = () => {
    // Mock submit
    alert("Phản hồi đã được gửi thành công!");
  };

  const allAgreed = useMemo(() => lines.every((l) => l.response === "agree"), [lines]);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Chi tiết Phân bổ — ${mockAllocation.product}`}
        description={`Kỳ ${mockAllocation.period} | Mã: ${params.id}`}
        breadcrumbs={[
          { label: "Dashboard", href: "/supplier" },
          { label: "Phân bổ", href: "/supplier/allocations" },
          { label: "Chi tiết" },
        ]}
      />

      {/* Header info */}
      <div className="flex flex-wrap items-center gap-4">
        <Badge variant="secondary" className="bg-teal-50 text-teal-700 text-sm px-3 py-1">
          Kỳ: {mockAllocation.period}
        </Badge>
        <span className="font-medium">{mockAllocation.product}</span>
        <span className="text-muted-foreground">{mockAllocation.totalQty} kg/tháng</span>
        <NegotiationStatusBadge status={mockAllocation.status} />
      </div>

      {/* Deadline countdown */}
      <Card className="border-amber-200 bg-amber-50/50">
        <CardContent className="p-4 flex items-center gap-3">
          <Clock className="h-5 w-5 text-amber-600" />
          <div>
            <p className="font-medium text-amber-800">
              Hạn phản hồi: {mockAllocation.deadlineDate}
            </p>
            <p className="text-sm text-amber-700">
              Còn {mockAllocation.daysLeft} ngày {mockAllocation.hoursLeft} giờ
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Allocation Lines */}
      <div className="space-y-4">
        {lines.map((line) => (
          <Card key={line.id}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                {line.product}
                <Badge variant="secondary" className="bg-teal-50 text-teal-700 text-xs">
                  {line.allocatedQty} kg/tháng
                </Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                Lịch giao: {line.schedule}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Response radio */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Phản hồi</Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={`response-${line.id}`}
                      checked={line.response === "agree"}
                      onChange={() => updateLine(line.id, "response", "agree")}
                      className="accent-teal-600"
                    />
                    <span className="text-sm flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Đồng ý
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={`response-${line.id}`}
                      checked={line.response === "counter"}
                      onChange={() => updateLine(line.id, "response", "counter")}
                      className="accent-teal-600"
                    />
                    <span className="text-sm flex items-center gap-1">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                      Đề xuất điều chỉnh
                    </span>
                  </label>
                </div>
              </div>

              {/* Counter proposal fields */}
              {line.response === "counter" && (
                <div className="space-y-3 p-4 rounded-lg bg-amber-50/50 border border-amber-100">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor={`qty-${line.id}`} className="text-sm">
                        Số lượng đề xuất (kg)
                      </Label>
                      <Input
                        id={`qty-${line.id}`}
                        type="number"
                        value={line.counterQty}
                        onChange={(e) => updateLine(line.id, "counterQty", e.target.value)}
                        className="bg-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor={`reason-${line.id}`} className="text-sm">
                        Lý do
                      </Label>
                      <select
                        id={`reason-${line.id}`}
                        value={line.counterReason}
                        onChange={(e) => updateLine(line.id, "counterReason", e.target.value)}
                        className="flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm"
                      >
                        <option value="">Chọn lý do...</option>
                        {counterReasons.map((r) => (
                          <option key={r.value} value={r.value}>{r.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`notes-${line.id}`} className="text-sm">
                      Ghi chú thêm
                    </Label>
                    <Textarea
                      id={`notes-${line.id}`}
                      value={line.counterNotes}
                      onChange={(e) => updateLine(line.id, "counterNotes", e.target.value)}
                      placeholder="Mô tả chi tiết lý do điều chỉnh..."
                      className="bg-white"
                      rows={3}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <Button
          size="lg"
          onClick={handleSubmit}
          className="bg-teal-600 hover:bg-teal-700"
        >
          <Send className="h-4 w-4 mr-2" />
          {allAgreed ? "Xác nhận đồng ý" : "Gửi phản hồi"}
        </Button>
      </div>

      <Separator />

      {/* Negotiation Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-teal-600" />
            Lịch sử thương lượng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockTimeline.map((event, idx) => (
              <div key={event.id} className="flex gap-3">
                {/* Timeline dot & line */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-3 h-3 rounded-full mt-1 ${
                      event.type === "admin"
                        ? "bg-blue-500"
                        : event.type === "supplier"
                          ? "bg-teal-500"
                          : "bg-gray-400"
                    }`}
                  />
                  {idx < mockTimeline.length - 1 && (
                    <div className="w-px flex-1 bg-gray-200 mt-1" />
                  )}
                </div>
                {/* Content */}
                <div className="pb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{event.actor}</span>
                    <span className="text-xs text-muted-foreground">{event.date}</span>
                  </div>
                  <p className="text-sm font-medium text-teal-700">{event.action}</p>
                  <p className="text-sm text-muted-foreground">{event.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
