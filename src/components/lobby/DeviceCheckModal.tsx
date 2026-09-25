'use client';

import React, { useState, useEffect } from 'react';
import { X, Mic, MicOff, Video, VideoOff, CheckCircle2, User, AlertCircle } from 'lucide-react';
import { DeviceCheck } from './DeviceCheck';
import { STORAGE_KEYS } from '@/config/constants';
import { isValidNickname } from '@/lib/session';
import { useModalBehavior } from '@/hooks/useModalBehavior';

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
  const modalRef = useModalBehavior({ isOpen, onClose });
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
      sessionStorage.setItem(STORAGE_KEYS.MIC_MUTED, isMuted ? 'true' : 'false');
      sessionStorage.setItem(STORAGE_KEYS.CAM_OFF, isCamOff ? 'true' : 'false');
    }
    onSaveName?.(trimmed);
    onClose();
  };

  const validationMsg = getValidationMessage();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="min-h-full flex items-center justify-center p-3 sm:p-4">
        <div
          ref={modalRef}
          className="relative w-full max-w-115 rounded-3xl p-5 sm:p-6 border border-black/10 shadow-2xl bg-white text-gray-950 my-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-950 flex items-center gap-2">
                Quick Mic &amp; Camera Check
              </h3>
              <p className="text-[11px] sm:text-xs text-gray-500">
                Choose your name and preview your camera and microphone
              </p>
            </div>
            {(!isMandatory || isValid) && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 transition cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}
          </div>

          {/* Mandatory Nickname Entry Input */}
          <div className="pt-3 pb-1">
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="modal-nickname-input" className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#FF5722]" />
                <span>Your Nickname <span className="text-rose-500">*</span></span>
              </label>
              <span className={`text-[10px] font-mono ${trimmed.length > 25 ? 'text-rose-500 font-bold' : 'text-gray-400'}`}>
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
              placeholder="Enter your nickname (e.g. Alex, Sam99)..."
              maxLength={30}
              autoFocus
              className={`w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white transition ${
                !trimmed
                  ? 'border-orange-300 focus:border-[#FF5722] focus:ring-2 focus:ring-orange-500/20'
                  : isValid
                  ? 'border-emerald-500/60 focus:border-emerald-500'
                  : 'border-rose-400 focus:border-rose-500'
              }`}
            />
            {validationMsg && (
              <p className="text-[11px] text-amber-700 mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3 shrink-0 text-amber-600" />
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
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 mb-4">
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-gray-50 border border-gray-100">
              <div className={`p-2 rounded-xl shrink-0 ${isMuted ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-700'}`}>
                {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </div>
              <div className="min-w-0">
                <div className="text-[10px] sm:text-[11px] font-semibold text-gray-500 uppercase tracking-wider truncate">Microphone</div>
                <div className={`text-xs font-bold truncate ${isMuted ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {isMuted ? 'Muted' : 'Connected & Active'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-gray-50 border border-gray-100">
              <div className={`p-2 rounded-xl shrink-0 ${isCamOff ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-700'}`}>
                {isCamOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
              </div>
              <div className="min-w-0">
                <div className="text-[10px] sm:text-[11px] font-semibold text-gray-500 uppercase tracking-wider truncate">Camera</div>
                <div className={`text-xs font-bold truncate ${isCamOff ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {isCamOff ? 'Camera Off' : 'Live Preview'}
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleConfirm}
            disabled={!isValid}
            className="w-full py-3 rounded-xl bg-linear-to-r from-[#FF5722] to-[#FF7043] hover:from-[#F4511E] hover:to-[#FF5722] text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Looks Good - Continue</span>
          </button>
        </div>
      </div>
    </div>
  );
}
