'use client';

import React, { useState, useEffect } from 'react';
import { X, Mic, MicOff, Video, VideoOff, CheckCircle2, User, AlertCircle } from 'lucide-react';
import { DeviceCheck } from './DeviceCheck';
import { STORAGE_KEYS } from '@/config/constants';
import { isValidNickname } from '@/lib/session';

interface DeviceCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  stream: MediaStream | null;
  isMuted: boolean;
  isCamOff: boolean;
  onToggleMic: () => void;
  onToggleCam: () => void;
  userName: string;
  onSaveName?: (name: string) => void;
  isMandatory?: boolean;
}

export function DeviceCheckModal({
  isOpen,
  onClose,
  stream,
  isMuted,
  isCamOff,
  onToggleMic,
  onToggleCam,
  userName,
  onSaveName,
  isMandatory = false,
}: DeviceCheckModalProps) {
  const [nameInput, setNameInput] = useState(userName || '');

  useEffect(() => {
    if (isOpen) {
      setNameInput(userName || '');
    }
  }, [userName, isOpen]);

  if (!isOpen) return null;

  const trimmed = nameInput.trim();
  const isValid = isValidNickname(trimmed);

  const getValidationMessage = () => {
    if (!trimmed) return 'Nickname is required before proceeding.';
    if (trimmed.length < 3) return 'Nickname must be at least 3 characters.';
    if (trimmed.length > 25) return 'Nickname cannot exceed 25 characters.';
    if (!/^[a-zA-Z0-9 _-]+$/.test(trimmed)) {
      return 'Only letters, numbers, spaces, hyphens, and underscores allowed.';
    }
    return null;
  };

  const handleConfirm = () => {
    if (!isValid) return;
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(STORAGE_KEYS.USER_NAME, trimmed);
    }
    onSaveName?.(trimmed);
    onClose();
  };

  const validationMsg = getValidationMessage();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="min-h-full flex items-center justify-center p-3 sm:p-4">
        <div className="relative w-full max-w-115 glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-5 border-white/10 shadow-2xl bg-[#0E121E]/95 my-auto">
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-white/10">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Join Setup &amp; Device Check
              </h3>
              <p className="text-[11px] sm:text-xs text-gray-400">
                Set your name and test camera/microphone before entering
              </p>
            </div>
            {(!isMandatory || isValid) && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}
          </div>

          {/* Mandatory Nickname Entry Input */}
          <div className="pt-3 pb-1">
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="modal-nickname-input" className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span>Your Nickname <span className="text-rose-400">*</span></span>
              </label>
              <span className={`text-[10px] font-mono ${trimmed.length > 25 ? 'text-rose-400 font-bold' : 'text-gray-400'}`}>
                {trimmed.length}/25
              </span>
            </div>
            <input
              id="modal-nickname-input"
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && isValid) {
                  e.preventDefault();
                  handleConfirm();
                }
              }}
              placeholder="Enter your nickname (e.g. Neo, Alex99)..."
              maxLength={30}
              autoFocus
              className={`w-full px-3 py-2 rounded-xl bg-white/5 border text-xs text-white placeholder-gray-500 focus:outline-none transition ${
                !trimmed
                  ? 'border-cyan-500/40 focus:border-cyan-400 shadow-[0_0_10px_rgba(0,242,254,0.15)]'
                  : isValid
                  ? 'border-emerald-500/50 focus:border-emerald-400'
                  : 'border-rose-500/50 focus:border-rose-400'
              }`}
            />
            {validationMsg && (
              <p className="text-[11px] text-amber-400/90 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{validationMsg}</span>
              </p>
            )}
          </div>

          {/* Video Preview */}
          <div className="py-2.5 sm:py-3">
            <DeviceCheck
              stream={stream}
              isMuted={isMuted}
              isCamOff={isCamOff}
              onToggleMic={onToggleMic}
              onToggleCam={onToggleCam}
            />
          </div>

          {/* Status Indicators */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 mb-3.5 sm:mb-4">
            <div className="flex items-center gap-2.5 p-2.5 sm:p-3 rounded-xl bg-white/5 border border-white/10">
              <div className={`p-1.5 sm:p-2 rounded-lg shrink-0 ${isMuted ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </div>
              <div className="min-w-0">
                <div className="text-[10px] sm:text-[11px] font-semibold text-gray-400 uppercase tracking-wider truncate">Microphone</div>
                <div className={`text-xs font-bold truncate ${isMuted ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {isMuted ? 'Muted' : 'Connected & Active'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2.5 sm:p-3 rounded-xl bg-white/5 border border-white/10">
              <div className={`p-1.5 sm:p-2 rounded-lg shrink-0 ${isCamOff ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                {isCamOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
              </div>
              <div className="min-w-0">
                <div className="text-[10px] sm:text-[11px] font-semibold text-gray-400 uppercase tracking-wider truncate">Camera</div>
                <div className={`text-xs font-bold truncate ${isCamOff ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {isCamOff ? 'Camera Off' : 'Live Preview'}
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleConfirm}
            disabled={!isValid}
            className="w-full py-2.5 sm:py-3 rounded-xl bg-linear-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-white font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(0,242,254,0.3)] transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:from-cyan-400 disabled:hover:to-blue-600"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Looks Good — Continue</span>
          </button>
        </div>
      </div>
    </div>
  );
}
