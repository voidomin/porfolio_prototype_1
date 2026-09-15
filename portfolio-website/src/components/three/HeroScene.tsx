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

   Reactive layer: the directional light drifts toward the cursor
   (plain per-frame position/intensity/color lerp — no shader
   needed, three re-uploads light uniforms every frame regardless),
   and the fog gets a cheap onBeforeCompile patch so its density
   "rolls" faster with scroll velocity and drifts gently even at
   rest. The patch only touches fragment-stage fog blending — never
   geometry/position — so it can't interact with each ridge's own
   idle-bob animation below.
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

// Shared, mutated-in-place every frame — one Object.assign per ridge material
// at compile time wires all three to these same {value} objects, so a single
// per-frame update in Scene's useFrame drives all three materials at once.
interface MistUniforms {
  uTime: { value: number };
  uMistOffset: { value: number };
  uMistIntensity: { value: number };
  uCursor: { value: THREE.Vector2 };
}

// onBeforeCompile runs BEFORE three.js resolves `#include <chunk>` directives
// into their real GLSL — shader.fragmentShader at this point still contains
// the literal, unexpanded `#include <...>` lines, so patches must target
// those directive strings directly, not the (not-yet-existing) resolved
// chunk content.

// Appended right after fog_pars_fragment's own include, so fogColor/fogNear/
// fogFar/vFogDepth (declared inside that chunk) are already in scope.
const FOG_UNIFORM_DECLARATIONS = `#include <fog_pars_fragment>
uniform float uTime;
uniform float uMistOffset;
uniform float uMistIntensity;
uniform vec2 uCursor;`;

// Fully replaces the fog_fragment include with an inlined copy of its own
// logic (both the FOG_EXP2 and linear branches, unchanged) plus two added
// steps: a single low-frequency sine wave sampled from screen-space fragment
// coordinates (no texture, no hash/fbm — the ridges are flat-shaded
// silhouettes that don't need real turbulence) drives a *continuous* haze
// amount with no threshold/smoothstep — a raw sine is already smooth
// everywhere, so there's no hard edge to appear in the first place, unlike
// an earlier version that thresholded it into a single sharp-edged "band"
// and looked like a pasted-on patch instead of atmospheric mist. The mist
// tone is a paler version of the *existing* fogColor (not an unrelated
// color), and its peak contribution is deliberately small relative to the
// base depth-fog blend, so the ridge's own color always still shows through
// — mist should look like haze settling over the mountains, not a wash
// replacing them.
const FOG_MIST_PATCH = `#ifdef USE_FOG

	#ifdef FOG_EXP2

		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );

	#else

		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );

	#endif

	float uMist = sin(gl_FragCoord.x * 0.0018 + uMistOffset) * 0.5 + 0.5;
	float mistAmount = uMist * uMistIntensity;
	vec3 mistColor = mix(fogColor, vec3(1.0), 0.55);
	fogFactor = clamp(fogFactor + mistAmount * 0.3, 0.0, 1.0);
	vec3 blendedFogColor = mix(fogColor, mistColor, mistAmount);

	gl_FragColor.rgb = mix( gl_FragColor.rgb, blendedFogColor, fogFactor );

#endif`;

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

const Ridge = ({ config, uniforms }: { config: RidgeConfig; uniforms: MistUniforms }) => {
  const geometry = useMemo(
    () => buildRidgeGeometry(config.width, config.peakiness, config.seed),
    [config.width, config.peakiness, config.seed]
  );
  const meshRef = useRef<THREE.Mesh>(null);
  const phase = useMemo(() => Math.random() * Math.PI * 2, []);

  const handleBeforeCompile = useMemo(
    () => (shader: THREE.WebGLProgramParametersWithUniforms) => {
      // Only ever mutate .value on these registered uniforms afterward — never
      // reassign material.needsUpdate in the per-frame path, which would force
      // an expensive recompile every frame instead of a cheap value upload.
      Object.assign(shader.uniforms, uniforms);
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <fog_pars_fragment>",
        FOG_UNIFORM_DECLARATIONS
      );
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <fog_fragment>",
        FOG_MIST_PATCH
      );
    },
    [uniforms]
  );

  // Slow idle drift — replaces what drei's <Float> would give for free.
  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.position.y =
      config.yOffset + Math.sin(state.clock.elapsedTime * 0.3 + phase) * 0.06;
  });

  return (
    <mesh ref={meshRef} geometry={geometry} position={[0, config.yOffset, config.z]}>
      <meshStandardMaterial
        color={config.color}
        roughness={0.9}
        metalness={0}
        onBeforeCompile={handleBeforeCompile}
      />
    </mesh>
  );
};

