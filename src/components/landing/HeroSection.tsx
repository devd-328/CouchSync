'use client';

import React from 'react';
import { MediaSourceType } from '@/types/sync';
import { WorksWheel, type WorksWheelItem } from '@/components/ui/works-wheel';
import { useRoomModals } from '@/components/landing/RoomModalsProvider';

interface HeroWheelItem extends WorksWheelItem {
  mode: MediaSourceType;
}

const HERO_WATCH_EXPERIENCES: HeroWheelItem[] = [
  {
    title: 'Interstellar Cinema',
    subtitle: '4K HLS Stream • Zero Drift',
    image: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=640&q=85',
    actionLabel: 'Launch Cinema',
    mode: 'hls',
  },
  {
    title: 'Anime Marathon',
    subtitle: 'Cyberpunk & Shonen in Sync',
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=640&q=85',
    actionLabel: 'Start Stream',
    mode: 'hls',
  },
  {
    title: 'YouTube Watch Party',
    subtitle: 'Trending Podcasts & Memes',
    image: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&w=640&q=85',
    actionLabel: 'Watch YouTube',
    mode: 'youtube',
  },
  {
    title: 'Live Sports & Arena',
    subtitle: 'Front-Row Synchronized Feeds',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=640&q=85',
    actionLabel: 'Stream Live',
    mode: 'screenshare',
  },
  {
    title: 'Screen Share Lounge',
    subtitle: 'Co-work & Stream Anything',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=640&q=85',
    actionLabel: 'Share Screen',
    mode: 'screenshare',
  },
  {
    title: 'Retro Film Vault',
    subtitle: '90s Cult Movies with Group Voice',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=640&q=85',
    actionLabel: 'Start Movie',
    mode: 'hls',
  },
  {
    title: 'Festival & Music Stage',
    subtitle: 'Concerts & Lo-Fi in Real-Time',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=640&q=85',
    actionLabel: 'Listen in Sync',
    mode: 'youtube',
  },
];

export function HeroSection() {
  const { openCreateRoom, openJoinRoom } = useRoomModals();
  return (
    <section className="relative z-10 w-full pt-8 sm:pt-14 pb-10 sm:pb-16 lg:pb-20 px-4 sm:px-6 lg:px-8 overflow-x-clip">
      {/* Top Text Block */}
      <div className="max-w-3xl mx-auto text-center">
        {/* Main Headline with inline coral waveform symbol */}
        <h1 className="font-display text-3xl sm:text-5xl lg:text-[46px] text-gray-950 tracking-tight leading-[1.18] sm:leading-[1.14]">
          Watch{' '}
          <span
            className="inline-flex items-center mx-1 sm:mx-2 text-[#FF5722] tracking-tighter text-2xl sm:text-4xl lg:text-[38px] select-none align-middle font-light"
            aria-hidden="true"
          >
            ııllııııllıı
          </span>{' '}
          together.{' '}
          <br className="hidden sm:inline" />
          <span className="text-gray-900">Even when you&apos;re apart.</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-4 sm:mt-5 text-sm sm:text-base text-gray-600 max-w-xl mx-auto leading-relaxed font-normal">
          Watch movies, YouTube, and your screen with friends in real time. No accounts, no installs, zero drift.
        </p>

        {/* Dual CTAs: Create a Room & Join a Room */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-3.5">
          <button
            onClick={() => openCreateRoom('hls')}
            type="button"
            className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#111827] hover:bg-black text-white text-sm font-bold shadow-lg hover:shadow-xl transition transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            Create a Room
          </button>
          <button
            onClick={openJoinRoom}
            type="button"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-white hover:bg-orange-50/60 text-gray-900 text-sm font-semibold border border-black/10 shadow-xs hover:border-orange-300 transition transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            Join a Room
          </button>
        </div>
      </div>

      {/* ── 3D WORKS WHEEL: Interactive Watch Party Reel ── */}
      <div className="mt-8 sm:mt-12 max-w-5xl mx-auto">
        <div className="relative w-full h-[380px] sm:h-[480px] lg:h-[540px] rounded-2xl sm:rounded-3xl overflow-hidden border border-black/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.2)] bg-[#0B0D14]">
          <WorksWheel
            items={HERO_WATCH_EXPERIENCES}
            label="CouchSync"
            action="Launch Party"
            onSelect={(item) => {
              const heroItem = item as HeroWheelItem;
              openCreateRoom(heroItem.mode || 'hls');
            }}
            className="size-full border-none shadow-none"
          />
        </div>
      </div>
    </section>
  );
}