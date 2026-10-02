import type { Metadata } from "next";
import { OfferCard } from "@/components/marketing/OfferCard";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState";
import { getActiveOffers, getExpiredOffers } from "@/domain/hotel/repository";

export const metadata: Metadata = {
  title: "Offers",
  description: "Current rate offers at Royal Horizon Hotel.",
};

export default async function OffersPage() {
  const [activeOffers, expiredOffers] = await Promise.all([getActiveOffers(), getExpiredOffers()]);

  return (
    <div className="mx-auto max-w-[var(--container-max)] px-6 py-16">
      <SectionHeading title="Offers" description="Rate offers, updated as they open and close." />

      {activeOffers.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="No active offers right now"
            description="Standard rates apply. Check back soon, or ask us directly about upcoming dates."
          />
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {activeOffers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      )}

      {expiredOffers.length > 0 && (
        <div className="mt-14">
          <h2 className="text-lg text-text-secondary">Past offers</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {expiredOffers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} isExpired />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
