'use client';

import { useState, useEffect, useRef } from 'react';

export function useAudioMeter(stream: MediaStream | null, barsCount: number = 16) {
  const [frequencies, setFrequencies] = useState<number[]>(new Array(barsCount).fill(0));
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const animationFrameRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (!stream) {
      setFrequencies(new Array(barsCount).fill(0));
      setIsSpeaking(false);
      return;
    }

    const audioTracks = stream.getAudioTracks();
    if (audioTracks.length === 0 || !audioTracks[0].enabled) {
      setFrequencies(new Array(barsCount).fill(0));
      setIsSpeaking(false);
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.8;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateMeter = () => {
        analyser.getByteFrequencyData(dataArray);

        // Calculate visual bars
        const step = Math.floor(bufferLength / barsCount);
        const newBars: number[] = [];
        let total = 0;

        for (let i = 0; i < barsCount; i++) {
          const val = dataArray[i * step] || 0;
          newBars.push(Math.round((val / 255) * 100));
          total += val;
        }

        const avg = total / bufferLength;
        setIsSpeaking(avg > 15);
        setFrequencies(newBars);

        animationFrameRef.current = requestAnimationFrame(updateMeter);
      };

      updateMeter();
    } catch {
      // Audio context might fail if autoplay policy blocks or stream is restricted
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, [stream, barsCount]);

  return { frequencies, isSpeaking };
}
