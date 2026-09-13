'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
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
  Pencil,
  CheckCircle2,
  Link2,
  Users,
  Share2,
  Lock,
} from 'lucide-react';
import { generateId } from '@/lib/formatters';
import {
  loadUserSession,
  saveUserSession,
  getRecentRooms,
  saveRecentRoom,
  removeRecentRoom,
  RecentRoom,
  isValidNickname,
} from '@/lib/session';
import { DEFAULT_VIDEO } from '@/lib/sample-media';
import { DeviceCheckModal } from '@/components/lobby/DeviceCheckModal';
import { WEBRTC_CONFIG, SOURCE_COLORS } from '@/config/constants';
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

/** Maps each media source type to a human-readable launch label */
const LAUNCH_LABELS: Record<MediaSourceType, string> = {
  hls: 'Launch Cinema Room',
  youtube: 'Launch YouTube Party',
  screenshare: 'Launch Screen Share',
  trivia: 'Launch Trivia Room',
};

const ACTIVITIES: { mode: MediaSourceType; label: string; sub: string; icon: React.ReactNode }[] = [
  { mode: 'hls',         label: 'Cinema Movie',  sub: 'HLS & Local Files',    icon: <Film      className="w-4 h-4 shrink-0" /> },
  { mode: 'youtube',     label: 'YouTube Party', sub: 'Paste any URL',         icon: <Tv        className="w-4 h-4 shrink-0" /> },
  { mode: 'screenshare', label: 'Screen Share',  sub: 'Tabs, Games & Apps',    icon: <MonitorUp className="w-4 h-4 shrink-0" /> },
  { mode: 'trivia',      label: 'Movie Trivia',  sub: 'Multiplayer Games',     icon: <Gamepad2  className="w-4 h-4 shrink-0" /> },
];

