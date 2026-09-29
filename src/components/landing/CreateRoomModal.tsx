'use client';

import React, { useState, useEffect } from 'react';
import { X, Film, Tv, MonitorUp, Gamepad2, Dices, Play, CheckCircle2, User } from 'lucide-react';
import { MediaSourceType } from '@/types/sync';
import { isValidNickname } from '@/lib/session';
import { useModalBehavior } from '@/hooks/useModalBehavior';
import { extractYouTubeId } from '@/components/player/YouTubePlayer';

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  onSaveUserName: (name: string) => void;
  defaultMode?: MediaSourceType;
  onSubmit: (roomName: string, mode: MediaSourceType, userName: string, youtubeVideoId?: string) => void;
}

const SAMPLE_YOUTUBE_URL = 'https://www.youtube.com/watch?v=M7lc1UVf-VE';

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

const ACTIVITIES: { mode: MediaSourceType; label: string; sub: string; icon: React.ReactNode }[] = [
  { mode: 'hls',         label: 'Cinema Movie',  sub: 'Video Links & Files',  icon: <Film      className="w-4 h-4 shrink-0" /> },
  { mode: 'youtube',     label: 'YouTube Party', sub: 'Paste any URL',         icon: <Tv        className="w-4 h-4 shrink-0" /> },
  { mode: 'screenshare', label: 'Screen Share',  sub: 'Tabs, Games & Apps',    icon: <MonitorUp className="w-4 h-4 shrink-0" /> },
  { mode: 'trivia',      label: 'Movie Trivia',  sub: 'Multiplayer Games',     icon: <Gamepad2  className="w-4 h-4 shrink-0" /> },
];

export function CreateRoomModal({
  isOpen,
  onClose,
  userName,
  onSaveUserName,
  defaultMode = 'hls',
  onSubmit,
}: CreateRoomModalProps) {
  const modalRef = useModalBehavior({ isOpen, onClose });
  const [roomName, setRoomName] = useState('Neon Premiere');
  const [selectedMode, setSelectedMode] = useState<MediaSourceType>(defaultMode);
  const [nameInput, setNameInput] = useState(userName);
  const [nameError, setNameError] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');

  useEffect(() => {
    setNameInput(userName);
  }, [userName]);

  useEffect(() => {
    setSelectedMode(defaultMode);
  }, [defaultMode]);

  useEffect(() => {
    if (isOpen) {
      const rand = RANDOM_ROOM_NAMES[Math.floor(Math.random() * RANDOM_ROOM_NAMES.length)];
      setRoomName(rand);
      setNameError('');
      setYoutubeUrl('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isYouTubeMode = selectedMode === 'youtube';
  const extractedYouTubeId = isYouTubeMode ? (extractYouTubeId(youtubeUrl) || undefined) : undefined;
  const isYouTubeEmpty = !youtubeUrl.trim();
  const isYouTubeInvalid = isYouTubeMode && (isYouTubeEmpty || !extractedYouTubeId);
  const isSubmitDisabled = isYouTubeInvalid;

  const handleRandomize = () => {
    const rand = RANDOM_ROOM_NAMES[Math.floor(Math.random() * RANDOM_ROOM_NAMES.length)];
    setRoomName(rand);
  };

  const handleLaunch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNick = nameInput.trim();
    if (!isValidNickname(cleanNick)) {
      setNameError('Nickname must be between 3 and 25 characters');
      return;
    }
    if (isYouTubeInvalid) {
      return;
    }
    onSaveUserName(cleanNick);
    onSubmit(roomName.trim() || 'Cosmic Cinema', selectedMode, cleanNick, extractedYouTubeId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        ref={modalRef}
        className="relative w-full max-w-lg rounded-3xl bg-white border border-black/8 p-6 sm:p-8 shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-room-title"
      >
        {/* Subtle accent glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-orange-200/30 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close dialog"
          className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-900 hover:bg-black/5 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-[#FF5722]">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <h2 id="create-room-title" className="text-lg font-bold text-gray-950">
              Create a Watch Room
            </h2>
            <p className="text-xs text-gray-500">
              Host a synchronized lounge and invite your friends
            </p>
          </div>
        </div>

        <form onSubmit={handleLaunch} className="space-y-4">
          {/* Nickname field */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
              Your Nickname
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => {
                  setNameInput(e.target.value);
                  setNameError('');
                }}
                placeholder="Enter your name (3-25 chars)"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#FF5722] focus:bg-white transition"
              />
            </div>
            {nameError && (
              <p className="text-xs text-rose-500 mt-1 font-medium">{nameError}</p>
            )}
          </div>

          {/* Room Name field */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
              Room Name
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="e.g. Starlight Theater"
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#FF5722] focus:bg-white transition"
              />
              <button
                type="button"
                onClick={handleRandomize}
                aria-label="Generate random room name"
                title="Generate random room name"
                className="p-2.5 rounded-xl bg-gray-100 hover:bg-orange-50 text-gray-600 hover:text-[#FF5722] border border-gray-200 transition"
              >
                <Dices className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Starting Activity selector */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 uppercase tracking-wider mb-2">
              Starting Activity
            </label>
            <div className="grid grid-cols-2 gap-2">
              {ACTIVITIES.map(({ mode, label, sub, icon }) => {
                const isSelected = selectedMode === mode;
                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setSelectedMode(mode)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition ${
                      isSelected
                        ? 'bg-orange-50 border-[#FF5722] text-[#E64A19] shadow-xs'
                        : 'bg-gray-50/70 border-gray-200 text-gray-600 hover:bg-gray-100/80 hover:text-gray-900'
                    }`}
                  >
                    <span className={isSelected ? 'text-[#FF5722]' : 'text-gray-500'}>
                      {icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold truncate">{label}</div>
                      <div className="text-[10px] text-gray-400 truncate">{sub}</div>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-[#FF5722]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* YouTube Video Link Field (renders ONLY when selectedMode === 'youtube') */}
          {selectedMode === 'youtube' && (
            <div className="p-3.5 rounded-2xl bg-orange-50/70 border border-orange-200/80 space-y-2 animate-in fade-in slide-in-from-top-1 duration-150">
              <label className="block text-[11px] font-semibold text-gray-700 uppercase tracking-wider">
                YouTube Video Link or ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... or shorts link"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#FF5722] transition"
                />
              </div>

              {/* Validation error message: show only when non-empty but invalid */}
              {!isYouTubeEmpty && !extractedYouTubeId && (
                <p className="text-xs text-rose-500 font-medium">
                  Please enter a valid YouTube link or 11-character video ID
                </p>
              )}

              {/* Sample video button */}
              <div className="flex items-center justify-between pt-0.5">
                <button
                  type="button"
                  onClick={() => setYoutubeUrl(SAMPLE_YOUTUBE_URL)}
                  className="text-[11px] font-semibold text-[#FF5722] hover:text-[#E64A19] underline underline-offset-2 transition cursor-pointer"
                >
                  Use a sample video instead
                </button>
                {extractedYouTubeId && (
                  <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Ready to sync
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Submit button */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className={`w-full py-3.5 rounded-full bg-linear-to-r from-[#FF5722] to-[#FF7043] text-white font-bold text-sm shadow-[0_6px_20px_rgba(255,87,34,0.3)] transition transform flex items-center justify-center gap-2 ${
                isSubmitDisabled
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:from-[#F4511E] hover:to-[#FF5722] hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
              }`}
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Launch Room</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
