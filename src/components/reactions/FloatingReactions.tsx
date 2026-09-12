'use client';

import React from 'react';
import { FloatingEmoji } from '@/types/sync';

interface FloatingReactionsProps {
  reactions: FloatingEmoji[];
}

export function FloatingReactions({ reactions }: FloatingReactionsProps) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {reactions.map((r) => (
        <div
          key={r.id}
          className="absolute bottom-12 animate-float-up text-3xl select-none filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
          style={{
            left: `${r.xOffset}%`,
          }}
        >
          {r.emoji}
        </div>
      ))}
    </div>
  );
}
