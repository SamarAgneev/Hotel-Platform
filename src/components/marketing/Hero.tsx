import Link from "next/link";
import { siteConfig } from "@/config/site";
import { PlaceholderArt } from "./PlaceholderArt";
import { AvailabilitySearch } from "./AvailabilitySearch";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border-subtle">
      <PlaceholderArt
        treatment="harbor"
        alt="Royal Horizon Hotel overlooking the harbor at dusk"
        className="absolute inset-0"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink-950)]/80 via-[var(--color-ink-950)]/20 to-transparent" />

      <div className="relative mx-auto flex max-w-[var(--container-max)] flex-col gap-10 px-6 py-24 sm:py-32">
        <div className="max-w-xl">
          <p className="text-sm font-medium tracking-wide text-white/80">
            {siteConfig.contact.address.split(",").slice(-2).join(",").trim()}
          </p>
          <h1 className="mt-3 text-4xl leading-tight text-white sm:text-5xl">
            {siteConfig.tagline}
          </h1>
          <p className="mt-5 max-w-lg text-lg text-white/85">{siteConfig.description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/rooms"
              className="inline-flex h-12 items-center rounded-md border border-white/40 px-6 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              Explore rooms
            </Link>
          </div>
        </div>

        <AvailabilitySearch variant="hero" className="sm:max-w-3xl" />
      </div>
    </section>
  );
}
