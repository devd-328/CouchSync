'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CouchSyncMark } from '@/components/brand/CouchSyncLogo';
import {
  ArrowLeft,
  Settings,
  Users,
  Crown,
  Lock,
  Unlock,
  MonitorUp,
  Tv,
  Film,
  Gamepad2,
  Square,
  CheckCircle2,
  FolderOpen,
} from 'lucide-react';
import { ControlMode, ThemeMode, MediaSourceType, RoomLayoutMode } from '@/types/sync';

interface RoomHeaderProps {
  roomName: string;
  roomId: string;
  participantsCount: number;
  isHost: boolean;
  controlMode: ControlMode;
  currentTheme: ThemeMode;
  currentSource: MediaSourceType;
  currentLayout: RoomLayoutMode;
  isScreenSharing: boolean;
  onToggleControlMode: () => void;
  onSelectTheme: (theme: ThemeMode) => void;
  onSelectSource: (source: MediaSourceType) => void;
  onSelectLayout: (layout: RoomLayoutMode) => void;
  onToggleScreenShare: () => void;
  onOpenSettings: () => void;
  onOpenSelectMovie?: () => void;
}

const HEADER_SOURCES: {
  mode: MediaSourceType;
  label: string;
  shortLabel: string;
  icon: React.ReactNode;
  ariaLabel: string;
}[] = [
  {
    mode: 'hls',
    label: 'Cinema Movie',
    shortLabel: 'Movie',
    icon: <Film className="w-3.5 h-3.5 shrink-0" />,
    ariaLabel: 'Switch to Cinema Movie (HLS)',
  },
  {
    mode: 'youtube',
    label: 'YouTube Party',
    shortLabel: 'YouTube',
    icon: <Tv className="w-3.5 h-3.5 shrink-0" />,
    ariaLabel: 'Switch to YouTube Watch Party',
  },
  {
    mode: 'screenshare',
    label: 'Screen Share',
    shortLabel: 'Screen',
    icon: <MonitorUp className="w-3.5 h-3.5 shrink-0" />,
    ariaLabel: 'Share your screen to the room',
  },
  {
    mode: 'trivia',
    label: 'Movie Trivia',
    shortLabel: 'Trivia',
    icon: <Gamepad2 className="w-3.5 h-3.5 shrink-0" />,
    ariaLabel: 'Play intermission movie trivia',
  },
];

const LAYOUTS: { mode: RoomLayoutMode; label: string; ariaLabel: string }[] = [
  { mode: 'cinema', label: 'Cinema', ariaLabel: 'Cinema theater layout' },
  { mode: 'lounge', label: 'Lounge', ariaLabel: 'Kosmi lounge couch layout' },
  { mode: 'focus', label: 'Focus', ariaLabel: 'Full focus layout (video only)' },
];

