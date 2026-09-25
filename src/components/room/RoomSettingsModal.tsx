'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  X,
  User,
  Volume2,
  Mic,
  Video,
  Share2,
  Keyboard,
  Palette,
  Check,
  Copy,
  Crown,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { ThemeMode } from '@/types/sync';
import { isValidNickname } from '@/lib/session';
import { useModalBehavior } from '@/hooks/useModalBehavior';

interface RoomSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  isHost: boolean;
  roomId: string;
  roomName: string;
  isAudioDuckingEnabled: boolean;
  onToggleAudioDucking: () => void;
  onUpdateUserName: (name: string) => void;
  onOpenDeviceCheck?: () => void;
  currentTheme: ThemeMode;
  onSelectTheme: (theme: ThemeMode) => void;
  isMicOn: boolean;
  isCamOn: boolean;
}

const THEMES: { id: ThemeMode; name: string; color: string; border: string }[] = [
  { id: 'obsidian',  name: 'Obsidian Cinema', color: 'bg-black/90',        border: 'border-cyan-500/40' },
  { id: 'cyberpunk', name: 'Neon Cyberpunk',  color: 'bg-indigo-950/80',   border: 'border-fuchsia-500/40' },
  { id: 'retro',     name: 'Warm Lounge',     color: 'bg-amber-950/80',    border: 'border-amber-500/40' },
  { id: 'oled',      name: 'Pure OLED Black', color: 'bg-black',           border: 'border-white/20' },
];

const SHORTCUTS = [
  { key: 'Space', desc: 'Play / Pause video' },
  { key: '← / →', desc: 'Rewind / Fast-forward 10s' },
  { key: 'M', desc: 'Mute / Unmute audio' },
  { key: 'F', desc: 'Toggle Fullscreen' },
  { key: '1 - 5', desc: 'Playback speed (0.75x - 2x)' },
  { key: 'Esc', desc: 'Close open dialogs' },
];

