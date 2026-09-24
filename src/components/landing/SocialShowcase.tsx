'use client';

import React from 'react';
import { Users, CheckCircle2, Mic, Volume2 } from 'lucide-react';

export function SocialShowcase() {
  return (
    <section className="relative z-10 w-full max-w-6xl mx-auto py-12 sm:py-20 px-4 sm:px-6 lg:px-8 border-t border-black/6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Media column: always order-1 on all breakpoints */}
        <div className="lg:col-span-5 order-1">
          <div className="rounded-3xl sm:rounded-[36px] bg-white border border-black/8 p-3.5 sm:p-5 shadow-[0_20px_50px_-15px_rgba(234,88,12,0.12),0_10px_30px_rgba(0,0,0,0.06)] overflow-hidden relative">
            {/* Clean header bar */}
            <div className="px-3.5 py-2.5 mb-3 bg-[#FAF8F5] border border-black/5 rounded-2xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF5722] animate-pulse" />
                <span className="font-semibold text-gray-900 text-xs sm:text-sm">Social Lounge &amp; Video</span>
              </div>
              <div className="text-[10px] sm:text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Encrypted peer-to-peer video
              </div>
            </div>

            {/* Authentic Video Call Mockup with Real Webcam Feeds (White Background) */}
            <div
              aria-hidden="true"
              className="w-full bg-white rounded-2xl sm:rounded-[28px] p-3 sm:p-4 border border-black/8 shadow-xs flex flex-col gap-3 select-none"
            >
              {/* Active Call Participant Tiles */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3 relative">
                {/* Participant 1: Sarah */}
                <div className="relative aspect-4/3 rounded-xl sm:rounded-2xl overflow-hidden ring-2 ring-emerald-500 shadow-md flex flex-col justify-between p-2 sm:p-2.5">
                  {/* Authentic webcam photo */}
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80"
                    alt="Sarah webcam feed"
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {/* Subtle top & bottom dark scrim */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/80 pointer-events-none" />

                  {/* Top Bar */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/90 backdrop-blur-md text-white text-[10px] font-bold shadow-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      Speaking
                    </span>
                    <div className="w-6 h-6 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-emerald-400 shadow-xs">
                      <Mic className="w-3 h-3" />
                    </div>
                  </div>

                  {/* Bottom Bar: Name & Live Status */}
                  <div className="relative z-10 flex items-center justify-between text-[11px] text-white font-semibold bg-black/50 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
                    <span className="truncate">Sarah</span>
                    <span className="text-emerald-400 text-[10px] font-bold shrink-0">● Live</span>
                  </div>
                </div>

                {/* Participant 2: Dev */}
                <div className="relative aspect-4/3 rounded-xl sm:rounded-2xl overflow-hidden border border-black/10 shadow-md flex flex-col justify-between p-2 sm:p-2.5">
                  {/* Authentic webcam photo */}
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80"
                    alt="Dev webcam feed"
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {/* Subtle top & bottom dark scrim */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/80 pointer-events-none" />

                  {/* Top Bar */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-md text-white/90 text-[10px] font-medium border border-white/10">
                      Connected
                    </span>
                    <div className="w-6 h-6 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white/80 shadow-xs">
                      <Mic className="w-3 h-3" />
                    </div>
                  </div>

                  {/* Bottom Bar: Name & In Room */}
                  <div className="relative z-10 flex items-center justify-between text-[11px] text-white font-semibold bg-black/50 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
                    <span className="truncate">Dev</span>
                    <span className="text-gray-300 text-[10px] shrink-0">● In room</span>
                  </div>
                </div>
              </div>

              {/* In-Room Live Chat Preview */}
              <div className="rounded-xl bg-[#FAF8F5] border border-black/6 p-2.5 sm:p-3 space-y-1.5 shadow-2xs">
                <div className="flex items-center justify-between text-[11px] pb-1.5 border-b border-black/6 font-sans">
                  <span className="font-bold text-gray-900 text-xs">Room Chat</span>
                  <span className="text-[#E64A19] font-semibold flex items-center gap-1.5 text-xs">
                    <Volume2 className="w-3.5 h-3.5 text-[#FF5722]" /> Auto-quiet active
                  </span>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-[#FF5722] text-xs">Sarah:</span>
                    <span className="text-gray-800 text-xs font-medium">That scene gave me chills!</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-indigo-600 text-xs">Dev:</span>
                    <span className="text-gray-800 text-xs font-medium">Wait for the ending 🔥</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Text column: always order-2 on all breakpoints */}
        <div className="lg:col-span-7 order-2 space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100/80 border border-orange-200 text-xs text-[#E64A19] font-semibold">
            <Users className="w-3.5 h-3.5 text-[#FF5722]" />
            <span>Social Presence &amp; Chat</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-950 tracking-tight leading-tight">
            Hang out like you&apos;re on the same couch.
          </h2>

          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Private video, voice, and chat right beside the movie.
          </p>

          <div className="space-y-3.5 pt-2">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-orange-100 flex items-center justify-center shrink-0 mt-0.5 text-[#FF5722]">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Peer-to-peer video &amp; voice</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Encrypted, straight between friends.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-orange-100 flex items-center justify-center shrink-0 mt-0.5 text-[#FF5722]">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Smart audio ducking</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Movie dips when a friend talks.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-orange-100 flex items-center justify-center shrink-0 mt-0.5 text-[#FF5722]">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Live reactions &amp; chat</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Emoji bursts that never block the screen.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

