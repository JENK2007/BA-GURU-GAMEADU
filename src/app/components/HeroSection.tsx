'use client';

import React, { useRef, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const HeroScene = dynamic(() => import('./HeroScene'), { ssr: false });

export default function HeroSection() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden grid-bg"
    >
      {/* 3D Background Canvas */}
      <div className="absolute inset-0 z-0">
        <HeroScene mouseX={mouse.x} mouseY={mouse.y} />
      </div>

      {/* Gradient overlays for depth */}
      <div className="absolute inset-0 z-1 pointer-events-none">
        <div className="blob-primary absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-40" />
        <div className="blob-accent absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-30" />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 30%, rgba(5,5,8,0.85) 100%)',
          }}
        />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-36 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-8">
          {/* Badge */}
          <div className="hero-badge mb-8 inline-flex">
            <span
              className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"
            />
            Live Arcade — Play Instantly
          </div>

          {/* Main Headline */}
          <h1 className="font-display font-black leading-[0.9] tracking-wider mb-6 flex flex-col">
            <span
              className="text-outline uppercase transition-transform duration-75"
              style={{
                fontSize: 'clamp(2.5rem, 10vw, 9rem)', // Ultra-fluid scaling
                transform: `translate(${mouse.x * -8}px, ${mouse.y * -4}px)`,
                WebkitTextStroke: '2px rgba(241, 245, 249, 0.75)',
                color: 'rgba(241, 245, 249, 0.15)'
              }}
            >
              Ba Guru
            </span>
            <span
              className="text-primary violet-glow glitch-text uppercase transition-transform duration-75"
              data-text="GAMEADU"
              style={{
                fontSize: 'clamp(2.5rem, 10vw, 9rem)', // Ultra-fluid scaling
                transform: `translate(${mouse.x * 12}px, ${mouse.y * 6}px)`
              }}
            >
              Gameadu
            </span>
          </h1>

          {/* Sub */}
          <div className="mt-24 flex flex-col md:flex-row gap-10 items-start">
            <p className="max-w-md text-lg text-muted-foreground leading-relaxed">
              The most electric arcade on the web.{' '}
              <span className="text-foreground font-semibold">No downloads.</span>{' '}
              <span className="text-accent font-semibold">No waiting.</span>{' '}
              Just pure 3D gaming, right here.
            </p>
            <div className="flex flex-col gap-4 shrink-0">
              <a href="#arcade" className="btn-primary">
                Enter Arcade ↓
              </a>
              <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-muted-foreground text-center">
                2 Games · Free to Play
              </span>
            </div>
          </div>
        </div>

        {/* Vertical accent text */}
        <div className="hidden lg:flex lg:col-span-4 flex-col items-end justify-center gap-6">
          <div className="vertical-text text-[10px] font-black uppercase tracking-[1.5em] text-muted-foreground opacity-30">
            Arcade · Infinite · Dodge · Pop
          </div>
          <div className="glass-card rounded-xl p-6 max-w-[200px]">
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-2">Live Players</p>
            <p className="text-4xl font-black text-primary">4.2K</p>
            <p className="text-[9px] text-muted-foreground mt-1">online right now</p>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground">
          Scroll to Play
        </span>
        <div className="w-px h-12 bg-gradient-to-b from-primary to-transparent" />
      </div>
    </section>
  );
}
