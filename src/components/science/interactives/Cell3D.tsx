'use client';

import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { Dna, RotateCcw } from 'lucide-react';
import type { SubjectLesson } from '@/lib/subjects/types';

type CellKind = 'animal' | 'plant';

type Organelle = {
  id: string;
  label: string;
  position: [number, number, number];
  size: number;
  color: string;
  function: string;
  plantOnly?: boolean;
  animalOnly?: boolean;
};

const ORGANELLES: Organelle[] = [
  { id: 'nucleus', label: 'Nucleus', position: [0, 0, 0], size: 0.85, color: '#c084fc', function: 'Control centre — holds DNA.' },
  { id: 'mitochondria-1', label: 'Mitochondrion', position: [1.5, 0.6, 0.4], size: 0.4, color: '#fb7185', function: 'Site of aerobic respiration — releases energy.' },
  { id: 'mitochondria-2', label: 'Mitochondrion', position: [-1.4, -0.5, 0.8], size: 0.36, color: '#fb7185', function: 'Site of aerobic respiration — releases energy.' },
  { id: 'ribosome-1', label: 'Ribosome', position: [0.8, -1.2, 0.5], size: 0.2, color: '#ffc43b', function: 'Builds proteins from amino acids.' },
  { id: 'ribosome-2', label: 'Ribosome', position: [-0.8, 1.2, -0.2], size: 0.2, color: '#ffc43b', function: 'Builds proteins from amino acids.' },
  { id: 'chloroplast-1', label: 'Chloroplast', position: [-1.6, 0.9, -0.6], size: 0.5, color: '#34d399', function: 'Site of photosynthesis — only in plants.', plantOnly: true },
  { id: 'chloroplast-2', label: 'Chloroplast', position: [1.4, -0.9, -0.6], size: 0.45, color: '#34d399', function: 'Site of photosynthesis — only in plants.', plantOnly: true },
  { id: 'vacuole', label: 'Vacuole', position: [0, 1.4, 0.2], size: 1.0, color: '#7dd3fc', function: 'Large permanent storage — keeps plant cell turgid.', plantOnly: true },
  { id: 'lysosome', label: 'Lysosome', position: [0, -1.4, -0.3], size: 0.3, color: '#fdba74', function: 'Breaks down waste inside the cell.', animalOnly: true },
];

function CellScene({ kind, activeId }: { kind: CellKind; activeId: string | null }) {
  const organelles = ORGANELLES.filter((o) => {
    if (kind === 'animal' && o.plantOnly) return false;
    if (kind === 'plant' && o.animalOnly) return false;
    return true;
  });

  return (
    <>
      {/* Cell membrane / wall */}
      <mesh>
        <sphereGeometry args={[3, 36, 36]} />
        <meshStandardMaterial
          color={kind === 'plant' ? '#0ea5e9' : '#1f78ff'}
          transparent
          opacity={0.08}
          wireframe
        />
      </mesh>
      {kind === 'plant' && (
        <mesh>
          <boxGeometry args={[5.6, 5.6, 5.6]} />
          <meshStandardMaterial color="#34d399" transparent opacity={0.06} wireframe />
        </mesh>
      )}

      {organelles.map((o) => {
        const isActive = activeId === o.id;
        return (
          <group key={o.id} position={o.position}>
            <mesh>
              <sphereGeometry args={[o.size, 20, 20]} />
              <meshStandardMaterial
                color={o.color}
                emissive={o.color}
                emissiveIntensity={isActive ? 0.85 : 0.3}
                roughness={0.4}
                metalness={0.15}
              />
            </mesh>
            {isActive && (
              <Text position={[0, o.size + 0.3, 0]} fontSize={0.22} color="#ffffff" anchorX="center" anchorY="middle" outlineWidth={0.02} outlineColor="#050711">
                {o.label}
              </Text>
            )}
          </group>
        );
      })}
    </>
  );
}

