import React, { useEffect, useState } from 'react';

export default function BackgroundBubbles() {
  const [bubbles, setBubbles] = useState<{ id: number; left: string; size: string; delay: string; duration: string; colorClass: string; isLarge: boolean }[]>([]);

  useEffect(() => {
    // Generate random bubbles
    const colors = [
      'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.9) 0%, hsl(272 60% 50%) 25%, hsl(272 80% 20%) 70%, hsl(272 90% 10%) 100%)', // Purple
      'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.9) 0%, hsl(350 75% 50%) 25%, hsl(350 80% 20%) 70%, hsl(350 90% 10%) 100%)', // Red
      'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.9) 0%, hsl(225 70% 50%) 25%, hsl(225 80% 20%) 70%, hsl(225 90% 10%) 100%)', // Blue
    ];
    
    const glowColors = [
      'hsl(272 60% 50%)',
      'hsl(350 75% 50%)',
      'hsl(225 70% 50%)',
    ];

    const newBubbles = Array.from({ length: 25 }).map((_, i) => {
      const colorIdx = Math.floor(Math.random() * colors.length);
      const isLarge = i < 4; // First few are large fixed background orbs
      return {
        id: i,
        left: `${Math.random() * 100}%`,
        size: isLarge ? `${Math.random() * 200 + 200}px` : `${Math.random() * 60 + 20}px`,
        delay: `${Math.random() * 5}s`,
        duration: isLarge ? `${Math.random() * 20 + 20}s` : `${Math.random() * 8 + 8}s`,
        colorGradient: colors[colorIdx],
        glowColor: glowColors[colorIdx],
        isLarge,
        top: isLarge ? `${Math.random() * 80}%` : undefined
      };
    });
    setBubbles(newBubbles as any);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" data-testid="background-bubbles">
      {bubbles.map((bubble: any) => (
        <div
          key={bubble.id}
          className={`absolute aero-orb ${bubble.isLarge ? 'opacity-20' : ''}`}
          style={{
            left: bubble.left,
            top: bubble.isLarge ? bubble.top : undefined,
            width: bubble.size,
            height: bubble.size,
            background: bubble.colorGradient,
            boxShadow: `0 0 ${bubble.isLarge ? '40px' : '15px'} ${bubble.glowColor}, inset 0 0 15px rgba(255,255,255,0.5)`,
            animation: bubble.isLarge 
              ? `floatDrift ${bubble.duration} infinite ease-in-out ${bubble.delay}`
              : `floatUp ${bubble.duration} infinite ease-in-out ${bubble.delay}`,
            bottom: bubble.isLarge ? undefined : '-100px'
          }}
        />
      ))}
    </div>
  );
}
