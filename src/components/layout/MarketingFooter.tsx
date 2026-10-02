import Link from "next/link";
import { siteConfig } from "@/config/site";
import { getNavItems } from "@/domain/hotel/repository";

const POLICY_LINKS = [
  { href: "/contact", label: "Cancellation policy" },
  { href: "/contact", label: "Privacy policy" },
  { href: "/contact", label: "Terms of stay" },
];

export async function MarketingFooter() {
  const navItems = await getNavItems();

  return (
    <footer className="border-t border-border-subtle bg-surface-sunken">
      <div className="mx-auto max-w-[var(--container-max)] px-6 py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-lg text-text-primary">{siteConfig.hotelName}</p>
            <p className="mt-2 text-sm text-text-secondary">{siteConfig.tagline}</p>
            {siteConfig.isDemoContent && (
              <p className="mt-3 text-xs text-text-secondary">
                Demo property for platform preview purposes.
              </p>
            )}
          </div>

          <div>
            <h3 className="text-sm font-medium text-text-primary">Explore</h3>
            <ul className="mt-3 flex flex-col gap-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-text-secondary hover:text-text-primary">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium text-text-primary">Contact</h3>
            <dl className="mt-3 flex flex-col gap-2 text-sm text-text-secondary">
              <div>
                <dt className="sr-only">Phone</dt>
                <dd>{siteConfig.contact.phone}</dd>
              </div>
              <div>
                <dt className="sr-only">Email</dt>
                <dd>{siteConfig.contact.email}</dd>
              </div>
              <div>
                <dt className="sr-only">Address</dt>
                <dd>{siteConfig.contact.address}</dd>
              </div>
            </dl>
          </div>

          <div>
            <h3 className="text-sm font-medium text-text-primary">Follow</h3>
            <ul className="mt-3 flex flex-col gap-2 text-sm">
              <li>
                {siteConfig.social.instagram ? (
                  <Link href={siteConfig.social.instagram} className="text-text-secondary hover:text-text-primary">
                    Instagram
                  </Link>
                ) : (
                  <span className="text-text-secondary/60">Instagram (not configured)</span>
                )}
              </li>
              <li>
                {siteConfig.social.facebook ? (
                  <Link href={siteConfig.social.facebook} className="text-text-secondary hover:text-text-primary">
                    Facebook
                  </Link>
                ) : (
                  <span className="text-text-secondary/60">Facebook (not configured)</span>
                )}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border-default pt-6 sm:flex-row sm:items-center sm:justify-between">
          <ul className="flex flex-wrap gap-4">
            {POLICY_LINKS.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="text-xs text-text-secondary hover:text-text-primary">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="text-xs text-text-secondary">
            © {new Date().getFullYear()} {siteConfig.hotelName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
