/**
 * DEMO CONTENT — Royal Horizon Hotel is a fictional property.
 *
 * Every export in this file is placeholder content for Step 2's UI build.
 * Nothing here is a real hotel, room, price, or guest. When a real
 * database/tenant replaces this, `repository.ts` is the only file that
 * needs to change — components never import from here directly.
 */

import type {
  ExperienceHighlight,
  GalleryImage,
  NavItem,
  NearbyAttraction,
  Offer,
  Room,
  Testimonial,
} from "./types";

export const DEMO_NAV_ITEMS: NavItem[] = [
  { href: "/rooms", label: "Rooms" },
  { href: "/offers", label: "Offers" },
  { href: "/#experience", label: "Experience" },
  { href: "/gallery", label: "Gallery" },
  { href: "/location", label: "Location" },
  { href: "/contact", label: "Contact" },
];

export const DEMO_ROOMS: Room[] = [
  {
    slug: "skyline-king",
    name: "Skyline King",
    shortDescription: "An airy corner room with a king bed and harbor views.",
    description:
      "The Skyline King sits on the upper floors, corner-facing, so the harbor light reaches both the bed and the desk through the afternoon. Furnished in walnut and undyed linen, with a sitting chair by the window rather than a second TV.",
    maxOccupancy: 2,
    bedType: "1 King Bed",
    sizeSqm: 32,
    startingPriceCents: 24900,
    currency: "USD",
    priceUnit: "night",
    amenities: [
      { id: "wifi", label: "High-speed Wi-Fi" },
      { id: "view", label: "Harbor view" },
      { id: "rainshower", label: "Rain shower" },
      { id: "desk", label: "Dedicated work desk" },
      { id: "minibar", label: "Stocked minibar" },
    ],
    images: [
      { id: "skyline-king-1", treatment: "harbor", alt: "Skyline King room with harbor view" },
      { id: "skyline-king-2", treatment: "study", alt: "Work desk in the Skyline King room" },
      { id: "skyline-king-3", treatment: "dawn", alt: "Morning light in the Skyline King room" },
    ],
    policies: [
      "Free cancellation up to 48 hours before check-in.",
      "Check-in from 3:00 PM, check-out by 11:00 AM.",
      "No smoking. A cleaning fee applies if this policy is not observed.",
    ],
  },
  {
    slug: "harbor-suite",
    name: "Harbor Suite",
    shortDescription: "A separate living area, wraparound windows, two guests.",
    description:
      "The Harbor Suite adds a proper living area — a sofa, a low table, and enough distance from the bed to take a call without whispering. Wraparound windows carry the view around two sides of the room.",
    maxOccupancy: 3,
    bedType: "1 King Bed + Sofa",
    sizeSqm: 48,
    startingPriceCents: 38900,
    currency: "USD",
    priceUnit: "night",
    amenities: [
      { id: "wifi", label: "High-speed Wi-Fi" },
      { id: "view", label: "Wraparound harbor view" },
      { id: "livingarea", label: "Separate living area" },
      { id: "bathtub", label: "Soaking tub" },
      { id: "nespresso", label: "Espresso machine" },
      { id: "minibar", label: "Stocked minibar" },
    ],
    images: [
      { id: "harbor-suite-1", treatment: "suite", alt: "Harbor Suite living area" },
      { id: "harbor-suite-2", treatment: "terrace", alt: "Harbor Suite window seating" },
      { id: "harbor-suite-3", treatment: "harbor", alt: "Harbor Suite bedroom" },
    ],
    policies: [
      "Free cancellation up to 48 hours before check-in.",
      "Check-in from 3:00 PM, check-out by 11:00 AM.",
      "Third guest supplement applies for the sofa bed.",
    ],
  },
  {
    slug: "garden-twin",
    name: "Garden Twin",
    shortDescription: "Two beds, ground-floor calm, opens onto the courtyard garden.",
    description:
      "Set on the ground floor around the courtyard, the Garden Twin trades the skyline for quiet — French doors open directly onto planted beds and a shared reading corner. A practical choice for two travelers who want their own beds.",
    maxOccupancy: 2,
    bedType: "2 Twin Beds",
    sizeSqm: 28,
    startingPriceCents: 19900,
    currency: "USD",
    priceUnit: "night",
    amenities: [
      { id: "wifi", label: "High-speed Wi-Fi" },
      { id: "gardenaccess", label: "Direct garden access" },
      { id: "rainshower", label: "Rain shower" },
      { id: "desk", label: "Dedicated work desk" },
    ],
    images: [
      { id: "garden-twin-1", treatment: "terrace", alt: "Garden Twin room with courtyard doors" },
      { id: "garden-twin-2", treatment: "study", alt: "Garden Twin seating area" },
      { id: "garden-twin-3", treatment: "dawn", alt: "Garden Twin in early morning light" },
    ],
    policies: [
      "Free cancellation up to 48 hours before check-in.",
      "Check-in from 3:00 PM, check-out by 11:00 AM.",
      "Not wheelchair accessible — contact us for accessible room options.",
    ],
  },
  {
    slug: "penthouse-terrace",
    name: "Penthouse Terrace",
    shortDescription: "Top floor, a private terrace, and the whole skyline to yourself.",
    description:
      "The one room with its own outdoor space: a private terrace wide enough for breakfast outside, wrapped around the top-floor corner. Inside, the room keeps the same restraint as the rest of the hotel — nothing competes with the view.",
    maxOccupancy: 2,
    bedType: "1 King Bed",
    sizeSqm: 40,
    startingPriceCents: 52900,
    currency: "USD",
    priceUnit: "night",
    amenities: [
      { id: "wifi", label: "High-speed Wi-Fi" },
      { id: "terrace", label: "Private terrace" },
      { id: "view", label: "Panoramic skyline view" },
      { id: "bathtub", label: "Soaking tub" },
      { id: "nespresso", label: "Espresso machine" },
      { id: "minibar", label: "Stocked minibar" },
    ],
    images: [
      { id: "penthouse-1", treatment: "terrace", alt: "Penthouse Terrace private outdoor space" },
      { id: "penthouse-2", treatment: "suite", alt: "Penthouse Terrace bedroom" },
      { id: "penthouse-3", treatment: "dawn", alt: "Sunrise from the Penthouse Terrace" },
    ],
    policies: [
      "Free cancellation up to 72 hours before check-in.",
      "Check-in from 3:00 PM, check-out by 11:00 AM.",
      "Limited availability — one room of this type.",
    ],
  },
];

