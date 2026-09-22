import React from 'react';
import { PlusCircle, UserPlus, Play } from 'lucide-react';

const STEPS = [
  {
    step: '01',
    title: 'Create room',
    desc: 'Launch a cinema lounge in seconds with no account registration, credit cards, or downloads.',
    icon: <PlusCircle className="w-5 h-5 text-[#FF5722]" />,
  },
  {
    step: '02',
    title: 'Invite friends',
    desc: 'Copy your unique room invite link or share the 6-character room code with your friends.',
    icon: <UserPlus className="w-5 h-5 text-indigo-500" />,
  },
  {
    step: '03',
    title: 'Watch together',
    desc: 'Enjoy sub-second synchronized playback, direct P2P voice & video, and live reactions.',
    icon: <Play className="w-5 h-5 text-emerald-500" />,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative z-10 w-full max-w-6xl mx-auto py-12 sm:py-20 px-4 sm:px-6 lg:px-8 border-t border-black/6">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100/80 border border-orange-200 text-xs text-[#E64A19] mb-3 font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF5722]" />
          <span>Simple 3-Step Flow</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-950 tracking-tight">
          How CouchSync works
        </h2>
        <p className="mt-3 text-sm sm:text-base text-gray-600">
          From link to synchronized watch party in under 30 seconds.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        {STEPS.map((s, i) => (
          <div
            key={i}
            className="rounded-2xl bg-white border border-black/8 p-7 flex flex-col justify-between relative group hover:border-orange-300 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center">
                  {s.icon}
                </div>
                <span className="text-3xl font-black text-gray-200 group-hover:text-orange-300 transition">
                  {s.step}
                </span>
              </div>

              <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#FF5722] transition">
                {s.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-2 leading-relaxed font-normal">
                {s.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
