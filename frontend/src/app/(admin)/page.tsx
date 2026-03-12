"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge, OrderStatusBadge, RankBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ShoppingCart,
  Users,
  TrendingUp,
  AlertTriangle,
  Clock,
  Package,
} from "lucide-react";
import { mockOrders, mockSuppliers } from "@/lib/mock-data";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// --- Mock data for dashboard ---
const supplyDemandData = [
  { day: "T2", supply: 320, demand: 280 },
  { day: "T3", supply: 290, demand: 310 },
  { day: "T4", supply: 350, demand: 340 },
  { day: "T5", supply: 310, demand: 360 },
  { day: "T6", supply: 380, demand: 350 },
  { day: "T7", supply: 400, demand: 370 },
  { day: "CN", supply: 250, demand: 290 },
];

const alerts = [
  { id: 1, color: "red", text: "Nấm rơm lot #LT-045 hết hạn trong 6 giờ - cần xuất gấp" },
  { id: 2, color: "red", text: "Nhiệt độ kho B vượt ngưỡng: 9.2°C (max 8°C)" },
  { id: 3, color: "yellow", text: "NCC Kim Sơn chưa phản hồi phân bổ T3/2026 (quá hạn 2 ngày)" },
  { id: 4, color: "yellow", text: "Fill rate tuần này giảm 1.5% so với tuần trước" },
  { id: 5, color: "green", text: "Đơn DH-0042 đã giao thành công cho Export FreshViet" },
];

const topSuppliers = mockSuppliers
  .filter((s) => s.score !== null)
  .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
  .slice(0, 5);

const recentOrders = mockOrders.slice(0, 5);

const alertColorMap: Record<string, string> = {
  red: "bg-red-500",
  yellow: "bg-amber-400",
  green: "bg-green-500",
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Tổng quan"
        description="Dashboard quản trị chuỗi cung ứng nấm tươi"
      />

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Đơn hàng"
          value={45}
          change="+12% so với tuần trước"
          changeType="up"
          icon={ShoppingCart}
          iconColor="text-blue-600"
        />
        <StatCard
          title="NCC active"
          value={12}
          icon={Users}
          iconColor="text-green-600"
        />
        <StatCard
          title="Fill Rate"
          value="92.3%"
          change="-1.5% so với tuần trước"
          changeType="down"
          icon={TrendingUp}
          iconColor="text-indigo-600"
        />
        <StatCard
          title="Hao hụt TB"
          value="5.2%"
          change="+0.3% so với tuần trước"
          changeType="down"
          icon={AlertTriangle}
          iconColor="text-amber-600"
        />
        <StatCard
          title="Sắp hết hạn"
          value="8 lot"
          icon={Clock}
          iconColor="text-red-600"
        />
      </div>

      {/* Middle 2-column: Chart + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Supply vs Demand Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Cung vs Cầu (7 ngày)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={supplyDemandData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis
                    dataKey="day"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v: number) => `${v}kg`}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="supply" name="Nguồn cung" fill="#16a34a" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="demand" name="Nhu cầu" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Cảnh báo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${alertColorMap[alert.color]}`} />
                  <p className="text-sm text-foreground">{alert.text}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom 2-column: Top NCC + Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Suppliers */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top NCC (Điểm)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topSuppliers.map((supplier, index) => (
                <div
                  key={supplier.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium">{supplier.name}</p>
                      <p className="text-xs text-muted-foreground">{supplier.code}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold">{supplier.score}</span>
                    <RankBadge rank={supplier.rank} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Đơn hàng gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div>
                    <p className="text-sm font-medium">{order.code}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.customer?.name ?? "N/A"}
                    </p>
                  </div>
                  <OrderStatusBadge status={order.status} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
