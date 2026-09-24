'use client';

import React from 'react';
import Image from 'next/image';
import {
  Play,
} from 'lucide-react';
import { MediaSourceType } from '@/types/sync';

interface HeroSectionProps {
  onCreateRoom: (mode?: MediaSourceType) => void;
  onJoinRoom: () => void;
}

export function HeroSection({ onCreateRoom, onJoinRoom }: HeroSectionProps) {
  return (
    <section className="relative z-10 w-full pt-8 sm:pt-14 pb-10 sm:pb-16 lg:pb-20 px-4 sm:px-6 lg:px-8 overflow-x-clip">
      {/* Top Text Block */}
      <div className="max-w-3xl mx-auto text-center">
        {/* Main Headline with inline coral waveform symbol */}
        <h1 className="text-3xl sm:text-5xl lg:text-[46px] font-extrabold text-gray-950 tracking-tight leading-[1.18] sm:leading-[1.14]">
          Watch{' '}
          <span
            className="inline-flex items-center mx-1 sm:mx-2 text-[#FF5722] tracking-tighter text-2xl sm:text-4xl lg:text-[38px] select-none align-middle font-light"
            aria-hidden="true"
          >
            ııllııııllıı
          </span>{' '}
          Together.{' '}
          <br className="hidden sm:inline" />
          <span className="text-gray-900">Even When You&apos;re Apart.</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-4 sm:mt-5 text-sm sm:text-base text-gray-600 max-w-xl mx-auto leading-relaxed font-normal">
          Watch movies, YouTube, and your screen with friends in real time. No accounts, no installs, zero drift.
        </p>

        {/* Dual CTAs: Create a Room & Join a Room */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-3.5">
          <button
            onClick={() => onCreateRoom('hls')}
            type="button"
            className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#111827] hover:bg-black text-white text-sm font-bold shadow-lg hover:shadow-xl transition transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            Create a Room
          </button>
          <button
            onClick={onJoinRoom}
            type="button"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-white hover:bg-orange-50/60 text-gray-900 text-sm font-semibold border border-black/10 shadow-xs hover:border-orange-300 transition transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            Join a Room
          </button>
        </div>
      </div>

      {/* Hero Stage */}
      <div className="mt-8 sm:mt-10 max-w-6xl mx-auto relative flex items-center justify-center">
        {/* Glow + concentric rings so the floating items feel like they orbit something */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] sm:w-[500px] sm:h-[500px] lg:w-[640px] lg:h-[640px] bg-orange-300/25 rounded-full blur-[90px] sm:blur-[110px] pointer-events-none" />
        <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[440px] h-[440px] rounded-full border border-orange-300/30 pointer-events-none" />
        <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[640px] h-[640px] rounded-full border border-orange-200/30 pointer-events-none" />
        <div className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[860px] h-[860px] rounded-full border border-orange-100/40 pointer-events-none" />

        {/* ── CENTERPIECE: Phone Wrapper with Anchored Floating Elements ── */}
        <div className="relative mx-auto w-full max-w-[340px] sm:max-w-[500px] lg:max-w-[620px] select-none -my-4 sm:-my-10 lg:-my-14">
          {/* 1. Chat bubble: top-left (visible at all screen sizes) */}
          <div
            className="animate-hero-offset motion-reduce:animate-none absolute top-[10%] left-[-2%] sm:left-[-4%] lg:left-[-12%] z-20 flex items-start gap-1.5 sm:gap-2.5 px-2.5 py-1.5 sm:px-3.5 sm:py-2.5 rounded-xl sm:rounded-2xl rounded-bl-xs bg-white border border-black/5 shadow-[0_12px_24px_rgba(0,0,0,0.08)] sm:shadow-[0_16px_32px_rgba(0,0,0,0.10)] select-none opacity-95 sm:opacity-90 blur-[0.2px] sm:blur-[0.5px]"
            style={{ animationDelay: '-2s' }}
          >
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-linear-to-tr from-violet-500 to-fuchsia-400 text-white text-[9px] sm:text-[10px] font-bold flex items-center justify-center shrink-0">
              M
            </div>
            <div className="text-left">
              <div className="text-[10px] sm:text-[11px] font-semibold text-gray-900 leading-tight">Maya</div>
              <div className="text-[10px] sm:text-xs text-gray-600 leading-tight">this scene is insane 😱</div>
            </div>
          </div>

          {/* 2. Latency chip: mid-left (visible at all screen sizes) */}
          <div
            className="animate-hero-float motion-reduce:animate-none absolute top-[44%] left-[-3%] sm:left-[-5%] lg:left-[-15%] z-20 flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-[#111319] border border-white/10 text-white shadow-[0_10px_20px_rgba(0,0,0,0.2)] sm:shadow-[0_14px_28px_rgba(0,0,0,0.22)] select-none"
            style={{ animationDelay: '-4s', animationDuration: '7s' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[9px] sm:text-[11px] font-mono text-gray-200">Sync &lt;150 ms</span>
          </div>

          {/* 3. Participant joined card: top-right (visible at all screen sizes) */}
          <div className="animate-hero-offset motion-reduce:animate-none absolute top-[8%] right-[-2%] sm:right-[-4%] lg:right-[-10%] z-20 flex items-center gap-2 sm:gap-3 px-2.5 py-1.5 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl bg-[#111319] border border-white/10 text-white shadow-[0_14px_28px_rgba(0,0,0,0.22)] sm:shadow-[0_20px_40px_rgba(0,0,0,0.25)] select-none">
            <div className="relative shrink-0">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-linear-to-tr from-[#FF5722] to-amber-400 flex items-center justify-center font-bold text-[10px] sm:text-xs text-white">
                S
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-400 ring-1.5 sm:ring-2 ring-[#111319]" />
            </div>
            <div className="text-left min-w-[100px] sm:min-w-[130px]">
              <div className="text-[10px] sm:text-xs font-semibold tracking-tight text-white leading-tight">Sarah joined the room</div>
              <div className="text-[9px] sm:text-[11px] text-gray-400 flex items-center gap-1 sm:gap-1.5 mt-0.5 leading-tight">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>3 friends watching</span>
              </div>
            </div>
          </div>

          {/* 4. Reaction emojis cluster: mid-right (visible at all screen sizes) */}
          <div className="pointer-events-none select-none">
            <div className="animate-reaction-1 motion-reduce:animate-none absolute top-[28%] right-[14%] sm:right-[18%] lg:right-[22%] z-20 drop-shadow-md text-xl sm:text-2xl lg:text-3xl">😂</div>
            <div className="animate-reaction-2 motion-reduce:animate-none absolute top-[40%] right-[6%] sm:right-[10%] lg:right-[14%] z-20 drop-shadow-md text-xl sm:text-2xl lg:text-3xl">❤️</div>
            <div className="animate-reaction-3 motion-reduce:animate-none absolute top-[54%] right-[12%] sm:right-[16%] lg:right-[20%] z-20 drop-shadow-md text-lg sm:text-xl lg:text-2xl">🍿</div>
          </div>

          {/* 5. Desktop-only: In-Sync playback card (bottom-left) */}
          <div className="hidden lg:flex animate-hero-float motion-reduce:animate-none absolute bottom-[10%] left-[-10%] z-20 items-center gap-3 px-4 py-3 rounded-2xl bg-[#111319] border border-white/10 text-white shadow-[0_20px_40px_rgba(0,0,0,0.25)] select-none">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shrink-0 shadow-inner">
              <Play className="w-3.5 h-3.5 fill-current" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold tracking-tight">Everyone in sync</span>
              </div>
              <div className="text-[11px] font-mono text-gray-400 mt-0.5">01:24:38 · Live party</div>
            </div>
          </div>

          {/* 6. Desktop-only: Avatar stack (bottom-right) */}
          <div
            className="hidden lg:flex animate-hero-float motion-reduce:animate-none absolute bottom-[14%] right-[-8%] z-20 items-center gap-2.5 pl-2.5 pr-4 py-2 rounded-full bg-white border border-black/5 shadow-[0_16px_32px_rgba(0,0,0,0.10)] select-none"
            style={{ animationDelay: '-3s', animationDuration: '8s' }}
          >
            <div className="flex -space-x-2">
              {['bg-orange-400', 'bg-violet-400', 'bg-emerald-400', 'bg-sky-400'].map((c, i) => (
                <span key={i} className={`w-6 h-6 rounded-full ${c} ring-2 ring-white`} />
              ))}
            </div>
            <span className="text-xs font-semibold text-gray-800">5 watching</span>
          </div>

          {/* The Phone Image */}
          <div className="relative aspect-square w-full filter drop-shadow-[0_25px_35px_rgba(0,0,0,0.14)]">
            <Image
              src="/landing/phone-in-hand-v2.png"
              alt="Hand holding smartphone with CouchSync watch party app interface"
              width={1024}
              height={1024}
              className="w-full h-auto object-contain"
              style={{
                WebkitMaskImage: 'linear-gradient(to bottom, black 72%, transparent 96%)',
                maskImage: 'linear-gradient(to bottom, black 72%, transparent 96%)',
              }}
              priority
            />
          </div>
        </div>
      </div>

      {/* Mobile Live Activity Chips (pulled up over the faded bottom of phone) */}
      <div className="md:hidden relative z-20 -mt-8 sm:-mt-12 max-w-sm mx-auto w-full px-2 flex flex-col gap-2.5">
        <div className="w-full min-h-[44px] px-4 py-2.5 rounded-full bg-[#111319] text-white border border-white/10 shadow-md flex items-center justify-center gap-2 text-xs select-none">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold">Everyone in sync</span>
          <span className="text-gray-400 font-mono">01:24:38</span>
        </div>

        <div className="w-full min-h-[44px] px-4 py-2.5 rounded-full bg-white text-gray-900 border border-black/8 shadow-md flex items-center justify-center gap-2 text-xs select-none">
          <span className="w-5 h-5 rounded-full bg-[#FF5722] text-white font-bold text-[10px] flex items-center justify-center">S</span>
          <span className="font-semibold">Sarah joined</span>
          <span className="text-gray-500">· 3 watching</span>
        </div>
      </div>
    </section>
  );
}