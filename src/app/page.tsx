'use client';

import React from 'react';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { Navbar } from '@/components/landing/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { CapabilityStrip } from '@/components/landing/CapabilityStrip';
import { ProductShowcase } from '@/components/landing/ProductShowcase';
import { SocialShowcase } from '@/components/landing/SocialShowcase';
import { MoreThanMovies } from '@/components/landing/MoreThanMovies';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { FaqSection } from '@/components/landing/FaqSection';
import { FinalCTA } from '@/components/landing/FinalCTA';
import { useRoomModals } from '@/components/landing/RoomModalsProvider';

export default function HomePage() {
  const { openCreateRoom } = useRoomModals();

  return (
    <div className="min-h-screen w-full bg-linear-to-b from-[#EA580C] via-[#F97316] to-[#FB923C] p-2 sm:p-5 lg:p-8 flex flex-col justify-between overflow-x-hidden">
      {/* Main White/Cream Canvas Card matching ChatNest frame */}
      <main className="w-full max-w-[1380px] mx-auto bg-[#FAF8F5] rounded-[28px] sm:rounded-[44px] shadow-[0_30px_90px_rgba(0,0,0,0.22)] border border-white/60 overflow-hidden flex flex-col justify-between">
        {/* 01. Navbar */}
        <Navbar currentPage="home" />

        {/* 02. Hero Section with Hand Holding Phone + 4 Floating Cards */}
        <HeroSection />

        {/* 03. Capability Strip */}
        <CapabilityStrip />

        {/* 04. Synchronized Watching Showcase */}
        <ProductShowcase />

        {/* 05. Hang out while watching (Social/Chat) */}
        <SocialShowcase />

        {/* 06. More than movies */}
        <MoreThanMovies
          onSelectMode={(mode) => openCreateRoom(mode)}
        />

        {/* 07. Simple Flow (How it works) */}
        <HowItWorks />

        {/* FAQ */}
        <FaqSection />

        {/* 08. Final CTA */}
        <FinalCTA />

        {/* 09. Footer */}
        <SiteFooter />
      </main>
    </div>
  );
}
