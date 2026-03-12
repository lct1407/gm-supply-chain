"use client";

import Link from "next/link";
import { ArrowRight, Leaf, Sprout, ShoppingCart, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-earth-50 text-namxanh-950 font-sans selection:bg-namxanh-200">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-namxanh-100/50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-namxanh-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-namxanh-600/20">
              <Leaf className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-namxanh-900">
              Nấm Xanh<span className="text-namxanh-500">.</span>
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-namxanh-800">
            <Link href="#about" className="hover:text-namxanh-600 transition-colors">Về chúng tôi</Link>
            <Link href="#products" className="hover:text-namxanh-600 transition-colors">Sản phẩm</Link>
            <Link href="#traceability" className="hover:text-namxanh-600 transition-colors">Truy xuất nguồn gốc</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="text-sm font-semibold text-namxanh-700 hover:text-namxanh-500 transition-colors"
            >
              Đăng nhập App
            </Link>
            <Link 
              href="/app" 
              className="group flex items-center gap-2 px-5 py-2.5 bg-namxanh-600 hover:bg-namxanh-700 text-white text-sm font-semibold rounded-full transition-all shadow-md shadow-namxanh-600/20"
            >
              Trải nghiệm Dashboard
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex-1 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-namxanh-100/50 text-namxanh-700 font-semibold text-sm mb-6 border border-namxanh-200/50">
                <Leaf className="w-4 h-4" />
                <span>Nông nghiệp bền vững</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
                Từ Nông Trại <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-namxanh-600 to-namxanh-400">
                  Đến Bàn Ăn.
                </span>
              </h1>
              <p className="text-lg text-namxanh-800/80 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Nền tảng quản lý chuỗi cung ứng minh bạch, đạt tiêu chuẩn quốc tế. Cung cấp quy trình khép kín giúp nâng tầm chất lượng nấm tươi và nấm khô Việt Nam.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link 
                  href="/app" 
                  className="w-full sm:w-auto px-8 py-4 bg-namxanh-600 hover:bg-namxanh-700 text-white rounded-full font-semibold transition-all shadow-xl shadow-namxanh-600/30 flex items-center justify-center gap-2 group"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Hệ thống Quản trị
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  href="#traceability" 
                  className="w-full sm:w-auto px-8 py-4 bg-white/50 hover:bg-white text-namxanh-900 border border-namxanh-200 rounded-full font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-5 h-5 text-namxanh-600" />
                  Tìm hiểu Tiêu chuẩn
                </Link>
              </div>

              <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 opacity-70">
                <div className="flex flex-col">
                  <span className="text-3xl font-bold">50+</span>
                  <span className="text-sm font-medium">Nông trại liên kết</span>
                </div>
                <div className="h-10 w-px bg-namxanh-200"></div>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold">100%</span>
                  <span className="text-sm font-medium">Chuẩn VSATTP</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex-1 relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-namxanh-400/20 to-namxanh-100/10 rounded-3xl transform rotate-3 scale-105"></div>
              <div className="relative aspect-square lg:aspect-[4/3] bg-white rounded-3xl shadow-2xl overflow-hidden border border-namxanh-100 flex items-center justify-center">
                 {/* Decorative Graphic/Mock Preshow */}
                 <div className="absolute inset-0 bg-gradient-to-br from-namxanh-50 to-white"></div>
                 <div className="relative z-10 flex flex-col items-center">
                    <Sprout className="w-32 h-32 text-namxanh-500 mb-6 drop-shadow-md" />
                    <h3 className="text-2xl font-bold text-namxanh-900">Nấm Xanh Ecosystem</h3>
                    <p className="text-namxanh-600 mt-2">Hệ sinh thái thông minh</p>
                 </div>
                 
                 {/* Floating Badges */}
                 <div className="absolute top-8 left-8 bg-white/80 backdrop-blur border border-namxanh-100 px-4 py-2 rounded-2xl shadow-lg flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-bold text-namxanh-800">Tracking Active</span>
                 </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
