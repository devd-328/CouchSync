'use client';

import React, { useState } from 'react';
import { Palette, Check } from 'lucide-react';
import { ThemeMode } from '@/types/sync';

interface ThemeSelectorProps {
  currentTheme: ThemeMode;
  onSelectTheme: (theme: ThemeMode) => void;
}

const THEMES: { id: ThemeMode; label: string; dotColor: string }[] = [
  { id: 'obsidian', label: 'Obsidian Space', dotColor: '#00F2FE' },
  { id: 'cyberpunk', label: 'Cyberpunk Neon', dotColor: '#FF007F' },
  { id: 'retro', label: 'Retro Lounge', dotColor: '#FFB300' },
  { id: 'oled', label: 'Pitch OLED', dotColor: '#6B7280' },
];

export function ThemeSelector({ currentTheme, onSelectTheme }: ThemeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-xl glass-pill hover:bg-white/15 text-gray-300 transition"
        title="Ambient Theater Themes"
      >
        <Palette className="w-4 h-4 text-cyan-400" />
      </button>

      {isOpen && (
        <div className="absolute top-10 right-0 w-48 p-2 rounded-2xl glass-panel border-white/10 shadow-2xl bg-black/90 backdrop-blur-xl z-50 flex flex-col gap-1 text-xs">
          <span className="text-[10px] font-semibold text-gray-400 px-2 py-1 uppercase tracking-wider">
            Theater Theme
          </span>
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                onSelectTheme(t.id);
                setIsOpen(false);
              }}
              className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl transition ${
                currentTheme === t.id
                  ? 'bg-cyan-500/20 text-cyan-200 font-semibold'
                  : 'hover:bg-white/10 text-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: t.dotColor }}
                />
                <span>{t.label}</span>
              </div>
              {currentTheme === t.id && <Check className="w-3.5 h-3.5 text-cyan-400" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
