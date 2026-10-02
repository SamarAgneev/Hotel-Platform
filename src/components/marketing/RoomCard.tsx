import Link from "next/link";
import type { Room } from "@/domain/hotel/types";
import { formatPriceFromCents } from "@/lib/utils/format";
import { PlaceholderArt } from "./PlaceholderArt";

export interface RoomCardProps {
  room: Room;
}

export function RoomCard({ room }: RoomCardProps) {
  const cover = room.images[0];

  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-border-subtle bg-surface-raised transition-shadow hover:shadow-md">
      <Link href={`/rooms/${room.slug}`} className="block">
        <PlaceholderArt
          treatment={cover.treatment}
          alt={cover.alt}
          className="aspect-[4/3] w-full transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="text-lg text-text-primary">
            <Link href={`/rooms/${room.slug}`} className="hover:underline">
              {room.name}
            </Link>
          </h3>
          <p className="mt-1 text-sm text-text-secondary">{room.shortDescription}</p>
        </div>

        <dl className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-secondary">
          <div className="flex items-center gap-1">
            <dt className="sr-only">Occupancy</dt>
            <dd>{room.maxOccupancy} Guests</dd>
          </div>
          <div className="flex items-center gap-1">
            <dt className="sr-only">Bed type</dt>
            <dd>{room.bedType}</dd>
          </div>
          <div className="flex items-center gap-1">
            <dt className="sr-only">Room size</dt>
            <dd>{room.sizeSqm} m²</dd>
          </div>
        </dl>

        <ul className="flex flex-wrap gap-1.5">
          {room.amenities.slice(0, 3).map((amenity) => (
            <li
              key={amenity.id}
              className="rounded-full bg-surface-sunken px-2.5 py-1 text-xs text-text-secondary"
            >
              {amenity.label}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-end justify-between pt-3">
          <p className="text-sm text-text-secondary">
            From{" "}
            <span className="text-base font-semibold text-text-primary">
              {formatPriceFromCents(room.startingPriceCents, room.currency)}
            </span>{" "}
            / {room.priceUnit}
          </p>
          <Link
            href={`/rooms/${room.slug}`}
            className="inline-flex h-9 items-center rounded-md border border-border-default px-3 text-sm font-medium text-text-primary transition-colors hover:bg-surface-sunken"
          >
            View room
          </Link>
        </div>
      </div>
    </article>
  );
}