// Aimed to visually agree with NatureScene's own 2D dawn sun, which sits at
// screen lower-left at rest (~15vw, ~70vh) — the ridges' highlight side
// should read as lit by that same visible sun, not an unrelated direction.
// z stays close to the camera (front-lighting) rather than going backlit/
// silhouette, which would be a much bigger visual change than intended here.
const BASE_LIGHT_POSITION = { x: -3.5, y: 2 };
const BASE_LIGHT_INTENSITY = 1.3;
const MAX_SCROLL_VELOCITY = 2500; // px/s, clamped before it can dominate the mist

// Sparse ambient light motes drifting up through the ridges — ties the hero
// into the site's existing "firefly" visual language (same warm gold used by
// .firefly-dot / the Campfire Blessing embers) instead of a new, unrelated
// motif. World-space bounds picked to roughly span from the ridges' base up
// past their tallest peak into open sky, tuned by eye rather than derived
// exactly from each ridge's own geometry math.
const MOTE_COUNT = 20;
const MOTE_BOUNDS = { xRange: 8, yMin: -6, yMax: 0.8, zMin: -7, zMax: -0.5 };

interface MoteDatum {
  baseX: number;
  y: number;
  z: number;
  speed: number;
  swayPhase: number;
}

const LightMotes = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);
  const parallaxOffset = useRef({ x: 0, y: 0 });

  const motes = useMemo<MoteDatum[]>(
    () =>
      Array.from({ length: MOTE_COUNT }, () => ({
        baseX: (Math.random() * 2 - 1) * MOTE_BOUNDS.xRange,
        y: MOTE_BOUNDS.yMin + Math.random() * (MOTE_BOUNDS.yMax - MOTE_BOUNDS.yMin),
        z: MOTE_BOUNDS.zMin + Math.random() * (MOTE_BOUNDS.zMax - MOTE_BOUNDS.zMin),
        speed: 0.08 + Math.random() * 0.1,
        swayPhase: Math.random() * Math.PI * 2,
      })),
    []
  );

  const positions = useMemo(() => {
    const array = new Float32Array(MOTE_COUNT * 3);
    motes.forEach((mote, i) => {
      array[i * 3] = mote.baseX;
      array[i * 3 + 1] = mote.y;
      array[i * 3 + 2] = mote.z;
    });
    return array;
  }, [motes]);

  useFrame((state, delta) => {
    // Whole-group parallax toward the cursor — same exponential-smoothing
    // idiom as the camera/light above, applied once to the group rather than
    // per-particle, so the motes feel part of the same reactive space
    // without adding per-particle cursor math.
    if (groupRef.current) {
      const followSpeed = 1.5;
      const catchUp = 1 - Math.exp(-followSpeed * delta);
      parallaxOffset.current.x += (state.pointer.x * 0.4 - parallaxOffset.current.x) * catchUp;
      parallaxOffset.current.y += (state.pointer.y * 0.25 - parallaxOffset.current.y) * catchUp;
      groupRef.current.position.x = parallaxOffset.current.x;
      groupRef.current.position.y = parallaxOffset.current.y;
    }

    const posAttr = pointsRef.current?.geometry.attributes.position as
      | THREE.BufferAttribute
      | undefined;
    if (!posAttr) return;

    motes.forEach((mote, i) => {
      mote.y += mote.speed * delta;
      if (mote.y > MOTE_BOUNDS.yMax) mote.y = MOTE_BOUNDS.yMin;
      const sway = Math.sin(state.clock.elapsedTime * 0.4 + mote.swayPhase) * 0.4;
      posAttr.setXYZ(i, mote.baseX + sway, mote.y, mote.z);
    });
    posAttr.needsUpdate = true;
  });

  return (
    <group ref={groupRef}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          color="#f0b429"
          transparent
          opacity={0.7}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};