export function RoomSettingsModal({
  isOpen,
  onClose,
  userName,
  isHost,
  roomId,
  roomName,
  isAudioDuckingEnabled,
  onToggleAudioDucking,
  onUpdateUserName,
  onOpenDeviceCheck,
  currentTheme,
  onSelectTheme,
  isMicOn,
  isCamOn,
}: RoomSettingsModalProps) {
  const modalRef = useModalBehavior({ isOpen, onClose });
  const [nicknameInput, setNicknameInput] = useState(userName);
  const [nameSaved, setNameSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'audio' | 'shortcuts'>('general');

  useEffect(() => {
    setNicknameInput(userName);
  }, [userName]);

  if (!isOpen) return null;

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidNickname(nicknameInput)) return;
    onUpdateUserName(nicknameInput.trim());
    setNameSaved(true);
    setTimeout(() => setNameSaved(false), 2000);
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/room/${roomId}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
    >
      <div
        ref={modalRef}
        className="w-full max-w-lg rounded-3xl bg-white border border-black/10 p-5 sm:p-7 flex flex-col gap-4 shadow-2xl my-auto relative animate-in fade-in zoom-in-95 duration-200 text-gray-950 font-sans"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-black/8 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center text-[#FF5722] shadow-2xs">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-950 tracking-tight flex items-center gap-2">
                Room Preferences &amp; Settings
              </h2>
              <p className="text-[11px] text-gray-500 font-medium">
                Manage your profile, smart voice ducking, hardware, and invite friends
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close settings"
            className="p-1.5 rounded-full hover:bg-black/5 text-gray-400 hover:text-gray-900 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-gray-100/90 border border-black/5 shadow-2xs text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`flex-1 py-2 px-3 rounded-xl font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'general'
                ? 'bg-white text-[#EA580C] border border-black/5 shadow-2xs'
                : 'text-gray-600 hover:text-gray-950 hover:bg-white/60'
            }`}
          >
            <User className="w-3.5 h-3.5 text-[#FF5722]" />
            <span>Profile &amp; Room</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('audio')}
            className={`flex-1 py-2 px-3 rounded-xl font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'audio'
                ? 'bg-white text-[#EA580C] border border-black/5 shadow-2xs'
                : 'text-gray-600 hover:text-gray-950 hover:bg-white/60'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5 text-[#FF5722]" />
            <span>Audio &amp; Devices</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('shortcuts')}
            className={`flex-1 py-2 px-3 rounded-xl font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'shortcuts'
                ? 'bg-white text-[#EA580C] border border-black/5 shadow-2xs'
                : 'text-gray-600 hover:text-gray-950 hover:bg-white/60'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5 text-[#FF5722]" />
            <span>Hotkeys</span>
          </button>
        </div>

        {/* Tab 1: Profile & Room */}
        {activeTab === 'general' && (
          <div className="flex flex-col gap-4 animate-in fade-in duration-150">
            {/* Display Nickname Form */}
            <div className="flex flex-col gap-2 p-3.5 rounded-2xl bg-orange-50/50 border border-orange-200/70">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#FF5722]" />
                  Your Display Name
                </span>
                {isHost ? (
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-bold">
                    <Crown className="w-3 h-3 text-amber-600" />
                    Room Host
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-semibold">
                    Participant
                  </span>
                )}
              </div>
              <form onSubmit={handleSaveName} className="flex gap-2 mt-1">
                <input
                  type="text"
                  value={nicknameInput}
                  onChange={(e) => setNicknameInput(e.target.value)}
                  maxLength={25}
                  placeholder="Enter your nickname..."
                  className="flex-1 bg-white border border-black/10 rounded-xl px-3 py-1.5 text-xs text-gray-950 placeholder-gray-400 focus:outline-none focus:border-[#FF5722] transition"
                />
                <button
                  type="submit"
                  disabled={!isValidNickname(nicknameInput) || nicknameInput === userName}
                  className="px-4 py-1.5 bg-linear-to-r from-[#FF5722] to-[#FF7043] hover:from-[#F4511E] hover:to-[#FF5722] disabled:opacity-40 text-white font-bold rounded-xl text-xs transition cursor-pointer flex items-center gap-1 shrink-0 shadow-xs"
                >
                  {nameSaved ? <Check className="w-3.5 h-3.5" /> : null}
                  <span>{nameSaved ? 'Saved' : 'Update'}</span>
                </button>
              </form>
              <span className="text-[10px] text-gray-500 font-medium">
                Letters, numbers, spaces, and hyphens (3–25 characters)
              </span>
            </div>

            {/* Room Invite Link Card */}
            <div className="flex flex-col gap-2 p-3.5 rounded-2xl bg-orange-50/70 border border-orange-200/90">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#EA580C] flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-[#FF5722]" />
                  Invite Friends to Watch
                </span>
                <span className="font-mono text-[10px] text-gray-600 bg-white px-2 py-0.5 rounded-md border border-black/10 font-bold">
                  #{roomId}
                </span>
              </div>
              <p className="text-[11px] text-gray-600 font-medium">
                Share this direct invite link with friends. They will join <strong className="text-gray-950">{roomName}</strong> instantly without requiring an account.
              </p>
              <button
                type="button"
                onClick={handleCopyLink}
                className="mt-1 py-2 px-3 rounded-xl bg-linear-to-r from-[#FF5722] to-[#FF7043] hover:from-[#F4511E] hover:to-[#FF5722] text-white text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Invite Link Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Room Invite Link</span>
                  </>
                )}
              </button>
            </div>

            {/* Cinema Theme Selector */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-[#FF5722]" />
                Theater Lighting Theme
              </span>
              <div className="grid grid-cols-2 gap-2">
                {THEMES.map((th) => {
                  const isSelected = currentTheme === th.id;
                  return (
                    <button
                      key={th.id}
                      type="button"
                      onClick={() => onSelectTheme(th.id)}
                      className={`p-2.5 rounded-xl text-left border transition flex items-center gap-2 cursor-pointer ${th.color} ${
                        isSelected
                          ? `${th.border} ring-2 ring-orange-500 shadow-xs`
                          : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <div className="w-3.5 h-3.5 rounded-full border border-white/40 shrink-0 flex items-center justify-center">
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-[#FF5722]" />}
                      </div>
                      <span className="text-xs font-bold text-white truncate">{th.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Audio & Devices */}
        {activeTab === 'audio' && (
          <div className="flex flex-col gap-4 animate-in fade-in duration-150">
            {/* Smart Audio Ducking Toggle */}
            <div className="flex items-start justify-between gap-3 p-3.5 rounded-2xl bg-orange-50/50 border border-orange-200/70">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-900">Smart Audio Ducking</span>
                  <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-orange-100 text-[#EA580C] border border-orange-200">
                    Auto
                  </span>
                </div>
                <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">
                  Automatically lowers movie sound by 70% whenever you or someone in the call speaks, so conversation stays crisp without manual adjustments.
                </p>
              </div>
              <button
                type="button"
                onClick={onToggleAudioDucking}
                role="switch"
                aria-checked={isAudioDuckingEnabled}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none mt-1 ${
                  isAudioDuckingEnabled ? 'bg-[#FF5722]' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    isAudioDuckingEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Hardware Status & Test */}
            <div className="flex flex-col gap-2.5 p-3.5 rounded-2xl bg-gray-50 border border-black/8">
              <span className="text-xs font-bold text-gray-800">Hardware &amp; Call Status</span>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-black/8 shadow-2xs">
                  <Mic className={`w-4 h-4 ${isMicOn ? 'text-emerald-600' : 'text-rose-500'}`} />
                  <div className="truncate">
                    <p className="text-[10px] text-gray-500 font-medium">Microphone</p>
                    <p className="text-xs font-bold text-gray-900">{isMicOn ? 'Active' : 'Muted'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-black/8 shadow-2xs">
                  <Video className={`w-4 h-4 ${isCamOn ? 'text-emerald-600' : 'text-rose-500'}`} />
                  <div className="truncate">
                    <p className="text-[10px] text-gray-500 font-medium">Camera</p>
                    <p className="text-xs font-bold text-gray-900">{isCamOn ? 'Active' : 'Turned Off'}</p>
                  </div>
                </div>
              </div>

              {onOpenDeviceCheck && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenDeviceCheck();
                  }}
                  className="mt-1 py-2 px-3 rounded-xl bg-white hover:bg-orange-50 border border-black/10 text-gray-800 hover:text-[#EA580C] text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-2xs"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#FF5722]" />
                  <span>Run Camera &amp; Mic Diagnostics Test</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Hotkeys */}
        {activeTab === 'shortcuts' && (
          <div className="flex flex-col gap-2.5 animate-in fade-in duration-150">
            <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
              <Keyboard className="w-3.5 h-3.5 text-[#FF5722]" />
              Keyboard Hotkeys
            </span>
            <div className="divide-y divide-black/5 rounded-2xl border border-black/8 bg-gray-50/70 overflow-hidden shadow-2xs">
              {SHORTCUTS.map(({ key, desc }) => (
                <div key={key} className="flex items-center justify-between p-2.5 text-xs">
                  <span className="text-gray-700 font-medium">{desc}</span>
                  <kbd className="px-2.5 py-1 rounded-md bg-white border border-black/10 font-mono text-[11px] text-gray-900 font-bold shadow-2xs">
                    {key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
