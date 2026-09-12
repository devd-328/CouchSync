'use client';

import React, { useState, useEffect, useRef, use, useMemo, useCallback } from 'react';
import { VideoPlayer } from '@/components/player/VideoPlayer';
import { WebRTCCall } from '@/components/video-call/WebRTCCall';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { DualVolumeMixer } from '@/components/controls/DualVolumeMixer';
import { RoomHeader } from '@/components/room/RoomHeader';
import { VideoSettingsModal } from '@/components/room/VideoSettingsModal';
import { RoomPollComponent } from '@/components/room/RoomPoll';
import { useSyncedPlayback } from '@/hooks/useSyncedPlayback';
import { useWebRTC } from '@/hooks/useWebRTC';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { subscribeToRoom, ChannelSubscription } from '@/lib/sync-channel';
import { loadUserSession } from '@/lib/session';
import { formatClockTime, generateId } from '@/lib/formatters';
import { AUDIO_CONFIG } from '@/config/constants';
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

  // Initialize session state cleanly
  const initialSession = useMemo(() => loadUserSession(), []);
  const [currentUser] = useState<RoomParticipant>({
    id: generateId('user'),
    name: initialSession.userName,
    isHost: initialSession.isHost,
    isMicOn: !initialSession.isMicMuted,
    isCamOn: !initialSession.isCamOff,
  });

  const [roomName] = useState(initialSession.roomName);
  const [currentVideo, setCurrentVideo] = useState<VideoMedia>(initialSession.video);
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
  const [floatingReactions, setFloatingReactions] = useState<FloatingEmoji[]>([]);
  const [activePoll, setActivePoll] = useState<RoomPoll | null>(null);

  // Resume playback feature
  const [savedResumeTime, setSavedResumeTime] = useState<number | null>(null);

  // Volume, Audio Ducking & Push-to-Talk
  const [movieVolume, setMovieVolume] = useState(AUDIO_CONFIG.DEFAULT_MOVIE_VOLUME);
  const [partnerVoiceVolume, setPartnerVoiceVolume] = useState(AUDIO_CONFIG.DEFAULT_PARTNER_VOLUME);
  const [isAudioDuckingEnabled, setIsAudioDuckingEnabled] = useState(true);
  const [isPushToTalkActive, setIsPushToTalkActive] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

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
  });

  // 2. WebRTC Call Hook
  const {
    localStream,
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
    isPartnerSpeaking,
    initiateCall,
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

  // 3. Resume Timestamp Continuity (Save progress periodically)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check for saved progress on mount
    try {
      const saved = localStorage.getItem(`couchsync_resume_${roomId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.time && parsed.time > 15) {
          setSavedResumeTime(parsed.time);
        }
      }
    } catch {
      // ignore
    }
  }, [roomId]);

  useEffect(() => {
    if (typeof window === 'undefined' || currentTime < 5) return;
    const timer = setTimeout(() => {
      localStorage.setItem(
        `couchsync_resume_${roomId}`,
        JSON.stringify({ time: currentTime, ts: Date.now() })
      );
    }, 3000);
    return () => clearTimeout(timer);
  }, [currentTime, roomId]);

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
          setChatMessages((prev) => [
            ...prev,
            {
              id: msg.id,
              senderId: msg.senderId,
              senderName: msg.senderName,
              text: msg.text,
              timestamp: formatClockTime(msg.ts),
              isSelf: msg.senderId === currentUser.id,
              jumpTime: msg.jumpTime,
            },
          ]);
        } else if (msg.type === 'emoji-reaction') {
          addFloatingReaction(msg.emoji);
        }
      },
      (activeMembers) => {
        setParticipants(activeMembers);
        const foundPartner = activeMembers.find((m) => m.id !== currentUser.id);
        if (foundPartner && activeMembers[0]?.id === currentUser.id) {
          initiateCall(foundPartner.id);
        }
      }
    );

    channelRef.current = sub;

    return () => {
      sub.unsubscribe();
    };
  }, [roomId, currentUser, handleRemoteAction, handleRemoteSignal, initiateCall]);

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
        timestamp: formatClockTime(now),
        isSelf: true,
        jumpTime,
      },
    ]);
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

  // Smart Audio Ducking calculation
  const effectiveMovieVolume =
    isAudioDuckingEnabled && isPartnerSpeaking
      ? movieVolume * AUDIO_CONFIG.DUCKING_MULTIPLIER
      : movieVolume;

  return (
    <div className={`min-h-screen theme-${currentTheme} flex flex-col justify-between p-3 sm:p-4 lg:p-5 text-gray-100 transition-colors duration-500`}>
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
        onOpenSettings={() => setShowSettingsModal(true)}
      />

      {/* Main Theater Layout */}
      <main className={`flex-1 grid grid-cols-1 ${roomLayout === 'focus' ? 'lg:grid-cols-12' : 'lg:grid-cols-12'} gap-4 my-3 items-start`}>
        {/* Left: Video Canvas + Bottom Master Controls */}
        <section className={`${roomLayout === 'focus' ? 'lg:col-span-12' : 'lg:col-span-8 xl:col-span-9'} flex flex-col gap-3`}>
          <VideoPlayer
            src={currentVideo.src}
            poster={currentVideo.poster}
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
          />

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
            onOpenSettings={() => setShowSettingsModal(true)}
          />
        </section>

        {/* Right: WebRTC Stream, Live In-Stream Poll & Chat Feed */}
        <aside className="lg:col-span-4 xl:col-span-3 flex flex-col gap-3 h-full">
          <WebRTCCall
            partnerName={partner?.name || 'Partner'}
            localStream={localStream}
            remoteStream={remoteStream}
            isMicMuted={isMicMuted}
            isCamOff={isCamOff}
            partnerMicMuted={partnerMicMuted}
            partnerCamOff={partnerCamOff}
            isPartnerSpeaking={isPartnerSpeaking}
            partnerVoiceVolume={partnerVoiceVolume}
            onToggleLocalCam={toggleCamera}
            onToggleLocalMic={toggleMic}
          />

          {/* In-Stream Interactive Poll Widget */}
          <RoomPollComponent
            activePoll={activePoll}
            currentUserId={currentUser.id}
            onBroadcastPollCreate={handleBroadcastPollCreate}
            onBroadcastVote={handleBroadcastVote}
            onBroadcastClose={handleBroadcastClosePoll}
          />

          {/* Live In-Room Chat with Timestamped Moments */}
          <ChatPanel
            messages={chatMessages}
            participantsCount={Math.max(1, participants.length)}
            currentTime={currentTime}
            onSendMessage={handleSendChat}
            onTriggerReaction={handleReactWithEmoji}
            onJumpToTime={(time) => seekTo(time)}
          />
        </aside>
      </main>

      {/* Modular Settings Dialog with Local File Support */}
      <VideoSettingsModal
        isOpen={showSettingsModal}
        currentVideoSrc={currentVideo.src}
        onClose={() => setShowSettingsModal(false)}
        onSelectVideo={setCurrentVideo}
      />
    </div>
  );
}
