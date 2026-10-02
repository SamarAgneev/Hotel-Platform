/**
 * Customer-facing content types.
 *
 * These describe the SHAPE of data the marketing site renders. Step 2
 * backs them with demo data (`demo-data.ts`); a later step backs them
 * with Prisma queries against RoomType/Promotion/etc. UI components
 * import these types and `repository.ts` functions — never the demo data
 * module directly — so swapping the source later touches one file.
 */

export interface RoomAmenity {
  id: string;
  label: string;
}

export interface RoomImage {
  id: string;
  /** Deterministic key used to render a consistent placeholder treatment
   * until real photography is uploaded per tenant. */
  treatment: "dawn" | "harbor" | "study" | "suite" | "terrace";
  alt: string;
}

export interface Room {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  maxOccupancy: number;
  bedType: string;
  sizeSqm: number;
  startingPriceCents: number;
  currency: string;
  priceUnit: "night";
  amenities: RoomAmenity[];
  images: RoomImage[];
  policies: string[];
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  terms: string;
  validFrom: string; // ISO date
  validTo: string; // ISO date
  discountLabel: string;
  ctaLabel: string;
}

export type GalleryCategory = "Rooms" | "Dining" | "Wellness" | "Property" | "Experiences";

export interface GalleryImage {
  id: string;
  category: GalleryCategory;
  treatment: RoomImage["treatment"];
  caption: string;
  alt: string;
}

export interface Testimonial {
  id: string;
  guestName: string;
  stayContext: string;
  quote: string;
  /** Always true for now — demo testimonials are never presented as real. */
  isDemo: true;
}

export interface NavItem {
  href: string;
  label: string;
}

export interface ExperienceHighlight {
  id: string;
  title: string;
  body: string;
  category: "Dining" | "Wellness" | "Events" | "Business" | "Local";
}

export interface NearbyAttraction {
  name: string;
  distance: string;
  category: string;
}
