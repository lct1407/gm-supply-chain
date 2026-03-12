"use client";

import { Pencil, CalendarDays, BarChart3, TrendingDown, Bell } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ConfigItem {
  key: string;
  label: string;
  value: string;
}

interface ConfigCategory {
  title: string;
  icon: React.ElementType;
  description: string;
  items: ConfigItem[];
}

const configCategories: ConfigCategory[] = [
  {
    title: "Mùa vụ & Hệ số",
    icon: CalendarDays,
    description: "Cấu hình mùa vụ và hệ số điều chỉnh sản lượng theo mùa",
    items: [
      { key: "season_peak", label: "Mùa cao điểm", value: "Tháng 10 - Tháng 2" },
      { key: "season_low", label: "Mùa thấp điểm", value: "Tháng 5 - Tháng 8" },
      { key: "factor_peak", label: "Hệ số mùa cao điểm", value: "1.3" },
      { key: "factor_low", label: "Hệ số mùa thấp điểm", value: "0.7" },
      { key: "factor_normal", label: "Hệ số mùa bình thường", value: "1.0" },
    ],
  },
  {
    title: "Phân bổ",
    icon: BarChart3,
    description: "Thiết lập các tham số cho quy trình phân bổ nguồn cung",
    items: [
      { key: "max_allocation_pct", label: "Phân bổ tối đa (%)", value: "85%" },
      { key: "negotiation_rounds", label: "Số vòng thương lượng tối đa", value: "3" },
      { key: "deadline_hours", label: "Thời hạn phản hồi (giờ)", value: "24" },
      { key: "buffer_pct", label: "Buffer hao hụt (%)", value: "10%" },
      { key: "min_supplier_share", label: "Tỷ lệ NCC tối thiểu (%)", value: "5%" },
    ],
  },
  {
    title: "Hao hụt",
    icon: TrendingDown,
    description: "Tỷ lệ hao hụt mặc định theo từng giai đoạn",
    items: [
      { key: "shrinkage_transport", label: "Hao hụt vận chuyển", value: "2%" },
      { key: "shrinkage_storage", label: "Hao hụt lưu kho", value: "1.5%" },
      { key: "shrinkage_delivery", label: "Hao hụt giao hàng", value: "1%" },
      { key: "shrinkage_total_max", label: "Hao hụt tổng tối đa", value: "8%" },
    ],
  },
  {
    title: "Thông báo",
    icon: Bell,
    description: "Cấu hình gửi email và thông báo hệ thống",
    items: [
      { key: "email_sender", label: "Email gửi", value: "noreply@namxanh.vn" },
      { key: "email_admin", label: "Email admin nhận báo cáo", value: "admin@namxanh.vn" },
      { key: "notify_allocation", label: "Thông báo phân bổ mới", value: "Bật" },
      { key: "notify_delivery", label: "Thông báo giao hàng", value: "Bật" },
      { key: "notify_qc_fail", label: "Thông báo QC không đạt", value: "Bật" },
    ],
  },
];

export default function ConfigPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Cấu hình Hệ thống"
        description="Quản lý các tham số cấu hình chung cho hệ thống"
        breadcrumbs={[
          { label: "Home", href: "/app" },
          { label: "Quản trị", href: "/admin/users" },
          { label: "Cấu hình" },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {configCategories.map((category) => {
          const Icon = category.icon;
          return (
            <Card key={category.title}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{category.title}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">
                      {category.description}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Pencil className="mr-1.5 h-3.5 w-3.5" />
                  Sửa
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {category.items.map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
                    >
                      <span className="text-sm text-muted-foreground">
                        {item.label}
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
