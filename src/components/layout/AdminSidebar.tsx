import Link from "next/link";

const NAV_SECTIONS = [
  {
    label: "Operations",
    items: [
      { href: "/admin/dashboard", label: "Dashboard" },
      { href: "/admin/bookings", label: "Bookings" },
      { href: "/admin/guests", label: "Guests" },
    ],
  },
  {
    label: "Inventory",
    items: [
      { href: "/admin/inventory", label: "Rooms & inventory" },
      { href: "/admin/inventory/calendar", label: "Calendar" },
      { href: "/admin/inventory/blocks", label: "Room blocks" },
      { href: "/admin/pricing", label: "Pricing" },
      { href: "/admin/promotions", label: "Promotions" },
    ],
  },
  {
    label: "Organization",
    items: [
      { href: "/admin/staff", label: "Staff" },
      { href: "/admin/analytics", label: "Analytics" },
      { href: "/admin/settings", label: "Settings" },
    ],
  },
];

export function AdminSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-border-subtle bg-surface-raised md:block">
      <div className="flex h-[var(--header-height)] items-center border-b border-border-subtle px-6">
        <span className="font-display text-lg text-text-primary">Admin console</span>
      </div>
      <nav aria-label="Admin" className="flex flex-col gap-6 px-4 py-6">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            <p className="px-2 text-xs font-medium text-text-secondary">{section.label}</p>
            <ul className="mt-2 flex flex-col gap-0.5">
              {section.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block rounded-md px-2 py-2 text-sm text-text-primary transition-colors hover:bg-surface-sunken"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
