"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useTransform, useMotionValue, useSpring } from "motion/react";
import { useScrollContext } from "@/contexts/ScrollContext";
import { useIsDesktopPointer } from "@/hooks/useIsDesktopPointer";

/* ──────────────────────────────────────────────────────────
   NatureScene – fixed parallax background painting the full
   day-cycle. Sky gradient now driven by IntersectionObserver
   (fires only on section entry, not every scroll frame) and
   cross-fades via opacity — GPU-composited, zero JS per frame.
   ────────────────────────────────────────────────────────── */

const SKY_GRADIENTS: Record<string, string> = {
  home: "linear-gradient(180deg, #fef7e0 0%, #fdedb7 30%, #fbdf85 60%, #f0b429 100%)",
  about: "linear-gradient(180deg, #e0f0ff 0%, #93d2fd 30%, #60b8fa 60%, #3b99f5 100%)",
  skills: "linear-gradient(180deg, #c8e6c9 0%, #81c784 30%, #66bb6a 60%, #43a047 100%)",
  projects: "linear-gradient(180deg, #bbdefb 0%, #90caf9 30%, #64b5f6 60%, #42a5f5 100%)",
  publications: "linear-gradient(180deg, #fce8e6 0%, #f5b3af 40%, #e05d57 70%, #762b2a 100%)",
  photography: "linear-gradient(180deg, #fcdfa8 0%, #fbad60 40%, #e05d57 70%, #762b2a 100%)",
  contact: "linear-gradient(180deg, #1a1145 0%, #0f0d2e 40%, #0a0820 100%)",
};

const SECTION_IDS = [
  "home",
  "about",
  "skills",
  "projects",
  "publications",
  "photography",
  "contact",
];

const STARS_COUNT = 60;

function generateStars() {
  return Array.from({ length: STARS_COUNT }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 60,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 5,
    duration: Math.random() * 3 + 2,
  }));
}

const WISH_PARTICLE_COLORS = ["#c7cfff", "#e0e5ff", "#ffffff"];

// One-shot sparkle burst at the click point — same cheap DOM motion.div
// technique as ContactSection's ember particles, silvery-blue here to match
// the stars/moon palette instead of the campfire's warm tones.
const WishSparkles = ({ x, y }: { x: number; y: number }) => {
  const particles = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => ({
        id: i,
        angle: (i / 7) * Math.PI * 2 + Math.random() * 0.4,
        distance: 22 + Math.random() * 18,
        color: WISH_PARTICLE_COLORS[i % WISH_PARTICLE_COLORS.length],
      })),
    []
  );

  return (
    <div className="absolute pointer-events-none" style={{ left: x, top: y, zIndex: 5 }}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: 3,
            height: 3,
            background: p.color,
            boxShadow: `0 0 6px 1px ${p.color}`,
          }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: Math.cos(p.angle) * p.distance,
            y: Math.sin(p.angle) * p.distance,
            opacity: 0,
            scale: 0.3,
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      ))}
    </div>
  );
};

interface ShootingStarProps {
  top: string;
  left: string;
  animationDelay?: string;
  onWish: (clientX: number, clientY: number) => void;
}

// A real click can never reach an invisible element positioned inside
// NatureScene via normal DOM hit-testing/pointer-events, no matter where
// it's placed or how its z-index is tuned: NatureScene is a fixed z-0
// background, and every content <section> stacked in front of it fills the
// full page top-to-bottom with default pointer-events:auto, so *some*
// section is always the actual hit-test target at any point on the page.
// Confirmed directly via elementFromPoint before landing on this approach.
// Fix: listen at the window level instead of relying on the click ever
// "reaching" this element, and manually correlate the click's coordinates
// against the dot's own live bounding box + opacity. This can't conflict
// with real page interactions — it's a passive, additional check on clicks
// that already happened, never something that intercepts or blocks them.
// The dot is only "live" for ~13% of its 22s loop (see .shooting-star /
// shootingStarLoop in globals.css); a generous padding around its actual
// position (not a pixel-precise hit) keeps this a rare but achievable
// secret rather than requiring frame-perfect tracking of a fast 2px dot.
const WISH_CLICK_PADDING = 40;

