'use client';

import React, { useRef, useEffect } from 'react';
import { MonitorUp, Square, Maximize2 } from 'lucide-react';

interface ScreenSharePlayerProps {
  stream: MediaStream | null;
  presenterName: string;
  isLocalPresenter: boolean;
  onStopShare: () => void;
}

export function ScreenSharePlayer({
  stream,
  presenterName,
  isLocalPresenter,
  onStopShare,
}: ScreenSharePlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
      {stream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocalPresenter} // Mute local audio to prevent feedback loop
          className="w-full h-full object-contain"
        />
      ) : (
        <div className="flex flex-col items-center gap-3 p-8 text-center">
          <div className="p-4 rounded-2xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
            <MonitorUp className="w-8 h-8 animate-pulse" />
          </div>
          <h3 className="text-base font-bold text-white">Connecting Screen Share...</h3>
          <p className="text-xs text-gray-400 max-w-sm">
            Waiting for display media stream from <span className="text-violet-300 font-semibold">{presenterName}</span>
          </p>
        </div>
      )}

      {/* Top Floating Badge Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/80 border border-violet-500/30 text-white text-xs font-semibold backdrop-blur-md shadow-lg pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-violet-400 animate-ping" />
          <MonitorUp className="w-3.5 h-3.5 text-violet-400" />
          <span>{isLocalPresenter ? 'You are sharing your screen' : `${presenterName} is sharing`}</span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          {isLocalPresenter && (
            <button
              onClick={onStopShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg transition backdrop-blur-md"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Stop Sharing</span>
            </button>
          )}

          <button
            onClick={handleFullscreen}
            title="Toggle Fullscreen"
            className="p-2 rounded-xl bg-black/60 hover:bg-black/90 text-gray-300 hover:text-white border border-white/20 text-xs backdrop-blur-md transition"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
