import type { Testimonial } from "@/domain/hotel/types";

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="flex h-full flex-col justify-between rounded-lg border border-border-subtle bg-surface-raised p-6">
      <blockquote className="text-base leading-relaxed text-text-primary">
        “{testimonial.quote}”
      </blockquote>
      <figcaption className="mt-4 text-sm text-text-secondary">
        <span className="font-medium text-text-primary">{testimonial.guestName}</span>
        <span aria-hidden="true"> · </span>
        {testimonial.stayContext}
      </figcaption>
    </figure>
  );
}
