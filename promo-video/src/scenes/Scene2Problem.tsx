import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { GlowOrb } from "../components/GlowOrb";
import { ParticleField } from "../components/ParticleField";

export const Scene2Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const introSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  // Chat Bubble 1 entry
  const bubble1Spring = spring({
    frame: frame - 15,
    fps,
    config: { damping: 12, stiffness: 110 },
  });

  // Chat Bubble 2 entry
  const bubble2Spring = spring({
    frame: frame - 35,
    fps,
    config: { damping: 12, stiffness: 110 },
  });

  // Chat Bubble 3 entry (Desync complaint)
  const bubble3Spring = spring({
    frame: frame - 60,
    fps,
    config: { damping: 10, stiffness: 120 },
  });

  // Jitter shake on spoiler alert
  const shakeX = frame > 80 ? Math.sin(frame * 0.8) * 6 : 0;
  const shakeY = frame > 80 ? Math.cos(frame * 0.8) * 4 : 0;

  // Warning Badge Pop
  const warningSpring = spring({
    frame: frame - 80,
    fps,
    config: { damping: 8, mass: 0.7, stiffness: 160 },
  });

  return (
    <div className="relative w-full h-full bg-[#07090E] flex flex-col items-center justify-center overflow-hidden font-sans select-none">
      <GlowOrb color="#E11D48" size={600} x={200} y={150} />
      <GlowOrb color="#F59E0B" size={550} x={1100} y={350} delay={20} />
      <ParticleField />

      <div
        className="relative z-10 w-full max-w-4xl flex flex-col items-center px-8"
        style={{
          transform: `scale(${introSpring})`,
        }}
      >
        {/* Section Heading */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold uppercase tracking-wider mb-3">
            <span>The Old Way Sucks</span>
          </div>
          <h2 className="text-5xl font-black text-white tracking-tight">
            We All Know The Struggle...
          </h2>
          <p className="text-xl text-gray-400 mt-2">
            Trying to watch movies together across long distance
          </p>
        </div>

        {/* Mock Phone Call / Chat Card */}
        <div className="w-full max-w-2xl bg-black/60 border border-white/15 rounded-3xl p-6 shadow-2xl backdrop-blur-xl space-y-4">
          {/* Mock Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 text-sm">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
              <span className="font-bold text-white">Discord Call • (Frustrated)</span>
            </div>
            <span className="text-gray-400 font-mono text-xs">00:42:15</span>
          </div>

          {/* Chat Messages */}
          <div className="space-y-3.5 pt-2">
            {/* Message 1 */}
            <div
              className="flex items-start gap-3"
              style={{
                transform: `scale(${Math.max(0, bubble1Spring)}) translateX(${interpolate(
                  bubble1Spring,
                  [0, 1],
                  [-40, 0],
                )}px)`,
                opacity: Math.max(0, bubble1Spring),
              }}
            >
              <div className="w-9 h-9 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center font-bold text-cyan-300 text-xs">
                A
              </div>
              <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 text-sm text-gray-200 rounded-tl-none">
                <p className="font-bold text-cyan-400 text-xs mb-1">Alex</p>
                <p>&ldquo;Ready? 3... 2... 1... PRESS PLAY!&rdquo;</p>
              </div>
            </div>

            {/* Message 2 */}
            <div
              className="flex items-start justify-end gap-3"
              style={{
                transform: `scale(${Math.max(0, bubble2Spring)}) translateX(${interpolate(
                  bubble2Spring,
                  [0, 1],
                  [40, 0],
                )}px)`,
                opacity: Math.max(0, bubble2Spring),
              }}
            >
              <div className="p-3.5 rounded-2xl bg-violet-600/30 border border-violet-400/30 text-sm text-gray-200 rounded-tr-none text-right">
                <p className="font-bold text-violet-400 text-xs mb-1">Maya</p>
                <p>&ldquo;Wait! I paused! Are you at 01:14:20 or 01:14:25?&rdquo;</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-violet-500/20 border border-violet-400/40 flex items-center justify-center font-bold text-violet-300 text-xs">
                M
              </div>
            </div>

            {/* Message 3 - Desync Reaction */}
            <div
              className="flex items-start gap-3"
              style={{
                transform: `scale(${Math.max(0, bubble3Spring)}) translateX(${interpolate(
                  bubble3Spring,
                  [0, 1],
                  [-40, 0],
                )}px)`,
                opacity: Math.max(0, bubble3Spring),
              }}
            >
              <div className="w-9 h-9 rounded-full bg-rose-500/20 border border-rose-400/40 flex items-center justify-center font-bold text-rose-300 text-xs">
                A
              </div>
              <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-sm text-rose-200 rounded-tl-none">
                <p className="font-bold text-rose-400 text-xs mb-1">Alex</p>
                <p>&ldquo;OMG NO! You just reacted to the spoiler 4 seconds early! 😭🤦‍♂️&rdquo;</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pulsing Warning Badge */}
        {frame > 75 && (
          <div
            className="mt-8 px-8 py-3.5 rounded-2xl bg-rose-600/20 border-2 border-rose-500 text-rose-300 font-black text-xl flex items-center gap-3 shadow-[0_0_50px_rgba(244,63,94,0.5)] backdrop-blur-xl"
            style={{
              transform: `scale(${Math.max(0, warningSpring)}) translate(${shakeX}px, ${shakeY}px)`,
              opacity: Math.max(0, warningSpring),
            }}
          >
            <span className="text-3xl">⚠️</span>
            <span>NO MORE COUNTDOWNS &amp; SPOILERS!</span>
          </div>
        )}
      </div>
    </div>
  );
};
