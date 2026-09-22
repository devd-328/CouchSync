'use client';

import React, { useRef, useEffect } from 'react';
import { Mic, MicOff, Video, VideoOff, Volume2, Users } from 'lucide-react';
import { RoomParticipant } from '@/types/sync';

interface WebRTCCallProps {
  participants?: RoomParticipant[];
  currentUserId?: string;
  localStream: MediaStream | null;
  remoteStreams?: Map<string, MediaStream>;
  isMicMuted: boolean;
  isCamOff: boolean;
  speakingPeers?: Set<string>;
  partnerMediaStates?: Map<string, { isMicMuted: boolean; isCamOff: boolean }>;
  partnerVoiceVolume: number;
  onToggleLocalCam: () => void;
  onToggleLocalMic: () => void;
  partnerName?: string;
  remoteStream?: MediaStream | null;
  partnerMicMuted?: boolean;
  partnerCamOff?: boolean;
  isPartnerSpeaking?: boolean;
}

function RemoteVideoTile({
  participant,
  stream,
  isSpeaking,
  isMicMuted,
  isCamOff,
  volume,
}: {
  participant: RoomParticipant;
  stream: MediaStream | null;
  isSpeaking: boolean;
  isMicMuted: boolean;
  isCamOff: boolean;
  volume: number;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (stream) {
        videoRef.current.srcObject = stream;
      }
      videoRef.current.volume = volume;
    }
  }, [stream, volume]);

  return (
    <div
      className={`relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-900 border transition-all duration-300 ${
        isSpeaking
          ? 'border-[#FF5722] shadow-[0_0_15px_rgba(255,87,34,0.4)] ring-2 ring-[#FF5722]/50'
          : 'border-gray-200 shadow-xs'
      }`}
    >
      {stream && !isCamOff ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-linear-to-br from-gray-900 via-slate-900 to-gray-950 p-2">
          <div className="w-12 h-12 rounded-full bg-orange-500/20 border border-orange-400/40 flex items-center justify-center text-lg font-bold text-orange-300 shadow-inner">
            {participant.name.charAt(0).toUpperCase()}
          </div>
          <span className="text-[10px] sm:text-[11px] text-gray-300 mt-2 px-2 text-center truncate max-w-full font-medium">
            {isCamOff ? `${participant.name}'s camera off` : `Connecting ${participant.name}...`}
          </span>
        </div>
      )}

      {/* Participant Info Overlay */}
      <div className="absolute bottom-1.5 inset-x-1.5 flex items-center justify-between px-2.5 py-1 rounded-xl bg-white/90 backdrop-blur-md text-[11px] font-medium border border-black/5 shadow-2xs">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-gray-900 font-bold truncate">{participant.name}</span>
          {isSpeaking && (
            <span className="flex items-center gap-0.5 text-[#FF5722] text-[9px] uppercase font-bold tracking-wider animate-pulse shrink-0">
              <Volume2 className="w-2.5 h-2.5" />
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {isMicMuted ? (
            <MicOff className="w-3 h-3 text-rose-500" />
          ) : (
            <Mic className="w-3 h-3 text-emerald-600" />
          )}
        </div>
      </div>
    </div>
  );
}

