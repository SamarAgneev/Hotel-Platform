import type { Metadata } from "next";
import { GalleryGrid } from "@/components/marketing/GalleryGrid";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { getGalleryImages } from "@/domain/hotel/repository";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Rooms, dining, wellness, and the property at Royal Horizon Hotel.",
};

export default async function GalleryPage() {
  const images = await getGalleryImages();

  return (
    <div className="mx-auto max-w-[var(--container-max)] px-6 py-16">
      <SectionHeading title="Gallery" description="A look around, by category." />
      <div className="mt-8">
        <GalleryGrid images={images} />
      </div>
    </div>
  );
}
