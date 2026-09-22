'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { generateId } from '@/lib/formatters';
import {
  loadUserSession,
  saveUserSession,
  getRecentRooms,
  saveRecentRoom,
  removeRecentRoom,
  RecentRoom,
  isValidNickname,
} from '@/lib/session';
import { DEFAULT_VIDEO } from '@/lib/sample-media';
import { MediaSourceType } from '@/types/sync';
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
import { CreateRoomModal } from '@/components/landing/CreateRoomModal';
import { JoinRoomModal } from '@/components/landing/JoinRoomModal';

export default function HomePage() {
  const router = useRouter();

  // User state
  const [userName, setUserName] = useState('');
  const [recentRooms, setRecentRooms] = useState<RecentRoom[]>([]);
  const [isNavigating, setIsNavigating] = useState(false);

  // Modal dialog states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [selectedCreateMode, setSelectedCreateMode] = useState<MediaSourceType>('hls');

  useEffect(() => {
    const session = loadUserSession();
    if (session.userName && isValidNickname(session.userName)) {
      setUserName(session.userName);
    } else {
      setUserName('');
    }
    setRecentRooms(getRecentRooms());
  }, []);

  /** Navigates with a brief 320ms fade curtain for smooth UX */
  const navigateWithFade = useCallback(
    (href: string) => {
      setIsNavigating(true);
      setTimeout(() => router.push(href), 320);
    },
    [router]
  );

  const handleOpenCreate = (mode: MediaSourceType = 'hls') => {
    setSelectedCreateMode(mode);
    setIsCreateOpen(true);
  };

  const handleOpenJoin = () => {
    setIsJoinOpen(true);
  };

  const handleSaveUserName = (name: string) => {
    setUserName(name);
    saveUserSession({ userName: name });
  };

  const handleExecuteCreate = (roomName: string, mode: MediaSourceType, nick: string) => {
    setIsCreateOpen(false);
    const newRoomId = generateId('room').replace('room-', '');
    const cleanName = roomName.trim() || 'Cosmic Cinema';

    saveUserSession({
      userName: nick,
      roomName: cleanName,
      video: DEFAULT_VIDEO,
      isHost: true,
    });

    saveRecentRoom({ id: newRoomId, name: cleanName });
    navigateWithFade(`/room/${newRoomId}?initialMode=${mode}`);
  };

  const handleExecuteJoin = (roomId: string, nick: string) => {
    setIsJoinOpen(false);
    saveUserSession({
      userName: nick,
      isHost: false,
    });

    saveRecentRoom({ id: roomId, name: `Room ${roomId}` });
    navigateWithFade(`/room/${roomId}`);
  };

  const handleRemoveRecent = (id: string) => {
    removeRecentRoom(id);
    setRecentRooms(getRecentRooms());
  };

  return (
    <div
      className={`min-h-screen w-full bg-linear-to-b from-[#EA580C] via-[#F97316] to-[#FB923C] p-2 sm:p-5 lg:p-8 flex flex-col justify-between overflow-x-hidden${
        isNavigating ? ' page-navigating' : ''
      }`}
    >
      {/* Main White/Cream Canvas Card matching ChatNest frame */}
      <main className="w-full max-w-[1380px] mx-auto bg-[#FAF8F5] rounded-[28px] sm:rounded-[44px] shadow-[0_30px_90px_rgba(0,0,0,0.22)] border border-white/60 overflow-hidden flex flex-col justify-between">
        {/* 01. Navbar */}
        <Navbar
          onCreateRoom={() => handleOpenCreate('hls')}
          onJoinRoom={handleOpenJoin}
        />

        {/* 02. Hero Section with Hand Holding Phone + 4 Floating Cards */}
        <HeroSection
          onCreateRoom={(mode) => handleOpenCreate(mode || 'hls')}
          onJoinRoom={handleOpenJoin}
        />

        {/* 03. Capability Strip */}
        <CapabilityStrip />

        {/* 04. Synchronized Watching Showcase */}
        <ProductShowcase />

        {/* 05. Hang out while watching (Social/Chat) */}
        <SocialShowcase />

        {/* 06. More than movies */}
        <MoreThanMovies
          onSelectMode={(mode) => handleOpenCreate(mode)}
        />

        {/* 07. Simple Flow (How it works) */}
        <HowItWorks />

        {/* FAQ */}
        <FaqSection />

        {/* 08. Final CTA */}
        <FinalCTA
          onCreateRoom={() => handleOpenCreate('hls')}
          onJoinRoom={handleOpenJoin}
        />

        {/* 09. Footer */}
        <SiteFooter />
      </main>

      {/* Interactive Room Action Modals */}
      <CreateRoomModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        userName={userName}
        onSaveUserName={handleSaveUserName}
        defaultMode={selectedCreateMode}
        onSubmit={handleExecuteCreate}
      />

      <JoinRoomModal
        isOpen={isJoinOpen}
        onClose={() => setIsJoinOpen(false)}
        userName={userName}
        onSaveUserName={handleSaveUserName}
        recentRooms={recentRooms}
        onRemoveRecent={handleRemoveRecent}
        onSubmit={handleExecuteJoin}
      />
    </div>
  );
}
