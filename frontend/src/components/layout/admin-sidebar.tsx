"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  BarChart3,
  Warehouse,
  MessageSquare,
  LineChart,
  Link2,
  Settings,
  ChevronDown,
  ChevronRight,
  Users,
  UserPlus,
  ShoppingCart,
  Contact,
  CalendarRange,
  Handshake,
  PackageOpen,
  ArrowLeftRight,
  ShieldCheck,
  Ruler,
  Tags,
  Cog,
  ScrollText,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavChild {
  label: string;
  href: string;
  icon: React.ElementType;
}

interface NavGroup {
  label: string;
  icon: React.ElementType;
  href: string;
  children?: NavChild[];
}

const navGroups: NavGroup[] = [
  {
    label: "Tong quan",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    label: "Nha cung cap",
    icon: Package,
    href: "/suppliers",
    children: [
      { label: "Danh sach NCC", href: "/suppliers", icon: Users },
      { label: "Dang ky NCC moi", href: "/registrations", icon: UserPlus },
    ],
  },
  {
    label: "Don hang",
    icon: ClipboardList,
    href: "/orders",
    children: [
      { label: "Danh sach don hang", href: "/orders", icon: ShoppingCart },
      { label: "Khach hang", href: "/customers", icon: Contact },
    ],
  },
  {
    label: "Phan bo",
    icon: BarChart3,
    href: "/allocations",
    children: [
      { label: "Ke hoach thang", href: "/allocations", icon: CalendarRange },
      {
        label: "Phan bo ngay",
        href: "/allocations/daily",
        icon: ClipboardList,
      },
      {
        label: "Lich cung ung & ATP",
        href: "/allocations/supply-schedule",
        icon: PackageOpen,
      },
      {
        label: "Thuong luong",
        href: "/allocations/negotiations",
        icon: Handshake,
      },
    ],
  },
  {
    label: "Kho",
    icon: Warehouse,
    href: "/inventory",
    children: [
      { label: "Ton kho", href: "/inventory", icon: PackageOpen },
      {
        label: "Nhap/Xuat kho",
        href: "/inventory/movements",
        icon: ArrowLeftRight,
      },
    ],
  },
  {
    label: "Tin nhan",
    icon: MessageSquare,
    href: "/messages",
  },
  {
    label: "Bao cao",
    icon: LineChart,
    href: "/reports",
  },
  {
    label: "Tich hop",
    icon: Link2,
    href: "/integrations/kiotviet",
  },
  {
    label: "Quan tri",
    icon: Settings,
    href: "/admin",
    children: [
      { label: "Nguoi dung", href: "/admin/users", icon: Users },
      { label: "San pham", href: "/admin/products", icon: Package },
      {
        label: "Phan loai chat luong",
        href: "/admin/quality-grades",
        icon: ShieldCheck,
      },
      { label: "Don vi tinh", href: "/admin/units", icon: Ruler },
      { label: "Cau hinh", href: "/admin/config", icon: Cog },
      {
        label: "Nhat ky he thong",
        href: "/admin/audit-log",
        icon: ScrollText,
      },
    ],
  },
];

// Vietnamese labels with diacritics for display
const viLabels: Record<string, string> = {
  "Tong quan": "T\u1ed5ng quan",
  "Nha cung cap": "Nh\u00e0 cung c\u1ea5p",
  "Danh sach NCC": "Danh s\u00e1ch NCC",
  "Dang ky NCC moi": "\u0110\u0103ng k\u00fd NCC m\u1edbi",
  "Don hang": "\u0110\u01a1n h\u00e0ng",
  "Danh sach don hang": "Danh s\u00e1ch \u0111\u01a1n h\u00e0ng",
  "Khach hang": "Kh\u00e1ch h\u00e0ng",
  "Phan bo": "Ph\u00e2n b\u1ed5",
  "Ke hoach thang": "K\u1ebf ho\u1ea1ch th\u00e1ng",
  "Thuong luong": "Th\u01b0\u01a1ng l\u01b0\u1ee3ng",
  Kho: "Kho",
  "Ton kho": "T\u1ed3n kho",
  "Nhap/Xuat kho": "Nh\u1eadp/Xu\u1ea5t kho",
  "Tin nhan": "Tin nh\u1eafn",
  "Bao cao": "B\u00e1o c\u00e1o",
  "Tich hop": "T\u00edch h\u1ee3p",
  "Quan tri": "Qu\u1ea3n tr\u1ecb",
  "Nguoi dung": "Ng\u01b0\u1eddi d\u00f9ng",
  "San pham": "S\u1ea3n ph\u1ea9m",
  "Phan loai chat luong": "Ph\u00e2n lo\u1ea1i ch\u1ea5t l\u01b0\u1ee3ng",
  "Don vi tinh": "\u0110\u01a1n v\u1ecb t\u00ednh",
  "Cau hinh": "C\u1ea5u h\u00ecnh",
  "Nhat ky he thong": "Nh\u1eadt k\u00fd h\u1ec7 th\u1ed1ng",
  "Phan bo ngay": "Ph\u00e2n b\u1ed5 ng\u00e0y",
  "Lich cung ung & ATP": "L\u1ecbch cung \u1ee9ng & ATP",
};