const Scene = () => {
  const cameraTarget = useRef({ x: 0, y: 0 });
  const lightTarget = useRef({ ...BASE_LIGHT_POSITION, intensity: BASE_LIGHT_INTENSITY });
  const baseLightColor = useMemo(() => new THREE.Color("#f0b429"), []);
  const flareLightColor = useMemo(() => new THREE.Color("#fff1c9"), []);
  const lightColorScratch = useMemo(() => new THREE.Color(), []);
  const lightRef = useRef<THREE.DirectionalLight>(null);

  const lastScrollY = useRef(typeof window !== "undefined" ? window.scrollY : 0);
  const smoothedScrollVelocity = useRef(0);

  const uniformsRef = useRef<MistUniforms | null>(null);
  if (!uniformsRef.current) {
    uniformsRef.current = {
      uTime: { value: 0 },
      uMistOffset: { value: 0 },
      uMistIntensity: { value: 0.05 },
      uCursor: { value: new THREE.Vector2(0, 0) },
    };
  }
  const uniforms = uniformsRef.current;

  useFrame((state, delta) => {
    // Camera parallax — deltatime-based exponential smoothing, same bounded-
    // lag technique used to fix the Projects section's scroll desync this
    // session, not a fixed per-frame lerp that would drift with frame rate.
    const followSpeed = 4;
    const catchUp = 1 - Math.exp(-followSpeed * delta);

    cameraTarget.current.x += (state.pointer.x * 0.6 - cameraTarget.current.x) * catchUp;
    cameraTarget.current.y += (state.pointer.y * 0.35 - cameraTarget.current.y) * catchUp;

    state.camera.position.x = cameraTarget.current.x;
    state.camera.position.y = cameraTarget.current.y;
    state.camera.lookAt(0, -1, -4);

    // Light drifts toward the cursor — slower than the camera so the two
    // reactive layers visibly differ instead of moving in lockstep.
    if (lightRef.current) {
      const lightFollowSpeed = 2;
      const lightCatchUp = 1 - Math.exp(-lightFollowSpeed * delta);

      const targetX = BASE_LIGHT_POSITION.x + state.pointer.x * 2;
      const targetY = BASE_LIGHT_POSITION.y + state.pointer.y * 1.5;
      lightTarget.current.x += (targetX - lightTarget.current.x) * lightCatchUp;
      lightTarget.current.y += (targetY - lightTarget.current.y) * lightCatchUp;
      lightRef.current.position.x = lightTarget.current.x;
      lightRef.current.position.y = lightTarget.current.y;

      // Cursor toward the edges reads as a subtle warm flare; center is calm.
      const edgeAmount = THREE.MathUtils.clamp(
        (Math.abs(state.pointer.x) + Math.abs(state.pointer.y)) / 2,
        0,
        1
      );
      const targetIntensity = BASE_LIGHT_INTENSITY + edgeAmount * 0.2;
      lightTarget.current.intensity +=
        (targetIntensity - lightTarget.current.intensity) * lightCatchUp;
      lightRef.current.intensity = lightTarget.current.intensity;

      lightColorScratch.copy(baseLightColor).lerp(flareLightColor, edgeAmount);
      lightRef.current.color.copy(lightColorScratch);
    }

    // Scroll velocity → rolling mist. Lenis animates the real document
    // scroll position, so reading window.scrollY here gets Lenis's own
    // easing for free without importing anything from lib/lenis.
    const currentScrollY = window.scrollY;
    const rawVelocity = delta > 0 ? (currentScrollY - lastScrollY.current) / delta : 0;
    lastScrollY.current = currentScrollY;

    const clampedVelocity = THREE.MathUtils.clamp(Math.abs(rawVelocity), 0, MAX_SCROLL_VELOCITY);
    const velocityFollowSpeed = 3;
    const velocityCatchUp = 1 - Math.exp(-velocityFollowSpeed * delta);
    smoothedScrollVelocity.current +=
      (clampedVelocity - smoothedScrollVelocity.current) * velocityCatchUp;

    // A small idle drift keeps the mist from ever looking perfectly frozen,
    // even before any interaction — deliberate, not identical to a static rest state.
    // Square-root response curve: a moderate scroll speed already reads as a
    // clear mist pickup instead of needing to approach MAX_SCROLL_VELOCITY
    // before the effect feels present, without changing the peak intensity.
    const velocityRatio = Math.min(smoothedScrollVelocity.current / MAX_SCROLL_VELOCITY, 1);
    const mistResponse = Math.sqrt(velocityRatio);

    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uMistOffset.value += delta * (0.08 + smoothedScrollVelocity.current * 0.0006);
    uniforms.uMistIntensity.value = 0.85 + mistResponse * 0.15;
    uniforms.uCursor.value.set(state.pointer.x, state.pointer.y);
  });

  return (
    <>
      <fog attach="fog" args={["#fbdf85", 5, 15]} />
      <ambientLight intensity={0.6} color="#fef7e0" />
      <directionalLight
        ref={lightRef}
        position={[BASE_LIGHT_POSITION.x, BASE_LIGHT_POSITION.y, 4]}
        intensity={1.3}
        color="#f0b429"
      />
      {/* Pushed well below center so peaks stay clear of the hero text/CTAs —
          confirmed by screenshot that the default position rose into the
          headline and buttons, hurting legibility exactly where it matters. */}
      <group position={[0, -2.4, 0]}>
        {RIDGES.map((ridge, i) => (
          <Ridge key={i} config={ridge} uniforms={uniforms} />
        ))}
      </group>
      <LightMotes />
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
