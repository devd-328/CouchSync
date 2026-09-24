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
  title: 'About | CouchSync Live',
  description: 'The story behind CouchSync: bringing friends and long-distance loved ones together for cozy movie nights without accounts, ads, or fees.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-[#EA580C] via-[#F97316] to-[#FB923C] p-2 sm:p-4 lg:p-6 flex flex-col justify-between overflow-x-hidden selection:bg-[#EA580C] selection:text-white">
      <div className="w-full max-w-[1580px] mx-auto bg-[#FAF8F5] rounded-[32px] sm:rounded-[44px] shadow-[0_25px_70px_rgba(0,0,0,0.22)] border border-white/60 p-4 sm:p-6 lg:p-8 flex flex-col justify-between min-h-[calc(100vh-2rem)]">
        {/* ── Top Header / Nav ─────────────────────────────────────────── */}
        <SiteHeader currentPage="about" badgeText="About" />

        {/* ── Main Content ──────────────────────────────────────────────── */}
        <main className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
          {/* Hero title */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 border border-orange-200 text-xs text-[#EA580C] font-bold shadow-2xs mb-4">
              <Heart className="w-3.5 h-3.5 text-[#FF5722] animate-pulse fill-[#FF5722]/30" />
              <span>Our Story &amp; Philosophy</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-gray-950 tracking-tight leading-tight">
              Why CouchSync Live Exists
            </h1>
            <p className="mt-4 text-sm sm:text-base text-gray-600 leading-relaxed">
              A real-time cinema lounge built so friends, partners, and movie lovers can watch together across any distance, without servers, accounts, or friction.
            </p>
          </div>

          {/* ── 3 Core Story Sections ────────────────────────────────────── */}
          <div className="space-y-8">
            {/* Section 1: The Spark */}
            <article className="bg-white card-hover rounded-3xl p-6 sm:p-8 border border-black/8 shadow-2xs hover:shadow-md hover:border-orange-300 transition relative overflow-hidden">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-2xl bg-orange-100 border border-orange-200 text-[#EA580C]">
                  <Film className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#EA580C]">The Problem</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-950">
                    Watching Together Across Distance
                  </h2>
                </div>
              </div>
              <div className="space-y-3 text-xs sm:text-sm text-gray-600 leading-relaxed">
                <p>
                  We all know the frustration of long-distance watch parties: counting down <em className="text-gray-950 font-semibold">“3, 2, 1, press play!”</em> on a phone call, only to discover one person is three seconds ahead and reacting to spoilers before they happen.
                </p>
                <p>
                  Cinema is an inherently social art form. It’s meant to be experienced with gasps, quiet laughs, popcorn debates, and shared moments. CouchSync Live was created to eliminate the distance barrier with instant, real-time playback sync, making your living rooms feel right next door to each other.
                </p>
              </div>
            </article>

            {/* Section 2: Zero Server Cost & P2P Philosophy */}
            <article className="bg-white card-hover rounded-3xl p-6 sm:p-8 border border-black/8 shadow-2xs hover:shadow-md hover:border-orange-300 transition relative overflow-hidden">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-2xl bg-emerald-100 border border-emerald-200 text-emerald-800">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">The Design</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-950">
                    Direct Device-to-Device: 100% Private &amp; Free Forever
                  </h2>
                </div>
              </div>
              <div className="space-y-3 text-xs sm:text-sm text-gray-600 leading-relaxed">
                <p>
                  Traditional streaming platforms incur massive server bills by routing heavy video files through corporate clouds. Those high infrastructure costs inevitably force apps to charge monthly subscriptions, sell user data, or eventually shut down.
                </p>
                <p>
                  CouchSync Live takes a simpler, privacy-first approach: <strong>Direct Connection by design</strong>. Video, voice, and sync signals pass directly between your browser and your friends with full encryption. Because no heavy media is routed through or stored on external servers, CouchSync Live remains completely free, lightning-fast, and private forever.
                </p>
              </div>
            </article>

            {/* Section 3: The Cinema Aesthetic */}
            <article className="bg-white card-hover rounded-3xl p-6 sm:p-8 border border-black/8 shadow-2xs hover:shadow-md hover:border-orange-300 transition relative overflow-hidden">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-2xl bg-orange-100 border border-orange-200 text-[#EA580C]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#EA580C]">The Atmosphere</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-950">
                    Why The &quot;Cinema Lounge&quot; Aesthetic?
                  </h2>
                </div>
              </div>
              <div className="space-y-3 text-xs sm:text-sm text-gray-600 leading-relaxed">
                <p>
                  Most video call tools feel like boring Monday morning office meetings: bright white backgrounds, sterile borders, and loud notification pings that ruin the mood of a film.
                </p>
                <p>
                  We designed CouchSync Live as an homage to the neon-lit midnight movie theater experience: obsidian glass panels, soft ambient lighting that complements the film, and smart sound controls that automatically soften movie dialogue whenever a friend speaks so nobody has to shout.
                </p>
              </div>
            </article>
          </div>

          {/* ── Callout: Privacy & No Signups ─────────────────────────────── */}
          <section className="mt-12 p-6 rounded-3xl bg-linear-to-r from-orange-50/80 via-white to-amber-50/80 border border-orange-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 border border-orange-200 flex items-center justify-center text-[#EA580C] shrink-0">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-gray-950">No accounts, no trackers, no email spam</h3>
                <p className="text-xs text-gray-500">Start a room in 5 seconds. When the party ends, your session vanishes.</p>
              </div>
            </div>
            <Link
              href="/"
              className="shrink-0 px-5 py-2.5 rounded-2xl bg-linear-to-r from-[#FF5722] to-[#FF7043] hover:from-[#F4511E] hover:to-[#FF5722] text-white font-bold text-xs shadow-[0_4px_16px_rgba(255,87,34,0.3)] transition cursor-pointer"
            >
              Launch Cinema Room →
            </Link>
          </section>
        </main>

        {/* ── Footer ────────────────────────────────────────────────────── */}
        <SiteFooter />
      </div>
    </div>
  );
}