const ShootingStar = ({ top, left, animationDelay, onWish }: ShootingStarProps) => {
  const dotRef = useRef<HTMLDivElement>(null);
  const hasFiredRef = useRef(false);

  useEffect(() => {
    const handleWindowClick = (event: MouseEvent) => {
      const dot = dotRef.current;
      if (!dot || hasFiredRef.current) return;
      const opacity = Number(getComputedStyle(dot).opacity);
      if (opacity <= 0) return;

      const rect = dot.getBoundingClientRect();
      const withinX =
        event.clientX >= rect.left - WISH_CLICK_PADDING &&
        event.clientX <= rect.right + WISH_CLICK_PADDING;
      const withinY =
        event.clientY >= rect.top - WISH_CLICK_PADDING &&
        event.clientY <= rect.bottom + WISH_CLICK_PADDING;
      if (!withinX || !withinY) return;

      hasFiredRef.current = true;
      onWish(event.clientX, event.clientY);
      globalThis.dispatchEvent(new CustomEvent("nature-shooting-star-wish"));
    };
    window.addEventListener("click", handleWindowClick);
    return () => window.removeEventListener("click", handleWindowClick);
  }, [onWish]);

  return (
    <div
      ref={dotRef}
      className="shooting-star"
      style={{ top, left, animationDelay }}
      onAnimationIteration={() => {
        // Each loop of the infinite animation restarts from the idle
        // phase — the natural reset point for "this streak can wish again."
        hasFiredRef.current = false;
      }}
    />
  );
};

interface WishBurst {
  id: number;
  x: number;
  y: number;
}

