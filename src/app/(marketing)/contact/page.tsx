import type { Metadata } from "next";
import { ContactForm } from "@/components/marketing/ContactForm";
import { WhatsAppCTA } from "@/components/marketing/WhatsAppCTA";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${siteConfig.hotelName}.`,
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-[var(--container-max)] px-6 py-16">
      <SectionHeading title="Contact" description="We usually reply within a few hours." />

      <div className="mt-10 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="text-sm font-medium text-text-primary">Phone</h2>
            <p className="mt-1 text-sm text-text-secondary">{siteConfig.contact.phone}</p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-text-primary">Email</h2>
            <p className="mt-1 text-sm text-text-secondary">{siteConfig.contact.email}</p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-text-primary">Address</h2>
            <p className="mt-1 text-sm text-text-secondary">{siteConfig.contact.address}</p>
          </div>
          <WhatsAppCTA message="Hi, I have a question about Royal Horizon Hotel." className="w-fit" />
        </div>

        <div>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
