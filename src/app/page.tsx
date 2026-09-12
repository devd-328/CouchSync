'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Clapperboard,
  Tv,
  MonitorUp,
  Gamepad2,
  Sparkles,
  Dices,
  ArrowRight,
  User,
  Camera,
  History,
  Trash2,
  Play,
  Film,
  Zap,
  Radio,
  ShieldCheck,
} from 'lucide-react';
import { generateId } from '@/lib/formatters';
import {
  loadUserSession,
  saveUserSession,
  getRecentRooms,
  saveRecentRoom,
  removeRecentRoom,
  RecentRoom,
} from '@/lib/session';
import { DEFAULT_VIDEO } from '@/lib/sample-media';
import { DeviceCheckModal } from '@/components/lobby/DeviceCheckModal';
import { WEBRTC_CONFIG } from '@/config/constants';
import { MediaSourceType } from '@/types/sync';

const RANDOM_ROOM_NAMES = [
  'Neon Premiere',
  'Cosmic Lounge',
  'Starlight Theater',
  'Retro Midnight',
  'Cyber Cinema',
  'Galaxy Drive-in',
  'Velvet Cinephile',
  'Midnight Popcorn',
];

export default function HomePage() {
  const router = useRouter();

  // User & Room state
  const [userName, setUserName] = useState('Alex');
  const [isEditingName, setIsEditingName] = useState(false);
  const [createRoomName, setCreateRoomName] = useState('Neon Premiere');
  const [selectedMode, setSelectedMode] = useState<MediaSourceType>('hls');
  const [joinInput, setJoinInput] = useState('');
  const [joinError, setJoinError] = useState('');
  const [recentRooms, setRecentRooms] = useState<RecentRoom[]>([]);

  // Cam / Mic modal state
  const [showDeviceModal, setShowDeviceModal] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCamOff, setIsCamOff] = useState(false);

  useEffect(() => {
    const session = loadUserSession();
    if (session.userName) setUserName(session.userName);
    setRecentRooms(getRecentRooms());

    // Random initial room name
    const randomName = RANDOM_ROOM_NAMES[Math.floor(Math.random() * RANDOM_ROOM_NAMES.length)];
    setCreateRoomName(randomName);
  }, []);

  // Request device preview only when modal is opened or pre-flight requested
  const handleOpenDeviceModal = async () => {
    setShowDeviceModal(true);
    if (!stream) {
      try {
        const userMedia = await navigator.mediaDevices.getUserMedia(WEBRTC_CONFIG.MEDIA_CONSTRAINTS);
        setStream(userMedia);
      } catch (err) {
        console.warn('Device preview not accessible:', err);
      }
    }
  };

  const handleToggleMic = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicMuted(!audioTrack.enabled);
      }
    } else {
      setIsMicMuted(!isMicMuted);
    }
  };

  const handleToggleCam = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCamOff(!videoTrack.enabled);
      }
    } else {
      setIsCamOff(!isCamOff);
    }
  };

  const handleRandomizeName = () => {
    const randomName = RANDOM_ROOM_NAMES[Math.floor(Math.random() * RANDOM_ROOM_NAMES.length)];
    setCreateRoomName(randomName);
  };

  const handleCreateRoom = () => {
    const newRoomId = generateId('room').replace('room-', '');
    const cleanName = createRoomName.trim() || 'Cosmic Cinema';

    saveUserSession({
      userName,
      roomName: cleanName,
      video: DEFAULT_VIDEO,
      isMicMuted,
      isCamOff,
      isHost: true,
    });

    saveRecentRoom({ id: newRoomId, name: cleanName });
    router.push(`/room/${newRoomId}?initialMode=${selectedMode}`);
  };

  const handleJoinRoom = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setJoinError('');

    if (!joinInput.trim()) {
      setJoinError('Please enter a room code or invite URL');
      return;
    }

    let parsedId = joinInput.trim();

    // Extract room ID if user pasted a full URL (e.g., http://localhost:3000/room/xyz123)
    if (parsedId.includes('/room/')) {
      const parts = parsedId.split('/room/');
      parsedId = parts[1].split(/[?#]/)[0];
    } else {
      // Remove any trailing slashes or queries
      parsedId = parsedId.replace(/[^a-zA-Z0-9_-]/g, '');
    }

    if (!parsedId) {
      setJoinError('Invalid room link or code');
      return;
    }

    saveUserSession({
      userName,
      isMicMuted,
      isCamOff,
      isHost: false,
    });

    saveRecentRoom({ id: parsedId, name: `Room ${parsedId}` });
    router.push(`/room/${parsedId}`);
  };

  const handleRejoinRecent = (room: RecentRoom) => {
    saveUserSession({
      userName,
      isMicMuted,
      isCamOff,
      isHost: false,
    });
    router.push(`/room/${room.id}`);
  };

  const handleRemoveRecent = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    removeRecentRoom(id);
    setRecentRooms(getRecentRooms());
  };

  return (
    <main className="relative min-h-screen flex flex-col justify-between bg-gradient-to-b from-[#07090E] via-[#0B0F1A] to-[#07090E] p-4 sm:p-6 lg:p-8 overflow-x-hidden">
      {/* Dynamic ambient glow orbs */}
      <div className="absolute top-1/6 left-1/5 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/5 right-1/4 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="relative z-10 w-full max-w-6xl mx-auto flex items-center justify-between py-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-violet-600 flex items-center justify-center shadow-[0_0_20px_rgba(0,242,254,0.45)] border border-white/20">
            <Clapperboard className="w-5 h-5 text-white drop-shadow-md" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-white">CouchSync</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                Kosmi Lounge
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-medium">Real-time Watch Party & Virtual Hangout</p>
          </div>
        </div>

        {/* User Nickname & Device Check Quick Pill */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleOpenDeviceModal}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl glass-pill text-xs font-semibold text-gray-300 hover:text-cyan-300 hover:border-cyan-400/30 transition shadow-sm"
          >
            <Camera className="w-3.5 h-3.5 text-cyan-400" />
            <span>Test Cam & Mic</span>
          </button>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-pill text-xs text-gray-300 border border-white/10">
            <User className="w-3.5 h-3.5 text-cyan-400" />
            {isEditingName ? (
              <input
                type="text"
                autoFocus
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                onBlur={() => {
                  setIsEditingName(false);
                  saveUserSession({ userName });
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setIsEditingName(false);
                    saveUserSession({ userName });
                  }
                }}
                className="w-24 bg-white/10 text-white px-1.5 py-0.5 rounded text-xs focus:outline-none border border-cyan-400/50"
              />
            ) : (
              <button
                onClick={() => setIsEditingName(true)}
                className="font-semibold text-white hover:text-cyan-300 transition"
                title="Click to edit nickname"
              >
                {userName || 'Set Name'}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative z-10 w-full max-w-5xl mx-auto text-center pt-6 pb-4 sm:pt-10 sm:pb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs text-cyan-300 mb-4 backdrop-blur-md shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>Synchronized HLS • YouTube • Screen Share • P2P Video</span>
        </div>

        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
          Your Virtual Cinema &amp; <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-500 drop-shadow-[0_0_35px_rgba(0,242,254,0.3)]">
            Hangout Lounge
          </span>
        </h2>

        <p className="mt-3 max-w-2xl mx-auto text-sm sm:text-base text-gray-400">
          Hang out with friends in sub-second lockstep sync. Stream full movies, paste YouTube videos, share your screen, or play movie trivia with crystal-clear voice &amp; video.
        </p>
      </div>

      {/* Main Dual Hub Cards (Create Room / Join Room) */}
      <div className="relative z-10 w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 my-auto py-2">
        {/* Card 1: Create a Room */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border-white/10 shadow-2xl flex flex-col justify-between hover:border-cyan-400/30 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-500/20 transition" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-400/30 text-cyan-400">
                  <Film className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Create a Cinema Room</h3>
                  <p className="text-xs text-gray-400">Host a watch party &amp; invite your friends</p>
                </div>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full bg-cyan-400/10 text-cyan-300 border border-cyan-400/20">
                Host
              </span>
            </div>

            {/* Room Name Input */}
            <div className="mt-4">
              <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                Room Name
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={createRoomName}
                  onChange={(e) => setCreateRoomName(e.target.value)}
                  placeholder="e.g. Starlight Theater"
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs sm:text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-cyan-400/60 transition"
                />
                <button
                  type="button"
                  onClick={handleRandomizeName}
                  title="Randomize Room Name"
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-cyan-300 border border-white/10 transition"
                >
                  <Dices className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Starting Activity Mode Selector */}
            <div className="mt-5">
              <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Starting Activity
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedMode('hls')}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition ${
                    selectedMode === 'hls'
                      ? 'bg-cyan-500/20 border-cyan-400/50 text-white shadow-[0_0_15px_rgba(0,242,254,0.2)]'
                      : 'bg-white/[0.03] border-white/10 text-gray-400 hover:bg-white/[0.06] hover:text-gray-200'
                  }`}
                >
                  <Film className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-bold truncate">Cinema Movie</div>
                    <div className="text-[10px] text-gray-400">HLS &amp; Local Files</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMode('youtube')}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition ${
                    selectedMode === 'youtube'
                      ? 'bg-rose-500/20 border-rose-400/50 text-white shadow-[0_0_15px_rgba(244,63,94,0.2)]'
                      : 'bg-white/[0.03] border-white/10 text-gray-400 hover:bg-white/[0.06] hover:text-gray-200'
                  }`}
                >
                  <Tv className="w-4 h-4 text-rose-400 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-bold truncate">YouTube Party</div>
                    <div className="text-[10px] text-gray-400">Paste any URL</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMode('screenshare')}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition ${
                    selectedMode === 'screenshare'
                      ? 'bg-violet-500/20 border-violet-400/50 text-white shadow-[0_0_15px_rgba(139,92,246,0.2)]'
                      : 'bg-white/[0.03] border-white/10 text-gray-400 hover:bg-white/[0.06] hover:text-gray-200'
                  }`}
                >
                  <MonitorUp className="w-4 h-4 text-violet-400 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-bold truncate">Screen Share</div>
                    <div className="text-[10px] text-gray-400">Tabs, Games &amp; Apps</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMode('trivia')}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition ${
                    selectedMode === 'trivia'
                      ? 'bg-amber-500/20 border-amber-400/50 text-white shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                      : 'bg-white/[0.03] border-white/10 text-gray-400 hover:bg-white/[0.06] hover:text-gray-200'
                  }`}
                >
                  <Gamepad2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-bold truncate">Movie Trivia</div>
                    <div className="text-[10px] text-gray-400">Multiplayer Games</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Launch Room Button */}
          <div className="mt-6">
            <button
              onClick={handleCreateRoom}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-600 hover:from-cyan-300 hover:via-blue-400 hover:to-violet-500 text-white font-bold text-sm shadow-[0_0_25px_rgba(0,242,254,0.35)] transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Launch Cinema Room</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Card 2: Join an Existing Room */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border-white/10 shadow-2xl flex flex-col justify-between hover:border-violet-400/30 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-36 h-36 bg-violet-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-violet-500/20 transition" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-400/30 text-violet-400">
                  <Radio className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Join with Link or Code</h3>
                  <p className="text-xs text-gray-400">Enter a friend&apos;s watch party room</p>
                </div>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full bg-violet-400/10 text-violet-300 border border-violet-400/20">
                Guest
              </span>
            </div>

            {/* Room Code / Link Input Form */}
            <form onSubmit={handleJoinRoom} className="mt-4">
              <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                Room Code or Invite URL
              </label>
              <input
                type="text"
                value={joinInput}
                onChange={(e) => {
                  setJoinInput(e.target.value);
                  setJoinError('');
                }}
                placeholder="e.g. r4ig6rd or paste full link..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs sm:text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-violet-400/60 transition"
              />
              {joinError && <p className="text-xs text-rose-400 mt-1.5 font-medium">{joinError}</p>}
            </form>

            {/* Recent Rooms List */}
            <div className="mt-5">
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Recent Rooms</span>
                </label>
                {recentRooms.length > 0 && (
                  <span className="text-[10px] text-gray-500">{recentRooms.length} saved</span>
                )}
              </div>

              {recentRooms.length === 0 ? (
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center text-xs text-gray-500">
                  No recent rooms yet. Create or join one to see it here!
                </div>
              ) : (
                <div className="flex flex-col gap-2 max-h-36 overflow-y-auto pr-1">
                  {recentRooms.map((room) => (
                    <div
                      key={room.id}
                      onClick={() => handleRejoinRecent(room)}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-white/20 transition cursor-pointer group/item"
                    >
                      <div className="min-w-0 flex-1 pr-2">
                        <div className="text-xs font-semibold text-gray-200 group-hover/item:text-cyan-300 transition truncate">
                          {room.name}
                        </div>
                        <div className="text-[10px] font-mono text-gray-500 truncate">
                          ID: {room.id}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-medium text-cyan-400 opacity-0 group-hover/item:opacity-100 transition">
                          Re-join →
                        </span>
                        <button
                          onClick={(e) => handleRemoveRecent(e, room.id)}
                          className="p-1.5 rounded-lg text-gray-600 hover:text-rose-400 transition"
                          title="Remove from history"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Join Button */}
          <div className="mt-6">
            <button
              onClick={handleJoinRoom}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:via-indigo-500 hover:to-cyan-400 text-white font-bold text-sm shadow-[0_0_25px_rgba(139,92,246,0.35)] transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <Radio className="w-4 h-4" />
              <span>Connect to Room</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Feature Highlights Grid (Kosmi Style) */}
      <div className="relative z-10 w-full max-w-5xl mx-auto py-6 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-3.5 rounded-2xl glass-panel border-white/5 bg-white/[0.02] flex flex-col gap-1.5">
          <Zap className="w-5 h-5 text-cyan-400" />
          <div className="text-xs font-bold text-white">Sub-Second Sync</div>
          <div className="text-[11px] text-gray-400">Lockstep play/pause &amp; speed matching</div>
        </div>

        <div className="p-3.5 rounded-2xl glass-panel border-white/5 bg-white/[0.02] flex flex-col gap-1.5">
          <Camera className="w-5 h-5 text-emerald-400" />
          <div className="text-xs font-bold text-white">P2P Video &amp; Voice</div>
          <div className="text-[11px] text-gray-400">Auto audio ducking &amp; push-to-talk</div>
        </div>

        <div className="p-3.5 rounded-2xl glass-panel border-white/5 bg-white/[0.02] flex flex-col gap-1.5">
          <MonitorUp className="w-5 h-5 text-violet-400" />
          <div className="text-xs font-bold text-white">Screen Sharing</div>
          <div className="text-[11px] text-gray-400">Stream desktop, tabs &amp; apps native</div>
        </div>

        <div className="p-3.5 rounded-2xl glass-panel border-white/5 bg-white/[0.02] flex flex-col gap-1.5">
          <Gamepad2 className="w-5 h-5 text-amber-400" />
          <div className="text-xs font-bold text-white">Movie Trivia &amp; Polls</div>
          <div className="text-[11px] text-gray-400">Multiplayer hangout games during breaks</div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto text-center py-2 text-[11px] text-gray-500 flex flex-wrap items-center justify-center gap-4">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Peer-to-Peer WebRTC Security</span>
        </div>
        <span>•</span>
        <span>100% Free &amp; Zero Server Cost</span>
        <span>•</span>
        <span>Acoustic Echo Cancellation Active</span>
      </footer>

      {/* Cam & Mic Check Modal */}
      <DeviceCheckModal
        isOpen={showDeviceModal}
        onClose={() => setShowDeviceModal(false)}
        stream={stream}
        isMuted={isMicMuted}
        isCamOff={isCamOff}
        onToggleMic={handleToggleMic}
        onToggleCam={handleToggleCam}
        userName={userName}
      />
    </main>
  );
}
