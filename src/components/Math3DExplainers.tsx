'use client';

import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import type { ThreeDType } from '@/lib/grade8Curriculum';

type SceneCardProps = {
  title: string;
  caption: string;
  children: React.ReactNode;
};

function SceneCard({ title, caption, children }: SceneCardProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-[#061126] shadow-[0_24px_80px_rgba(5,7,17,.24)]">
      <div className="h-52 sm:h-64 md:h-72">
        <Canvas camera={{ position: [5, 4, 7], fov: 42 }} dpr={[1, 1.5]}>
          <color attach="background" args={['#050711']} />
          <ambientLight intensity={0.75} />
          <directionalLight position={[5, 8, 5]} intensity={1.4} />
          <pointLight position={[-4, 3, -3]} color="#49c8ff" intensity={20} />
          <Suspense fallback={null}>{children}</Suspense>
          <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.55} />
        </Canvas>
      </div>
      <div className="border-t border-white/10 p-4">
        <p className="text-sm font-black uppercase tracking-wide text-[#ffc43b]">{title}</p>
        <p className="mt-2 text-sm leading-6 text-slate-300">{caption}</p>
      </div>
    </div>
  );
}

function FloatingGroup({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.position.y = Math.sin(clock.elapsedTime * 1.25) * 0.08;
  });
  return <group ref={group}>{children}</group>;
}

function Label({ children, position }: { children: React.ReactNode; position: [number, number, number] }) {
  return (
    <Text position={position} fontSize={0.24} color="#ffffff" anchorX="center" anchorY="middle" outlineWidth={0.01} outlineColor="#050711">
      {children}
    </Text>
  );
}

export function Pythagoras3D() {
  return (
    <SceneCard
      title="Pythagoras3D"
      caption="Students see the two smaller squares combine to match the square on the hypotenuse."
    >
      <FloatingGroup>
        <mesh position={[-1.25, -0.65, 0]} rotation={[0, 0, 0]}>
          <boxGeometry args={[2.4, 0.08, 1.8]} />
          <meshStandardMaterial color="#10295f" roughness={0.45} metalness={0.2} />
        </mesh>
        <mesh position={[-1.8, 0.02, 0.1]} rotation={[0, 0, 0]}>
          <boxGeometry args={[1.2, 0.08, 1.2]} />
          <meshStandardMaterial color="#49c8ff" emissive="#0ea5e9" emissiveIntensity={0.25} />
        </mesh>
        <mesh position={[-0.45, 0.27, 0.1]}>
          <boxGeometry args={[0.82, 0.08, 0.82]} />
          <meshStandardMaterial color="#ffc43b" emissive="#f59e0b" emissiveIntensity={0.22} />
        </mesh>
        <mesh position={[1.05, 0.1, 0.1]} rotation={[0, 0, -0.65]}>
          <boxGeometry args={[1.75, 0.08, 1.75]} />
          <meshStandardMaterial color="#ffffff" roughness={0.32} metalness={0.08} />
        </mesh>
        <lineSegments position={[-0.8, 0.25, 1.12]}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array([-1.2, 0, 0, 0.8, 0, 0, -1.2, 0, 0, -1.2, 1.3, 0, -1.2, 1.3, 0, 0.8, 0, 0]), 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#ff3d22" linewidth={2} />
        </lineSegments>
        <Label position={[-1.8, 0.25, 1]}>a²</Label>
        <Label position={[-0.45, 0.48, 0.72]}>b²</Label>
        <Label position={[1.05, 0.6, 1.18]}>c²</Label>
        <Label position={[0.05, -0.95, 1.2]}>a² + b² = c²</Label>
      </FloatingGroup>
    </SceneCard>
  );
}

