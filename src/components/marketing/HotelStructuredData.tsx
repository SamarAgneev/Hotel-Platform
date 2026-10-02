import { siteConfig } from "@/config/site";

/**
 * Minimal Schema.org Hotel structured data, built only from configured
 * site fields. Deliberately omits aggregateRating/review/award fields —
 * inventing those would be fabricating facts about a real business
 * (or, here, a disclosed fictional one). Add them once real data exists.
 */
export function HotelStructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    name: siteConfig.hotelName,
    description: siteConfig.description,
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.contact.address,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
