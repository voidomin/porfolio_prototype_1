/* ──────────────────────────────────────────────────────────
   LeafShape – a small, hand-drawn closed-path leaf silhouette
   with a separate vein-line stroke, designed to read correctly
   as a solid filled shape at small sizes. Shared by
   FloatingLeaves.tsx (drifting particles) and SkillsSection.tsx
   (the vine-tip marker on each skill bar) — pulled out here after
   SkillsSection.tsx was found using lucide-react's outline-style
   Leaf icon forced into fill="currentColor", which rendered as an
   indistinct blob rather than a leaf: that icon's second path (the
   stem) is open/unclosed, so filling it auto-closes it into a
   stray wedge overlapping the main shape.
   ────────────────────────────────────────────────────────── */
export const LeafShape = ({ size, color }: { size: number; color: string }) => (
  <svg
    width={size}
    height={size * 1.3}
    viewBox="0 0 20 26"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M10,1 Q18,8 16,18 Q14,24 10,25 Q6,24 4,18 Q2,8 10,1 Z" fill={color} />
    <path d="M10,4 L10,22" stroke="rgba(255,255,255,0.3)" strokeWidth={0.5} />
    <path d="M10,10 Q7,8 5,10" stroke="rgba(255,255,255,0.2)" strokeWidth={0.4} fill="none" />
    <path d="M10,14 Q13,12 15,14" stroke="rgba(255,255,255,0.2)" strokeWidth={0.4} fill="none" />
  </svg>
);