export const DEMO_OFFERS: Offer[] = [
  {
    id: "early-horizon",
    title: "Early Horizon",
    description:
      "Book 21 days ahead and settle in for three nights or more — the earlier the booking, the more room in the budget for the view.",
    terms: "Minimum 3-night stay. Non-refundable. Subject to availability.",
    validFrom: "2026-10-01",
    validTo: "2027-03-31",
    discountLabel: "15% off",
    ctaLabel: "Check dates",
  },
  {
    id: "weekday-quiet",
    title: "Weekday Quiet",
    description:
      "The harbor is stillest midweek. Arrive Sunday or Monday and the Skyline King and Garden Twin carry a standing weekday rate.",
    terms: "Valid Sunday–Tuesday arrivals only. Standard cancellation policy applies.",
    validFrom: "2026-10-01",
    validTo: "2027-06-30",
    discountLabel: "10% off",
    ctaLabel: "Check dates",
  },
];

export const DEMO_GALLERY: GalleryImage[] = [
  { id: "g-1", category: "Rooms", treatment: "harbor", caption: "Skyline King", alt: "Skyline King room" },
  { id: "g-2", category: "Rooms", treatment: "suite", caption: "Harbor Suite living area", alt: "Harbor Suite living area" },
  { id: "g-3", category: "Rooms", treatment: "terrace", caption: "Penthouse Terrace", alt: "Penthouse Terrace" },
  { id: "g-4", category: "Dining", treatment: "dawn", caption: "Morning service on the mezzanine", alt: "Dining mezzanine in morning light" },
  { id: "g-5", category: "Dining", treatment: "study", caption: "The harbor-facing bar", alt: "Hotel bar facing the harbor" },
  { id: "g-6", category: "Wellness", treatment: "terrace", caption: "Rooftop pool at dusk", alt: "Rooftop pool" },
  { id: "g-7", category: "Wellness", treatment: "dawn", caption: "Studio, before the first class", alt: "Wellness studio" },
  { id: "g-8", category: "Property", treatment: "harbor", caption: "The facade from the quay", alt: "Hotel facade" },
  { id: "g-9", category: "Property", treatment: "study", caption: "Courtyard garden", alt: "Courtyard garden" },
  { id: "g-10", category: "Experiences", treatment: "suite", caption: "Private dining, arranged on request", alt: "Private dining setup" },
  { id: "g-11", category: "Experiences", treatment: "dawn", caption: "Harbor walk, five minutes out", alt: "Harbor walk near the hotel" },
];

export const DEMO_TESTIMONIALS: Testimonial[] = [
  {
    id: "t-1",
    guestName: "Demo guest — M. Abara",
    stayContext: "Skyline King, 3 nights",
    quote:
      "Quiet in the way a good hotel should be — nothing asked of you, everything available if you wanted it.",
    isDemo: true,
  },
  {
    id: "t-2",
    guestName: "Demo guest — R. Lindqvist",
    stayContext: "Harbor Suite, business stay",
    quote:
      "Worked from the room most of the day and never felt like I was in a hotel room. The desk placement is doing real work there.",
    isDemo: true,
  },
  {
    id: "t-3",
    guestName: "Demo guest — S. Okafor",
    stayContext: "Penthouse Terrace, anniversary",
    quote: "The terrace at sunrise was worth the whole trip on its own.",
    isDemo: true,
  },
];

export const DEMO_EXPERIENCE_HIGHLIGHTS: ExperienceHighlight[] = [
  {
    id: "dining",
    category: "Dining",
    title: "A kitchen that keeps its own hours",
    body: "Breakfast runs long, past the point most hotels have packed it away. Dinner is small and seasonal — the same eight tables most nights, so the kitchen can actually know the room.",
  },
  {
    id: "wellness",
    category: "Wellness",
    title: "A pool that isn't an afterthought",
    body: "The rooftop pool stays open past sunset, and the studio downstairs runs an early class before the harbor traffic starts.",
  },
  {
    id: "events",
    category: "Events",
    title: "Small gatherings, done properly",
    body: "The mezzanine seats up to forty for a private dinner or a small ceremony — one event at a time, never stacked against a wedding two rooms over.",
  },
  {
    id: "business",
    category: "Business",
    title: "Built for a working stay",
    body: "Every room has a real desk, not a side table pressed into service. Two meeting rooms downstairs are available on request, no day-rate theatrics.",
  },
  {
    id: "local",
    category: "Local",
    title: "The harbor does most of the work",
    body: "Five minutes on foot to the harbor walk, a little further to the old town. The front desk keeps a running list of what's actually worth the walk this week.",
  },
];

export const DEMO_NEARBY_ATTRACTIONS: NearbyAttraction[] = [
  { name: "Harbor Walk", distance: "5 min walk", category: "Waterfront" },
  { name: "Old Town Market", distance: "12 min walk", category: "Shopping" },
  { name: "Portside Art Museum", distance: "8 min walk", category: "Culture" },
  { name: "Quay Ferry Terminal", distance: "6 min walk", category: "Transport" },
];
