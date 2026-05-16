'use client';

import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { HeartPulse, RotateCcw } from 'lucide-react';
import type { SubjectLesson } from '@/lib/subjects/types';

type Organ = {
  id: string;
  label: string;
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  description: string;
  systems: ('digestive' | 'respiratory' | 'circulatory' | 'skeletal')[];
};

const ORGANS: Organ[] = [
  { id: 'skull', label: 'Skull', position: [0, 2.6, 0], size: [0.9, 1, 0.9], color: '#e2e8f0', description: 'Protects the brain.', systems: ['skeletal'] },
  { id: 'lungs', label: 'Lungs', position: [0, 1.1, 0], size: [1.6, 1.1, 0.8], color: '#22d3ee', description: 'Exchange oxygen and carbon dioxide.', systems: ['respiratory'] },
  { id: 'heart', label: 'Heart', position: [-0.25, 1.05, 0.25], size: [0.55, 0.55, 0.55], color: '#fb7185', description: 'Pumps blood around the body.', systems: ['circulatory'] },
  { id: 'stomach', label: 'Stomach', position: [-0.35, 0.25, 0.05], size: [0.65, 0.55, 0.5], color: '#fdba74', description: 'Breaks down food with acid + enzymes.', systems: ['digestive'] },
  { id: 'intestine', label: 'Intestines', position: [0, -0.3, 0.05], size: [1.2, 0.7, 0.55], color: '#ffc43b', description: 'Absorb nutrients from digested food.', systems: ['digestive'] },
  { id: 'spine', label: 'Spine', position: [0, 0.6, -0.45], size: [0.2, 2.4, 0.2], color: '#e2e8f0', description: 'Supports the body and protects the spinal cord.', systems: ['skeletal'] },
];

const SYSTEMS = [
  { id: 'digestive' as const, label: 'Digestive', color: '#ffc43b' },
  { id: 'respiratory' as const, label: 'Respiratory', color: '#22d3ee' },
  { id: 'circulatory' as const, label: 'Circulatory', color: '#fb7185' },
  { id: 'skeletal' as const, label: 'Skeletal', color: '#e2e8f0' },
];

function BodyScene({ activeSystem, activeId }: { activeSystem: string; activeId: string | null }) {
  return (
    <>
      <mesh>
        <capsuleGeometry args={[0.95, 3.5, 8, 16]} />
        <meshStandardMaterial color="#1f78ff" transparent opacity={0.06} wireframe />
      </mesh>
      {ORGANS.map((o) => {
        const isPart = o.systems.includes(activeSystem as Organ['systems'][number]);
        const isActive = activeId === o.id;
        return (
          <group key={o.id} position={o.position}>
            <mesh>
              <boxGeometry args={o.size} />
              <meshStandardMaterial
                color={o.color}
                emissive={o.color}
                emissiveIntensity={isActive ? 0.8 : isPart ? 0.4 : 0.1}
                roughness={0.45}
                metalness={0.12}
                transparent
                opacity={isPart ? 1 : 0.35}
              />
            </mesh>
            {isActive && (
              <Text position={[0, o.size[1] + 0.4, 0]} fontSize={0.22} color="#ffffff" anchorX="center" anchorY="middle" outlineWidth={0.02} outlineColor="#050711">
                {o.label}
              </Text>
            )}
          </group>
        );
      })}
    </>
  );
}

export function BodySystem3D({ lesson: _lesson }: { lesson: SubjectLesson }) {
  void _lesson;
  const [system, setSystem] = useState<typeof SYSTEMS[number]['id']>('digestive');
  const [activeId, setActiveId] = useState<string | null>('stomach');

  const reset = () => {
    setSystem('digestive');
    setActiveId('stomach');
  };

  const organsInSystem = ORGANS.filter((o) => o.systems.includes(system));
  const active = ORGANS.find((o) => o.id === activeId);

  return (
    <div className="flex h-full min-h-[460px] flex-col rounded-lg border border-white/10 bg-gradient-to-br from-[#062019] via-[#06121e] to-[#050711] p-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-md border border-[#34d399]/40 bg-[#34d399]/10 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-[#34d399]">
            <HeartPulse className="h-3 w-3" />
            Body Systems 3D
          </div>
          <p className="mt-2 text-sm font-black text-white">Toggle systems to see organs light up.</p>
        </div>
        <button
          onClick={reset}
          className="inline-flex items-center gap-1 rounded-md border border-white/15 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-slate-300 transition hover:border-white/40 hover:text-white"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </button>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
        {SYSTEMS.map((s) => {
          const active = system === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setSystem(s.id)}
              className="rounded-md border px-2 py-1.5 text-[11px] font-black uppercase tracking-wide transition"
              style={{
                borderColor: active ? s.color : 'rgba(255,255,255,.15)',
                background: active ? `${s.color}22` : 'transparent',
                color: active ? s.color : '#cbd5e1',
              }}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      <div className="mt-3 h-56 rounded-md border border-white/10 bg-[#050711]">
        <Canvas camera={{ position: [4, 1.5, 5], fov: 45 }} dpr={[1, 1.5]}>
          <color attach="background" args={['#050711']} />
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 8, 5]} intensity={1.2} />
          <pointLight position={[-3, 2, -3]} color="#22d3ee" intensity={14} />
          <Suspense fallback={null}>
            <BodyScene activeSystem={system} activeId={activeId} />
          </Suspense>
          <OrbitControls enablePan={false} autoRotate autoRotateSpeed={0.4} />
        </Canvas>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {organsInSystem.map((o) => {
          const a = activeId === o.id;
          return (
            <button
              key={o.id}
              onClick={() => setActiveId(o.id)}
              className="rounded-md border px-2 py-1 text-[11px] font-black uppercase tracking-wide transition"
              style={{
                borderColor: a ? o.color : 'rgba(255,255,255,.15)',
                background: a ? `${o.color}22` : 'transparent',
                color: a ? o.color : '#cbd5e1',
              }}
            >
              {o.label}
            </button>
          );
        })}
      </div>

      {active && (
        <div className="mt-3 rounded-md border p-3" style={{ borderColor: `${active.color}40`, background: `${active.color}10` }}>
          <p className="text-[10px] font-black uppercase tracking-wide" style={{ color: active.color }}>
            {active.label}
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-200">{active.description}</p>
        </div>
      )}
    </div>
  );
}
