import type { Metadata } from "next";
import { Manrope, Fraunces, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { ScrollProgress } from "@/components/animations/ScrollProgress";
import { StorybookCursor } from "@/components/layout/StorybookCursor";

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
        <StorybookCursor />
        <SmoothScroll>
          <ScrollProgress />
          <div className="relative min-h-screen">{children}</div>
        </SmoothScroll>
      </body>
    </html>
  );
}
