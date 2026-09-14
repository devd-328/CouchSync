import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

interface GlowOrbProps {
  color?: string;
  size?: number;
  x?: number;
  y?: number;
  delay?: number;
}

export const GlowOrb: React.FC<GlowOrbProps> = ({
  color = "#00F2FE",
  size = 500,
  x = 0,
  y = 0,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const adjustedFrame = Math.max(0, frame - delay);

  const scale = interpolate(
    (adjustedFrame % 120),
    [0, 60, 120],
    [0.9, 1.15, 0.9],
  );

  const opacity = interpolate(
    (adjustedFrame % 120),
    [0, 60, 120],
    [0.15, 0.28, 0.15],
  );

  return (
    <div
      className="absolute rounded-full pointer-events-none blur-[140px]"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color,
        opacity,
        transform: `scale(${scale})`,
      }}
    />
  );
};