function getViLabel(key: string): string {
  return viLabels[key] ?? key;
}

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
  const pathname = usePathname();
  const [expandedGroups, setExpandedGroups] = React.useState<
    Record<string, boolean>
  >({});

  // Auto-expand groups that contain the active route
  React.useEffect(() => {
    const expanded: Record<string, boolean> = {};
    for (const group of navGroups) {
      if (group.children) {
        const isActive = group.children.some(
          (child) =>
            pathname === child.href || pathname.startsWith(child.href + "/")
        );
        if (isActive) {
          expanded[group.label] = true;
        }
      }
    }
    setExpandedGroups((prev) => ({ ...prev, ...expanded }));
  }, [pathname]);

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 flex h-screen flex-col border-r bg-card transition-all duration-300",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center border-b px-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Package className="h-4 w-4" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-bold text-primary">
                  N&#7845;m Xanh
                </span>
                <span className="text-[10px] text-muted-foreground">
                  Supply Chain
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 py-2">
          <nav className="flex flex-col gap-1 px-2">
            {navGroups.map((group) => {
              const Icon = group.icon;
              const hasChildren = group.children && group.children.length > 0;
              const isGroupActive = isActive(group.href);
              const isExpanded = expandedGroups[group.label];

              if (collapsed) {
                return (
                  <Tooltip key={group.label}>
                    <TooltipTrigger asChild>
                      <Link
                        href={group.href}
                        className={cn(
                          "flex h-10 w-full items-center justify-center rounded-md text-sm transition-colors",
                          isGroupActive
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right" sideOffset={8}>
                      {getViLabel(group.label)}
                    </TooltipContent>
                  </Tooltip>
                );
              }

              if (!hasChildren) {
                return (
                  <Link
                    key={group.label}
                    href={group.href}
                    className={cn(
                      "flex h-10 items-center gap-3 rounded-md px-3 text-sm transition-colors",
                      isGroupActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span>{getViLabel(group.label)}</span>
                  </Link>
                );
              }

              return (
                <div key={group.label}>
                  <button
                    onClick={() => toggleGroup(group.label)}
                    className={cn(
                      "flex h-10 w-full items-center gap-3 rounded-md px-3 text-sm transition-colors",
                      isGroupActive
                        ? "text-primary font-medium"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span className="flex-1 text-left">
                      {getViLabel(group.label)}
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                  {isExpanded && (
                    <div className="ml-4 flex flex-col gap-0.5 border-l pl-2">
                      {group.children!.map((child) => {
                        const ChildIcon = child.icon;
                        const childActive = isActive(child.href);
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              "flex h-9 items-center gap-3 rounded-md px-3 text-sm transition-colors",
                              childActive
                                ? "bg-primary/10 text-primary font-medium"
                                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            )}
                          >
                            <ChildIcon className="h-4 w-4 shrink-0" />
                            <span>{getViLabel(child.label)}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </ScrollArea>

        {/* Collapse toggle */}
        <div className="border-t p-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="w-full justify-center"
          >
            {collapsed ? (
              <PanelLeft className="h-5 w-5" />
            ) : (
              <PanelLeftClose className="h-5 w-5" />
            )}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  );
}