function BalanceScene() {
  const beam = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!beam.current) return;
    beam.current.rotation.z = Math.sin(clock.elapsedTime * 1.5) * 0.03;
  });

  return (
    <FloatingGroup>
        <mesh position={[0, -0.4, 0]}>
          <cylinderGeometry args={[0.08, 0.24, 1.1, 24]} />
          <meshStandardMaterial color="#d8f6ff" metalness={0.35} roughness={0.35} />
        </mesh>
        <mesh ref={beam} position={[0, 0.25, 0]}>
          <boxGeometry args={[4.6, 0.08, 0.18]} />
          <meshStandardMaterial color="#ffc43b" emissive="#f59e0b" emissiveIntensity={0.18} />
        </mesh>
        {[-1.75, 1.75].map((x) => (
          <group key={x} position={[x, -0.12, 0]}>
            <mesh>
              <cylinderGeometry args={[0.75, 0.75, 0.06, 48]} />
              <meshStandardMaterial color="#0d1e43" metalness={0.15} roughness={0.42} />
            </mesh>
            <mesh position={[0, -0.05, 0]}>
              <torusGeometry args={[0.76, 0.02, 8, 48]} />
              <meshStandardMaterial color="#49c8ff" emissive="#49c8ff" emissiveIntensity={0.4} />
            </mesh>
          </group>
        ))}
        {[0, 1, 2, 3, 4].map((index) => (
          <mesh key={index} position={[-2.18 + index * 0.22, 0.28, 0.05]}>
            <boxGeometry args={[0.18, 0.22, 0.18]} />
            <meshStandardMaterial color="#49c8ff" />
          </mesh>
        ))}
        <mesh position={[-1.15, 0.28, 0.05]}>
          <boxGeometry args={[0.34, 0.22, 0.18]} />
          <meshStandardMaterial color="#ff3d22" />
        </mesh>
        {[0, 1, 2, 3, 4].map((index) => (
          <mesh key={index} position={[1.28 + index * 0.22, 0.28, 0.05]}>
            <boxGeometry args={[0.18, 0.22, 0.18]} />
            <meshStandardMaterial color="#ffc43b" />
          </mesh>
        ))}
        <Label position={[-1.65, 0.78, 0.3]}>5x - 7</Label>
        <Label position={[1.75, 0.78, 0.3]}>28</Label>
        <Label position={[0, -1.15, 0.3]}>add 7, then divide by 5</Label>
    </FloatingGroup>
  );
}

export function EquationBalance3D() {
  return (
    <SceneCard
      title="EquationBalance3D"
      caption="The equation behaves like a scale: every inverse operation must happen on both sides."
    >
      <BalanceScene />
    </SceneCard>
  );
}

export function LinearGraph3D() {
  return (
    <SceneCard
      title="LinearGraph3D"
      caption="A line becomes a path: students can read gradient as rise over run instead of memorising it."
    >
      <FloatingGroup>
        <gridHelper args={[5.5, 11, '#18345f', '#18345f']} rotation={[0, 0, 0]} />
        <mesh position={[0, 0.02, 0]} rotation={[0, 0, -0.58]}>
          <boxGeometry args={[5.1, 0.07, 0.07]} />
          <meshStandardMaterial color="#49c8ff" emissive="#49c8ff" emissiveIntensity={0.32} />
        </mesh>
        <mesh position={[-2.5, 0.04, 0]}>
          <boxGeometry args={[5.2, 0.04, 0.04]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0, 0.04, -2.5]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[5.2, 0.04, 0.04]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        {[[-1.4, 0.22, 0.8], [-0.2, 0.22, 0.1], [1, 0.22, -0.6]].map((position, index) => (
          <mesh key={index} position={position as [number, number, number]}>
            <sphereGeometry args={[0.11, 24, 24]} />
            <meshStandardMaterial color="#ffc43b" emissive="#ffc43b" emissiveIntensity={0.28} />
          </mesh>
        ))}
        <Label position={[1.45, 0.55, -0.95]}>y = 2x + 1</Label>
        <Label position={[-0.6, 0.5, 1.2]}>rise 2</Label>
        <Label position={[0.5, 0.35, 0.42]}>run 1</Label>
      </FloatingGroup>
    </SceneCard>
  );
}

// ─── New 3D explainers ────────────────────────────────────────────────