export const NatureScene = () => {
  const { scrollYProgress } = useScrollContext();
  const [stars] = useState(() => generateStars());
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeSky, setActiveSky] = useState(SKY_GRADIENTS.home);
  // Defaults to false — this scene's own flat mountains/mist stay visible
  // (today's look) until HeroSection confirms its 3D scene has actually
  // mounted. Never true on mobile/reduced-motion, since HeroScene never
  // mounts there — this fallback path is untouched for those visitors.
  const [hero3dActive, setHero3dActive] = useState(false);
  const [wishBursts, setWishBursts] = useState<WishBurst[]>([]);
  const wishIdRef = useRef(0);
  // Pointer-fine only — parallax is meaningless without a mouse/trackpad,
  // and this stays width-independent (width threshold 0) since it's purely
  // about input precision, not viewport size.
  const isDesktopPointer = useIsDesktopPointer(0);

  useEffect(() => {
    setMounted(true);
    setIsMobile(globalThis.innerWidth < 768);
  }, []);

  const handleWish = useCallback((clientX: number, clientY: number) => {
    const id = wishIdRef.current++;
    setWishBursts((prev) => [...prev, { id, x: clientX, y: clientY }]);
    setTimeout(() => {
      setWishBursts((prev) => prev.filter((burst) => burst.id !== id));
    }, 900);
  }, []);

  // Cursor parallax for clouds/stars — one mousemove listener feeding
  // framer's own useSpring smoothing (idiomatic here since this is DOM/CSS-
  // driven, unlike the 3D hero's manual useFrame exponential smoothing).
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 40, damping: 15 });
  const springY = useSpring(pointerY, { stiffness: 40, damping: 15 });

  useEffect(() => {
    if (!isDesktopPointer) return;
    const handleMouseMove = (event: MouseEvent) => {
      pointerX.set((event.clientX / window.innerWidth) * 2 - 1);
      pointerY.set((event.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isDesktopPointer, pointerX, pointerY]);

  // Clouds read as "closer" than stars, so they get a slightly larger shift.
  const cloudParallaxX = useTransform(springX, (v) => v * 15);
  const cloudParallaxY = useTransform(springY, (v) => v * 10);
  const starParallaxX = useTransform(springX, (v) => v * 8);
  const starParallaxY = useTransform(springY, (v) => v * 5);

  // HeroSection dispatches this once its own mount-gating (desktop +
  // non-reduced-motion + near-viewport + idle-callback-ready) resolves —
  // reusing this codebase's existing CustomEvent decoupling convention
  // (same shape as the nature-campfire-* events) instead of duplicating
  // that gating logic here, which would drift out of sync over time.
  useEffect(() => {
    const handleHeroSceneActive = (event: Event) => {
      const detail = (event as CustomEvent<{ active: boolean }>).detail;
      setHero3dActive(Boolean(detail?.active));
    };
    globalThis.addEventListener("hero-scene-active", handleHeroSceneActive);
    return () => globalThis.removeEventListener("hero-scene-active", handleHeroSceneActive);
  }, []);

  // The 3D hero scene owns the terrain/mist for the home chapter once it's
  // actually mounted — this scene's own flat layers fade out (opacity only,
  // see .mountain-layer/.ground-mist in globals.css) rather than doubling up.
  const hideForHero3d = hero3dActive && activeSky === SKY_GRADIENTS.home;

  // IntersectionObserver drives sky colour — zero scroll-frame JS computation
  useEffect(() => {
    if (!mounted) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && SKY_GRADIENTS[entry.target.id]) {
            setActiveSky(SKY_GRADIENTS[entry.target.id]);
          }
        });
      },
      { threshold: 0.35, rootMargin: "0px 0px -15% 0px" }
    );

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [mounted]);

  // Parallax transforms for mountain layers — ALL hooks called before any return
  const mountainBackY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const mountainMidY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const mountainFrontY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  // Sun position — arcs across the sky as user scrolls
  const sunX = useTransform(scrollYProgress, [0, 0.5, 1], [15, 50, 85]);
  const sunY = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [70, 20, 15, 25, 80]);
  const sunScale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [1, 1.2, 1.1, 0.8]);
  const sunOpacity = useTransform(scrollYProgress, [0, 0.1, 0.82, 0.92, 1], [0.6, 1, 0.8, 0.15, 0]);

  // Moon opacity and position
  const moonOpacity = useTransform(scrollYProgress, [0.82, 0.95], [0, 0.9]);
  const moonXVal = useTransform(scrollYProgress, [0.8, 1], [25, 20]);
  const moonYVal = useTransform(scrollYProgress, [0.8, 1], [42, 15]);
  const moonRight = useTransform(moonXVal, (v: number) => `${v}vw`);
  const moonTop = useTransform(moonYVal, (v: number) => `${v}vh`);

  // Star visibility
  const starsOpacity = useTransform(scrollYProgress, [0.85, 0.97], [0, 1]);

  // Sun CSS position values — vw/vh, not %: this element's percentage
  // positioning was one of two remaining contributors to a real CLS hit
  // traced to this scene (see mountain-layer/cloud comment above), cut
  // from a 0.48 to 0.45 score after fixing the other three; vw/vh removes
  // its last dependency on the parent's own resolved dimensions.
  const sunLeft = useTransform(sunX, (v: number) => `${v}vw`);
  const sunTop = useTransform(sunY, (v: number) => `${v}vh`);

  // Cloud and mist opacity
  const cloudOpacity = useTransform(scrollYProgress, [0, 0.4, 0.8, 1], [0.7, 0.5, 0.3, 0]);
  const mistOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8], [0.6, 0.2, 0]);

  return (
    <div className="nature-scene">
      {/* ─── Sky Gradient — cross-fades on section change, no per-frame computation ─── */}
      <AnimatePresence mode="sync">
        <motion.div
          key={activeSky}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          style={{ background: activeSky }}
        />
      </AnimatePresence>

      {/* ─── Sun ─── */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 60,
          height: 60,
          background: "radial-gradient(circle, #fef7e0 0%, #f0b429 40%, rgba(240,180,41,0) 70%)",
          boxShadow: "0 0 60px 20px rgba(240,180,41,0.3)",
          left: sunLeft,
          top: sunTop,
          scale: sunScale,
          opacity: sunOpacity,
          x: "-50%",
          y: "-50%",
        }}
      />

      {/* ─── Moon rays ─── Same technique as the hero's .sun-rays: anchored
          at the moon's own already-computed position, using a translate in
          the opposite direction since the moon is positioned via right/top
          rather than left/top. Gated to the contact chapter only — same
          pattern as .sun-rays' `activeSky === home` check — so it can't
          render (even at clamped-but-technically-nonzero opacity) outside
          the moon's own window. */}
      {activeSky === SKY_GRADIENTS.contact && (
        <motion.div
          className="moon-rays"
          style={{ right: moonRight, top: moonTop, opacity: moonOpacity }}
        />
      )}

      {/* ─── Moon ─── Craters are extra, fixed-offset radial-gradient layers
          stacked behind the base gradient (CSS supports comma-separated
          background layers) — texture instead of a flat gradient ball.
          Bumped from 40px to 52px and darkened the crater tone: at the
          original size/contrast the craters were essentially invisible in
          screenshot verification, all glow and no texture.

          `x:"50%", y:"-50%"` centers the disc on its own right/top anchor
          point — the mirror of the sun's `x:"-50%", y:"-50%"` (left/top
          anchored) a few blocks up. Missing here previously: the disc's
          actual visual center sat ~26px off from that anchor point (half
          its own width/height), while .moon-rays (added later) correctly
          centers ON that exact anchor — so the two drifted apart. Confirmed
          via direct rect math (moon-rays center landed exactly on the
          disc's un-transformed top-right corner, not its visual center)
          before applying this. */}
      <motion.div
        className="absolute rounded-full moon-glow-pulse"
        style={{
          width: 52,
          height: 52,
          background:
            "radial-gradient(circle at 62% 72%, rgba(110,120,175,0.55) 0%, transparent 32%), " +
            "radial-gradient(circle at 28% 52%, rgba(110,120,175,0.45) 0%, transparent 28%), " +
            "radial-gradient(circle at 55% 28%, rgba(110,120,175,0.5) 0%, transparent 22%), " +
            "radial-gradient(circle at 35% 35%, #e0e5ff 0%, #c7cfff 50%, rgba(199,207,255,0.3) 100%)",
          right: moonRight,
          top: moonTop,
          opacity: moonOpacity,
          x: "50%",
          y: "-50%",
        }}
      />

      {/* ─── Stars ─── Positions are randomized (generateStars), so unlike
          everything else in this scene they'd genuinely mismatch between
          server and client if rendered unconditionally — gated behind
          `mounted` for that reason alone. Everything else here (sky, sun,
          moon, mountains, clouds) is fully deterministic and used to be
          gated behind the same flag needlessly, which meant it all popped
          in from zero size in a single frame after hydration — a real,
          measured CLS hit (a production trace scored it 0.48) since a
          fixed-position element's rect changing from empty to full-size
          still counts as a layout shift even though it doesn't push any
          sibling content around. */}
      {mounted && (
        <motion.div
          className="absolute inset-0"
          style={{ opacity: starsOpacity, x: starParallaxX, y: starParallaxY }}
        >
          {(isMobile ? stars.slice(0, 20) : stars).map((star) => (
            <div
              key={star.id}
              className="star-dot animate-twinkle"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: star.size,
                height: star.size,
                animationDelay: `${star.delay}s`,
                animationDuration: `${star.duration}s`,
              }}
            />
          ))}
          {/* Shooting stars — nested inside the same opacity-gated wrapper as
              the stars themselves, so they only ever show alongside them with
              zero extra gating logic. Pure CSS loop, mostly idle with a brief
              streak-and-fade; staggered delays keep the two from firing in
              sync. Also doubles as a small clickable "wish" Easter egg — see
              ShootingStar above. */}
          <ShootingStar top="12%" left="20%" onWish={handleWish} />
          <ShootingStar top="28%" left="60%" animationDelay="-11s" onWish={handleWish} />
        </motion.div>
      )}

      {/* One-shot sparkle bursts from catching a shooting star — rendered at
          the top level (not nested in the stars' opacity wrapper) so a burst
          plays out fully even if scroll/section state changes mid-animation. */}
      {wishBursts.map((burst) => (
        <WishSparkles key={burst.id} x={burst.x} y={burst.y} />
      ))}

      {/* ─── Clouds ─── */}
      <motion.div style={{ opacity: cloudOpacity, x: cloudParallaxX, y: cloudParallaxY }}>
        <div
          className="cloud animate-drift-cloud"
          style={{
            width: 200,
            height: 60,
            top: "12vh",
            background: "radial-gradient(ellipse, rgba(255,255,255,0.7), transparent)",
          }}
        />
        <div
          className="cloud animate-drift-cloud-slow"
          style={{
            width: 280,
            height: 70,
            top: "22vh",
            animationDelay: "-15s",
            background: "radial-gradient(ellipse, rgba(255,255,255,0.5), transparent)",
          }}
        />
        <div
          className="cloud animate-drift-cloud"
          style={{
            width: 160,
            height: 50,
            top: "8vh",
            animationDelay: "-30s",
            background: "radial-gradient(ellipse, rgba(255,255,255,0.6), transparent)",
          }}
        />
      </motion.div>

      {/* ─── Mountain Layer 3 (back, lightest) ─── */}
      <motion.div
        className="mountain-layer"
        style={{ y: mountainBackY, height: "45vh", zIndex: 1, opacity: hideForHero3d ? 0 : 1 }}
      >
        <svg viewBox="0 0 1440 400" preserveAspectRatio="none" className="w-full h-full">
          <path
            d="M0,400 L0,280 Q120,160 240,220 Q360,100 480,180 Q600,60 720,140 Q840,40 960,120 Q1080,60 1200,160 Q1320,100 1440,200 L1440,400 Z"
            fill="rgba(30,70,30,0.3)"
          />
        </svg>
      </motion.div>

      {/* ─── Mountain Layer 2 (mid) ─── */}
      <motion.div
        className="mountain-layer"
        style={{ y: mountainMidY, height: "38vh", zIndex: 2, opacity: hideForHero3d ? 0 : 1 }}
      >
        <svg viewBox="0 0 1440 400" preserveAspectRatio="none" className="w-full h-full">
          <path
            d="M0,400 L0,300 Q100,180 200,240 Q320,120 440,200 Q560,80 680,160 Q800,60 920,140 Q1040,100 1160,180 Q1280,120 1440,220 L1440,400 Z"
            fill="rgba(20,50,20,0.45)"
          />
        </svg>
      </motion.div>

      {/* ─── Mountain Layer 1 (front, darkest) ─── */}
      <motion.div
        className="mountain-layer"
        style={{ y: mountainFrontY, height: "30vh", zIndex: 3, opacity: hideForHero3d ? 0 : 1 }}
      >
        <svg viewBox="0 0 1440 400" preserveAspectRatio="none" className="w-full h-full">
          <path
            d="M0,400 L0,320 Q80,240 200,280 Q320,200 440,260 Q560,180 680,220 Q800,140 920,200 Q1040,160 1160,220 Q1280,180 1440,260 L1440,400 Z"
            fill="rgba(15,35,15,0.6)"
          />
        </svg>
      </motion.div>

      {/* ─── Sun rays ─── Anchored at the same sunLeft/sunTop position as the
          sun disc itself, so it reads as that sun's own light rather than a
          decoration. Home chapter only — this is the one deliberately new
          visual addition in this pass. */}
      {activeSky === SKY_GRADIENTS.home && (
        <motion.div
          className="sun-rays"
          style={{ left: sunLeft, top: sunTop, opacity: sunOpacity }}
        />
      )}

      {/* ─── Ground mist ─── */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-32 ground-mist"
        style={{
          background: "linear-gradient(180deg, transparent, rgba(255,255,255,0.08))",
          opacity: hideForHero3d ? 0 : mistOpacity,
        }}
      />
    </div>
  );
};
