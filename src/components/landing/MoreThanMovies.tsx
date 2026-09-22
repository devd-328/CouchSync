'use client';

import React from 'react';
import { Tv, MonitorUp, Gamepad2, ArrowRight } from 'lucide-react';
import { MediaSourceType } from '@/types/sync';

interface MoreThanMoviesProps {
  onSelectMode: (mode: MediaSourceType) => void;
}

export function MoreThanMovies({ onSelectMode }: MoreThanMoviesProps) {
  return (
    <section id="modes" className="relative z-10 w-full max-w-6xl mx-auto py-12 sm:py-20 px-4 sm:px-6 lg:px-8 border-t border-black/6">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100/80 border border-orange-200 text-xs text-[#E64A19] mb-3 font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF5722]" />
          <span>Multiple Watch Party Modes</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-950 tracking-tight">
          More than just movies.
        </h2>
        <p className="mt-3 text-sm sm:text-base text-gray-600">
          Switch activities anytime in your room without leaving or creating a new link.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Mode 1: YouTube Watch Party */}
        <div className="rounded-2xl bg-white border border-black/8 hover:border-indigo-300 p-6 flex flex-col justify-between transition-all duration-200 shadow-sm hover:shadow-md group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <Tv className="w-5 h-5" />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                YouTube
              </span>
            </div>

            <h3 className="text-base font-bold text-gray-900 group-hover:text-indigo-600 transition">
              YouTube Watch Parties
            </h3>
            <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
              Paste any YouTube video or playlist URL. Everyone stays locked in sync with shared playback controls and queueing.
            </p>

            <div className="mt-5 p-3 rounded-xl bg-gray-50 border border-black/5 space-y-2 font-mono text-xs">
              <div className="flex items-center gap-2 text-gray-700 bg-white px-2.5 py-1.5 rounded-lg border border-black/5 shadow-2xs">
                <span className="text-red-500 font-bold">▶</span>
                <span className="truncate text-[11px]">youtube.com/watch?v=...</span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-gray-500 px-1">
                <span className="text-indigo-600 font-semibold">● 1080p Synced</span>
                <span>Shared Queue (3)</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onSelectMode('youtube')}
            className="mt-6 w-full py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100/80 text-xs font-semibold text-indigo-700 transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Launch YouTube Party</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mode 2: Screen Sharing */}
        <div className="rounded-2xl bg-white border border-black/8 hover:border-[#FF5722]/50 p-6 flex flex-col justify-between transition-all duration-200 shadow-sm hover:shadow-md group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FF5722]">
                <MonitorUp className="w-5 h-5" />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-orange-50 text-[#E64A19] border border-orange-200">
                Native HD
              </span>
            </div>

            <h3 className="text-base font-bold text-gray-900 group-hover:text-[#FF5722] transition">
              Native Screen Sharing
            </h3>
            <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
              Stream your desktop, browser tabs, or applications with full system audio. Perfect for streaming personal media or gaming.
            </p>

            <div className="mt-5 p-3 rounded-xl bg-gray-50 border border-black/5 space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between text-gray-800 bg-white px-2.5 py-1.5 rounded-lg border border-black/5 shadow-2xs">
                <span className="truncate text-[11px]">Display 1 · 1920×1080</span>
                <span className="text-[#FF5722] text-[10px] font-bold">60 FPS</span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-gray-500 px-1">
                <span className="text-emerald-600 font-semibold">● System Audio</span>
                <span>Ultra-low delay</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onSelectMode('screenshare')}
            className="mt-6 w-full py-2.5 rounded-xl bg-orange-50 hover:bg-orange-100/80 text-xs font-semibold text-[#E64A19] transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Launch Screen Share</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mode 3: Trivia & Hangout Games */}
        <div className="rounded-2xl bg-white border border-black/8 hover:border-amber-300 p-6 flex flex-col justify-between transition-all duration-200 shadow-sm hover:shadow-md group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                Multiplayer
              </span>
            </div>

            <h3 className="text-base font-bold text-gray-900 group-hover:text-amber-600 transition">
              Movie Trivia &amp; Polls
            </h3>
            <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
              Play real-time multiplayer movie trivia games or run room polls during movie intermissions. Compete for the highest cinephile score.
            </p>

            <div className="mt-5 p-3 rounded-xl bg-gray-50 border border-black/5 space-y-2 font-mono text-xs">
              <div className="text-[11px] text-gray-800 font-sans font-medium truncate">
                Q: Which director directed Inception?
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                <div className="p-1 rounded bg-amber-100 text-amber-900 text-center font-bold">
                  ✓ Nolan
                </div>
                <div className="p-1 rounded bg-white text-gray-500 text-center border border-black/5">
                  Spielberg
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onSelectMode('trivia')}
            className="mt-6 w-full py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100/80 text-xs font-semibold text-amber-800 transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Launch Trivia Room</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