export function WebRTCCall({
  participants = [],
  currentUserId,
  localStream,
  remoteStreams = new Map(),
  isMicMuted,
  isCamOff,
  speakingPeers = new Set(),
  partnerMediaStates = new Map(),
  partnerVoiceVolume,
  onToggleLocalCam,
  onToggleLocalMic,
  partnerName = 'Partner',
  remoteStream = null,
  partnerMicMuted = false,
  partnerCamOff = false,
  isPartnerSpeaking = false,
}: WebRTCCallProps) {
  const localVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  const remoteParticipants = participants.filter((p) => p.id !== currentUserId);

  return (
    <div className="flex flex-col h-full min-h-0 justify-between gap-2.5 text-gray-900">
      {/* Mesh Call Stats Banner */}
      <div className="flex items-center justify-between px-1 text-[10px] text-gray-500 font-medium shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span className="text-gray-800 font-bold text-xs">
            Group Video ({participants.length || 1})
          </span>
        </div>
        <span className="text-gray-500 text-[10px] font-mono font-medium">
          Mesh P2P • Direct
        </span>
      </div>

      {/* Video Grid */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-0.5 flex flex-col justify-center">
        {remoteParticipants.length === 0 ? (
          remoteStream ? (
            <RemoteVideoTile
              participant={{ id: 'legacy-partner', name: partnerName, isHost: false, isMicOn: !partnerMicMuted, isCamOn: !partnerCamOff }}
              stream={remoteStream}
              isSpeaking={isPartnerSpeaking}
              isMicMuted={partnerMicMuted}
              isCamOff={partnerCamOff}
              volume={partnerVoiceVolume}
            />
          ) : (
            <div className="w-full flex-1 min-h-[220px] rounded-2xl border border-orange-200/80 bg-orange-50/40 flex flex-col items-center justify-center text-center p-5 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 border border-orange-200 flex items-center justify-center mb-3 text-[#FF5722] shadow-2xs">
                <Users className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-gray-900">Waiting for friends...</p>
              <p className="text-xs text-gray-600 mt-1 max-w-[240px] leading-relaxed">
                Share your room invite link to connect video &amp; voice in real time!
              </p>
            </div>
          )
        ) : (
          <div
            className={`grid gap-2 ${
              remoteParticipants.length === 1
                ? 'grid-cols-1'
                : remoteParticipants.length === 2
                ? 'grid-cols-1 sm:grid-cols-2'
                : 'grid-cols-2'
            }`}
          >
            {remoteParticipants.map((p) => {
              const stream = remoteStreams.get(p.id) || null;
              const mediaState = partnerMediaStates.get(p.id);
              const isPeerMicMuted = mediaState ? mediaState.isMicMuted : !p.isMicOn;
              const isPeerCamOff = mediaState ? mediaState.isCamOff : !p.isCamOn;
              const isSpeaking = speakingPeers.has(p.id);

              return (
                <RemoteVideoTile
                  key={p.id}
                  participant={p}
                  stream={stream}
                  isSpeaking={isSpeaking}
                  isMicMuted={isPeerMicMuted}
                  isCamOff={isPeerCamOff}
                  volume={partnerVoiceVolume}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Local User Mini Preview (Self PiP) */}
      <div className="relative flex items-center justify-between p-2.5 rounded-xl border border-gray-200 bg-white shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="relative w-12 h-9 rounded-lg overflow-hidden bg-slate-900 border border-gray-200 shrink-0">
            {localStream && !isCamOff ? (
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover -scale-x-100"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-gray-400">
                Off
              </div>
            )}
          </div>
          <div>
            <span className="text-xs font-bold text-gray-900 block leading-none">You (Self)</span>
            <span className="text-[11px] text-gray-500 font-medium mt-0.5 block">
              {isMicMuted || !localStream ? 'Mic Off' : 'Mic Live'} • {isCamOff || !localStream ? 'Cam Off' : 'Cam Live'}
            </span>
          </div>
        </div>

        {/* Local Quick Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onToggleLocalCam}
            aria-label={isCamOff ? 'Turn camera on' : 'Turn camera off'}
            className={`p-2 rounded-xl border transition cursor-pointer ${
              isCamOff
                ? 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100'
                : 'bg-orange-50 text-[#E64A19] border-orange-200 hover:bg-orange-100'
            }`}
            title={isCamOff ? 'Turn Camera On' : 'Turn Camera Off'}
          >
            {isCamOff ? <VideoOff className="w-3.5 h-3.5" /> : <Video className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onToggleLocalMic}
            aria-label={isMicMuted ? 'Unmute microphone' : 'Mute microphone'}
            className={`p-2 rounded-xl border transition cursor-pointer ${
              isMicMuted
                ? 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
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
