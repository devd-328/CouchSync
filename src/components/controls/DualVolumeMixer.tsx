'use client';

import React, { useState } from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Share2,
  Check,
  Settings,
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
    <div className="w-full rounded-2xl bg-white border border-black/8 p-2.5 sm:p-3 shadow-xs text-gray-900 transition-all duration-300">
      {/* Primary Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        {/* Left: Device Quick Toggles */}
        <div className="flex items-center gap-2">
          {/* Mic Button */}
          <button
            onClick={onToggleMic}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
              isMicMuted
                ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100/70'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100/70'
            }`}
            title={isPushToTalkActive ? "Push-to-Talk active (Hold 'T')" : 'Toggle Microphone'}
          >
            {isMicMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isMicMuted ? 'Muted' : 'Mic On'}</span>
          </button>

          {/* Cam Button */}
          <button
            onClick={onToggleCam}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
              isCamOff
                ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100/70'
                : 'bg-orange-50 text-[#E64A19] border-orange-200 hover:bg-orange-100/70'
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
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
            isExpanded
              ? 'bg-orange-50 text-[#E64A19] border-orange-300 shadow-2xs'
              : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200/70 hover:text-gray-950'
          }`}
          title="Toggle Audio & Video Controls (Volume Sliders, Auto-Ducking, Push-to-Talk)"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#FF5722]" />
          <span>Audio &amp; Mixer</span>
          <span className="hidden md:inline text-[11px] text-gray-500 font-mono">
            {Math.round(movieVolume * 100)}% / {Math.round(partnerVoiceVolume * 100)}%
          </span>
          {isExpanded ? (
            <ChevronUp className="w-3.5 h-3.5 text-[#FF5722]" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          )}
        </button>

        {/* Right: Settings & Always-Visible Invite Friend Button */}
        <div className="flex items-center gap-2">
          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200/70 text-gray-700 hover:text-black border border-gray-200 transition cursor-pointer"
              title="Room Settings & Change Movie"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={handleCopyInvite}
            className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-linear-to-r from-[#FF5722] to-[#FF7043] hover:from-[#F4511E] hover:to-[#FF5722] text-white text-xs font-bold shadow-[0_4px_12px_rgba(255,87,34,0.3)] transition cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-white" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? 'Link Copied!' : 'Invite Friends'}</span>
            <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-white/25 text-[10px] font-mono font-bold">
              {participantsCount}
            </span>
          </button>
        </div>
      </div>

      {/* Expanded Audio Controls Drawer */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-700 animate-in fade-in duration-200">
          {/* Sliders Area */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            {/* Movie Volume Slider */}
            <div className="flex items-center gap-2.5">
              <span className="text-gray-800 font-bold">Movie:</span>
              <span className="font-mono text-[#EA580C] font-black text-xs w-9">
                {Math.round(movieVolume * 100)}%
              </span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={movieVolume}
                onChange={(e) => onMovieVolumeChange(parseFloat(e.target.value))}
                className="slider-warm w-24 sm:w-32 cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #FF5722 0%, #FF5722 ${Math.round(movieVolume * 100)}%, #E5E7EB ${Math.round(movieVolume * 100)}%, #E5E7EB 100%)`,
                }}
                title="Movie playback volume"
                aria-label="Movie playback volume"
              />
            </div>

            {/* Partner Volume Slider */}
            <div className="flex items-center gap-2.5">
              <span className="text-gray-800 font-bold">{partnerName}:</span>
              <span className="font-mono text-[#EA580C] font-black text-xs w-9">
                {Math.round(partnerVoiceVolume * 100)}%
              </span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={partnerVoiceVolume}
                onChange={(e) => onPartnerVolumeChange(parseFloat(e.target.value))}
                className="slider-warm slider-warm-partner w-24 sm:w-32 cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #F97316 0%, #F97316 ${Math.round(partnerVoiceVolume * 100)}%, #E5E7EB ${Math.round(partnerVoiceVolume * 100)}%, #E5E7EB 100%)`,
                }}
                title="Voice call volume"
                aria-label="Voice call volume"
              />
            </div>
          </div>

          {/* Quick Toggles */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onToggleAudioDucking}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition cursor-pointer ${
                isAudioDuckingEnabled
                  ? 'bg-orange-50 text-[#E64A19] border-orange-300'
                  : 'bg-gray-50 text-gray-500 border-gray-200'
              }`}
            >
              <span>Auto-Ducking:</span>
              <span>{isAudioDuckingEnabled ? 'ON' : 'OFF'}</span>
            </button>

            <button
              type="button"
              onClick={onTogglePushToTalk}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition cursor-pointer ${
                isPushToTalkActive
                  ? 'bg-orange-50 text-[#E64A19] border-orange-300'
                  : 'bg-gray-50 text-gray-500 border-gray-200'
              }`}
            >
              <span>Push-to-Talk (T):</span>
              <span>{isPushToTalkActive ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