function CircleLabScene() {
  const radius = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!radius.current) return;
    radius.current.rotation.z = clock.elapsedTime * 0.7;
  });
  const r = 1.5;
  return (
    <FloatingGroup>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[r, r, 0.06, 64]} />
        <meshStandardMaterial color="#0d1e43" metalness={0.2} roughness={0.45} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[r, 0.04, 16, 96]} />
        <meshStandardMaterial color="#49c8ff" emissive="#49c8ff" emissiveIntensity={0.5} />
      </mesh>
      <group ref={radius} position={[0, 0.04, 0]}>
        <mesh position={[r / 2, 0, 0]}>
          <boxGeometry args={[r, 0.04, 0.04]} />
          <meshStandardMaterial color="#ffc43b" emissive="#ffc43b" emissiveIntensity={0.45} />
        </mesh>
        <mesh position={[r, 0, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#ffc43b" emissive="#ffc43b" emissiveIntensity={0.6} />
        </mesh>
      </group>
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <boxGeometry args={[2 * r, 0.02, 0.02]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <Label position={[0.6, 0.2, 0.18]}>r</Label>
      <Label position={[0, 0.2, 1.05 * r]}>d = 2r</Label>
      <Label position={[1.65, 0.2, -1.2]}>C = 2πr</Label>
      <Label position={[-1.55, 0.2, -1.2]}>A = πr²</Label>
    </FloatingGroup>
  );
}

export function CircleLab3D() {
  return (
    <SceneCard
      title="CircleLab3D"
      caption="Watch the radius sweep the disc — circumference and area both grow from this single length."
    >
      <CircleLabScene />
    </SceneCard>
  );
}

function RatioMixerScene() {
  const ratio = [2, 3];
  const max = 1.6;
  const total = ratio.reduce((a, b) => a + b, 0);
  const fills = useRef<(THREE.Mesh | null)[]>([null, null]);
  useFrame(({ clock }) => {
    const t = (Math.sin(clock.elapsedTime * 0.6) + 1) / 2;
    fills.current.forEach((mesh, i) => {
      if (!mesh) return;
      const target = (ratio[i] / total) * max * t + 0.05;
      mesh.scale.y = target;
      mesh.position.y = target / 2 - max / 2;
    });
  });
  const colors = ['#49c8ff', '#ffc43b'];
  return (
    <FloatingGroup>
      {ratio.map((parts, i) => (
        <group key={i} position={[(i - 0.5) * 1.6, 0, 0]}>
          <mesh>
            <cylinderGeometry args={[0.55, 0.55, max, 32, 1, true]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.18} side={THREE.DoubleSide} />
          </mesh>
          <mesh
            ref={(el) => {
              fills.current[i] = el;
            }}
            position={[0, -max / 2 + 0.05, 0]}
          >
            <cylinderGeometry args={[0.52, 0.52, 1, 32]} />
            <meshStandardMaterial color={colors[i]} emissive={colors[i]} emissiveIntensity={0.32} />
          </mesh>
          <Label position={[0, max / 2 + 0.25, 0]}>{`${parts} parts`}</Label>
        </group>
      ))}
      <Label position={[0, -max / 2 - 0.35, 0]}>{`total ${total} parts`}</Label>
      <Label position={[0, max / 2 + 0.7, 0]}>{`${ratio[0]} : ${ratio[1]}`}</Label>
    </FloatingGroup>
  );
}

export function RatioMixer3D() {
  return (
    <SceneCard
      title="RatioMixer3D"
      caption="Each tank fills in proportion to its share. The taller tank gets a bigger slice of every total."
    >
      <RatioMixerScene />
    </SceneCard>
  );
}

function SolidGeometryScene() {
  const cube = useRef<THREE.Mesh>(null);
  const cyl = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (cube.current) cube.current.rotation.y = t * 0.6;
    if (cyl.current) cyl.current.rotation.y = -t * 0.5;
  });
  return (
    <FloatingGroup>
      <mesh ref={cube} position={[-1.6, 0, 0]}>
        <boxGeometry args={[1.4, 1, 0.9]} />
        <meshStandardMaterial color="#49c8ff" emissive="#49c8ff" emissiveIntensity={0.18} />
      </mesh>
      <Label position={[-1.6, 0.95, 0]}>cuboid</Label>
      <Label position={[-1.6, -0.95, 0]}>V = l × w × h</Label>

      <mesh ref={cyl} position={[1.3, 0, 0]}>
        <cylinderGeometry args={[0.55, 0.55, 1.2, 36]} />
        <meshStandardMaterial color="#ffc43b" emissive="#ffc43b" emissiveIntensity={0.18} />
      </mesh>
      <Label position={[1.3, 0.95, 0]}>cylinder</Label>
      <Label position={[1.3, -0.95, 0]}>V = πr²h</Label>

      <mesh position={[-2.4, -0.45, 0.7]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial color="#ff3d22" emissive="#ff3d22" emissiveIntensity={0.6} />
      </mesh>
      <Label position={[-2.55, -0.7, 0.7]}>l</Label>
      <mesh position={[-0.85, -0.45, 0.7]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial color="#ff3d22" emissive="#ff3d22" emissiveIntensity={0.6} />
      </mesh>
      <Label position={[-0.85, -0.45, 0.92]}>w</Label>
    </FloatingGroup>
  );
}

export function SolidGeometry3D() {
  return (
    <SceneCard
      title="SolidGeometry3D"
      caption="Volume of a prism comes from its base area times its height — the cuboid and cylinder share this rule."
    >
      <SolidGeometryScene />
    </SceneCard>
  );
}

function AngleLabScene() {
  const arm = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!arm.current) return;
    arm.current.rotation.y = Math.sin(clock.elapsedTime * 0.6) * 0.7 + 0.6;
  });
  return (
    <FloatingGroup>
      {/* parallel lines */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[4, 0.04, 0.04]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[4, 0.04, 0.04]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {/* transversal */}
      <mesh rotation={[0, 0, -0.85]}>
        <boxGeometry args={[2.6, 0.04, 0.04]} />
        <meshStandardMaterial color="#ffc43b" emissive="#ffc43b" emissiveIntensity={0.4} />
      </mesh>
      {/* rotating arm to suggest "any angle" exploration */}
      <mesh ref={arm} position={[1.3, 0, 0]}>
        <boxGeometry args={[1.2, 0.04, 0.04]} />
        <meshStandardMaterial color="#49c8ff" emissive="#49c8ff" emissiveIntensity={0.45} />
      </mesh>
      {/* small arc indicator */}
      <mesh position={[0.95, 0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.28, 0.02, 12, 36, Math.PI / 1.6]} />
        <meshStandardMaterial color="#ff3d22" emissive="#ff3d22" emissiveIntensity={0.5} />
      </mesh>
      <Label position={[0.7, 0.75, 0]}>corresponding</Label>
      <Label position={[-0.7, -0.7, 0]}>alternate</Label>
      <Label position={[1.9, 0.5, 0]}>parallel line</Label>
      <Label position={[1.9, -0.5, 0]}>parallel line</Label>
    </FloatingGroup>
  );
}

