"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import {
  TrendingUp,
  Users,
  AlertTriangle,
  Package,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

interface ReportCard {
  title: string;
  description: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  href: string;
}

const reportCards: ReportCard[] = [
  {
    title: "Cung - Cầu",
    description: "Phân tích chênh lệch giữa nguồn cung từ NCC và nhu cầu đơn hàng theo sản phẩm và thời gian.",
    icon: TrendingUp,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50",
    href: "/reports/supply-demand",
  },
  {
    title: "Hiệu suất NCC",
    description: "Đánh giá NCC theo các tiêu chí: OTD, Fill Rate, Chất lượng, Giá, Linh hoạt và tổng điểm xếp hạng.",
    icon: Users,
    iconColor: "text-green-600",
    iconBg: "bg-green-50",
    href: "/reports/supplier-perf",
  },
  {
    title: "Hao hụt",
    description: "Theo dõi tỷ lệ hao hụt thực tế so với tiêu chuẩn cho từng loại nấm, phát hiện bất thường.",
    icon: AlertTriangle,
    iconColor: "text-amber-600",
    iconBg: "bg-amber-50",
    href: "/reports/shrinkage",
  },
  {
    title: "Tồn kho",
    description: "Tổng hợp tồn kho theo sản phẩm, vùng lưu trữ, trạng thái lot và cảnh báo hết hạn.",
    icon: Package,
    iconColor: "text-purple-600",
    iconBg: "bg-purple-50",
    href: "/reports/inventory",
  },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Trung tâm Báo cáo"
        description="Tổng hợp các báo cáo phân tích vận hành chuỗi cung ứng"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Báo cáo" },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.href} href={card.href}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${card.iconBg} shrink-0`}>
                      <Icon className={`h-6 w-6 ${card.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold mb-1">{card.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {card.description}
                      </p>
                      <span className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-primary group-hover:underline">
                        Xem báo cáo
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