export function RoomHeader({
  roomName,
  roomId,
  participantsCount,
  isHost,
  controlMode,
  currentTheme,
  currentSource,
  currentLayout,
  isScreenSharing,
  onToggleControlMode,
  onSelectTheme,
  onSelectSource,
  onSelectLayout,
  onToggleScreenShare,
  onOpenSettings,
  onOpenSelectMovie,
}: RoomHeaderProps) {
  const triggerMoviePicker = onOpenSelectMovie || onOpenSettings;

  return (
    <header className="w-full flex flex-wrap items-center justify-between gap-3 p-2.5 sm:p-3 rounded-2xl bg-white border border-black/8 shadow-xs">
      {/* Left: Back Link & Room Info */}
      <div className="flex items-center gap-3">
        <Link
          href="/"
          aria-label="Return to lobby"
          className="p-2 rounded-xl bg-gray-100 hover:bg-orange-50 border border-gray-200 text-gray-700 hover:text-[#FF5722] transition"
          title="Return to Lobby"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex items-center gap-2.5">
          <CouchSyncMark size={32} />
          <div>
            <h1 className="text-sm sm:text-base font-black tracking-tight text-gray-950 flex items-center gap-2">
              <span suppressHydrationWarning>{roomName}</span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200 font-mono font-semibold">
                #{roomId}
              </span>
              {isHost && (
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300 text-[10px] font-bold shadow-2xs">
                  <Crown className="w-3 h-3 text-amber-500" />
                  Host
                </span>
              )}
            </h1>
          </div>
        </div>
      </div>

      {/* Right: Permissions Control, Source Selector, Choose Movie Button, Layout, Theme, Members */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Host Mode Control Toggle / Status */}
        {isHost ? (
          <button
            onClick={onToggleControlMode}
            aria-label="Toggle playback control mode"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer ${
              controlMode === 'host-only'
                ? 'bg-amber-50 text-amber-900 border-amber-300 shadow-2xs'
                : 'bg-gray-100 hover:bg-gray-200/70 text-gray-700 border-gray-200'
            }`}
            title="Click to toggle playback control permissions"
          >
            {controlMode === 'host-only' ? (
              <>
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                <span>Host-Only Control</span>
              </>
            ) : (
              <>
                <Unlock className="w-3.5 h-3.5 text-[#FF5722]" />
                <span>Shared Controls</span>
              </>
            )}
            <span className="text-[10px] text-gray-500 ml-1">(Switch)</span>
          </button>
        ) : (
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${
              controlMode === 'host-only'
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : 'bg-gray-100 text-gray-600 border-gray-200'
            }`}
          >
            {controlMode === 'host-only' ? (
              <>
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                <span>Controlled by Host</span>
              </>
            ) : (
              <>
                <Unlock className="w-3.5 h-3.5 text-[#FF5722]" />
                <span>Shared Controls</span>
              </>
            )}
          </div>
        )}

        {/* Media Source Quick Selector */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-gray-100 border border-gray-200">
          {HEADER_SOURCES.map(({ mode, shortLabel, icon, ariaLabel }) => {
            const isScreenShareBtn = mode === 'screenshare';
            const isActive = isScreenShareBtn
              ? isScreenSharing || currentSource === 'screenshare'
              : currentSource === mode;

            const handleSourceClick = () => {
              if (isScreenShareBtn) {
                onToggleScreenShare();
              } else if (mode === 'hls' && isActive) {
                triggerMoviePicker();
              } else {
                onSelectSource(mode);
              }
            };

            return (
              <button
                key={mode}
                onClick={handleSourceClick}
                aria-label={
                  isScreenShareBtn && isScreenSharing
                    ? 'Stop screen sharing'
                    : ariaLabel
                }
                title={
                  isScreenShareBtn
                    ? isScreenSharing
                      ? 'Stop Screen Sharing'
                      : 'Share Screen to Room'
                    : mode === 'hls' && isActive
                    ? 'Click to change movie or upload from PC'
                    : ariaLabel
                }
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  isActive
                    ? 'bg-white text-gray-950 shadow-2xs font-bold border border-black/5'
                    : 'text-gray-600 hover:text-gray-950 hover:bg-white/60'
                }`}
              >
                {isScreenShareBtn && isScreenSharing ? (
                  <>
                    <Square className="w-3.5 h-3.5 text-rose-500 fill-current" />
                    <span className="hidden sm:inline text-rose-600 font-bold">Stop</span>
                  </>
                ) : (
                  <>
                    <span className={isActive ? 'text-[#FF5722]' : 'text-gray-500'}>{icon}</span>
                    <span className="hidden sm:inline">{shortLabel}</span>
                  </>
                )}
                {isActive && !isScreenSharing && (
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-[#FF5722]" />
                )}
              </button>
            );
          })}
        </div>

        {/* PROMINENT "UPLOAD / SELECT MOVIE" BUTTON - MATCHING LANDING CTA */}
        <button
          type="button"
          onClick={triggerMoviePicker}
          aria-label="Upload movie from PC or choose video"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-linear-to-r from-[#FF5722] to-[#FF7043] hover:from-[#F4511E] hover:to-[#FF5722] text-white text-xs font-bold shadow-[0_4px_12px_rgba(255,87,34,0.3)] transition-all cursor-pointer group shrink-0"
          title="Choose a movie file (.mp4, .mkv, .webm) from PC or select an online stream"
        >
          <FolderOpen className="w-4 h-4 text-white group-hover:scale-110 transition-transform shrink-0" />
          <span className="hidden sm:inline">Upload / Select Movie</span>
          <span className="sm:hidden">Movie File</span>
        </button>

        {/* Room Layout Switcher */}
        <div
          className="flex items-center gap-1 p-1 rounded-xl bg-gray-100 border border-gray-200"
          role="group"
          aria-label="Switch room layout"
        >
          {LAYOUTS.map(({ mode, label, ariaLabel }) => (
            <button
              key={mode}
              onClick={() => onSelectLayout(mode)}
              aria-label={ariaLabel}
              aria-pressed={currentLayout === mode}
              title={ariaLabel}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                currentLayout === mode
                  ? 'bg-white text-gray-950 shadow-2xs'
                  : 'text-gray-600 hover:text-gray-950 hover:bg-white/60'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* In-Room Participant Counter */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 border border-gray-200 text-xs text-gray-800 font-semibold">
          <Users className="w-3.5 h-3.5 text-[#FF5722]" />
          <span>{Math.max(1, participantsCount)} in room</span>
        </div>

        {/* Room Options */}
        <button
          type="button"
          onClick={onOpenSettings}
          aria-label="Room options and settings"
          className="p-2 rounded-xl bg-gray-100 border border-gray-200 hover:bg-orange-50 text-gray-700 hover:text-[#FF5722] transition cursor-pointer"
          title="Room Options & Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
