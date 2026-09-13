'use client';

import React, { useState } from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Share2,
  Check,
  Headphones,
  Settings,
  Radio,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface DualVolumeMixerProps {
  movieVolume: number;
  partnerVoiceVolume: number;
  isMicMuted: boolean;
  isCamOff: boolean;
  partnerName?: string;
  isAudioDuckingEnabled: boolean;
  isPushToTalkActive: boolean;
  participantsCount: number;
  onMovieVolumeChange: (val: number) => void;
  onPartnerVolumeChange: (val: number) => void;
  onToggleMic: () => void;
  onToggleCam: () => void;
  onToggleAudioDucking: () => void;
  onTogglePushToTalk: () => void;
  onOpenSettings?: () => void;
}

export function DualVolumeMixer({
  movieVolume,
  partnerVoiceVolume,
  isMicMuted,
  isCamOff,
  partnerName = 'Partner',
  isAudioDuckingEnabled,
  isPushToTalkActive,
  participantsCount,
  onMovieVolumeChange,
  onPartnerVolumeChange,
  onToggleMic,
  onToggleCam,
  onToggleAudioDucking,
  onTogglePushToTalk,
  onOpenSettings,
}: DualVolumeMixerProps) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCopyInvite = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full rounded-2xl glass-panel border-white/10 p-2.5 sm:p-3 shadow-xl transition-all duration-300">
      {/* Primary Bar (Always visible single row) */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        {/* Left: Device Quick Toggles */}
        <div className="flex items-center gap-2">
          {/* Mic Button */}
          <button
            onClick={onToggleMic}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
              isMicMuted
                ? 'bg-rose-500/15 text-rose-300 border-rose-500/30 hover:bg-rose-500/25'
                : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25'
            }`}
            title={isPushToTalkActive ? "Push-to-Talk active (Hold 'T')" : 'Toggle Microphone'}
          >
            {isMicMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isMicMuted ? 'Muted' : 'Mic On'}</span>
          </button>

          {/* Cam Button */}
          <button
            onClick={onToggleCam}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
              isCamOff
                ? 'bg-rose-500/15 text-rose-300 border-rose-500/30 hover:bg-rose-500/25'
                : 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/25'
            }`}
            title="Toggle Webcam"
          >
            {isCamOff ? <VideoOff className="w-3.5 h-3.5" /> : <Video className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isCamOff ? 'Cam Off' : 'Cam On'}</span>
          </button>
        </div>

        {/* Center: Expandable Audio Controls Trigger */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition cursor-pointer ${
            isExpanded
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40 shadow-[0_0_10px_rgba(0,242,254,0.15)]'
              : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:text-white'
          }`}
          title="Toggle Audio & Video Controls (Volume Sliders, Auto-Ducking, Push-to-Talk)"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
          <span>Audio &amp; Mixer</span>
          <span className="hidden md:inline text-[11px] text-gray-400 font-mono">
            {Math.round(movieVolume * 100)}% / {Math.round(partnerVoiceVolume * 100)}%
          </span>
          {isExpanded ? (
            <ChevronUp className="w-3.5 h-3.5 text-cyan-400" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          )}
        </button>

        {/* Right: Settings & Always-Visible Invite Friend Button */}
        <div className="flex items-center gap-2">
          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-xl glass-pill hover:bg-white/15 text-gray-300 hover:text-white transition cursor-pointer"
              title="Room Settings & Change Movie"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={handleCopyInvite}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-[0_0_15px_rgba(127,0,255,0.3)] transition cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? 'Link Copied!' : 'Invite'}</span>
            <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-white/20 text-[10px] font-mono">
              {participantsCount}
            </span>
          </button>
        </div>
      </div>

      {/* Expanded Audio Controls Drawer */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-300 animate-in fade-in duration-200">
          {/* Sliders Area */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            {/* Movie Volume Slider */}
            <div className="flex items-center gap-2">
              <span className="text-gray-400 font-medium">Movie:</span>
              <span className="font-mono text-cyan-300 font-semibold w-8">
                {Math.round(movieVolume * 100)}%
              </span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={movieVolume}
                onChange={(e) => onMovieVolumeChange(parseFloat(e.target.value))}
                className="w-20 sm:w-24 accent-cyan-400 cursor-pointer"
                title="Movie playback volume"
              />
            </div>

            {/* Partner Volume Slider */}
            <div className="flex items-center gap-2">
              <span className="text-gray-400 font-medium">{partnerName}:</span>
              <span className="font-mono text-violet-300 font-semibold w-8">
                {Math.round(partnerVoiceVolume * 100)}%
              </span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={partnerVoiceVolume}
                onChange={(e) => onPartnerVolumeChange(parseFloat(e.target.value))}
                className="w-20 sm:w-24 accent-violet-400 cursor-pointer"
                title="Voice call volume"
              />
            </div>
          </div>

          {/* Toggles: Auto-Ducking & Push-to-Talk */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Smart Audio Ducking Toggle */}
            <button
              onClick={onToggleAudioDucking}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] font-medium transition cursor-pointer ${
                isAudioDuckingEnabled
                  ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 shadow-[0_0_10px_rgba(99,102,241,0.2)]'
                  : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
              }`}
              title="Automatically lowers movie volume when your partner speaks"
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>Auto-Ducking {isAudioDuckingEnabled ? 'ON' : 'OFF'}</span>
            </button>

            {/* Push-to-Talk Toggle */}
            <button
              onClick={onTogglePushToTalk}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] font-medium transition cursor-pointer ${
                isPushToTalkActive
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                  : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
              }`}
              title="Enable Push-to-Talk (Hold 'T' key to speak)"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>PTT {isPushToTalkActive ? '(Hold T)' : 'OFF'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
