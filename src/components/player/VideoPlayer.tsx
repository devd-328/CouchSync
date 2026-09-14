'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Hls from 'hls.js';
import { Play, Loader2, Lock, History, MicOff, FolderOpen, Upload } from 'lucide-react';
import { PlayerControls } from './PlayerControls';
import { SyncStatusBadge } from './SyncStatusBadge';
import { FloatingReactions } from '../reactions/FloatingReactions';
import { FloatingChatOverlay, FloatingChatMessage } from '../chat/FloatingChatOverlay';
import { FloatingEmoji, ControlMode, MediaSourceType, PlaybackAction, TriviaAction, RoomParticipant } from '@/types/sync';
import { formatTime } from '@/lib/formatters';
import { YouTubePlayer } from './YouTubePlayer';
import { ScreenSharePlayer } from './ScreenSharePlayer';
import { MovieTrivia } from '../games/MovieTrivia';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  videoTitle?: string;
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
  floatingChatMessages?: FloatingChatMessage[];
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
  participants?: RoomParticipant[];
  remoteStreams?: Map<string, MediaStream>;
  speakingPeers?: Set<string>;
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
  onOpenSelectMovie?: () => void;
  onSelectLocalFile?: (file: File) => void;
}

function CornerPipBubbles({
  participants,
  currentUserId,
  remoteStreams,
  speakingPeers,
}: {
  participants: RoomParticipant[];
  currentUserId: string;
  remoteStreams: Map<string, MediaStream>;
  speakingPeers: Set<string>;
}) {
  const remotePeers = participants.filter((p) => p.id !== currentUserId);
  if (remotePeers.length === 0) return null;

  return (
    <div className="absolute top-4 right-4 z-30 flex items-center gap-2 pointer-events-none">
      {remotePeers.map((peer) => {
        const stream = remoteStreams.get(peer.id);
        const isSpeaking = speakingPeers.has(peer.id);
        return (
          <div
            key={peer.id}
            className={`relative w-22 h-16 rounded-xl overflow-hidden glass-panel border shadow-2xl bg-black/85 transition-all ${
              isSpeaking
                ? 'speaking-border border-cyan-400 shadow-[0_0_16px_rgba(0,242,254,0.6)]'
                : 'border-white/20'
            }`}
          >
            {stream && peer.isCamOn ? (
              <video
                autoPlay
                playsInline
                ref={(el) => {
                  if (el && stream) el.srcObject = stream;
                }}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950/90">
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-[10px] font-bold text-cyan-300">
                  {peer.name.charAt(0).toUpperCase()}
                </div>
              </div>
            )}
            <div className="absolute bottom-0.5 inset-x-0.5 px-1 py-0.5 rounded bg-black/70 backdrop-blur-xs flex items-center justify-between">
              <span className="text-[9px] font-semibold text-gray-200 truncate">{peer.name}</span>
              {!peer.isMicOn && <MicOff className="w-2.5 h-2.5 text-rose-400 shrink-0" />}
            </div>
          </div>
        );
      })}
    </div>
  );
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
  floatingChatMessages = [],
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
  participants = [],
  remoteStreams = new Map(),
  speakingPeers = new Set(),
  isHost = false,
  remotePlaybackAction = null,
  remoteTriviaAction = null,
  videoTitle,
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
  onOpenSelectMovie,
  onSelectLocalFile,
}: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showLockToast, setShowLockToast] = useState(false);
  const [subtitleTrackUrl, setSubtitleTrackUrl] = useState<string | null>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  // Brief fade when switching media source types (250ms)
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prevSourceRef = useRef<MediaSourceType>(mediaSource);

  const hideControlsTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lockToastTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handlePlayerDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (canControl) {
      setIsDraggingFile(true);
    }
  }, [canControl]);

  const handlePlayerDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFile(false);
  }, []);

  const handlePlayerDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFile(false);
    if (!canControl) return;

    const file = e.dataTransfer.files?.[0];
    if (file && (file.type.startsWith('video/') || /\.(mp4|mkv|webm)$/i.test(file.name))) {
      if (onSelectLocalFile) {
        onSelectLocalFile(file);
      }
    }
  }, [canControl, onSelectLocalFile]);

  // Sync fullscreen state with document events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Sync movie volume with video element
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = isMuted ? 0 : movieVolume;
    }
  }, [movieVolume, isMuted, videoRef]);

  // Cross-fade when media source type changes
  useEffect(() => {
    if (prevSourceRef.current !== mediaSource) {
      prevSourceRef.current = mediaSource;
      setIsTransitioning(true);
      const t = setTimeout(() => setIsTransitioning(false), 250);
      return () => clearTimeout(t);
    }
  }, [mediaSource]);

  const hlsRef = useRef<Hls | null>(null);

  // HLS.js and Direct Video initialization
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    // Clean up previous HLS instance cleanly
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (src.includes('.m3u8')) {
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 60,
        });
        hlsRef.current = hls;
        hls.loadSource(src);
        hls.attachMedia(video);
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
        video.load();
      }
    } else {
      // Local Blob URL or direct MP4/WebM
      video.srcObject = null;
      video.src = src;
      video.load();
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
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

  return (
    <div
      ref={containerRef}
      id="theater-container"
      onMouseMove={handleMouseMove}
      onDragOver={handlePlayerDragOver}
      onDragLeave={handlePlayerDragLeave}
      onDrop={handlePlayerDrop}
      className={`relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 group select-none transition-opacity duration-250 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
    >
      {/* 1. YouTube Party Mode */}
      {mediaSource === 'youtube' && (
        <YouTubePlayer
          videoId={youtubeVideoId}
          videoTitle={youtubeVideoTitle}
          canControlPlayback={canControl}
          controlMode={controlMode}
          isFullscreen={isFullscreen}
          onSendAction={onSendPlaybackAction || (() => {})}
          remoteAction={remotePlaybackAction}
          onChangeVideo={onChangeYouTubeVideo || (() => {})}
          onToggleFullscreen={toggleFullscreen}
        />
      )}

      {/* 2. Screen Share Mode */}
      {mediaSource === 'screenshare' && (
        <ScreenSharePlayer
          stream={screenStream}
          presenterName={screenPresenterName}
          isLocalPresenter={isLocalScreenPresenter}
          onStopShare={onStopScreenShare || (() => {})}
        />
      )}

      {/* 3. Movie Trivia Mode */}
      {mediaSource === 'trivia' && (
        <MovieTrivia
          currentUserId={currentUserId}
          currentUserName={currentUserName}
          isHost={isHost}
          onSendTriviaAction={onSendTriviaAction || (() => {})}
          remoteTriviaAction={remoteTriviaAction}
          onCloseTrivia={onCloseTrivia || (() => {})}
        />
      )}

      {/* 4. Native HLS / Local File Player Mode */}
      {mediaSource === 'hls' && (
        <>
          {/* Interactive Drag & Drop Overlay */}
          {isDraggingFile && (
            <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 border-3 border-dashed border-cyan-400 animate-in fade-in zoom-in-95 duration-150 pointer-events-none">
              <div className="w-18 h-18 rounded-3xl bg-cyan-500/25 border border-cyan-400 flex items-center justify-center text-cyan-300 shadow-[0_0_30px_rgba(0,242,254,0.5)] mb-4">
                <Upload className="w-9 h-9 animate-bounce" />
              </div>
              <h3 className="text-xl font-bold text-white text-center">
                Drop Movie File Here to Play
              </h3>
              <p className="text-xs text-cyan-200 mt-1.5 text-center max-w-sm">
                Instant playback directly from your PC with zero upload time and $0 cloud cost
              </p>
              <span className="mt-3 text-[10px] font-mono px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                Supports .mp4 • .mkv • .webm
              </span>
            </div>
          )}

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
        </>
      )}

      {/* Floating Reactions Overlay (Universal) */}
      <FloatingReactions reactions={reactions} />

      {/* Floating Chat Overlay in Fullscreen (Universal) */}
      <FloatingChatOverlay messages={floatingChatMessages} isVisible={isFullscreen} />

      {/* Corner Picture-in-Picture Video Bubbles in Fullscreen (Universal) */}
      {isFullscreen && (
        <CornerPipBubbles
          participants={participants}
          currentUserId={currentUserId}
          remoteStreams={remoteStreams}
          speakingPeers={speakingPeers}
        />
      )}

      {/* HLS-only Overlays & Controls */}
      {mediaSource === 'hls' && (
        <>
          {/* Top Left: Sync Status Pill & Movie Quick Switch */}
          <div className="absolute top-4 left-4 z-30 pointer-events-auto flex items-center gap-2 transition-opacity duration-300">
            <SyncStatusBadge
              partnerName={partnerName}
              partnerStatus={partnerStatus}
              latencyMs={syncLatency}
              isPartnerBuffering={isPartnerBuffering}
              isConnected={participants.some((p) => p.id !== currentUserId)}
            />
            {onOpenSelectMovie && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenSelectMovie();
                }}
                className={`glass-pill px-3 py-1.5 rounded-xl border border-white/15 hover:border-cyan-400/50 bg-black/60 hover:bg-black/80 text-xs text-gray-200 hover:text-cyan-200 flex items-center gap-2 transition shadow-lg cursor-pointer ${
                  showControls || !isPlaying ? 'opacity-100' : 'opacity-0 hover:opacity-100'
                }`}
                title="Click to select or upload a different movie from PC"
              >
                <FolderOpen className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="font-semibold max-w-[120px] sm:max-w-[180px] truncate">{videoTitle || 'Movie'}</span>
                <span className="text-[10px] text-cyan-300 font-bold bg-cyan-500/20 px-1.5 py-0.5 rounded border border-cyan-400/30">
                  Change
                </span>
              </button>
            )}
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
          {!isPlaying && !isBuffering && (!videoRef.current || videoRef.current.paused) && (
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
              onOpenSelectMovie={onOpenSelectMovie}
            />
          </div>
        </>
      )}
    </div>
  );
}
