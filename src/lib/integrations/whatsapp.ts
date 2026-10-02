import { siteConfig } from "@/config/site";

export interface WhatsAppLinkResult {
  isConfigured: boolean;
  href: string;
}

/**
 * Builds a wa.me deep link with a pre-filled, contextual message.
 * Falls back to the hotel's contact page (never a broken `wa.me/undefined`
 * link) when no WhatsApp number is configured for this tenant.
 */
export function buildWhatsAppLink(message: string): WhatsAppLinkResult {
  const number = siteConfig.contact.whatsappNumber;
  if (!number) {
    return { isConfigured: false, href: "/contact" };
  }
  const encoded = encodeURIComponent(message);
  return { isConfigured: true, href: `https://wa.me/${number}?text=${encoded}` };
}
