import React from 'react';
import Image from 'next/image';
import { Zap, CheckCircle2 } from 'lucide-react';

export function ProductShowcase() {
  return (
    <section id="features" className="relative z-10 w-full max-w-6xl mx-auto py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Text column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100/80 border border-orange-200 text-xs text-[#E64A19] font-semibold">
            <Zap className="w-3.5 h-3.5 text-[#FF5722]" />
            <span>Synchronized Watching</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-950 tracking-tight leading-tight">
            Sub-second playback sync with zero drift.
          </h2>

          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Every pause, seek, play, and speed change is synchronized across all viewers in real time. CouchSync keeps every frame lockstepped so you react to moments together.
          </p>

          <div className="space-y-3.5 pt-2">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-orange-100 flex items-center justify-center shrink-0 mt-0.5 text-[#FF5722]">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Smart Auto-Pause Buffer Guard</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  If a friend experiences bandwidth lag, playback pauses cleanly for the group until everyone catches up.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-orange-100 flex items-center justify-center shrink-0 mt-0.5 text-[#FF5722]">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Instant Seeking &amp; Speed Matching</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Skip intros, jump to timestamps, or speed up watch parties without anyone falling out of phase.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-orange-100 flex items-center justify-center shrink-0 mt-0.5 text-[#FF5722]">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Full Subtitle &amp; Audio Support</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Stream with embedded or custom subtitle tracks (.vtt, .srt) with independent sizing per viewer.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Media column */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl sm:rounded-[36px] bg-white border border-black/8 p-3 sm:p-4 shadow-[0_20px_50px_-15px_rgba(234,88,12,0.12),0_10px_30px_rgba(0,0,0,0.06)] overflow-hidden relative group">
            {/* Header bar */}
            <div className="px-4 py-2.5 mb-3 bg-[#FAF8F5] border border-black/5 rounded-2xl flex items-center justify-between text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF5722] animate-pulse" />
                <span className="font-mono text-[11px] text-gray-700 font-semibold">Live Cinema Player · 1080p 60fps</span>
              </div>
              <div className="text-[11px] font-mono text-[#E64A19] bg-orange-100/80 px-2.5 py-0.5 rounded-full border border-orange-200 font-bold">
                Δt &lt; 20ms
              </div>
            </div>

            {/* Real player crop with smooth rounded corners */}
            <div className="relative aspect-[16/10] w-full bg-[#0B0D14] rounded-2xl sm:rounded-[28px] overflow-hidden border border-black/6 shadow-inner">
              <Image
                src="/landing/player-crop.png"
                alt="CouchSync synchronized video player interface"
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover rounded-2xl sm:rounded-[28px]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
