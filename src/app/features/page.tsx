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
  title: 'Features — CouchSync Live Cinema Lounge',
  description: 'Explore CouchSync Live features: sub-second playback sync, P2P video & voice with smart ducking, native screen sharing, movie trivia, and ambient cinema themes.',
};

export default function FeaturesPage() {
  return (
    <div className="relative min-h-screen bg-linear-to-b from-[#07090E] via-[#0B0F1A] to-[#07090E] text-gray-100 overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Ambient background glow effects */}
      <div className="absolute top-0 left-1/4 w-150 h-150 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-150 h-150 bg-violet-600/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/5 w-140 h-140 bg-emerald-500/8 rounded-full blur-[150px] pointer-events-none" />

      {/* ── Top Header / Nav ─────────────────────────────────────────── */}
      <SiteHeader currentPage="features" badgeText="Features" />

      {/* ── Hero Section ──────────────────────────────────────────────── */}
      <main className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/4 border border-white/10 text-xs text-cyan-300 backdrop-blur-md shadow-inner mb-4">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Platform Capabilities &amp; Architecture</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Engineered for Cinema Together
          </h1>
          <p className="mt-4 text-sm sm:text-base text-gray-300 leading-relaxed">
            Everything you need for perfect movie nights with friends. Instant playback sync, direct private video calls, smart volume controls, and beautiful cinema lounge themes.
          </p>
        </div>

        {/* ── Quick Anchor Jump Bar ─────────────────────────────────────── */}
        <div className="mb-14 p-2 rounded-2xl glass-panel border-white/10 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          {[
            { label: 'Instant Sync', href: '#sync', color: 'text-cyan-300 hover:bg-cyan-500/10' },
            { label: 'Direct Video & Voice', href: '#p2p-call', color: 'text-emerald-300 hover:bg-emerald-500/10' },
            { label: 'Screen Sharing', href: '#screenshare', color: 'text-violet-300 hover:bg-violet-500/10' },
            { label: 'Trivia & Polls', href: '#trivia-polls', color: 'text-amber-300 hover:bg-amber-500/10' },
            { label: 'Chat & Reactions', href: '#chat-reactions', color: 'text-rose-300 hover:bg-rose-500/10' },
            { label: 'Cinema Themes', href: '#cinema-themes', color: 'text-cyan-300 hover:bg-cyan-500/10' },
          ].map((anchor, idx) => (
            <a
              key={idx}
              href={anchor.href}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border border-transparent hover:border-white/10 ${anchor.color}`}
            >
              {anchor.label}
            </a>
          ))}
        </div>

        {/* ── Detailed Feature Sections ─────────────────────────────────── */}
        <div className="space-y-12 sm:space-y-16">

          {/* Feature 1: Sub-Second Sync */}
          <section id="sync" className="scroll-mt-24">
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border-cyan-500/20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-xs font-bold text-cyan-300">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Instant Playback Sync</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Instant Playback Sync
                </h2>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  CouchSync Live keeps your play, pause, rewind, and speed controls in sync across all viewers with zero noticeable delay. Smart adjustments ensure you stay aligned without annoying skips or stutters. If a friend’s connection buffers, playback automatically pauses cleanly for everyone so no one gets left behind.
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                  {[
                    'Automatic smooth catch-up',
                    'Pauses together if a friend buffers',
                    'Synced video speed across all viewers',
                    'Smooth, glitch-free controls',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-gray-400">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Supporting Visual: Timeline Sync Illustration */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="w-full max-w-sm rounded-2xl bg-black/40 border border-cyan-400/20 p-5 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-cyan-400 font-bold">PERFECT SYNC</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-bold text-[10px]">
                      IN REAL TIME
                    </span>
                  </div>

                  {/* Dual Timeline Bars */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-[11px] text-gray-400 mb-1">
                        <span>Host (You)</span>
                        <span className="font-mono text-white">01:42:15</span>
                      </div>
                      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden relative">
                        <div className="h-full bg-cyan-400 rounded-full w-2/3" />
                        <div className="absolute top-0 bottom-0 left-2/3 w-1 bg-white shadow-[0_0_8px_#00F2FE]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] text-gray-400 mb-1">
                        <span>Partner (Friend)</span>
                        <span className="font-mono text-white">01:42:15</span>
                      </div>
                      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden relative">
                        <div className="h-full bg-blue-500 rounded-full w-2/3" />
                        <div className="absolute top-0 bottom-0 left-2/3 w-1 bg-white shadow-[0_0_8px_#3B82F6]" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400">
                    <span className="flex items-center gap-1 text-cyan-300">
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
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border-emerald-500/20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Supporting Visual: Video Call & Smart Ducking */}
              <div className="order-2 lg:order-1 lg:col-span-5 flex justify-center">
                <div className="w-full max-w-sm rounded-2xl bg-black/40 border border-emerald-400/20 p-5 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="font-bold text-white">Voice Active</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-[10px] font-bold">
                      AUTO-SOFTEN 65%
                    </span>
                  </div>

                  {/* Dual video preview tiles */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="rounded-xl bg-white/5 border border-white/10 p-3 flex flex-col items-center justify-center text-center">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 mb-2">
                        <Camera className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-bold text-white">You</span>
                      <span className="text-[10px] text-gray-400">Mic On · HD</span>
                    </div>

                    <div className="rounded-xl bg-emerald-500/10 border border-emerald-400/40 p-3 flex flex-col items-center justify-center text-center relative overflow-hidden">
                      <div className="w-10 h-10 rounded-full bg-emerald-400/30 border border-emerald-400 flex items-center justify-center text-emerald-200 mb-2 speaking-border">
                        <Volume2 className="w-4 h-4 animate-pulse" />
                      </div>
                      <span className="text-[11px] font-bold text-emerald-300">Partner</span>
                      <span className="text-[10px] text-emerald-400 font-semibold">Speaking...</span>
                    </div>
                  </div>

                  {/* Audio meter bars */}
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] text-gray-400">Voice Level Meter:</span>
                    <div className="flex items-center gap-1">
                      {[4, 8, 14, 18, 12, 6, 15, 10, 5].map((val, idx) => (
                        <div
                          key={idx}
                          className="w-1 bg-emerald-400 rounded-full"
                          style={{ height: `${val}px` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="order-1 lg:order-2 lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-xs font-bold text-emerald-300">
                  <Camera className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Private Direct Calling</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Direct Video &amp; Smart Voice Auto-Quiet
                </h2>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  Enjoy crystal-clear video and voice directly between you and your friends with full privacy. Our smart sound feature detects when someone speaks and gently softens the movie audio so you never have to shout over loud explosions or action scenes.
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                  {[
                    '100% private, end-to-end encrypted',
                    'Auto-lowers movie sound when speaking',
                    'Built-in echo and noise reduction',
                    'Independent movie & voice volume sliders',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-gray-400">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Feature 3: Screen Sharing */}
          <section id="screenshare" className="scroll-mt-24">
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border-violet-500/20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-violet-500/15 border border-violet-400/30 text-xs font-bold text-violet-300">
                  <MonitorUp className="w-3.5 h-3.5 text-violet-400" />
                  <span>Smooth High Quality</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Smooth Screen Sharing
                </h2>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  Share your entire screen, a single app window, or a browser tab in high definition. Whether you want to watch movies from your personal drive, look through vacation photos, or co-stream games, CouchSync Live streams directly to your friends with zero time limits or watermarks.
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                  {[
                    'Smooth high frame rate sharing',
                    'One-click window, tab, or screen picker',
                    'No compression artifacts or delays',
                    'Includes computer audio sharing',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-gray-400">
                      <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Supporting Visual: Screen share frame */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="w-full max-w-sm rounded-2xl bg-black/40 border border-violet-400/20 p-5 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Tv className="w-3.5 h-3.5 text-violet-400" /> Display Capture
                    </span>
                    <span className="px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-400/30 text-[10px] font-bold">
                      1080P @ 60FPS
                    </span>
                  </div>

                  {/* Monitor mockup */}
                  <div className="rounded-xl bg-linear-to-tr from-violet-950/40 to-black/60 border border-violet-400/30 p-4 aspect-video flex flex-col justify-between relative overflow-hidden">
                    <div className="flex items-center justify-between text-[10px] text-gray-400">
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" /> LIVE STREAM
                      </span>
                      <span>Audio Captured</span>
                    </div>

                    <div className="flex flex-col items-center justify-center text-center my-auto">
                      <MonitorUp className="w-8 h-8 text-violet-400 mb-1 animate-pulse" />
                      <span className="text-xs font-bold text-white">Browser Tab / App Window</span>
                      <span className="text-[10px] text-gray-400">Direct peer feed</span>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-gray-500 border-t border-white/5 pt-1.5">
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
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border-amber-500/20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Supporting Visual: Trivia Quiz Card */}
              <div className="order-2 lg:order-1 lg:col-span-5 flex justify-center">
                <div className="w-full max-w-sm rounded-2xl bg-black/40 border border-amber-400/20 p-5 shadow-2xl space-y-3.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-300 flex items-center gap-1.5">
                      <Gamepad2 className="w-4 h-4" /> Trivia Round 1/5
                    </span>
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[10px] font-mono font-bold">
                      12s left
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-white">
                    Which movie won the Academy Award for Best Picture in 2020?
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="p-2 rounded-lg bg-emerald-500/15 border border-emerald-400/40 text-emerald-200 font-medium flex items-center justify-between">
                      <span>✓ Parasite</span>
                      <span className="text-[10px] font-bold">100 pts</span>
                    </div>
                    <div className="p-2 rounded-lg bg-white/3 border border-white/5 text-gray-400">
                      1917
                    </div>
                    <div className="p-2 rounded-lg bg-white/3 border border-white/5 text-gray-400">
                      Once Upon a Time in Hollywood
                    </div>
                  </div>
                </div>
              </div>

              <div className="order-1 lg:order-2 lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-xs font-bold text-amber-300">
                  <Gamepad2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Interactive Mini-Games</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Movie Trivia &amp; In-Stream Polls
                </h2>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  Keep energy high during intermissions or before film start times. Host multi-round cinema trivia competitions with synchronized countdown timers and real-time leaderboards. Resolve movie debates instantly by launching in-stream polls with live voting tallies.
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                  {[
                    'Synchronized countdown clocks',
                    'Curated cinephile question banks',
                    'Instant live voting results',
                    'Real-time point tracking',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-gray-400">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Feature 5: Live Chat & Reactions */}
          <section id="chat-reactions" className="scroll-mt-24">
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border-rose-500/20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-rose-500/15 border border-rose-400/30 text-xs font-bold text-rose-300">
                  <MessageSquare className="w-3.5 h-3.5 text-rose-400" />
                  <span>Social Interaction</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Live Chat &amp; Floating Reactions
                </h2>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  Engage with your room without breaking cinematic immersion. Send timestamped chat messages that allow anyone to jump directly to key scene moments with a single click. Trigger animated emoji bursts (🍿, ❤️, 😂, 😱, 🔥, 👏) that gracefully float up over the cinema canvas.
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                  {[
                    'Clickable timestamp jump links',
                    'Floating emoji reaction bursts',
                    'Collapsible sidebar layout',
                    'Zero database storage footprint',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-gray-400">
                      <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Supporting Visual: Chat & Reaction Floating Mockup */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="w-full max-w-sm rounded-2xl bg-black/40 border border-rose-400/20 p-5 shadow-2xl space-y-4 relative overflow-hidden">
                  {/* Floating emojis mockup */}
                  <div className="absolute right-6 top-8 flex flex-col gap-3 pointer-events-none">
                    <span className="text-2xl animate-bounce">🍿</span>
                    <span className="text-2xl animate-pulse delay-100">🔥</span>
                    <span className="text-2xl">❤️</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-rose-400" /> Live Cinema Chat
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">Synced</span>
                  </div>

                  {/* Sample chat bubble */}
                  <div className="space-y-2.5">
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-cyan-300">Alex</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono cursor-pointer hover:underline">
                          ⏱ 01:14:20
                        </span>
                      </div>
                      <p className="text-gray-300 text-[11px]">That plot twist was insane! Did you see that coming?</p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-violet-300">Maya</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 font-mono cursor-pointer hover:underline">
                          ⏱ 01:14:32
                        </span>
                      </div>
                      <p className="text-gray-300 text-[11px]">Rewind 10 seconds! 🍿</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Feature 6: Cinema Themes */}
          <section id="cinema-themes" className="scroll-mt-24">
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border-cyan-500/20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Supporting Visual: 4 Theme Cards */}
              <div className="order-2 lg:order-1 lg:col-span-5 flex justify-center">
                <div className="w-full max-w-sm rounded-2xl bg-black/40 border border-white/10 p-5 shadow-2xl space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-cyan-400" /> Cinema Palettes
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">Live Toggle</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-3 rounded-xl bg-[#0B0D14] border border-cyan-400/40 flex flex-col gap-1">
                      <span className="text-xs font-bold text-cyan-300">Obsidian</span>
                      <span className="text-[10px] text-gray-400">Deep cinema blue</span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#13112E] border border-violet-400/40 flex flex-col gap-1">
                      <span className="text-xs font-bold text-violet-300">Cyberpunk</span>
                      <span className="text-[10px] text-gray-400">Neon magenta</span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#241410] border border-amber-400/40 flex flex-col gap-1">
                      <span className="text-xs font-bold text-amber-300">Retro</span>
                      <span className="text-[10px] text-gray-400">Warm film grain</span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#000000] border border-white/20 flex flex-col gap-1">
                      <span className="text-xs font-bold text-gray-200">OLED</span>
                      <span className="text-[10px] text-gray-400">True pitch black</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="order-1 lg:order-2 lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-xs font-bold text-cyan-300">
                  <Palette className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Atmospheric Viewing</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Ambient Cinema Themes
                </h2>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  Tailor your lounge atmosphere to your environment and display technology. Switch seamlessly between Obsidian (deep space theater), Cyberpunk Neon (high-contrast synthwave), Retro Warmth (cozy 1970s projection room), and pure black OLED mode for maximum contrast and battery conservation.
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                  {[
                    'One-click instant theme change',
                    'Comfortable for nighttime movie watching',
                    'Pitch-black OLED dark mode',
                    'Soft ambient theater lighting',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-gray-400">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

        </div>

        {/* ── Bottom Call To Action (CTAs) ──────────────────────────────── */}
        <section aria-label="Start watching" className="glass-panel rounded-3xl p-8 mt-16 text-center border-white/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-r from-cyan-500/5 via-violet-500/5 to-emerald-500/5 pointer-events-none" />
          <div className="relative z-10 max-w-xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Ready to Try CouchSync Live?
            </h2>
            <p className="text-xs sm:text-sm text-gray-300">
              Host your movie night in seconds with crystal-clear private audio, instant playback sync, and zero accounts.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-linear-to-r from-cyan-400 via-blue-500 to-violet-600 hover:from-cyan-300 hover:via-blue-400 hover:to-violet-500 text-white font-bold text-sm shadow-[0_0_25px_rgba(0,242,254,0.35)] transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Create a Room</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/how-it-works"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-white/15 hover:border-cyan-400/40 text-gray-300 hover:text-white font-bold text-sm bg-white/5 hover:bg-white/10 transition flex items-center justify-center gap-2"
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
  );
}
