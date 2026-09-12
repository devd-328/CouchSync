'use client';

import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Play, Loader2, Lock, History } from 'lucide-react';
import { PlayerControls } from './PlayerControls';
import { SyncStatusBadge } from './SyncStatusBadge';
import { FloatingReactions } from '../reactions/FloatingReactions';
import { FloatingEmoji, ControlMode, MediaSourceType, PlaybackAction, TriviaAction } from '@/types/sync';
import { formatTime } from '@/lib/formatters';
import { YouTubePlayer } from './YouTubePlayer';
import { ScreenSharePlayer } from './ScreenSharePlayer';
import { MovieTrivia } from '../games/MovieTrivia';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackSpeed: number;
  isBuffering: boolean;
  isPartnerBuffering: boolean;
  partnerStatus: string;
  partnerName?: string;
  syncLatency: number;
  reactions: FloatingEmoji[];
  movieVolume: number;
  canControl?: boolean;
  controlMode?: ControlMode;
  savedResumeTime?: number | null;
  mediaSource?: MediaSourceType;
  youtubeVideoId?: string;
  youtubeVideoTitle?: string;
  screenStream?: MediaStream | null;
  screenPresenterName?: string;
  isLocalScreenPresenter?: boolean;
  currentUserId?: string;
  currentUserName?: string;
  isHost?: boolean;
  remotePlaybackAction?: PlaybackAction | null;
  remoteTriviaAction?: TriviaAction | null;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  onSpeedChange: (speed: number) => void;
  onMovieVolumeChange: (vol: number) => void;
  onResumeSaved?: () => void;
  onDismissResume?: () => void;
  onStopScreenShare?: () => void;
  onSendPlaybackAction?: (action: PlaybackAction) => void;
  onChangeYouTubeVideo?: (id: string, title?: string) => void;
  onSendTriviaAction?: (action: TriviaAction) => void;
  onCloseTrivia?: () => void;
}

