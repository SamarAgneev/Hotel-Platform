/**
 * Content repository.
 *
 * Components and pages call these functions, never `demo-data.ts`
 * directly. Today they resolve from demo data; once RoomType/Promotion/
 * etc. exist in Postgres, these implementations move to Prisma queries
 * and nothing calling them needs to change. Kept `async` now for the
 * same reason — a real DB call is async, and callers already await it.
 */

import {
  DEMO_EXPERIENCE_HIGHLIGHTS,
  DEMO_GALLERY,
  DEMO_NAV_ITEMS,
  DEMO_NEARBY_ATTRACTIONS,
  DEMO_OFFERS,
  DEMO_ROOMS,
  DEMO_TESTIMONIALS,
} from "./demo-data";
import type {
  ExperienceHighlight,
  GalleryImage,
  NavItem,
  NearbyAttraction,
  Offer,
  Room,
  Testimonial,
} from "./types";

export async function getNavItems(): Promise<NavItem[]> {
  return DEMO_NAV_ITEMS;
}

export async function getRooms(): Promise<Room[]> {
  return DEMO_ROOMS;
}

export async function getRoomBySlug(slug: string): Promise<Room | null> {
  return DEMO_ROOMS.find((room) => room.slug === slug) ?? null;
}

export async function getRelatedRooms(excludeSlug: string, limit = 3): Promise<Room[]> {
  return DEMO_ROOMS.filter((room) => room.slug !== excludeSlug).slice(0, limit);
}

function isOfferActive(offer: Offer, now: Date): boolean {
  return new Date(offer.validFrom) <= now && now <= new Date(offer.validTo);
}

export async function getActiveOffers(): Promise<Offer[]> {
  const now = new Date();
  return DEMO_OFFERS.filter((offer) => isOfferActive(offer, now));
}

export async function getExpiredOffers(): Promise<Offer[]> {
  const now = new Date();
  return DEMO_OFFERS.filter((offer) => !isOfferActive(offer, now));
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  return DEMO_GALLERY;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return DEMO_TESTIMONIALS;
}

export async function getExperienceHighlights(): Promise<ExperienceHighlight[]> {
  return DEMO_EXPERIENCE_HIGHLIGHTS;
}

export async function getNearbyAttractions(): Promise<NearbyAttraction[]> {
  return DEMO_NEARBY_ATTRACTIONS;
}
