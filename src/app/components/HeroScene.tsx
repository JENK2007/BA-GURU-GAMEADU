'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function ParticleField() {
  const meshRef = useRef<THREE.Points>(null);
  const count = 800;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
      const t = Math.random();
      // violet to cyan gradient
      col[i * 3] = 0.48 + t * (0.02 - 0.48);
      col[i * 3 + 1] = 0.23 + t * (0.71 - 0.23);
      col[i * 3 + 2] = 0.93 + t * (0.83 - 0.93);
    }
    return [pos, col];
  }, []);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.04;
      meshRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.02) * 0.1;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  );
}

function FloatingGems() {
  const group = useRef<THREE.Group>(null);

  const gems = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6 - 2,
      ] as [number, number, number],
      scale: 0.15 + Math.random() * 0.35,
      rotationSpeed: (Math.random() - 0.5) * 0.8,
      floatOffset: Math.random() * Math.PI * 2,
      color: i % 2 === 0 ? '#7C3AED' : '#06B6D4',
    }));
  }, []);

  useFrame(({ clock }) => {
    if (group.current) {
      group.current.children.forEach((child, i) => {
        const gem = gems[i];
        if (gem) {
          child.rotation.y = clock.getElapsedTime() * gem.rotationSpeed;
          child.rotation.x = clock.getElapsedTime() * gem.rotationSpeed * 0.5;
          child.position.y =
            gems[i].position[1] + Math.sin(clock.getElapsedTime() + gem.floatOffset) * 0.4;
        }
      });
    }
  });

  return (
    <group ref={group}>
      {gems.map((gem, i) => (
        <mesh key={i} position={gem.position} scale={gem.scale}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color={gem.color}
            emissive={gem.color}
            emissiveIntensity={0.4}
            metalness={0.8}
            roughness={0.1}
            transparent
            opacity={0.85}
          />
        </mesh>
      ))}
    </group>
  );
}

function GridPlane() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
      <planeGeometry args={[40, 40, 20, 20]} />
      <meshBasicMaterial
        color="#7C3AED"
        wireframe
        transparent
        opacity={0.06}
      />
    </mesh>
  );
}

interface HeroSceneProps {
  mouseX: number;
  mouseY: number;
}

function CameraRig({ mouseX, mouseY }: HeroSceneProps) {
  useFrame(({ camera }) => {
    camera.position.x += (mouseX * 2 - camera.position.x) * 0.04;
    camera.position.y += (-mouseY * 1.5 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function HeroScene({ mouseX, mouseY }: HeroSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 60 }}
      style={{ background: 'transparent' }}
      dpr={[1, 1.5]}
    >
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#7C3AED" />
      <directionalLight position={[-5, -5, 3]} intensity={0.5} color="#06B6D4" />
      <pointLight position={[0, 0, 5]} intensity={1.2} color="#7C3AED" distance={20} />
      <ParticleField />
      <FloatingGems />
      <GridPlane />
      <CameraRig mouseX={mouseX} mouseY={mouseY} />
    </Canvas>
  );
}
