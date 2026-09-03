import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Photography — Golden Hour | Akash",
  description:
    "A landscape and travel photography gallery — mountains, dawn light, and moments captured along the trail.",
  openGraph: {
    title: "Photography — Golden Hour | Akash",
    description:
      "A landscape and travel photography gallery — mountains, dawn light, and moments captured along the trail.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Photography — Golden Hour | Akash",
    description:
      "A landscape and travel photography gallery — mountains, dawn light, and moments captured along the trail.",
  },
};

export default function PhotographyLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