export default function HomePage() {
  const router = useRouter();

  // User & Room state
  const [userName, setUserName] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [createRoomName, setCreateRoomName] = useState('Neon Premiere');
  const [selectedMode, setSelectedMode] = useState<MediaSourceType>('hls');
  const [joinInput, setJoinInput] = useState('');
  const [joinError, setJoinError] = useState('');
  const [recentRooms, setRecentRooms] = useState<RecentRoom[]>([]);

  // Pending action to execute once nickname is confirmed via modal
  const [pendingAction, setPendingAction] = useState<((name: string) => void) | null>(null);

  // Navigation transition
  const [isNavigating, setIsNavigating] = useState(false);

  // Cam / Mic modal state
  const [showDeviceModal, setShowDeviceModal] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCamOff, setIsCamOff] = useState(false);

  useEffect(() => {
    const session = loadUserSession();
    if (session.userName && isValidNickname(session.userName)) {
      setUserName(session.userName);
    } else {
      setUserName('');
    }
    setRecentRooms(getRecentRooms());

    // Random initial room name
    const randomName = RANDOM_ROOM_NAMES[Math.floor(Math.random() * RANDOM_ROOM_NAMES.length)];
    setCreateRoomName(randomName);
  }, []);

  /** Navigates with a brief 350ms fade curtain for better UX */
  const navigateWithFade = useCallback((href: string) => {
    setIsNavigating(true);
    setTimeout(() => router.push(href), 320);
  }, [router]);

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

  const executeCreateRoom = (validName?: string) => {
    const finalName = validName || userName;
    const newRoomId = generateId('room').replace('room-', '');
    const cleanName = createRoomName.trim() || 'Cosmic Cinema';

    saveUserSession({
      userName: finalName,
      roomName: cleanName,
      video: DEFAULT_VIDEO,
      isMicMuted,
      isCamOff,
      isHost: true,
    });

    saveRecentRoom({ id: newRoomId, name: cleanName });
    navigateWithFade(`/room/${newRoomId}?initialMode=${selectedMode}`);
  };

  const handleCreateRoom = () => {
    if (!isValidNickname(userName)) {
      setPendingAction(() => (name: string) => executeCreateRoom(name));
      handleOpenDeviceModal();
      return;
    }
    executeCreateRoom();
  };

  const executeJoinRoom = (validName?: string) => {
    const finalName = validName || userName;
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
      userName: finalName,
      isMicMuted,
      isCamOff,
      isHost: false,
    });

    saveRecentRoom({ id: parsedId, name: `Room ${parsedId}` });
    navigateWithFade(`/room/${parsedId}`);
  };

  const handleJoinRoom = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setJoinError('');

    if (!joinInput.trim()) {
      setJoinError('Please enter a room code or invite URL');
      return;
    }

    if (!isValidNickname(userName)) {
      setPendingAction(() => (name: string) => executeJoinRoom(name));
      handleOpenDeviceModal();
      return;
    }

    executeJoinRoom();
  };

  const executeRejoinRecent = (room: RecentRoom, validName?: string) => {
    const finalName = validName || userName;
    saveUserSession({
      userName: finalName,
      isMicMuted,
      isCamOff,
      isHost: false,
    });
    navigateWithFade(`/room/${room.id}`);
  };

  const handleRejoinRecent = (room: RecentRoom) => {
    if (!isValidNickname(userName)) {
      setPendingAction(() => (name: string) => executeRejoinRecent(room, name));
      handleOpenDeviceModal();
      return;
    }
    executeRejoinRecent(room);
  };

  const handleRemoveRecent = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    removeRecentRoom(id);
    setRecentRooms(getRecentRooms());
  };

  return (
    <main
      className={`relative min-h-screen flex flex-col justify-between bg-linear-to-b from-[#07090E] via-[#0B0F1A] to-[#07090E] p-4 sm:p-6 lg:p-8 overflow-x-hidden${isNavigating ? ' page-navigating' : ''}`}
    >
      {/* Dynamic ambient glow orbs */}
      <div className="absolute top-1/6 left-1/5 w-125 h-125 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/5 right-1/4 w-150 h-150 bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* ── Top Navbar ────────────────────────────────────────────────── */}
      <header className="relative z-10 w-full max-w-6xl mx-auto flex items-center justify-between py-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(0,242,254,0.35)] border border-cyan-500/30 shrink-0 bg-black/50">
            <Image
              src="/icon.png"
              alt="CouchSync Logo"
              width={44}
              height={44}
              className="w-full h-full object-cover"
              priority
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-white">CouchSync</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                Kosmi Lounge
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-medium">Real-time Watch Party &amp; Virtual Hangout</p>
          </div>
        </div>

        {/* User Nickname & Device Check Quick Pill */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleOpenDeviceModal}
            aria-label="Test camera and microphone"
            className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl glass-pill text-xs font-semibold text-gray-300 hover:text-cyan-300 hover:border-cyan-400/30 transition shadow-sm cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Test Cam &amp; Mic</span>
          </button>

          {/* Editable nickname pill — pencil icon hints at editability */}
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
                  const trimmed = userName.trim();
                  if (isValidNickname(trimmed)) {
                    setUserName(trimmed);
                    saveUserSession({ userName: trimmed });
                  } else {
                    const session = loadUserSession();
                    setUserName(session.userName || '');
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setIsEditingName(false);
                    const trimmed = userName.trim();
                    if (isValidNickname(trimmed)) {
                      setUserName(trimmed);
                      saveUserSession({ userName: trimmed });
                    } else {
                      const session = loadUserSession();
                      setUserName(session.userName || '');
                    }
                  }
                }}
                placeholder="Name (3-25)"
                className="w-28 bg-white/10 text-white px-1.5 py-0.5 rounded text-xs focus:outline-none border border-cyan-400/50"
              />
            ) : (
              <button
                onClick={() => setIsEditingName(true)}
                aria-label="Edit nickname"
                title="Click to edit your nickname"
                className="group flex items-center gap-1 font-semibold text-white hover:text-cyan-300 transition cursor-pointer"
              >
                <span className="border-b border-dashed border-transparent group-hover:border-cyan-400/60 transition">
                  {userName ? (
                    userName
                  ) : (
                    <span className="text-amber-300 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                      Set Nickname
                    </span>
                  )}
                </span>
                <Pencil className="w-2.5 h-2.5 text-gray-500 opacity-60 group-hover:opacity-100 transition" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── Hero Section ──────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-5xl mx-auto pt-6 pb-4 sm:pt-10 sm:pb-6">
        {/* Feature pill — short & scannable; grid below carries the detail */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/4 border border-white/10 text-xs text-cyan-300 backdrop-blur-md shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Sync · YouTube · Screen Share · P2P</span>
          </div>
        </div>

        {/* Hero content: text + animated sync indicator side-by-side on lg */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
          {/* Text block */}
          <div className="text-center lg:text-left">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              Your Virtual Cinema &amp; <br />
              <span className="bg-clip-text text-transparent bg-linear-to-r from-cyan-400 via-blue-400 to-violet-500 drop-shadow-[0_0_35px_rgba(0,242,254,0.3)]">
                Hangout Lounge
              </span>
            </h2>

            <p className="mt-3 max-w-xl text-sm sm:text-base text-gray-400">
              Hang out with friends in sub-second lockstep sync. Stream movies, share your screen, or play trivia together — with crystal-clear voice &amp; video.
            </p>
          </div>

          {/* Animated sync indicator — visual anchor for the hero */}
          <div className="hidden lg:flex shrink-0 items-center justify-center relative w-48 h-48" aria-hidden="true">
            {/* Outer glow ring */}
            <div className="absolute inset-0 rounded-full bg-cyan-500/8 border border-cyan-400/20 animate-pulse" />
            {/* Middle ring */}
            <div className="absolute inset-4 rounded-full bg-cyan-500/6 border border-cyan-400/15" style={{ animationDelay: '0.4s' }} />
            {/* Core */}
            <div className="relative z-10 w-20 h-20 rounded-2xl bg-linear-to-tr from-cyan-400/20 via-blue-500/20 to-violet-600/20 border border-white/20 backdrop-blur-xl flex flex-col items-center justify-center shadow-[0_0_40px_rgba(0,242,254,0.25)]">
              <Film className="w-7 h-7 text-cyan-300 mb-1" />
              <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest">In Sync</span>
            </div>
            {/* Orbiting dot 1 */}
            <div className="absolute w-2.5 h-2.5 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(0,242,254,0.8)]"
              style={{ top: '12px', left: '50%', transform: 'translateX(-50%)', animation: 'speaking-pulse 2s infinite ease-in-out' }} />
            {/* Orbiting dot 2 */}
            <div className="absolute w-2 h-2 bg-violet-400 rounded-full shadow-[0_0_8px_rgba(139,92,246,0.8)]"
              style={{ bottom: '18px', right: '14px', animation: 'speaking-pulse 2.4s infinite ease-in-out 0.8s' }} />
            {/* Orbiting dot 3 */}
            <div className="absolute w-2 h-2 bg-blue-400 rounded-full"
              style={{ bottom: '18px', left: '14px', animation: 'speaking-pulse 2.8s infinite ease-in-out 1.2s' }} />
          </div>
        </div>
      </div>

      {/* ── How to Use — 3-Step Onboarding Strip ─────────────────────── */}
      {/* Extensible: add a 4th step here for private rooms/passwords when that feature ships */}
      <div className="relative z-10 w-full max-w-5xl mx-auto mb-6">
        <div className="glass-panel rounded-2xl px-5 py-4 border-white/8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-0 sm:divide-x sm:divide-white/8">
            {/* Step 1 */}
            <div className="flex items-center gap-3 sm:pr-6">
              <div className="shrink-0 w-8 h-8 rounded-full bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center">
                <span className="text-xs font-black text-cyan-400">1</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <Film className="w-3.5 h-3.5 text-cyan-400" />
                  Create a room
                </div>
                <p className="text-[11px] text-gray-400 mt-0.5 leading-tight">Pick an activity, name your room, launch.</p>
              </div>
            </div>
            {/* Step 2 */}
            <div className="flex items-center gap-3 sm:px-6">
              <div className="shrink-0 w-8 h-8 rounded-full bg-violet-500/15 border border-violet-400/30 flex items-center justify-center">
                <span className="text-xs font-black text-violet-400">2</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <Share2 className="w-3.5 h-3.5 text-violet-400" />
                  Share the link
                </div>
                <p className="text-[11px] text-gray-400 mt-0.5 leading-tight">Copy the room URL and send it to your friends.</p>
              </div>
            </div>
            {/* Step 3 */}
            <div className="flex items-center gap-3 sm:pl-6">
              <div className="shrink-0 w-8 h-8 rounded-full bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center">
                <span className="text-xs font-black text-emerald-400">3</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <Users className="w-3.5 h-3.5 text-emerald-400" />
                  Watch together
                </div>
                <p className="text-[11px] text-gray-400 mt-0.5 leading-tight">No sign-up needed — join instantly in the browser.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Dual Hub Cards (Create / Join) ───────────────────────── */}
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
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs sm:text-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:border-cyan-400/60 transition"
                />
                <button
                  type="button"
                  onClick={handleRandomizeName}
                  aria-label="Generate a random room name"
                  title="Generate a random room name"
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
                {ACTIVITIES.map(({ mode, label, sub, icon }) => {
                  const isSelected = selectedMode === mode;
                  const colors = SOURCE_COLORS[mode];
                  return (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setSelectedMode(mode)}
                      className={`card-hover relative flex items-center gap-2 p-2.5 rounded-xl border text-left transition ${
                        isSelected
                          ? `${colors.bg} ${colors.border} text-white ${colors.shadow} scale-[1.02]`
                          : 'bg-white/3 border-white/10 text-gray-400 hover:bg-white/6 hover:text-gray-200'
                      }`}
                    >
                      {/* Consistent per-source icon color regardless of selection */}
                      <span className={colors.icon}>{icon}</span>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold truncate">{label}</div>
                        <div className="text-[10px] text-gray-400">{sub}</div>
                      </div>
                      {/* Checkmark confirms selection — especially important on touch */}
                      {isSelected && (
                        <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${colors.icon}`} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Launch Room Button — gradient fill (primary CTA), label is dynamic */}
          <div className="mt-6">
            <button
              onClick={handleCreateRoom}
              className="w-full py-3.5 rounded-xl bg-linear-to-r from-cyan-400 via-blue-500 to-violet-600 hover:from-cyan-300 hover:via-blue-400 hover:to-violet-500 text-white font-bold text-sm shadow-[0_0_25px_rgba(0,242,254,0.35)] transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{LAUNCH_LABELS[selectedMode]}</span>
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
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs sm:text-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:border-violet-400/60 transition"
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
                /* Empty state: short "How it works" reassurance instead of a bare notice */
                <div className="p-4 rounded-xl bg-white/2 border border-white/8 space-y-2.5">
                  <p className="text-[11px] text-gray-400 font-semibold text-center mb-3">No sign-up needed — just paste a link</p>
                  {[
                    { icon: <Link2 className="w-3.5 h-3.5 text-violet-400" />, text: 'Ask your friend to copy their room URL' },
                    { icon: <Radio className="w-3.5 h-3.5 text-violet-400" />, text: 'Paste it in the field above' },
                    { icon: <Users className="w-3.5 h-3.5 text-emerald-400" />, text: 'Hit Connect and watch together instantly' },
                  ].map(({ icon, text }, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <div className="shrink-0 w-5 h-5 rounded-full bg-white/6 border border-white/10 flex items-center justify-center text-[9px] font-black text-gray-400">
                        {i + 1}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                        {icon}
                        <span>{text}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-2 max-h-36 overflow-y-auto pr-1">
                  {recentRooms.map((room) => (
                    <div
                      key={room.id}
                      onClick={() => handleRejoinRecent(room)}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-white/3 hover:bg-white/8 border border-white/5 hover:border-white/20 transition cursor-pointer group/item"
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
                          aria-label={`Remove ${room.name} from history`}
                          title={`Remove ${room.name} from history`}
                          className="p-1.5 rounded-lg text-gray-600 hover:text-rose-400 transition"
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

          {/* Connect Button — ghost/outline (secondary CTA) for clear visual hierarchy */}
          <div className="mt-6">
            <button
              onClick={handleJoinRoom}
              className="w-full py-3.5 rounded-xl border-2 border-violet-400/60 text-violet-300 font-bold text-sm hover:bg-violet-500/15 hover:border-violet-400/90 hover:text-white transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <Radio className="w-4 h-4" />
              <span>Connect to Room</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Feature Highlights Grid ───────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-5xl mx-auto py-6 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Cyan = HLS/Cinema */}
        <div className="card-hover p-3.5 rounded-2xl glass-panel border-white/5 bg-white/2 flex flex-col gap-1.5">
          <Zap className="w-5 h-5 text-cyan-400" />
          <div className="text-xs font-bold text-white">Sub-Second Sync</div>
          <div className="text-[11px] text-gray-400">Lockstep play/pause &amp; speed matching</div>
        </div>

        {/* Emerald = P2P Voice (matches Camera icon elsewhere) */}
        <div className="card-hover p-3.5 rounded-2xl glass-panel border-white/5 bg-white/2 flex flex-col gap-1.5">
          <Camera className="w-5 h-5 text-emerald-400" />
          <div className="text-xs font-bold text-white">P2P Video &amp; Voice</div>
          <div className="text-[11px] text-gray-400">Auto audio ducking &amp; push-to-talk</div>
        </div>

        {/* Violet = Screen Share */}
        <div className="card-hover p-3.5 rounded-2xl glass-panel border-white/5 bg-white/2 flex flex-col gap-1.5">
          <MonitorUp className="w-5 h-5 text-violet-400" />
          <div className="text-xs font-bold text-white">Screen Sharing</div>
          <div className="text-[11px] text-gray-400">Stream desktop, tabs &amp; apps native</div>
        </div>

        {/* Amber = Trivia */}
        <div className="card-hover p-3.5 rounded-2xl glass-panel border-white/5 bg-white/2 flex flex-col gap-1.5">
          <Gamepad2 className="w-5 h-5 text-amber-400" />
          <div className="text-xs font-bold text-white">Movie Trivia &amp; Polls</div>
          <div className="text-[11px] text-gray-400">Multiplayer hangout games during breaks</div>
        </div>
      </div>

      {/* ── Footer — Trust badges (user-benefit framing) ──────────────── */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto text-center py-2 text-[11px] text-gray-500 flex flex-wrap items-center justify-center gap-4">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>End-to-end WebRTC encryption</span>
        </div>
        <span>•</span>
        <div className="flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-cyan-400" />
          <span>Always free · No account needed</span>
        </div>
        <span>•</span>
        <span>Acoustic echo cancellation active</span>
      </footer>

      {/* Cam & Mic Check Modal */}
      <DeviceCheckModal
        isOpen={showDeviceModal}
        onClose={() => {
          setShowDeviceModal(false);
          setPendingAction(null);
        }}
        stream={stream}
        isMuted={isMicMuted}
        isCamOff={isCamOff}
        onToggleMic={handleToggleMic}
        onToggleCam={handleToggleCam}
        userName={userName}
        isMandatory={!isValidNickname(userName)}
        onSaveName={(name) => {
          setUserName(name);
          saveUserSession({ userName: name });
          if (pendingAction) {
            const act = pendingAction;
            setPendingAction(null);
            act(name);
          }
        }}
      />
    </main>
  );
}
