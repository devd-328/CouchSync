'use client';

import React from 'react';
import { Play, Radio } from 'lucide-react';

interface FinalCTAProps {
  onCreateRoom: () => void;
  onJoinRoom: () => void;
}

export function FinalCTA({ onCreateRoom, onJoinRoom }: FinalCTAProps) {
  return (
    <section className="relative z-10 w-full max-w-6xl mx-auto py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-t border-black/6">
      <div className="rounded-3xl bg-linear-to-b from-orange-50 to-white border border-orange-200/80 p-8 sm:p-14 text-center max-w-3xl mx-auto shadow-xl relative overflow-hidden">
        {/* Subtle orange glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-40 bg-orange-400/10 rounded-full blur-3xl pointer-events-none" />

        <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-gray-950 tracking-tight leading-tight">
          Make a room. Invite your people. Press play.
        </h2>
        <p className="mt-3 text-sm sm:text-base text-gray-600 max-w-lg mx-auto">
          No credit card. No account sign-up. Just open a room and invite your friends in one click.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <button
            onClick={onCreateRoom}
            type="button"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-linear-to-r from-[#FF5722] to-[#FF7043] hover:from-[#F4511E] hover:to-[#FF5722] text-white font-bold text-sm shadow-[0_6px_20px_rgba(255,87,34,0.35)] transition transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Create a room</span>
          </button>

          <button
            onClick={onJoinRoom}
            type="button"
            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white hover:bg-gray-50 text-gray-800 hover:text-black font-semibold text-sm border border-gray-200 shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Radio className="w-4 h-4 text-[#FF5722]" />
            <span>Join with code</span>
          </button>
        </div>

        <div className="mt-6 text-xs text-gray-500">
          Works instantly on Chrome, Firefox, Safari &amp; Edge
        </div>
      </div>
    </section>
  );
}