export function AngleLab3D() {
  return (
    <SceneCard
      title="AngleLab3D"
      caption="A transversal across two parallel lines locks in corresponding, alternate and co-interior pairs."
    >
      <AngleLabScene />
    </SceneCard>
  );
}

function SpinnerScene() {
  const wheel = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!wheel.current) return;
    const t = clock.elapsedTime;
    const decel = Math.max(0, 6 - t * 0.4);
    wheel.current.rotation.z += decel * 0.02;
  });
  // three sectors: red 180°, blue 90°, green 90°
  const sectors = [
    { angle: Math.PI, color: '#ff3d22', label: '180°' },
    { angle: Math.PI / 2, color: '#49c8ff', label: '90°' },
    { angle: Math.PI / 2, color: '#ffc43b', label: '90°' },
  ];
  let acc = 0;
  return (
    <FloatingGroup>
      <group ref={wheel} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[1.6, 1.6, 0.06, 64]} />
          <meshStandardMaterial color="#050711" />
        </mesh>
        {sectors.map((s, i) => {
          const start = acc;
          acc += s.angle;
          return (
            <mesh key={i} rotation={[0, start + s.angle / 2, 0]}>
              <cylinderGeometry
                args={[1.55, 1.55, 0.08, 32, 1, false, -s.angle / 2, s.angle]}
              />
              <meshStandardMaterial color={s.color} emissive={s.color} emissiveIntensity={0.28} />
            </mesh>
          );
        })}
      </group>
      {/* pointer */}
      <mesh position={[0, 1.85, 0]}>
        <coneGeometry args={[0.18, 0.4, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.4} />
      </mesh>
      <Label position={[0, -1.95, 0]}>P(green) = 90° / 360° = 1/4</Label>
    </FloatingGroup>
  );
}

