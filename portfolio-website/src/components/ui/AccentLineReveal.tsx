"use client";

import { motion } from "framer-motion";

interface AccentLineRevealProps {
  className?: string;
  widthClassName?: string;
}

/* ──────────────────────────────────────────────────────────
   AccentLineReveal – a thin horizontal line that grows in from
   the center (scaleX 0 → 1) the moment its chapter scrolls into
   view. Used ahead of a section heading to give that chapter a
   "wipe into light" / editorial-divider feel, distinct from the
   plain fade-up used elsewhere. Transform-only, cheap.
   ────────────────────────────────────────────────────────── */

export const AccentLineReveal = ({
  className = "bg-current",
  widthClassName = "w-16",
}: AccentLineRevealProps) => {
  return (
    <motion.div
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`h-[2px] mx-auto mb-4 origin-center ${widthClassName} ${className}`}
    />
  );
};
