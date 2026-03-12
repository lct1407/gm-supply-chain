"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Calendar,
  LayoutDashboard,
  Leaf,
  LogOut,
  Menu,
  MessageSquare,
  Star,
  Truck,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/supplier", icon: LayoutDashboard },
  { label: "Phân bổ", href: "/supplier/allocations", icon: BarChart3 },
  { label: "Lịch thu hoạch", href: "/supplier/schedule", icon: Calendar },
  { label: "Giao hàng", href: "/supplier/deliveries", icon: Truck },
  { label: "Điểm", href: "/supplier/scores", icon: Star },
  { label: "Tin nhắn", href: "/supplier/messages", icon: MessageSquare },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/supplier") {
    return pathname === "/supplier";
  }
  return pathname.startsWith(href);
}

export function SupplierTopNav() {
  const pathname = usePathname();
  const [lang, setLang] = useState<"vi" | "en">("vi");
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center px-4 sm:px-6">
        {/* Logo */}
        <Link href="/supplier" className="flex items-center gap-2 mr-8">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm">
            <Leaf className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold text-slate-900 hidden sm:inline">
            Nấm Xanh
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden lg:flex items-center gap-1 flex-1">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors border-b-2 -mb-[1px] ${
                  active
                    ? "text-teal-600 border-teal-600"
                    : "text-slate-600 border-transparent hover:text-teal-600 hover:border-teal-300"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Language toggle */}
          <div className="hidden sm:flex items-center rounded-lg border bg-slate-50 p-0.5">
            <button
              onClick={() => setLang("vi")}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                lang === "vi"
                  ? "bg-white text-teal-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Vi
            </button>
            <button
              onClick={() => setLang("en")}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                lang === "en"
                  ? "bg-white text-teal-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              En
            </button>
          </div>

          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative flex items-center gap-2 px-2"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-teal-100 text-teal-700 text-sm font-medium">
                    NT
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:inline text-sm font-medium text-slate-700">
                  Nguyễn Văn Tân
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Nguyễn Văn Tân
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    Trang trại Nấm Sạch Đồng Nai
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href="/supplier/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Hồ sơ</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/login">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Đăng xuất</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile hamburger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Mở menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-0">
              <SheetTitle className="sr-only">Menu điều hướng</SheetTitle>
              <div className="flex flex-col h-full">
                {/* Mobile header */}
                <div className="flex items-center gap-2 p-4 border-b">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-white">
                    <Leaf className="h-5 w-5" />
                  </div>
                  <span className="text-lg font-bold text-slate-900">
                    Nấm Xanh
                  </span>
                </div>

                {/* Mobile nav items */}
                <nav className="flex flex-col gap-1 p-3">
                  {navItems.map((item) => {
                    const active = isActive(pathname, item.href);
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                          active
                            ? "bg-teal-50 text-teal-700"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>

                {/* Mobile language toggle */}
                <div className="mt-auto border-t p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-slate-500 font-medium">
                      Ngôn ngữ:
                    </span>
                    <div className="flex items-center rounded-lg border bg-slate-50 p-0.5">
                      <button
                        onClick={() => setLang("vi")}
                        className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                          lang === "vi"
                            ? "bg-white text-teal-700 shadow-sm"
                            : "text-slate-500"
                        }`}
                      >
                        Vi
                      </button>
                      <button
                        onClick={() => setLang("en")}
                        className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                          lang === "en"
                            ? "bg-white text-teal-700 shadow-sm"
                            : "text-slate-500"
                        }`}
                      >
                        En
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
