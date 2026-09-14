import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

interface Particle {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  color: string;
}

const PARTICLES: Particle[] = Array.from({ length: 45 }).map((_, i) => ({
  x: (i * 47) % 1920,
  y: (i * 83) % 1080,
  size: (i % 4) + 2,
  speed: ((i % 5) + 1) * 0.8,
  opacity: ((i % 6) + 3) * 0.1,
  color: i % 3 === 0 ? "#00F2FE" : i % 3 === 1 ? "#7928CA" : "#10B981",
}));

export const ParticleField: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {PARTICLES.map((p, i) => {
        const yOffset = (p.y + frame * p.speed) % 1080;
        const pulse = interpolate(
          (frame + i * 15) % 90,
          [0, 45, 90],
          [p.opacity * 0.5, p.opacity, p.opacity * 0.5],
        );

        return (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${p.x}px`,
              top: `${yOffset}px`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.color,
              opacity: pulse,
              boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
            }}
          />
        );
      })}
    </div>
  );
};
