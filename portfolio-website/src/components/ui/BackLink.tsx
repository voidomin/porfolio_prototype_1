import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface BackLinkProps {
  href: string;
  label: string;
  variant?: "ghost" | "glass";
  className?: string;
}

/** A "← back to X" link. `variant="ghost"` reproduces the plain-text style
 * already duplicated across `projects/[slug]`, `blog/[slug]`, and `overview`;
 * `variant="glass"` is a pill treatment for pages using the glass-panel look. */
export function BackLink({ href, label, variant = "ghost", className }: Readonly<BackLinkProps>) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2 text-sm font-semibold transition-colors",
        variant === "ghost" && "text-forest-700 hover:text-forest-900",
        variant === "glass" &&
          "px-4 py-2 rounded-full bg-white/50 backdrop-blur-md border border-stone-200/50 text-stone-700 hover:bg-white/80",
        className
      )}
    >
      <ArrowLeft className="w-4 h-4" />
      {label}
    </Link>
  );
}
