'use client';

import React, { useEffect, useState } from 'react';

const SakuraBackground = () => {
  const [petals, setPetals] = useState<Array<{ id: number; left: string; animationDuration: string; delay: string; scale: number; rotation: string }>>([]);
  const [blooms, setBlooms] = useState<Array<{ id: number; top: string; left: string; delay: string; scale: number }>>([]);

  useEffect(() => {
    // 1. Generate Falling Petals
    const petalCount = 30;
    const newPetals = Array.from({ length: petalCount }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 10 + 10}s`, // 10-20s fall
      delay: `-${Math.random() * 10}s`,
      scale: Math.random() * 0.5 + 0.5,
      rotation: `${Math.random() * 360}deg`,
    }));
    setPetals(newPetals);

    // 2. Generate Static "Blooms" that pulse/appear
    const bloomCount = 8;
    const newBlooms = Array.from({ length: bloomCount }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 80 + 10}%`,
      left: `${Math.random() * 90 + 5}%`,
      delay: `${Math.random() * 5}s`,
      scale: Math.random() * 0.5 + 0.8,
    }));
    setBlooms(newBlooms);
  }, []);

  const PetalIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12,2C12,2 14,8 18,10C22,12 22,16 20,18C18,20 14,20 12,18C10,20 6,20 4,18C2,16 2,12 6,10C10,8 12,2 12,2Z" />
    </svg>
  );

  const FlowerIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12,2C13.1,2 14,2.9 14,4C14,4.7 13.6,5.3 13,5.7V7.3C13.6,7.7 14,8.3 14,9C14,10.1 13.1,11 12,11C10.9,11 10,10.1 10,9C10,8.3 10.4,7.7 11,7.3V5.7C10.4,5.3 10,4.7 10,4C10,2.9 10.9,2 12,2M19,9C19,10.1 18.1,11 17,11C16.3,11 15.7,10.6 15.3,10H13.7C13.3,10.6 12.7,11 12,11C12,12.1 12.9,13 14,13C14.7,13 15.3,12.6 15.7,12H17.3C17.7,12.6 18.3,13 19,13C20.1,13 21,12.1 21,11C21,9.9 20.1,9 19,9M12,13C11.3,13 10.7,12.6 10.3,12H8.7C8.3,12.6 7.7,13 7,13C5.9,13 5,12.1 5,11C5,9.9 5.9,9 7,9C7.7,9 8.3,9.4 8.7,10H10.3C10.7,9.4 11.3,9 12,9C12,10.1 12.9,11 14,11C14,12.1 13.1,13 12,13M12,22C10.9,22 10,21.1 10,20C10,19.3 10.4,18.7 11,18.3V16.7C10.4,16.3 10,15.7 10,15C10,13.9 10.9,13 12,13C13.1,13 14,13.9 14,15C14,15.7 13.6,16.3 13,16.7V18.3C13.6,18.7 14,19.3 14,20C14,21.1 13.1,22 12,22Z" />
    </svg>
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <style jsx>{`
        @keyframes falling-petal {
          0% {
            transform: translate(0, -10vh) rotate(0deg) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          50% {
            transform: translate(100px, 50vh) rotate(180deg) translateX(50px);
          }
          100% {
            transform: translate(20px, 110vh) rotate(360deg) translateX(0);
            opacity: 0;
          }
        }
        @keyframes bloom {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(0); opacity: 0; }
        }
        .animate-petal {
          animation-name: falling-petal;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        .animate-bloom {
          animation: bloom 8s ease-in-out infinite;
        }
      `}</style>

      {/* 1. Falling Petals */}
      {petals.map((petal) => (
        <div
          key={`petal-${petal.id}`}
          className="absolute text-pink-300 opacity-70 animate-petal"
          style={{
            left: petal.left,
            width: `${petal.scale * 16}px`,
            height: `${petal.scale * 16}px`,
            animationDuration: petal.animationDuration,
            animationDelay: petal.delay,
          }}
        >
          <PetalIcon className="w-full h-full drop-shadow-sm" />
        </div>
      ))}

      {/* 2. Soft Blooming Flowers */}
      {blooms.map((bloom) => (
        <div
          key={`bloom-${bloom.id}`}
          className="absolute text-pink-400 opacity-40 animate-bloom blur-[1px]"
          style={{
            top: bloom.top,
            left: bloom.left,
            width: `${bloom.scale * 40}px`,
            height: `${bloom.scale * 40}px`,
            animationDelay: bloom.delay,
          }}
        >
          <FlowerIcon className="w-full h-full" />
        </div>
      ))}
      
      {/* 3. Subtle Green Ambient Glow at bottom */}
      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-emerald-50/50 to-transparent z-0" />
    </div>
  );
};

export default SakuraBackground;
