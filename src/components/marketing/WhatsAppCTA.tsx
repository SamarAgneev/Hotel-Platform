import Link from "next/link";
import { buildWhatsAppLink } from "@/lib/integrations/whatsapp";
import { cn } from "@/lib/utils/cn";

export interface WhatsAppCTAProps {
  message: string;
  label?: string;
  className?: string;
}

/**
 * A single reusable WhatsApp entry point used across room, offer, and
 * contact contexts — only the `message` changes per call site. Falls back
 * to the contact page rather than a broken `wa.me/undefined` link when no
 * number is configured for this tenant (see `lib/integrations/whatsapp`).
 */
export function WhatsAppCTA({ message, label = "Enquire on WhatsApp", className }: WhatsAppCTAProps) {
  const { isConfigured, href } = buildWhatsAppLink(message);

  return (
    <Link
      href={href}
      target={isConfigured ? "_blank" : undefined}
      rel={isConfigured ? "noopener noreferrer" : undefined}
      className={cn(
        "inline-flex h-11 items-center gap-2 rounded-md border border-border-default px-4 text-sm font-medium text-text-primary transition-colors hover:bg-surface-sunken",
        className,
      )}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-current">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.39 1.26 4.81L2 22l5.42-1.42a9.87 9.87 0 0 0 4.62 1.18h.01c5.46 0 9.9-4.45 9.9-9.91C21.95 6.45 17.5 2 12.04 2Zm5.8 14.02c-.24.68-1.4 1.3-1.93 1.34-.5.05-1.02.24-3.42-.71-2.9-1.15-4.76-4.1-4.9-4.29-.14-.19-1.17-1.56-1.17-2.97 0-1.41.74-2.1 1-2.39.26-.28.57-.35.76-.35.19 0 .38 0 .55.01.18.01.42-.07.65.5.24.58.81 2 .88 2.15.07.15.12.32.02.51-.1.19-.15.31-.3.48-.15.17-.31.38-.44.51-.15.15-.3.3-.13.6.17.29.77 1.27 1.65 2.06 1.14 1.01 2.1 1.33 2.4 1.48.29.15.46.13.63-.08.17-.2.72-.84.91-1.13.19-.29.38-.24.63-.14.26.1 1.65.78 1.93.92.29.15.48.22.55.34.07.13.07.72-.17 1.4Z" />
      </svg>
      {isConfigured ? label : "Contact us"}
    </Link>
  );
}
