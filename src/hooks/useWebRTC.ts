'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { WebRTCSignalAction } from '@/types/sync';
import { WEBRTC_CONFIG, AUDIO_CONFIG } from '@/config/constants';

interface UseWebRTCOptions {
  userId: string;
  onSendSignal: (action: WebRTCSignalAction) => void;
}

export function useWebRTC({ userId, onSendSignal }: UseWebRTCOptions) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isMicMuted, setIsMicMuted] = useState<boolean>(false);
  const [isCamOff, setIsCamOff] = useState<boolean>(false);
  const [partnerMicMuted, setPartnerMicMuted] = useState<boolean>(false);
  const [partnerCamOff, setPartnerCamOff] = useState<boolean>(false);
  const [isPartnerSpeaking, setIsPartnerSpeaking] = useState<boolean>(false);
  const [connectionState, setConnectionState] = useState<string>('idle');
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [remoteScreenStream, setRemoteScreenStream] = useState<MediaStream | null>(null);
  const [isScreenSharing, setIsScreenSharing] = useState<boolean>(false);

  const onSendSignalRef = useRef(onSendSignal);
  onSendSignalRef.current = onSendSignal;

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const remoteAudioAnalyserRef = useRef<{ ctx: AudioContext; analyser: AnalyserNode } | null>(null);
  const vadIntervalRef = useRef<number | null>(null);

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

  // 2. Remote audio volume check (speaking glow)
  const setupRemoteAudioDetection = useCallback((stream: MediaStream) => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);

      remoteAudioAnalyserRef.current = { ctx, analyser };
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const checkVolume = () => {
        if (!analyser) return;
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        setIsPartnerSpeaking(avg > AUDIO_CONFIG.VAD_THRESHOLD);
      };

      if (vadIntervalRef.current) clearInterval(vadIntervalRef.current);
      vadIntervalRef.current = window.setInterval(checkVolume, 120);
    } catch {
      // AudioContext policy
    }
  }, []);

  // 3. Peer Connection Factory
  const createPeerConnection = useCallback((targetId?: string) => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }

    const pc = new RTCPeerConnection({
      iceServers: WEBRTC_CONFIG.ICE_SERVERS,
    });
    peerConnectionRef.current = pc;

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
      setRemoteStream(stream);
      setupRemoteAudioDetection(stream);
    };

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current!);
      });
    }

    return pc;
  }, [userId, setupRemoteAudioDetection]);

  // 4. Initiate Call (Offer)
  const initiateCall = useCallback(async (targetPartnerId?: string) => {
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
      console.error('Failed to create WebRTC offer:', err);
    }
  }, [createPeerConnection, userId]);

  // 5. Handle Incoming Signal
  const handleRemoteSignal = useCallback(
    async (signal: WebRTCSignalAction) => {
      if (signal.senderId === userId) return;

      switch (signal.type) {
        case 'signal-offer': {
          const pc = createPeerConnection(signal.senderId);
          try {
            await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
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
            console.error('Error handling offer:', err);
          }
          break;
        }

        case 'signal-answer': {
          const pc = peerConnectionRef.current;
          if (pc && pc.signalingState !== 'stable') {
            try {
              await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
              setConnectionState('connected');
            } catch (err) {
              console.error('Error handling answer:', err);
            }
          }
          break;
        }

        case 'signal-ice': {
          const pc = peerConnectionRef.current;
          if (pc && signal.candidate) {
            try {
              await pc.addIceCandidate(new RTCIceCandidate(signal.candidate));
            } catch (err) {
              console.error('Error adding ICE candidate:', err);
            }
          }
          break;
        }

        case 'media-toggle': {
          setPartnerMicMuted(!signal.audio);
          setPartnerCamOff(!signal.video);
          break;
        }
      }
    },
    [userId, createPeerConnection]
  );

  // 6. Device Toggles
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

  // 7. Screen Sharing Controls
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

      if (peerConnectionRef.current) {
        stream.getTracks().forEach((track) => {
          peerConnectionRef.current?.addTrack(track, stream);
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
      if (vadIntervalRef.current) clearInterval(vadIntervalRef.current);
      if (remoteAudioAnalyserRef.current?.ctx.state !== 'closed') {
        remoteAudioAnalyserRef.current?.ctx.close().catch(() => {});
      }
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
    };
  }, []);

  return {
    localStream,
    remoteStream,
    screenStream,
    remoteScreenStream,
    isScreenSharing,
    startScreenShare,
    stopScreenShare,
    isMicMuted,
    isCamOff,
    partnerMicMuted,
    partnerCamOff,
    isPartnerSpeaking,
    connectionState,
    initiateCall,
    handleRemoteSignal,
    toggleMic,
    toggleCamera,
  };
}
