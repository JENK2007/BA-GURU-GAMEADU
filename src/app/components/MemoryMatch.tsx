'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';

const SYMBOLS = ['⚡', '🔮', '💎', '🌀', '🔥', '⭐', '🎯', '🚀'];

interface Card {
  id: number;
  symbol: string;
  flipped: boolean;
  matched: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const GLOW_COLORS = ['#a78bfa', '#38bdf8', '#f472b6', '#34d399', '#fb923c', '#facc15', '#f87171', '#818cf8'];

export default function MemoryMatch() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matched, setMatched] = useState(0);
  const [won, setWon] = useState(false);
  const [started, setStarted] = useState(false);
  const [time, setTime] = useState(0);
  const [locked, setLocked] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const initGame = useCallback(() => {
    const deck = shuffle([...SYMBOLS, ...SYMBOLS]).map((symbol, i) => ({
      id: i,
      symbol,
      flipped: false,
      matched: false,
    }));
    setCards(deck);
    setFlipped([]);
    setMoves(0);
    setMatched(0);
    setWon(false);
    setStarted(true);
    setTime(0);
    setLocked(false);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setTime(t => t + 1), 1000);
  }, []);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  useEffect(() => {
    if (won && timerRef.current) clearInterval(timerRef.current);
  }, [won]);

  const handleFlip = useCallback((id: number) => {
    if (locked) return;
    setCards(prev => {
      const card = prev.find(c => c.id === id);
      if (!card || card.flipped || card.matched) return prev;
      return prev.map(c => c.id === id ? { ...c, flipped: true } : c);
    });
    setFlipped(prev => {
      if (prev.length === 1 && prev[0] !== id) {
        const newFlipped = [...prev, id];
        if (newFlipped.length === 2) {
          setMoves(m => m + 1);
          setLocked(true);
          setTimeout(() => {
            setCards(prevCards => {
              const [a, b] = newFlipped;
              const cardA = prevCards.find(c => c.id === a);
              const cardB = prevCards.find(c => c.id === b);
              if (cardA && cardB && cardA.symbol === cardB.symbol) {
                const updated = prevCards.map(c =>
                  c.id === a || c.id === b ? { ...c, matched: true, flipped: true } : c
                );
                const newMatched = updated.filter(c => c.matched).length / 2;
                setMatched(newMatched);
                if (newMatched === SYMBOLS.length) setWon(true);
                return updated;
              } else {
                return prevCards.map(c =>
                  c.id === a || c.id === b ? { ...c, flipped: false } : c
                );
              }
            });
            setFlipped([]);
            setLocked(false);
          }, 900);
          return newFlipped;
        }
        return newFlipped;
      }
      if (prev.length === 0) return [id];
      return prev;
    });
  }, [locked]);

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  if (!started) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#050510] gap-6 p-6">
        <div className="text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-3">Memory</p>
          <h3 className="text-3xl font-black uppercase tracking-tight text-foreground mb-2">
            Match <span className="text-accent">Cards</span>
          </h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            Flip cards to find matching pairs. Beat it in the fewest moves!
          </p>
        </div>
        <button
          onClick={initGame}
          className="btn-primary text-sm px-8 py-3"
        >
          Start Game
        </button>
      </div>
    );
  }

  if (won) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#050510] gap-6 p-6">
        <div className="text-center">
          <p className="text-4xl mb-4">🏆</p>
          <h3 className="text-3xl font-black uppercase tracking-tight text-foreground mb-2">
            You <span className="text-primary violet-glow">Won!</span>
          </h3>
          <p className="text-muted-foreground text-sm mb-1">{moves} moves · {formatTime(time)}</p>
          <p className="text-xs text-muted-foreground">
            {moves <= 12 ? '⚡ Perfect memory!' : moves <= 18 ? '🔥 Great job!' : '💪 Keep practicing!'}
          </p>
        </div>
        <button onClick={initGame} className="btn-primary text-sm px-8 py-3">
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-[#050510] p-4 gap-3">
      {/* HUD */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Moves</p>
            <p className="text-lg font-black text-primary">{moves}</p>
          </div>
          <div className="text-center">
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Pairs</p>
            <p className="text-lg font-black text-accent">{matched}/{SYMBOLS.length}</p>
          </div>
        </div>
        <div className="text-center">
          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Time</p>
          <p className="text-lg font-black text-foreground font-mono">{formatTime(time)}</p>
        </div>
        <button
          onClick={initGame}
          className="text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors border border-border rounded px-2 py-1"
        >
          Reset
        </button>
      </div>

      {/* Grid */}
      <div className="flex-1 grid grid-cols-4 gap-2 content-center">
        {cards.map((card, i) => {
          const colorIdx = SYMBOLS.indexOf(card.symbol);
          const glowColor = GLOW_COLORS[colorIdx] || '#a78bfa';
          const isVisible = card.flipped || card.matched;
          return (
            <div
              key={card.id}
              onClick={() => handleFlip(card.id)}
              className="relative cursor-pointer"
              style={{ perspective: '600px', aspectRatio: '1' }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  position: 'relative',
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.45s cubic-bezier(0.4,0,0.2,1)',
                  transform: isVisible ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
              >
                {/* Back */}
                <div
                  style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                  className="absolute inset-0 rounded-lg border border-border bg-card flex items-center justify-center"
                >
                  <div
                    className="w-5 h-5 rounded-sm opacity-40"
                    style={{ background: `linear-gradient(135deg, #7c3aed, #38bdf8)` }}
                  />
                </div>
                {/* Front */}
                <div
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    boxShadow: card.matched ? `0 0 16px ${glowColor}88` : 'none',
                  }}
                  className={`absolute inset-0 rounded-lg border flex items-center justify-center text-2xl transition-all duration-300 ${
                    card.matched
                      ? 'bg-card/80' :'bg-card'
                  }`}
                  data-border-color={glowColor}
                >
                  <span
                    className="select-none"
                    style={{
                      filter: card.matched ? `drop-shadow(0 0 8px ${glowColor})` : 'none',
                      fontSize: 'clamp(16px, 3vw, 26px)',
                    }}
                  >
                    {card.symbol}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
