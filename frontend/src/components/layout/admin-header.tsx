"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Bell, LogOut, Settings, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { AdminSidebar } from "./admin-sidebar";

// Map pathname to Vietnamese page title
const pageTitles: Record<string, string> = {
  "/": "T\u1ed5ng quan",
  "/suppliers": "Nh\u00e0 cung c\u1ea5p",
  "/registrations": "\u0110\u0103ng k\u00fd NCC m\u1edbi",
  "/orders": "\u0110\u01a1n h\u00e0ng",
  "/customers": "Kh\u00e1ch h\u00e0ng",
  "/allocations": "Ph\u00e2n b\u1ed5",
  "/allocations/negotiations": "Th\u01b0\u01a1ng l\u01b0\u1ee3ng",
  "/inventory": "T\u1ed3n kho",
  "/inventory/movements": "Nh\u1eadp/Xu\u1ea5t kho",
  "/messages": "Tin nh\u1eafn",
  "/reports": "B\u00e1o c\u00e1o",
  "/integrations/kiotviet": "T\u00edch h\u1ee3p KiotViet",
  "/admin": "Qu\u1ea3n tr\u1ecb",
  "/admin/users": "Ng\u01b0\u1eddi d\u00f9ng",
  "/admin/products": "S\u1ea3n ph\u1ea9m",
  "/admin/quality-grades": "Ph\u00e2n lo\u1ea1i ch\u1ea5t l\u01b0\u1ee3ng",
  "/admin/units": "\u0110\u01a1n v\u1ecb t\u00ednh",
  "/admin/config": "C\u1ea5u h\u00ecnh",
  "/admin/audit-log": "Nh\u1eadt k\u00fd h\u1ec7 th\u1ed1ng",
};

function getPageTitle(pathname: string): string {
  // Exact match first
  if (pageTitles[pathname]) return pageTitles[pathname];
  // Try prefix match for nested routes
  const segments = pathname.split("/").filter(Boolean);
  while (segments.length > 0) {
    const path = "/" + segments.join("/");
    if (pageTitles[path]) return pageTitles[path];
    segments.pop();
  }
  return "T\u1ed5ng quan";
}

interface AdminHeaderProps {
  sidebarCollapsed: boolean;
}

export function AdminHeader({ sidebarCollapsed }: AdminHeaderProps) {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
      {/* Mobile sidebar trigger */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">M\u1edf menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SheetTitle className="sr-only">Menu \u0111i\u1ec1u h\u01b0\u1edbng</SheetTitle>
          <AdminSidebar collapsed={false} onToggle={() => {}} />
        </SheetContent>
      </Sheet>

      {/* Page title */}
      <div className="flex-1">
        <h1 className="text-lg font-semibold">{pageTitle}</h1>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-[10px] flex items-center justify-center">
            3
          </Badge>
          <span className="sr-only">Th\u00f4ng b\u00e1o</span>
        </Button>

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-9 w-9 rounded-full"
            >
              <Avatar className="h-9 w-9">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                  AD
                </div>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Admin</p>
                <p className="text-xs leading-none text-muted-foreground">
                  admin@namxanh.vn
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>T\u00e0i kho\u1ea3n</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>C\u00e0i \u0111\u1eb7t</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span>\u0110\u0103ng xu\u1ea5t</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
