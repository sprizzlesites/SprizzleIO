import React, { useEffect, useState } from 'react';

export default function BackgroundBubbles() {
  const [bubbles, setBubbles] = useState<{ id: number; left: string; size: string; delay: string; duration: string }[]>([]);

  useEffect(() => {
    // Generate random bubbles
    const newBubbles = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 60 + 20}px`,
      delay: `${Math.random() * 5}s`,
      duration: `${Math.random() * 8 + 8}s`,
    }));
    setBubbles(newBubbles);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" data-testid="background-bubbles">
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="bubble"
          style={{
            left: bubble.left,
            width: bubble.size,
            height: bubble.size,
            animationDelay: bubble.delay,
            animationDuration: bubble.duration,
          }}
        />
      ))}
    </div>
  );
}
