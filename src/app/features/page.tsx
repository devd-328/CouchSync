import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Zap,
  Camera,
  MonitorUp,
  Gamepad2,
  MessageSquare,
  Palette,
  ShieldCheck,
  Lock,
  ArrowRight,
  Play,
  Sparkles,
  Volume2,
  Tv,
  CheckCircle2,
} from 'lucide-react';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';

export const metadata: Metadata = {
  title: 'Features | CouchSync Live',
  description: 'Explore CouchSync features: perfect video sync, local movie file player, YouTube watch parties, screen share, video & voice calls, and movie trivia.',
};

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-[#EA580C] via-[#F97316] to-[#FB923C] p-2 sm:p-4 lg:p-6 flex flex-col justify-between overflow-x-hidden selection:bg-[#EA580C] selection:text-white">
      <div className="w-full max-w-[1580px] mx-auto bg-[#FAF8F5] rounded-[32px] sm:rounded-[44px] shadow-[0_25px_70px_rgba(0,0,0,0.22)] border border-white/60 p-4 sm:p-6 lg:p-8 flex flex-col justify-between min-h-[calc(100vh-2rem)]">
        {/* ── Top Header / Nav ─────────────────────────────────────────── */}
        <SiteHeader currentPage="features" badgeText="Features" />

        {/* ── Hero Section ──────────────────────────────────────────────── */}
        <main className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 border border-orange-200 text-xs text-[#EA580C] font-bold shadow-2xs mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#FF5722] animate-pulse" />
              <span>Platform Capabilities &amp; Architecture</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-gray-950 tracking-tight leading-tight">
              Engineered for Cinema Together
            </h1>
            <p className="mt-4 text-sm sm:text-base text-gray-600 leading-relaxed">
              Everything you need for perfect movie nights with friends. Instant playback sync, direct private video calls, smart volume controls, and beautiful cinema lounge themes.
            </p>
          </div>

          {/* ── Quick Anchor Jump Bar ─────────────────────────────────────── */}
          <div className="mb-14 p-2 rounded-2xl bg-white border border-black/8 shadow-2xs flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            {[
              { label: 'Instant Sync', href: '#sync' },
              { label: 'Direct Video & Voice', href: '#p2p-call' },
              { label: 'Screen Sharing', href: '#screenshare' },
              { label: 'Trivia & Polls', href: '#trivia-polls' },
              { label: 'Chat & Reactions', href: '#chat-reactions' },
              { label: 'Cinema Themes', href: '#cinema-themes' },
            ].map((anchor, idx) => (
              <a
                key={idx}
                href={anchor.href}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold transition text-gray-700 hover:text-[#EA580C] hover:bg-orange-50 border border-transparent hover:border-orange-200/60"
              >
                {anchor.label}
              </a>
            ))}
          </div>

          {/* ── Detailed Feature Sections ─────────────────────────────────── */}
          <div className="space-y-12 sm:space-y-16">

            {/* Feature 1: Instant Playback Sync */}
            <section id="sync" className="scroll-mt-24">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/8 shadow-2xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-orange-100 border border-orange-200 text-xs font-bold text-[#EA580C]">
                    <Zap className="w-3.5 h-3.5 text-[#FF5722]" />
                    <span>Instant Playback Sync</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">
                    Instant Playback Sync
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    CouchSync Live keeps your play, pause, rewind, and speed controls in sync across all viewers with zero noticeable delay. Smart adjustments ensure you stay aligned without annoying skips or stutters. If a friend’s connection buffers, playback automatically pauses cleanly for everyone so no one gets left behind.
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                    {[
                      'Automatic smooth catch-up',
                      'Pauses together if a friend buffers',
                      'Synced video speed across all viewers',
                      'Smooth, glitch-free controls',
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-gray-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Supporting Visual: Timeline Sync Illustration */}
                <div className="lg:col-span-5 flex justify-center">
                  <div className="w-full max-w-sm rounded-2xl bg-orange-50/60 border border-orange-200/80 p-5 shadow-xs space-y-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-[#EA580C] font-bold">PERFECT SYNC</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-[10px]">
                        IN REAL TIME
                      </span>
                    </div>

                    {/* Dual Timeline Bars */}
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-[11px] text-gray-600 mb-1 font-semibold">
                          <span>Host (You)</span>
                          <span className="font-mono text-gray-900 font-bold">01:42:15</span>
                        </div>
                        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden relative">
                          <div className="h-full bg-linear-to-r from-[#FF5722] to-[#FF7043] rounded-full w-2/3" />
                          <div className="absolute top-0 bottom-0 left-2/3 w-1 bg-white shadow-xs" />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] text-gray-600 mb-1 font-semibold">
                          <span>Partner (Friend)</span>
                          <span className="font-mono text-gray-900 font-bold">01:42:15</span>
                        </div>
                        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden relative">
                          <div className="h-full bg-linear-to-r from-[#FF5722] to-[#FF7043] rounded-full w-2/3" />
                          <div className="absolute top-0 bottom-0 left-2/3 w-1 bg-white shadow-xs" />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-orange-200/50 flex items-center justify-between text-[11px] text-gray-600 font-medium">
                      <span className="flex items-center gap-1 text-[#EA580C] font-bold">
                        <Zap className="w-3 h-3" /> Real-Time Sync Loop
                      </span>
                      <span>Echo &amp; Stutter Free</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Feature 2: P2P Video & Voice */}
            <section id="p2p-call" className="scroll-mt-24">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/8 shadow-2xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Supporting Visual: Video Call & Smart Ducking */}
                <div className="order-2 lg:order-1 lg:col-span-5 flex justify-center">
                  <div className="w-full max-w-sm rounded-2xl bg-orange-50/60 border border-orange-200/80 p-5 shadow-xs space-y-4">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="font-bold text-gray-900">Voice Active</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-orange-100 text-[#EA580C] border border-orange-200 text-[10px] font-bold">
                        AUTO-SOFTEN 65%
                      </span>
                    </div>

                    {/* Dual video preview tiles */}
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="rounded-xl bg-white border border-black/8 p-3 flex flex-col items-center justify-center text-center shadow-2xs">
                        <div className="w-10 h-10 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center text-[#EA580C] mb-2">
                          <Camera className="w-4 h-4" />
                        </div>
                        <span className="text-[11px] font-bold text-gray-900">You</span>
                        <span className="text-[10px] text-gray-500 font-medium">Mic On · HD</span>
                      </div>

                      <div className="rounded-xl bg-orange-100/60 border border-orange-300 p-3 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-2xs">
                        <div className="w-10 h-10 rounded-full bg-orange-200 border-2 border-[#FF5722] flex items-center justify-center text-[#EA580C] mb-2">
                          <Volume2 className="w-4 h-4 animate-pulse" />
                        </div>
                        <span className="text-[11px] font-bold text-[#EA580C]">Partner</span>
                        <span className="text-[10px] text-[#EA580C] font-semibold">Speaking...</span>
                      </div>
                    </div>

                    {/* Audio meter bars */}
                    <div className="pt-2 border-t border-orange-200/50 flex items-center justify-between">
                      <span className="text-[10px] text-gray-600 font-medium">Voice Level Meter:</span>
                      <div className="flex items-center gap-1">
                        {[4, 8, 14, 18, 12, 6, 15, 10, 5].map((val, idx) => (
                          <div
                            key={idx}
                            className="w-1 bg-[#FF5722] rounded-full"
                            style={{ height: `${val}px` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="order-1 lg:order-2 lg:col-span-7 space-y-4">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-orange-100 border border-orange-200 text-xs font-bold text-[#EA580C]">
                    <Camera className="w-3.5 h-3.5 text-[#FF5722]" />
                    <span>Private Direct Calling</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">
                    Direct Video &amp; Smart Voice Auto-Quiet
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Enjoy crystal-clear video and voice directly between you and your friends with full privacy. Our smart sound feature detects when someone speaks and gently softens the movie audio so you never have to shout over loud explosions or action scenes.
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                    {[
                      '100% private, end-to-end encrypted',
                      'Auto-lowers movie sound when speaking',
                      'Built-in echo and noise reduction',
                      'Independent movie & voice volume sliders',
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-gray-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Feature 3: Screen Sharing */}
            <section id="screenshare" className="scroll-mt-24">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/8 shadow-2xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-orange-100 border border-orange-200 text-xs font-bold text-[#EA580C]">
                    <MonitorUp className="w-3.5 h-3.5 text-[#FF5722]" />
                    <span>Smooth High Quality</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">
                    Smooth Screen Sharing
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Share your entire screen, a single app window, or a browser tab in high definition. Whether you want to watch movies from your personal drive, look through vacation photos, or co-stream games, CouchSync Live streams directly to your friends with zero time limits or watermarks.
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                    {[
                      'Smooth high frame rate sharing',
                      'One-click window, tab, or screen picker',
                      'High-clarity stream with low latency',
                      'Includes computer audio sharing',
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-gray-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Supporting Visual: Screen share frame */}
                <div className="lg:col-span-5 flex justify-center">
                  <div className="w-full max-w-sm rounded-2xl bg-orange-50/60 border border-orange-200/80 p-5 shadow-xs space-y-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-gray-900 flex items-center gap-1.5">
                        <Tv className="w-3.5 h-3.5 text-[#FF5722]" /> Display Capture
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-orange-100 text-[#EA580C] border border-orange-200 text-[10px] font-bold">
                        HD SCREEN SHARE
                      </span>
                    </div>

                    {/* Monitor mockup */}
                    <div className="rounded-xl bg-gray-900 border border-black/10 p-4 aspect-video flex flex-col justify-between relative overflow-hidden shadow-inner text-white">
                      <div className="flex items-center justify-between text-[10px] text-gray-400">
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" /> LIVE STREAM
                        </span>
                        <span>Audio Captured</span>
                      </div>

                      <div className="flex flex-col items-center justify-center text-center my-auto">
                        <MonitorUp className="w-8 h-8 text-orange-400 mb-1 animate-pulse" />
                        <span className="text-xs font-bold text-white">Browser Tab / App Window</span>
                        <span className="text-[10px] text-gray-400">Direct peer feed</span>
                      </div>

                      <div className="flex justify-between items-center text-[10px] text-gray-400 border-t border-white/10 pt-1.5">
                        <span>Bitrate: Adaptive</span>
                        <span className="text-emerald-400 font-bold">Encrypted P2P</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Feature 4: Movie Trivia & Polls */}
            <section id="trivia-polls" className="scroll-mt-24">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/8 shadow-2xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Supporting Visual: Trivia Quiz Card */}
                <div className="order-2 lg:order-1 lg:col-span-5 flex justify-center">
                  <div className="w-full max-w-sm rounded-2xl bg-orange-50/60 border border-orange-200/80 p-5 shadow-xs space-y-3.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#EA580C] flex items-center gap-1.5">
                        <Gamepad2 className="w-4 h-4" /> Trivia Round 1/5
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-orange-100 text-[#EA580C] border border-orange-200 text-[10px] font-mono font-bold">
                        12s left
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-white border border-black/8 text-xs font-bold text-gray-900 shadow-2xs">
                      Which movie won the Academy Award for Best Picture in 2020?
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold flex items-center justify-between">
                        <span>✓ Parasite</span>
                        <span className="text-[10px] font-mono">100 pts</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-black/5 text-gray-500 font-medium">
                        1917
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-black/5 text-gray-500 font-medium">
                        Once Upon a Time in Hollywood
                      </div>
                    </div>
                  </div>
                </div>

                <div className="order-1 lg:order-2 lg:col-span-7 space-y-4">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-orange-100 border border-orange-200 text-xs font-bold text-[#EA580C]">
                    <Gamepad2 className="w-3.5 h-3.5 text-[#FF5722]" />
                    <span>Interactive Mini-Games</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">
                    Movie Trivia &amp; In-Stream Polls
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Keep energy high during intermissions or before film start times. Host multi-round cinema trivia competitions with synchronized countdown timers and real-time leaderboards. Resolve movie debates instantly by launching in-stream polls with live voting tallies.
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                    {[
                      'Synchronized countdown clocks',
                      'Curated cinephile question banks',
                      'Instant live voting results',
                      'Real-time point tracking',
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-gray-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Feature 5: Live Chat & Reactions */}
            <section id="chat-reactions" className="scroll-mt-24">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/8 shadow-2xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-orange-100 border border-orange-200 text-xs font-bold text-[#EA580C]">
                    <MessageSquare className="w-3.5 h-3.5 text-[#FF5722]" />
                    <span>Social Interaction</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">
                    Live Chat &amp; Floating Reactions
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Engage with your room without breaking cinematic immersion. Send timestamped chat messages that allow anyone to jump directly to key scene moments with a single click. Trigger animated emoji bursts (🍿, ❤️, 😂, 😱, 🔥, 👏) that gracefully float up over the cinema canvas.
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                    {[
                      'Clickable timestamp jump links',
                      'Floating emoji reaction bursts',
                      'Collapsible sidebar layout',
                      'Zero database storage footprint',
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-gray-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Supporting Visual: Chat & Reaction Floating Mockup */}
                <div className="lg:col-span-5 flex justify-center">
                  <div className="w-full max-w-sm rounded-2xl bg-orange-50/60 border border-orange-200/80 p-5 shadow-xs space-y-4 relative overflow-hidden">
                    {/* Floating emojis mockup */}
                    <div className="absolute right-6 top-8 flex flex-col gap-3 pointer-events-none">
                      <span className="text-2xl animate-bounce">🍿</span>
                      <span className="text-2xl animate-pulse delay-100">🔥</span>
                      <span className="text-2xl">❤️</span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-gray-900 flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-[#FF5722]" /> Live Cinema Chat
                      </span>
                      <span className="text-[10px] text-[#EA580C] font-mono font-bold bg-orange-100 px-2 py-0.5 rounded-full">Synced</span>
                    </div>

                    {/* Sample chat bubble */}
                    <div className="space-y-2.5">
                      <div className="p-3 rounded-2xl bg-white border border-black/8 text-xs shadow-2xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-gray-900">Alex</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-100 text-[#EA580C] font-mono font-bold cursor-pointer hover:underline">
                            ⏱ 01:14:20
                          </span>
                        </div>
                        <p className="text-gray-600 text-[11px]">That plot twist was insane! Did you see that coming?</p>
                      </div>

                      <div className="p-3 rounded-2xl bg-linear-to-r from-[#FF5722] to-[#FF7043] text-white text-xs shadow-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-white">Maya (You)</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/20 text-white font-mono font-bold cursor-pointer">
                            ⏱ 01:14:32
                          </span>
                        </div>
                        <p className="text-white text-[11px]">Rewind 10 seconds! 🍿</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Feature 6: Cinema Themes */}
            <section id="cinema-themes" className="scroll-mt-24">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/8 shadow-2xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Supporting Visual: 4 Theme Cards */}
                <div className="order-2 lg:order-1 lg:col-span-5 flex justify-center">
                  <div className="w-full max-w-sm rounded-2xl bg-orange-50/60 border border-orange-200/80 p-5 shadow-xs space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-gray-900 flex items-center gap-1.5">
                        <Palette className="w-3.5 h-3.5 text-[#FF5722]" /> Cinema Palettes
                      </span>
                      <span className="text-[10px] text-[#EA580C] font-mono font-bold bg-orange-100 px-2 py-0.5 rounded-full">Live Toggle</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-3 rounded-xl bg-gray-900 border border-black/10 flex flex-col gap-1 text-white shadow-2xs">
                        <span className="text-xs font-bold text-cyan-300">Obsidian</span>
                        <span className="text-[10px] text-gray-400">Deep cinema blue</span>
                      </div>

                      <div className="p-3 rounded-xl bg-indigo-950 border border-black/10 flex flex-col gap-1 text-white shadow-2xs">
                        <span className="text-xs font-bold text-fuchsia-300">Cyberpunk</span>
                        <span className="text-[10px] text-gray-400">Neon synthwave</span>
                      </div>

                      <div className="p-3 rounded-xl bg-amber-950 border border-black/10 flex flex-col gap-1 text-white shadow-2xs">
                        <span className="text-xs font-bold text-amber-300">Retro</span>
                        <span className="text-[10px] text-gray-400">Warm lounge</span>
                      </div>

                      <div className="p-3 rounded-xl bg-black border border-white/20 flex flex-col gap-1 text-white shadow-2xs">
                        <span className="text-xs font-bold text-gray-200">OLED</span>
                        <span className="text-[10px] text-gray-400">True pitch black</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="order-1 lg:order-2 lg:col-span-7 space-y-4">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-orange-100 border border-orange-200 text-xs font-bold text-[#EA580C]">
                    <Palette className="w-3.5 h-3.5 text-[#FF5722]" />
                    <span>Atmospheric Viewing</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">
                    Ambient Cinema Themes
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Tailor your lounge atmosphere to your environment and display technology. Switch seamlessly between Obsidian (deep space theater), Cyberpunk Neon (high-contrast synthwave), Retro Warmth (cozy 1970s projection room), and pure black OLED mode for maximum contrast and battery conservation.
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                    {[
                      'One-click instant theme change',
                      'Comfortable for nighttime movie watching',
                      'Pitch-black OLED dark mode',
                      'Soft ambient theater lighting',
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-gray-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

          </div>

          {/* ── Bottom Call To Action (CTAs) ──────────────────────────────── */}
          <section aria-label="Start watching" className="bg-linear-to-r from-orange-50 via-white to-amber-50 rounded-3xl p-8 mt-16 text-center border border-orange-200/80 relative overflow-hidden shadow-2xs">
            <div className="relative z-10 max-w-xl mx-auto space-y-4">
              <h2 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">
                Ready to Try CouchSync Live?
              </h2>
              <p className="text-xs sm:text-sm text-gray-600">
                Host your movie night in seconds with crystal-clear private audio, instant playback sync, and zero accounts.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-linear-to-r from-[#FF5722] to-[#FF7043] hover:from-[#F4511E] hover:to-[#FF5722] text-white font-bold text-sm shadow-[0_6px_20px_rgba(255,87,34,0.35)] transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Create a Room</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/how-it-works"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border border-black/10 hover:border-orange-300 text-gray-700 hover:text-gray-950 font-bold text-sm bg-white hover:bg-gray-50 transition flex items-center justify-center gap-2"
                >
                  <span>Read Full Guide</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>
        </main>

        {/* ── Footer ────────────────────────────────────────────────────── */}
        <SiteFooter />
      </div>
    </div>
  );
}
