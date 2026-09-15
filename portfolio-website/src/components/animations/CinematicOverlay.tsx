"use client";

/* ──────────────────────────────────────────────────────────
   CinematicOverlay – a fixed, page-wide vignette + film-grain
   texture sitting above section content and ambient particles
   but below top-level UI chrome (Command Palette, custom cursor,
   loading screen). Static (no per-frame animation), zero new
   asset weight — the grain is an inline SVG feTurbulence data
   URI rather than a shipped noise PNG. Kept deliberately subtle:
   the vignette only darkens the far edges (main content area is
   untouched, so it can't meaningfully affect text contrast) and
   the grain sits at a very low opacity.
   ────────────────────────────────────────────────────────── */

const GRAIN_DATA_URI =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180">
      <filter id="n">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.06 0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#n)" />
    </svg>`
  );

export const CinematicOverlay = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[76] pointer-events-none print:hidden"
      style={{
        background:
          `radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.18) 100%), ` +
          `url("${GRAIN_DATA_URI}")`,
        backgroundSize: "cover, 180px 180px",
      }}
    />
  );
};
