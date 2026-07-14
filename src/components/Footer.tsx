'use client';

import React, { useState } from 'react';
import AppLogo from '@/components/ui/AppLogo';

export default function Footer() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const el = document.createElement('textarea');
      el.value = window.location.href;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <footer className="border-t border-border pt-12 pb-10 px-4 sm:px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-8 sm:flex-row sm:items-center sm:justify-between">
        {/* Logo + Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <AppLogo size={32} />
          <div className="flex flex-col leading-none">
            <span className="font-display text-foreground" style={{ fontSize: '1rem', letterSpacing: '0.06em' }}>
              BA GURU
            </span>
            <span className="font-display text-primary" style={{ fontSize: '0.8rem', letterSpacing: '0.12em' }}>
              GAME ADU
            </span>
          </div>
        </div>

        {/* Social Icons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {/* Email */}
          <a
            href="mailto:sjenkar07.works@gmail.com"
            aria-label="Email Jenkar"
            className="w-10 h-10 flex items-center justify-center rounded-full border border-border text-muted-foreground hover:text-primary hover:border-primary transition-all duration-300 group"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:text-primary transition-colors">
              <rect width="20" height="16" x="2" y="4" rx="2"/>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
          </a>

          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/jenkar-s/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow Jenkar on LinkedIn"
            className="w-10 h-10 flex items-center justify-center rounded-full border border-border text-muted-foreground hover:text-[#0A66C2] hover:border-[#0A66C2] transition-all duration-300 group"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="group-hover:text-[#0A66C2] transition-colors">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>

          {/* Share / Copy Link */}
          <div className="relative">
            <button
              onClick={handleShare}
              aria-label="Share"
              className="w-10 h-10 flex items-center justify-center rounded-full border border-border text-muted-foreground hover:text-primary hover:border-primary transition-all duration-300 group"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:text-primary transition-colors">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                <polyline points="16 6 12 2 8 6"/>
                <line x1="12" x2="12" y1="2" y2="15"/>
              </svg>
            </button>
            {copied && (
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-card border border-primary/40 text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-lg">
                ✓ Link Copied!
              </div>
            )}
          </div>
        </div>

        {/* Legal */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-medium text-muted-foreground">
          <span>© 2026 Ba Guru Game Adu</span>
          <span className="text-border">·</span>
          <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
          <span className="text-border">·</span>
          <a href="#" className="hover:text-foreground transition-colors">Terms</a>
        </div>
      </div>
    </footer>
  );
}
