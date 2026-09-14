import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { GlowOrb } from "../components/GlowOrb";
import { ParticleField } from "../components/ParticleField";

export const Scene3SyncSolution: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const scale = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  // Timeline progress simulation (moving video playhead)
  const progressPercent = interpolate(frame, [0, 210], [35, 68]);

  // Speaking pulse
  const partnerPulse = interpolate((frame % 30), [0, 15, 30], [1, 1.08, 1]);

  return (
    <div className="relative w-full h-full bg-[#07090E] flex flex-col items-center justify-center overflow-hidden font-sans select-none">
      <GlowOrb color="#00F2FE" size={700} x={100} y={100} />
      <GlowOrb color="#3B82F6" size={600} x={1200} y={200} delay={15} />
      <ParticleField />

      <div
        className="relative z-10 w-full max-w-5xl flex flex-col items-center px-6"
        style={{
          transform: `scale(${scale})`,
        }}
      >
        {/* Header Badge */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 text-xs font-bold uppercase tracking-widest mb-3 shadow-[0_0_20px_rgba(0,242,254,0.3)]">
            <span>⚡ The Solution</span>
          </div>
          <h2 className="text-5xl font-black text-white tracking-tight">
            Sub-Second Instant Playback Sync
          </h2>
          <p className="text-lg text-gray-300 mt-1">
            Every play, pause, seek, and speed change propagates in &lt; 150ms
          </p>
        </div>

        {/* Dual Synchronized Player Mockup */}
        <div className="w-full bg-[#0E1322]/90 border-2 border-cyan-400/30 rounded-3xl p-6 shadow-[0_0_60px_rgba(0,242,254,0.25)] backdrop-blur-2xl">
          {/* Top Browser Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-rose-500/80" />
              <span className="w-3.5 h-3.5 rounded-full bg-amber-500/80" />
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500/80" />
              <span className="ml-3 px-4 py-1 rounded-lg bg-black/50 text-xs font-mono text-gray-300 border border-white/10">
                https://couchsync.live/room/neon-premiere
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-bold font-mono animate-pulse">
                ● LIVE SYNCED
              </span>
            </div>
          </div>

          {/* Main Cinema Screen Canvas */}
          <div className="relative w-full aspect-[21/9] rounded-2xl bg-gradient-to-tr from-cyan-950/60 via-purple-950/40 to-black border border-white/15 overflow-hidden flex flex-col justify-between p-6">
            {/* Ambient Movie Canvas Graphic */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(0,242,254,0.15),transparent_70%)] pointer-events-none" />

            {/* Movie Title Banner */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🎬</span>
                <div>
                  <h3 className="text-xl font-bold text-white">Interstellar (2014) • 4K HDR</h3>
                  <p className="text-xs text-cyan-300 font-mono">Audio Ducking Active (0.65x)</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-black/60 border border-cyan-400/40 text-cyan-300 font-mono text-xs font-bold shadow-[0_0_15px_rgba(0,242,254,0.3)]">
                DRIFT &lt; 0.02s
              </div>
            </div>

            {/* In-Video Webcams */}
            <div className="relative z-10 flex items-center justify-end gap-4 my-auto">
              {/* Webcam 1 (Host) */}
              <div className="w-32 h-24 rounded-2xl bg-black/60 border border-cyan-400/40 p-2 flex flex-col justify-between backdrop-blur-md shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-cyan-300">You (Host)</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                <div className="flex items-center justify-center text-2xl">😎</div>
                <span className="text-[9px] text-gray-400 text-center font-mono">1080p • 60fps</span>
              </div>

              {/* Webcam 2 (Partner speaking) */}
              <div
                className="w-32 h-24 rounded-2xl bg-emerald-950/40 border-2 border-emerald-400 p-2 flex flex-col justify-between backdrop-blur-md shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                style={{ transform: `scale(${partnerPulse})` }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-300">Maya</span>
                  <span className="text-[9px] px-1.5 rounded bg-emerald-500 text-black font-bold">TALKING</span>
                </div>
                <div className="flex items-center justify-center text-2xl">🍿</div>
                <span className="text-[9px] text-emerald-300 text-center font-mono">Volume Ducked 35%</span>
              </div>
            </div>

            {/* Synchronized Playback Control Bar */}
            <div className="relative z-10 space-y-2 pt-4">
              <div className="flex items-center justify-between text-xs font-mono text-gray-300">
                <span className="text-cyan-300 font-bold">01:14:20</span>
                <span className="font-bold text-emerald-400">⚡ LOCKSTEP REAL-TIME SYNC</span>
                <span>02:49:00</span>
              </div>

              {/* Progress Slider with Laser Head */}
              <div className="relative w-full h-3 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
                <div
                  className="absolute top-0 bottom-0 w-2 bg-white rounded-full shadow-[0_0_15px_#00F2FE]"
                  style={{ left: `calc(${progressPercent}% - 4px)` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
