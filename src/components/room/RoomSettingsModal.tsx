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
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg rounded-2xl glass-panel border border-cyan-500/30 p-5 sm:p-6 flex flex-col gap-4 shadow-[0_0_50px_rgba(0,0,0,0.8)] bg-[#0C101C] my-auto relative animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_12px_rgba(0,242,254,0.3)]">
              <Settings className="w-4 h-4 text-cyan-300 animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                Room Preferences &amp; Settings
              </h2>
              <p className="text-[11px] text-gray-400">
                Manage your profile, smart voice ducking, hardware, and invite friends
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close settings"
            className="p-1.5 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/10 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`flex-1 py-1.5 px-3 rounded-lg font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'general'
                ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/40 shadow-[0_0_10px_rgba(0,242,254,0.2)]'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile &amp; Room</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('audio')}
            className={`flex-1 py-1.5 px-3 rounded-lg font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'audio'
                ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/40 shadow-[0_0_10px_rgba(0,242,254,0.2)]'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Audio &amp; Devices</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('shortcuts')}
            className={`flex-1 py-1.5 px-3 rounded-lg font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'shortcuts'
                ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/40 shadow-[0_0_10px_rgba(0,242,254,0.2)]'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>Hotkeys</span>
          </button>
        </div>

        {/* Tab 1: Profile & Room */}
        {activeTab === 'general' && (
          <div className="flex flex-col gap-4 animate-in fade-in duration-150">
            {/* Display Nickname Form */}
            <div className="flex flex-col gap-2 p-3.5 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-200 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  Your Display Name
                </span>
                {isHost ? (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px] font-semibold">
                    <Crown className="w-3 h-3 text-amber-400" />
                    Room Host
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-white/10 text-gray-400 text-[10px] font-medium">
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
                  className="flex-1 bg-black/50 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/60 transition"
                />
                <button
                  type="submit"
                  disabled={!isValidNickname(nicknameInput) || nicknameInput === userName}
                  className="px-3.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:hover:bg-cyan-500 text-black font-bold rounded-xl text-xs transition cursor-pointer flex items-center gap-1 shrink-0 shadow-[0_0_10px_rgba(0,242,254,0.2)]"
                >
                  {nameSaved ? <Check className="w-3.5 h-3.5" /> : null}
                  <span>{nameSaved ? 'Saved' : 'Update'}</span>
                </button>
              </form>
              <span className="text-[10px] text-gray-500">
                Letters, numbers, spaces, and hyphens (3–25 characters)
              </span>
            </div>

            {/* Room Invite Link Card */}
            <div className="flex flex-col gap-2 p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/30">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-200 flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                  Invite Friends to Watch
                </span>
                <span className="font-mono text-[10px] text-gray-400 bg-black/50 px-2 py-0.5 rounded-md border border-white/10">
                  #{roomId}
                </span>
              </div>
              <p className="text-[11px] text-gray-400">
                Share this direct invite link with friends. They will join <strong className="text-white">{roomName}</strong> instantly without requiring an account.
              </p>
              <button
                type="button"
                onClick={handleCopyLink}
                className="mt-1 py-2 px-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-200 text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer shadow-[0_0_12px_rgba(0,242,254,0.2)]"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-300 font-bold">Invite Link Copied to Clipboard!</span>
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
              <span className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-cyan-400" />
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
                          ? `${th.border} ring-1 ring-cyan-400/50 shadow-[0_0_12px_rgba(0,242,254,0.2)]`
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0 flex items-center justify-center">
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                      </div>
                      <span className="text-xs font-semibold text-white truncate">{th.name}</span>
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
            <div className="flex items-start justify-between gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">Smart Audio Ducking</span>
                  <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    Auto
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                  Automatically lowers movie sound by 70% whenever you or someone in the call speaks, so conversation stays crisp without manual adjustments.
                </p>
              </div>
              <button
                type="button"
                onClick={onToggleAudioDucking}
                role="switch"
                aria-checked={isAudioDuckingEnabled}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none mt-1 ${
                  isAudioDuckingEnabled ? 'bg-cyan-500' : 'bg-white/20'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    isAudioDuckingEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Hardware Status & Test */}
            <div className="flex flex-col gap-2.5 p-3.5 rounded-xl bg-white/5 border border-white/10">
              <span className="text-xs font-bold text-gray-200">Hardware &amp; Call Status</span>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-black/40 border border-white/10">
                  <Mic className={`w-4 h-4 ${isMicOn ? 'text-emerald-400' : 'text-rose-400'}`} />
                  <div className="truncate">
                    <p className="text-[10px] text-gray-400">Microphone</p>
                    <p className="text-xs font-semibold text-white">{isMicOn ? 'Active' : 'Muted'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-black/40 border border-white/10">
                  <Video className={`w-4 h-4 ${isCamOn ? 'text-emerald-400' : 'text-rose-400'}`} />
                  <div className="truncate">
                    <p className="text-[10px] text-gray-400">Camera</p>
                    <p className="text-xs font-semibold text-white">{isCamOn ? 'Active' : 'Turned Off'}</p>
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
                  className="mt-1 py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Run Camera &amp; Mic Diagnostics Test</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Hotkeys */}
        {activeTab === 'shortcuts' && (
          <div className="flex flex-col gap-2.5 animate-in fade-in duration-150">
            <span className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
              <Keyboard className="w-3.5 h-3.5 text-cyan-400" />
              Keyboard Hotkeys
            </span>
            <div className="divide-y divide-white/5 rounded-xl border border-white/10 bg-black/30 overflow-hidden">
              {SHORTCUTS.map(({ key, desc }) => (
                <div key={key} className="flex items-center justify-between p-2.5 text-xs">
                  <span className="text-gray-400">{desc}</span>
                  <kbd className="px-2 py-0.5 rounded bg-white/10 border border-white/20 font-mono text-[11px] text-cyan-300 font-bold shadow-xs">
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
