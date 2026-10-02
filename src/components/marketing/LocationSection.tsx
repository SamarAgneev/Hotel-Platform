import Link from "next/link";
import { siteConfig } from "@/config/site";
import type { NearbyAttraction } from "@/domain/hotel/types";
import { SectionHeading } from "./SectionHeading";

export interface MapPlaceholderProps {
  className?: string;
}

/**
 * Map integration boundary. No real map provider is wired up yet — this
 * is the component a real Google Maps/Mapbox embed replaces later,
 * without any layout change to the page around it.
 */
export function MapPlaceholder({ className }: MapPlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={`Map placeholder for ${siteConfig.hotelName}`}
      className={`flex items-center justify-center rounded-lg border border-dashed border-border-default bg-surface-sunken text-sm text-text-secondary ${className ?? ""}`}
    >
      Map integration not yet connected
    </div>
  );
}

export function LocationSection({ attractions }: { attractions: NearbyAttraction[] }) {
  const directionsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    siteConfig.contact.address,
  )}`;

  return (
    <section className="mx-auto max-w-[var(--container-max)] px-6 py-20">
      <SectionHeading title="Find us" description="Demo location — see the note below." />
      <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <MapPlaceholder className="aspect-[16/10] w-full" />
        <div className="flex flex-col gap-6">
          <div>
            <h3 className="text-lg text-text-primary">Address</h3>
            <p className="mt-1 text-sm text-text-secondary">{siteConfig.contact.address}</p>
            <p className="mt-1 text-xs text-text-secondary">
              Demo address for the fictional Royal Horizon Hotel.
            </p>
            <Link
              href={directionsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex h-10 items-center rounded-md border border-border-default px-4 text-sm font-medium text-text-primary hover:bg-surface-sunken"
            >
              Get directions
            </Link>
          </div>
          <div>
            <h3 className="text-lg text-text-primary">Nearby</h3>
            <ul className="mt-2 flex flex-col gap-2">
              {attractions.map((attraction) => (
                <li
                  key={attraction.name}
                  className="flex items-center justify-between border-b border-border-subtle pb-2 text-sm"
                >
                  <span className="text-text-primary">{attraction.name}</span>
                  <span className="text-text-secondary">{attraction.distance}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
