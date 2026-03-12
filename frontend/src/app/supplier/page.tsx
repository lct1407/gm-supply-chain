"use client";

import { useState } from "react";
import Link from "next/link";
import { Award, Star, TrendingUp, MessageSquare, Clock, Truck, ArrowRight } from "lucide-react";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// --- Mock data types ---
interface PendingAllocation {
  id: string;
  product: string;
  quantity: number;
  deadlineDate: string;
  daysLeft: number;
  hoursLeft: number;
}

interface UpcomingDelivery {
  date: string;
  product: string;
  quantity: number;
}

interface RecentMessage {
  sender: string;
  preview: string;
  time: string;
}

// --- Mock data ---
const pendingAllocations: PendingAllocation[] = [
  { id: "a1", product: "Nấm rơm", quantity: 500, deadlineDate: "2026-03-15", daysLeft: 3, hoursLeft: 8 },
  { id: "a2", product: "Nấm bào ngư", quantity: 300, deadlineDate: "2026-03-14", daysLeft: 2, hoursLeft: 4 },
  { id: "a3", product: "Nấm đùi gà", quantity: 200, deadlineDate: "2026-03-16", daysLeft: 4, hoursLeft: 12 },
];

const upcomingDeliveries: UpcomingDelivery[] = [
  { date: "2026-03-13", product: "Nấm rơm", quantity: 100 },
  { date: "2026-03-14", product: "Nấm bào ngư", quantity: 80 },
  { date: "2026-03-15", product: "Nấm đùi gà", quantity: 60 },
];

const recentMessages: RecentMessage[] = [
  { sender: "Phạm Thị Lan (Thu mua)", preview: "Xin xác nhận lại lịch giao hàng tuần tới...", time: "10 phút trước" },
  { sender: "Nguyễn Văn Admin", preview: "Kế hoạch phân bổ tháng 4 đã sẵn sàng để review", time: "2 giờ trước" },
];

export default function SupplierDashboardPage() {
  const [supplierName] = useState("Trang trại ABC");

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Xin chào, {supplierName}!
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Tổng quan hoạt động cung ứng của bạn
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Xếp hạng"
          value="A"
          change="Top 3 NCC"
          changeType="up"
          icon={Award}
          iconColor="text-teal-600"
        />
        <StatCard
          title="Điểm đánh giá"
          value="92/100"
          change="+2 so với tháng trước"
          changeType="up"
          icon={Star}
          iconColor="text-teal-600"
        />
        <StatCard
          title="Fill Rate"
          value="95.2%"
          change="+1.5% so với tháng trước"
          changeType="up"
          icon={TrendingUp}
          iconColor="text-teal-600"
        />
        <StatCard
          title="Tin nhắn mới"
          value={2}
          change="Chưa đọc"
          changeType="neutral"
          icon={MessageSquare}
          iconColor="text-teal-600"
        />
      </div>

      {/* Pending Allocations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5 text-teal-600" />
            Cần phản hồi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pendingAllocations.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-teal-50/50 border-teal-100"
              >
                <div className="space-y-1">
                  <p className="font-medium">{item.product}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.quantity} kg &middot; Hạn: {item.deadlineDate}
                  </p>
                  <Badge variant="outline" className="text-xs border-amber-300 text-amber-700 bg-amber-50">
                    Còn {item.daysLeft} ngày {item.hoursLeft} giờ
                  </Badge>
                </div>
                <Link href={`/supplier/allocations/${item.id}`}>
                  <Button variant="outline" size="sm" className="text-teal-600 border-teal-600 hover:bg-teal-50">
                    Xem &amp; Phản hồi
                    <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bottom 2-column */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Deliveries */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Truck className="h-5 w-5 text-teal-600" />
              Giao hàng sắp tới
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingDeliveries.map((delivery, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="text-sm font-medium">{delivery.product}</p>
                    <p className="text-xs text-muted-foreground">{delivery.date}</p>
                  </div>
                  <Badge variant="secondary" className="bg-teal-50 text-teal-700">
                    {delivery.quantity} kg
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Messages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageSquare className="h-5 w-5 text-teal-600" />
              Tin nhắn gần đây
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentMessages.map((msg, idx) => (
                <div key={idx} className="p-3 rounded-lg border">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium">{msg.sender}</p>
                    <span className="text-xs text-muted-foreground">{msg.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">{msg.preview}</p>
                </div>
              ))}
              <Link href="/supplier/messages">
                <Button variant="ghost" size="sm" className="w-full text-teal-600 hover:text-teal-700 hover:bg-teal-50">
                  Xem tất cả tin nhắn
                  <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
