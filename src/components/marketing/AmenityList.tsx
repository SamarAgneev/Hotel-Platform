import type { RoomAmenity } from "@/domain/hotel/types";

export function AmenityList({ amenities }: { amenities: RoomAmenity[] }) {
  return (
    <ul className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
      {amenities.map((amenity) => (
        <li key={amenity.id} className="flex items-center gap-2 text-sm text-text-secondary">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent-primary" />
          {amenity.label}
        </li>
      ))}
    </ul>
  );
}
