"use client";

import { useEffect, useRef } from "react";
import { useScroll, useTransform, MotionValue } from "framer-motion";

export const useParallax = (distance: number = 50) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-distance, distance]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return { ref, y, opacity };
};

export const useMouseParallax = (strength: number = 0.1) => {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const rafId = useRef<number>();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      mouseX.current = (e.clientX - centerX) * strength;
      mouseY.current = (e.clientY - centerY) * strength;

      const animate = () => {
        if (ref.current) {
          ref.current.style.transform = `translate3d(${mouseX.current}px, ${mouseY.current}px, 0)`;
        }
      };

      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
      rafId.current = requestAnimationFrame(animate);
    };

    const handleMouseLeave = () => {
      if (ref.current) {
        ref.current.style.transform = "translate3d(0, 0, 0)";
      }
    };

    const element = ref.current;
    if (element) {
      element.addEventListener("mousemove", handleMouseMove);
      element.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        element.removeEventListener("mousemove", handleMouseMove);
        element.removeEventListener("mouseleave", handleMouseLeave);
        if (rafId.current) {
          cancelAnimationFrame(rafId.current);
        }
      };
    }
  }, [strength]);

  return ref;
};

export const useScrollParallax = (speed: number = 0.5) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;

      const scrolled = window.pageYOffset;
      const parallax = scrolled * speed;

      ref.current.style.transform = `translate3d(0, ${parallax}px, 0)`;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);

  return ref;
};

export const useMultiLayerParallax = (
  layers: number[],
  containerRef?: React.RefObject<HTMLElement>
) => {
  const elementRefs = useRef<(HTMLElement | null)[]>(
    new Array(layers.length).fill(null)
  );

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const container = containerRef?.current;

      elementRefs.current.forEach((element, index) => {
        if (element) {
          let parallaxValue = scrolled * layers[index];

          // If container is provided, calculate relative to container position
          if (container) {
            const containerRect = container.getBoundingClientRect();
            const containerTop = containerRect.top + scrolled;
            const relativeScroll = Math.max(0, scrolled - containerTop);
            parallaxValue = relativeScroll * layers[index];
          }

          element.style.transform = `translate3d(0, ${parallaxValue}px, 0)`;
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [layers, containerRef]);

  const setElementRef = (index: number) => (element: HTMLElement | null) => {
    elementRefs.current[index] = element;
  };

  return { setElementRef };
};

export const useGyroscopeParallax = (sensitivity: number = 0.1) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
      if (!ref.current || !event.gamma || !event.beta) return;

      const x = (event.gamma / 90) * sensitivity * 100;
      const y = (event.beta / 90) * sensitivity * 100;

      ref.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    // Check if device orientation is supported
    if (window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", handleDeviceOrientation);

      return () => {
        window.removeEventListener(
          "deviceorientation",
          handleDeviceOrientation
        );
      };
    }
  }, [sensitivity]);

  return ref;
};

export const useInfiniteParallax = (
  speed: number = 1,
  direction: "horizontal" | "vertical" = "horizontal"
) => {
  const ref = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    let position = 0;

    const animate = () => {
      if (ref.current) {
        position += speed;

        if (direction === "horizontal") {
          ref.current.style.transform = `translateX(${position}px)`;
        } else {
          ref.current.style.transform = `translateY(${position}px)`;
        }

        // Reset position when it goes beyond a certain threshold
        const threshold =
          direction === "horizontal"
            ? ref.current.offsetWidth
            : ref.current.offsetHeight;

        if (Math.abs(position) > threshold) {
          position = 0;
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [speed, direction]);

  return ref;
};
