"use client";

import { useState } from "react";
import type { RoomImage } from "@/domain/hotel/types";
import { PlaceholderArt } from "./PlaceholderArt";
import { cn } from "@/lib/utils/cn";

export function RoomGallery({ images }: { images: RoomImage[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex];

  return (
    <div className="flex flex-col gap-2">
      <PlaceholderArt
        treatment={active.treatment}
        alt={active.alt}
        className="aspect-[4/3] w-full rounded-lg sm:aspect-[16/10]"
      />
      <div role="tablist" aria-label="Room photos" className="flex gap-2">
        {images.map((image, index) => (
          <button
            key={image.id}
            role="tab"
            type="button"
            aria-selected={index === activeIndex}
            aria-label={image.alt}
            onClick={() => setActiveIndex(index)}
            className={cn(
              "h-16 w-20 shrink-0 overflow-hidden rounded-md ring-offset-2 transition-shadow",
              index === activeIndex ? "ring-2 ring-[var(--focus-ring)]" : "opacity-70 hover:opacity-100",
            )}
          >
            <PlaceholderArt treatment={image.treatment} alt="" className="h-full w-full" />
          </button>
        ))}
      </div>
    </div>
  );
}
