import "./index.css";
import React from "react";
import { Composition } from "remotion";
import { CouchSyncPromo } from "./CouchSyncPromo";
import { Scene1Hero } from "./scenes/Scene1Hero";
import { Scene2Problem } from "./scenes/Scene2Problem";
import { Scene3SyncSolution } from "./scenes/Scene3SyncSolution";
import { Scene4Features } from "./scenes/Scene4Features";
import { Scene5Outro } from "./scenes/Scene5Outro";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Master 30-Second Promo Video (1080p @ 30fps) */}
      <Composition
        id="CouchSyncPromo"
        component={CouchSyncPromo}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Individual Scene Compositions for focused editing */}
      <Composition
        id="Scene1Hero"
        component={Scene1Hero}
        durationInFrames={180}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="Scene2Problem"
        component={Scene2Problem}
        durationInFrames={180}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="Scene3SyncSolution"
        component={Scene3SyncSolution}
        durationInFrames={210}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="Scene4Features"
        component={Scene4Features}
        durationInFrames={180}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="Scene5Outro"
        component={Scene5Outro}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
