import React from "react";
import { Sequence, useCurrentFrame, interpolate, Audio, staticFile } from "remotion";
import { Scene1Hero } from "./scenes/Scene1Hero";
import { Scene2Problem } from "./scenes/Scene2Problem";
import { Scene3SyncSolution } from "./scenes/Scene3SyncSolution";
import { Scene4Features } from "./scenes/Scene4Features";
import { Scene5Outro } from "./scenes/Scene5Outro";

export const CouchSyncPromo: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div className="relative w-full h-full bg-[#07090E] overflow-hidden">
      {/* 🎙️ ElevenLabs AI Voiceover Track */}
      <Audio src={staticFile("voiceover.mp3")} volume={1.0} />

      {/* Scene 1: Hero Logo Hook (0s - 6s / 0 - 180 frames) */}
      <Sequence durationInFrames={180}>
        <div
          className="w-full h-full"
          style={{
            opacity: interpolate(frame, [165, 180], [1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <Scene1Hero />
        </div>
      </Sequence>

      {/* Scene 2: The Desync Problem (6s - 12s / 180 - 360 frames) */}
      <Sequence from={180} durationInFrames={180}>
        <div
          className="w-full h-full"
          style={{
            opacity: interpolate(frame, [180, 195, 345, 360], [0, 1, 1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <Scene2Problem />
        </div>
      </Sequence>

      {/* Scene 3: Instant Sync Solution (12s - 19s / 360 - 570 frames) */}
      <Sequence from={360} durationInFrames={210}>
        <div
          className="w-full h-full"
          style={{
            opacity: interpolate(frame, [360, 375, 555, 570], [0, 1, 1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <Scene3SyncSolution />
        </div>
      </Sequence>

      {/* Scene 4: Features Explosion (19s - 25s / 570 - 750 frames) */}
      <Sequence from={570} durationInFrames={180}>
        <div
          className="w-full h-full"
          style={{
            opacity: interpolate(frame, [570, 585, 735, 750], [0, 1, 1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <Scene4Features />
        </div>
      </Sequence>

      {/* Scene 5: Grand Finale Outro (25s - 30s / 750 - 900 frames) */}
      <Sequence from={750} durationInFrames={150}>
        <div
          className="w-full h-full"
          style={{
            opacity: interpolate(frame, [750, 765], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <Scene5Outro />
        </div>
      </Sequence>
    </div>
  );
};
