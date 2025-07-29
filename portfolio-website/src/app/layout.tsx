import type { Metadata } from "next";
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { ScrollProgress } from "@/components/animations/ScrollProgress";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Portfolio - Creative Developer & Designer",
  description:
    "A stunning portfolio showcasing creative projects, photography, and blog content with modern animations and interactive elements.",
  keywords: [
    "portfolio",
    "developer",
    "designer",
    "creative",
    "projects",
    "photography",
    "blog",
  ],
  authors: [{ name: "Portfolio Owner" }],
  creator: "Portfolio Owner",
  openGraph: {
    title: "Portfolio - Creative Developer & Designer",
    description:
      "A stunning portfolio showcasing creative projects, photography, and blog content with modern animations and interactive elements.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio - Creative Developer & Designer",
    description:
      "A stunning portfolio showcasing creative projects, photography, and blog content with modern animations and interactive elements.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <SmoothScroll>
            <ScrollProgress />
            <div className="relative min-h-screen">{children}</div>
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
