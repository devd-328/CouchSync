import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Heart,
  ShieldCheck,
  Film,
  Sparkles,
  Lock,
} from 'lucide-react';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';

export const metadata: Metadata = {
  title: 'About — CouchSync Cinema Lounge',
  description: 'The story and philosophy behind CouchSync: watching movies across distance, zero-server-cost peer-to-peer architecture, and the Kosmi Lounge aesthetic.',
};

export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-linear-to-b from-[#07090E] via-[#0B0F1A] to-[#07090E] text-gray-100 overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Dynamic ambient glow orbs */}
      <div className="absolute top-0 left-1/3 w-150 h-150 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-150 h-150 bg-violet-600/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/5 w-120 h-120 bg-rose-500/8 rounded-full blur-[150px] pointer-events-none" />

      {/* ── Top Header / Nav ─────────────────────────────────────────── */}
      <SiteHeader currentPage="about" badgeText="About" />

      {/* ── Main Content ──────────────────────────────────────────────── */}
      <main className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
        {/* Hero title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/4 border border-white/10 text-xs text-rose-300 backdrop-blur-md shadow-inner mb-4">
            <Heart className="w-3.5 h-3.5 text-rose-400 animate-pulse fill-rose-500/30" />
            <span>Our Story &amp; Philosophy</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Why CouchSync Exists
          </h1>
          <p className="mt-4 text-sm sm:text-base text-gray-300 leading-relaxed">
            A real-time cinema lounge built so friends, partners, and movie lovers can watch together across any distance — without servers, accounts, or friction.
          </p>
        </div>

        {/* ── 3 Core Story Sections ────────────────────────────────────── */}
        <div className="space-y-8">
          {/* Section 1: The Spark */}
          <article className="glass-panel card-hover rounded-3xl p-6 sm:p-8 border-cyan-500/20 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-400">
                <Film className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">The Problem</span>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Watching Together Across Distance
                </h2>
              </div>
            </div>
            <div className="space-y-3 text-xs sm:text-sm text-gray-300 leading-relaxed">
              <p>
                We all know the frustration of long-distance watch parties: counting down <em className="text-white">“3, 2, 1, press play!”</em> on a phone call, only to discover one person is three seconds ahead and reacting to spoilers before they happen.
              </p>
              <p>
                Cinema is an inherently social art form. It’s meant to be experienced with gasps, quiet laughs, popcorn debates, and shared moments. CouchSync was created to eliminate the distance barrier with sub-second lockstep synchronization, making your living rooms feel right next door to each other.
              </p>
            </div>
          </article>

          {/* Section 2: Zero Server Cost & P2P Philosophy */}
          <article className="glass-panel card-hover rounded-3xl p-6 sm:p-8 border-emerald-500/20 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">The Architecture</span>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Zero Server Cost, 100% Peer-to-Peer
                </h2>
              </div>
            </div>
            <div className="space-y-3 text-xs sm:text-sm text-gray-300 leading-relaxed">
              <p>
                Traditional streaming platforms incur massive server bills by re-encoding and routing video through centralized clouds. Those high infrastructure costs inevitably force apps to charge monthly subscriptions, sell user data, or eventually shut down.
              </p>
              <p>
                CouchSync takes a radically different approach: <strong>Peer-to-Peer by design</strong>. Video, voice, and media sync directly between participants&apos; browsers via WebRTC (DTLS-SRTP encryption). Because no heavy video data passes through our servers, hosting costs stay near zero. This ensures CouchSync can remain completely free, lightweight, and private forever.
              </p>
            </div>
          </article>

          {/* Section 3: The Cinema Aesthetic */}
          <article className="glass-panel card-hover rounded-3xl p-6 sm:p-8 border-violet-500/20 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-violet-500/15 border border-violet-400/30 text-violet-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400">The Atmosphere</span>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Why The &quot;Kosmi Lounge&quot; Cinema Aesthetic?
                </h2>
              </div>
            </div>
            <div className="space-y-3 text-xs sm:text-sm text-gray-300 leading-relaxed">
              <p>
                Most video call tools look like corporate Monday morning meetings — bright white backgrounds, sterile gray borders, and harsh notification pings that ruin movie atmosphere.
              </p>
              <p>
                We designed CouchSync as an homage to the neon-lit midnight movie theater experience: obsidian glassmorphism, soft ambient glows that match the film, and smart audio ducking that automatically softens movie dialogue when a friend speaks so nobody has to shout.
              </p>
            </div>
          </article>
        </div>

        {/* ── Callout: Privacy & No Signups ─────────────────────────────── */}
        <section className="mt-12 p-6 rounded-3xl glass-panel border-white/10 bg-linear-to-r from-cyan-950/20 via-black/40 to-violet-950/20 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-300 shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">No accounts, no trackers, no email spam</h3>
              <p className="text-xs text-gray-400">Start a room in 5 seconds. When the party ends, your session vanishes.</p>
            </div>
          </div>
          <Link
            href="/"
            className="shrink-0 px-5 py-2.5 rounded-xl bg-linear-to-r from-cyan-400 via-blue-500 to-violet-600 hover:from-cyan-300 hover:to-blue-400 text-white font-bold text-xs shadow-[0_0_20px_rgba(0,242,254,0.3)] transition"
          >
            Launch Cinema Room →
          </Link>
        </section>
      </main>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <SiteFooter />
    </div>
  );
}
