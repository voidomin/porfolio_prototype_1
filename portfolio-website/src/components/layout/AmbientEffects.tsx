"use client";

import { useReducedMotion } from "framer-motion";
import { NatureScene } from "@/components/animations/NatureScene";
import { BirdFlock } from "@/components/animations/BirdFlock";
import { FloatingLeaves } from "@/components/animations/FloatingLeaves";
import { InteractiveTrail } from "@/components/animations/InteractiveTrail";
import { SoundscapeManager } from "@/components/audio/SoundscapeManager";
import { useCoarsePointer } from "@/hooks/useCoarsePointer";

export const AmbientEffects = () => {
  const prefersReducedMotion = useReducedMotion();
  const { mounted, isCoarsePointer } = useCoarsePointer();

  if (prefersReducedMotion || !mounted) return null;

  if (isCoarsePointer) {
    return (
      <div className="nature-scene" aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#fef7e0_0%,#fdedb7_32%,#fbdf85_55%,#f5b3af_100%)]" />
        <div className="absolute inset-x-0 top-0 h-1/2 bg-[radial-gradient(ellipse_at_50%_20%,rgba(240,180,41,0.18),transparent_65%)]" />
      </div>
    );
  }

  return (
    <>
      <NatureScene />
      <BirdFlock />
      <FloatingLeaves />
      <InteractiveTrail />
      <SoundscapeManager />
    </>
  );
};
