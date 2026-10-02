import type { Metadata } from "next";
import { LocationSection } from "@/components/marketing/LocationSection";
import { getNearbyAttractions } from "@/domain/hotel/repository";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Location",
  description: `Find ${siteConfig.hotelName} and what's nearby.`,
};

export default async function LocationPage() {
  const attractions = await getNearbyAttractions();

  return (
    <div className="py-6">
      <LocationSection attractions={attractions} />
    </div>
  );
}
