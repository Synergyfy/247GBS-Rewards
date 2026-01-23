'use client';

import React, { useEffect, useState } from 'react';

const FallingLeavesBackground = () => {
  const [leaves, setLeaves] = useState<Array<{ id: number; left: string; animationDuration: string; delay: string; scale: number; rotation: string; type: number }>>([]);

  useEffect(() => {
    // Generate leaves on the client side
    const leafCount = 20;
    const newLeaves = Array.from({ length: leafCount }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 10 + 15}s`, // Slow, drifting fall (15-25s)
      delay: `-${Math.random() * 15}s`,
      scale: Math.random() * 0.5 + 0.5, // Random sizes
      rotation: `${Math.random() * 360}deg`,
      type: Math.floor(Math.random() * 3), // 0, 1, or 2 for different leaf colors/shapes
    }));
    setLeaves(newLeaves);
  }, []);

  // Leaf SVG shapes
  const LeafIcon = ({ type, className }: { type: number, className?: string }) => {
    if (type === 0) {
      // Maple Leaf
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M12,2L14.5,9L21,9L16,14L18,21L12,17L6,21L8,14L3,9L9.5,9L12,2Z" />
        </svg>
      );
    } else if (type === 1) {
      // Oak Leaf (Simplified)
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M14.5,2C14.5,2 14.5,4 12,4C9.5,4 9.5,2 9.5,2C9.5,2 6,5 6,8C6,11 9,12 9,14C9,16 6,17 6,20C6,23 12,22 12,22C12,22 18,23 18,20C18,17 15,16 15,14C15,12 18,11 18,8C18,5 14.5,2 14.5,2Z" />
        </svg>
      );
    } else {
      // Basic Leaf
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
        </svg>
      );
    }
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <style jsx>{`
        @keyframes falling-leaf {
          0% {
            transform: translate(0, -10vh) rotate(0deg) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          25% {
            transform: translate(20px, 25vh) rotate(45deg) translateX(20px);
          }
          50% {
            transform: translate(-20px, 50vh) rotate(90deg) translateX(-20px);
          }
          75% {
            transform: translate(20px, 75vh) rotate(135deg) translateX(20px);
          }
          100% {
            transform: translate(0, 110vh) rotate(180deg) translateX(0);
            opacity: 0;
          }
        }
        .animate-falling-leaf {
          animation-name: falling-leaf;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
      `}</style>
      
      {leaves.map((leaf) => {
        // Randomize colors: Amber, Orange, Red-Brown
        const colors = ['text-amber-500', 'text-orange-600', 'text-red-500', 'text-yellow-600'];
        const color = colors[leaf.id % colors.length];

        return (
          <div
            key={leaf.id}
            className={`absolute ${color} opacity-60 animate-falling-leaf`}
            style={{
              left: leaf.left,
              width: `${leaf.scale * 30}px`,
              height: `${leaf.scale * 30}px`,
              animationDuration: leaf.animationDuration,
              animationDelay: leaf.delay,
              // We don't apply initial rotation in style here because the keyframe handles rotation for the swaying effect
            }}
          >
            <LeafIcon type={leaf.type} className="w-full h-full drop-shadow-sm" />
          </div>
        );
      })}
    </div>
  );
};

export default FallingLeavesBackground;
