'use client';

import React, { useRef, useEffect, useState } from 'react';
import Icon from '@/components/ui/AppIcon';

export default function CTASection() {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="cta" className="py-24 px-6 md:px-12 relative overflow-hidden">
      {/* Atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="blob-primary absolute inset-0 w-full h-full opacity-15" />
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 70% 70% at 50% 50%, rgba(124,58,237,0.12) 0%, transparent 70%)',
          }}
        />
      </div>

      <div
        ref={sectionRef}
        className="max-w-4xl mx-auto text-center relative z-10"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(40px)',
          transition: 'opacity 0.8s ease, transform 0.8s ease',
        }}
      >
        {/* Tag */}
        <div className="hero-badge mb-8 inline-flex">
          <Icon name="SparklesIcon" size={12} className="text-primary" />
          Join the Community
        </div>

        {/* Headline */}
        <h2 className="font-display text-6xl md:text-8xl uppercase tracking-wide text-foreground leading-none mb-8">
          The Arcade
          <br />
          <span className="text-primary violet-glow">Never Sleeps</span>
        </h2>

        <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto mb-12">
          New games. New challenges. New records to break.
          Ba Guru Game Adu is always live — jump in and play with thousands of players worldwide.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <a href="#arcade" className="btn-primary text-sm px-10 py-4">
            Play Games Now
          </a>
          <button className="btn-outline text-sm px-10 py-4">
            Follow for Updates
          </button>
        </div>

        {/* Social proof mini */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
          {[
            { icon: 'ChatBubbleLeftEllipsisIcon', label: 'Discord Community', value: '2.4K members' },
            { icon: 'ShareIcon', label: 'Social Media', value: 'Daily updates' },
            { icon: 'TrophyIcon', label: 'Leaderboards', value: 'Coming soon' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Icon name={item.icon as Parameters<typeof Icon>[0]['name']} size={14} className="text-primary" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{item.label}</p>
                <p className="text-sm font-bold text-foreground">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
