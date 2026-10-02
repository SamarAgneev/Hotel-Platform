"use client";

import { useMemo, useState } from "react";
import type { GalleryCategory, GalleryImage } from "@/domain/hotel/types";
import { PlaceholderArt } from "./PlaceholderArt";
import { Lightbox } from "./Lightbox";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils/cn";

const CATEGORIES: (GalleryCategory | "All")[] = [
  "All",
  "Rooms",
  "Dining",
  "Wellness",
  "Property",
  "Experiences",
];

export function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [category, setCategory] = useState<GalleryCategory | "All">("All");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const filtered = useMemo(
    () => (category === "All" ? images : images.filter((image) => image.category === category)),
    [images, category],
  );

  return (
    <div>
      <div role="group" aria-label="Filter gallery by category" className="flex flex-wrap gap-2">
        {CATEGORIES.map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={category === item}
            onClick={() => setCategory(item)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
              category === item
                ? "border-accent-primary bg-accent-primary text-text-on-accent"
                : "border-border-default text-text-secondary hover:bg-surface-sunken",
            )}
          >
            {item}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="No photos in this category yet"
            description="Try a different category, or check back soon."
          />
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className="group relative overflow-hidden rounded-md focus-visible:outline-none"
              aria-label={`Open photo: ${image.caption}`}
            >
              <PlaceholderArt
                treatment={image.treatment}
                alt={image.alt}
                caption={image.caption}
                className="aspect-square w-full transition-transform duration-300 group-hover:scale-105 group-focus-visible:scale-105"
              />
            </button>
          ))}
        </div>
      )}

      {activeIndex !== null && (
        <Lightbox
          images={filtered}
          activeIndex={activeIndex}
          onClose={() => setActiveIndex(null)}
          onNavigate={setActiveIndex}
        />
      )}
    </div>
  );
}
