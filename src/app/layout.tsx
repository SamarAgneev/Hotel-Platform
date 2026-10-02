import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { ToastProvider } from "@/components/ui/Toast";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: siteConfig.hotelName,
    template: `%s · ${siteConfig.hotelName}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.hotelName,
    description: siteConfig.description,
    siteName: siteConfig.hotelName,
    locale: siteConfig.locale,
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
