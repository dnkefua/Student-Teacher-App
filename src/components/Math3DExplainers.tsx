'use client';

import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

type SceneCardProps = {
  title: string;
  caption: string;
  children: React.ReactNode;
};

function SceneCard({ title, caption, children }: SceneCardProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-[#061126] shadow-[0_24px_80px_rgba(5,7,17,.24)]">
      <div className="h-64 sm:h-72">
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

export function EquationBalance3D() {
  const beam = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!beam.current) return;
    beam.current.rotation.z = Math.sin(clock.elapsedTime * 1.5) * 0.03;
  });

  return (
    <SceneCard
      title="EquationBalance3D"
      caption="The equation behaves like a scale: every inverse operation must happen on both sides."
    >
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
