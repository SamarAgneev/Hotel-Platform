import Link from "next/link";
import { Hero } from "@/components/marketing/Hero";
import { RoomCard } from "@/components/marketing/RoomCard";
import { OfferCard } from "@/components/marketing/OfferCard";
import { TestimonialCard } from "@/components/marketing/TestimonialCard";
import { ExperienceSection } from "@/components/marketing/ExperienceSection";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { HotelStructuredData } from "@/components/marketing/HotelStructuredData";
import {
  getActiveOffers,
  getExperienceHighlights,
  getRooms,
  getTestimonials,
} from "@/domain/hotel/repository";

export default async function HomePage() {
  const [rooms, offers, testimonials, highlights] = await Promise.all([
    getRooms(),
    getActiveOffers(),
    getTestimonials(),
    getExperienceHighlights(),
  ]);

  return (
    <>
      <HotelStructuredData />
      <Hero />

      <section className="mx-auto max-w-[var(--container-max)] px-6 py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            title="Rooms"
            description="Four room types, each built around a different way of staying."
          />
          <Link href="/rooms" className="text-sm font-medium text-accent-primary hover:underline">
            View all rooms →
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {rooms.map((room) => (
            <RoomCard key={room.slug} room={room} />
          ))}
        </div>
      </section>

      <ExperienceSection highlights={highlights} />

      {offers.length > 0 && (
        <section className="border-t border-border-subtle bg-surface-sunken">
          <div className="mx-auto max-w-[var(--container-max)] px-6 py-20">
            <SectionHeading title="Current offers" />
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {offers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-[var(--container-max)] px-6 py-20">
        <SectionHeading title="From recent stays" description="Demo guest feedback for this preview build." />
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </section>
    </>
  );
}
