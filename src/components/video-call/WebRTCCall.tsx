'use client';

import React, { useRef, useEffect } from 'react';
import { Mic, MicOff, Video, VideoOff, Volume2 } from 'lucide-react';

interface WebRTCCallProps {
  partnerName: string;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isMicMuted: boolean;
  isCamOff: boolean;
  partnerMicMuted: boolean;
  partnerCamOff: boolean;
  isPartnerSpeaking: boolean;
  partnerVoiceVolume: number;
  onToggleLocalCam: () => void;
  onToggleLocalMic: () => void;
}

export function WebRTCCall({
  partnerName,
  localStream,
  remoteStream,
  isMicMuted,
  isCamOff,
  partnerMicMuted,
  partnerCamOff,
  isPartnerSpeaking,
  partnerVoiceVolume,
  onToggleLocalCam,
  onToggleLocalMic,
}: WebRTCCallProps) {
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  // Bind local stream
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  // Bind remote stream and manage partner voice volume
  useEffect(() => {
    if (remoteVideoRef.current) {
      if (remoteStream) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
      remoteVideoRef.current.volume = partnerVoiceVolume;
    }
  }, [remoteStream, partnerVoiceVolume]);

  return (
    <div className="flex flex-col gap-3">
      {/* Remote Partner Video Card */}
      <div
        className={`relative aspect-[4/3] rounded-2xl overflow-hidden glass-panel transition-all duration-300 ${
          isPartnerSpeaking ? 'speaking-border border-cyan-400 shadow-[0_0_20px_rgba(0,242,254,0.4)]' : 'border-white/10'
        }`}
      >
        {remoteStream && !partnerCamOff ? (
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
            <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-xl font-bold text-cyan-300 shadow-inner">
              {partnerName.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs text-gray-400 mt-2">
              {partnerCamOff ? `${partnerName}'s camera is off` : `Waiting for ${partnerName}...`}
            </span>
          </div>
        )}

        {/* Partner Info Overlay */}
        <div className="absolute bottom-2 inset-x-2 flex items-center justify-between px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md text-xs font-medium">
          <div className="flex items-center gap-2">
            <span className="text-gray-100 font-semibold">{partnerName}</span>
            {isPartnerSpeaking && (
              <span className="flex items-center gap-1 text-cyan-400 text-[10px] uppercase font-bold tracking-wider animate-pulse">
                <Volume2 className="w-3 h-3" />
                Speaking
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {partnerMicMuted ? (
              <MicOff className="w-3.5 h-3.5 text-rose-400" />
            ) : (
              <Mic className="w-3.5 h-3.5 text-emerald-400" />
            )}
          </div>
        </div>
      </div>

      {/* Local User Mini Preview (Self PiP) */}
      <div className="relative flex items-center justify-between p-2.5 rounded-xl glass-panel border-white/10">
        <div className="flex items-center gap-3">
          <div className="relative w-14 h-11 rounded-lg overflow-hidden bg-slate-900 border border-white/10">
            {localStream && !isCamOff ? (
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover -scale-x-100" // Mirror local preview
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs font-medium text-gray-500">
                Off
              </div>
            )}
          </div>
          <span className="text-xs font-semibold text-gray-200">Me (Self)</span>
        </div>

        {/* Local Camera Quick Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleLocalCam}
            className={`p-1.5 rounded-lg border transition ${
              isCamOff
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
            }`}
            title={isCamOff ? 'Turn Camera On' : 'Turn Camera Off'}
          >
            {isCamOff ? <VideoOff className="w-3.5 h-3.5" /> : <Video className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onToggleLocalMic}
            className={`p-1.5 rounded-lg border transition ${
              isMicMuted
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
            }`}
            title={isMicMuted ? 'Unmute Microphone' : 'Mute Microphone'}
          >
            {isMicMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
