'use client';

import React, { useState, useEffect } from 'react';
import AppLogo from '@/components/ui/AppLogo';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const navLinks = [
    { label: 'Arcade', href: '#arcade' },
    { label: 'Features', href: '#features' },
    { label: 'Community', href: '#cta' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? 'glass-nav shadow-lg shadow-black/30'
            : 'bg-transparent'
        }`}
        style={{ minHeight: scrolled ? '70px' : '84px' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 h-full flex items-center justify-between"
          style={{ paddingTop: scrolled ? '14px' : '20px', paddingBottom: scrolled ? '14px' : '20px' }}
        >

          {/* ── Brand ── */}
          <a
            href="#hero"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 group select-none"
            aria-label="Ba Guru Game Adu – home"
          >
            <AppLogo
              size={40}
              className="cursor-pointer shrink-0 transition-transform duration-300 group-hover:scale-110"
            />
            {/* Brand name — always visible on all sizes */}
            <div className="flex flex-col leading-none">
              <span
                className="font-display text-foreground transition-colors duration-300 group-hover:text-primary"
                style={{ fontSize: 'clamp(1.1rem, 3vw, 1.6rem)', letterSpacing: '0.06em' }}
              >
                BA GURU
              </span>
              <span
                className="font-display text-primary"
                style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.3rem)', letterSpacing: '0.12em' }}
              >
                GAME ADU
              </span>
            </div>
          </a>

          {/* ── Desktop Nav ── */}
          <div className="hidden lg:flex items-center gap-8 xl:gap-12">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="relative font-mono text-[11px] xl:text-[12px] uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground transition-colors duration-300 group"
              >
                {link.label}
                {/* animated underline */}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* ── Desktop CTA ── */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="#arcade"
              className="btn-primary"
              style={{ fontSize: '11px', padding: '0.7rem 1.8rem' }}
            >
              ▶ Play Now
            </a>
          </div>

          {/* ── Mobile: brand + hamburger row ── */}
          <div className="flex lg:hidden items-center gap-3">
            {/* Mobile Play Now pill */}
            <a
              href="#arcade"
              className="btn-primary"
              style={{ fontSize: '10px', padding: '0.5rem 1.2rem' }}
            >
              Play
            </a>

            {/* Hamburger */}
            <button
              className="relative w-10 h-10 flex items-center justify-center rounded-lg border border-border/60 bg-card/50 backdrop-blur-sm transition-colors hover:border-primary/50"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              <span className="sr-only">{menuOpen ? 'Close' : 'Open'} navigation</span>
              <div className="w-5 flex flex-col gap-1.5">
                <span
                  className={`block h-0.5 bg-foreground rounded-full origin-center transition-all duration-300 ${
                    menuOpen ? 'rotate-45 translate-y-2' : ''
                  }`}
                />
                <span
                  className={`block h-0.5 bg-foreground rounded-full transition-all duration-300 ${
                    menuOpen ? 'opacity-0 scale-x-0' : ''
                  }`}
                />
                <span
                  className={`block h-0.5 bg-foreground rounded-full origin-center transition-all duration-300 ${
                    menuOpen ? '-rotate-45 -translate-y-2' : ''
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Full-Screen Drawer ── */}
      <div
        className={`lg:hidden fixed inset-0 z-40 flex flex-col transition-all duration-400 ease-in-out ${
          menuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        style={{ background: 'rgba(5,5,8,0.97)', backdropFilter: 'blur(24px)' }}
        aria-hidden={!menuOpen}
      >
        {/* Top bar inside drawer (shows brand again) */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border/40">
          <div className="flex items-center gap-3">
            <AppLogo size={36} />
            <div className="flex flex-col leading-none">
              <span className="font-display text-foreground" style={{ fontSize: '1.1rem', letterSpacing: '0.06em' }}>
                BA GURU
              </span>
              <span className="font-display text-primary" style={{ fontSize: '0.9rem', letterSpacing: '0.12em' }}>
                GAME ADU
              </span>
            </div>
          </div>
          <button
            onClick={() => setMenuOpen(false)}
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-border/60 bg-card/50"
            aria-label="Close menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Nav links */}
        <div className="flex-1 flex flex-col items-center justify-center gap-2 px-6">
          {navLinks.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="w-full max-w-sm text-center py-5 border-b border-border/20 group transition-all duration-300"
              style={{
                transitionDelay: menuOpen ? `${i * 60}ms` : '0ms',
              }}
            >
              <span className="font-display text-foreground group-hover:text-primary transition-colors duration-200"
                style={{ fontSize: 'clamp(2rem, 8vw, 3.5rem)', letterSpacing: '0.08em' }}
              >
                {link.label}
              </span>
            </a>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="px-6 pb-10 pt-6 flex flex-col items-center gap-4">
          <a
            href="#arcade"
            onClick={() => setMenuOpen(false)}
            className="btn-primary w-full max-w-sm text-center"
            style={{ fontSize: '13px', padding: '1rem 2rem' }}
          >
            ▶ Enter Arcade Now
          </a>
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
            2 Games · Free to Play
          </p>
        </div>
      </div>
    </>
  );
}
