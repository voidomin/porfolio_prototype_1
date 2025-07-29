"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const useGSAP = (
  callback: (context: gsap.Context) => void,
  dependencies: any[] = []
) => {
  const contextRef = useRef<gsap.Context>();

  useEffect(() => {
    contextRef.current = gsap.context(callback);
    return () => contextRef.current?.revert();
  }, dependencies);

  return contextRef.current;
};

export const useScrollAnimation = (trigger: string, animation: any) => {
  useGSAP(() => {
    gsap.fromTo(
      trigger,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      }
    );
  });
};

export const useTextReveal = (selector: string, options?: any) => {
  useGSAP(() => {
    const elements = document.querySelectorAll(selector);

    elements.forEach((element) => {
      const text = element.textContent || "";
      const chars = text.split("");

      element.innerHTML = chars
        .map(
          (char) =>
            `<span class="char">${char === " " ? "&nbsp;" : char}</span>`
        )
        .join("");

      gsap.fromTo(
        element.querySelectorAll(".char"),
        { opacity: 0, y: 100, rotationX: -90 },
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          duration: 0.8,
          stagger: 0.02,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 80%",
            toggleActions: "play none none reverse",
            ...options,
          },
        }
      );
    });
  });
};

export const useParallaxEffect = (selector: string, speed: number = 0.5) => {
  useGSAP(() => {
    const elements = document.querySelectorAll(selector);

    elements.forEach((element) => {
      gsap.to(element, {
        yPercent: -50 * speed,
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });
  });
};

export const useStaggerAnimation = (
  selector: string,
  animationProps: any,
  staggerDelay: number = 0.1
) => {
  useGSAP(() => {
    gsap.fromTo(selector, animationProps.from, {
      ...animationProps.to,
      stagger: staggerDelay,
      scrollTrigger: {
        trigger: selector,
        start: "top 80%",
        toggleActions: "play none none reverse",
        ...animationProps.scrollTrigger,
      },
    });
  });
};
