"use client";

import { createContext, useContext } from "react";
import { useScroll, MotionValue } from "framer-motion";

interface ScrollContextType {
  scrollY: MotionValue<number>;
  scrollYProgress: MotionValue<number>;
}

const ScrollContext = createContext<ScrollContextType | null>(null);

export const ScrollProvider = ({ children }: { children: React.ReactNode }) => {
  const { scrollY, scrollYProgress } = useScroll();
  return (
    <ScrollContext.Provider value={{ scrollY, scrollYProgress }}>{children}</ScrollContext.Provider>
  );
};

export const useScrollContext = () => {
  const ctx = useContext(ScrollContext);
  if (!ctx) throw new Error("useScrollContext must be used within ScrollProvider");
  return ctx;
};
