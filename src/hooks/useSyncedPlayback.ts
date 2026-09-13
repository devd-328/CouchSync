'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { PlaybackAction } from '@/types/sync';
import { SYNC_CONFIG } from '@/config/constants';

interface UseSyncedPlaybackOptions {
  userId: string;
  isHost: boolean;
  onBroadcastAction: (action: PlaybackAction) => void;
  videoSrc?: string;
}

export function useSyncedPlayback({
  userId,
  isHost,
  onBroadcastAction,
  videoSrc,
}: UseSyncedPlaybackOptions) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const broadcastActionRef = useRef(onBroadcastAction);
  broadcastActionRef.current = onBroadcastAction;

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const [isPartnerBuffering, setIsPartnerBuffering] = useState<boolean>(false);
  const [partnerStatus, setPartnerStatus] = useState<string>('Syncing...');
  const [syncLatency, setSyncLatency] = useState<number>(14);

  // Echo prevention lock
  const isHandlingRemoteAction = useRef<boolean>(false);

  // Reset playback position and duration when video source changes (e.g. choosing local file)
  const prevSrcRef = useRef(videoSrc);
  useEffect(() => {
    if (prevSrcRef.current !== videoSrc) {
      prevSrcRef.current = videoSrc;
      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(false);
      setIsBuffering(false);
      isHandlingRemoteAction.current = false;
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
      }
    }
  }, [videoSrc]);

  // 1. Play Handler
  const handleLocalPlay = useCallback(() => {
    setIsPlaying(true);
    if (isHandlingRemoteAction.current) return;
    if (!videoRef.current) return;

    const time = videoRef.current.currentTime;
    broadcastActionRef.current({
      type: 'play',
      time,
      senderId: userId,
      ts: Date.now(),
    });
  }, [userId]);

  // 2. Pause Handler
  const handleLocalPause = useCallback(() => {
    setIsPlaying(false);
    if (isHandlingRemoteAction.current) return;
    if (!videoRef.current) return;

    const time = videoRef.current.currentTime;
    broadcastActionRef.current({
      type: 'pause',
      time,
      senderId: userId,
      ts: Date.now(),
    });
  }, [userId]);

  // 3. Seek Handler
  const handleLocalSeek = useCallback((targetTime: number) => {
    if (!videoRef.current) return;

    isHandlingRemoteAction.current = false;
    videoRef.current.currentTime = targetTime;
    setCurrentTime(targetTime);

    broadcastActionRef.current({
      type: 'seek',
      time: targetTime,
      senderId: userId,
      ts: Date.now(),
    });
  }, [userId]);

  // 4. Synchronized Playback Speed Handler
  const handleLocalSpeed = useCallback((speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    broadcastActionRef.current({
      type: 'speed',
      speed,
      senderId: userId,
      ts: Date.now(),
    });
  }, [userId]);

  // 5. Buffering Handlers
  const handleLocalWaiting = useCallback(() => {
    if (isHandlingRemoteAction.current) return;
    setIsBuffering(true);
    broadcastActionRef.current({
      type: 'buffering',
      senderId: userId,
      ts: Date.now(),
    });
  }, [userId]);

  const handleLocalCanPlay = useCallback(() => {
    setIsBuffering(false);
    if (!videoRef.current) return;
    broadcastActionRef.current({
      type: 'ready',
      time: videoRef.current.currentTime,
      senderId: userId,
      ts: Date.now(),
    });
  }, [userId]);

  // 6. Incoming Remote Sync Event Dispatcher
  const handleRemoteAction = useCallback((action: PlaybackAction) => {
    if (action.senderId === userId) return;
    const video = videoRef.current;
    if (!video) return;

    const latency = Math.max(SYNC_CONFIG.MIN_LATENCY_MS, Date.now() - action.ts);
    setSyncLatency(latency);

    const tolerance = SYNC_CONFIG.DRIFT_TOLERANCE_SECONDS;

    switch (action.type) {
      case 'play': {
        isHandlingRemoteAction.current = true;
        if (Math.abs(video.currentTime - action.time) > tolerance) {
          video.currentTime = action.time;
        }
        video.play().catch(() => {});
        setIsPlaying(true);
        setPartnerStatus('In Sync');
        setTimeout(() => {
          isHandlingRemoteAction.current = false;
        }, SYNC_CONFIG.REMOTE_LOCKOUT_MS);
        break;
      }

      case 'pause': {
        isHandlingRemoteAction.current = true;
        if (Math.abs(video.currentTime - action.time) > tolerance) {
          video.currentTime = action.time;
        }
        video.pause();
        setIsPlaying(false);
        setPartnerStatus('Paused by partner');
        setTimeout(() => {
          isHandlingRemoteAction.current = false;
        }, SYNC_CONFIG.REMOTE_LOCKOUT_MS);
        break;
      }

      case 'seek': {
        isHandlingRemoteAction.current = true;
        video.currentTime = action.time;
        setCurrentTime(action.time);
        setPartnerStatus('Seeking in sync');
        setTimeout(() => {
          isHandlingRemoteAction.current = false;
        }, SYNC_CONFIG.REMOTE_LOCKOUT_MS);
        break;
      }

      case 'speed': {
        setPlaybackSpeed(action.speed);
        if (video) {
          video.playbackRate = action.speed;
        }
        setPartnerStatus(`Speed ${action.speed}x`);
        break;
      }

      case 'buffering': {
        setIsPartnerBuffering(true);
        setPartnerStatus('Partner buffering...');
        if (!video.paused) {
          isHandlingRemoteAction.current = true;
          video.pause();
          setTimeout(() => {
            isHandlingRemoteAction.current = false;
          }, 100);
        }
        break;
      }

      case 'ready': {
        setIsPartnerBuffering(false);
        setPartnerStatus('In Sync');
        if (Math.abs(video.currentTime - action.time) > tolerance) {
          video.currentTime = action.time;
        }
        if (isPlaying && video.paused) {
          isHandlingRemoteAction.current = true;
          video.play().catch(() => {});
          setTimeout(() => {
            isHandlingRemoteAction.current = false;
          }, SYNC_CONFIG.REMOTE_LOCKOUT_MS);
        }
        break;
      }

      case 'heartbeat': {
        if (Math.abs(video.currentTime - action.time) > tolerance) {
          isHandlingRemoteAction.current = true;
          video.currentTime = action.time;
          setTimeout(() => {
            isHandlingRemoteAction.current = false;
          }, SYNC_CONFIG.REMOTE_LOCKOUT_MS);
        }
        if (action.isPlaying && video.paused && !isPartnerBuffering) {
          video.play().catch(() => {});
          setIsPlaying(true);
        } else if (!action.isPlaying && !video.paused) {
          video.pause();
          setIsPlaying(false);
        }
        if (action.speed && Math.abs(video.playbackRate - action.speed) > 0.05) {
          video.playbackRate = action.speed;
          setPlaybackSpeed(action.speed);
        }
        setPartnerStatus('In Sync');
        break;
      }
    }
  }, [userId, isPlaying, isPartnerBuffering]);

  // Periodic heartbeat broadcast
  useEffect(() => {
    const heartbeatTimer = setInterval(() => {
      if (!videoRef.current) return;
      if (isHost || isPlaying) {
        broadcastActionRef.current({
          type: 'heartbeat',
          time: videoRef.current.currentTime,
          isPlaying: !videoRef.current.paused,
          speed: videoRef.current.playbackRate,
          senderId: userId,
          ts: Date.now(),
        });
      }
    }, SYNC_CONFIG.HEARTBEAT_INTERVAL_MS);

    return () => clearInterval(heartbeatTimer);
  }, [isHost, isPlaying, userId]);

  // Native video event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => {
      if (video) setCurrentTime(video.currentTime);
    };
    const onDurationChange = () => {
      if (video && isFinite(video.duration) && video.duration > 0) {
        setDuration(video.duration);
      }
    };
    const onLoadedMetadata = () => {
      if (video) {
        if (isFinite(video.duration) && video.duration > 0) {
          setDuration(video.duration);
        }
        setCurrentTime(video.currentTime || 0);
      }
    };
    const onPlaying = () => {
      setIsPlaying(true);
      setIsBuffering(false);
    };
    const onEnded = () => setIsPlaying(false);

    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('durationchange', onDurationChange);
    video.addEventListener('loadedmetadata', onLoadedMetadata);
    video.addEventListener('playing', onPlaying);
    video.addEventListener('ended', onEnded);
    video.addEventListener('play', handleLocalPlay);
    video.addEventListener('pause', handleLocalPause);
    video.addEventListener('waiting', handleLocalWaiting);
    video.addEventListener('canplay', handleLocalCanPlay);

    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('durationchange', onDurationChange);
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      video.removeEventListener('playing', onPlaying);
      video.removeEventListener('ended', onEnded);
      video.removeEventListener('play', handleLocalPlay);
      video.removeEventListener('pause', handleLocalPause);
      video.removeEventListener('waiting', handleLocalWaiting);
      video.removeEventListener('canplay', handleLocalCanPlay);
    };
  }, [handleLocalPlay, handleLocalPause, handleLocalWaiting, handleLocalCanPlay]);

  return {
    videoRef,
    isPlaying,
    currentTime,
    duration,
    playbackSpeed,
    isBuffering,
    isPartnerBuffering,
    partnerStatus,
    syncLatency,
    seekTo: handleLocalSeek,
    setPlaybackSpeed: handleLocalSpeed,
    togglePlayPause: () => {
      const video = videoRef.current;
      if (!video) return;
      if (video.paused) {
        video.play().catch(() => {});
        setIsPlaying(true);
      } else {
        video.pause();
        setIsPlaying(false);
      }
    },
    handleRemoteAction,
  };
}
