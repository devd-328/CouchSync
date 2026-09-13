'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  Tv,
  ExternalLink,
  Lock,
  Volume2,
  VolumeX,
  RotateCcw,
  Check,
} from 'lucide-react';
import { PlaybackAction, ControlMode } from '@/types/sync';
import { formatTime } from '@/lib/formatters';

interface YouTubePlayerProps {
  videoId: string;
  videoTitle?: string;
  canControlPlayback: boolean;
  controlMode: ControlMode;
  onSendAction: (action: PlaybackAction) => void;
  remoteAction: PlaybackAction | null;
  onChangeVideo: (id: string, title?: string) => void;
}

// Helper to extract YouTube ID from any format
export function extractYouTubeId(input: string): string | null {
  const trimmed = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  const regExp = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = trimmed.match(regExp);
  return match ? match[1] : null;
}

export function YouTubePlayer({
  videoId,
  videoTitle,
  canControlPlayback,
  controlMode,
  onSendAction,
  remoteAction,
  onChangeVideo,
}: YouTubePlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(600); // 10 min fallback
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [newUrlInput, setNewUrlInput] = useState('');
  const [inputError, setInputError] = useState('');
  const [showLockToast, setShowLockToast] = useState(false);

  // Send message to YouTube iframe
  const postToYT = useCallback((command: string, args: unknown[] = []) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: command, args }),
        '*'
      );
    }
  }, []);

  // Listen to remote sync actions
  useEffect(() => {
    if (!remoteAction) return;

    if (remoteAction.type === 'play') {
      setIsPlaying(true);
      postToYT('playVideo');
      if (Math.abs(currentTime - remoteAction.time) > 2) {
        postToYT('seekTo', [remoteAction.time, true]);
        setCurrentTime(remoteAction.time);
      }
    } else if (remoteAction.type === 'pause') {
      setIsPlaying(false);
      postToYT('pauseVideo');
      postToYT('seekTo', [remoteAction.time, true]);
      setCurrentTime(remoteAction.time);
    } else if (remoteAction.type === 'seek') {
      postToYT('seekTo', [remoteAction.time, true]);
      setCurrentTime(remoteAction.time);
    }
  }, [remoteAction, postToYT, currentTime]);

  // Periodic heartbeat / timer update while playing
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentTime((prev) => Math.min(prev + 1, duration));
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  const handlePlayPause = () => {
    if (!canControlPlayback) {
      setShowLockToast(true);
      setTimeout(() => setShowLockToast(false), 2500);
      return;
    }

    if (isPlaying) {
      postToYT('pauseVideo');
      setIsPlaying(false);
      onSendAction({
        type: 'pause',
        time: currentTime,
        senderId: 'local',
        ts: Date.now(),
      });
    } else {
      postToYT('playVideo');
      setIsPlaying(true);
      onSendAction({
        type: 'play',
        time: currentTime,
        senderId: 'local',
        ts: Date.now(),
      });
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canControlPlayback) {
      setShowLockToast(true);
      setTimeout(() => setShowLockToast(false), 2500);
      return;
    }
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    postToYT('seekTo', [newTime, true]);
    onSendAction({
      type: 'seek',
      time: newTime,
      senderId: 'local',
      ts: Date.now(),
    });
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    postToYT('setVolume', [Math.round(val * 100)]);
    if (val === 0) setIsMuted(true);
    else setIsMuted(false);
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      postToYT('unMute');
      postToYT('setVolume', [Math.round(volume * 100)]);
    } else {
      setIsMuted(true);
      postToYT('mute');
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInputError('');
    const extracted = extractYouTubeId(newUrlInput);
    if (!extracted) {
      setInputError('Please enter a valid YouTube link or video ID');
      return;
    }
    onChangeVideo(extracted, 'YouTube Stream');
    setShowUrlModal(false);
    setNewUrlInput('');
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
      {/* YouTube Iframe */}
      <div className="relative flex-1 w-full h-full min-h-90 bg-black">
        <iframe
          ref={iframeRef}
          src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=1&controls=0&rel=0&modestbranding=1&iv_load_policy=3`}
          title={videoTitle || 'YouTube Watch Party'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full border-0 pointer-events-none"
        />

        {/* Click layer to play/pause */}
        <div
          onClick={handlePlayPause}
          className="absolute inset-0 cursor-pointer z-10"
          title={canControlPlayback ? 'Click to play/pause' : 'Host controls playback'}
        />

        {/* Lock Toast Notification */}
        {showLockToast && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-xl bg-black/90 border border-amber-500/40 text-amber-300 text-xs font-semibold flex items-center gap-2 shadow-2xl animate-in fade-in zoom-in-95">
            <Lock className="w-4 h-4 text-amber-400" />
            <span>Playback is controlled by the room host</span>
          </div>
        )}

        {/* Top Floating Badge */}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600/90 text-white text-xs font-bold shadow-lg backdrop-blur-md">
            <Tv className="w-3.5 h-3.5" />
            <span>YouTube Party</span>
          </div>
          {controlMode === 'host-only' && !canControlPlayback && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-semibold backdrop-blur-md">
              <Lock className="w-3 h-3" />
              <span>Host Controlled</span>
            </div>
          )}
        </div>

        {/* Change Video Button */}
        <button
          onClick={() => setShowUrlModal(true)}
          className="absolute top-3 right-3 z-20 px-3 py-1.5 rounded-xl bg-black/60 hover:bg-black/80 text-gray-200 hover:text-white border border-white/20 text-xs font-semibold backdrop-blur-md transition flex items-center gap-1.5"
        >
          <ExternalLink className="w-3.5 h-3.5 text-rose-400" />
          <span>Change YouTube Video</span>
        </button>
      </div>

      {/* Player Controls Bar */}
      <div className="relative z-20 p-3 bg-linear-to-t from-black/95 via-black/80 to-transparent border-t border-white/10 flex flex-col gap-2">
        {/* Timeline Scrubber */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-gray-400 w-10 text-right">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min={0}
            max={duration}
            value={currentTime}
            disabled={!canControlPlayback}
            onChange={handleSeek}
            className={`flex-1 h-1.5 rounded-lg appearance-none cursor-pointer bg-white/20 accent-rose-500 transition ${
              !canControlPlayback ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          />
          <span className="text-[11px] font-mono text-gray-500 w-10">
            {formatTime(duration)}
          </span>
        </div>

        {/* Buttons Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePlayPause}
              disabled={!canControlPlayback}
              className={`p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition ${
                !canControlPlayback ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            </button>

            <button
              onClick={() => {
                if (!canControlPlayback) return;
                postToYT('seekTo', [0, true]);
                setCurrentTime(0);
                onSendAction({ type: 'seek', time: 0, senderId: 'local', ts: Date.now() });
              }}
              disabled={!canControlPlayback}
              title="Restart"
              className="p-2 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Volume Control */}
            <div className="flex items-center gap-1.5 ml-2">
              <button
                onClick={toggleMute}
                className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition"
              >
                {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 rounded-lg appearance-none cursor-pointer bg-white/20 accent-rose-500"
              />
            </div>
          </div>

          <div className="text-xs text-gray-400 font-medium truncate max-w-50">
            {videoTitle || 'YouTube Synced'}
          </div>
        </div>
      </div>

      {/* Change YouTube URL Modal */}
      {showUrlModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="min-h-full flex items-center justify-center p-4">
            <div className="w-full max-w-md glass-panel rounded-3xl p-6 border-white/10 bg-[#0E121E] shadow-2xl my-auto">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Tv className="w-5 h-5 text-rose-500" />
              <span>Load YouTube Video</span>
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Paste any YouTube video link or ID to watch with your friends in sync.
            </p>

            <form onSubmit={handleUrlSubmit} className="mt-4 flex flex-col gap-3">
              <input
                type="text"
                autoFocus
                value={newUrlInput}
                onChange={(e) => {
                  setNewUrlInput(e.target.value);
                  setInputError('');
                }}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-rose-500/60"
              />
              {inputError && <p className="text-xs text-rose-400 font-semibold">{inputError}</p>}

              <div className="flex gap-2 justify-end mt-2">
                <button
                  type="button"
                  onClick={() => setShowUrlModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white transition flex items-center gap-1.5 shadow-[0_0_15px_rgba(244,63,94,0.3)]"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Sync Video</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
