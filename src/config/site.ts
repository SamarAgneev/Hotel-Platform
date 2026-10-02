/**
 * Tenant configuration boundary.
 *
 * Every hotel-specific value (name, contact info, branding, social links)
 * must be read from here — never inlined in a component or page. This file
 * is the seam that will later be replaced by a per-tenant DB record when
 * multi-hotel support ships; until then it reads from environment
 * variables with safe local defaults so the app runs without secrets.
 *
 * Components should import `siteConfig`, not process.env, directly.
 */

export interface SiteConfig {
  hotelName: string;
  tagline: string;
  description: string;
  contact: {
    phone: string;
    email: string;
    address: string;
    whatsappNumber?: string;
  };
  social: {
    instagram?: string;
    facebook?: string;
  };
  locale: string;
  currency: string;
  timezone: string;
  /** Marks demo/placeholder content so it can never be mistaken for real
   * hotel data once this becomes a real, deployed tenant. */
  isDemoContent: boolean;
}

function env(name: string, fallback: string): string {
  return process.env[name]?.trim() || fallback;
}

export const siteConfig: SiteConfig = {
  hotelName: env("NEXT_PUBLIC_HOTEL_NAME", "Royal Horizon Hotel"),
  tagline: env("NEXT_PUBLIC_HOTEL_TAGLINE", "The city, from a quieter altitude"),
  description: env(
    "NEXT_PUBLIC_HOTEL_DESCRIPTION",
    "A modern hotel above the harbor district — considered rooms, unhurried service, and a skyline that earns the view.",
  ),
  contact: {
    phone: env("NEXT_PUBLIC_HOTEL_PHONE", "+1 (555) 042-8800"),
    email: env("NEXT_PUBLIC_HOTEL_EMAIL", "stay@royalhorizon.example"),
    address: env("NEXT_PUBLIC_HOTEL_ADDRESS", "1 Horizon Quay, Harborview, Portside"),
    whatsappNumber: process.env.NEXT_PUBLIC_HOTEL_WHATSAPP || undefined,
  },
  social: {
    instagram: process.env.NEXT_PUBLIC_HOTEL_INSTAGRAM,
    facebook: process.env.NEXT_PUBLIC_HOTEL_FACEBOOK,
  },
  locale: env("NEXT_PUBLIC_DEFAULT_LOCALE", "en-US"),
  currency: env("NEXT_PUBLIC_DEFAULT_CURRENCY", "USD"),
  timezone: env("NEXT_PUBLIC_DEFAULT_TIMEZONE", "America/New_York"),
  isDemoContent: true,
};
