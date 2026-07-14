'use client';

import React, { useEffect, useRef, useState } from 'react';

interface StatItem {
  value: number;
  suffix: string;
  label: string;
  sublabel: string;
  color: 'primary' | 'accent' | 'foreground';
}

const STATS: StatItem[] = [
  { value: 4200, suffix: '+', label: 'Live Players', sublabel: 'Online right now', color: 'primary' },
  { value: 2, suffix: '', label: 'Playable Games', sublabel: 'More dropping soon', color: 'accent' },
  { value: 1200000, suffix: '+', label: 'Sessions Played', sublabel: 'Total all-time', color: 'foreground' },
  { value: 98, suffix: '%', label: 'Uptime', sublabel: 'Always online', color: 'primary' },
];

function CountUp({ target, suffix, active }: { target: number; suffix: string; active: boolean }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!active) return;
    const duration = 2000;
    const start = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [active, target]);

  const display =
    target >= 1000000
      ? `${(current / 1000000).toFixed(1)}M`
      : target >= 1000
      ? `${(current / 1000).toFixed(1)}K`
      : current;

  return (
    <span>
      {display}{suffix}
    </span>
  );
}

export default function StatsSection() {
  const [active, setActive] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setActive(true); },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const colorClass = {
    primary: 'text-primary',
    accent: 'text-accent',
    foreground: 'text-foreground',
  };

  return (
    <section ref={sectionRef} id="stats" className="py-20 px-6 md:px-12 border-y border-border">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((stat, i) => (
            <div key={i} className="stat-card text-center">
              <p className={`font-display text-5xl md:text-6xl ${colorClass[stat.color]}`}>
                <CountUp target={stat.value} suffix={stat.suffix} active={active} />
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mt-3">{stat.label}</p>
              <p className="text-[10px] text-muted-foreground mt-1">{stat.sublabel}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
