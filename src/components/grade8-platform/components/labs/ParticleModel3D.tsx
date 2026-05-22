'use client';

/**
 * Interactive 3D States of Matter visualisation.
 *
 * Ported from the legacy science studio into the new grade8 platform.
 * Renders 64 instanced spheres whose vibration / spread / colour respond
 * to the selected state (solid / liquid / gas) so a student can see —
 * not just read about — how particle behaviour changes with temperature.
 *
 * The lab is self-contained: no dependency on the legacy SubjectLesson
 * type, so the underlying English/Science studio files can be retired
 * without affecting this component.
 */

import React, { Suspense, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Atom, RotateCcw, Thermometer } from 'lucide-react';

type State = 'solid' | 'liquid' | 'gas';

const STATE_CONFIG: Record<
  State,
  { speed: number; spread: number; color: string; label: string; description: string; tempLabel: string }
> = {
  solid: {
    speed: 0.18,
    spread: 1.0,
    color: '#49c8ff',
    label: 'Solid',
    description:
      'Particles vibrate in a fixed, regular lattice. Forces of attraction are strong. Definite shape, definite volume.',
    tempLabel: 'Coldest',
  },
  liquid: {
    speed: 0.65,
    spread: 1.45,
    color: '#34d399',
    label: 'Liquid',
    description:
      'Particles touch but slide past each other. Forces are weaker than in solids. No fixed shape — fills the container.',
    tempLabel: 'Warmer',
  },
  gas: {
    speed: 1.6,
    spread: 2.2,
    color: '#ffc43b',
    label: 'Gas',
    description:
      'Particles fly freely with large empty spaces. Forces are very weak. No fixed shape, no fixed volume — expands to fill any container.',
    tempLabel: 'Hottest',
  },
};

const PARTICLE_COUNT = 64;

function Particles({ state }: { state: State }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const config = STATE_CONFIG[state];

  // One-time generation of each particle's "home" lattice position plus a
  // random phase so the animation is varied but deterministic.
  const seeds = useMemo(() => {
    const arr: { homeX: number; homeY: number; homeZ: number; phase: number }[] = [];
    const side = Math.ceil(Math.cbrt(PARTICLE_COUNT));
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const x = (i % side) - side / 2 + 0.5;
      const y = (Math.floor(i / side) % side) - side / 2 + 0.5;
      const z = Math.floor(i / (side * side)) - side / 2 + 0.5;
      // Deterministic pseudo-random seed so the same particle gets the
      // same starting phase every render — avoids visible jumps.
      const phaseSeed = ((i * 9301 + 49297) % 233280) / 233280;
      arr.push({ homeX: x * 0.65, homeY: y * 0.65, homeZ: z * 0.65, phase: phaseSeed * Math.PI * 2 });
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.elapsedTime;
    seeds.forEach((s, i) => {
      const phase = s.phase + t * (state === 'gas' ? 2.4 : state === 'liquid' ? 1.2 : 0.8);
      const wobble = config.speed;
      const spread = config.spread;
      dummy.position.set(
        s.homeX * spread + Math.sin(phase * 1.3) * wobble,
        s.homeY * spread + Math.cos(phase * 1.7) * wobble,
        s.homeZ * spread + Math.sin(phase * 2.1) * wobble,
      );
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
      <sphereGeometry args={[0.22, 18, 18]} />
      <meshStandardMaterial
        color={config.color}
        emissive={config.color}
        emissiveIntensity={0.45}
        roughness={0.4}
        metalness={0.15}
      />
    </instancedMesh>
  );
}

export function ParticleModel3D() {
  const [state, setState] = useState<State>('solid');
  const [trail, setTrail] = useState<State[]>(['solid']);

  const change = (next: State) => {
    setState(next);
    // Keep a short trail of recent state choices so students can see the
    // sequence of transitions they explored (e.g. solid → liquid → gas).
    setTrail((prev) => [...prev, next].slice(-6));
  };

  const config = STATE_CONFIG[state];

  return (
    <div className="flex h-full min-h-[520px] flex-col rounded-lg border border-white/10 bg-gradient-to-br from-[#062019] via-[#06121e] to-[#050711] p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-1.5 rounded-md border border-emerald-400/40 bg-emerald-400/10 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-emerald-300">
            <Atom className="h-3 w-3" />
            States of Matter — Particle Model 3D
          </div>
          <p className="mt-2 text-lg font-black text-white">{config.label}</p>
          <p className="mt-0.5 text-xs leading-5 text-slate-400">{config.description}</p>
        </div>
        <button
          onClick={() => {
            setState('solid');
            setTrail(['solid']);
          }}
          className="inline-flex items-center gap-1 rounded-md border border-white/15 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-slate-300 transition hover:border-white/40 hover:text-white"
        >
          <RotateCcw className="h-3 w-3" /> Reset
        </button>
      </div>

      <div className="mt-3 flex-1 min-h-[260px] rounded-md border border-white/10 bg-[#050711]">
        <Canvas camera={{ position: [4.5, 3.5, 6], fov: 45 }} dpr={[1, 1.5]}>
          <color attach="background" args={['#050711']} />
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 8, 5]} intensity={1.2} />
          <pointLight position={[-3, 2, -3]} color={config.color} intensity={18} />
          <Suspense fallback={null}>
            <Particles state={state} />
          </Suspense>
          <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.4} />
        </Canvas>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-1.5">
        {(['solid', 'liquid', 'gas'] as const).map((s) => {
          const c = STATE_CONFIG[s];
          const active = state === s;
          return (
            <button
              key={s}
              onClick={() => change(s)}
              className="flex flex-col items-center gap-0.5 rounded-md border px-2 py-2 text-xs font-black uppercase tracking-wide transition"
              style={{
                borderColor: active ? c.color : 'rgba(255,255,255,.15)',
                background: active ? `${c.color}22` : 'transparent',
                color: active ? c.color : '#cbd5e1',
              }}
            >
              <span>{c.label}</span>
              <span className="flex items-center gap-1 text-[9px] font-semibold opacity-70">
                <Thermometer className="h-3 w-3" />
                {c.tempLabel}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400">
        <span className="font-black text-slate-500">Trail ·</span>
        {trail.map((s, i) => (
          <span key={i} style={{ color: STATE_CONFIG[s].color }}>
            {STATE_CONFIG[s].label}
            {i < trail.length - 1 ? ' →' : ''}
          </span>
        ))}
      </div>

      <p className="mt-3 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-[11px] leading-5 text-slate-300">
        <strong className="text-white">Why this matters:</strong> adding heat (energy) pushes particles
        further apart and makes them move faster. That is why solids melt to liquids, and liquids boil
        to gases — same particles, just more energy.
      </p>
    </div>
  );
}
