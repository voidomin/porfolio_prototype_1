"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ──────────────────────────────────────────────────────────
   HeroScene – a real, lit, fogged 3D mountain-ridge scene for
   the hero, replacing NatureScene's flat 2D backdrop for just
   this one section. Loaded via next/dynamic({ ssr: false }) from
   HeroSection.tsx, gated to desktop + non-reduced-motion there —
   this file is never even fetched otherwise.

   Deliberately bare three.js + @react-three/fiber core, no drei —
   the whole scene is three extruded "ridge" slabs, two lights, and
   fog, which is little enough hand-rolled code that a whole extra
   dependency isn't worth it.
   ────────────────────────────────────────────────────────── */

interface RidgeConfig {
  z: number;
  width: number;
  peakiness: number;
  seed: number;
  color: string;
  yOffset: number;
}

const RIDGES: RidgeConfig[] = [
  { z: -6, width: 22, peakiness: 2.2, seed: 0, color: "#89cc89", yOffset: -1.5 },
  { z: -3.5, width: 18, peakiness: 1.6, seed: 5, color: "#5aaf5a", yOffset: -2.2 },
  { z: -1.5, width: 15, peakiness: 1.1, seed: 11, color: "#2d722d", yOffset: -2.8 },
];

function buildRidgeGeometry(width: number, peakiness: number, seed: number) {
  const shape = new THREE.Shape();
  const segments = 14;
  const baseY = -3;

  shape.moveTo(-width / 2, baseY);
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const x = -width / 2 + width * t;
    const y =
      Math.sin(t * 6.2 + seed) * peakiness * 0.5 +
      Math.sin(t * 13.7 + seed * 1.7) * peakiness * 0.22 +
      peakiness * 0.35;
    shape.lineTo(x, y);
  }
  shape.lineTo(width / 2, baseY);
  shape.closePath();

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 1,
    bevelEnabled: false,
    curveSegments: 1,
  });
  geometry.computeVertexNormals();
  return geometry;
}

const Ridge = ({ config }: { config: RidgeConfig }) => {
  const geometry = useMemo(
    () => buildRidgeGeometry(config.width, config.peakiness, config.seed),
    [config.width, config.peakiness, config.seed]
  );
  const meshRef = useRef<THREE.Mesh>(null);
  const phase = useMemo(() => Math.random() * Math.PI * 2, []);

  // Slow idle drift — replaces what drei's <Float> would give for free.
  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.position.y =
      config.yOffset + Math.sin(state.clock.elapsedTime * 0.3 + phase) * 0.06;
  });

  return (
    <mesh ref={meshRef} geometry={geometry} position={[0, config.yOffset, config.z]}>
      <meshStandardMaterial color={config.color} roughness={0.9} metalness={0} />
    </mesh>
  );
};

const Scene = () => {
  const cameraTarget = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    // Deltatime-based exponential smoothing — same bounded-lag technique
    // used to fix the Projects section's scroll desync this session, not
    // a fixed per-frame lerp that would drift with frame rate.
    const followSpeed = 4;
    const catchUp = 1 - Math.exp(-followSpeed * delta);

    cameraTarget.current.x += (state.pointer.x * 0.6 - cameraTarget.current.x) * catchUp;
    cameraTarget.current.y += (state.pointer.y * 0.35 - cameraTarget.current.y) * catchUp;

    state.camera.position.x = cameraTarget.current.x;
    state.camera.position.y = cameraTarget.current.y;
    state.camera.lookAt(0, -1, -4);
  });

  return (
    <>
      <fog attach="fog" args={["#fbdf85", 5, 15]} />
      <ambientLight intensity={0.6} color="#fef7e0" />
      <directionalLight position={[4, 6, 4]} intensity={1.3} color="#f0b429" />
      {/* Pushed well below center so peaks stay clear of the hero text/CTAs —
          confirmed by screenshot that the default position rose into the
          headline and buttons, hurting legibility exactly where it matters. */}
      <group position={[0, -2.4, 0]}>
        {RIDGES.map((ridge, i) => (
          <Ridge key={i} config={ridge} />
        ))}
      </group>
    </>
  );
};

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 45, near: 0.1, far: 20 }}
      // Fixed dpr:1 (not [1,1.5]) and antialias:false — both meaningfully
      // cut WebGL context-creation/setup cost. Confirmed via a real CDP
      // trace that this scene's initial mount was expensive enough to
      // trigger a ~180ms whole-page Layout recompute that transiently
      // corrupted NatureScene's fixed-position background elsewhere on
      // the page (a real 0.48 CLS hit unrelated to NatureScene's own
      // code — reproduced and eliminated by testing with this scene
      // absent entirely). The mountains are flat-shaded, fog-blended
      // silhouettes, not fine detail — MSAA edges and 1.5x supersampling
      // aren't buying much visible quality here for the setup cost.
      dpr={1}
      gl={{ antialias: false, alpha: true }}
    >
      <Scene />
    </Canvas>
  );
}
