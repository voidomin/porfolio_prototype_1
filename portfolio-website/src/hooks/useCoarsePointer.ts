"use client";

import { useEffect, useState } from "react";

export const useCoarsePointer = () => {
  const [mounted, setMounted] = useState(false);
  const [isCoarsePointer, setIsCoarsePointer] = useState(true);

  useEffect(() => {
    setMounted(true);

    const checkPointer = () => {
      const hasCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
      const hasTouchInput = navigator.maxTouchPoints > 0;
      setIsCoarsePointer(hasCoarsePointer || hasTouchInput);
    };

    checkPointer();
    window.addEventListener("resize", checkPointer, { passive: true });

    return () => window.removeEventListener("resize", checkPointer);
  }, []);

  return { mounted, isCoarsePointer };
};
