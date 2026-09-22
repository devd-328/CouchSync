'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Palette, Check } from 'lucide-react';
import { ThemeMode } from '@/types/sync';

interface ThemeSelectorProps {
  currentTheme: ThemeMode;
  onSelectTheme: (theme: ThemeMode) => void;
}

const THEMES: {
  id: ThemeMode;
  label: string;
  dotColor: string;
  /** Highlight color for the selected state — uses each theme's accent */
  selectedClass: string;
}[] = [
  { id: 'obsidian',  label: 'Obsidian Space',  dotColor: '#00F2FE', selectedClass: 'bg-cyan-500/20 text-cyan-200 border-cyan-400/30'   },
  { id: 'cyberpunk', label: 'Cyberpunk Neon',   dotColor: '#FF007F', selectedClass: 'bg-pink-500/20 text-pink-200 border-pink-400/30'   },
  { id: 'retro',     label: 'Retro Lounge',     dotColor: '#FFB300', selectedClass: 'bg-amber-500/20 text-amber-200 border-amber-400/30' },
  { id: 'oled',      label: 'Pitch OLED',       dotColor: '#6B7280', selectedClass: 'bg-white/10 text-gray-200 border-white/20'         },
];

export function ThemeSelector({ currentTheme, onSelectTheme }: ThemeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open theater theme picker"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className="p-2 rounded-xl bg-gray-100 border border-gray-200 hover:bg-orange-50 text-gray-700 hover:text-[#FF5722] transition cursor-pointer"
        title="Ambient Theater Themes"
      >
        <Palette className="w-4 h-4 text-[#FF5722]" />
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label="Theater theme"
          className="absolute top-11 right-0 w-48 p-2 rounded-2xl bg-white border border-black/10 shadow-2xl z-50 flex flex-col gap-1 text-xs text-gray-900 animate-in fade-in duration-150"
        >
          <span className="text-[10px] font-bold text-gray-500 px-2 py-1 uppercase tracking-wider">
            Theater Theme
          </span>
          {THEMES.map((t) => {
            const isSelected = currentTheme === t.id;
            return (
              <button
                key={t.id}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onSelectTheme(t.id);
                  setIsOpen(false);
                }}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl border transition cursor-pointer ${
                  isSelected
                    ? 'bg-orange-50 text-[#EA580C] border-orange-200 font-bold'
                    : 'border-transparent hover:bg-gray-100 text-gray-700 font-medium'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs"
                    style={{ backgroundColor: t.dotColor }}
                  />
                  <span>{t.label}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#EA580C]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
