'use client';

import React from 'react';

const SunFlareBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* 1. The Main Sun Body - Fixed & Bold */}
      <div className="absolute top-[-50px] right-[-50px] w-[300px] h-[300px] md:w-[450px] md:h-[450px]">
        {/* Intense Core */}
        <div className="absolute inset-0 rounded-full bg-yellow-400 shadow-[0_0_100px_40px_rgba(251,191,36,0.6)] animate-pulse-slow z-30" />
        
        {/* Glow Layer 1 */}
        <div className="absolute inset-[-50px] rounded-full bg-orange-400/30 blur-[60px] z-20" />
        
        {/* Glow Layer 2 */}
        <div className="absolute inset-[-150px] rounded-full bg-yellow-200/20 blur-[100px] z-10" />

        {/* Rotating God Rays - Now more distinct */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] animate-spin-slow">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 w-[100%] h-[40px] origin-center bg-gradient-to-r from-transparent via-yellow-100/20 to-transparent"
              style={{
                transform: `translate(-50%, -50%) rotate(${i * 45}deg)`,
                filter: 'blur(15px)',
              }}
            />
          ))}
        </div>
      </div>

      {/* 2. Lens Flare Artifacts - Floating circles across the screen */}
      <div className="absolute top-[20%] right-[30%] w-12 h-12 rounded-full bg-orange-200/20 blur-[2px] z-10" />
      <div className="absolute top-[35%] right-[45%] w-24 h-24 rounded-full bg-yellow-100/10 blur-[5px] z-10 border border-white/5" />
      <div className="absolute top-[50%] right-[60%] w-8 h-8 rounded-full bg-blue-200/10 blur-[1px] z-10" />

      {/* 3. Floating Summer Particles */}
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-yellow-100 blur-[0.5px] animate-float"
          style={{
            width: Math.random() * 5 + 3 + 'px',
            height: Math.random() * 5 + 3 + 'px',
            top: Math.random() * 100 + '%',
            left: Math.random() * 100 + '%',
            opacity: Math.random() * 0.3 + 0.1,
            animationDuration: Math.random() * 12 + 15 + 's',
            animationDelay: -Math.random() * 10 + 's',
          }}
        />
      ))}

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.05); opacity: 1; }
        }
        @keyframes float {
          0% { transform: translateY(0) translateX(0); }
          33% { transform: translateY(-30px) translateX(15px); }
          66% { transform: translateY(-15px) translateX(-10px); }
          100% { transform: translateY(0) translateX(0); }
        }
        .animate-spin-slow {
          animation: spin-slow 120s linear infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </div>
  );
};

export default SunFlareBackground;
