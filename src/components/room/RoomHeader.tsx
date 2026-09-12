'use client';

import React from 'react';
import Link from 'next/link';
import { Clapperboard, ArrowLeft, Settings, Users, Crown, Lock, Unlock } from 'lucide-react';
import { ControlMode, ThemeMode, MediaSourceType, RoomLayoutMode } from '@/types/sync';
import { ThemeSelector } from './ThemeSelector';
import { MonitorUp, Tv, Film, Gamepad2, Layout, Square } from 'lucide-react';

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
          className="p-2 rounded-xl glass-pill hover:bg-white/15 text-gray-400 hover:text-white transition"
          title="Return to Lobby"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-400 to-violet-600 flex items-center justify-center">
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

      {/* Right: Permissions Control, Theme Selector, Member Count & Settings */}
      <div className="flex items-center gap-2.5">
        {/* Host Mode Control Toggle / Status */}
        {isHost ? (
          <button
            onClick={onToggleControlMode}
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

        {/* Media Source Quick Selector (Kosmi Lounge) */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-black/40 border border-white/10">
          <button
            onClick={() => onSelectSource('hls')}
            title="Switch to Cinema Movie"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              currentSource === 'hls'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Movie</span>
          </button>

          <button
            onClick={() => onSelectSource('youtube')}
            title="Switch to YouTube Watch Party"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              currentSource === 'youtube'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-400/40'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">YouTube</span>
          </button>

          <button
            onClick={onToggleScreenShare}
            title={isScreenSharing ? 'Stop Screen Sharing' : 'Share Screen to Big Screen'}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              isScreenSharing || currentSource === 'screenshare'
                ? 'bg-violet-500/30 text-violet-200 border border-violet-400/50 shadow-[0_0_10px_rgba(139,92,246,0.3)]'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            {isScreenSharing ? (
              <>
                <Square className="w-3 h-3 text-rose-400 fill-current" />
                <span className="hidden sm:inline">Stop Share</span>
              </>
            ) : (
              <>
                <MonitorUp className="w-3.5 h-3.5 text-violet-400" />
                <span className="hidden sm:inline">Screen Share</span>
              </>
            )}
          </button>

          <button
            onClick={() => onSelectSource('trivia')}
            title="Play Intermission Movie Trivia"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              currentSource === 'trivia'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Trivia</span>
          </button>
        </div>

        {/* Room Layout Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-black/40 border border-white/10" title="Switch Room Layout">
          <button
            onClick={() => onSelectLayout('cinema')}
            title="Cinema Theater Layout"
            className={`px-2 py-1 rounded-lg text-[11px] font-bold transition ${
              currentLayout === 'cinema' ? 'bg-white/20 text-white' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Cinema
          </button>
          <button
            onClick={() => onSelectLayout('lounge')}
            title="Kosmi Lounge Couch Layout"
            className={`px-2 py-1 rounded-lg text-[11px] font-bold transition ${
              currentLayout === 'lounge' ? 'bg-white/20 text-white' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Lounge
          </button>
          <button
            onClick={() => onSelectLayout('focus')}
            title="Full Focus Layout"
            className={`px-2 py-1 rounded-lg text-[11px] font-bold transition ${
              currentLayout === 'focus' ? 'bg-white/20 text-white' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Focus
          </button>
        </div>

        {/* Ambient Theater Theme Selector */}
        <ThemeSelector currentTheme={currentTheme} onSelectTheme={onSelectTheme} />

        {/* In-Room Counter */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-pill text-xs text-gray-300">
          <Users className="w-3.5 h-3.5 text-cyan-400" />
          <span>{Math.max(1, participantsCount)} in room</span>
        </div>

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-xl glass-pill hover:bg-white/15 text-gray-300 transition"
          title="Video & Room Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
