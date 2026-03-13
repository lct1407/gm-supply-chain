"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Shield, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Chào mừng đến Nấm Xanh
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Phiên bản Demo — Chọn cổng truy cập để trải nghiệm
        </p>
      </div>

      <div className="space-y-3">
        <Button
          onClick={() => router.push("/dashboard")}
          className="w-full h-auto py-4 bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <div className="flex items-center gap-4 w-full">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/20">
              <Shield className="h-5 w-5" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-bold">Admin Portal</p>
              <p className="text-xs font-normal opacity-80">
                Quản trị phân bổ, đơn hàng, NCC, báo cáo
              </p>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0" />
          </div>
        </Button>

        <Button
          onClick={() => router.push("/supplier")}
          variant="outline"
          className="w-full h-auto py-4 border-teal-200 hover:bg-teal-50 text-teal-700"
        >
          <div className="flex items-center gap-4 w-full">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-100">
              <Truck className="h-5 w-5" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-bold">Supplier Portal</p>
              <p className="text-xs font-normal opacity-80">
                Cổng NCC — lịch giao, phân bổ, điểm đánh giá
              </p>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0" />
          </div>
        </Button>
      </div>

      <div className="rounded-lg bg-slate-50 border border-slate-200 p-4">
        <p className="text-xs text-slate-500 text-center">
          Đây là phiên bản demo, không yêu cầu đăng nhập.
          <br />
          Dữ liệu hiển thị là dữ liệu mẫu.
        </p>
      </div>
    </div>
  );
}