export function VideoPlayer({
  src,
  poster,
  videoRef,
  isPlaying,
  currentTime,
  duration,
  playbackSpeed,
  isBuffering,
  isPartnerBuffering,
  partnerStatus,
  partnerName = 'Partner',
  syncLatency,
  reactions,
  movieVolume,
  canControl = true,
  controlMode = 'shared',
  savedResumeTime,
  mediaSource = 'hls',
  youtubeVideoId = 'M7lc1UVf-VE',
  youtubeVideoTitle = 'YouTube Party',
  screenStream = null,
  screenPresenterName = 'Presenter',
  isLocalScreenPresenter = false,
  currentUserId = 'user-1',
  currentUserName = 'Alex',
  isHost = false,
  remotePlaybackAction = null,
  remoteTriviaAction = null,
  onTogglePlay,
  onSeek,
  onSpeedChange,
  onMovieVolumeChange,
  onResumeSaved,
  onDismissResume,
  onStopScreenShare,
  onSendPlaybackAction,
  onChangeYouTubeVideo,
  onSendTriviaAction,
  onCloseTrivia,
}: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showLockToast, setShowLockToast] = useState(false);
  const [subtitleTrackUrl, setSubtitleTrackUrl] = useState<string | null>(null);

  const hideControlsTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lockToastTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync movie volume with video element
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = isMuted ? 0 : movieVolume;
    }
  }, [movieVolume, isMuted, videoRef]);

  // HLS.js video initialization
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    let hls: Hls | null = null;

    if (src.includes('.m3u8')) {
      if (Hls.isSupported()) {
        hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 60,
        });

        hls.loadSource(src);
        hls.attachMedia(video);
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
      }
    } else {
      // Local Blob URL or direct MP4/WebM
      video.src = src;
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [src, videoRef]);

  // Auto-hide controls after mouse inactivity
  const handleMouseMove = () => {
    setShowControls(true);
    if (hideControlsTimerRef.current) clearTimeout(hideControlsTimerRef.current);
    if (isPlaying) {
      hideControlsTimerRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleSkip = (seconds: number) => {
    if (!canControl) {
      triggerLockToast();
      return;
    }
    const target = Math.max(0, Math.min(duration, currentTime + seconds));
    onSeek(target);
  };

  const handleCanvasClick = () => {
    if (!canControl) {
      triggerLockToast();
      return;
    }
    onTogglePlay();
  };

  const triggerLockToast = () => {
    setShowLockToast(true);
    if (lockToastTimerRef.current) clearTimeout(lockToastTimerRef.current);
    lockToastTimerRef.current = setTimeout(() => {
      setShowLockToast(false);
    }, 2500);
  };

  if (mediaSource === 'youtube') {
    return (
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl">
        <YouTubePlayer
          videoId={youtubeVideoId}
          videoTitle={youtubeVideoTitle}
          canControlPlayback={canControl}
          controlMode={controlMode}
          onSendAction={onSendPlaybackAction || (() => {})}
          remoteAction={remotePlaybackAction}
          onChangeVideo={onChangeYouTubeVideo || (() => {})}
        />
        <FloatingReactions reactions={reactions} />
      </div>
    );
  }

  if (mediaSource === 'screenshare') {
    return (
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl">
        <ScreenSharePlayer
          stream={screenStream}
          presenterName={screenPresenterName}
          isLocalPresenter={isLocalScreenPresenter}
          onStopShare={onStopScreenShare || (() => {})}
        />
        <FloatingReactions reactions={reactions} />
      </div>
    );
  }

  if (mediaSource === 'trivia') {
    return (
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl">
        <MovieTrivia
          currentUserId={currentUserId}
          currentUserName={currentUserName}
          isHost={isHost}
          onSendTriviaAction={onSendTriviaAction || (() => {})}
          remoteTriviaAction={remoteTriviaAction}
          onCloseTrivia={onCloseTrivia || (() => {})}
        />
        <FloatingReactions reactions={reactions} />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 group select-none"
    >
      {/* Native Video Element with Subtitle Track */}
      <video
        ref={videoRef}
        poster={poster}
        playsInline
        preload="auto"
        className="w-full h-full object-contain cursor-pointer"
        onClick={handleCanvasClick}
      >
        {subtitleTrackUrl && (
          <track
            src={subtitleTrackUrl}
            kind="subtitles"
            srcLang="en"
            label="Subtitles"
            default
          />
        )}
      </video>

      {/* Floating Reactions Overlay */}
      <FloatingReactions reactions={reactions} />

      {/* Top Left: Sync Status Pill */}
      <div className="absolute top-4 left-4 z-30 pointer-events-auto transition-opacity duration-300">
        <SyncStatusBadge
          partnerName={partnerName}
          partnerStatus={partnerStatus}
          latencyMs={syncLatency}
          isPartnerBuffering={isPartnerBuffering}
          isConnected={true}
        />
      </div>

      {/* Resume from where you left off prompt */}
      {savedResumeTime && savedResumeTime > 15 && (
        <div className="absolute top-4 right-4 z-30 pointer-events-auto animate-fade-in">
          <div className="glass-pill px-3.5 py-2 rounded-xl border-cyan-500/40 bg-black/80 text-xs flex items-center gap-2.5 shadow-2xl">
            <History className="w-4 h-4 text-cyan-400" />
            <span>Resume from <b>{formatTime(savedResumeTime)}</b>?</span>
            <button
              onClick={onResumeSaved}
              className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-semibold transition"
            >
              Resume
            </button>
            <button
              onClick={onDismissResume}
              className="text-gray-400 hover:text-white text-[11px] ml-1"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Host Locked Notice Toast */}
      {showLockToast && (
        <div className="absolute top-4 inset-x-0 flex justify-center z-40 pointer-events-none transition-all animate-bounce">
          <div className="glass-pill px-4 py-2 rounded-xl border-amber-500/40 bg-black/80 text-amber-300 text-xs font-semibold flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
            <Lock className="w-4 h-4 text-amber-400" />
            <span>Playback is locked by the room host</span>
          </div>
        </div>
      )}

      {/* Buffering Overlay */}
      {(isBuffering || isPartnerBuffering) && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-20 pointer-events-none">
          <div className="flex flex-col items-center gap-3 glass-pill px-5 py-3 rounded-xl border-cyan-500/30">
            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
            <span className="text-sm font-medium text-cyan-200">
              {isPartnerBuffering ? `${partnerName} is buffering...` : 'Buffering...'}
            </span>
          </div>
        </div>
      )}

      {/* Center Big Play Button (When Paused) */}
      {!isPlaying && !isBuffering && (
        <div
          onClick={handleCanvasClick}
          className="absolute inset-0 flex items-center justify-center z-20 cursor-pointer bg-black/30 hover:bg-black/20 transition"
        >
          <div className="w-16 h-16 rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 backdrop-blur-md flex items-center justify-center text-cyan-300 shadow-[0_0_24px_rgba(0,242,254,0.3)] transition transform hover:scale-110">
            {canControl ? (
              <Play className="w-8 h-8 fill-current ml-1" />
            ) : (
              <Lock className="w-7 h-7 text-amber-300" />
            )}
          </div>
        </div>
      )}

      {/* Bottom Controls */}
      <div
        className={`transition-opacity duration-300 ${
          showControls || !isPlaying ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <PlayerControls
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          volume={movieVolume}
          isMuted={isMuted}
          isFullscreen={isFullscreen}
          playbackSpeed={playbackSpeed}
          canControl={canControl}
          controlMode={controlMode}
          onTogglePlay={onTogglePlay}
          onSeek={onSeek}
          onSpeedChange={onSpeedChange}
          onSubtitleTrackChange={setSubtitleTrackUrl}
          onVolumeChange={onMovieVolumeChange}
          onToggleMute={() => setIsMuted(!isMuted)}
          onToggleFullscreen={toggleFullscreen}
          onSkip={handleSkip}
        />
      </div>
    </div>
  );
}
