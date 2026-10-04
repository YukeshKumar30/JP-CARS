import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { business } from "@/config/business";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ToasterProvider } from "@/components/providers/toaster-provider";

export const metadata: Metadata = {
  title: {
    default: business.siteTitle,
    template: `%s | JP CARS`,
  },
  description: business.siteDescription,
  keywords: [
    "used cars Kallakurichi",
    "pre-owned cars Kallakurichi",
    "second hand cars Tamil Nadu",
    "JP CARS",
    "buy used car",
    "sell used car",
    "car dealership Kallakurichi",
  ],
  authors: [{ name: "JP CARS Kallakurichi" }],
  openGraph: {
    title: business.siteTitle,
    description: business.siteDescription,
    siteName: "JP CARS",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: business.siteTitle,
    description: business.siteDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F7F7F5" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0B0D" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider>
          <ToasterProvider />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
