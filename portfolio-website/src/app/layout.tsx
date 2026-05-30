import type { Metadata } from "next";
import { Manrope, Fraunces, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { DesktopMotionChrome } from "@/components/layout/DesktopMotionChrome";

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

const siteUrl = (() => {
  const configuredUrl =
    process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL;

  if (!configuredUrl) {
    return new URL("http://localhost:3000");
  }

  return new URL(
    configuredUrl.startsWith("http")
      ? configuredUrl
      : `https://${configuredUrl}`,
  );
})();

export const metadata: Metadata = {
  metadataBase: siteUrl,
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
        <SmoothScroll>
          <DesktopMotionChrome />
          <div className="relative min-h-screen">{children}</div>
        </SmoothScroll>
      </body>
    </html>
  );
}
