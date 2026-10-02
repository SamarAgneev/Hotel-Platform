import type { ContactFormInput } from "@/lib/validation/contact";

/**
 * Contact form integration boundary.
 *
 * No email provider is connected yet (see README "not implemented yet").
 * This throws rather than silently "succeeding", so the ContactForm's
 * error state is exercised honestly instead of the form lying about
 * having sent something. Swap the body for a real provider call
 * (Resend, etc.) or a `Notification`/`AuditLog` write later — the
 * function signature and the form's calling code stay the same.
 */
export async function submitContactEnquiry(input: ContactFormInput): Promise<never> {
  void input;
  throw new Error(
    "Contact form submission isn't connected to a backend yet. This is expected in the current build.",
  );
}
