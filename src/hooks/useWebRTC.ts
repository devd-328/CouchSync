'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { WebRTCSignalAction, RoomParticipant } from '@/types/sync';
import { WEBRTC_CONFIG, AUDIO_CONFIG } from '@/config/constants';

interface UseWebRTCOptions {
  userId: string;
  onSendSignal: (action: WebRTCSignalAction) => void;
}

export function useWebRTC({ userId, onSendSignal }: UseWebRTCOptions) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map());
  const [isMicMuted, setIsMicMuted] = useState<boolean>(false);
  const [isCamOff, setIsCamOff] = useState<boolean>(false);
  const [partnerMediaStates, setPartnerMediaStates] = useState<
    Map<string, { isMicMuted: boolean; isCamOff: boolean }>
  >(new Map());
  const [speakingPeers, setSpeakingPeers] = useState<Set<string>>(new Set());
  const [connectionState, setConnectionState] = useState<string>('idle');
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [remoteScreenStream, setRemoteScreenStream] = useState<MediaStream | null>(null);
  const [isScreenSharing, setIsScreenSharing] = useState<boolean>(false);

  const onSendSignalRef = useRef(onSendSignal);
  onSendSignalRef.current = onSendSignal;

  // Mesh peer connections keyed by participantId
  const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const candidateQueueRef = useRef<Map<string, RTCIceCandidateInit[]>>(new Map());
  const remoteAudioAnalysersRef = useRef<
    Map<string, { ctx: AudioContext; analyser: AnalyserNode; interval: number }>
  >(new Map());
  const speakingPeersRef = useRef<Set<string>>(new Set());
  const fallbackTimersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // 1. Initialize Local Media Stream
  useEffect(() => {
    let active = true;

    async function initMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(WEBRTC_CONFIG.MEDIA_CONSTRAINTS);
        if (active) {
          localStreamRef.current = stream;
          setLocalStream(stream);
        }
      } catch (err) {
        console.warn('Camera/mic access unavailable:', err);
      }
    }

    initMedia();

    return () => {
      active = false;
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // 2. Remote audio volume check per-stream (speaking glow + audio ducking)
  const setupRemoteAudioDetection = useCallback((participantId: string, stream: MediaStream) => {
    try {
      const existing = remoteAudioAnalysersRef.current.get(participantId);
      if (existing) {
        clearInterval(existing.interval);
        if (existing.ctx.state !== 'closed') existing.ctx.close().catch(() => {});
        remoteAudioAnalysersRef.current.delete(participantId);
      }

      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const checkVolume = () => {
        if (!analyser) return;
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        const isSpeaking = avg > AUDIO_CONFIG.VAD_THRESHOLD;

        const wasSpeaking = speakingPeersRef.current.has(participantId);
        if (isSpeaking && !wasSpeaking) {
          speakingPeersRef.current.add(participantId);
          setSpeakingPeers(new Set(speakingPeersRef.current));
        } else if (!isSpeaking && wasSpeaking) {
          speakingPeersRef.current.delete(participantId);
          setSpeakingPeers(new Set(speakingPeersRef.current));
        }
      };

      const interval = window.setInterval(checkVolume, 120);
      remoteAudioAnalysersRef.current.set(participantId, { ctx, analyser, interval });
    } catch {
      // AudioContext policy
    }
  }, []);

  // 3. Flush candidate queue once remote description is set
  const flushCandidateQueue = useCallback(async (targetId: string, pc: RTCPeerConnection) => {
    const queue = candidateQueueRef.current.get(targetId);
    if (queue && queue.length > 0) {
      for (const cand of queue) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(cand));
        } catch (err) {
          console.warn(`Error applying queued ICE candidate for ${targetId}:`, err);
        }
      }
      candidateQueueRef.current.delete(targetId);
    }
  }, []);

  // 4. Peer Connection Factory (Mesh)
  const createPeerConnection = useCallback(
    (targetId: string) => {
      const existing = peerConnectionsRef.current.get(targetId);
      if (existing) {
        existing.close();
      }

      const pc = new RTCPeerConnection({
        iceServers: WEBRTC_CONFIG.ICE_SERVERS,
      });
      peerConnectionsRef.current.set(targetId, pc);

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          onSendSignalRef.current({
            type: 'signal-ice',
            candidate: event.candidate.toJSON(),
            senderId: userId,
            targetId,
          });
        }
      };

      pc.onconnectionstatechange = () => {
        setConnectionState(pc.connectionState);
      };

      pc.ontrack = (event) => {
        const stream = event.streams[0] || new MediaStream([event.track]);
        setRemoteStreams((prev) => {
          const next = new Map(prev);
          next.set(targetId, stream);
          return next;
        });
        setupRemoteAudioDetection(targetId, stream);
      };

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => {
          pc.addTrack(track, localStreamRef.current!);
        });
      }

      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((track) => {
          pc.addTrack(track, screenStreamRef.current!);
        });
      }

      return pc;
    },
    [userId, setupRemoteAudioDetection]
  );

  // 5. Cleanup single peer when they leave
  const cleanupPeer = useCallback((participantId: string) => {
    // Clear any fallback timer
    const timer = fallbackTimersRef.current.get(participantId);
    if (timer) {
      clearTimeout(timer);
      fallbackTimersRef.current.delete(participantId);
    }

    const pc = peerConnectionsRef.current.get(participantId);
    if (pc) {
      pc.close();
      peerConnectionsRef.current.delete(participantId);
    }

    candidateQueueRef.current.delete(participantId);

    const analyser = remoteAudioAnalysersRef.current.get(participantId);
    if (analyser) {
      clearInterval(analyser.interval);
      if (analyser.ctx.state !== 'closed') analyser.ctx.close().catch(() => {});
      remoteAudioAnalysersRef.current.delete(participantId);
    }

    if (speakingPeersRef.current.has(participantId)) {
      speakingPeersRef.current.delete(participantId);
      setSpeakingPeers(new Set(speakingPeersRef.current));
    }

    setRemoteStreams((prev) => {
      const next = new Map(prev);
      next.delete(participantId);
      return next;
    });

    setPartnerMediaStates((prev) => {
      const next = new Map(prev);
      next.delete(participantId);
      return next;
    });
  }, []);

  // 6. Initiate Call (Offer to a specific target peer)
  const initiateCall = useCallback(
    async (targetPartnerId?: string) => {
      if (!targetPartnerId || targetPartnerId === userId) return;

      const existing = peerConnectionsRef.current.get(targetPartnerId);
      if (existing) {
        if (existing.signalingState === 'have-local-offer' || existing.connectionState === 'connected') {
          return;
        }
      }

      const pc = createPeerConnection(targetPartnerId);
      try {
        const offer = await pc.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true,
        });
        await pc.setLocalDescription(offer);

        onSendSignalRef.current({
          type: 'signal-offer',
          sdp: offer,
          senderId: userId,
          targetId: targetPartnerId,
        });
        setConnectionState('calling');
      } catch (err) {
        console.error(`Failed to create WebRTC offer to ${targetPartnerId}:`, err);
      }
    },
    [createPeerConnection, userId]
  );

  // 7. Handle Incoming Signal (With strict signalingState validation)
  const handleRemoteSignal = useCallback(
    async (signal: WebRTCSignalAction) => {
      if (signal.senderId === userId) return;

      // In mesh topology, routed signaling must match this user's ID
      if (signal.type === 'signal-offer' || signal.type === 'signal-answer' || signal.type === 'signal-ice') {
        if (signal.targetId && signal.targetId !== userId) {
          return;
        }
      }

      switch (signal.type) {
        case 'signal-offer': {
          let pc = peerConnectionsRef.current.get(signal.senderId);

          // Handle offer glare (both sides offered simultaneously)
          if (pc && pc.signalingState === 'have-local-offer') {
            if (userId > signal.senderId) {
              // Higher ID has priority, ignore incoming colliding offer
              return;
            }
            // Lower ID yields and recreates connection
            try {
              await pc.setLocalDescription({ type: 'rollback' } as RTCSessionDescriptionInit);
            } catch {
              pc.close();
              pc = createPeerConnection(signal.senderId);
            }
          } else if (!pc || pc.signalingState === 'closed') {
            pc = createPeerConnection(signal.senderId);
          }

          // A remote offer can ONLY be accepted if signalingState is 'stable'
          if (pc.signalingState !== 'stable') {
            console.warn(`Ignoring signal-offer from ${signal.senderId}: state is ${pc.signalingState}, expected stable`);
            return;
          }

          try {
            await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
            await flushCandidateQueue(signal.senderId, pc);

            // An answer can ONLY be set when signalingState is 'have-remote-offer'
            if ((pc.signalingState as string) !== 'have-remote-offer') {
              console.warn(`Cannot set answer: state is ${pc.signalingState}, expected have-remote-offer`);
              return;
            }

            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);

            onSendSignalRef.current({
              type: 'signal-answer',
              sdp: answer,
              senderId: userId,
              targetId: signal.senderId,
            });
            setConnectionState('connected');
          } catch (err) {
            console.error(`Error handling offer from ${signal.senderId}:`, err);
          }
          break;
        }

        case 'signal-answer': {
          const pc = peerConnectionsRef.current.get(signal.senderId);
          if (!pc) {
            return;
          }

          // CRITICAL: A remote answer can ONLY be set when waiting for one ('have-local-offer')
          if (pc.signalingState !== 'have-local-offer') {
            console.warn(`Ignoring signal-answer from ${signal.senderId}: state is ${pc.signalingState}, expected have-local-offer`);
            return;
          }

          try {
            await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
            await flushCandidateQueue(signal.senderId, pc);
            setConnectionState('connected');
          } catch (err) {
            console.error(`Error handling answer from ${signal.senderId}:`, err);
          }
          break;
        }

        case 'signal-ice': {
          const pc = peerConnectionsRef.current.get(signal.senderId);
          if (!signal.candidate) return;

          // ICE candidate can only be applied after remoteDescription is set
          if (pc && pc.remoteDescription && pc.remoteDescription.type) {
            try {
              await pc.addIceCandidate(new RTCIceCandidate(signal.candidate));
            } catch (err) {
              console.warn(`Error adding ICE candidate from ${signal.senderId}:`, err);
            }
          } else {
            const queue = candidateQueueRef.current.get(signal.senderId) || [];
            queue.push(signal.candidate);
            candidateQueueRef.current.set(signal.senderId, queue);
          }
          break;
        }

        case 'media-toggle': {
          setPartnerMediaStates((prev) => {
            const next = new Map(prev);
            next.set(signal.senderId, {
              isMicMuted: !signal.audio,
              isCamOff: !signal.video,
            });
            return next;
          });
          break;
        }
      }
    },
    [userId, createPeerConnection, flushCandidateQueue]
  );

  // 8. Reconcile mesh peers: deterministic initiator rule (userId > peerId)
  const syncMeshPeers = useCallback(
    (activeParticipants: RoomParticipant[]) => {
      const activeIds = new Set(
        activeParticipants.map((p) => p.id).filter((id) => id !== userId)
      );

      // Clean up peers who left
      for (const peerId of Array.from(peerConnectionsRef.current.keys())) {
        if (!activeIds.has(peerId)) {
          cleanupPeer(peerId);
        }
      }

      // Connect to peers: peer with higher ID initiates the offer to prevent collisions
      for (const peerId of Array.from(activeIds)) {
        if (!peerConnectionsRef.current.has(peerId)) {
          if (userId > peerId) {
            initiateCall(peerId);
          } else {
            // Fallback timer: if peer with higher ID hasn't initiated in 4s, initiate as fallback
            if (!fallbackTimersRef.current.has(peerId)) {
              const timer = setTimeout(() => {
                fallbackTimersRef.current.delete(peerId);
                const pc = peerConnectionsRef.current.get(peerId);
                if (!pc || pc.connectionState !== 'connected') {
                  initiateCall(peerId);
                }
              }, 4000);
              fallbackTimersRef.current.set(peerId, timer);
            }
          }
        }
      }
    },
    [userId, cleanupPeer, initiateCall]
  );

  // 9. Device Toggles
  const toggleMic = useCallback(() => {
    if (!localStreamRef.current) return;
    const audioTrack = localStreamRef.current.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsMicMuted(!audioTrack.enabled);

      onSendSignalRef.current({
        type: 'media-toggle',
        audio: audioTrack.enabled,
        video: !isCamOff,
        senderId: userId,
      });
    }
  }, [userId, isCamOff]);

  const toggleCamera = useCallback(() => {
    if (!localStreamRef.current) return;
    const videoTrack = localStreamRef.current.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setIsCamOff(!videoTrack.enabled);

      onSendSignalRef.current({
        type: 'media-toggle',
        audio: !isMicMuted,
        video: videoTrack.enabled,
        senderId: userId,
      });
    }
  }, [userId, isMicMuted]);

  // 10. Screen Sharing Controls
  const stopScreenShare = useCallback(() => {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((t) => t.stop());
      screenStreamRef.current = null;
    }
    setScreenStream(null);
    setIsScreenSharing(false);
  }, []);

  const startScreenShare = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
      screenStreamRef.current = stream;
      setScreenStream(stream);
      setIsScreenSharing(true);

      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.onended = () => {
          stopScreenShare();
        };
      }

      // Add screen share tracks to all active peer connections
      for (const pc of peerConnectionsRef.current.values()) {
        stream.getTracks().forEach((track) => {
          pc.addTrack(track, stream);
        });
      }

      return stream;
    } catch (err) {
      console.warn('Screen share cancelled or not allowed:', err);
      return null;
    }
  }, [stopScreenShare]);

  useEffect(() => {
    return () => {
      for (const timer of fallbackTimersRef.current.values()) {
        clearTimeout(timer);
      }
      fallbackTimersRef.current.clear();

      for (const analyser of remoteAudioAnalysersRef.current.values()) {
        clearInterval(analyser.interval);
        if (analyser.ctx.state !== 'closed') analyser.ctx.close().catch(() => {});
      }
      remoteAudioAnalysersRef.current.clear();

      for (const pc of peerConnectionsRef.current.values()) {
        pc.close();
      }
      peerConnectionsRef.current.clear();

      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const firstRemoteStream = remoteStreams.values().next().value || null;
  const isAnyoneSpeaking = speakingPeers.size > 0;

  return {
    localStream,
    remoteStreams,
    remoteStream: firstRemoteStream,
    screenStream,
    remoteScreenStream,
    isScreenSharing,
    startScreenShare,
    stopScreenShare,
    isMicMuted,
    isCamOff,
    partnerMicMuted: firstRemoteStream
      ? partnerMediaStates.get(Array.from(remoteStreams.keys())[0])?.isMicMuted ?? false
      : false,
    partnerCamOff: firstRemoteStream
      ? partnerMediaStates.get(Array.from(remoteStreams.keys())[0])?.isCamOff ?? false
      : false,
    partnerMediaStates,
    speakingPeers,
    isPartnerSpeaking: isAnyoneSpeaking,
    connectionState,
    initiateCall,
    syncMeshPeers,
    cleanupPeer,
    handleRemoteSignal,
    toggleMic,
    toggleCamera,
  };
}
