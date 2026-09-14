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
  // Backwards compatibility props for 1:1 calls
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
      className={`relative aspect-4/3 rounded-2xl overflow-hidden glass-panel transition-all duration-300 ${
        isSpeaking
          ? 'speaking-border border-cyan-400 shadow-[0_0_20px_rgba(0,242,254,0.4)]'
          : 'border-white/10'
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
        <div className="w-full h-full flex flex-col items-center justify-center bg-linear-to-br from-slate-900 via-indigo-950 to-slate-900 p-2">
          <div className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-lg font-bold text-cyan-300 shadow-inner">
            {participant.name.charAt(0).toUpperCase()}
          </div>
          <span className="text-[10px] sm:text-[11px] text-gray-400 mt-2 px-2 text-center truncate max-w-full font-medium">
            {isCamOff ? `${participant.name}'s camera off` : `Connecting ${participant.name}...`}
          </span>
        </div>
      )}

      {/* Participant Info Overlay */}
      <div className="absolute bottom-1.5 inset-x-1.5 flex items-center justify-between px-2.5 py-1 rounded-xl bg-black/65 backdrop-blur-md text-[11px] font-medium">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-gray-100 font-semibold truncate">{participant.name}</span>
          {isSpeaking && (
            <span className="flex items-center gap-0.5 text-cyan-400 text-[9px] uppercase font-bold tracking-wider animate-pulse shrink-0">
              <Volume2 className="w-2.5 h-2.5" />
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {isMicMuted ? (
            <MicOff className="w-3 h-3 text-rose-400" />
          ) : (
            <Mic className="w-3 h-3 text-emerald-400" />
          )}
        </div>
      </div>
    </div>
  );
}

export function WebRTCCall({
  participants = [],
  currentUserId = '',
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

  // Bind local stream
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  // Determine remote participants list
  const remoteParticipants = participants.filter((p) => p.id !== currentUserId);

  return (
    <div className="flex flex-col gap-2.5 h-full flex-1 justify-between">
      {/* Top Header: Soft Group-Size Cap Indicator */}
      <div className="flex items-center justify-between px-1 text-[10px] text-gray-400 font-medium shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-gray-200 font-semibold">
            Group Video ({Math.max(1, participants.length)})
          </span>
        </div>
        <span className="text-gray-400 text-[9px] font-mono">
          Mesh P2P • Best for ≤5
        </span>
      </div>

      {/* Video Grid */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-0.5 flex flex-col justify-center">
        {remoteParticipants.length === 0 ? (
          // Fallback for single user in room or 1:1 legacy view
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
            <div className="w-full flex-1 min-h-[200px] rounded-2xl border border-white/10 glass-panel flex flex-col items-center justify-center text-center p-4 bg-slate-950/60">
              <div className="w-11 h-11 rounded-full bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center mb-2 text-cyan-400">
                <Users className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-gray-200">Waiting for friends...</p>
              <p className="text-[10px] text-gray-400 mt-0.5 max-w-[200px]">
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
      <div className="relative flex items-center justify-between p-2 rounded-xl glass-panel border-white/10 bg-white/2">
        <div className="flex items-center gap-2.5">
          <div className="relative w-12 h-9 rounded-lg overflow-hidden bg-slate-900 border border-white/10 shrink-0">
            {localStream && !isCamOff ? (
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover -scale-x-100"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[10px] font-medium text-gray-500">
                Off
              </div>
            )}
          </div>
          <div>
            <span className="text-xs font-semibold text-gray-200 block leading-none">You (Self)</span>
            <span className="text-[10px] text-gray-400 mt-0.5 block">
              {isMicMuted ? 'Muted' : 'Mic Live'} • {isCamOff ? 'Cam Off' : 'Cam Live'}
            </span>
          </div>
        </div>

        {/* Local Quick Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onToggleLocalCam}
            aria-label={isCamOff ? 'Turn camera on' : 'Turn camera off'}
            className={`p-1.5 rounded-lg border transition cursor-pointer ${
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
            aria-label={isMicMuted ? 'Unmute microphone' : 'Mute microphone'}
            className={`p-1.5 rounded-lg border transition cursor-pointer ${
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
