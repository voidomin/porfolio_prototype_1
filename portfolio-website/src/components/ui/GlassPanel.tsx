import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassPanelProps {
  tone?: "light" | "dark";
  padding?: "none" | "sm" | "md" | "lg";
  as?: ElementType<{ className?: string; children?: ReactNode }>;
  className?: string;
  children: ReactNode;
}

const TONE_CLASSES: Record<NonNullable<GlassPanelProps["tone"]>, string> = {
  light: "bg-white/60 backdrop-blur-md border border-stone-200/50 shadow-sm",
  dark: "bg-stone-900/60 backdrop-blur-md border border-stone-850",
};

const PADDING_CLASSES: Record<NonNullable<GlassPanelProps["padding"]>, string> = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-6 md:p-8",
};

/**
 * The site's "glass panel" look — a translucent, blurred, bordered rounded
 * card — appears as hand-rolled inline Tailwind in a dozen+ places (most
 * literally, `bg-stone-900/60 backdrop-blur-md rounded-2xl border
 * border-stone-850` repeats verbatim 13x across the admin CMS page). This
 * gives new call sites a single place to reuse the exact same look.
 */
export function GlassPanel({
  tone = "light",
  padding = "md",
  as: Tag = "div",
  className,
  children,
}: Readonly<GlassPanelProps>) {
  return (
    <Tag className={cn("rounded-2xl", TONE_CLASSES[tone], PADDING_CLASSES[padding], className)}>
      {children}
    </Tag>
  );
}
