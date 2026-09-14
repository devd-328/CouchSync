'use client';

import React, { useState, useEffect, useRef, use, useMemo, useCallback } from 'react';
import { MessageSquare, Users, BarChart3, ChevronUp, X } from 'lucide-react';
import { VideoPlayer } from '@/components/player/VideoPlayer';
import { WebRTCCall } from '@/components/video-call/WebRTCCall';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { DualVolumeMixer } from '@/components/controls/DualVolumeMixer';
import { RoomHeader } from '@/components/room/RoomHeader';
import { VideoSettingsModal } from '@/components/room/VideoSettingsModal';
import { RoomSettingsModal } from '@/components/room/RoomSettingsModal';
import { RoomPollComponent } from '@/components/room/RoomPoll';
import { FloatingChatMessage } from '@/components/chat/FloatingChatOverlay';
import { useSyncedPlayback } from '@/hooks/useSyncedPlayback';
import { useWebRTC } from '@/hooks/useWebRTC';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { subscribeToRoom, ChannelSubscription } from '@/lib/sync-channel';
import { loadUserSession, isValidNickname, saveUserSession } from '@/lib/session';
import { DEFAULT_VIDEO } from '@/lib/sample-media';
import { formatClockTime, generateId } from '@/lib/formatters';
import { AUDIO_CONFIG, STORAGE_KEYS } from '@/config/constants';
import { DeviceCheckModal } from '@/components/lobby/DeviceCheckModal';
import {
  RoomParticipant,
  ChatMessage,
  FloatingEmoji,
  PlaybackAction,
  WebRTCSignalAction,
  SyncMessage,
  VideoMedia,
  ControlMode,
  ThemeMode,
  RoomPoll,
  MediaSourceType,
  RoomLayoutMode,
  TriviaAction,
} from '@/types/sync';

