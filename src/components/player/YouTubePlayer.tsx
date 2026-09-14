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
  RotateCw,
  Maximize2,
  Minimize2,
  Gauge,
  Check,
} from 'lucide-react';
import { PlaybackAction, ControlMode } from '@/types/sync';
import { formatTime } from '@/lib/formatters';

interface YouTubePlayerProps {
  videoId: string;
  videoTitle?: string;
  canControlPlayback: boolean;
  controlMode: ControlMode;
  isFullscreen?: boolean;
  onSendAction: (action: PlaybackAction) => void;
  remoteAction: PlaybackAction | null;
  onChangeVideo: (id: string, title?: string) => void;
  onToggleFullscreen?: () => void;
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

declare global {
  interface Window {
    YT?: {
      Player: new (
        elementId: string | HTMLElement,
        options: {
          videoId?: string;
          playerVars?: Record<string, unknown>;
          events?: {
            onReady?: (event: { target: YTPlayerInstance }) => void;
            onStateChange?: (event: { data: number; target: YTPlayerInstance }) => void;
            onError?: (event: { data: number }) => void;
          };
        }
      ) => YTPlayerInstance;
      PlayerState?: {
        UNSTARTED: number;
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
        CUED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface YTPlayerInstance {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  getPlayerState: () => number;
  setVolume: (volume: number) => void;
  getVolume: () => number;
  mute: () => void;
  unMute: () => void;
  isMuted: () => boolean;
  setPlaybackRate: (rate: number) => void;
  getPlaybackRate: () => number;
  loadVideoById: (id: string) => void;
  cueVideoById: (id: string) => void;
  destroy: () => void;
}

const SPEED_OPTIONS = [0.75, 1.0, 1.25, 1.5, 2.0];

export function YouTubePlayer({
  videoId,
  videoTitle,
  canControlPlayback,
  controlMode,
  isFullscreen = false,
  onSendAction,
  remoteAction,
  onChangeVideo,
  onToggleFullscreen,
}: YouTubePlayerProps) {
  const containerElementId = useRef(`yt-player-${Math.random().toString(36).substring(2, 9)}`);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const ytPlayerRef = useRef<YTPlayerInstance | null>(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [newUrlInput, setNewUrlInput] = useState('');
  const [inputError, setInputError] = useState('');
  const [showLockToast, setShowLockToast] = useState(false);

  // PostMessage fallback for direct iframe control if YT.Player isn't ready
  const postToYT = useCallback((command: string, args: unknown[] = []) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: command, args }),
        '*'
      );
    }
  }, []);

  // 1. Initialize YouTube IFrame API
  useEffect(() => {
    let isCancelled = false;

    function initYT() {
      if (isCancelled) return;
      if (!window.YT || !window.YT.Player) return;

      try {
        const el = document.getElementById(containerElementId.current);
        if (!el) return;

        if (ytPlayerRef.current) {
          try {
            ytPlayerRef.current.destroy();
          } catch {
            // ignore
          }
          ytPlayerRef.current = null;
        }

        const player = new window.YT.Player(el, {
          videoId,
          playerVars: {
            enablejsapi: 1,
            autoplay: 1,
            controls: 0,
            rel: 0,
            modestbranding: 1,
            iv_load_policy: 3,
            playsinline: 1,
            origin: typeof window !== 'undefined' ? window.location.origin : '',
          },
          events: {
            onReady: (event) => {
              if (isCancelled) return;
              ytPlayerRef.current = event.target;
              setIsPlayerReady(true);
              try {
                const d = event.target.getDuration();
                if (typeof d === 'number' && !isNaN(d) && d > 0) {
                  setDuration(d);
                }
                event.target.playVideo();
                setIsPlaying(true);
              } catch {
                // ignore
              }
            },
            onStateChange: (event) => {
              if (isCancelled) return;
              // 1 = PLAYING, 2 = PAUSED, 0 = ENDED, 3 = BUFFERING
              if (event.data === 1) {
                setIsPlaying(true);
                try {
                  const d = event.target.getDuration();
                  if (typeof d === 'number' && !isNaN(d) && d > 0) {
                    setDuration(d);
                  }
                } catch {
                  // ignore
                }
              } else if (event.data === 2) {
                setIsPlaying(false);
              } else if (event.data === 0) {
                setIsPlaying(false);
              }
            },
          },
        });
      } catch (err) {
        console.warn('Error instantiating YT.Player:', err);
      }
    }

    if (window.YT && window.YT.Player) {
      initYT();
    } else {
      // Load the script if not present
      if (!document.getElementById('youtube-iframe-api-script')) {
        const tag = document.createElement('script');
        tag.id = 'youtube-iframe-api-script';
        tag.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(tag);
      }

      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prevCallback) prevCallback();
        initYT();
      };

      const timer = setInterval(() => {
        if (window.YT && window.YT.Player) {
          clearInterval(timer);
          initYT();
        }
      }, 150);

      return () => {
        isCancelled = true;
        clearInterval(timer);
      };
    }

    return () => {
      isCancelled = true;
      if (ytPlayerRef.current) {
        try {
          ytPlayerRef.current.destroy();
        } catch {
          // ignore
        }
        ytPlayerRef.current = null;
      }
    };
  }, [videoId]);

  // 2. Poll live playback position and duration
  useEffect(() => {
    const interval = setInterval(() => {
      const player = ytPlayerRef.current;
      if (player && typeof player.getCurrentTime === 'function') {
        try {
          const time = player.getCurrentTime();
          if (typeof time === 'number' && !isNaN(time) && time >= 0) {
            setCurrentTime(time);
          }
          const dur = player.getDuration();
          if (typeof dur === 'number' && !isNaN(dur) && dur > 0) {
            setDuration(dur);
          }
        } catch {
          // ignore
        }
      }
    }, 250);

    return () => clearInterval(interval);
  }, []);

  // 3. Handle remote actions from partners
  useEffect(() => {
    if (!remoteAction) return;

    const player = ytPlayerRef.current;

    if (remoteAction.type === 'play') {
      setIsPlaying(true);
      if (player?.playVideo) {
        player.playVideo();
        const current = player.getCurrentTime?.() ?? currentTime;
        if (Math.abs(current - remoteAction.time) > 1.5) {
          player.seekTo(remoteAction.time, true);
          setCurrentTime(remoteAction.time);
        }
      } else {
        postToYT('playVideo');
        if (Math.abs(currentTime - remoteAction.time) > 1.5) {
          postToYT('seekTo', [remoteAction.time, true]);
          setCurrentTime(remoteAction.time);
        }
      }
    } else if (remoteAction.type === 'pause') {
      setIsPlaying(false);
      if (player?.pauseVideo) {
        player.pauseVideo();
        player.seekTo(remoteAction.time, true);
      } else {
        postToYT('pauseVideo');
        postToYT('seekTo', [remoteAction.time, true]);
      }
      setCurrentTime(remoteAction.time);
    } else if (remoteAction.type === 'seek') {
      if (player?.seekTo) {
        player.seekTo(remoteAction.time, true);
      } else {
        postToYT('seekTo', [remoteAction.time, true]);
      }
      setCurrentTime(remoteAction.time);
    } else if (remoteAction.type === 'speed') {
      setPlaybackSpeed(remoteAction.speed);
      if (player?.setPlaybackRate) {
        player.setPlaybackRate(remoteAction.speed);
      }
    }
  }, [remoteAction, postToYT, currentTime]);

  const handlePlayPause = () => {
    if (!canControlPlayback) {
      setShowLockToast(true);
      setTimeout(() => setShowLockToast(false), 2500);
      return;
    }

    const player = ytPlayerRef.current;
    if (isPlaying) {
      if (player?.pauseVideo) player.pauseVideo();
      else postToYT('pauseVideo');
      setIsPlaying(false);
      onSendAction({
        type: 'pause',
        time: currentTime,
        senderId: 'local',
        ts: Date.now(),
      });
    } else {
      if (player?.playVideo) player.playVideo();
      else postToYT('playVideo');
      setIsPlaying(true);
      onSendAction({
        type: 'play',
        time: currentTime,
        senderId: 'local',
        ts: Date.now(),
      });
    }
  };

  const handleSeek = (newTime: number) => {
    if (!canControlPlayback) {
      setShowLockToast(true);
      setTimeout(() => setShowLockToast(false), 2500);
      return;
    }
    const safeTime = Math.max(0, Math.min(duration > 0 ? duration : 3600, newTime));
    setCurrentTime(safeTime);

    const player = ytPlayerRef.current;
    if (player?.seekTo) {
      player.seekTo(safeTime, true);
    } else {
      postToYT('seekTo', [safeTime, true]);
    }

    onSendAction({
      type: 'seek',
      time: safeTime,
      senderId: 'local',
      ts: Date.now(),
    });
  };

  const handleSkip = (deltaSeconds: number) => {
    if (!canControlPlayback) {
      setShowLockToast(true);
      setTimeout(() => setShowLockToast(false), 2500);
      return;
    }
    const maxDur = duration > 0 ? duration : 3600;
    const target = Math.max(0, Math.min(maxDur, currentTime + deltaSeconds));
    handleSeek(target);
  };

  const handleSpeedChange = (speed: number) => {
    if (!canControlPlayback) return;
    setPlaybackSpeed(speed);
    setShowSpeedMenu(false);

    const player = ytPlayerRef.current;
    if (player?.setPlaybackRate) {
      player.setPlaybackRate(speed);
    }

    onSendAction({
      type: 'speed',
      speed,
      senderId: 'local',
      ts: Date.now(),
    });
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);

    const player = ytPlayerRef.current;
    if (player?.setVolume) {
      player.setVolume(Math.round(val * 100));
      if (val === 0) {
        player.mute();
        setIsMuted(true);
      } else {
        player.unMute();
        setIsMuted(false);
      }
    } else {
      postToYT('setVolume', [Math.round(val * 100)]);
      if (val === 0) setIsMuted(true);
      else setIsMuted(false);
    }
  };

  const toggleMute = () => {
    const player = ytPlayerRef.current;
    if (isMuted) {
      setIsMuted(false);
      if (player?.unMute) {
        player.unMute();
        player.setVolume(Math.round(volume * 100));
      } else {
        postToYT('unMute');
        postToYT('setVolume', [Math.round(volume * 100)]);
      }
    } else {
      setIsMuted(true);
      if (player?.mute) {
        player.mute();
      } else {
        postToYT('mute');
      }
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInputError('');
    const extracted = extractYouTubeId(newUrlInput);
    if (!extracted) {
      setInputError('Please enter a valid YouTube link or 11-character video ID');
      return;
    }
    onChangeVideo(extracted, 'YouTube Stream');
    setShowUrlModal(false);
    setNewUrlInput('');
  };

  const validDuration = isFinite(duration) && duration > 0 ? duration : 0;
  const progressPercent = validDuration > 0 ? (currentTime / validDuration) * 100 : 0;

  return (
    <div className="relative w-full h-full flex flex-col bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
      {/* YouTube Iframe Container */}
      <div className="relative flex-1 w-full h-full min-h-90 bg-black">
        <div id={containerElementId.current} className="w-full h-full" />

        {/* Fallback iframe before JS API attaches or if blocked */}
        {!isPlayerReady && (
          <iframe
            ref={iframeRef}
            src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=1&controls=0&rel=0&modestbranding=1&iv_load_policy=3`}
            title={videoTitle || 'YouTube Watch Party'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0 pointer-events-none"
          />
        )}

        {/* Click layer to play/pause */}
        <div
          onClick={handlePlayPause}
          className="absolute inset-0 cursor-pointer z-10"
          title={canControlPlayback ? 'Click to play/pause (Space)' : 'Host controls playback'}
        />

        {/* Lock Toast Notification */}
        {showLockToast && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-xl bg-black/90 border border-amber-500/40 text-amber-300 text-xs font-semibold flex items-center gap-2 shadow-2xl animate-in fade-in zoom-in-95">
            <Lock className="w-4 h-4 text-amber-400" />
            <span>Playback is controlled by the room host</span>
          </div>
        )}

        {/* Top Floating Badge */}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-2 pointer-events-auto">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600/90 text-white text-xs font-bold shadow-lg backdrop-blur-md border border-rose-400/30">
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
          type="button"
          onClick={() => setShowUrlModal(true)}
          className="absolute top-3 right-3 z-20 px-3 py-1.5 rounded-xl bg-black/60 hover:bg-black/80 text-gray-200 hover:text-white border border-white/20 text-xs font-semibold backdrop-blur-md transition flex items-center gap-1.5 cursor-pointer shadow-lg"
        >
          <ExternalLink className="w-3.5 h-3.5 text-rose-400" />
          <span>Change YouTube Video</span>
        </button>
      </div>

      {/* Unified Player Controls Bar */}
      <div className="relative z-20 p-3.5 bg-linear-to-t from-black/98 via-black/85 to-transparent border-t border-white/10 flex flex-col gap-2.5">
        {/* Timeline Scrubber */}
        <div className={`relative group/timeline flex items-center w-full h-4 ${canControlPlayback ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}>
          <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden relative group-hover/timeline:h-2 transition-all">
            <div
              className="h-full bg-linear-to-r from-rose-500 via-rose-400 to-cyan-400 rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <input
            type="range"
            min={0}
            max={validDuration || 100}
            step={0.5}
            disabled={!canControlPlayback}
            value={currentTime}
            onChange={(e) => canControlPlayback && handleSeek(parseFloat(e.target.value))}
            className={`absolute inset-0 w-full h-full opacity-0 ${canControlPlayback ? 'cursor-pointer' : 'cursor-not-allowed'}`}
          />
          {/* Playhead thumb dot */}
          <div
            className="absolute w-3.5 h-3.5 bg-white rounded-full shadow-[0_0_10px_#F43F5E] pointer-events-none -ml-1.5 transition-transform group-hover/timeline:scale-125"
            style={{ left: `${progressPercent}%` }}
          />
        </div>

        {/* Buttons Row */}
        <div className="flex items-center justify-between text-white/90">
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Play/Pause Button */}
            <button
              type="button"
              onClick={handlePlayPause}
              disabled={!canControlPlayback}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              className={`p-2 rounded-xl transition cursor-pointer ${
                canControlPlayback
                  ? 'bg-white/10 hover:bg-white/20 text-white hover:text-rose-400'
                  : 'opacity-40 cursor-not-allowed bg-white/5 text-gray-500'
              }`}
              title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
            >
              {isPlaying ? <Pause className="w-4.5 h-4.5 fill-current" /> : <Play className="w-4.5 h-4.5 fill-current" />}
            </button>

            {/* 10s Skip Back */}
            <button
              type="button"
              onClick={() => handleSkip(-10)}
              disabled={!canControlPlayback}
              title="Rewind 10s (←)"
              className="p-1.5 rounded-lg hover:bg-white/15 text-gray-300 hover:text-rose-400 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* 10s Skip Forward */}
            <button
              type="button"
              onClick={() => handleSkip(10)}
              disabled={!canControlPlayback}
              title="Forward 10s (→)"
              className="p-1.5 rounded-lg hover:bg-white/15 text-gray-300 hover:text-rose-400 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {/* Volume Control */}
            <div className="flex items-center gap-1.5 ml-1 sm:ml-2">
              <button
                type="button"
                onClick={toggleMute}
                className="p-1.5 rounded-lg hover:bg-white/15 text-gray-300 hover:text-white transition cursor-pointer"
                title={isMuted ? 'Unmute (M)' : 'Mute (M)'}
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
                className="w-14 sm:w-18 h-1 accent-rose-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Right Controls: Speed, Time, Fullscreen */}
          <div className="flex items-center gap-2 sm:gap-3 text-xs font-medium tracking-wider">
            {/* Speed Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => canControlPlayback && setShowSpeedMenu(!showSpeedMenu)}
                disabled={!canControlPlayback}
                aria-label={`Playback speed ${playbackSpeed}x`}
                className={`px-2 py-1 rounded-lg border text-[11px] font-mono flex items-center gap-1 transition ${
                  canControlPlayback
                    ? 'bg-white/5 hover:bg-white/10 border-white/10 text-rose-300 cursor-pointer'
                    : 'opacity-40 cursor-not-allowed border-transparent text-gray-400'
                }`}
                title="Playback Speed"
              >
                <Gauge className="w-3 h-3" />
                <span>{playbackSpeed}x</span>
              </button>

              {showSpeedMenu && canControlPlayback && (
                <div className="absolute bottom-9 right-0 bg-black/95 backdrop-blur-xl border border-white/15 rounded-xl p-1.5 flex flex-col gap-1 shadow-2xl z-50 min-w-20">
                  {SPEED_OPTIONS.map((speed) => (
                    <button
                      key={speed}
                      type="button"
                      onClick={() => handleSpeedChange(speed)}
                      className={`px-2.5 py-1 rounded-lg text-left text-xs font-mono transition cursor-pointer ${
                        playbackSpeed === speed
                          ? 'bg-rose-500/20 text-rose-300 font-bold'
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
            <div className="text-gray-300 font-mono text-[11px] sm:text-xs shrink-0">
              <span>{formatTime(currentTime)}</span>
              <span className="text-gray-500 mx-1">/</span>
              <span className="text-gray-400">
                {validDuration > 0 ? formatTime(validDuration) : '--:--'}
              </span>
            </div>

            {/* Fullscreen Button */}
            {onToggleFullscreen && (
              <button
                type="button"
                onClick={onToggleFullscreen}
                aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                className="p-1.5 rounded-lg hover:bg-white/15 hover:text-rose-400 transition cursor-pointer"
                title={isFullscreen ? 'Exit Fullscreen (F)' : 'Fullscreen (F)'}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            )}
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
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white transition flex items-center gap-1.5 shadow-[0_0_15px_rgba(244,63,94,0.3)] cursor-pointer"
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
