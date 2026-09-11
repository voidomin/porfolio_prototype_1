"use client";

import { useEffect, useState } from "react";

/* ──────────────────────────────────────────────────────────
   useIsDesktopPointer – true when the viewport is at least
   minWidth AND the primary input is a fine pointer (mouse/
   trackpad). Replaces raw `window.innerWidth >= X` checks,
   which wrongly treat any wide touch device (tablets, phones
   in landscape) as "desktop" and hand it mouse-only
   interactions (hover-only affordances, continuous cursor-
   parallax loops) it can never properly trigger.
   ────────────────────────────────────────────────────────── */
export function useIsDesktopPointer(minWidth: number): boolean {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${minWidth}px) and (pointer: fine)`);
    const update = () => setIsDesktop(mql.matches);

    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [minWidth]);

  return isDesktop;
}
