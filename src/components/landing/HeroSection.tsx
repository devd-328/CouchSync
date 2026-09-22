'use client';

import React from 'react';
import Image from 'next/image';
import {
  Film,
  Tv,
  MonitorUp,
  Gamepad2,
  Zap,
  Mic,
  Link2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { MediaSourceType } from '@/types/sync';

interface HeroSectionProps {
  onCreateRoom: (mode?: MediaSourceType) => void;
  onJoinRoom: () => void;
}

export function HeroSection({ onCreateRoom, onJoinRoom }: HeroSectionProps) {
  return (
    <section className="relative z-10 w-full pt-8 sm:pt-14 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8">
      {/* Top Text Block */}
      <div className="max-w-3xl mx-auto text-center">
        {/* Main Headline with inline coral waveform symbol */}
        <h1 className="text-3xl sm:text-5xl lg:text-[56px] font-extrabold text-gray-950 tracking-tight leading-[1.18] sm:leading-[1.12]">
          Watch{' '}
          <span
            className="inline-flex items-center mx-1.5 sm:mx-2.5 text-[#FF5722] tracking-tighter text-2xl sm:text-4xl lg:text-5xl select-none align-middle font-light"
            aria-hidden="true"
          >
            ııllııııllıı
          </span>{' '}
          Together
          <br />
          for Better Moments
        </h1>

        {/* Subtitle */}
        <p className="mt-4 sm:mt-5 text-sm sm:text-base text-gray-600 max-w-xl mx-auto leading-relaxed font-normal">
          The watch party platform provides synchronized media that keeps friends engaged while delivering real-time lockstep playback consistently.
        </p>

        {/* Centered Dark Pill CTA matching reference */}
        <div className="mt-6 sm:mt-8 flex items-center justify-center">
          <button
            onClick={() => onCreateRoom('hls')}
            type="button"
            className="px-8 py-3.5 rounded-full bg-[#111827] hover:bg-black text-white text-sm font-bold shadow-lg hover:shadow-xl transition transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            Get Started
          </button>
        </div>
      </div>

      {/* Hero Interactive Stage: Hand holding smartphone + 4 Floating Cards */}
      <div className="mt-12 sm:mt-16 max-w-5xl mx-auto relative min-h-[560px] sm:min-h-[620px] flex items-center justify-center">
        {/* Soft atmospheric radial glow behind center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 sm:w-[520px] sm:h-[520px] bg-orange-300/20 rounded-full blur-[100px] pointer-events-none" />

        {/* ── CARD 1 (Top-Left): Sub-Second Sync ─────────────────────────── */}
        <div
          onClick={() => onCreateRoom('hls')}
          className="card-floating hidden md:flex absolute top-6 left-0 lg:left-4 z-20 w-64 lg:w-72 p-4 rounded-2xl cursor-pointer"
        >
          <div className="w-full space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center text-[#FF5722]">
                  <Zap className="w-4 h-4 fill-current" />
                </div>
                <span className="text-xs font-bold text-gray-900">Sub-Second Sync</span>
              </div>
              <Sparkles className="w-4 h-4 text-orange-400" />
            </div>

            <p className="text-[11px] text-gray-500 leading-snug">
              Every pause, seek, and speed change matches in &lt; 20ms.
            </p>

            {/* Fake progress bar */}
            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-linear-to-r from-[#FF5722] to-amber-400 h-full w-4/5 rounded-full" />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <span className="px-2.5 py-0.5 rounded-full bg-orange-50 text-[10px] font-semibold text-[#FF5722] border border-orange-200">
                ⚡ Lockstep
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-[10px] font-medium text-gray-600">
                ↺ Auto-Pause
              </span>
            </div>
          </div>
        </div>

        {/* ── CARD 2 (Bottom-Left): Watch Party Modes ───────────────────── */}
        <div className="card-floating hidden md:flex absolute bottom-4 left-0 lg:left-2 z-20 w-64 lg:w-72 p-4 rounded-2xl flex-col">
          <div className="text-xs font-bold text-gray-950 mb-2.5">Watch Party Modes</div>
          <div className="grid grid-cols-2 gap-2">
            {[
              {
                mode: 'hls' as MediaSourceType,
                name: 'Cinema Movie',
                icon: <Film className="w-3.5 h-3.5 text-white" />,
                bg: 'bg-emerald-500',
              },
              {
                mode: 'youtube' as MediaSourceType,
                name: 'YouTube Party',
                icon: <Tv className="w-3.5 h-3.5 text-white" />,
                bg: 'bg-indigo-500',
              },
              {
                mode: 'screenshare' as MediaSourceType,
                name: 'Screen Share',
                icon: <MonitorUp className="w-3.5 h-3.5 text-white" />,
                bg: 'bg-[#FF5722]',
              },
              {
                mode: 'trivia' as MediaSourceType,
                name: 'Movie Trivia',
                icon: <Gamepad2 className="w-3.5 h-3.5 text-white" />,
                bg: 'bg-gray-900',
              },
            ].map((item) => (
              <button
                key={item.mode}
                type="button"
                onClick={() => onCreateRoom(item.mode)}
                className="flex items-center gap-2 p-2 rounded-xl bg-gray-50 hover:bg-orange-50 hover:border-orange-200 border border-transparent transition text-left cursor-pointer group"
              >
                <div
                  className={`w-6 h-6 rounded-lg ${item.bg} flex items-center justify-center shrink-0 shadow-xs`}
                >
                  {item.icon}
                </div>
                <span className="text-[11px] font-semibold text-gray-800 group-hover:text-[#FF5722] truncate">
                  {item.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ── CENTERPIECE: Hand holding Smartphone ───────────────────────── */}
        <div className="relative z-10 w-[300px] sm:w-[350px] lg:w-[380px] shrink-0 mx-auto select-none">
          <div className="relative aspect-[1/1] w-full filter drop-shadow-[0_25px_35px_rgba(0,0,0,0.12)]">
            <Image
              src="/landing/phone-in-hand-v2.png"
              alt="Hand holding smartphone with CouchSync watch party app interface"
              width={1024}
              height={1024}
              className="w-full h-auto object-contain"
              priority
            />
          </div>
        </div>

        {/* ── CARD 3 (Top-Right): Two-Tier Featured Card ────────────────── */}
        <div
          onClick={() => onCreateRoom('hls')}
          className="card-floating hidden md:flex absolute top-6 right-0 lg:right-4 z-20 w-64 lg:w-72 rounded-2xl overflow-hidden cursor-pointer flex-col"
        >
          {/* Top tier (vibrant coral gradient) */}
          <div className="p-3.5 bg-linear-to-r from-[#FF5722] via-[#FF6E40] to-[#FF8A65] text-white flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 text-white shadow-xs">
              <Film className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold truncate">Host Cinema Party</div>
              <div className="text-[10px] text-white/90 truncate">Turn links into live parties</div>
            </div>
          </div>

          {/* Bottom tier (clean white) */}
          <div className="p-3.5 bg-white flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0 text-[#FF5722]">
              <Mic className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-gray-900 truncate">P2P Voice &amp; Video</div>
              <div className="text-[10px] text-gray-500 truncate">Instant encrypted hangout</div>
            </div>
          </div>
        </div>

        {/* ── CARD 4 (Bottom-Right): Join Room with Code ────────────────── */}
        <div
          onClick={onJoinRoom}
          className="card-floating hidden md:flex absolute bottom-4 right-0 lg:right-2 z-20 w-64 lg:w-72 p-4 rounded-2xl cursor-pointer flex-col"
        >
          <div className="text-xs font-bold text-gray-950 mb-2.5">Join with Invite</div>
          <div className="p-3.5 rounded-xl border border-dashed border-orange-300 bg-orange-50/40 hover:bg-orange-50 transition text-center flex flex-col items-center justify-center gap-1">
            <div className="w-7 h-7 rounded-full bg-white shadow-xs flex items-center justify-center text-[#FF5722] mb-0.5">
              <Link2 className="w-3.5 h-3.5" />
            </div>
            <div className="text-[11px] font-bold text-gray-800">Paste link or room code</div>
            <div className="text-[10px] text-gray-500">e.g. r4ig6rd · Join instantly</div>
          </div>
        </div>
      </div>

      {/* Mobile Stacked Feature Cards (visible on phones under the image) */}
      <div className="md:hidden mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onCreateRoom('hls')}
          className="p-4 rounded-2xl bg-white border border-black/6 shadow-md flex items-center gap-3 text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-linear-to-r from-[#FF5722] to-[#FF8A65] text-white flex items-center justify-center shrink-0">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-gray-900">Host Cinema Room</div>
            <div className="text-xs text-gray-500">Create synchronized room in 1-click</div>
          </div>
        </button>

        <button
          type="button"
          onClick={onJoinRoom}
          className="p-4 rounded-2xl bg-white border border-black/6 shadow-md flex items-center gap-3 text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#FF5722] flex items-center justify-center shrink-0">
            <Link2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-gray-900">Join a Room</div>
            <div className="text-xs text-gray-500">Paste code or friend&apos;s invite link</div>
          </div>
        </button>
      </div>
    </section>
  );
}
