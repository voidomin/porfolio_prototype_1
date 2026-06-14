"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll } from "framer-motion";

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
  const { scrollY } = useScroll();
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down");
  const [scrollYValue, setScrollYValue] = useState(0);
  const lastScrollY = useRef(0);

  useEffect(() => {
    return scrollY.on("change", (current) => {
      if (current > lastScrollY.current) setScrollDirection("down");
      else if (current < lastScrollY.current) setScrollDirection("up");
      setScrollYValue(current);
      lastScrollY.current = current;
    });
  }, [scrollY]);

  return { scrollDirection, scrollY: scrollYValue };
};

export const useScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    return scrollYProgress.on("change", (v) => setProgress(v * 100));
  }, [scrollYProgress]);

  return progress;
};
