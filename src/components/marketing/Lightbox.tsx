"use client";

import { useEffect, useRef } from "react";
import type { GalleryImage } from "@/domain/hotel/types";
import { PlaceholderArt } from "./PlaceholderArt";

export interface LightboxProps {
  images: GalleryImage[];
  activeIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function Lightbox({ images, activeIndex, onClose, onNavigate }: LightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const image = images[activeIndex];

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === "ArrowRight") onNavigate((activeIndex + 1) % images.length);
      if (event.key === "ArrowLeft") onNavigate((activeIndex - 1 + images.length) % images.length);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeIndex, images.length, onNavigate]);

  if (!image) return null;

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onCancel={onClose}
      aria-label={`${image.caption} — photo ${activeIndex + 1} of ${images.length}`}
      className="w-full max-w-3xl border-none bg-transparent p-0 backdrop:bg-black/80"
    >
      <div className="relative rounded-lg bg-surface-raised p-4">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close gallery"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60"
        >
          ✕
        </button>
        <PlaceholderArt
          treatment={image.treatment}
          alt={image.alt}
          className="aspect-[4/3] w-full rounded-md"
          caption={image.caption}
        />
        <div className="mt-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onNavigate((activeIndex - 1 + images.length) % images.length)}
            className="rounded-md border border-border-default px-3 py-1.5 text-sm text-text-primary hover:bg-surface-sunken"
          >
            ← Previous
          </button>
          <p className="text-sm text-text-secondary">
            {activeIndex + 1} / {images.length}
          </p>
          <button
            type="button"
            onClick={() => onNavigate((activeIndex + 1) % images.length)}
            className="rounded-md border border-border-default px-3 py-1.5 text-sm text-text-primary hover:bg-surface-sunken"
          >
            Next →
          </button>
        </div>
      </div>
    </dialog>
  );
}
