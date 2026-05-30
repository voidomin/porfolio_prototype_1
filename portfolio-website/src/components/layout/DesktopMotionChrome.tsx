"use client";

import { useReducedMotion } from "framer-motion";
import { ScrollProgress } from "@/components/animations/ScrollProgress";
import { StorybookCursor } from "@/components/layout/StorybookCursor";
import { useCoarsePointer } from "@/hooks/useCoarsePointer";

export const DesktopMotionChrome = () => {
  const prefersReducedMotion = useReducedMotion();
  const { mounted, isCoarsePointer } = useCoarsePointer();

  if (prefersReducedMotion || !mounted || isCoarsePointer) return null;

  return (
    <>
      <StorybookCursor />
      <ScrollProgress />
    </>
  );
};
