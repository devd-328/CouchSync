import React from 'react';
import Image from 'next/image';
import { Users, CheckCircle2 } from 'lucide-react';

export function SocialShowcase() {
  return (
    <section className="relative z-10 w-full max-w-6xl mx-auto py-12 sm:py-20 px-4 sm:px-6 lg:px-8 border-t border-black/6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Media column on Left for alternating flow */}
        <div className="lg:col-span-5 order-2 lg:order-1">
          <div className="rounded-3xl sm:rounded-[36px] bg-white border border-black/8 p-3 sm:p-4 shadow-[0_20px_50px_-15px_rgba(234,88,12,0.12),0_10px_30px_rgba(0,0,0,0.06)] overflow-hidden relative group">
            {/* Header bar */}
            <div className="px-4 py-2.5 mb-3 bg-[#FAF8F5] border border-black/5 rounded-2xl flex items-center justify-between text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF5722] animate-pulse" />
                <span className="font-mono text-[11px] text-gray-700 font-semibold">Room Social Lounge &amp; Chat</span>
              </div>
              <div className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-bold">
                P2P Encrypted
              </div>
            </div>

            {/* Real chat/social crop with smooth rounded corners */}
            <div className="relative aspect-[9/11] w-full bg-[#FAF8F5] rounded-2xl sm:rounded-[28px] overflow-hidden border border-black/6 shadow-inner">
              <Image
                src="/landing/chat-crop.png"
                alt="CouchSync social lounge with live chat, voice status, and real-time reactions"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover rounded-2xl sm:rounded-[28px]"
              />
            </div>
          </div>
        </div>

        {/* Text column on Right */}
        <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100/80 border border-orange-200 text-xs text-[#E64A19] font-semibold">
            <Users className="w-3.5 h-3.5 text-[#FF5722]" />
            <span>Social Presence &amp; Chat</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-950 tracking-tight leading-tight">
            Hang out together like you&apos;re sharing the same couch.
          </h2>

          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Watch parties shouldn&apos;t feel solitary. CouchSync gives you crystal-clear peer-to-peer voice and video alongside synchronized movies, with zero video compression on your face cams.
          </p>

          <div className="space-y-3.5 pt-2">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-orange-100 flex items-center justify-center shrink-0 mt-0.5 text-[#FF5722]">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Direct Peer-to-Peer Voice &amp; Video</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  End-to-end encrypted WebRTC audio and video connections directly between friends. No feeds are recorded or routed through middle servers.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-orange-100 flex items-center justify-center shrink-0 mt-0.5 text-[#FF5722]">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Smart Audio Ducking</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  When a friend speaks, movie volume gently ducks so you hear their reaction clearly without pausing or yelling over the dialogue.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-orange-100 flex items-center justify-center shrink-0 mt-0.5 text-[#FF5722]">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Live Floating Reactions &amp; Chat</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Send animated emoji bursts that float up the screen and chat in a focused sidebar that never covers the video action.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
