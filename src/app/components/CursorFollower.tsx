'use client';

import React, { useEffect, useRef } from 'react';

export default function CursorFollower() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top = `${e.clientY}px`;
        dotRef.current.style.transform = 'translate(-50%, -50%)';
      }
    };

    let animId: number;
    const animateRing = () => {
      ringPos.current.x += (mouseRef.current.x - ringPos.current.x) * 0.12;
      ringPos.current.y += (mouseRef.current.y - ringPos.current.y) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.left = `${ringPos.current.x}px`;
        ringRef.current.style.top = `${ringPos.current.y}px`;
        ringRef.current.style.transform = 'translate(-50%, -50%)';
      }
      animId = requestAnimationFrame(animateRing);
    };

    window.addEventListener('mousemove', handleMove);
    animId = requestAnimationFrame(animateRing);

    // Scale on interactive elements
    const interactives = document.querySelectorAll('a, button, [data-interactive]');
    const enterHandler = () => {
      if (dotRef.current) dotRef.current.style.transform = 'translate(-50%, -50%) scale(2)';
      if (ringRef.current) ringRef.current.style.transform = 'translate(-50%, -50%) scale(2)';
    };
    const leaveHandler = () => {
      if (dotRef.current) dotRef.current.style.transform = 'translate(-50%, -50%) scale(1)';
      if (ringRef.current) ringRef.current.style.transform = 'translate(-50%, -50%) scale(1)';
    };
    interactives.forEach((el) => {
      el.addEventListener('mouseenter', enterHandler);
      el.addEventListener('mouseleave', leaveHandler);
    });

    return () => {
      window.removeEventListener('mousemove', handleMove);
      cancelAnimationFrame(animId);
      interactives.forEach((el) => {
        el.removeEventListener('mouseenter', enterHandler);
        el.removeEventListener('mouseleave', leaveHandler);
      });
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot hidden md:block" />
      <div ref={ringRef} className="cursor-ring hidden md:block" />
    </>
  );
}
