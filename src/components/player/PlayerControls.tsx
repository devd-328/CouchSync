'use client';

import React, { useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Lock,
  Gauge,
} from 'lucide-react';
import { formatTime } from '@/lib/formatters';
import { ControlMode } from '@/types/sync';
import { SubtitleMenu } from './SubtitleMenu';

interface PlayerControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isFullscreen: boolean;
  playbackSpeed: number;
  canControl?: boolean;
  controlMode?: ControlMode;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (vol: number) => void;
  onSpeedChange: (speed: number) => void;
  onSubtitleTrackChange: (trackUrl: string | null) => void;
  onToggleMute: () => void;
  onToggleFullscreen: () => void;
  onSkip: (seconds: number) => void;
}

const SPEED_OPTIONS = [0.75, 1.0, 1.25, 1.5, 2.0];

export function PlayerControls({
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  isFullscreen,
  playbackSpeed,
  canControl = true,
  controlMode = 'shared',
  onTogglePlay,
  onSeek,
  onVolumeChange,
  onSpeedChange,
  onSubtitleTrackChange,
  onToggleMute,
  onToggleFullscreen,
  onSkip,
}: PlayerControlsProps) {
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const validDuration = isFinite(duration) && duration > 0 ? duration : 0;
  const progressPercent = validDuration > 0 ? (currentTime / validDuration) * 100 : 0;

  return (
    <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-black/95 via-black/70 to-transparent p-4 pt-10 flex flex-col gap-2 z-30 transition-opacity duration-300">
      {/* Timeline Scrubber */}
      <div className={`relative group/timeline flex items-center w-full h-4 ${canControl ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}>
        <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden relative group-hover/timeline:h-2 transition-all">
          <div
            className="h-full bg-linear-to-r from-cyan-400 via-indigo-400 to-violet-500 rounded-full transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <input
          type="range"
          min={0}
          max={validDuration || 100}
          step={0.5}
          disabled={!canControl}
          value={currentTime}
          onChange={(e) => canControl && onSeek(parseFloat(e.target.value))}
          className={`absolute inset-0 w-full h-full opacity-0 ${canControl ? 'cursor-pointer' : 'cursor-not-allowed'}`}
        />
        {/* Playhead thumb dot */}
        <div
          className="absolute w-3.5 h-3.5 bg-white rounded-full shadow-[0_0_10px_#00F2FE] pointer-events-none -ml-1.5 transition-transform group-hover/timeline:scale-125"
          style={{ left: `${progressPercent}%` }}
        />
      </div>

      {/* Action Buttons Row */}
      <div className="flex items-center justify-between text-white/90">
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Play/Pause */}
          <button
            onClick={canControl ? onTogglePlay : undefined}
            disabled={!canControl}
            aria-label={!canControl ? 'Playback locked by host' : isPlaying ? 'Pause' : 'Play'}
            className={`p-2 rounded-lg transition ${
              canControl
                ? 'hover:bg-white/15 hover:text-cyan-400 hover:shadow-[0_0_12px_rgba(0,242,254,0.25)] cursor-pointer'
                : 'opacity-40 cursor-not-allowed'
            }`}
            title={
              !canControl
                ? 'Playback is locked by host'
                : isPlaying
                ? 'Pause (Space)'
                : 'Play (Space)'
            }
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
          </button>

          {/* 10s Skip Back */}
          <button
            onClick={() => canControl && onSkip(-10)}
            disabled={!canControl}
            aria-label={canControl ? 'Rewind 10 seconds' : 'Rewind locked by host'}
            className={`p-1.5 rounded-lg transition ${
              canControl
                ? 'hover:bg-white/15 hover:text-cyan-400 cursor-pointer'
                : 'opacity-40 cursor-not-allowed'
            }`}
            title={canControl ? 'Rewind 10s (←)' : 'Locked by host'}
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* 10s Skip Forward */}
          <button
            onClick={() => canControl && onSkip(10)}
            disabled={!canControl}
            aria-label={canControl ? 'Fast forward 10 seconds' : 'Fast forward locked by host'}
            className={`p-1.5 rounded-lg transition ${
              canControl
                ? 'hover:bg-white/15 hover:text-cyan-400 cursor-pointer'
                : 'opacity-40 cursor-not-allowed'
            }`}
            title={canControl ? 'Forward 10s (→)' : 'Locked by host'}
          >
            <RotateCw className="w-4 h-4" />
          </button>

          {/* Volume Control */}
          <div className="flex items-center gap-2 group/volume ml-1 sm:ml-2">
            <button
              onClick={onToggleMute}
              aria-label={isMuted || volume === 0 ? 'Unmute audio' : 'Mute audio'}
              className="p-1.5 rounded-lg hover:bg-white/15 hover:text-cyan-400 transition"
              title="Mute / Unmute"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={isMuted ? 0 : volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="w-14 sm:w-16 h-1 accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Host Only indicator badge */}
          {!canControl && (
            <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-950/40 border border-amber-500/30 text-[10px] text-amber-300">
              <Lock className="w-3 h-3 text-amber-400" />
              <span>Host-Only Mode</span>
            </div>
          )}
        </div>

        {/* Right Info & Controls */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs font-medium tracking-wider">
          {/* Subtitle Menu */}
          <SubtitleMenu onSubtitleTrackChange={onSubtitleTrackChange} />

          {/* Synchronized Playback Speed Selector */}
          <div className="relative">
            <button
              onClick={() => canControl && setShowSpeedMenu(!showSpeedMenu)}
              disabled={!canControl}
              aria-label={canControl ? `Change playback speed, currently ${playbackSpeed}x` : 'Speed locked by host'}
              className={`px-2 py-1 rounded-lg border text-[11px] font-mono flex items-center gap-1 transition ${
                canControl
                  ? 'bg-white/5 hover:bg-white/10 border-white/10 text-cyan-300'
                  : 'opacity-40 cursor-not-allowed border-transparent text-gray-400'
              }`}
              title={canControl ? 'Change Playback Speed' : 'Locked by host'}
            >
              <Gauge className="w-3 h-3" />
              <span>{playbackSpeed}x</span>
            </button>

            {showSpeedMenu && canControl && (
              <div className="absolute bottom-9 right-0 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl p-1.5 flex flex-col gap-1 shadow-2xl z-50">
                {SPEED_OPTIONS.map((speed) => (
                  <button
                    key={speed}
                    onClick={() => {
                      onSpeedChange(speed);
                      setShowSpeedMenu(false);
                    }}
                    className={`px-3 py-1 rounded-lg text-left text-xs font-mono transition ${
                      playbackSpeed === speed
                        ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                        : 'hover:bg-white/10 text-gray-300'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Timestamp Display */}
          <div className="text-gray-300 font-mono text-[11px] sm:text-xs">
            <span>{formatTime(currentTime)}</span>
            <span className="text-gray-500 mx-1">/</span>
            <span className="text-gray-400">
              {validDuration > 0 ? formatTime(validDuration) : '--:--'}
            </span>
          </div>

          {/* Fullscreen Toggle */}
          <button
            onClick={onToggleFullscreen}
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            className="p-1.5 rounded-lg hover:bg-white/15 hover:text-cyan-400 transition"
            title={isFullscreen ? 'Exit Fullscreen (F)' : 'Fullscreen (F)'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
