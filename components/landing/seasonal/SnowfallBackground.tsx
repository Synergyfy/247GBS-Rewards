'use client';

import React, { useEffect, useState } from 'react';

const SnowfallBackground = ({ color = 'bg-blue-200' }: { color?: string }) => {
  const [flakes, setFlakes] = useState<Array<{ id: number; left: string; animationDuration: string; opacity: number; size: string; delay: string }>>([]);

  useEffect(() => {
    // Generate a fixed number of snowflakes on the client side to avoid hydration mismatches
    const flakeCount = 50;
    const newFlakes = Array.from({ length: flakeCount }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 5 + 10}s`, // Slow, 10-15s fall
      opacity: Math.random() * 0.4 + 0.2, // Subtle opacity
      size: `${Math.random() * 8 + 6}px`, // Increased sizes: 6px to 14px
      delay: `-${Math.random() * 10}s`, // Start at random times
    }));
    setFlakes(newFlakes);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <style jsx>{`
        @keyframes snowfall {
          0% {
            transform: translateY(-10vh) translateX(-10px);
          }
          50% {
             transform: translateY(50vh) translateX(10px);
          }
          100% {
            transform: translateY(110vh) translateX(-10px);
          }
        }
      `}</style>
      {flakes.map((flake) => (
        <div
          key={flake.id}
          className={`absolute rounded-full blur-[1px] ${color}`}
          style={{
            left: flake.left,
            top: '-10px',
            width: flake.size,
            height: flake.size,
            opacity: flake.opacity,
            animation: `snowfall ${flake.animationDuration} linear infinite`,
            animationDelay: flake.delay,
          }}
        />
      ))}
      {/* Add a subtle gradient overlay to ensure text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/0 via-white/5 to-white/20" />
    </div>
  );
};

export default SnowfallBackground;
