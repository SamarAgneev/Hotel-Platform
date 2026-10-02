import Link from "next/link";
import type { Offer } from "@/domain/hotel/types";
import { formatDateLabel } from "@/lib/utils/format";
import { Badge } from "@/components/ui";

export interface OfferCardProps {
  offer: Offer;
  isExpired?: boolean;
}

export function OfferCard({ offer, isExpired = false }: OfferCardProps) {
  return (
    <article className="flex flex-col gap-3 rounded-lg border border-border-subtle bg-surface-raised p-6">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-xl text-text-primary">{offer.title}</h3>
        <Badge tone={isExpired ? "neutral" : "accent"}>
          {isExpired ? "Expired" : offer.discountLabel}
        </Badge>
      </div>
      <p className="text-sm text-text-secondary">{offer.description}</p>
      <p className="text-xs text-text-secondary">
        Valid {formatDateLabel(offer.validFrom)} – {formatDateLabel(offer.validTo)}
      </p>
      <p className="text-xs text-text-secondary">{offer.terms}</p>
      {!isExpired && (
        <Link
          href="/contact"
          className="mt-2 inline-flex h-10 w-fit items-center rounded-md bg-accent-primary px-4 text-sm font-medium text-text-on-accent transition-colors hover:bg-accent-primary-hover"
        >
          {offer.ctaLabel}
        </Link>
      )}
    </article>
  );
}
