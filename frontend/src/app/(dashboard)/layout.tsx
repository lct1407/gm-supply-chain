"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, LayoutDashboard, Tractor, PackageSearch, Boxes, Truck, PieChart } from "lucide-react";

const navigation = [
  { name: 'Tổng quan', href: '/app', icon: LayoutDashboard },
  { name: 'Vùng trồng', href: '/app/farms', icon: Tractor },
  { name: 'Mẻ nấm (Batches)', href: '/app/batches', icon: PackageSearch },
  { name: 'Kho hàng', href: '/app/inventory', icon: Boxes },
  { name: 'Đơn luân chuyển', href: '/app/orders', icon: Truck },
  { name: 'Báo cáo', href: '/app/reports', icon: PieChart },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen overflow-hidden bg-earth-50/30 selection:bg-namxanh-200">
      {/* Sidebar */}
      <aside className="hidden w-64 md:flex flex-col bg-white border-r border-earth-200/60 transition-all duration-300">
        <div className="h-16 flex items-center px-6 border-b border-earth-100">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-namxanh-600 flex items-center justify-center text-white shadow-md shadow-namxanh-600/20">
              <Leaf className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold text-namxanh-900 tracking-tight">Nấm Xanh App</span>
          </Link>
        </div>
        
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive 
                    ? 'bg-namxanh-50 text-namxanh-700' 
                    : 'text-earth-600 hover:bg-earth-100/50 hover:text-earth-900'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-namxanh-600' : 'text-earth-400 group-hover:text-earth-600'}`} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-earth-100">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-earth-50 border border-earth-100">
            <div className="w-9 h-9 rounded-full bg-namxanh-200 flex items-center justify-center text-namxanh-800 font-bold">
              AM
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-earth-900 truncate">Admin</p>
              <p className="text-xs text-earth-500 truncate">admin@namxanh.vn</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto w-full">
        {/* Topbar */}
        <header className="h-16 flex items-center justify-between px-6 bg-white/80 backdrop-blur-md border-b border-earth-200/60 sticky top-0 z-30">
          <div className="md:hidden flex items-center">
            {/* Mobile menu toggle goes here */}
            <button className="text-earth-500 hover:text-namxanh-600">
              <Leaf className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-1 flex justify-end items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" title="Hệ thống Online" />
            <span className="text-xs font-semibold text-earth-500 uppercase tracking-widest hidden sm:inline-block">Status: Live</span>
          </div>
        </header>

        <div className="p-6 lg:p-8 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
          {children}
        </div>
      </main>
    </div>
  );
}
