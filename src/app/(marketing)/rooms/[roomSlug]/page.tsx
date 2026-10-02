import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { RoomGallery } from "@/components/marketing/RoomGallery";
import { AmenityList } from "@/components/marketing/AmenityList";
import { RoomCard } from "@/components/marketing/RoomCard";
import { WhatsAppCTA } from "@/components/marketing/WhatsAppCTA";
import { AvailabilitySearch } from "@/components/marketing/AvailabilitySearch";
import { formatPriceFromCents } from "@/lib/utils/format";
import { getRelatedRooms, getRoomBySlug, getRooms } from "@/domain/hotel/repository";

interface RoomPageProps {
  params: Promise<{ roomSlug: string }>;
}

export async function generateStaticParams() {
  const rooms = await getRooms();
  return rooms.map((room) => ({ roomSlug: room.slug }));
}

export async function generateMetadata({ params }: RoomPageProps): Promise<Metadata> {
  const { roomSlug } = await params;
  const room = await getRoomBySlug(roomSlug);
  if (!room) return { title: "Room not found" };
  return {
    title: room.name,
    description: room.shortDescription,
    openGraph: { title: room.name, description: room.shortDescription },
  };
}

export default async function RoomDetailPage({ params }: RoomPageProps) {
  const { roomSlug } = await params;
  const room = await getRoomBySlug(roomSlug);

  if (!room) {
    notFound();
  }

  const relatedRooms = await getRelatedRooms(room.slug);

  return (
    <div className="mx-auto max-w-[var(--container-max)] px-6 py-16">
      <nav aria-label="Breadcrumb" className="text-sm text-text-secondary">
        <Link href="/rooms" className="hover:text-text-primary">
          Rooms
        </Link>
        <span aria-hidden="true"> / </span>
        <span className="text-text-primary">{room.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.3fr_0.9fr]">
        <div>
          <RoomGallery images={room.images} />

          <h1 className="mt-8 text-3xl text-text-primary">{room.name}</h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-text-secondary">
            {room.description}
          </p>

          <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm text-text-secondary">
            <div>
              <dt className="text-xs uppercase tracking-wide">Occupancy</dt>
              <dd className="text-text-primary">{room.maxOccupancy} guests</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide">Bed</dt>
              <dd className="text-text-primary">{room.bedType}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide">Size</dt>
              <dd className="text-text-primary">{room.sizeSqm} m²</dd>
            </div>
          </dl>

          <div className="mt-8">
            <h2 className="text-lg text-text-primary">Amenities</h2>
            <div className="mt-3">
              <AmenityList amenities={room.amenities} />
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-lg text-text-primary">Policies</h2>
            <ul className="mt-3 flex flex-col gap-1.5">
              {room.policies.map((policy) => (
                <li key={policy} className="text-sm text-text-secondary">
                  {policy}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="h-fit rounded-lg border border-border-subtle bg-surface-raised p-6">
          <p className="text-sm text-text-secondary">From</p>
          <p className="text-2xl text-text-primary">
            {formatPriceFromCents(room.startingPriceCents, room.currency)}{" "}
            <span className="text-sm text-text-secondary">/ {room.priceUnit}</span>
          </p>
          <div className="mt-4">
            <AvailabilitySearch className="!flex-col !p-0 !shadow-none !border-none" />
          </div>
          <div className="mt-4">
            <WhatsAppCTA
              message={`Hi, I'd like to enquire about the ${room.name}.`}
              className="w-full justify-center"
            />
          </div>
        </aside>
      </div>

      {relatedRooms.length > 0 && (
        <section className="mt-16 border-t border-border-subtle pt-10">
          <h2 className="text-xl text-text-primary">You might also like</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedRooms.map((related) => (
              <RoomCard key={related.slug} room={related} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
