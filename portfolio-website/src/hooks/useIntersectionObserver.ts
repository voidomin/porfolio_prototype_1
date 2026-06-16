"use client";

import { useEffect, useRef, useState } from "react";
import { useScrollContext } from "@/contexts/ScrollContext";

interface UseIntersectionObserverProps {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export const useIntersectionObserver = ({
  threshold = 0.1,
  rootMargin = "0px",
  triggerOnce = true,
}: UseIntersectionObserverProps = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting;

        if (isElementIntersecting && !hasTriggered) {
          setIsIntersecting(true);
          if (triggerOnce) {
            setHasTriggered(true);
          }
        } else if (!triggerOnce) {
          setIsIntersecting(isElementIntersecting);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce, hasTriggered]);

  return { elementRef, isIntersecting };
};


export const useScrollDirection = () => {
  const { scrollY } = useScrollContext();
  // Only re-render when crossing the threshold Navbar actually cares about
  const [scrollYValue, setScrollYValue] = useState(0);
  const prevHasScrolled = useRef(false);

  useEffect(() => {
    return scrollY.on("change", (current) => {
      const hasScrolled = current > 50;
      if (hasScrolled !== prevHasScrolled.current) {
        prevHasScrolled.current = hasScrolled;
        setScrollYValue(current);
      }
    });
  }, [scrollY]);

  return { scrollY: scrollYValue };
};

export const useScrollProgress = () => {
  const { scrollYProgress } = useScrollContext();
  const [progress, setProgress] = useState(0);
  const prevProgress = useRef(0);

  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      const next = v * 100;
      // Throttle to 0.5% increments — still smooth for the HUD, avoids 60fps re-renders
      if (Math.abs(next - prevProgress.current) >= 0.5) {
        prevProgress.current = next;
        setProgress(next);
      }
    });
  }, [scrollYProgress]);

  return progress;
};
