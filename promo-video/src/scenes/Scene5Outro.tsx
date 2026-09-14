import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, Img, staticFile } from "remotion";
import { GlowOrb } from "../components/GlowOrb";
import { ParticleField } from "../components/ParticleField";

export const Scene5Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const introSpring = spring({
    frame,
    fps,
    config: { damping: 10, mass: 0.8, stiffness: 120 },
  });

  // CTA Button spring
  const ctaSpring = spring({
    frame: frame - 20,
    fps,
    config: { damping: 12, mass: 0.9, stiffness: 140 },
  });

  // Button pulse
  const btnPulse = interpolate((frame % 45), [0, 22, 45], [1, 1.04, 1]);

  return (
    <div className="relative w-full h-full bg-[#07090E] flex flex-col items-center justify-center overflow-hidden font-sans select-none">
      <GlowOrb color="#00F2FE" size={800} x={300} y={100} />
      <GlowOrb color="#7928CA" size={750} x={1000} y={250} delay={15} />
      <ParticleField />

      <div
        className="relative z-10 w-full max-w-4xl flex flex-col items-center text-center px-8"
        style={{
          transform: `scale(${introSpring})`,
        }}
      >
        {/* Official Brand Logo Mark */}
        <div className="w-28 h-28 rounded-3xl bg-black/60 border-2 border-cyan-400/60 p-2 flex items-center justify-center shadow-[0_0_50px_rgba(0,242,254,0.5)] mb-6 backdrop-blur-xl overflow-hidden">
          <Img
            src={staticFile("icon.png")}
            alt="CouchSync Live Logo"
            className="w-full h-full object-contain rounded-2xl drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
          />
        </div>

        {/* Big Brand Header */}
        <h2 className="text-7xl font-black text-white tracking-tight flex items-center gap-4 drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)]">
          <span>CouchSync</span>
          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 bg-clip-text text-transparent px-4 py-0.5 rounded-2xl bg-cyan-500/10 border border-cyan-400/40">
            Live
          </span>
        </h2>

        <p className="text-2xl font-bold text-gray-200 mt-4 max-w-2xl leading-relaxed">
          Your free, private virtual cinema lounge for synchronized movie nights.
        </p>

        {/* 3 Reassurance Badges */}
        <div className="flex items-center justify-center gap-6 mt-8">
          <div className="px-5 py-2.5 rounded-2xl bg-white/5 border border-white/15 text-sm font-bold text-cyan-300 backdrop-blur-md shadow-lg flex items-center gap-2">
            <span>✨</span> No Sign-up Required
          </div>
          <div className="px-5 py-2.5 rounded-2xl bg-white/5 border border-white/15 text-sm font-bold text-emerald-300 backdrop-blur-md shadow-lg flex items-center gap-2">
            <span>🛡️</span> 100% Free Forever
          </div>
          <div className="px-5 py-2.5 rounded-2xl bg-white/5 border border-white/15 text-sm font-bold text-violet-300 backdrop-blur-md shadow-lg flex items-center gap-2">
            <span>⚡</span> Direct &amp; Instant Sync
          </div>
        </div>

        {/* Massive Pulsing Call to Action Button */}
        <div
          className="mt-10"
          style={{
            transform: `scale(${Math.max(0, ctaSpring) * btnPulse})`,
            opacity: Math.max(0, ctaSpring),
          }}
        >
          <div className="px-10 py-5 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-600 text-white font-black text-2xl shadow-[0_0_60px_rgba(0,242,254,0.6)] border border-cyan-300/40 flex items-center gap-4 cursor-pointer">
            <span>▶</span>
            <span>Start Your Room in 5 Seconds</span>
            <span>→</span>
          </div>
        </div>

        {/* Domain URL spotlight */}
        <div className="mt-8">
          <span className="font-mono text-2xl font-black tracking-widest text-cyan-400/90 shadow-[0_0_20px_rgba(0,242,254,0.3)] px-6 py-2 rounded-xl bg-black/40 border border-cyan-400/30">
            couchsync.live
          </span>
        </div>
      </div>
    </div>
  );
};
