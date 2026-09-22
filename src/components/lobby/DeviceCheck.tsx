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
    if (videoRef.current && stream && !isCamOff) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, isCamOff]);

  return (
    <div className="flex flex-col gap-3">
      {/* Camera Preview Box */}
      <div className="relative aspect-video max-h-47.5 sm:max-h-55 rounded-2xl overflow-hidden bg-slate-950 border border-black/10 shadow-md group flex items-center justify-center">
        {stream && !isCamOff ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover -scale-x-100"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-1.5 py-6">
            <VideoOff className="w-8 h-8 text-gray-500" />
            <span className="text-xs font-medium">Camera is turned off</span>
          </div>
        )}

        {/* Ambient subtle corner badge */}
        <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-bold text-gray-900 border border-black/10 shadow-xs">
          Camera &amp; Mic Check
        </div>
      </div>

      {/* Audio Waveform Meter & Device Toggles */}
      <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-200/80">
        {/* Real-time Audio Level Meter */}
        <div className="flex-1 flex flex-col gap-1.5 min-w-0">
          <div className="flex items-center justify-between text-[11px] text-gray-500 font-semibold">
            <span className="truncate">Real-time audio level</span>
            <span className={`shrink-0 font-bold ${isMuted ? 'text-rose-600' : 'text-emerald-600'}`}>
              {isMuted ? 'Microphone Muted' : 'Mic Active'}
            </span>
          </div>
          <div className="flex items-end gap-1 h-6 sm:h-7 px-1.5 bg-gray-200/80 rounded-lg overflow-hidden py-1">
            {frequencies.map((val, idx) => (
              <div
                key={idx}
                className={`flex-1 rounded-xs transition-all duration-75 ${
                  isMuted
                    ? 'bg-gray-400 h-1'
                    : 'bg-linear-to-t from-[#FF5722] to-[#FF8A65]'
                }`}
                style={{
                  height: isMuted ? '3px' : `${Math.max(10, val)}%`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Action Toggles */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={onToggleMic}
            className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition cursor-pointer shadow-xs ${
              isMuted
                ? 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100'
                : 'bg-orange-50 text-[#FF5722] border-orange-200 hover:bg-orange-100'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <MicOff className="w-4.5 h-4.5 sm:w-5 sm:h-5" /> : <Mic className="w-4.5 h-4.5 sm:w-5 sm:h-5" />}
          </button>

          <button
            onClick={onToggleCam}
            className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition cursor-pointer shadow-xs ${
              isCamOff
                ? 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100'
                : 'bg-orange-50 text-[#FF5722] border-orange-200 hover:bg-orange-100'
            }`}
            title={isCamOff ? 'Turn Camera On' : 'Turn Camera Off'}
          >
            {isCamOff ? <VideoOff className="w-4.5 h-4.5 sm:w-5 sm:h-5" /> : <Video className="w-4.5 h-4.5 sm:w-5 sm:h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
