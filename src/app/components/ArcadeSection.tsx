'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const TunnelGame = dynamic(() => import('./TunnelGame'), {
  ssr: false,
  loading: () => (
    <div className="w-full min-h-[420px] flex items-center justify-center bg-card rounded-xl border border-border">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Loading game...</p>
      </div>
    </div>
  ),
});

const PopGame = dynamic(() => import('./PopGame'), {
  ssr: false,
  loading: () => (
    <div className="w-full min-h-[420px] flex items-center justify-center bg-card rounded-xl border border-border">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Loading game...</p>
      </div>
    </div>
  ),
});



export default function ArcadeSection() {
  return (
    <section id="arcade" className="py-24 px-6 md:px-12 relative">
      {/* Background atmosphere */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="blob-primary absolute top-0 left-1/4 w-[600px] h-[400px] rounded-full opacity-20" />
        <div className="blob-accent absolute bottom-0 right-1/4 w-[500px] h-[400px] rounded-full opacity-15" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-8 h-px bg-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">
              Live Arcade
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h2 className="font-display text-6xl md:text-8xl uppercase tracking-wide text-foreground leading-none">
              Play <span className="text-primary violet-glow">Now</span>
            </h2>
            <p className="max-w-sm text-muted-foreground text-lg leading-relaxed md:text-right">
              Four fully playable arcade games, embedded right here.
              No installs. No accounts. Just play.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: Tunnel Dodger */}
          <div className="neon-border rounded-xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-5 py-3 bg-card border-b border-border">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                </div>
                <span className="font-mono text-[10px] tracking-tight text-muted-foreground">
                  tunnel_dodger.exe
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[9px] tracking-widest text-primary">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                3D · Infinite
              </div>
            </div>
            <div className="flex-1" style={{ height: '460px' }}>
              <TunnelGame />
            </div>
            <div className="px-5 py-3 bg-card border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="glass-card rounded px-2 py-0.5 text-[9px] font-black text-foreground border border-border">←</span>
                  <span className="glass-card rounded px-2 py-0.5 text-[9px] font-black text-foreground border border-border">→</span>
                  <span className="text-[9px] text-muted-foreground ml-1">Arrow Keys</span>
                </div>
              </div>
              <span className="text-[9px] text-muted-foreground">Avoid the red blocks</span>
            </div>
          </div>

          {/* Card 2: Sphere Pop */}
          <div className="neon-border-cyan rounded-xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-5 py-3 bg-card border-b border-border">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                </div>
                <span className="font-mono text-[10px] tracking-tight text-muted-foreground">
                  sphere_pop.exe
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[9px] tracking-widest text-accent">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                3D · Physics
              </div>
            </div>
            <div className="flex-1" style={{ height: '460px' }}>
              <PopGame />
            </div>
            <div className="px-5 py-3 bg-card border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent"><path d="m4 4 7.07 17 2.51-7.39L21 11.07z"/></svg>
                <span className="text-[9px] text-muted-foreground">Click to pop spheres</span>
              </div>
              <span className="text-[9px] text-muted-foreground">30 second rounds</span>
            </div>
          </div>


        </div>

        {/* Bottom note */}
        <div className="mt-8 text-center">
          <p className="text-[11px] text-muted-foreground uppercase tracking-widest">
            More games dropping soon — 
            <a href="#cta" className="text-primary hover:text-accent transition-colors ml-1 font-bold">
              Join the community
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
