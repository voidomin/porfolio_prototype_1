"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll } from "framer-motion";

/* ──────────────────────────────────────────────────────────
   InteractiveTrail – A low-overhead full-screen canvas trail.
   Emits premium, subtle, low-density micro-particles:
   - Dawn / Forest (< 0.35 scroll): Small drifting green leaves
   - Meadow / River (0.35 - 0.7 scroll): Warm golden pollen dust
   - Contact / Night (>= 0.7 scroll): Rising orange campfire embers
   ────────────────────────────────────────────────────────── */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  type: "leaf" | "pollen" | "ember";
}

export const InteractiveTrail = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { scrollYProgress } = useScroll();
  const [scrollProgress, setScrollProgress] = useState(0);
  const mousePos = useRef({ x: 0, y: 0, lastX: 0, lastY: 0, active: false });
  const particles = useRef<Particle[]>([]);
  const lastGustTime = useRef(0);

  // Update current scroll progress state for particle spawning
  useEffect(() => {
    return scrollYProgress.on("change", (v) => setScrollProgress(v));
  }, [scrollYProgress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Setup high-DPI canvas resolution
    const resizeCanvas = () => {
      const dpr = globalThis.devicePixelRatio || 1;
      canvas.width = globalThis.innerWidth * dpr;
      canvas.height = globalThis.innerHeight * dpr;
      canvas.style.width = `${globalThis.innerWidth}px`;
      canvas.style.height = `${globalThis.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    globalThis.addEventListener("resize", resizeCanvas);

    // Track mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.lastX = mousePos.current.x;
      mousePos.current.lastY = mousePos.current.y;
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
      mousePos.current.active = true;

      // Calculate travel distance to prevent spawning if mouse isn't moving
      const dx = mousePos.current.x - mousePos.current.lastX;
      const dy = mousePos.current.y - mousePos.current.lastY;
      const speed = Math.hypot(dx, dy);

      // Detect swipe/gust gesture (high-velocity mouse drag)
      if (speed > 35) {
        // Calculate dynamic direction vector normalized
        const normX = dx / speed;
        const normY = dy / speed;

        globalThis.dispatchEvent(
          new CustomEvent("nature-wind-gust", {
            detail: { vx: normX * 14, vy: normY * 14 },
          }),
        );
      }

      // Spawn exactly ONE micro-particle only on significant move, max active particles capped at 20
      if (speed > 4 && particles.current.length < 25) {
        let type: "leaf" | "pollen" | "ember" = "leaf";
        let color = "rgba(120, 180, 80, 0.7)"; // Leaf green

        if (scrollProgress >= 0.35 && scrollProgress < 0.7) {
          type = "pollen";
          color = "rgba(250, 195, 50, 0.85)"; // Pollen gold/amber shimmer
        } else if (scrollProgress >= 0.7) {
          type = "ember";
          color = "rgba(255, 95, 30, 0.95)"; // Fast, hot campfire orange
        }

        // Deconstruct physics attributes cleanly to resolve cognitive complexity & nested ternary warnings
        let vx = (Math.random() - 0.5) * 0.8;
        let vy = Math.random() * 0.5 + 0.2; // Leaf default
        let size = Math.random() * 4 + 4; // Leaf default
        let decay = 0.012; // Leaf default

        if (type === "ember") {
          vx = (Math.random() - 0.5) * 1.5;
          vy = -Math.random() * 2 - 1;
          size = Math.random() * 2 + 1.5;
          decay = 0.025;
        } else if (type === "pollen") {
          vy = (Math.random() - 0.5) * 0.5;
          size = Math.random() * 3.5 + 2.5;
          decay = 0.015;
        }

        particles.current.push({
          x: mousePos.current.x,
          y: mousePos.current.y,
          vx,
          vy,
          size,
          alpha: 1,
          decay,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.05,
          color,
          type,
        });
      }
    };

    const handleMouseLeave = () => {
      mousePos.current.active = false;
    };

    const handleWindGust = (e: Event) => {
      // Cooldown: prevent gust spam - only allow one gust every 150ms
      const now = Date.now();
      if (now - lastGustTime.current < 150) {
        return;
      }
      lastGustTime.current = now;

      const { vx, vy } = (e as CustomEvent).detail;
      const count = 7; // Reduced from 15 to prevent screen flooding

      for (let i = 0; i < count; i++) {
        let type: "leaf" | "pollen" | "ember" = "leaf";
        let color = "rgba(120, 180, 80, 0.7)"; // Leaf green

        if (scrollProgress >= 0.35 && scrollProgress < 0.7) {
          type = "pollen";
          color = "rgba(250, 195, 50, 0.85)";
        } else if (scrollProgress >= 0.7) {
          type = "ember";
          color = "rgba(255, 95, 30, 0.95)";
        }

        particles.current.push({
          x: Math.random() * (globalThis.innerWidth || 1200),
          y: Math.random() * (globalThis.innerHeight || 800),
          vx: vx + (Math.random() - 0.5) * 4,
          vy: vy + (Math.random() - 0.5) * 4,
          size:
            type === "leaf" ? Math.random() * 5 + 5 : Math.random() * 3.5 + 2.5,
          alpha: 1,
          decay: type === "ember" ? 0.032 : type === "leaf" ? 0.008 : 0.015, // Faster decay for embers
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.15,
          color,
          type,
        });
      }
    };

    const handleCampfireStoke = (e: Event) => {
      const { x, y } = (e as CustomEvent).detail;
      const count = 14; // Reduced from 22 for better visual balance

      for (let i = 0; i < count; i++) {
        particles.current.push({
          x: x + (Math.random() - 0.5) * 16,
          y: y + (Math.random() - 0.5) * 12,
          vx: (Math.random() - 0.5) * 4.5,
          vy: -Math.random() * 5.5 - 2,
          size: Math.random() * 3 + 2,
          alpha: 1,
          decay: 0.032 + Math.random() * 0.012, // Increased from 0.015 for faster fade
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.3,
          color: "rgba(255, 95, 30, 0.95)",
          type: "ember",
        });
      }
    };

    globalThis.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    globalThis.addEventListener("nature-wind-gust", handleWindGust);
    globalThis.addEventListener("nature-campfire-stoke", handleCampfireStoke);

    // Animation canvas loop
    let animationId: number;
    let time = 0;

    const drawParticles = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      time += 1;

      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];

        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        p.rotation += p.rotationSpeed;

        // Realistic fluid dynamics
        if (p.type === "leaf") {
          p.vy += 0.005; // Gentle forest leaf gravity gravity
          p.vx += Math.sin(p.rotation + time * 0.01) * 0.04; // Swaying wind slide
        } else if (p.type === "pollen") {
          // Pollen drifts suspended suspended on a warm breeze vector (Brownian style)
          p.vx += Math.sin(time * 0.02 + p.y * 0.01) * 0.03;
          p.vy += Math.cos(time * 0.02 + p.x * 0.01) * 0.02;
        } else if (p.type === "ember") {
          // Embers accelerate upward due to convection heat draft
          p.vy -= 0.04;
          p.vx += Math.sin(p.y * 0.04 + time * 0.05) * 0.12; // High-frequency thermal wobble
        }

        if (p.alpha <= 0) {
          particles.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);

        if (p.type === "leaf") {
          ctx.rotate(p.rotation);
          ctx.globalAlpha = p.alpha;
          // Organic curved leaf shape
          ctx.beginPath();
          ctx.moveTo(0, -p.size / 2);
          ctx.quadraticCurveTo(p.size / 2, -p.size / 4, 0, p.size / 2);
          ctx.quadraticCurveTo(-p.size / 2, -p.size / 4, 0, -p.size / 2);
          ctx.fillStyle = p.color;
          ctx.fill();
        } else if (p.type === "pollen") {
          // Sparkle dapple - twinkling star glint (scales dynamically with time)
          const shimmer = p.alpha * (0.6 + 0.4 * Math.sin(time * 0.15 + p.x));
          ctx.globalAlpha = shimmer;
          ctx.rotate(p.rotation);

          // Draw 4-point light spark glint
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.quadraticCurveTo(0, 0, p.size, 0);
          ctx.quadraticCurveTo(0, 0, 0, p.size);
          ctx.quadraticCurveTo(0, 0, -p.size, 0);
          ctx.quadraticCurveTo(0, 0, 0, -p.size);

          // Outer dapple radial glow
          const radial = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * 1.5);
          radial.addColorStop(0, "#ffffff");
          radial.addColorStop(0.3, p.color);
          radial.addColorStop(1, "rgba(250, 195, 50, 0)");
          ctx.fillStyle = radial;
          ctx.fill();
        } else if (p.type === "ember") {
          // Campfire embers are hot velocity-blurred lines, flickering as they burn
          const flicker = p.alpha * (0.8 + Math.random() * 0.2);
          ctx.globalAlpha = flicker;

          ctx.beginPath();
          // Draw hot glowing spark motion streak backward from current speed direction
          ctx.moveTo(0, 0);
          ctx.lineTo(-p.vx * 3.5, -p.vy * 3.5);

          ctx.strokeStyle = p.color;
          ctx.lineWidth = p.size;
          ctx.lineCap = "round";
          ctx.shadowColor = "rgba(255, 95, 30, 0.8)";
          ctx.shadowBlur = p.size * 2;
          ctx.stroke();
        }

        ctx.restore();
      }

      animationId = requestAnimationFrame(drawParticles);
    };

    drawParticles();

    return () => {
      globalThis.removeEventListener("resize", resizeCanvas);
      globalThis.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      globalThis.removeEventListener("nature-wind-gust", handleWindGust);
      globalThis.removeEventListener(
        "nature-campfire-stoke",
        handleCampfireStoke,
      );
      cancelAnimationFrame(animationId);
    };
  }, [scrollProgress]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[75] block"
    />
  );
};
