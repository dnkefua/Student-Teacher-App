'use client';

import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Globe, RotateCcw } from 'lucide-react';
import type { SubjectLesson } from '@/lib/subjects/types';

type Planet = { name: string; distance: number; size: number; color: string; speed: number };

const PLANETS: Planet[] = [
  { name: 'Mercury', distance: 1.4, size: 0.13, color: '#a3a3a3', speed: 1.6 },
  { name: 'Venus', distance: 2.0, size: 0.22, color: '#fdba74', speed: 1.18 },
  { name: 'Earth', distance: 2.7, size: 0.24, color: '#22d3ee', speed: 1.0 },
  { name: 'Mars', distance: 3.4, size: 0.18, color: '#fb7185', speed: 0.8 },
  { name: 'Jupiter', distance: 4.6, size: 0.55, color: '#fdba74', speed: 0.43 },
  { name: 'Saturn', distance: 5.8, size: 0.48, color: '#facc15', speed: 0.32 },
];

function System() {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, i) => {
      const planet = PLANETS[i];
      if (!planet) return;
      const t = clock.elapsedTime * planet.speed * 0.5;
      child.position.x = Math.cos(t) * planet.distance;
      child.position.z = Math.sin(t) * planet.distance;
    });
  });

  return (
    <>
      {/* Sun */}
      <mesh>
        <sphereGeometry args={[0.6, 24, 24]} />
        <meshStandardMaterial color="#ffc43b" emissive="#f59e0b" emissiveIntensity={1.4} />
      </mesh>
      <pointLight position={[0, 0, 0]} intensity={120} color="#ffc43b" />

      {/* Orbit rings */}
      {PLANETS.map((p) => (
        <mesh key={`ring-${p.name}`} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[p.distance - 0.01, p.distance + 0.01, 96]} />
          <meshBasicMaterial color="#1f78ff" transparent opacity={0.25} side={THREE.DoubleSide} />
        </mesh>
      ))}

      {/* Planets */}
      <group ref={groupRef}>
        {PLANETS.map((p) => (
          <mesh key={p.name}>
            <sphereGeometry args={[p.size, 22, 22]} />
            <meshStandardMaterial color={p.color} emissive={p.color} emissiveIntensity={0.45} roughness={0.5} />
          </mesh>
        ))}
      </group>
    </>
  );
}

export function EarthSpaceOrbit({ lesson: _lesson }: { lesson: SubjectLesson }) {
  void _lesson;

  return (
    <div className="flex h-full min-h-[460px] flex-col rounded-lg border border-white/10 bg-gradient-to-br from-[#062019] via-[#06121e] to-[#050711] p-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-md border border-[#34d399]/40 bg-[#34d399]/10 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-[#34d399]">
            <Globe className="h-3 w-3" />
            Earth & Space · Orbit
          </div>
          <p className="mt-2 text-sm font-black text-white">Inner planets + gas giants in motion.</p>
          <p className="text-[11px] text-slate-400">Drag to rotate the view. Orbit speeds are scaled for clarity.</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-1 rounded-md border border-white/15 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-slate-300 transition hover:border-white/40 hover:text-white"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </button>
      </div>

      <div className="mt-3 h-72 flex-1 rounded-md border border-white/10 bg-[#050711]">
        <Canvas camera={{ position: [0, 5, 8], fov: 50 }} dpr={[1, 1.5]}>
          <color attach="background" args={['#02030a']} />
          <ambientLight intensity={0.2} />
          <Suspense fallback={null}>
            <System />
          </Suspense>
          <OrbitControls enablePan={false} enableZoom autoRotate autoRotateSpeed={0.18} />
        </Canvas>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-1.5 sm:grid-cols-6">
        {PLANETS.map((p) => (
          <div
            key={p.name}
            className="rounded-md border px-2 py-1.5 text-center"
            style={{ borderColor: `${p.color}55`, background: `${p.color}10` }}
          >
            <p className="text-[10px] font-black uppercase tracking-wide" style={{ color: p.color }}>
              {p.name}
            </p>
            <p className="mt-0.5 text-[10px] text-slate-300">{p.distance.toFixed(1)} AU</p>
          </div>
        ))}
      </div>
    </div>
  );
}
