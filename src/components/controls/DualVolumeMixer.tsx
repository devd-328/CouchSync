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

  const handleCopyInvite = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full rounded-2xl glass-panel border-white/10 p-3.5 flex flex-wrap items-center justify-between gap-4 shadow-xl">
      {/* Left: Device States */}
      <div className="flex items-center gap-2.5">
        {/* Mic Button */}
        <button
          onClick={onToggleMic}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition ${
            isMicMuted
              ? 'bg-rose-500/15 text-rose-300 border-rose-500/30 hover:bg-rose-500/25'
              : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25'
          }`}
          title={isPushToTalkActive ? "Push-to-Talk active (Hold 'T')" : 'Toggle Microphone'}
        >
          {isMicMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          <span>{isMicMuted ? 'Muted' : 'Mic Active'}</span>
        </button>

        {/* Cam Button */}
        <button
          onClick={onToggleCam}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition ${
            isCamOff
              ? 'bg-rose-500/15 text-rose-300 border-rose-500/30 hover:bg-rose-500/25'
              : 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/25'
          }`}
          title="Toggle Webcam"
        >
          {isCamOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
          <span>{isCamOff ? 'Cam Off' : 'Webcam Active'}</span>
        </button>
      </div>

      {/* Center: Dual Volume Sliders & Toggles */}
      <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-gray-300">
        {/* Movie Volume */}
        <div className="flex items-center gap-2.5">
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
          />
        </div>

        {/* Partner Volume */}
        <div className="flex items-center gap-2.5">
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
          />
        </div>

        {/* Smart Audio Ducking Toggle */}
        <button
          onClick={onToggleAudioDucking}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] font-medium transition ${
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
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] font-medium transition ${
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

      {/* Right: Invite & Settings */}
      <div className="flex items-center gap-2.5">
        {onOpenSettings && (
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl glass-pill hover:bg-white/15 text-gray-300 transition"
            title="Room Settings & Change Movie"
          >
            <Settings className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={handleCopyInvite}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-[0_0_15px_rgba(127,0,255,0.3)] transition"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Share2 className="w-4 h-4" />}
          <span>{copied ? 'Link Copied!' : 'Invite Friend'}</span>
          <span className="ml-1 px-1.5 py-0.5 rounded-full bg-white/20 text-[10px]">
            {participantsCount}
          </span>
        </button>
      </div>
    </div>
  );
}
