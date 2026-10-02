import Link from "next/link";
import { siteConfig } from "@/config/site";
import { getNavItems } from "@/domain/hotel/repository";
import { MobileNavigation } from "./MobileNavigation";

export async function MarketingHeader() {
  const navItems = await getNavItems();

  return (
    <header className="sticky top-0 z-40 border-b border-border-subtle bg-surface-page/90 backdrop-blur">
      <div className="mx-auto flex h-[var(--header-height)] max-w-[var(--container-max)] items-center justify-between px-6">
        <Link href="/" className="font-display text-xl text-text-primary">
          {siteConfig.hotelName}
        </Link>
        <nav aria-label="Primary" className="hidden gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-text-secondary transition-colors hover:text-text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/availability"
            className="hidden h-10 items-center rounded-md bg-accent-primary px-4 text-sm font-medium text-text-on-accent transition-colors hover:bg-accent-primary-hover md:inline-flex"
          >
            Check availability
          </Link>
          <MobileNavigation navItems={navItems} />
        </div>
      </div>
    </header>
  );
}