export function ProbabilitySpinner3D() {
  return (
    <SceneCard
      title="ProbabilitySpinner3D"
      caption="The bigger the sector, the higher the chance. The spinner shows theoretical and experimental probability side by side."
    >
      <SpinnerScene />
    </SceneCard>
  );
}

function PercentageBarScene() {
  // 10 × 10 grid; shade 75% by colouring 75 cubes.
  const shaded = 75;
  const cubes: React.ReactNode[] = [];
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      const index = row * 10 + col;
      const isShaded = index < shaded;
      cubes.push(
        <mesh key={`${row}-${col}`} position={[col * 0.22 - 1.1, row * 0.22 - 1.1, 0]}>
          <boxGeometry args={[0.18, 0.18, 0.18]} />
          <meshStandardMaterial
            color={isShaded ? '#ffc43b' : '#1a2a52'}
            emissive={isShaded ? '#ffc43b' : '#000000'}
            emissiveIntensity={isShaded ? 0.28 : 0}
          />
        </mesh>,
      );
    }
  }
  return (
    <FloatingGroup>
      <group>{cubes}</group>
      <Label position={[0, -1.55, 0]}>75 / 100 = 3/4 = 0.75 = 75%</Label>
    </FloatingGroup>
  );
}

export function PercentageBar3D() {
  return (
    <SceneCard
      title="PercentageBar3D"
      caption="One hundred unit squares make conversions between fractions, decimals and percentages visible at a glance."
    >
      <PercentageBarScene />
    </SceneCard>
  );
}

function DataVizScene() {
  // Bar chart of 5 values; mean and median shown as planes.
  const values = [4, 8, 6, 10, 12];
  const mean = values.reduce((a, b) => a + b, 0) / values.length; // 8
  const sorted = [...values].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)]; // 8
  const colors = ['#49c8ff', '#8ddfff', '#ffc43b', '#ffe08a', '#ff3d22'];
  return (
    <FloatingGroup>
      {values.map((v, i) => (
        <mesh key={i} position={[i * 0.55 - 1.1, v / 12 - 0.6, 0]}>
          <boxGeometry args={[0.45, v / 6, 0.45]} />
          <meshStandardMaterial color={colors[i]} emissive={colors[i]} emissiveIntensity={0.2} />
        </mesh>
      ))}
      {/* mean plane */}
      <mesh position={[0, mean / 6 - 0.6, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[3.2, 0.02, 0.6]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.55} transparent opacity={0.9} />
      </mesh>
      <Label position={[1.85, mean / 6 - 0.55, 0]}>mean</Label>
      {/* median dot */}
      <mesh position={[0, median / 6 - 0.45, 0.4]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#ff3d22" emissive="#ff3d22" emissiveIntensity={0.7} />
      </mesh>
      <Label position={[0, -1.05, 0]}>4 · 8 · 6 · 10 · 12</Label>
    </FloatingGroup>
  );
}

export function DataVisualisation3D() {
  return (
    <SceneCard
      title="DataVisualisation3D"
      caption="Bars give shape to the data; the mean line is the data's balance point and the dot marks the median."
    >
      <DataVizScene />
    </SceneCard>
  );
}

// ─── Mapping from curriculum threeDType to component ─────────────────

const explainerByType: Record<ThreeDType, React.ComponentType> = {
  pythagoras_3d: Pythagoras3D,
  equation_balance_3d: EquationBalance3D,
  linear_graph_3d: LinearGraph3D,
  circle_lab_3d: CircleLab3D,
  ratio_mixer_3d: RatioMixer3D,
  solid_geometry_3d: SolidGeometry3D,
  angle_lab_3d: AngleLab3D,
  probability_spinner_3d: ProbabilitySpinner3D,
  percentage_bar_3d: PercentageBar3D,
  data_visualisation_3d: DataVisualisation3D,
};

export function getExplainerForType(type: ThreeDType): React.ComponentType {
  return explainerByType[type] ?? EquationBalance3D;
}

export function ExplainerByType({ type }: { type: ThreeDType }) {
  return React.createElement(getExplainerForType(type));
}
