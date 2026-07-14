'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface Sphere {
  id: number;
  position: [number, number, number];
  velocity: [number, number, number];
  color: string;
  radius: number;
  alive: boolean;
  lifespan: number;
  age: number;
}

const COLORS = ['#7C3AED', '#06B6D4', '#f59e0b', '#ec4899', '#10b981'];
const GRAVITY = -4.5;
const FLOOR_Y = -2.8;
const ARENA_W = 4.5;

// ─── Single Sphere Mesh ───────────────────────────────────────
function SphereObject({
  sphere,
  onPop,
}: {
  sphere: Sphere;
  onPop: (id: number) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();
  const pulseRef = useRef(0);

  useFrame((_, delta) => {
    pulseRef.current += delta * 3;
    if (meshRef.current) {
      const urgency = sphere.age / sphere.lifespan;
      const pulse = 1 + Math.sin(pulseRef.current) * 0.05 * urgency;
      meshRef.current.scale.setScalar(pulse);
    }
  });

  const handleClick = useCallback(
    (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      onPop(sphere.id);
    },
    [sphere.id, onPop]
  );

  const urgency = Math.min(1, sphere.age / sphere.lifespan);
  const emissiveIntensity = 0.3 + urgency * 0.7;

  return (
    <mesh
      ref={meshRef}
      position={sphere.position}
      onClick={handleClick}
    >
      <sphereGeometry args={[sphere.radius, 24, 24]} />
      <meshStandardMaterial
        color={sphere.color}
        emissive={sphere.color}
        emissiveIntensity={emissiveIntensity}
        metalness={0.3}
        roughness={0.1}
        transparent
        opacity={1 - urgency * 0.3}
      />
    </mesh>
  );
}

// ─── Arena Scene ──────────────────────────────────────────────
interface PopSceneProps {
  spheres: Sphere[];
  playing: boolean;
  onPop: (id: number) => void;
}

function PopScene({ spheres, playing, onPop }: PopSceneProps) {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 0, 9);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 5, 5]} intensity={2} color="#7C3AED" />
      <pointLight position={[0, -5, 5]} intensity={1} color="#06B6D4" />
      <directionalLight position={[5, 5, 5]} intensity={0.5} />

      {/* Floor */}
      <mesh position={[0, FLOOR_Y - 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[ARENA_W * 2, 8]} />
        <meshStandardMaterial
          color="#7C3AED"
          transparent
          opacity={0.08}
          metalness={0.5}
        />
      </mesh>

      {/* Wall grid */}
      <mesh position={[0, 0, -2]} rotation={[0, 0, 0]}>
        <planeGeometry args={[ARENA_W * 2, 7]} />
        <meshBasicMaterial color="#7C3AED" wireframe transparent opacity={0.04} />
      </mesh>

      {/* Spheres */}
      {spheres.map((s) =>
        s.alive ? (
          <SphereObject key={s.id} sphere={s} onPop={onPop} />
        ) : null
      )}
    </>
  );
}