export default function RoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = use(params);

  // Initialize session state with SSR-safe defaults, then sync on mount to prevent hydration mismatch
  const [isMounted, setIsMounted] = useState(false);
  const [currentUser, setCurrentUser] = useState<RoomParticipant>(() => ({
    id: generateId('user'),
    name: '',
    isHost: false,
    isMicOn: true,
    isCamOn: true,
  }));
  const [hasValidName, setHasValidName] = useState(false);
  const [roomName, setRoomName] = useState('Cosmic Nights');
  const [currentVideo, setCurrentVideo] = useState<VideoMedia>(DEFAULT_VIDEO);

  // Sync session and hints on mount (prevents SSR / client hydration mismatches)
  useEffect(() => {
    setIsMounted(true);
    const session = loadUserSession();
    if (session.roomName) setRoomName(session.roomName);
    if (session.video) setCurrentVideo(session.video);
    if (session.userName && isValidNickname(session.userName)) {
      setCurrentUser((prev) => ({
        ...prev,
        name: session.userName,
        isHost: session.isHost,
        isMicOn: !session.isMicMuted,
        isCamOn: !session.isCamOff,
      }));
      setHasValidName(true);
    }
    const dismissed = new Set<string>();
    [
      STORAGE_KEYS.HINT_CHAT,
      STORAGE_KEYS.HINT_REACTIONS,
      STORAGE_KEYS.HINT_TRIVIA,
      STORAGE_KEYS.HINT_VOLUME,
    ].forEach((key) => {
      if (localStorage.getItem(key) === 'dismissed') dismissed.add(key);
    });
    setDismissedHints(dismissed);
  }, []);
  const [controlMode, setControlMode] = useState<ControlMode>('shared');
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>('obsidian');
  const [mediaSource, setMediaSource] = useState<MediaSourceType>('hls');
  const [youtubeVideoId, setYoutubeVideoId] = useState('M7lc1UVf-VE');
  const [youtubeVideoTitle, setYoutubeVideoTitle] = useState('YouTube Watch Party');
  const [roomLayout, setRoomLayout] = useState<RoomLayoutMode>('cinema');
  const [screenPresenterId, setScreenPresenterId] = useState<string | null>(null);
  const [screenPresenterName, setScreenPresenterName] = useState<string>('Presenter');
  const [remoteTriviaAction, setRemoteTriviaAction] = useState<TriviaAction | null>(null);
  const [remotePlaybackAction, setRemotePlaybackAction] = useState<PlaybackAction | null>(null);

  const [participants, setParticipants] = useState<RoomParticipant[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [floatingChatMessages, setFloatingChatMessages] = useState<FloatingChatMessage[]>([]);
  const [floatingReactions, setFloatingReactions] = useState<FloatingEmoji[]>([]);
  const [activePoll, setActivePoll] = useState<RoomPoll | null>(null);
  type SidebarTab = 'call' | 'chat' | 'poll';
  const [activeSidebarTab, setActiveSidebarTab] = useState<SidebarTab>('call');
  const [unreadChatCount, setUnreadChatCount] = useState<number>(0);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const activeSidebarTabRef = useRef<SidebarTab>('call');
  activeSidebarTabRef.current = activeSidebarTab;
  const isMobileDrawerOpenRef = useRef<boolean>(false);
  isMobileDrawerOpenRef.current = isMobileDrawerOpen;

  const handleSelectSidebarTab = (tab: SidebarTab) => {
    setActiveSidebarTab(tab);
    if (tab === 'chat') {
      setUnreadChatCount(0);
    }
  };

  const handleOpenMobileDrawer = (tab?: SidebarTab) => {
    if (tab) {
      handleSelectSidebarTab(tab);
    }
    setIsMobileDrawerOpen(true);
  };

  // Resume playback feature
  const [savedResumeTime, setSavedResumeTime] = useState<number | null>(null);

  // Volume, Audio Ducking & Push-to-Talk
  const [movieVolume, setMovieVolume] = useState(AUDIO_CONFIG.DEFAULT_MOVIE_VOLUME);
  const [partnerVoiceVolume, setPartnerVoiceVolume] = useState(AUDIO_CONFIG.DEFAULT_PARTNER_VOLUME);
  const [isAudioDuckingEnabled, setIsAudioDuckingEnabled] = useState(true);
  const [isPushToTalkActive, setIsPushToTalkActive] = useState(false);
  const [showMoviePickerModal, setShowMoviePickerModal] = useState(false);
  const [showRoomSettingsModal, setShowRoomSettingsModal] = useState(false);
  const [showDeviceCheckModal, setShowDeviceCheckModal] = useState(false);

  // In-room first-use hints — tracked per-hint in localStorage (hydrated in useEffect)
  const [dismissedHints, setDismissedHints] = useState<Set<string>>(() => new Set());

  const dismissHint = (key: string) => {
    if (typeof window !== 'undefined') localStorage.setItem(key, 'dismissed');
    setDismissedHints((prev) => new Set([...prev, key]));
  };

  // Channel reference
  const channelRef = useRef<ChannelSubscription | null>(null);

  const broadcastMessage = useCallback((msg: SyncMessage) => {
    channelRef.current?.sendMessage(msg);
  }, []);

  // 1. Synchronized Playback Hook
  const {
    videoRef,
    isPlaying,
    currentTime,
    duration,
    playbackSpeed,
    isBuffering,
    isPartnerBuffering,
    partnerStatus,
    syncLatency,
    seekTo,
    setPlaybackSpeed,
    togglePlayPause,
    handleRemoteAction,
  } = useSyncedPlayback({
    userId: currentUser.id,
    isHost: currentUser.isHost,
    onBroadcastAction: broadcastMessage,
    videoSrc: currentVideo.src,
  });

  // 2. WebRTC Call Hook
  const {
    localStream,
    remoteStreams,
    remoteStream,
    screenStream,
    remoteScreenStream,
    isScreenSharing,
    startScreenShare,
    stopScreenShare,
    isMicMuted,
    isCamOff,
    partnerMicMuted,
    partnerCamOff,
    partnerMediaStates,
    speakingPeers,
    isPartnerSpeaking,
    initiateCall,
    syncMeshPeers,
    handleRemoteSignal,
    toggleMic,
    toggleCamera,
  } = useWebRTC({
    userId: currentUser.id,
    onSendSignal: broadcastMessage,
  });

  // Read initialMode from URL search param on mount (e.g. ?initialMode=youtube)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sp = new URLSearchParams(window.location.search);
      const initMode = sp.get('initialMode') as MediaSourceType | null;
      if (initMode && ['hls', 'youtube', 'screenshare', 'trivia'].includes(initMode)) {
        setMediaSource(initMode);
      }
    }
  }, []);

  // Partner detection
  const partner = participants.find((p) => p.id !== currentUser.id);

  // Determine if local user has permission to control playback
  const canControl = currentUser.isHost || controlMode === 'shared';

  const handleToggleControlMode = () => {
    if (!currentUser.isHost) return;
    const nextMode: ControlMode = controlMode === 'shared' ? 'host-only' : 'shared';
    setControlMode(nextMode);
    broadcastMessage({
      type: 'control-mode-change',
      mode: nextMode,
      senderId: currentUser.id,
    });
  };

  const handleSelectSource = (source: MediaSourceType) => {
    setMediaSource(source);
    broadcastMessage({
      type: 'media-source-change',
      source,
      senderId: currentUser.id,
    });
  };

  const handleChangeYouTubeVideo = (id: string, title?: string) => {
    setYoutubeVideoId(id);
    if (title) setYoutubeVideoTitle(title);
    setMediaSource('youtube');
    broadcastMessage({
      type: 'media-source-change',
      source: 'youtube',
      youtubeId: id,
      youtubeTitle: title || 'YouTube Video',
      senderId: currentUser.id,
    });
  };

  const handleToggleScreenShare = async () => {
    if (isScreenSharing) {
      stopScreenShare();
      setMediaSource('hls');
      setScreenPresenterId(null);
      broadcastMessage({
        type: 'screenshare-stop',
        presenterId: currentUser.id,
      });
    } else {
      const stream = await startScreenShare();
      if (stream) {
        setMediaSource('screenshare');
        setScreenPresenterId(currentUser.id);
        setScreenPresenterName(currentUser.name);
        broadcastMessage({
          type: 'screenshare-start',
          presenterId: currentUser.id,
          presenterName: currentUser.name,
        });
      }
    }
  };

  const handleSendTriviaAction = (action: TriviaAction) => {
    broadcastMessage(action);
  };

  // 3. Resume Timestamp Continuity (Save progress periodically per video in the room)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    setSavedResumeTime(null);

    const videoKey = currentVideo.id || 'default';
    try {
      const saved = localStorage.getItem(`couchsync_resume_${roomId}_${videoKey}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.time && parsed.time > 15) {
          setSavedResumeTime(parsed.time);
        }
      }
    } catch {
      // ignore
    }
  }, [roomId, currentVideo.id]);

  useEffect(() => {
    if (typeof window === 'undefined' || currentTime < 5) return;
    const videoKey = currentVideo.id || 'default';
    const timer = setTimeout(() => {
      localStorage.setItem(
        `couchsync_resume_${roomId}_${videoKey}`,
        JSON.stringify({ time: currentTime, ts: Date.now() })
      );
    }, 3000);
    return () => clearTimeout(timer);
  }, [currentTime, roomId, currentVideo.id]);

  const handleResumeSaved = () => {
    if (savedResumeTime) {
      seekTo(savedResumeTime);
      setSavedResumeTime(null);
    }
  };

  // 4. Global Keyboard Shortcuts & Push-to-Talk
  useKeyboardShortcuts({
    isEnabled: true,
    isPushToTalkActive,
    onTogglePlay: () => canControl && togglePlayPause(),
    onToggleFullscreen: () => {
      if (!document.fullscreenElement && videoRef.current) {
        videoRef.current.requestFullscreen().catch(() => {});
      } else if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    },
    onToggleMic: toggleMic,
    onToggleCam: toggleCamera,
    onSeekRelative: (delta) => {
      if (canControl) {
        seekTo(Math.max(0, Math.min(duration, currentTime + delta)));
      }
    },
    onAdjustVolume: (delta) => {
      setMovieVolume((prev) => Math.max(0, Math.min(1, parseFloat((prev + delta).toFixed(2)))));
    },
    onPushToTalkDown: () => {
      if (isMicMuted) toggleMic(); // Unmute while key held
    },
    onPushToTalkUp: () => {
      if (!isMicMuted) toggleMic(); // Mute on key release
    },
  });

  // 5. Stable Room Subscription
  useEffect(() => {
    if (!hasValidName || !currentUser.name) return;
    const sub = subscribeToRoom(
      roomId,
      currentUser,
      (msg: SyncMessage) => {
        if (
          msg.type === 'play' ||
          msg.type === 'pause' ||
          msg.type === 'seek' ||
          msg.type === 'speed' ||
          msg.type === 'buffering' ||
          msg.type === 'ready' ||
          msg.type === 'heartbeat'
        ) {
          handleRemoteAction(msg as PlaybackAction);
          setRemotePlaybackAction(msg as PlaybackAction);
        } else if (msg.type === 'media-source-change') {
          setMediaSource(msg.source);
          if (msg.youtubeId) setYoutubeVideoId(msg.youtubeId);
          if (msg.youtubeTitle) setYoutubeVideoTitle(msg.youtubeTitle);
        } else if (msg.type === 'screenshare-start') {
          setMediaSource('screenshare');
          setScreenPresenterId(msg.presenterId);
          setScreenPresenterName(msg.presenterName);
        } else if (msg.type === 'screenshare-stop') {
          setMediaSource('hls');
          setScreenPresenterId(null);
        } else if (msg.type.startsWith('trivia-')) {
          setRemoteTriviaAction(msg as TriviaAction);
          if (msg.type === 'trivia-start') setMediaSource('trivia');
          if (msg.type === 'trivia-end') setMediaSource('hls');
        } else if (msg.type === 'control-mode-change') {
          setControlMode(msg.mode);
        } else if (msg.type === 'poll-create') {
          setActivePoll(msg.poll);
        } else if (msg.type === 'poll-vote') {
          setActivePoll((prev) => {
            if (!prev || prev.id !== msg.pollId) return prev;
            return {
              ...prev,
              votes: { ...prev.votes, [msg.userId]: msg.optionIndex },
            };
          });
        } else if (msg.type === 'poll-close') {
          setActivePoll((prev) => (prev && prev.id === msg.pollId ? { ...prev, isActive: false } : prev));
        } else if (msg.type.startsWith('signal-') || msg.type === 'media-toggle') {
          handleRemoteSignal(msg as WebRTCSignalAction);
        } else if (msg.type === 'chat-message') {
          const formattedTime = formatClockTime(msg.ts);
          if (msg.senderId !== currentUser.id) {
            if (
              activeSidebarTabRef.current !== 'chat' ||
              (typeof window !== 'undefined' && window.innerWidth < 768 && !isMobileDrawerOpenRef.current)
            ) {
              setUnreadChatCount((prev) => prev + 1);
            }
          }
          setChatMessages((prev) => [
            ...prev,
            {
              id: msg.id,
              senderId: msg.senderId,
              senderName: msg.senderName,
              text: msg.text,
              timestamp: formattedTime,
              isSelf: msg.senderId === currentUser.id,
              jumpTime: msg.jumpTime,
            },
          ]);
          setFloatingChatMessages((prev) => [
            ...prev.slice(-3),
            {
              id: msg.id,
              senderName: msg.senderName,
              text: msg.text,
              timestamp: formattedTime,
              isSelf: msg.senderId === currentUser.id,
            },
          ]);
          setTimeout(() => {
            setFloatingChatMessages((prev) => prev.filter((item) => item.id !== msg.id));
          }, 5000);
        } else if (msg.type === 'emoji-reaction') {
          addFloatingReaction(msg.emoji);
        }
      },
      (activeMembers) => {
        setParticipants(activeMembers);
        syncMeshPeers(activeMembers);
      }
    );

    channelRef.current = sub;

    return () => {
      sub.unsubscribe();
    };
  }, [roomId, currentUser, handleRemoteAction, handleRemoteSignal, initiateCall, syncMeshPeers, hasValidName]);

  // Floating Reaction Manager
  const addFloatingReaction = (emoji: string) => {
    const id = generateId('emoji');
    const xOffset = 20 + Math.random() * 60;
    setFloatingReactions((prev) => [...prev, { id, emoji, xOffset }]);
    setTimeout(() => {
      setFloatingReactions((prev) => prev.filter((item) => item.id !== id));
    }, 2800);
  };

  const handleSendChat = (text: string, jumpTime?: number) => {
    const now = Date.now();
    const id = generateId('msg');
    const formattedTime = formatClockTime(now);

    broadcastMessage({
      type: 'chat-message',
      id,
      senderId: currentUser.id,
      senderName: currentUser.name,
      text,
      ts: now,
      jumpTime,
    });

    setChatMessages((prev) => [
      ...prev,
      {
        id,
        senderId: currentUser.id,
        senderName: currentUser.name,
        text,
        timestamp: formattedTime,
        isSelf: true,
        jumpTime,
      },
    ]);

    setFloatingChatMessages((prev) => [
      ...prev.slice(-3),
      {
        id,
        senderName: currentUser.name,
        text,
        timestamp: formattedTime,
        isSelf: true,
      },
    ]);
    setTimeout(() => {
      setFloatingChatMessages((prev) => prev.filter((item) => item.id !== id));
    }, 5000);
  };

  const handleReactWithEmoji = (emoji: string) => {
    addFloatingReaction(emoji);
    broadcastMessage({
      type: 'emoji-reaction',
      emoji,
      senderId: currentUser.id,
      senderName: currentUser.name,
      ts: Date.now(),
    });
  };

  // Poll handlers
  const handleBroadcastPollCreate = (poll: RoomPoll) => {
    setActivePoll(poll);
    broadcastMessage({ type: 'poll-create', poll });
  };

  const handleBroadcastVote = (pollId: string, optionIndex: number) => {
    setActivePoll((prev) => {
      if (!prev || prev.id !== pollId) return prev;
      return {
        ...prev,
        votes: { ...prev.votes, [currentUser.id]: optionIndex },
      };
    });
    broadcastMessage({ type: 'poll-vote', pollId, optionIndex, userId: currentUser.id });
  };

  const handleBroadcastClosePoll = (pollId: string) => {
    setActivePoll((prev) => (prev && prev.id === pollId ? { ...prev, isActive: false } : prev));
    broadcastMessage({ type: 'poll-close', pollId });
  };

  const handleLocalFileSelect = (file: File) => {
    const blobUrl = URL.createObjectURL(file);
    const newVideo: VideoMedia = {
      id: `local-${Date.now()}`,
      title: file.name,
      src: blobUrl,
      poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&auto=format&fit=crop&q=80',
      category: 'Local Movie File',
      isLocalFile: true,
    };
    setCurrentVideo(newVideo);
    if (mediaSource !== 'hls') {
      handleSelectSource('hls');
    }
  };

  const handleUpdateUserName = (newName: string) => {
    const updatedUser = { ...currentUser, name: newName };
    setCurrentUser(updatedUser);
    saveUserSession({ userName: newName });
    setParticipants((prev) =>
      prev.map((p) => (p.id === currentUser.id ? { ...p, name: newName } : p))
    );
    channelRef.current?.updatePresence(updatedUser);
  };

  // Smart Audio Ducking calculation
  const effectiveMovieVolume =
    isAudioDuckingEnabled && isPartnerSpeaking
      ? movieVolume * AUDIO_CONFIG.DUCKING_MULTIPLIER
      : movieVolume;

  return (
    <div className={`min-h-screen theme-${currentTheme} flex flex-col justify-between p-3 sm:p-4 lg:p-5 pb-18 md:pb-5 overflow-x-hidden text-gray-100 transition-colors duration-500`}>
      {/* Modular Header with Host Controls & Theme Selector */}
      <RoomHeader
        roomName={roomName}
        roomId={roomId}
        participantsCount={participants.length}
        isHost={currentUser.isHost}
        controlMode={controlMode}
        currentTheme={currentTheme}
        currentSource={mediaSource}
        currentLayout={roomLayout}
        isScreenSharing={isScreenSharing}
        onToggleControlMode={handleToggleControlMode}
        onSelectTheme={setCurrentTheme}
        onSelectSource={handleSelectSource}
        onSelectLayout={setRoomLayout}
        onToggleScreenShare={handleToggleScreenShare}
        onOpenSettings={() => setShowRoomSettingsModal(true)}
        onOpenSelectMovie={() => setShowMoviePickerModal(true)}
      />

      {/* Main Theater Layout */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 my-2.5 min-h-0 items-start lg:items-stretch">
        {/* Left: Video Canvas + Bottom Master Controls (~65-70% width) */}
        <section className={`${roomLayout === 'focus' ? 'col-span-12' : 'col-span-12 lg:col-span-8 xl:col-span-8'} flex flex-col gap-2.5 min-w-0`}>
          <VideoPlayer
            src={currentVideo.src}
            poster={currentVideo.poster}
            videoTitle={currentVideo.title}
            videoRef={videoRef}
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            playbackSpeed={playbackSpeed}
            isBuffering={isBuffering}
            isPartnerBuffering={isPartnerBuffering}
            partnerStatus={partnerStatus}
            partnerName={partner?.name || 'Partner'}
            syncLatency={syncLatency}
            reactions={floatingReactions}
            floatingChatMessages={floatingChatMessages}
            participants={participants}
            remoteStreams={remoteStreams}
            speakingPeers={speakingPeers}
            movieVolume={effectiveMovieVolume}
            canControl={canControl}
            controlMode={controlMode}
            savedResumeTime={savedResumeTime}
            mediaSource={mediaSource}
            youtubeVideoId={youtubeVideoId}
            youtubeVideoTitle={youtubeVideoTitle}
            screenStream={isScreenSharing ? screenStream : remoteScreenStream}
            screenPresenterName={screenPresenterName}
            isLocalScreenPresenter={isScreenSharing}
            currentUserId={currentUser.id}
            currentUserName={currentUser.name}
            isHost={currentUser.isHost}
            remotePlaybackAction={remotePlaybackAction}
            remoteTriviaAction={remoteTriviaAction}
            onTogglePlay={togglePlayPause}
            onSeek={seekTo}
            onSpeedChange={setPlaybackSpeed}
            onMovieVolumeChange={setMovieVolume}
            onResumeSaved={handleResumeSaved}
            onDismissResume={() => setSavedResumeTime(null)}
            onStopScreenShare={handleToggleScreenShare}
            onSendPlaybackAction={broadcastMessage}
            onChangeYouTubeVideo={handleChangeYouTubeVideo}
            onSendTriviaAction={handleSendTriviaAction}
            onCloseTrivia={() => handleSelectSource('hls')}
            onOpenSelectMovie={() => setShowMoviePickerModal(true)}
            onSelectLocalFile={handleLocalFileSelect}
          />

          {/* Dual Volume Mixer + Volume Mixer Hint */}
          {isMounted && !dismissedHints.has(STORAGE_KEYS.HINT_VOLUME) && (
            <div className="flex items-start gap-2 px-3 py-2 rounded-xl bg-white/4 border border-white/8 text-[11px] text-gray-400">
              <span className="text-base leading-none mt-0.5" aria-hidden>🎚️</span>
              <span className="flex-1">Adjust movie &amp; voice volumes independently — audio ducks automatically when someone speaks.</span>
              <button
                onClick={() => dismissHint(STORAGE_KEYS.HINT_VOLUME)}
                aria-label="Dismiss volume mixer tip"
                className="text-gray-500 hover:text-gray-300 transition ml-1 shrink-0"
              >✕</button>
            </div>
          )}
          <DualVolumeMixer
            movieVolume={movieVolume}
            partnerVoiceVolume={partnerVoiceVolume}
            isMicMuted={isMicMuted}
            isCamOff={isCamOff}
            partnerName={partner?.name || 'Partner'}
            isAudioDuckingEnabled={isAudioDuckingEnabled}
            isPushToTalkActive={isPushToTalkActive}
            participantsCount={Math.max(1, participants.length)}
            onMovieVolumeChange={setMovieVolume}
            onPartnerVolumeChange={setPartnerVoiceVolume}
            onToggleMic={toggleMic}
            onToggleCam={toggleCamera}
            onToggleAudioDucking={() => setIsAudioDuckingEnabled(!isAudioDuckingEnabled)}
            onTogglePushToTalk={() => setIsPushToTalkActive(!isPushToTalkActive)}
            onOpenSettings={() => setShowRoomSettingsModal(true)}
          />
        </section>

        {/* Right Sidebar: Tabbed on desktop (~30-35% width), panel on tablet, bottom drawer on mobile (<768px) */}
        {roomLayout !== 'focus' && (
          <>
            {/* Mobile Drawer Backdrop (Mobile only) */}
            {isMobileDrawerOpen && (
              <div
                onClick={() => setIsMobileDrawerOpen(false)}
                className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 md:hidden animate-in fade-in duration-200"
                aria-label="Close drawer"
              />
            )}

            {/* Sidebar / Bottom Sheet Panel */}
            <aside
              className={`${
                isMobileDrawerOpen
                  ? 'fixed inset-x-0 bottom-0 z-50 h-[75vh] max-h-[75vh] sm:h-[80vh] rounded-t-3xl glass-panel border-t border-white/20 bg-slate-950/95 p-3 flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300'
                  : 'hidden md:flex'
              } md:col-span-12 lg:col-span-4 xl:col-span-4 flex-col gap-2 min-w-0 lg:h-full lg:max-h-[calc(100vh-125px)]`}
            >
              {/* Mobile Drawer Header: Drag Handle & Close Button */}
              <div className="flex md:hidden items-center justify-between px-1 pb-1.5 border-b border-white/10 shrink-0">
                <div className="w-10 h-1 rounded-full bg-white/25 mx-auto" />
                <button
                  type="button"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
                  aria-label="Close drawer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* In-room Trivia Tip (Single compact dismissible row above tabs) */}
              {isMounted && !dismissedHints.has(STORAGE_KEYS.HINT_TRIVIA) && (
                <div className="shrink-0 flex items-center justify-between px-3 py-1.5 rounded-xl bg-white/4 border border-white/8 text-[11px] text-gray-400">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-sm">🎮</span>
                    <span className="truncate">Switch to <strong className="text-amber-300">Trivia</strong> mode in the header during breaks.</span>
                  </div>
                  <button
                    onClick={() => dismissHint(STORAGE_KEYS.HINT_TRIVIA)}
                    aria-label="Dismiss trivia tip"
                    className="text-gray-500 hover:text-gray-300 transition ml-2 shrink-0 cursor-pointer"
                  >✕</button>
                </div>
              )}

              {/* Tab Switcher Header (Desktop, Tablet & Mobile Drawer) */}
              <div className="flex items-center gap-1.5 p-1 rounded-2xl glass-panel border-white/10 bg-black/40 shrink-0">
                {/* Tab 1: Video Call */}
                <button
                  type="button"
                  onClick={() => handleSelectSidebarTab('call')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    activeSidebarTab === 'call'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_12px_rgba(0,242,254,0.15)]'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Call</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10 font-mono text-gray-300">
                    {Math.max(1, participants.length)}
                  </span>
                </button>

                {/* Tab 2: Chat */}
                <button
                  type="button"
                  onClick={() => handleSelectSidebarTab('chat')}
                  className={`flex-1 relative flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    activeSidebarTab === 'chat'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_12px_rgba(0,242,254,0.15)]'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Chat</span>
                  {unreadChatCount > 0 && activeSidebarTab !== 'chat' && (
                    <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white font-mono text-[10px] font-bold shadow-[0_0_8px_rgba(244,63,94,0.6)] animate-pulse">
                      {unreadChatCount > 99 ? '99+' : unreadChatCount}
                    </span>
                  )}
                </button>

                {/* Tab 3: Poll */}
                <button
                  type="button"
                  onClick={() => handleSelectSidebarTab('poll')}
                  className={`flex-1 relative flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    activeSidebarTab === 'poll'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_12px_rgba(0,242,254,0.15)]'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Poll</span>
                  {activePoll?.isActive && activeSidebarTab !== 'poll' && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                    </span>
                  )}
                </button>
              </div>

              {/* Tab 1 Content: Video Call */}
              <div className={`${activeSidebarTab === 'call' ? 'flex flex-col flex-1 min-h-0 h-full overflow-hidden' : 'hidden'}`}>
                <WebRTCCall
                  participants={participants}
                  currentUserId={currentUser.id}
                  localStream={localStream}
                  remoteStreams={remoteStreams}
                  isMicMuted={isMicMuted}
                  isCamOff={isCamOff}
                  speakingPeers={speakingPeers}
                  partnerMediaStates={partnerMediaStates}
                  partnerVoiceVolume={partnerVoiceVolume}
                  onToggleLocalCam={toggleCamera}
                  onToggleLocalMic={toggleMic}
                  partnerName={partner?.name || 'Partner'}
                  remoteStream={remoteStream}
                  partnerMicMuted={partnerMicMuted}
                  partnerCamOff={partnerCamOff}
                  isPartnerSpeaking={isPartnerSpeaking}
                />
              </div>

              {/* Tab 2 Content: Chat (flex-1 h-full min-h-0) */}
              <div className={`${activeSidebarTab === 'chat' ? 'flex flex-col flex-1 min-h-0 h-full overflow-hidden' : 'hidden'}`}>
                <ChatPanel
                  messages={chatMessages}
                  participantsCount={Math.max(1, participants.length)}
                  currentTime={currentTime}
                  onSendMessage={handleSendChat}
                  onTriggerReaction={handleReactWithEmoji}
                  onJumpToTime={(time) => seekTo(time)}
                />
              </div>

              {/* Tab 3 Content: Interactive Poll Widget */}
              <div className={`${activeSidebarTab === 'poll' ? 'flex flex-col flex-1 min-h-0 h-full overflow-y-auto' : 'hidden'}`}>
                <RoomPollComponent
                  activePoll={activePoll}
                  currentUserId={currentUser.id}
                  onBroadcastPollCreate={handleBroadcastPollCreate}
                  onBroadcastVote={handleBroadcastVote}
                  onBroadcastClose={handleBroadcastClosePoll}
                />
              </div>
            </aside>

            {/* Mobile Bottom Tab Bar (Collapsed state trigger on screens < 768px) */}
            <div className="fixed bottom-0 inset-x-0 z-30 p-2.5 bg-slate-950/90 backdrop-blur-md border-t border-white/10 md:hidden flex items-center justify-between gap-2 shadow-2xl">
              <button
                type="button"
                onClick={() => handleOpenMobileDrawer('call')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                  activeSidebarTab === 'call' && isMobileDrawerOpen
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40'
                    : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                <span>Call ({Math.max(1, participants.length)})</span>
              </button>

              <button
                type="button"
                onClick={() => handleOpenMobileDrawer('chat')}
                className={`flex-1 relative flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                  activeSidebarTab === 'chat' && isMobileDrawerOpen
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40'
                    : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                <span>Chat</span>
                {unreadChatCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white font-mono text-[10px] font-bold shadow-[0_0_8px_rgba(244,63,94,0.6)] animate-pulse">
                    {unreadChatCount > 99 ? '99+' : unreadChatCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleOpenMobileDrawer('poll')}
                className={`flex-1 relative flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                  activeSidebarTab === 'poll' && isMobileDrawerOpen
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40'
                    : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Poll</span>
                {activePoll?.isActive && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
                aria-label={isMobileDrawerOpen ? "Collapse drawer" : "Expand drawer"}
                className="p-2 rounded-xl glass-pill hover:bg-white/15 text-gray-300 transition shrink-0 cursor-pointer"
              >
                <ChevronUp className={`w-4 h-4 transition-transform duration-200 ${isMobileDrawerOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </>
        )}
      </main>

      {/* Dedicated Select Movie / Upload from PC Dialog */}
      <VideoSettingsModal
        isOpen={showMoviePickerModal}
        currentVideoSrc={currentVideo.src}
        onClose={() => setShowMoviePickerModal(false)}
        onSelectVideo={(vid) => {
          setCurrentVideo(vid);
          if (mediaSource !== 'hls') {
            handleSelectSource('hls');
          }
        }}
      />

      {/* Room Preferences & Settings Modal */}
      <RoomSettingsModal
        isOpen={showRoomSettingsModal}
        onClose={() => setShowRoomSettingsModal(false)}
        userName={currentUser.name}
        isHost={currentUser.isHost}
        roomId={roomId}
        roomName={roomName}
        isAudioDuckingEnabled={isAudioDuckingEnabled}
        onToggleAudioDucking={() => setIsAudioDuckingEnabled(!isAudioDuckingEnabled)}
        onUpdateUserName={handleUpdateUserName}
        onOpenDeviceCheck={() => setShowDeviceCheckModal(true)}
        currentTheme={currentTheme}
        onSelectTheme={setCurrentTheme}
        isMicOn={!isMicMuted}
        isCamOn={!isCamOff}
      />

      {/* Device Check Modal (Mandatory on First Visit or Optional Diagnostics) */}
      <DeviceCheckModal
        isOpen={(isMounted && !hasValidName) || showDeviceCheckModal}
        onClose={() => setShowDeviceCheckModal(false)}
        stream={localStream}
        isMuted={isMicMuted}
        isCamOff={isCamOff}
        onToggleMic={toggleMic}
        onToggleCam={toggleCamera}
        userName={currentUser.name}
        isMandatory={!hasValidName}
        onSaveName={(name) => {
          handleUpdateUserName(name);
          setHasValidName(true);
          setShowDeviceCheckModal(false);
        }}
      />
    </div>
  );
}
