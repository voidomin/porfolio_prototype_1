import { Variants } from "framer-motion";

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -60 },
};

export const fadeInDown: Variants = {
  initial: { opacity: 0, y: -60 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 60 },
};

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
};

export const slideInRight: Variants = {
  initial: { opacity: 0, x: 100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -100 },
};

export const slideInLeft: Variants = {
  initial: { opacity: 0, x: -100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 100 },
};

export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

export const createStaggerVariants = (delay: number = 0.1): Variants => ({
  animate: {
    transition: {
      staggerChildren: delay,
    },
  },
});

// GSAP Animation Presets
export const gsapPresets = {
  fadeInUp: {
    from: { opacity: 0, y: 50 },
    to: { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
  },
  slideInLeft: {
    from: { opacity: 0, x: -100 },
    to: { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" },
  },
  scaleIn: {
    from: { opacity: 0, scale: 0.8 },
    to: { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)" },
  },
  textReveal: {
    from: { opacity: 0, y: 100, rotationX: -90 },
    to: { opacity: 1, y: 0, rotationX: 0, duration: 1, ease: "power3.out" },
  },
  imageZoom: {
    from: { scale: 1.2, opacity: 0 },
    to: { scale: 1, opacity: 1, duration: 1.2, ease: "power2.out" },
  },
};

// Transition configurations
export const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5,
};

export const modalTransition = {
  type: "spring",
  damping: 25,
  stiffness: 500,
};

export const hoverTransition = {
  type: "spring",
  damping: 20,
  stiffness: 300,
};

// Animation timing functions
export const easings = {
  easeInOut: [0.4, 0, 0.2, 1],
  easeOut: [0, 0, 0.2, 1],
  easeIn: [0.4, 0, 1, 1],
  bounce: [0.68, -0.55, 0.265, 1.55],
};

// Scroll-triggered animation configurations
export const scrollAnimationConfig = {
  threshold: 0.1,
  rootMargin: "0px 0px -100px 0px",
  triggerOnce: true,
};
