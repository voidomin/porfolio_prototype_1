"use client";

import { useEffect, useRef, useCallback } from "react";
import { useScrollContext } from "@/contexts/ScrollContext";

/* ──────────────────────────────────────────────────────────
   SoundscapeManager – Procedural Nature Audio Synthesizer.
   Synthesizes organic mountain sounds 100% in-browser using Web Audio API:
   - ZERO network download footprint (no .mp3 or .wav dependencies).
   - Deep Mountain Wind: Filtered white noise modulated by a slow LFO wind gust cycle.
   - Evening Crickets: Snappy, high-frequency synthesized triple-chirp oscillators.
   - Crackling Campfire: Procedural high-pass pops and low-frequency ember rumbles.
   - Crossfades smoothly on scroll matching current day cycle.
   ────────────────────────────────────────────────────────── */

export const SoundscapeManager = () => {
  const { scrollYProgress } = useScrollContext();
  const isPlayingRef = useRef(false);

  // Audio Context and Node References
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);

  const windGainRef = useRef<GainNode | null>(null);
  const cricketGainRef = useRef<GainNode | null>(null);
  const fireGainRef = useRef<GainNode | null>(null);

  // Synthesis engine sources
  const windSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const windLFORef = useRef<OscillatorNode | null>(null);

  // Active timers for insect/fire scheduling loops
  const schedulerTimersRef = useRef<number[]>([]);

  // Adjust volume levels dynamically based on scroll — direct listener, no state re-renders
  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      if (!isPlayingRef.current) return;

      const now = audioCtxRef.current?.currentTime || 0;

      let targetWind = 0.25;
      if (v > 0.4) targetWind = 0.15;
      if (v > 0.75) targetWind = 0.05;

      let targetCrickets = 0.0;
      if (v >= 0.35) targetCrickets = Math.min(0.2, (v - 0.35) * 0.5);
      if (v >= 0.7) targetCrickets = 0.22;

      let targetFire = 0.0;
      if (v >= 0.7) targetFire = Math.min(0.35, (v - 0.7) * 1.5);
      if (v > 0.95) targetFire = 0.1;

      windGainRef.current?.gain.linearRampToValueAtTime(targetWind, now + 0.5);
      cricketGainRef.current?.gain.linearRampToValueAtTime(targetCrickets, now + 0.5);
      fireGainRef.current?.gain.linearRampToValueAtTime(targetFire, now + 0.5);
    });
  }, [scrollYProgress]);

  // Direct cleanup of sound synthesis nodes and timers
  const cleanupSoundscape = useCallback(() => {
    isPlayingRef.current = false;

    // Clear all interval timers
    schedulerTimersRef.current.forEach((t) => clearTimeout(t));
    schedulerTimersRef.current = [];

    // Stop and null wind sources
    try {
      windSourceRef.current?.stop();
      windLFORef.current?.stop();
    } catch (e) {}

    windSourceRef.current = null;
    windLFORef.current = null;

    // Close Audio Context safely
    try {
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        audioCtxRef.current.close();
      }
    } catch (e) {}
    audioCtxRef.current = null;
    masterGainRef.current = null;
  }, []);

  // Start the procedural synthesis engines
  const startSoundscape = useCallback(async () => {
    if (isPlayingRef.current) return;

    try {
      // 1. Initialize Audio Context on explicit user click event (browser requirement)
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      // 2. Create Master and Channel Gain Nodes
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0, ctx.currentTime); // Start silent for fade-in
      masterGain.connect(ctx.destination);
      masterGainRef.current = masterGain;

      // Channel Nodes
      const windGain = ctx.createGain();
      windGain.gain.setValueAtTime(0.25, ctx.currentTime);
      windGain.connect(masterGain);
      windGainRef.current = windGain;

      const cricketGain = ctx.createGain();
      cricketGain.gain.setValueAtTime(0, ctx.currentTime);
      cricketGain.connect(masterGain);
      cricketGainRef.current = cricketGain;

      const fireGain = ctx.createGain();
      fireGain.gain.setValueAtTime(0, ctx.currentTime);
      fireGain.connect(masterGain);
      fireGainRef.current = fireGain;

      // 3. SYNTHESIZE DEEP MOUNTAIN WIND
      // Create white noise buffer
      const bufferSize = ctx.sampleRate * 2; // 2 seconds of noise
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const windNoise = ctx.createBufferSource();
      windNoise.buffer = noiseBuffer;
      windNoise.loop = true;

      // Filter rumble (lowpass filter cutoff swept slowly by LFO)
      const windFilter = ctx.createBiquadFilter();
      windFilter.type = "lowpass";
      windFilter.frequency.setValueAtTime(320, ctx.currentTime);
      windFilter.Q.setValueAtTime(1.5, ctx.currentTime);

      // Slow wind gust modulator (0.05 Hz = 20s gust cycles)
      const windLFO = ctx.createOscillator();
      windLFO.frequency.setValueAtTime(0.05, ctx.currentTime);

      const windLFOGain = ctx.createGain();
      windLFOGain.gain.setValueAtTime(140, ctx.currentTime); // Modulates filter cutoff ±140Hz

      // Connections: Noise -> Filter -> Volume channel
      windNoise.connect(windFilter);
      windFilter.connect(windGain);

      // Connections: LFO -> LFO-Gain -> Filter Frequency (modulator loop)
      windLFO.connect(windLFOGain);
      windLFOGain.connect(windFilter.frequency);

      // Start wind nodes
      windNoise.start(0);
      windLFO.start(0);
      windSourceRef.current = windNoise;
      windLFORef.current = windLFO;

      // 4. SYNTHESIZE DYNAMIC COZY CRICKETS
      const scheduleCrickets = () => {
        if (!isPlayingRef.current || !audioCtxRef.current) return;
        const cCtx = audioCtxRef.current;

        // Schedule triple-chirp pulses (chirp chirp chirp ... wait)
        const now = cCtx.currentTime;
        const baseFreq = 4200 + Math.random() * 400; // Natural frequency variety

        for (let chirp = 0; chirp < 3; chirp++) {
          const chirpStart = now + chirp * 0.12;
          const chirpDuration = 0.05;

          const osc = cCtx.createOscillator();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(baseFreq, chirpStart);

          // Fast frequency pitch bend down during chirp (adds realistic insect rasp)
          osc.frequency.exponentialRampToValueAtTime(baseFreq - 600, chirpStart + chirpDuration);

          const env = cCtx.createGain();
          env.gain.setValueAtTime(0, chirpStart);
          env.gain.linearRampToValueAtTime(0.08, chirpStart + 0.01); // Quick attack
          env.gain.exponentialRampToValueAtTime(0.001, chirpStart + chirpDuration); // Exponential decay

          osc.connect(env);
          env.connect(cricketGain);

          osc.start(chirpStart);
          osc.stop(chirpStart + chirpDuration + 0.05);
        }

        // Schedule next random chirp group sequence
        const interval = 1200 + Math.random() * 1000;
        const timerId = window.setTimeout(scheduleCrickets, interval);
        schedulerTimersRef.current.push(timerId);
      };

      // 5. SYNTHESIZE COZY CAMPFIRE CRACKLES
      const scheduleCampfire = () => {
        if (!isPlayingRef.current || !audioCtxRef.current) return;
        const fCtx = audioCtxRef.current;
        const now = fCtx.currentTime;

        // Wood pop (sudden high-pass sharp impulse click)
        const clickOsc = fCtx.createOscillator();
        clickOsc.type = "sine";
        clickOsc.frequency.setValueAtTime(800 + Math.random() * 2000, now);

        const clickEnv = fCtx.createGain();
        clickEnv.gain.setValueAtTime(0, now);
        clickEnv.gain.linearRampToValueAtTime(0.12, now + 0.001); // Instant attack
        clickEnv.gain.exponentialRampToValueAtTime(0.001, now + 0.015); // Tiny decay (crackling tick)

        clickOsc.connect(clickEnv);
        clickEnv.connect(fireGain);

        clickOsc.start(now);
        clickOsc.stop(now + 0.03);

        // Low frequency wood ember rumble (slow rumbling pops)
        if (Math.random() > 0.6) {
          const rumbleOsc = fCtx.createOscillator();
          rumbleOsc.type = "triangle";
          rumbleOsc.frequency.setValueAtTime(60 + Math.random() * 40, now);

          const rumbleEnv = fCtx.createGain();
          rumbleEnv.gain.setValueAtTime(0, now);
          rumbleEnv.gain.linearRampToValueAtTime(0.05, now + 0.05);
          rumbleEnv.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

          rumbleOsc.connect(rumbleEnv);
          rumbleEnv.connect(fireGain);

          rumbleOsc.start(now);
          rumbleOsc.stop(now + 0.3);
        }

        // Schedule next crackle impulse
        const interval = 80 + Math.random() * 250; // Random crackle frequency
        const timerId = window.setTimeout(scheduleCampfire, interval);
        schedulerTimersRef.current.push(timerId);
      };

      // Set active playing triggers
      isPlayingRef.current = true;

      // Warm, smooth master fade-in over 1.5 seconds to avoid audio shocks
      masterGain.gain.linearRampToValueAtTime(1.0, ctx.currentTime + 1.5);

      // Start scheduling loops
      scheduleCrickets();
      scheduleCampfire();
    } catch (err) {
      console.warn("Failed to initialize procedural soundscape engine:", err);
    }
  }, []);

  // Gracefully stop the soundscape with a fade-out to prevent loud pops
  const stopSoundscape = useCallback(() => {
    if (!isPlayingRef.current) return;

    const ctx = audioCtxRef.current;
    if (ctx && masterGainRef.current) {
      const now = ctx.currentTime;
      masterGainRef.current.gain.cancelScheduledValues(now);
      // Soft fade out over 0.6 seconds
      masterGainRef.current.gain.setValueAtTime(masterGainRef.current.gain.value, now);
      masterGainRef.current.gain.linearRampToValueAtTime(0, now + 0.6);

      // Complete shutdown of oscillators and loops after fade out completes
      setTimeout(() => {
        cleanupSoundscape();
      }, 700);
    } else {
      cleanupSoundscape();
    }
  }, [cleanupSoundscape]);

  // Instantly synthesize a physical crackle popup on stoking
  const triggerManualCrackle = useCallback(() => {
    // Only synthesize if sound is active and playing
    if (!isPlayingRef.current || !audioCtxRef.current || !fireGainRef.current) return;
    const ctx = audioCtxRef.current;
    const now = ctx.currentTime;

    // Wood pop (sudden high-frequency sharp impulse click)
    const clickOsc = ctx.createOscillator();
    clickOsc.type = "sine";
    clickOsc.frequency.setValueAtTime(1200 + Math.random() * 1800, now);

    const clickEnv = ctx.createGain();
    clickEnv.gain.setValueAtTime(0, now);
    clickEnv.gain.linearRampToValueAtTime(0.24, now + 0.001); // Louder attack for active interaction!
    clickEnv.gain.exponentialRampToValueAtTime(0.001, now + 0.022); // Fast decay

    clickOsc.connect(clickEnv);
    clickEnv.connect(fireGainRef.current);

    clickOsc.start(now);
    clickOsc.stop(now + 0.04);

    // Dynamic low-frequency snap resonance
    const resonantOsc = ctx.createOscillator();
    resonantOsc.type = "triangle";
    resonantOsc.frequency.setValueAtTime(90 + Math.random() * 60, now);

    const resonantEnv = ctx.createGain();
    resonantEnv.gain.setValueAtTime(0, now);
    resonantEnv.gain.linearRampToValueAtTime(0.12, now + 0.04);
    resonantEnv.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    resonantOsc.connect(resonantEnv);
    resonantEnv.connect(fireGainRef.current);

    resonantOsc.start(now);
    resonantOsc.stop(now + 0.2);
  }, []);

  // Listen for navbar mute/unmute custom triggers
  useEffect(() => {
    const handleToggle = (e: Event) => {
      const customEvent = e as CustomEvent<{ enabled: boolean }>;
      const shouldPlay = customEvent.detail.enabled;

      if (shouldPlay) {
        startSoundscape();
      } else {
        stopSoundscape();
      }
    };

    window.addEventListener("nature-sound-toggle", handleToggle);
    globalThis.addEventListener("nature-campfire-crackle", triggerManualCrackle);
    return () => {
      window.removeEventListener("nature-sound-toggle", handleToggle);
      globalThis.removeEventListener("nature-campfire-crackle", triggerManualCrackle);
      cleanupSoundscape();
    };
  }, [startSoundscape, stopSoundscape, cleanupSoundscape, triggerManualCrackle]);

  return null; // Silent component that acts strictly as the audio canvas controller
};
