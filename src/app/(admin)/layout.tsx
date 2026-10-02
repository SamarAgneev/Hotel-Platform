import type { ReactNode } from "react";
import { AdminSidebar } from "@/components/layout/AdminSidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full">
      <AdminSidebar />
      <div className="flex-1">
        <header className="flex h-[var(--header-height)] items-center justify-between border-b border-border-subtle bg-surface-raised px-6">
          <p className="text-sm text-text-secondary">Property: not yet configured</p>
        </header>
        <nav aria-label="Admin quick links" className="flex gap-4 overflow-x-auto border-b border-border-subtle bg-surface-raised px-6 py-2 text-sm md:hidden">
          {[
            ["/admin/dashboard", "Dashboard"],
            ["/admin/inventory", "Inventory"],
            ["/admin/inventory/calendar", "Calendar"],
            ["/admin/inventory/blocks", "Blocks"],
          ].map(([href, label]) => (
            <a key={href} href={href} className="whitespace-nowrap py-1 text-text-primary">{label}</a>
          ))}
        </nav>
        <main className="px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
