'use client';

import React, { useRef, useEffect, useState } from 'react';
import Icon from '@/components/ui/AppIcon';

/* BENTO GRID AUDIT:
   Array has 4 cards: [SpeedCard cs-2, ReflexCard cs-1, MultiplayerCard cs-1, LeaderboardCard cs-2]
   Row 1: [col-1–2: SpeedCard cs-2 rs-1] [col-3: ReflexCard cs-1 rs-1]
   Row 2: [col-1: MultiplayerCard cs-1 rs-1] [col-2–3: LeaderboardCard cs-2 rs-1]
   Placed 4/4 cards ✓
*/

const features = [
  {
    id: 'speed',
    colSpan: 'lg:col-span-2',
    cardClass: 'bento-card-violet',
    icon: 'BoltIcon',
    iconColor: 'text-primary',
    tag: 'Zero Friction',
    title: 'Instant Play, No Barriers',
    desc: 'Load the page, start playing. No signup. No download. No waiting. Ba Guru Game Adu runs entirely in your browser at 60fps using WebGL and Three.js — the fastest path from bored to playing.',
    stat: '< 2s',
    statLabel: 'Time to First Game',
    accent: true,
  },
  {
    id: 'reflex',
    colSpan: 'lg:col-span-1',
    cardClass: 'bento-card-cyan',
    icon: 'CpuChipIcon',
    iconColor: 'text-accent',
    tag: '3D Physics',
    title: 'Real Physics Engine',
    desc: 'Every sphere bounces, every block rotates. Powered by Three.js with real-time collision and gravity.',
    stat: '3D',
    statLabel: 'Full WebGL',
    accent: false,
  },
  {
    id: 'multiplayer',
    colSpan: 'lg:col-span-1',
    cardClass: 'bento-card-violet',
    icon: 'TrophyIcon',
    iconColor: 'text-primary',
    tag: 'Competitive',
    title: 'Beat Your High Score',
    desc: 'Every session is a new challenge. Scores ramp up with speed and combos — can you top the leaderboard?',
    stat: '∞',
    statLabel: 'Replayability',
    accent: false,
  },
  {
    id: 'leaderboard',
    colSpan: 'lg:col-span-2',
    cardClass: 'bento-card-cyan',
    icon: 'ChartBarIcon',
    iconColor: 'text-accent',
    tag: 'Community',
    title: 'More Games, More Glory',
    desc: 'The arcade is just getting started. New 3D mini-games drop regularly — from racing to rhythm to puzzle. Join the community and be first to play every launch.',
    stat: '2026',
    statLabel: 'Next Drop',
    accent: true,
  },
];

export default function FeaturesSection() {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="features" className="py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-px bg-accent" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent">
                Why Ba Guru
              </span>
            </div>
            <h2 className="font-display text-6xl md:text-7xl uppercase tracking-wide text-foreground leading-none">
              Built for <span className="text-accent cyan-glow">Players</span>
            </h2>
          </div>
          <p className="max-w-sm text-muted-foreground leading-relaxed md:text-right">
            Every design decision optimized for one thing: getting you into the game as fast as possible.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div
              key={f.id}
              className={`${f.colSpan} ${f.cardClass} rounded-xl p-8 flex flex-col justify-between min-h-[260px]`}
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(32px)',
                transition: `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`,
              }}
            >
              <div>
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-background/50 flex items-center justify-center">
                      <Icon name={f.icon as Parameters<typeof Icon>[0]['name']} size={20} className={f.iconColor} />
                    </div>
                    <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
                      {f.tag}
                    </span>
                  </div>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground border border-border rounded-full px-3 py-1">
                    {f.stat}
                    <span className="block text-[8px]">{f.statLabel}</span>
                  </span>
                </div>
                <h3 className="font-display text-2xl text-foreground mb-3 leading-tight">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
              {f.accent && (
                <div className="mt-6">
                  <a href="#arcade" className={`inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${f.iconColor} hover:opacity-70 transition-opacity`}>
                    Play Now
                    <Icon name="ArrowRightIcon" size={14} className={f.iconColor} />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
