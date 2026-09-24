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
      <div className="max-w-2xl mx-auto text-center mb-10 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100/80 border border-orange-200 text-xs text-[#E64A19] mb-3 font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF5722]" />
          <span>More ways to watch</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-950 tracking-tight">
          More than just movies.
        </h2>
        <p className="mt-3 text-sm sm:text-base text-gray-700 font-medium">
          Switch activities anytime, in the same room.
        </p>
      </div>

      <div className="group grid grid-cols-1 md:grid-cols-3 gap-6" role="list">
        {/* Mode 1: YouTube Watch Party */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => onSelectMode('youtube')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onSelectMode('youtube');
            }
          }}
          className="relative rounded-3xl bg-white border border-black/8 p-6 sm:p-7 flex flex-col justify-between shadow-sm transition-all duration-300 cursor-pointer active:scale-[0.99] hover:border-indigo-300 hover:shadow-[0_18px_40px_-12px_rgba(99,102,241,0.20)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 select-none"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-xs mb-4">
              <Tv className="w-5 h-5" />
            </div>

            <h3 className="text-base font-bold text-gray-900 group-hover:text-indigo-600 transition">
              YouTube Watch Parties
            </h3>
            <p className="text-xs sm:text-sm text-gray-700 font-medium mt-1.5 leading-relaxed">
              Paste a link. Everyone watches in sync.
            </p>

            {/* Mockup hidden on mobile */}
            <div className="hidden md:block mt-5 p-3 rounded-xl bg-gray-50 border border-black/5 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-gray-800 bg-white px-2.5 py-2 rounded-lg border border-black/5 shadow-2xs">
                <span className="text-red-500 font-bold text-xs">▶</span>
                <span className="truncate text-xs font-mono text-gray-700">youtube.com/watch?v=...</span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-600 px-1">
                <span className="text-indigo-600 font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  Synced
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectMode('youtube');
            }}
            className="mt-6 w-full py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-xs font-bold text-indigo-700 transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Launch YouTube Party</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mode 2: Screen Sharing */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => onSelectMode('screenshare')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onSelectMode('screenshare');
            }
          }}
          className="relative rounded-3xl bg-white border border-black/8 p-6 sm:p-7 flex flex-col justify-between shadow-sm transition-all duration-300 cursor-pointer active:scale-[0.99] hover:border-orange-300 hover:shadow-[0_18px_40px_-12px_rgba(255,87,34,0.20)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5722] select-none"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FF5722] shadow-xs mb-4">
              <MonitorUp className="w-5 h-5" />
            </div>

            <h3 className="text-base font-bold text-gray-900 group-hover:text-[#FF5722] transition">
              Native Screen Sharing
            </h3>
            <p className="text-xs sm:text-sm text-gray-700 font-medium mt-1.5 leading-relaxed">
              Share a tab, window, or your whole screen.
            </p>

            {/* Mockup hidden on mobile */}
            <div className="hidden md:block mt-5 p-3 rounded-xl bg-gray-50 border border-black/5 text-xs">
              <div className="flex items-center justify-between text-gray-800 bg-white px-2.5 py-2 rounded-lg border border-black/5 shadow-2xs">
                <span className="text-xs font-semibold text-gray-800 truncate">Display 1</span>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectMode('screenshare');
            }}
            className="mt-6 w-full py-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-xs font-bold text-[#E64A19] transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Launch Screen Share</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mode 3: Trivia & Hangout Games */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => onSelectMode('trivia')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onSelectMode('trivia');
            }
          }}
          className="relative rounded-3xl bg-white border border-black/8 p-6 sm:p-7 flex flex-col justify-between shadow-sm transition-all duration-300 cursor-pointer active:scale-[0.99] hover:border-amber-300 hover:shadow-[0_18px_40px_-12px_rgba(245,158,11,0.20)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 select-none"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shadow-xs mb-4">
              <Gamepad2 className="w-5 h-5" />
            </div>

            <h3 className="text-base font-bold text-gray-900 group-hover:text-amber-600 transition">
              Movie Trivia &amp; Polls
            </h3>
            <p className="text-xs sm:text-sm text-gray-700 font-medium mt-1.5 leading-relaxed">
              Quiz your friends or run a quick poll.
            </p>

            <div className="mt-5 p-3 rounded-xl bg-gray-50 border border-black/5 space-y-2 text-xs">
              <div className="text-xs text-gray-800 font-sans font-semibold truncate">
                Q: Who directed Inception?
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                <div className="py-1 px-2 rounded-lg bg-amber-100 text-amber-900 text-center font-bold">
                  ✓ Nolan
                </div>
                <div className="py-1 px-2 rounded-lg bg-white text-gray-600 text-center border border-black/5 font-medium">
                  Spielberg
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectMode('trivia');
            }}
            className="mt-6 w-full py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-xs font-bold text-amber-800 transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Launch Trivia Room</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
