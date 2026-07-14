'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// ─── Game Constants ───────────────────────────────────────────
const TUNNEL_RADIUS = 3.2;
const TUNNEL_SPEED_INIT = 12;
const OBSTACLE_INTERVAL = 1.4;
const PLAYER_MOVE_SPEED = 4.5;
const LANE_COUNT = 3;
const LANE_SPREAD = 2.2;

interface Obstacle {
  id: number;
  z: number;
  lane: number;
  hit: boolean;
}

// ─── Tunnel Ring ─────────────────────────────────────────────
function TunnelRing({ z }: { z: number }) {
  return (
    <mesh position={[0, 0, z]} rotation={[0, 0, 0]}>
      <torusGeometry args={[TUNNEL_RADIUS, 0.04, 8, 40]} />
      <meshStandardMaterial
        color="#7C3AED"
        emissive="#7C3AED"
        emissiveIntensity={0.6}
        transparent
        opacity={0.5}
      />
    </mesh>
  );
}

// ─── Obstacle Block ──────────────────────────────────────────
function ObstacleBlock({ obstacle, speed }: { obstacle: Obstacle; speed: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const laneX = (obstacle.lane - 1) * LANE_SPREAD;

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.position.z += speed * delta;
      meshRef.current.rotation.x += delta * 1.5;
      meshRef.current.rotation.y += delta;
    }
  });

  if (obstacle.hit) return null;

  return (
    <mesh ref={meshRef} position={[laneX, 0, obstacle.z]}>
      <boxGeometry args={[0.9, 0.9, 0.9]} />
      <meshStandardMaterial
        color="#ef4444"
        emissive="#ef4444"
        emissiveIntensity={0.5}
        metalness={0.6}
        roughness={0.2}
      />
    </mesh>
  );
}

// ─── Player Ship ─────────────────────────────────────────────
function PlayerShip({ lane }: { lane: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetX = (lane - 1) * LANE_SPREAD;

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.position.x +=
        (targetX - meshRef.current.position.x) * Math.min(1, delta * 12);
      meshRef.current.rotation.z +=
        (targetX - meshRef.current.position.x) * -0.15;
    }
  });

  return (
    <group ref={meshRef} position={[targetX, 0, -1]}>
      <mesh>
        <coneGeometry args={[0.3, 0.8, 6]} />
        <meshStandardMaterial
          color="#06B6D4"
          emissive="#06B6D4"
          emissiveIntensity={0.8}
          metalness={0.9}
          roughness={0.05}
        />
      </mesh>
      <pointLight color="#06B6D4" intensity={2} distance={3} />
    </group>
  );
}

// ─── Scene ────────────────────────────────────────────────────
interface TunnelSceneProps {
  playing: boolean;
  lane: number;
  obstacles: Obstacle[];
  speed: number;
  onCollide: () => void;
  tunnelRingZs: number[];
}

function TunnelScene({
  playing,
  lane,
  obstacles,
  speed,
  onCollide,
  tunnelRingZs,
}: TunnelSceneProps) {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 0.5, 4);
    camera.lookAt(0, 0, -10);
  }, [camera]);

  useFrame((_, delta) => {
    if (!playing) return;
    const playerX = (lane - 1) * LANE_SPREAD;
    for (const obs of obstacles) {
      if (obs.hit) continue;
      const obsX = (obs.lane - 1) * LANE_SPREAD;
      if (
        Math.abs(obs.z - (-1)) < 1.2 &&
        Math.abs(obsX - playerX) < 0.8
      ) {
        onCollide();
      }
    }
  });

  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight position={[0, 0, 5]} intensity={3} color="#7C3AED" distance={20} />
      <pointLight position={[0, 0, -20]} intensity={1} color="#06B6D4" distance={30} />

      {/* Tunnel rings */}
      {tunnelRingZs.map((z, i) => (
        <TunnelRing key={i} z={z} />
      ))}

      {/* Obstacles */}
      {obstacles.map((obs) => (
        <ObstacleBlock key={obs.id} obstacle={obs} speed={speed} />
      ))}

      {/* Player */}
      {playing && <PlayerShip lane={lane} />}
    </>
  );
}

