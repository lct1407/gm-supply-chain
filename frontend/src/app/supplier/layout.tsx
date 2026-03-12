"use client";

import { SupplierTopNav } from "@/components/layout/supplier-topnav";

export default function SupplierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <SupplierTopNav />
      <main className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6">
        {children}
      </main>
    </div>
  );
}
