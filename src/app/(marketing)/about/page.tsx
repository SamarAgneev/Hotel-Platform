import type { Metadata } from "next";
import { ExperienceSection } from "@/components/marketing/ExperienceSection";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { PlaceholderArt } from "@/components/marketing/PlaceholderArt";
import { getExperienceHighlights } from "@/domain/hotel/repository";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "About",
  description: `The story behind ${siteConfig.hotelName}.`,
};

export default async function AboutPage() {
  const highlights = await getExperienceHighlights();

  return (
    <div>
      <div className="mx-auto grid max-w-[var(--container-max)] gap-10 px-6 py-16 lg:grid-cols-2 lg:items-center">
        <div>
          <SectionHeading title="About Royal Horizon" />
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            Royal Horizon opened above the harbor with a simple brief: build the hotel we&apos;d
            actually want to stay in. That meant fewer, larger rooms rather than many small
            ones; a kitchen that cooks to a short seasonal list instead of a long static menu;
            and a front desk that&apos;s told to solve problems rather than escalate them.
          </p>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            This page uses demo content for a fictional property, built to demonstrate the
            platform&apos;s customer experience.
          </p>
        </div>
        <PlaceholderArt
          treatment="dawn"
          alt="Royal Horizon Hotel exterior at dawn"
          className="aspect-[4/3] w-full rounded-lg"
        />
      </div>

      <div className="border-t border-border-subtle">
        <ExperienceSection highlights={highlights} />
      </div>
    </div>
  );
}
