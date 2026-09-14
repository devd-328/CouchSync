import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, Img, staticFile } from "remotion";
import { GlowOrb } from "../components/GlowOrb";
import { ParticleField } from "../components/ParticleField";

export const Scene1Hero: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Popcorn entrance bounce
  const popScale = spring({
    frame,
    fps,
    config: { damping: 10, mass: 0.8, stiffness: 120 },
  });

  // Title spring in
  const titleSpring = spring({
    frame: frame - 15,
    fps,
    config: { damping: 12, mass: 0.9, stiffness: 100 },
  });

  // Subtitle fade and slide
  const subtitleOpacity = interpolate(frame, [35, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subtitleY = interpolate(frame, [35, 60], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Laser beam width
  const laserWidth = interpolate(frame, [25, 75], [0, 680], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Floating ambient motion
  const floatY = Math.sin(frame / 15) * 8;
  const rotateDeg = Math.sin(frame / 20) * 3;

  return (
    <div className="relative w-full h-full bg-[#07090E] flex flex-col items-center justify-center overflow-hidden font-sans select-none">
      {/* Dynamic Background Glows */}
      <GlowOrb color="#00F2FE" size={650} x={150} y={100} />
      <GlowOrb color="#7928CA" size={700} x={1100} y={300} delay={30} />
      <GlowOrb color="#10B981" size={500} x={650} y={600} delay={60} />
      <ParticleField />

      {/* Hero Content Container */}
      <div
        className="relative z-10 flex flex-col items-center text-center px-8"
        style={{
          transform: `translateY(${floatY}px) rotate(${rotateDeg}deg)`,
        }}
      >
        {/* Glowing Official Logo with Aura */}
        <div
          className="relative mb-6"
          style={{
            transform: `scale(${popScale})`,
          }}
        >
          <div className="absolute inset-0 bg-cyan-400/40 rounded-full blur-2xl scale-150 animate-pulse" />
          <div className="relative w-36 h-36 rounded-3xl bg-black/60 border-2 border-cyan-400/60 p-2.5 flex items-center justify-center shadow-[0_0_60px_rgba(0,242,254,0.5)] backdrop-blur-xl overflow-hidden">
            <Img
              src={staticFile("icon.png")}
              alt="CouchSync Live Logo"
              className="w-full h-full object-contain rounded-2xl drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
            />
          </div>
        </div>

        {/* Top Feature Pill */}
        <div
          className="mb-4 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/15 text-sm font-bold text-cyan-300 backdrop-blur-md shadow-[0_0_20px_rgba(0,242,254,0.2)]"
          style={{
            opacity: interpolate(frame, [10, 30], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            transform: `translateY(${interpolate(frame, [10, 30], [-20, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })}px)`,
          }}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#00F2FE]" />
          <span>Next-Gen Virtual Cinema Lounge</span>
        </div>

        {/* Brand Title: CouchSync Live */}
        <div
          style={{
            transform: `scale(${Math.max(0, titleSpring)})`,
            opacity: Math.max(0, titleSpring),
          }}
        >
          <h1 className="text-8xl font-black text-white tracking-tight flex items-center gap-4 drop-shadow-[0_15px_35px_rgba(0,0,0,0.9)]">
            <span className="bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent">
              CouchSync
            </span>
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 bg-clip-text text-transparent px-4 py-1 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 shadow-[0_0_40px_rgba(0,242,254,0.3)]">
              Live
            </span>
          </h1>
        </div>

        {/* Glowing Laser Sweep Line */}
        <div className="relative my-6 h-1 bg-white/10 rounded-full overflow-hidden" style={{ width: "680px" }}>
          <div
            className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 shadow-[0_0_15px_#00F2FE]"
            style={{ width: `${laserWidth}px` }}
          />
        </div>

        {/* Subtitle */}
        <div
          style={{
            opacity: subtitleOpacity,
            transform: `translateY(${subtitleY}px)`,
          }}
        >
          <p className="text-3xl font-semibold text-gray-200 tracking-wide">
            Watch Movies Together in Perfect Real-Time Sync
          </p>
          <div className="mt-4 flex items-center justify-center gap-6 text-sm font-bold text-gray-400">
            <span className="flex items-center gap-2 text-cyan-300">
              <span className="text-cyan-400">⚡</span> Instant Zero-Lag Sync
            </span>
            <span>•</span>
            <span className="flex items-center gap-2 text-emerald-300">
              <span className="text-emerald-400">🛡️</span> 100% Private &amp; Free
            </span>
            <span>•</span>
            <span className="flex items-center gap-2 text-violet-300">
              <span className="text-violet-400">🚀</span> No Accounts Needed
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
