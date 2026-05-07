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

  // Update current scroll progress state for particle spawning
  useEffect(() => {
    return scrollYProgress.onChange((v) => setScrollProgress(v));
  }, [scrollYProgress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Setup high-DPI canvas resolution
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

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
      const speed = Math.sqrt(dx * dx + dy * dy);

      // Spawn exactly ONE micro-particle only on significant move, max active particles capped at 20
      if (speed > 4 && particles.current.length < 20) {
        let type: "leaf" | "pollen" | "ember" = "leaf";
        let color = "rgba(100, 160, 60, 0.7)"; // Leaf green

        if (scrollProgress >= 0.35 && scrollProgress < 0.7) {
          type = "pollen";
          color = "rgba(240, 180, 41, 0.75)"; // Pollen gold
        } else if (scrollProgress >= 0.7) {
          type = "ember";
          color = "rgba(230, 90, 40, 0.8)"; // Cozy amber ember
        }

        particles.current.push({
          x: mousePos.current.x,
          y: mousePos.current.y,
          // Soft dispersion velocity
          vx: (Math.random() - 0.5) * 1.0,
          vy: type === "ember" 
            ? -Math.random() * 1.5 - 0.5 // Embers float upwards
            : (Math.random() - 0.2) * 1.0, // Leaves/pollen drift down
          size: type === "leaf" 
            ? Math.random() * 5 + 4 // Leaf size
            : Math.random() * 3 + 2, // Dust size
          alpha: 1.0,
          decay: type === "leaf" ? 0.015 : 0.02, // Fades quickly
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.04,
          color,
          type,
        });
      }
    };

    const handleMouseLeave = () => {
      mousePos.current.active = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Animation canvas loop
    let animationId: number;
    const drawParticles = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];

        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        p.rotation += p.rotationSpeed;

        // Apply slight gravity/drift to mimic forest atmosphere
        if (p.type === "leaf") {
          p.vy += 0.01; // Soft leaf gravity
          p.vx += Math.sin(p.rotation) * 0.05; // Gentle sway
        } else if (p.type === "ember") {
          p.vx += Math.sin(p.x * 0.02) * 0.1; // Ember crackle wave
        }

        if (p.alpha <= 0) {
          particles.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.type === "leaf") {
          // Draw organic leaf shape path
          ctx.beginPath();
          ctx.moveTo(0, -p.size / 2);
          ctx.quadraticCurveTo(p.size / 2, -p.size / 4, 0, p.size / 2);
          ctx.quadraticCurveTo(-p.size / 2, -p.size / 4, 0, -p.size / 2);
          ctx.fillStyle = p.color;
          ctx.fill();
        } else if (p.type === "pollen") {
          // Pollen sparkles - radial glow
          const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size);
          grad.addColorStop(0, "rgba(255, 255, 255, 1)");
          grad.addColorStop(0.3, p.color);
          grad.addColorStop(1, "rgba(240, 180, 41, 0)");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === "ember") {
          // Rising embers - warm flickering particles
          const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size);
          grad.addColorStop(0, "rgba(255, 200, 120, 1)");
          grad.addColorStop(0.4, p.color);
          grad.addColorStop(1, "rgba(230, 90, 40, 0)");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animationId = requestAnimationFrame(drawParticles);
    };

    drawParticles();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
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
