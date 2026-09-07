import type { Metadata, Viewport } from "next";
import { Manrope, Fraunces, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { ScrollProgress } from "@/components/animations/ScrollProgress";
import { StorybookCursor } from "@/components/layout/StorybookCursor";
import { ScrollProvider } from "@/contexts/ScrollContext";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { Analytics } from "@vercel/analytics/react";
import { ServiceWorkerRegister } from "@/components/pwa/ServiceWorkerRegister";
import { personalProfile, socialLinks, contactInfo } from "@/data/portfolio";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://akashportfolio.dev"),
  title: "Akash — Full-Stack & Data Science Engineer",
  description:
    "Portfolio of Akash featuring full-stack engineering, data science work, selected projects, and research contributions. A storytelling journey through nature.",
  keywords: [
    "portfolio",
    "full stack engineer",
    "data science engineer",
    "projects",
    "machine learning",
    "software development",
  ],
  authors: [{ name: "Akash" }],
  creator: "Akash",
  openGraph: {
    title: "Akash — Full-Stack & Data Science Engineer",
    description:
      "Portfolio featuring full-stack engineering work, data science experience, and selected product builds.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Akash — Full-Stack & Data Science Engineer",
    description:
      "Portfolio featuring full-stack engineering work, data science experience, and selected product builds.",
  },
  robots: {
    index: true,
    follow: true,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: personalProfile.name,
  },
};

export const viewport: Viewport = {
  themeColor: "#f0b429",
};

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://akashportfolio.dev").replace(
  /\/$/,
  ""
);

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      name: personalProfile.name,
      jobTitle: personalProfile.headline,
      url: siteUrl,
      email: contactInfo.email,
      address: {
        "@type": "PostalAddress",
        addressLocality: personalProfile.location,
      },
      sameAs: socialLinks.map((link) => link.url),
    },
    {
      "@type": "WebSite",
      name: `${personalProfile.name} — Portfolio`,
      url: siteUrl,
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${fraunces.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[9999] focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-white focus:text-stone-900 focus:rounded-lg focus:shadow-lg focus:font-semibold focus:text-sm"
        >
          Skip to main content
        </a>
        <LoadingScreen />
        <ScrollProvider>
          <StorybookCursor />
          <SmoothScroll>
            <ScrollProgress />
            <div className="relative min-h-screen">{children}</div>
          </SmoothScroll>
        </ScrollProvider>
        <CommandPalette />
        <Analytics />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