// ─── Main Component ──────────────────────────────────────────
export default function TunnelGame() {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'dead'>('idle');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lane, setLane] = useState(1); // 0=left 1=center 2=right
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [speed, setSpeed] = useState(TUNNEL_SPEED_INIT);
  const [tunnelRingZs, setTunnelRingZs] = useState<number[]>([]);

  const obstacleIdRef = useRef(0);
  const lastObstacleTime = useRef(0);
  const frameRef = useRef<number>(0);
  const startTimeRef = useRef(0);
  const lastScoreTime = useRef(0);
  const deadRef = useRef(false);

  // Init tunnel rings
  useEffect(() => {
    const rings: number[] = [];
    for (let i = 0; i < 30; i++) rings.push(-i * 4);
    setTunnelRingZs(rings);
  }, []);

  // Animate tunnel rings
  useEffect(() => {
    if (gameState !== 'playing') return;
    let animId: number;
    const animate = () => {
      setTunnelRingZs((prev) => {
        const updated = prev.map((z) => z + speed * 0.016);
        return updated.map((z) => (z > 6 ? z - 30 * 4 : z));
      });
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [gameState, speed]);

  const startGame = useCallback(() => {
    setGameState('playing');
    setScore(0);
    setLane(1);
    setObstacles([]);
    setSpeed(TUNNEL_SPEED_INIT);
    deadRef.current = false;
    startTimeRef.current = performance.now();
    lastObstacleTime.current = 0;
    lastScoreTime.current = 0;
  }, []);

  const handleCollide = useCallback(() => {
    if (deadRef.current) return;
    deadRef.current = true;
    setGameState('dead');
    setHighScore((prev) => Math.max(prev, score));
  }, [score]);

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;
    let animId: number;
    const loop = (now: number) => {
      if (deadRef.current) return;
      const elapsed = (now - startTimeRef.current) / 1000;

      // Score
      if (now - lastScoreTime.current > 300) {
        setScore((s) => s + 1);
        lastScoreTime.current = now;
      }

      // Speed ramp
      setSpeed(TUNNEL_SPEED_INIT + elapsed * 1.2);

      // Spawn obstacles
      if (now - lastObstacleTime.current > OBSTACLE_INTERVAL * 1000) {
        const newObs: Obstacle = {
          id: obstacleIdRef.current++,
          z: -35,
          lane: Math.floor(Math.random() * LANE_COUNT),
          hit: false,
        };
        setObstacles((prev) => [...prev.filter((o) => o.z < 8), newObs]);
        lastObstacleTime.current = now;
      }

      // Move obstacles forward
      setObstacles((prev) =>
        prev
          .map((o) => ({ ...o, z: o.z + speed * 0.016 }))
          .filter((o) => o.z < 8)
      );

      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [gameState, speed]);

  // Keyboard controls
  useEffect(() => {
    if (gameState !== 'playing') return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setLane((l) => Math.max(0, l - 1));
      if (e.key === 'ArrowRight') setLane((l) => Math.min(2, l + 1));
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [gameState]);

  return (
    <div className="game-canvas-wrapper w-full h-full min-h-[420px] relative select-none">
      <div className="scanlines" />

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0.5, 4], fov: 70 }}
        style={{ width: '100%', height: '100%', background: '#030305' }}
        dpr={[1, 1.5]}
      >
        <TunnelScene
          playing={gameState === 'playing'}
          lane={lane}
          obstacles={obstacles}
          speed={speed}
          onCollide={handleCollide}
          tunnelRingZs={tunnelRingZs}
        />
      </Canvas>

      {/* Score HUD */}
      {gameState === 'playing' && (
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center pointer-events-none z-20">
          <div className="glass-card rounded-lg px-4 py-2">
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Score</p>
            <p className="text-2xl font-black text-primary">{score}</p>
          </div>
          <div className="glass-card rounded-lg px-4 py-2 text-right">
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Best</p>
            <p className="text-2xl font-black text-accent">{highScore}</p>
          </div>
        </div>
      )}

      {/* Mobile lane buttons */}
      {gameState === 'playing' && (
        <div className="absolute bottom-4 left-4 right-4 flex justify-between z-20 lg:hidden">
          <button
            onTouchStart={() => setLane((l) => Math.max(0, l - 1))}
            className="glass-card rounded-xl px-6 py-3 text-xl font-black text-foreground active:scale-95"
          >
            ←
          </button>
          <button
            onTouchStart={() => setLane((l) => Math.min(2, l + 1))}
            className="glass-card rounded-xl px-6 py-3 text-xl font-black text-foreground active:scale-95"
          >
            →
          </button>
        </div>
      )}

      {/* Overlays */}
      {gameState === 'idle' && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-6 bg-background/60 backdrop-blur-sm rounded-xl">
          <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-3">Game 01</p>
            <h3 className="text-3xl font-black uppercase text-foreground mb-2">Tunnel Dodger</h3>
            <p className="text-sm text-muted-foreground">
              Use <span className="text-primary font-bold">← →</span> arrow keys to dodge blocks
            </p>
          </div>
          <button onClick={startGame} className="btn-primary text-sm">
            Start Game
          </button>
          {highScore > 0 && (
            <p className="text-[10px] text-muted-foreground">
              Best: <span className="text-accent font-bold">{highScore}</span>
            </p>
          )}
        </div>
      )}

      {gameState === 'dead' && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-6 bg-background/70 backdrop-blur-sm rounded-xl">
          <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-400 mb-3">Game Over</p>
            <p className="text-5xl font-black text-foreground mb-1">{score}</p>
            <p className="text-sm text-muted-foreground">
              Best: <span className="text-accent font-bold">{highScore}</span>
            </p>
          </div>
          <button onClick={startGame} className="btn-primary">
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
