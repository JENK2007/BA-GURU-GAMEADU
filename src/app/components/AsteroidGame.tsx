'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

interface Asteroid {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  radius: number;
  rotation: number;
  rotSpeed: number;
  color: string;
}

interface Bullet {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  life: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

const COLORS = ['#a78bfa', '#7c3aed', '#c4b5fd', '#818cf8', '#38bdf8', '#f472b6'];

export default function AsteroidGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    ship: { x: 0, y: 0, angle: 0, vx: 0, vy: 0 },
    asteroids: [] as Asteroid[],
    bullets: [] as Bullet[],
    particles: [] as Particle[],
    stars: [] as { x: number; y: number; z: number; size: number }[],
    keys: {} as Record<string, boolean>,
    score: 0,
    lives: 3,
    gameOver: false,
    started: false,
    invincible: 0,
    wave: 1,
    animId: 0,
  });
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [wave, setWave] = useState(1);

  const spawnAsteroids = useCallback((canvas: HTMLCanvasElement, count: number) => {
    const s = stateRef.current;
    for (let i = 0; i < count; i++) {
      const side = Math.floor(Math.random() * 4);
      let x = 0, y = 0;
      if (side === 0) { x = Math.random() * canvas.width; y = -60; }
      else if (side === 1) { x = canvas.width + 60; y = Math.random() * canvas.height; }
      else if (side === 2) { x = Math.random() * canvas.width; y = canvas.height + 60; }
      else { x = -60; y = Math.random() * canvas.height; }
      const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x) + (Math.random() - 0.5) * 1.2;
      const speed = 0.8 + Math.random() * 1.2 + s.wave * 0.15;
      s.asteroids.push({
        x, y, z: Math.random() * 0.4 + 0.8,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        vz: (Math.random() - 0.5) * 0.005,
        radius: 22 + Math.random() * 28,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.04,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    }
  }, []);

  const initGame = useCallback((canvas: HTMLCanvasElement) => {
    const s = stateRef.current;
    s.ship = { x: canvas.width / 2, y: canvas.height / 2, angle: -Math.PI / 2, vx: 0, vy: 0 };
    s.asteroids = [];
    s.bullets = [];
    s.particles = [];
    s.score = 0;
    s.lives = 3;
    s.gameOver = false;
    s.started = true;
    s.invincible = 120;
    s.wave = 1;
    s.stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      z: Math.random(),
      size: Math.random() * 2 + 0.5,
    }));
    spawnAsteroids(canvas, 5);
    setScore(0); setLives(3); setGameOver(false); setStarted(true); setWave(1);
  }, [spawnAsteroids]);

  const explode = useCallback((x: number, y: number, color: string, count = 12) => {
    const s = stateRef.current;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const speed = 1.5 + Math.random() * 3;
      s.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 40 + Math.random() * 30,
        maxLife: 70,
        color,
        size: 2 + Math.random() * 3,
      });
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onKey = (e: KeyboardEvent, down: boolean) => {
      stateRef.current.keys[e.key] = down;
      if (down && (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', (e) => onKey(e, true));
    window.addEventListener('keyup', (e) => onKey(e, false));

    const shoot = () => {
      const s = stateRef.current;
      if (!s.started || s.gameOver) return;
      s.bullets.push({
        x: s.ship.x + Math.cos(s.ship.angle) * 18,
        y: s.ship.y + Math.sin(s.ship.angle) * 18,
        z: 1,
        vx: Math.cos(s.ship.angle) * 9 + s.ship.vx,
        vy: Math.sin(s.ship.angle) * 9 + s.ship.vy,
        vz: 0,
        life: 55,
      });
    };

    let shootCooldown = 0;

    const loop = () => {
      const s = stateRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background
      ctx.fillStyle = '#050510';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Stars
      s.stars.forEach(star => {
        const alpha = 0.3 + star.z * 0.7;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * star.z, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,200,255,${alpha})`;
        ctx.fill();
      });

      if (!s.started) {
        // Start screen
        ctx.save();
        ctx.textAlign = 'center';
        ctx.fillStyle = '#a78bfa';
        ctx.font = 'bold 28px monospace';
        ctx.fillText('ASTEROID SHOOTER', canvas.width / 2, canvas.height / 2 - 40);
        ctx.fillStyle = '#c4b5fd';
        ctx.font = '13px monospace';
        ctx.fillText('← → Rotate  |  ↑ Thrust  |  SPACE Shoot', canvas.width / 2, canvas.height / 2 + 10);
        ctx.fillStyle = '#7c3aed';
        ctx.font = 'bold 15px monospace';
        ctx.fillText('[ CLICK TO START ]', canvas.width / 2, canvas.height / 2 + 50);
        ctx.restore();
        s.animId = requestAnimationFrame(loop);
        return;
      }

      if (s.gameOver) {
        ctx.save();
        ctx.textAlign = 'center';
        ctx.fillStyle = '#f472b6';
        ctx.font = 'bold 30px monospace';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 30);
        ctx.fillStyle = '#a78bfa';
        ctx.font = '16px monospace';
        ctx.fillText(`Score: ${s.score}`, canvas.width / 2, canvas.height / 2 + 10);
        ctx.fillStyle = '#7c3aed';
        ctx.font = 'bold 14px monospace';
        ctx.fillText('[ CLICK TO RESTART ]', canvas.width / 2, canvas.height / 2 + 50);
        ctx.restore();
        s.animId = requestAnimationFrame(loop);
        return;
      }

      // Input
      if (s.keys['ArrowLeft']) s.ship.angle -= 0.055;
      if (s.keys['ArrowRight']) s.ship.angle += 0.055;
      if (s.keys['ArrowUp']) {
        s.ship.vx += Math.cos(s.ship.angle) * 0.22;
        s.ship.vy += Math.sin(s.ship.angle) * 0.22;
      }
      if ((s.keys[' '] || s.keys['Space']) && shootCooldown <= 0) {
        shoot();
        shootCooldown = 12;
      }
      if (shootCooldown > 0) shootCooldown--;

      // Friction
      s.ship.vx *= 0.97;
      s.ship.vy *= 0.97;
      s.ship.x = (s.ship.x + s.ship.vx + canvas.width) % canvas.width;
      s.ship.y = (s.ship.y + s.ship.vy + canvas.height) % canvas.height;

      // Draw ship
      if (s.invincible <= 0 || Math.floor(s.invincible / 6) % 2 === 0) {
        ctx.save();
        ctx.translate(s.ship.x, s.ship.y);
        ctx.rotate(s.ship.angle);
        // Thruster flame
        if (s.keys['ArrowUp']) {
          ctx.beginPath();
          ctx.moveTo(-14, -5);
          ctx.lineTo(-22 - Math.random() * 10, 0);
          ctx.lineTo(-14, 5);
          const grad = ctx.createLinearGradient(-14, 0, -28, 0);
          grad.addColorStop(0, 'rgba(251,146,60,0.9)');
          grad.addColorStop(1, 'rgba(251,146,60,0)');
          ctx.strokeStyle = grad;
          ctx.lineWidth = 3;
          ctx.stroke();
        }
        // Ship body
        ctx.beginPath();
        ctx.moveTo(18, 0);
        ctx.lineTo(-12, -10);
        ctx.lineTo(-6, 0);
        ctx.lineTo(-12, 10);
        ctx.closePath();
        const shipGrad = ctx.createLinearGradient(-12, 0, 18, 0);
        shipGrad.addColorStop(0, '#7c3aed');
        shipGrad.addColorStop(1, '#a78bfa');
        ctx.fillStyle = shipGrad;
        ctx.fill();
        ctx.strokeStyle = '#c4b5fd';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        // Cockpit
        ctx.beginPath();
        ctx.arc(4, 0, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#38bdf8';
        ctx.fill();
        ctx.restore();
      }
      if (s.invincible > 0) s.invincible--;

      // Bullets
      s.bullets = s.bullets.filter(b => b.life > 0);
      s.bullets.forEach(b => {
        b.x = (b.x + b.vx + canvas.width) % canvas.width;
        b.y = (b.y + b.vy + canvas.height) % canvas.height;
        b.life--;
        ctx.beginPath();
        ctx.arc(b.x, b.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#f472b6';
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#f472b6';
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Asteroids
      s.asteroids.forEach(a => {
        a.x = (a.x + a.vx + canvas.width) % canvas.width;
        a.y = (a.y + a.vy + canvas.height) % canvas.height;
        a.rotation += a.rotSpeed;
        ctx.save();
        ctx.translate(a.x, a.y);
        ctx.rotate(a.rotation);
        const scale = a.z;
        ctx.scale(scale, scale);
        // 3D-ish asteroid shape
        ctx.beginPath();
        const pts = 8;
        for (let i = 0; i < pts; i++) {
          const ang = (Math.PI * 2 * i) / pts;
          const r = a.radius * (0.75 + Math.sin(i * 2.3 + a.rotation) * 0.25);
          if (i === 0) ctx.moveTo(Math.cos(ang) * r, Math.sin(ang) * r);
          else ctx.lineTo(Math.cos(ang) * r, Math.sin(ang) * r);
        }
        ctx.closePath();
        const ag = ctx.createRadialGradient(-a.radius * 0.3, -a.radius * 0.3, 0, 0, 0, a.radius);
        ag.addColorStop(0, a.color + 'cc');
        ag.addColorStop(1, a.color + '44');
        ctx.fillStyle = ag;
        ctx.fill();
        ctx.strokeStyle = a.color;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();
      });

      // Collision: bullets vs asteroids
      s.bullets.forEach((b, bi) => {
        s.asteroids.forEach((a, ai) => {
          const dx = b.x - a.x, dy = b.y - a.y;
          if (Math.sqrt(dx * dx + dy * dy) < a.radius * a.z) {
            explode(a.x, a.y, a.color, 14);
            s.bullets.splice(bi, 1);
            if (a.radius > 20) {
              // Split
              for (let k = 0; k < 2; k++) {
                const ang = Math.random() * Math.PI * 2;
                const spd = 1.2 + Math.random() * 1.5;
                s.asteroids.push({
                  x: a.x, y: a.y, z: a.z * 0.85,
                  vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd, vz: 0,
                  radius: a.radius * 0.55,
                  rotation: Math.random() * Math.PI * 2,
                  rotSpeed: (Math.random() - 0.5) * 0.07,
                  color: a.color,
                });
              }
            }
            s.asteroids.splice(ai, 1);
            s.score += Math.round(100 / (a.radius / 20));
            setScore(s.score);
          }
        });
      });

      // Collision: ship vs asteroids
      if (s.invincible <= 0) {
        s.asteroids.forEach((a) => {
          const dx = s.ship.x - a.x, dy = s.ship.y - a.y;
          if (Math.sqrt(dx * dx + dy * dy) < a.radius * a.z + 12) {
            explode(s.ship.x, s.ship.y, '#f472b6', 20);
            s.lives--;
            setLives(s.lives);
            s.invincible = 150;
            s.ship.vx = 0; s.ship.vy = 0;
            s.ship.x = canvas.width / 2; s.ship.y = canvas.height / 2;
            if (s.lives <= 0) {
              s.gameOver = true;
              setGameOver(true);
            }
          }
        });
      }

      // Wave clear
      if (s.asteroids.length === 0) {
        s.wave++;
        setWave(s.wave);
        spawnAsteroids(canvas, 4 + s.wave * 2);
      }

      // Particles
      s.particles = s.particles.filter(p => p.life > 0);
      s.particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        p.vx *= 0.95; p.vy *= 0.95;
        p.life--;
        const alpha = p.life / p.maxLife;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
        ctx.fill();
      });

      // HUD
      ctx.save();
      ctx.textAlign = 'left';
      ctx.fillStyle = '#a78bfa';
      ctx.font = 'bold 13px monospace';
      ctx.fillText(`SCORE: ${s.score}`, 14, 24);
      ctx.fillText(`WAVE: ${s.wave}`, 14, 42);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#f472b6';
      ctx.fillText(`LIVES: ${'♥️ '.repeat(Math.max(0, s.lives))}`, canvas.width - 14, 24);
      ctx.restore();

      s.animId = requestAnimationFrame(loop);
    };

    const s = stateRef.current;
    s.stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      z: Math.random(),
      size: Math.random() * 2 + 0.5,
    }));

    s.animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(stateRef.current.animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', (e) => onKey(e, true));
      window.removeEventListener('keyup', (e) => onKey(e, false));
    };
  }, [explode, spawnAsteroids]);

  const handleClick = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const s = stateRef.current;
    if (!s.started || s.gameOver) {
      initGame(canvas);
    }
  }, [initGame]);

  return (
    <div className="relative w-full h-full bg-[#050510] select-none" onClick={handleClick}>
      <canvas ref={canvasRef} className="w-full h-full block" style={{ touchAction: 'none' }} />
    </div>
  );
}
