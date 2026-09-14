import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { GlowOrb } from "../components/GlowOrb";
import { ParticleField } from "../components/ParticleField";

const FEATURES = [
  {
    icon: "📹",
    title: "Direct Private Calls",
    sub: "100% private video/voice chat directly between devices with zero middleman servers.",
    badge: "Encrypted & Direct",
    badgeColor: "border-cyan-400/40 text-cyan-300 bg-cyan-500/15",
    color: "#00F2FE",
  },
  {
    icon: "🎚️",
    title: "Smart Voice Auto-Quiet",
    sub: "Movie volume automatically softens by 35% when friends speak so nobody has to shout.",
    badge: "Auto Audio Ducking",
    badgeColor: "border-emerald-400/40 text-emerald-300 bg-emerald-500/15",
    color: "#10B981",
  },
  {
    icon: "📺",
    title: "YouTube & Screen Share",
    sub: "Watch synchronized YouTube links or stream your desktop, window, or tab in smooth 60 FPS.",
    badge: "60 FPS Streaming",
    badgeColor: "border-violet-400/40 text-violet-300 bg-violet-500/15",
    color: "#8B5CF6",
  },
  {
    icon: "🎮",
    title: "Movie Trivia & Polls",
    sub: "Keep the party hyped with multiplayer trivia games, live countdowns, and community voting.",
    badge: "Live Mini-Games",
    badgeColor: "border-amber-400/40 text-amber-300 bg-amber-500/15",
    color: "#F59E0B",
  },
];

const EMOJIS = ["🍿", "🔥", "❤️", "😂", "😱", "👏", "🍿", "🔥", "❤️", "🎉", "✨", "🍿"];

export const Scene4Features: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div className="relative w-full h-full bg-[#07090E] flex flex-col items-center justify-center overflow-hidden font-sans select-none">
      <GlowOrb color="#7928CA" size={700} x={150} y={150} />
      <GlowOrb color="#00F2FE" size={600} x={1150} y={250} delay={20} />
      <ParticleField />

      {/* Floating Burst of Animated Emojis */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {EMOJIS.map((emoji, i) => {
          const delay = (i * 12) % 60;
          const emojiFrame = Math.max(0, frame - delay);
          const y = interpolate(emojiFrame, [0, 90], [1100, -100]);
          const x = 200 + ((i * 145) % 1500) + Math.sin(emojiFrame / 10 + i) * 35;
          const opacity = interpolate(emojiFrame, [0, 20, 75, 90], [0, 1, 1, 0]);
          const scale = interpolate(emojiFrame, [0, 20, 80], [0.5, 1.3, 0.9]);

          return (
            <div
              key={i}
              className="absolute text-5xl filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
              style={{
                left: `${x}px`,
                top: `${y}px`,
                opacity,
                transform: `scale(${scale}) rotate(${Math.sin(emojiFrame / 15) * 20}deg)`,
              }}
            >
              {emoji}
            </div>
          );
        })}
      </div>

      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center px-6">
        {/* Title */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-violet-500/15 border border-violet-400/40 text-violet-300 text-xs font-bold uppercase tracking-widest mb-3 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
            <span>✨ Packed With Features</span>
          </div>
          <h2 className="text-5xl font-black text-white tracking-tight">
            The Ultimate Virtual Cinema Lounge
          </h2>
          <p className="text-lg text-gray-300 mt-1">
            Built for cinephiles, couples, and friends everywhere
          </p>
        </div>

        {/* 4 Feature Cards Grid */}
        <div className="grid grid-cols-2 gap-6 w-full">
          {FEATURES.map((feat, i) => {
            const cardSpring = spring({
              frame: frame - i * 8,
              fps,
              config: { damping: 12, stiffness: 100 },
            });

            return (
              <div
                key={i}
                className="bg-black/60 border-2 rounded-3xl p-6 shadow-2xl backdrop-blur-xl flex flex-col justify-between"
                style={{
                  borderColor: `${feat.color}40`,
                  boxShadow: `0 0 40px ${feat.color}20`,
                  transform: `scale(${Math.max(0, cardSpring)}) translateY(${interpolate(
                    cardSpring,
                    [0, 1],
                    [40, 0],
                  )}px)`,
                  opacity: Math.max(0, cardSpring),
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl border shadow-inner"
                      style={{
                        backgroundColor: `${feat.color}15`,
                        borderColor: `${feat.color}50`,
                      }}
                    >
                      {feat.icon}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${feat.badgeColor}`}>
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-white mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {feat.sub}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-white/10 flex items-center gap-2 text-xs font-bold text-gray-400">
                  <span className="text-emerald-400">✓</span> Instant Zero-Config
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
