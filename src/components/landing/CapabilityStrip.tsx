import React from 'react';
import { Film, Tv, MonitorUp, Gamepad2 } from 'lucide-react';

const CAPABILITIES = [
  {
    icon: <Film className="w-4 h-4 text-[#FF5722]" />,
    title: 'Movies & Streams',
    desc: 'HLS (.m3u8), MP4 links, local files & subtitles',
  },
  {
    icon: <Tv className="w-4 h-4 text-indigo-500" />,
    title: 'YouTube Parties',
    desc: 'Paste any video or playlist link with shared queue',
  },
  {
    icon: <MonitorUp className="w-4 h-4 text-emerald-500" />,
    title: 'Screen Sharing',
    desc: 'Stream desktop, browser tabs, or games in HD',
  },
  {
    icon: <Gamepad2 className="w-4 h-4 text-amber-500" />,
    title: 'Movie Trivia & Polls',
    desc: 'Interactive multiplayer trivia during breaks',
  },
];

export function CapabilityStrip() {
  return (
    <section className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="rounded-2xl bg-white border border-black/6 p-3 sm:p-4 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-black/6">
          {CAPABILITIES.map((cap, i) => (
            <div
              key={i}
              className="flex items-center gap-3.5 p-3 sm:px-4 lg:px-5 hover:bg-orange-50/40 transition rounded-xl"
            >
              <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                {cap.icon}
              </div>
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-bold text-gray-900 tracking-tight truncate">
                  {cap.title}
                </div>
                <div className="text-[11px] text-gray-500 truncate mt-0.5 font-normal">
                  {cap.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
