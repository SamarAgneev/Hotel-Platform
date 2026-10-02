import type { ExperienceHighlight } from "@/domain/hotel/types";
import { SectionHeading } from "./SectionHeading";

export function ExperienceSection({ highlights }: { highlights: ExperienceHighlight[] }) {
  return (
    <section id="experience" className="mx-auto max-w-[var(--container-max)] px-6 py-20">
      <SectionHeading
        title="A hotel with more going on than the rooms"
        description="Five things worth knowing before you arrive."
      />
      <div className="mt-12 flex flex-col divide-y divide-[var(--border-subtle)]">
        {highlights.map((item, index) => (
          <div
            key={item.id}
            className="grid gap-4 py-8 sm:grid-cols-[auto_1fr] sm:gap-10"
          >
            <span className="font-display text-3xl text-accent-primary sm:w-16">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
                {item.category}
              </p>
              <h3 className="mt-1 text-xl text-text-primary">{item.title}</h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-secondary">
                {item.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
