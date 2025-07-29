# Implementation Guide & Code Patterns

## 🚀 Project Setup & Configuration

### Package.json Dependencies

```json
{
  "name": "portfolio-website",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.0.0",
    "framer-motion": "^10.16.0",
    "gsap": "^3.12.0",
    "@studio-freight/lenis": "^1.0.0",
    "tailwindcss": "^3.3.0",
    "next-themes": "^0.2.1",
    "react-hook-form": "^7.47.0",
    "zod": "^3.22.0",
    "@hookform/resolvers": "^3.3.0",
    "react-intersection-observer": "^9.5.0",
    "photoswipe": "^5.4.0",
    "react-masonry-css": "^1.0.16",
    "lucide-react": "^0.292.0",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-switch": "^1.0.3",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.8.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "eslint": "^8.52.0",
    "eslint-config-next": "^14.0.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

### Next.js Configuration (next.config.js)

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ["images.unsplash.com", "via.placeholder.com"],
    formats: ["image/webp", "image/avif"],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      use: ["raw-loader", "glslify-loader"],
    });
    return config;
  },
};

module.exports = nextConfig;
```

### Tailwind Configuration (tailwind.config.js)

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f9ff",
          500: "#3b82f6",
          900: "#1e3a8a",
        },
        accent: {
          50: "#fdf4ff",
          500: "#a855f7",
          900: "#581c87",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Playfair Display", "serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        "fade-in-up": "fadeInUp 0.6s ease-out",
        "fade-in-down": "fadeInDown 0.6s ease-out",
        "slide-in-right": "slideInRight 0.6s ease-out",
        "bounce-slow": "bounce 2s infinite",
        "pulse-slow": "pulse 3s infinite",
        "gradient-x": "gradient-x 15s ease infinite",
        "gradient-y": "gradient-y 15s ease infinite",
        "gradient-xy": "gradient-xy 15s ease infinite",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInDown: {
          "0%": { opacity: "0", transform: "translateY(-30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "gradient-y": {
          "0%, 100%": {
            "background-size": "400% 400%",
            "background-position": "center top",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "center center",
          },
        },
        "gradient-x": {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
        "gradient-xy": {
          "0%, 100%": {
            "background-size": "400% 400%",
            "background-position": "left center",
          },
          "25%": {
            "background-size": "400% 400%",
            "background-position": "left top",
          },
          "50%": {
            "background-size": "400% 400%",
            "background-position": "right top",
          },
          "75%": {
            "background-size": "400% 400%",
            "background-position": "right center",
          },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/forms")],
};
```

## 🎨 Core Animation Hooks

### useGSAP Hook

```typescript
// hooks/useGSAP.ts
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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

// Usage example
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
```

### useIntersectionObserver Hook

```typescript
// hooks/useIntersectionObserver.ts
import { useEffect, useRef, useState } from "react";

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
```

### useParallax Hook

```typescript
// hooks/useParallax.ts
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
```

## 🎭 Animation Components

### AnimatedText Component

```typescript
// components/animations/AnimatedText.tsx
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  variant?: "fadeInUp" | "typewriter" | "reveal";
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  className = "",
  delay = 0,
  duration = 0.6,
  variant = "fadeInUp",
}) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  // Typewriter effect
  useEffect(() => {
    if (variant === "typewriter") {
      const timer = setTimeout(() => {
        if (currentIndex < text.length) {
          setDisplayText(text.slice(0, currentIndex + 1));
          setCurrentIndex(currentIndex + 1);
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, variant]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay,
        staggerChildren: 0.05,
        delayChildren: delay,
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration },
    },
  };

  if (variant === "typewriter") {
    return (
      <motion.div
        className={className}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay }}
      >
        {displayText}
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          |
        </motion.span>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {text.split("").map((char, index) => (
        <motion.span key={index} variants={childVariants}>
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.div>
  );
};
```

### ScrollProgress Component

```typescript
// components/animations/ScrollProgress.tsx
import { motion, useScroll, useSpring } from "framer-motion";

interface ScrollProgressProps {
  className?: string;
  color?: string;
}

export const ScrollProgress: React.FC<ScrollProgressProps> = ({
  className = "",
  color = "bg-primary-500",
}) => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className={`fixed top-0 left-0 right-0 h-1 ${color} origin-left z-50 ${className}`}
      style={{ scaleX }}
    />
  );
};
```

### ParticleBackground Component

```typescript
// components/animations/ParticleBackground.tsx
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

interface ParticleBackgroundProps {
  particleCount?: number;
  particleColor?: string;
  connectionDistance?: number;
  speed?: number;
}

export const ParticleBackground: React.FC<ParticleBackgroundProps> = ({
  particleCount = 50,
  particleColor = "#3b82f6",
  connectionDistance = 150,
  speed = 0.5,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const initParticles = () => {
      particlesRef.current = Array.from({ length: particleCount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.2,
      }));
    };

    const updateParticles = () => {
      particlesRef.current.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Mouse interaction
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          particle.x -= dx * 0.01;
          particle.y -= dy * 0.01;
        }
      });
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      particlesRef.current.forEach((particle, i) => {
        particlesRef.current.slice(i + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            ctx.beginPath();
            ctx.strokeStyle = `${particleColor}${Math.floor(
              (1 - distance / connectionDistance) * 255
            ).toString(16)}`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
          }
        });
      });

      // Draw particles
      particlesRef.current.forEach((particle) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `${particleColor}${Math.floor(particle.opacity * 255)
          .toString(16)
          .padStart(2, "0")}`;
        ctx.fill();
      });
    };

    const animate = () => {
      updateParticles();
      drawParticles();
      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    resizeCanvas();
    initParticles();
    animate();

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [particleCount, particleColor, connectionDistance, speed]);

  return (
    <motion.canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    />
  );
};
```

## 🎯 Layout Components

### AnimatedLayout Component

```typescript
// components/layout/AnimatedLayout.tsx
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { ReactNode } from "react";

interface AnimatedLayoutProps {
  children: ReactNode;
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: {
      duration: 0.3,
      ease: "easeIn",
    },
  },
};

export const AnimatedLayout: React.FC<AnimatedLayoutProps> = ({ children }) => {
  const router = useRouter();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={router.asPath}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="min-h-screen"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
```

### SmoothScroll Component

```typescript
// components/layout/SmoothScroll.tsx
import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";

export const SmoothScroll: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: "vertical",
      gestureDirection: "vertical",
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
};
```

## 🎨 Utility Functions

### Animation Utilities

```typescript
// lib/animations.ts
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
};
```

### Performance Utilities

```typescript
// lib/performance.ts
export const prefersReducedMotion = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastExecTime = 0;

  return (...args: Parameters<T>) => {
    const currentTime = Date.now();

    if (currentTime - lastExecTime > delay) {
      func(...args);
      lastExecTime = currentTime;
    } else {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Intersection Observer with performance optimization
export const createOptimizedObserver = (
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
) => {
  const defaultOptions: IntersectionObserverInit = {
    rootMargin: "50px",
    threshold: 0.1,
    ...options,
  };

  return new IntersectionObserver(throttle(callback, 100), defaultOptions);
};
```

This implementation guide provides the foundation for building a high-performance, visually stunning portfolio website with modern animations and interactions. Each component is optimized for performance while delivering exceptional visual impact.