// ─── Main Component ──────────────────────────────────────────
export default function PopGame() {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'over'>('idle');
  const [spheres, setSpheres] = useState<Sphere[]>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [combo, setCombo] = useState(0);

  const sphereIdRef = useRef(0);
  const lastSpawnRef = useRef(0);
  const gameStartRef = useRef(0);
  const deadRef = useRef(false);
  const comboTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startGame = useCallback(() => {
    setSpheres([]);
    setScore(0);
    setTimeLeft(30);
    setCombo(0);
    deadRef.current = false;
    gameStartRef.current = performance.now();
    lastSpawnRef.current = 0;
    setGameState('playing');
  }, []);

  const popSphere = useCallback((id: number) => {
    setSpheres((prev) =>
      prev.map((s) => (s.id === id ? { ...s, alive: false } : s))
    );
    setScore((s) => {
      setCombo((c) => {
        const newCombo = c + 1;
        const points = 10 + newCombo * 5;
        if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
        comboTimerRef.current = setTimeout(() => setCombo(0), 1200);
        return newCombo;
      });
      return s + 10;
    });
  }, []);

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;
    let animId: number;

    const loop = (now: number) => {
      if (deadRef.current) return;
      const elapsed = (now - gameStartRef.current) / 1000;
      const remaining = Math.max(0, 30 - elapsed);
      setTimeLeft(Math.ceil(remaining));

      if (remaining <= 0) {
        deadRef.current = true;
        setGameState('over');
        setHighScore((prev) => Math.max(prev, score));
        return;
      }

      // Spawn spheres
      const spawnInterval = Math.max(600, 1200 - elapsed * 15);
      if (now - lastSpawnRef.current > spawnInterval) {
        const newSphere: Sphere = {
          id: sphereIdRef.current++,
          position: [
            (Math.random() - 0.5) * ARENA_W * 1.6,
            4.5 + Math.random() * 2,
            (Math.random() - 0.5) * 1.5,
          ],
          velocity: [
            (Math.random() - 0.5) * 1.5,
            Math.random() * -1,
            0,
          ],
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          radius: 0.25 + Math.random() * 0.35,
          alive: true,
          lifespan: 4 + Math.random() * 2,
          age: 0,
        };
        setSpheres((prev) => [...prev.slice(-20), newSphere]);
        lastSpawnRef.current = now;
      }

      // Physics update
      const dt = 0.016;
      setSpheres((prev) =>
        prev
          .map((s) => {
            if (!s.alive) return s;
            const newAge = s.age + dt;
            if (newAge >= s.lifespan) return { ...s, alive: false, age: newAge };

            let vx = s.velocity[0];
            let vy = s.velocity[1] + GRAVITY * dt;
            let vy_final = vy;
            let py = s.position[1] + vy * dt;
            let px = s.position[0] + vx * dt;
            const pz = s.position[2];

            // Floor bounce
            if (py - s.radius < FLOOR_Y) {
              py = FLOOR_Y + s.radius;
              vy_final = Math.abs(vy) * 0.55;
            }
            // Wall bounce
            if (Math.abs(px) + s.radius > ARENA_W) {
              vx = -vx * 0.8;
              px = Math.sign(px) * (ARENA_W - s.radius);
            }

            return {
              ...s,
              position: [px, py, pz] as [number, number, number],
              velocity: [vx, vy_final, 0] as [number, number, number],
              age: newAge,
            };
          })
          .filter((s) => s.position[1] > FLOOR_Y - 5)
      );

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [gameState, score]);

  const aliveSpheres = spheres.filter((s) => s.alive).length;
  const urgencyColor = timeLeft <= 10 ? 'text-red-400' : timeLeft <= 20 ? 'text-amber-400' : 'text-accent';

  return (
    <div className="game-canvas-wrapper w-full h-full min-h-[420px] relative select-none">
      <div className="scanlines" />

      <Canvas
        camera={{ position: [0, 0, 9], fov: 65 }}
        style={{ width: '100%', height: '100%', background: '#030305' }}
        dpr={[1, 1.5]}
      >
        <PopScene spheres={spheres} playing={gameState === 'playing'} onPop={popSphere} />
      </Canvas>

      {/* HUD */}
      {gameState === 'playing' && (
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none z-20">
          <div className="glass-card rounded-lg px-4 py-2">
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Score</p>
            <p className="text-2xl font-black text-primary">{score}</p>
          </div>
          <div className="glass-card rounded-lg px-4 py-2 text-center">
            <p className={`text-3xl font-black ${urgencyColor}`}>{timeLeft}s</p>
            {combo > 1 && (
              <p className="text-[9px] font-black text-amber-400 uppercase tracking-widest">
                x{combo} Combo!
              </p>
            )}
          </div>
          <div className="glass-card rounded-lg px-4 py-2 text-right">
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Best</p>
            <p className="text-2xl font-black text-accent">{highScore}</p>
          </div>
        </div>
      )}

      {/* Idle Overlay */}
      {gameState === 'idle' && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-6 bg-background/60 backdrop-blur-sm rounded-xl">
          <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-3">Game 02</p>
            <h3 className="text-3xl font-black uppercase text-foreground mb-2">Sphere Pop</h3>
            <p className="text-sm text-muted-foreground">
              <span className="text-primary font-bold">Click spheres</span> before they vanish — 30 seconds
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

      {/* Game Over Overlay */}
      {gameState === 'over' && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-6 bg-background/70 backdrop-blur-sm rounded-xl">
          <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-3">Time Up!</p>
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
