'use client';

import React from 'react';
import { X, Mic, MicOff, Video, VideoOff, CheckCircle2 } from 'lucide-react';
import { DeviceCheck } from './DeviceCheck';

interface DeviceCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  stream: MediaStream | null;
  isMuted: boolean;
  isCamOff: boolean;
  onToggleMic: () => void;
  onToggleCam: () => void;
  userName: string;
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
}: DeviceCheckModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg glass-panel rounded-3xl p-6 border-white/10 shadow-2xl bg-[#0E121E]/95">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              Camera & Mic Check
            </h3>
            <p className="text-xs text-gray-400">
              Testing audio and video settings for <span className="text-cyan-300 font-semibold">{userName}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Preview */}
        <div className="py-5">
          <DeviceCheck
            stream={stream}
            isMuted={isMuted}
            isCamOff={isCamOff}
            onToggleMic={onToggleMic}
            onToggleCam={onToggleCam}
          />
        </div>

        {/* Status Indicators */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10">
            <div className={`p-2 rounded-lg ${isMuted ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
              {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </div>
            <div>
              <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Microphone</div>
              <div className={`text-xs font-bold ${isMuted ? 'text-rose-400' : 'text-emerald-400'}`}>
                {isMuted ? 'Muted' : 'Connected & Active'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10">
            <div className={`p-2 rounded-lg ${isCamOff ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
              {isCamOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
            </div>
            <div>
              <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Camera</div>
              <div className={`text-xs font-bold ${isCamOff ? 'text-rose-400' : 'text-emerald-400'}`}>
                {isCamOff ? 'Camera Off' : 'Live Preview'}
              </div>
            </div>
          </div>
        </div>

        {/* Done Button */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-linear-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(0,242,254,0.3)] transition flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Looks Good — Continue</span>
        </button>
      </div>
    </div>
  );
}
