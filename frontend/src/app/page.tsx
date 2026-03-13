"use client";

import Link from "next/link";
import {
  ArrowRight,
  Leaf,
  BarChart3,
  Users,
  Package,
  CalendarCheck,
  ShieldCheck,
  Truck,
  Bell,
  LineChart,
  ClipboardCheck,
  Layers,
  Zap,
  Globe,
  Lock,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const features = [
  {
    icon: Users,
    title: "Quản lý Nhà Cung Cấp",
    desc: "Onboard, đánh giá & xếp hạng NCC theo 5 tiêu chí. Supplier Portal để NCC tự đăng ký, xem phân bổ, thương lượng online.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: Package,
    title: "Phân bổ Thông minh",
    desc: "Engine phân bổ tự động theo cam kết, điểm NCC, capacity & diversification. Thương lượng tối đa 3 vòng với NCC.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: CalendarCheck,
    title: "Lịch Cung Ứng Ngày",
    desc: "NCC xác nhận lịch giao hàng hàng ngày. ATP Dashboard real-time: cam kết, đã confirm, còn available.",
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    icon: BarChart3,
    title: "Cung — Cầu Gap Analysis",
    desc: "So sánh nguồn cung (committed + confirmed) vs nhu cầu (orders + forecast) theo ngày, phát hiện thiếu/dư sớm.",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    icon: Layers,
    title: "Tồn kho FEFO",
    desc: "Quản lý tồn kho theo lô, xuất hàng hết hạn trước (FEFO). Cảnh báo RSL theo nhóm khách hàng.",
    color: "text-red-600",
    bg: "bg-red-50",
  },
  {
    icon: ClipboardCheck,
    title: "QC & Hao hụt",
    desc: "Checklist QC đầu vào, phân loại lại chất lượng. Tracking hao hụt từng chặng, buffer tự động.",
    color: "text-teal-600",
    bg: "bg-teal-50",
  },
  {
    icon: Zap,
    title: "Tích hợp KiotViet",
    desc: "Đồng bộ đơn hàng, hóa đơn, PO, khách hàng & bảng giá real-time từ KiotViet. Hỗ trợ Shopee orders.",
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  {
    icon: LineChart,
    title: "Báo cáo & Dự báo",
    desc: "Dashboard tổng quan, báo cáo hiệu suất NCC, phân tích xu hướng. Forecast nhu cầu theo mùa vụ.",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
];

const stats = [
  { value: "193+", label: "Nhà Cung Cấp", icon: Users },
  { value: "589", label: "Sản Phẩm", icon: Package },
  { value: "27K+", label: "Khách Hàng", icon: TrendingUp },
  { value: "217K+", label: "Giao Dịch", icon: BarChart3 },
];

const portalFeatures = {
  admin: [
    "Quản lý NCC & duyệt đăng ký",
    "Phân bổ tháng/ngày với engine tự động",
    "Dashboard cung-cầu real-time",
    "Thương lượng chỉ tiêu online",
    "Tồn kho FEFO & QC đầu vào",
    "Tích hợp KiotViet (orders, invoices, PO)",
    "Báo cáo hiệu suất & dự báo",
    "RBAC phân quyền chi tiết",
  ],
  supplier: [
    "Tự đăng ký & cập nhật hồ sơ",
    "Xem phân bổ & thương lượng online",
    "Nhập lịch thu hoạch & confirm giao hàng",
    "Xem điểm đánh giá & xếp hạng",
    "Nhắn tin trực tiếp với Admin",
    "Hỗ trợ song ngữ Việt/Anh",
  ],
};

export default function LandingPage() {
  const [activePortal, setActivePortal] = useState<"admin" | "supplier">("admin");

  return (
    <div className="min-h-screen bg-earth-50 text-namxanh-950 font-sans selection:bg-namxanh-200">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-namxanh-100/50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-namxanh-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-namxanh-600/20">
              <Leaf className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-namxanh-900">
              GM Supply<span className="text-namxanh-500">.</span>
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-namxanh-800">
            <Link href="#features" className="hover:text-namxanh-600 transition-colors">Tính năng</Link>
            <Link href="#portals" className="hover:text-namxanh-600 transition-colors">Dual Portal</Link>
            <Link href="#integration" className="hover:text-namxanh-600 transition-colors">Tích hợp</Link>
            <Link href="#contact" className="hover:text-namxanh-600 transition-colors">Liên hệ</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-semibold text-namxanh-700 hover:text-namxanh-500 transition-colors"
            >
              Đăng nhập
            </Link>
            <Link
              href="/app"
              className="group flex items-center gap-2 px-5 py-2.5 bg-namxanh-600 hover:bg-namxanh-700 text-white text-sm font-semibold rounded-full transition-all shadow-md shadow-namxanh-600/20"
            >
              Vào Dashboard
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-namxanh-200/40 rounded-full blur-3xl -z-10 opacity-50"></div>

        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex-1 text-center lg:text-left z-10"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm text-namxanh-700 font-bold text-sm mb-6 border border-namxanh-200/50 shadow-sm">
                <Zap className="w-4 h-4" />
                <span>Mushroom Supply Chain Management</span>
              </div>
              <h1 className="text-5xl lg:text-[4.5rem] font-extrabold tracking-tight mb-8 leading-[1.1] text-earth-900">
                Quản lý Chuỗi Cung Ứng{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-namxanh-600 to-emerald-400">
                  Nấm Tươi.
                </span>
              </h1>
              <p className="text-lg text-earth-600 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Hệ thống phân bổ nguồn cung thông minh cho nông sản tươi sống. Kết nối NCC — Phân bổ tự động — Tracking hao hụt — Tồn kho FEFO — Tích hợp KiotViet. Thiết kế riêng cho đặc thù shelf life ngắn 2-14 ngày.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  href="/app"
                  className="w-full sm:w-auto px-8 py-4 bg-namxanh-600 hover:bg-namxanh-700 text-white rounded-full font-bold transition-all shadow-xl shadow-namxanh-600/30 flex items-center justify-center gap-2 group"
                >
                  Dùng thử Admin Portal
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/supplier/register"
                  className="w-full sm:w-auto px-8 py-4 bg-white/80 hover:bg-white text-earth-900 border border-namxanh-200 rounded-full font-bold transition-all shadow-lg shadow-earth-200/20 flex items-center justify-center gap-2"
                >
                  <Globe className="w-5 h-5 text-teal-600" />
                  Đăng ký NCC
                </Link>
              </div>

              <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-earth-200/60 pt-8">
                {stats.map((stat, i) => (
                  <div key={i} className="flex flex-col items-center lg:items-start">
                    <div className="flex items-center gap-2 mb-1">
                      <stat.icon className="w-4 h-4 text-namxanh-500" />
                      <span className="text-3xl font-extrabold text-namxanh-600 tracking-tight">{stat.value}</span>
                    </div>
                    <span className="text-xs font-semibold text-earth-500 uppercase tracking-wider">{stat.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* App Preview Mock */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex-1 relative w-full aspect-square lg:aspect-[4/3] max-w-lg mx-auto"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-namxanh-400 to-emerald-200 rounded-[3rem] transform rotate-3 scale-105 opacity-20"></div>
              <div className="absolute inset-0 bg-white rounded-[3rem] shadow-2xl border border-white/50 overflow-hidden flex flex-col">
                <div className="h-12 bg-earth-50 border-b border-earth-100 flex items-center px-6 gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="mx-auto bg-white px-4 py-1 rounded-md text-xs font-semibold text-earth-500 border border-earth-200 shadow-sm flex items-center gap-2">
                    <Lock className="w-3 h-3" />
                    gmsupply.namxanh.vn/dashboard
                  </div>
                </div>

                {/* Dashboard Mock */}
                <div className="flex-1 bg-earth-50/50 p-5 flex flex-col gap-3 relative overflow-hidden">
                  {/* Alert badge */}
                  <div className="absolute top-4 right-4 bg-white px-3 py-2 rounded-2xl shadow-xl flex items-center gap-2 border border-amber-200 animate-bounce">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-earth-900">Gap: Bào Ngư -120kg</p>
                      <p className="text-[10px] text-earth-500">Ngày mai cần bổ sung</p>
                    </div>
                  </div>

                  {/* KPI Cards */}
                  <div className="flex gap-2 items-center mb-1">
                    <div className="w-8 h-8 bg-namxanh-600 rounded-xl"></div>
                    <div className="text-xs font-bold text-earth-700">Dashboard Cung-Cầu</div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-earth-100 p-3">
                      <div className="text-[10px] font-semibold text-earth-500 mb-1">Đã Confirm</div>
                      <div className="text-lg font-extrabold text-emerald-600">87%</div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm border border-earth-100 p-3">
                      <div className="text-[10px] font-semibold text-earth-500 mb-1">ATP Hôm nay</div>
                      <div className="text-lg font-extrabold text-blue-600">2.4T</div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm border border-earth-100 p-3">
                      <div className="text-[10px] font-semibold text-earth-500 mb-1">Fill Rate</div>
                      <div className="text-lg font-extrabold text-namxanh-600">94%</div>
                    </div>
                  </div>

                  {/* Chart mock */}
                  <div className="flex-1 bg-white rounded-2xl shadow-sm border border-earth-100 p-3">
                    <div className="text-[10px] font-bold text-earth-500 mb-2">Cung vs Cầu (7 ngày)</div>
                    <div className="flex items-end gap-1.5 h-16">
                      {[65, 80, 72, 90, 85, 68, 78].map((h, i) => (
                        <div key={i} className="flex-1 flex flex-col gap-0.5">
                          <div className="bg-namxanh-200 rounded-sm" style={{ height: `${h * 0.6}%` }}></div>
                          <div className="bg-blue-300 rounded-sm" style={{ height: `${(h - 10 + Math.random() * 20) * 0.6}%` }}></div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-4 mt-2">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-sm bg-namxanh-200"></div>
                        <span className="text-[9px] text-earth-500">Cung</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-sm bg-blue-300"></div>
                        <span className="text-[9px] text-earth-500">Cầu</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-extrabold text-namxanh-600 uppercase tracking-widest mb-3">
              Tính năng chính
            </h2>
            <p className="text-4xl lg:text-5xl font-extrabold text-earth-900 tracking-tight leading-tight">
              Thiết kế riêng cho
              <br />
              Nông sản Tươi sống.
            </p>
            <p className="mt-4 text-earth-500 font-medium">
              Shelf life 2-14 ngày, hao hụt 2-12%, chuỗi lạnh 2-8°C — mỗi giờ đều quan trọng.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-earth-50 p-6 rounded-[2rem] hover:bg-white hover:-translate-y-2 hover:shadow-xl transition-all duration-300 group border border-earth-100"
              >
                <div className={`w-14 h-14 ${feature.bg} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-bold text-earth-900 mb-2">{feature.title}</h3>
                <p className="text-earth-600 text-sm font-medium leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dual Portal Section */}
      <section id="portals" className="py-24 bg-namxanh-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-namxanh-600/30 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-extrabold text-namxanh-300 uppercase tracking-widest mb-3">
              Kiến trúc Dual Portal
            </h2>
            <p className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Hai cổng, Một hệ sinh thái.
            </p>
            <p className="mt-4 text-white/60 font-medium">
              Admin quản trị tập trung. NCC tự phục vụ qua Supplier Portal — không cần training.
            </p>
          </div>

          <div className="flex justify-center mb-10">
            <div className="flex bg-white/10 p-1.5 rounded-full backdrop-blur-md">
              <button
                onClick={() => setActivePortal("admin")}
                className={`px-8 py-3 rounded-full text-sm font-bold transition-all ${
                  activePortal === "admin" ? "bg-white text-namxanh-900 shadow-md" : "text-white/70 hover:text-white"
                }`}
              >
                Admin Portal
              </button>
              <button
                onClick={() => setActivePortal("supplier")}
                className={`px-8 py-3 rounded-full text-sm font-bold transition-all ${
                  activePortal === "supplier" ? "bg-white text-namxanh-900 shadow-md" : "text-white/70 hover:text-white"
                }`}
              >
                Supplier Portal
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activePortal}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    activePortal === "admin" ? "bg-emerald-500/20 text-emerald-400" : "bg-teal-500/20 text-teal-400"
                  }`}>
                    {activePortal === "admin" ? <ShieldCheck className="w-6 h-6" /> : <Globe className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">
                      {activePortal === "admin" ? "Admin Portal" : "Supplier Portal"}
                    </h3>
                    <p className="text-white/50 text-sm">
                      {activePortal === "admin"
                        ? "Dành cho Procurement, QC, Warehouse, Manager"
                        : "Dành cho Nhà cung cấp (NCC Owner & Staff)"}
                    </p>
                  </div>
                </div>
                <ul className="space-y-3">
                  {portalFeatures[activePortal].map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                      <span className="text-white/80 font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Link
                    href={activePortal === "admin" ? "/app" : "/supplier/register"}
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all ${
                      activePortal === "admin"
                        ? "bg-emerald-500 hover:bg-emerald-400 text-white"
                        : "bg-teal-500 hover:bg-teal-400 text-white"
                    }`}
                  >
                    {activePortal === "admin" ? "Vào Admin Portal" : "Đăng ký Nhà Cung Cấp"}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* KiotViet Integration Section */}
      <section id="integration" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-sm font-extrabold text-namxanh-600 uppercase tracking-widest mb-3">
                Tích hợp Sẵn sàng
              </h2>
              <p className="text-4xl lg:text-5xl font-extrabold text-earth-900 tracking-tight leading-tight mb-8">
                KiotViet + Shopee
                <br />
                Đồng bộ Real-time.
              </p>
              <p className="text-lg text-earth-600 leading-relaxed font-medium mb-10">
                Tự động nhận đơn hàng, hóa đơn, purchase orders từ KiotViet qua webhook. Hỗ trợ Shopee orders. Mapping sản phẩm multi-unit, 194+ bảng giá riêng theo khách hàng B2B.
              </p>

              <div className="space-y-5">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-earth-900">Webhook Real-time</h4>
                    <p className="text-earth-600 text-sm mt-1">Orders, invoices, POs đồng bộ tức thì. HMAC validation, dedup, retry tự động.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-earth-900">Product Mapping</h4>
                    <p className="text-earth-600 text-sm mt-1">589 sản phẩm, 10 danh mục, multi-unit (kg → 100g, xấp). Auto-suggest mapping.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600 shrink-0">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-earth-900">Sync Dashboard</h4>
                    <p className="text-earth-600 text-sm mt-1">Health status, error drill-down, manual sync fallback. Không bỏ lỡ đơn hàng nào.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Integration visual */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-earth-200 to-namxanh-100 rounded-[3rem] transform -rotate-3 scale-105"></div>
              <div className="relative bg-white rounded-[3rem] shadow-xl border border-earth-100 p-8">
                <h3 className="text-lg font-extrabold text-earth-900 mb-6 border-b border-earth-100 pb-4">
                  Luồng Dữ liệu
                </h3>
                <div className="space-y-4">
                  {[
                    { from: "KiotViet", arrow: "→", to: "Orders & Invoices", status: "Real-time" },
                    { from: "Shopee", arrow: "→", to: "Auto-create Orders", status: "Via KiotViet" },
                    { from: "KiotViet", arrow: "→", to: "Purchase Orders (NCC)", status: "Daily sync" },
                    { from: "KiotViet", arrow: "→", to: "Customers & Price Books", status: "194 bảng giá" },
                    { from: "KiotViet", arrow: "→", to: "Products (589 SKUs)", status: "Multi-unit" },
                    { from: "GM Supply", arrow: "→", to: "Batch/Expiry Tracking", status: "Bù gap KiotViet" },
                  ].map((flow, i) => (
                    <div key={i} className="flex items-center gap-3 bg-earth-50 rounded-2xl px-4 py-3">
                      <span className="text-xs font-bold text-namxanh-600 bg-namxanh-50 px-2 py-1 rounded-lg shrink-0">
                        {flow.from}
                      </span>
                      <ArrowRight className="w-4 h-4 text-earth-400 shrink-0" />
                      <span className="text-sm font-medium text-earth-800 flex-1">{flow.to}</span>
                      <span className="text-[10px] font-bold text-earth-500 bg-white px-2 py-1 rounded-md border border-earth-200 shrink-0">
                        {flow.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-namxanh-600 to-emerald-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9zdmc+')] opacity-30"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-4">
            Sẵn sàng tối ưu chuỗi cung ứng?
          </h2>
          <p className="text-white/80 font-medium mb-8 max-w-xl mx-auto">
            Giảm hao hụt, tăng fill rate, phân bổ thông minh. Bắt đầu ngay hôm nay.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/app"
              className="px-8 py-4 bg-white text-namxanh-700 rounded-full font-bold shadow-xl hover:shadow-2xl transition-all flex items-center gap-2 group"
            >
              Trải nghiệm Demo
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#contact"
              className="px-8 py-4 bg-white/10 text-white border border-white/30 rounded-full font-bold hover:bg-white/20 transition-all flex items-center gap-2"
            >
              <Phone className="w-5 h-5" />
              Liên hệ tư vấn
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-earth-950 text-earth-300 py-16 border-t border-earth-800">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-namxanh-600 bg-opacity-20 rounded-xl flex items-center justify-center text-namxanh-500">
                  <Leaf className="w-6 h-6" />
                </div>
                <span className="text-2xl font-bold tracking-tight text-white">
                  GM Supply.
                </span>
              </div>
              <p className="text-earth-400 font-medium max-w-sm">
                Hệ thống quản lý & phân bổ nguồn cung nấm tươi. Được phát triển bởi Nông Trại Nấm Xanh — chuyên nuôi trồng và phân phối nấm sạch tại Việt Nam.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 tracking-wide">Sản phẩm</h4>
              <ul className="space-y-3 font-medium text-sm">
                <li><Link href="#features" className="hover:text-white transition-colors">Tính năng</Link></li>
                <li><Link href="#portals" className="hover:text-white transition-colors">Admin Portal</Link></li>
                <li><Link href="#portals" className="hover:text-white transition-colors">Supplier Portal</Link></li>
                <li><Link href="#integration" className="hover:text-white transition-colors">Tích hợp KiotViet</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors text-namxanh-400">Đăng nhập</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 tracking-wide">Liên hệ</h4>
              <ul className="space-y-4 font-medium text-sm">
                <li className="flex items-center gap-3"><MapPin className="w-4 h-4 text-earth-500" /> Quận Gò Vấp, TP.HCM</li>
                <li className="flex items-center gap-3"><Phone className="w-4 h-4 text-earth-500" /> 0938.XXX.XXX</li>
                <li className="flex items-center gap-3"><Mail className="w-4 h-4 text-earth-500" /> hi@namxanh.vn</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-earth-800 pt-8 flex flex-col md:flex-row items-center justify-between text-xs font-semibold text-earth-500 tracking-wider">
            <p>© 2026 Nấm Xanh Corporation. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
