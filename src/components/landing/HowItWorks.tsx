import React from 'react';
import { PlusCircle, UserPlus, Play } from 'lucide-react';

interface HowItWorksProps {
  onCreateRoom?: () => void;
  onJoinRoom?: () => void;
}

const STEPS = [
  {
    step: '1',
    title: 'Create room',
    desc: 'No sign-up, no downloads.',
    icon: <PlusCircle className="w-5 h-5 text-[#FF5722]" />,
  },
  {
    step: '2',
    title: 'Invite friends',
    desc: 'Share the link or room code.',
    icon: <UserPlus className="w-5 h-5 text-indigo-500" />,
  },
  {
    step: '3',
    title: 'Watch together',
    desc: 'Synced playback, video chat, and reactions.',
    icon: <Play className="w-5 h-5 text-emerald-500" />,
  },
];

export function HowItWorks({ onCreateRoom, onJoinRoom }: HowItWorksProps) {
  return (
    <section id="how-it-works" className="relative z-10 w-full max-w-6xl mx-auto py-12 sm:py-20 px-4 sm:px-6 lg:px-8 border-t border-black/6">
      <div className="max-w-2xl mx-auto text-center mb-10 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100/80 border border-orange-200 text-xs text-[#E64A19] mb-3 font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF5722]" />
          <span>3 easy steps</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-950 tracking-tight">
          How CouchSync works
        </h2>
        <p className="mt-3 text-sm sm:text-base text-gray-700 font-medium">
          Ready in under a minute.
        </p>
      </div>

      {/* Mobile: Compact rows / vertical timeline */}
      <div className="md:hidden bg-white rounded-3xl border border-black/8 p-4 sm:p-5 shadow-xs divide-y divide-black/6" role="list">
        {STEPS.map((s, i) => (
          <div key={i} role="listitem" className="flex items-center gap-3.5 py-3.5 first:pt-0 last:pb-0">
            <div className="relative shrink-0">
              <div className="w-11 h-11 rounded-2xl bg-orange-50/80 border border-orange-100 flex items-center justify-center shadow-2xs">
                {s.icon}
              </div>
              <span className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-orange-100 border border-orange-200 text-[11px] font-black text-[#FF5722] flex items-center justify-center shadow-2xs">
                {s.step}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-gray-900 leading-tight">
                {s.title}
              </h3>
              <p className="text-xs text-gray-700 mt-0.5 leading-snug font-medium">
                {s.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: 3 Clean Grid Cards with High-Contrast Step Badges */}
      <div className="hidden md:grid md:grid-cols-3 gap-6 relative" role="list">
        {STEPS.map((s, i) => (
          <div
            key={i}
            role="listitem"
            tabIndex={0}
            className="group/card relative rounded-3xl bg-white border border-black/8 p-7 flex flex-col justify-between shadow-sm transition-all duration-300 hover:border-orange-300 hover:shadow-[0_18px_40px_-12px_rgba(255,87,34,0.20)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5722]"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl bg-orange-50/80 border border-orange-100 flex items-center justify-center transition-all duration-300 group-hover/card:bg-orange-100 group-hover/card:scale-105 shadow-xs">
                  {s.icon}
                </div>
                <span className="w-8 h-8 rounded-full bg-orange-100 border border-orange-200 text-sm font-black text-[#FF5722] flex items-center justify-center shadow-2xs">
                  {s.step}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-gray-900 transition-colors duration-300 group-hover/card:text-[#FF5722]">
                {s.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-700 mt-2 leading-relaxed font-medium">
                {s.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Action CTA below the steps */}
      <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={onCreateRoom}
          className="w-full sm:w-auto px-7 py-3 rounded-full bg-linear-to-r from-[#FF5722] to-[#FF7043] text-white font-bold text-sm shadow-[0_10px_25px_-5px_rgba(255,87,34,0.35)] hover:shadow-[0_14px_30px_-5px_rgba(255,87,34,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer text-center"
        >
          Create a room
        </button>
        {onJoinRoom && (
          <button
            type="button"
            onClick={onJoinRoom}
            className="text-xs sm:text-sm font-semibold text-gray-600 hover:text-[#FF5722] transition-colors py-1.5 px-3 cursor-pointer"
          >
            Have a code? <span className="underline decoration-orange-300 underline-offset-4 font-bold text-gray-800 hover:text-[#FF5722]">Join a room</span>
          </button>
        )}
      </div>
    </section>
  );
}
