import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quick Overview | Akash",
  description:
    "A one-page summary of Akash's experience, skills, and selected work — built to be screened in 30 seconds or saved as a PDF.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function OverviewLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