export function Cell3D({ lesson: _lesson }: { lesson: SubjectLesson }) {
  void _lesson;
  const [kind, setKind] = useState<CellKind>('animal');
  const [activeId, setActiveId] = useState<string | null>('nucleus');

  const visibleOrganelles = ORGANELLES.filter((o) => {
    if (kind === 'animal' && o.plantOnly) return false;
    if (kind === 'plant' && o.animalOnly) return false;
    return true;
  });

  const dedupedByLabel: Organelle[] = [];
  const seen = new Set<string>();
  visibleOrganelles.forEach((o) => {
    if (!seen.has(o.label)) {
      seen.add(o.label);
      dedupedByLabel.push(o);
    }
  });

  const active = ORGANELLES.find((o) => o.id === activeId) ?? null;

  return (
    <div className="flex h-full min-h-[460px] flex-col rounded-lg border border-white/10 bg-gradient-to-br from-[#062019] via-[#06121e] to-[#050711] p-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-md border border-[#34d399]/40 bg-[#34d399]/10 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-[#34d399]">
            <Dna className="h-3 w-3" />
            Cell 3D
          </div>
          <p className="mt-2 text-sm font-black text-white">{kind === 'animal' ? 'Animal cell' : 'Plant cell'}</p>
          <p className="text-[11px] text-slate-400">Click any organelle to inspect it.</p>
        </div>
        <button
          onClick={() => {
            setKind('animal');
            setActiveId('nucleus');
          }}
          className="inline-flex items-center gap-1 rounded-md border border-white/15 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-slate-300 transition hover:border-white/40 hover:text-white"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </button>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-1.5">
        {(['animal', 'plant'] as const).map((k) => {
          const active = kind === k;
          return (
            <button
              key={k}
              onClick={() => setKind(k)}
              className="rounded-md border px-2 py-1.5 text-xs font-black uppercase tracking-wide transition"
              style={{
                borderColor: active ? '#34d399' : 'rgba(255,255,255,.15)',
                background: active ? '#34d39922' : 'transparent',
                color: active ? '#34d399' : '#cbd5e1',
              }}
            >
              {k === 'animal' ? 'Animal cell' : 'Plant cell'}
            </button>
          );
        })}
      </div>

      <div className="mt-3 h-56 rounded-md border border-white/10 bg-[#050711]">
        <Canvas camera={{ position: [5, 4, 7], fov: 45 }} dpr={[1, 1.5]}>
          <color attach="background" args={['#050711']} />
          <ambientLight intensity={0.75} />
          <directionalLight position={[5, 8, 5]} intensity={1.3} />
          <pointLight position={[-4, 3, -3]} color="#49c8ff" intensity={15} />
          <Suspense fallback={null}>
            <CellScene kind={kind} activeId={activeId} />
          </Suspense>
          <OrbitControls enablePan={false} autoRotate autoRotateSpeed={0.4} />
        </Canvas>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {dedupedByLabel.map((o) => {
          const isActive = activeId?.startsWith(o.id.split('-')[0]);
          return (
            <button
              key={o.label}
              onClick={() => setActiveId(o.id)}
              className="rounded-md border px-2 py-1 text-[11px] font-black uppercase tracking-wide transition"
              style={{
                borderColor: isActive ? o.color : 'rgba(255,255,255,.15)',
                background: isActive ? `${o.color}22` : 'transparent',
                color: isActive ? o.color : '#cbd5e1',
              }}
            >
              <span className="mr-1 inline-block h-2 w-2 rounded-full" style={{ background: o.color }} />
              {o.label}
            </button>
          );
        })}
      </div>

      {active && (
        <div
          className="mt-3 rounded-md border p-3"
          style={{ borderColor: `${active.color}40`, background: `${active.color}10` }}
        >
          <p className="text-[10px] font-black uppercase tracking-wide" style={{ color: active.color }}>
            {active.label}
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-200">{active.function}</p>
        </div>
      )}
    </div>
  );
}
