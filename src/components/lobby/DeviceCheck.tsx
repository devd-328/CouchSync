'use client';

import React, { useRef, useEffect } from 'react';
import { Mic, MicOff, Video, VideoOff } from 'lucide-react';
import { useAudioMeter } from '@/hooks/useAudioMeter';

interface DeviceCheckProps {
  stream: MediaStream | null;
  isMuted: boolean;
  isCamOff: boolean;
  onToggleMic: () => void;
  onToggleCam: () => void;
}

export function DeviceCheck({
  stream,
  isMuted,
  isCamOff,
  onToggleMic,
  onToggleCam,
}: DeviceCheckProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { frequencies } = useAudioMeter(isMuted ? null : stream, 20);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="flex flex-col gap-4">
      {/* Camera Preview Box */}
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950 border border-white/10 shadow-2xl group">
        {stream && !isCamOff ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover -scale-x-100"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 gap-2">
            <VideoOff className="w-10 h-10 text-gray-600" />
            <span className="text-xs">Camera is turned off</span>
          </div>
        )}

        {/* Ambient subtle corner badge */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-medium text-gray-300 border border-white/10">
          Camera & Mic Check
        </div>
      </div>

      {/* Audio Waveform Meter & Device Toggles */}
      <div className="flex items-center justify-between gap-4 p-3 rounded-xl glass-panel border-white/10">
        {/* Real-time Audio Level Meter */}
        <div className="flex-1 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[11px] text-gray-400 font-medium">
            <span>Real-time audio level</span>
            <span className={isMuted ? 'text-rose-400' : 'text-emerald-400'}>
              {isMuted ? 'Microphone Muted' : 'Mic Active'}
            </span>
          </div>
          <div className="flex items-end gap-1 h-7 px-1 bg-black/40 rounded-lg overflow-hidden py-1">
            {frequencies.map((val, idx) => (
              <div
                key={idx}
                className={`flex-1 rounded-xs transition-all duration-75 ${
                  isMuted
                    ? 'bg-gray-700 h-1'
                    : 'bg-gradient-to-t from-emerald-500 to-cyan-400 shadow-[0_0_6px_rgba(0,230,118,0.4)]'
                }`}
                style={{
                  height: isMuted ? '3px' : `${Math.max(10, val)}%`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Action Toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleMic}
            className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition ${
              isMuted
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <button
            onClick={onToggleCam}
            className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition ${
              isCamOff
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/30'
            }`}
            title={isCamOff ? 'Turn Camera On' : 'Turn Camera Off'}
          >
            {isCamOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
