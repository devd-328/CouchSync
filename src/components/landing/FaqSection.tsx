'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQ_ITEMS = [
  {
    q: 'Is CouchSync Live really 100% free with no account required?',
    badge: 'Free & No Sign-up',
    badgeColor: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    a: 'Yes. CouchSync Live requires zero account registration, credit cards, or subscriptions. You can launch a room with a single click or paste an invite code to join a friend’s lounge instantly in any supported browser.',
  },
  {
    q: 'Does CouchSync Live store, record, or route my video/voice through a server?',
    badge: '100% Private & Direct',
    badgeColor: 'bg-orange-50 border-orange-200 text-[#E64A19]',
    a: 'Never. All camera and microphone feeds are sent directly between your browser and your friends with end-to-end encryption. No video or audio is ever uploaded, recorded, or stored on any server.',
  },
  {
    q: 'Which web browsers are supported?',
    badge: 'Cross-Browser',
    badgeColor: 'bg-indigo-50 border-indigo-200 text-indigo-700',
    a: 'CouchSync Live is fully supported on Chrome, Firefox, Safari, and Edge. No browser plugins, extensions, or software installations are needed.',
  },
  {
    q: 'What happens if someone has a slow connection or begins buffering?',
    badge: 'Smart Auto-Pause',
    badgeColor: 'bg-amber-50 border-amber-200 text-amber-700',
    a: 'CouchSync Live keeps everyone together: if someone’s video starts buffering, playback automatically pauses cleanly for everyone until they catch up, so nobody gets left behind or misses a scene.',
  },
  {
    q: 'How does video playback stay in sync without lag or audio echo?',
    badge: 'Lag-Free Instant Sync',
    badgeColor: 'bg-orange-50 border-orange-200 text-[#E64A19]',
    a: 'Our sync engine connects viewers in real time, sharing play, pause, seek, and speed controls instantly. Continuous background checks keep everyone perfectly aligned without any annoying audio echo or stutter.',
  },
  {
    q: 'What media formats and streaming sources can I watch?',
    badge: 'Web Videos · YouTube · Screen',
    badgeColor: 'bg-rose-50 border-rose-200 text-rose-700',
    a: 'You can stream online video links (.m3u8/.mp4) with subtitles, drop in your own local video files from your computer, paste any YouTube link for a watch party, or share your entire screen, app window, or browser tab in high quality.',
  },
];

export function FaqSection() {
  // Support independent toggle so users can expand or collapse any question
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  const toggleItem = (index: number) => {
    setOpenIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <section id="faq" className="relative z-10 w-full max-w-4xl mx-auto py-12 sm:py-20 px-4 sm:px-6 lg:px-8 border-t border-black/6">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100/80 border border-orange-200 text-xs text-[#E64A19] mb-3 font-semibold">
          <HelpCircle className="w-3.5 h-3.5 text-[#FF5722]" />
          <span>Got Questions?</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-950 tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Everything you need to know about CouchSync privacy, streaming, and synchronization.
        </p>
      </div>

      <div className="space-y-3">
        {FAQ_ITEMS.map((faq, index) => {
          const isOpen = openIndices.includes(index);
          const answerId = `faq-answer-${index}`;
          const buttonId = `faq-btn-${index}`;

          return (
            <div
              key={index}
              className={`rounded-2xl transition-all duration-200 overflow-hidden border ${
                isOpen
                  ? 'border-orange-300 bg-white shadow-md'
                  : 'border-black/6 bg-white hover:border-black/15 shadow-2xs'
              }`}
            >
              <button
                id={buttonId}
                type="button"
                onClick={() => toggleItem(index)}
                aria-expanded={isOpen}
                aria-controls={answerId}
                className="w-full text-left px-5 py-4.5 flex items-center justify-between gap-4 cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5722]/60 rounded-2xl"
              >
                <span className="flex flex-wrap items-center gap-2.5 pointer-events-none">
                  <span className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#FF5722] transition">
                    {faq.q}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${faq.badgeColor}`}>
                    {faq.badge}
                  </span>
                </span>
                <span
                  className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 pointer-events-none ${
                    isOpen
                      ? 'bg-orange-100 text-[#FF5722] rotate-180'
                      : 'bg-gray-100 text-gray-500 group-hover:bg-orange-50 group-hover:text-[#FF5722]'
                  }`}
                >
                  <ChevronDown className="w-4 h-4 transition-transform duration-200" />
                </span>
              </button>

              <div
                id={answerId}
                role="region"
                aria-labelledby={buttonId}
                className={`grid transition-all duration-200 ease-in-out ${
                  isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-black/5">
                    {faq.a}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
