'use client';

import React from 'react';
import Link from 'next/link';
import {
  Clapperboard,
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
} from 'lucide-react';
import { ControlMode, ThemeMode, MediaSourceType, RoomLayoutMode } from '@/types/sync';
import { ThemeSelector } from './ThemeSelector';
import { SOURCE_COLORS } from '@/config/constants';

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
}

/** Source selector button definitions — mirrors the homepage ACTIVITIES array */
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

/** Layout toggle options */
const LAYOUTS: { mode: RoomLayoutMode; label: string; ariaLabel: string }[] = [
  { mode: 'cinema',  label: 'Cinema',  ariaLabel: 'Cinema theater layout' },
  { mode: 'lounge',  label: 'Lounge',  ariaLabel: 'Kosmi lounge couch layout' },
  { mode: 'focus',   label: 'Focus',   ariaLabel: 'Full focus layout (video only)' },
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
}: RoomHeaderProps) {
  return (
    <header className="w-full flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
      {/* Left: Back Link & Room Info */}
      <div className="flex items-center gap-3">
        <Link
          href="/"
          aria-label="Return to lobby"
          className="p-2 rounded-xl glass-pill hover:bg-white/15 text-gray-400 hover:text-white transition"
          title="Return to Lobby"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-cyan-400 to-violet-600 flex items-center justify-center">
            <Clapperboard className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
              {roomName}
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-gray-400 font-mono font-normal">
                #{roomId}
              </span>
              {isHost && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px] font-semibold">
                  <Crown className="w-3 h-3 text-amber-400" />
                  Host
                </span>
              )}
            </h1>
          </div>
        </div>
      </div>

      {/* Right: Permissions Control, Source Selector, Layout, Theme, Members, Settings */}
      <div className="flex items-center gap-2.5">
        {/* Host Mode Control Toggle / Status */}
        {isHost ? (
          <button
            onClick={onToggleControlMode}
            aria-label="Toggle playback control mode"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
              controlMode === 'host-only'
                ? 'bg-amber-500/20 text-amber-200 border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
            }`}
            title="Click to toggle playback control permissions"
          >
            {controlMode === 'host-only' ? (
              <>
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Host-Only Control</span>
              </>
            ) : (
              <>
                <Unlock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Shared Controls</span>
              </>
            )}
            <span className="text-[10px] text-gray-400 ml-1">(Switch)</span>
          </button>
        ) : (
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${
              controlMode === 'host-only'
                ? 'bg-amber-950/30 text-amber-300 border-amber-500/30'
                : 'bg-white/5 text-gray-400 border-white/10'
            }`}
          >
            {controlMode === 'host-only' ? (
              <>
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Controlled by Host</span>
              </>
            ) : (
              <>
                <Unlock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Shared Controls</span>
              </>
            )}
          </div>
        )}

        {/* Media Source Quick Selector — per-source colors match homepage activity cards */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-black/40 border border-white/10">
          {HEADER_SOURCES.map(({ mode, shortLabel, icon, ariaLabel }) => {
            // Screen-share button has special active/stop behaviour
            const isScreenShareBtn = mode === 'screenshare';
            const isActive = isScreenShareBtn
              ? isScreenSharing || currentSource === 'screenshare'
              : currentSource === mode;
            const colors = SOURCE_COLORS[mode];

            return (
              <button
                key={mode}
                onClick={isScreenShareBtn ? onToggleScreenShare : () => onSelectSource(mode)}
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
                    : ariaLabel
                }
                className={`card-hover flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  isActive
                    ? `${colors.bg} ${colors.text} border ${colors.border} ${colors.shadow}`
                    : `${colors.icon} opacity-60 hover:opacity-100 hover:bg-white/8`
                }`}
              >
                {/* Show stop icon when actively screen-sharing */}
                {isScreenShareBtn && isScreenSharing ? (
                  <>
                    <Square className="w-3 h-3 text-rose-400 fill-current" />
                    <span className="hidden sm:inline text-rose-300">Stop</span>
                  </>
                ) : (
                  <>
                    <span>{icon}</span>
                    <span className="hidden sm:inline">{shortLabel}</span>
                  </>
                )}
                {/* Checkmark on active source — matches homepage card treatment */}
                {isActive && !isScreenSharing && (
                  <CheckCircle2 className={`w-3 h-3 shrink-0 ${colors.icon}`} />
                )}
              </button>
            );
          })}
        </div>

        {/* Room Layout Switcher */}
        <div
          className="flex items-center gap-1 p-1 rounded-xl bg-black/40 border border-white/10"
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
              className={`px-2 py-1 rounded-lg text-[11px] font-bold transition ${
                currentLayout === mode
                  ? 'bg-white/20 text-white shadow-[0_0_8px_rgba(255,255,255,0.1)]'
                  : 'text-gray-500 hover:text-gray-300 hover:bg-white/8'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Ambient Theater Theme Selector */}
        <ThemeSelector currentTheme={currentTheme} onSelectTheme={onSelectTheme} />

        {/* In-Room Participant Counter */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-pill text-xs text-gray-300">
          <Users className="w-3.5 h-3.5 text-cyan-400" />
          <span>{Math.max(1, participantsCount)} in room</span>
        </div>

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          aria-label="Video and room settings"
          className="p-2 rounded-xl glass-pill hover:bg-white/15 text-gray-300 hover:text-white transition"
          title="Video & Room Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
