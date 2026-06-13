import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  className?: string;
}

export default function TheCanvas({ className = "" }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const blobsRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const blobs = blobsRef.current;
    const text = textRef.current;
    if (!section || !blobs || !text) return;

    const ctx = gsap.context(() => {
      // Blobs morph and scale
      const blobElements = blobs.querySelectorAll(".canvas-blob");
      blobElements.forEach((blob, i) => {
        gsap.from(blob, {
          scale: 0,
          opacity: 0,
          rotation: i % 2 === 0 ? -45 : 45,
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "top 30%",
            scrub: 1,
          },
        });
      });

      // Text entrance
      gsap.from(text, {
        y: 80,
        opacity: 0,
        scrollTrigger: {
          trigger: section,
          start: "top 60%",
          end: "top 10%",
          scrub: 1,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`relative w-full overflow-hidden ${className}`}
      style={{ minHeight: "100dvh", background: "linear-gradient(180deg, #0d0b1e 0%, #1a0f2e 50%, #2d1a4e 100%)" }}
    >
      {/* Animated background blobs */}
      <div ref={blobsRef} className="absolute inset-0 pointer-events-none overflow-hidden">
        {[
          { size: 300, left: "-5%", top: "10%", color: "hsl(350 75% 55%)", delay: 0 },
          { size: 250, left: "70%", top: "5%", color: "hsl(225 70% 55%)", delay: 1 },
          { size: 350, left: "40%", top: "60%", color: "hsl(272 60% 55%)", delay: 2 },
          { size: 200, left: "15%", top: "75%", color: "hsl(350 75% 50%)", delay: 1.5 },
          { size: 280, left: "80%", top: "70%", color: "hsl(225 70% 50%)", delay: 0.5 },
          { size: 180, left: "55%", top: "25%", color: "hsl(272 60% 50%)", delay: 2.5 },
        ].map((blob, i) => (
          <div
            key={i}
            className="canvas-blob absolute rounded-full"
            style={{
              width: blob.size,
              height: blob.size,
              left: blob.left,
              top: blob.top,
              background: `radial-gradient(circle at 40% 35%, rgba(255,255,255,0.25) 0%, ${blob.color} 35%, rgba(60,30,140,0.8) 70%, rgba(20,10,60,0.9) 100%)`,
              filter: `blur(40px)`,
              opacity: 0.6,
              animation: `floatDrift ${8 + i}s infinite ease-in-out ${blob.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Floating "brushstroke" art elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[
          { text: "RGB", left: "10%", top: "20%", rotate: -15, color: "hsl(350 75% 55%)" },
          { text: "CMYK", left: "85%", top: "30%", rotate: 12, color: "hsl(225 70% 55%)" },
          { text: "#FF3355", left: "75%", top: "75%", rotate: 8, color: "hsl(350 75% 60%)" },
          { text: "Vector", left: "5%", top: "60%", rotate: -8, color: "hsl(272 60% 55%)" },
          { text: "Layer", left: "45%", top: "85%", rotate: 20, color: "hsl(225 70% 60%)" },
          { text: "Blend", left: "60%", top: "15%", rotate: -20, color: "hsl(272 60% 60%)" },
        ].map((art, i) => (
          <div
            key={i}
            className="absolute font-black text-4xl md:text-6xl"
            style={{
              left: art.left,
              top: art.top,
              transform: `rotate(${art.rotate}deg)`,
              color: "transparent",
              WebkitTextStroke: `2px ${art.color}`,
              opacity: 0.25,
              animation: `floatDrift ${7 + i}s infinite ease-in-out ${i * 0.5}s`,
            }}
          >
            {art.text}
          </div>
        ))}
      </div>

      {/* Main content */}
      <div ref={textRef} className="relative z-10 flex flex-col items-center justify-center min-h-[100dvh] px-4 text-center">
        {/* Section label */}
        <div className="glass-card inline-flex items-center gap-2 px-5 py-2 mb-8 text-sm font-semibold text-white/90 tracking-widest uppercase">
          <span className="w-2 h-2 rounded-full bg-[#ffaa33] animate-pulse"></span>
          Zone 02: The Canvas
        </div>

        <h2
          className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight"
          style={{
            textShadow: "0 4px 0 hsl(272 60% 25%), 0 8px 20px rgba(0,0,0,0.5), 0 0 60px rgba(255,170,51,0.3)",
          }}
        >
          The Canvas
        </h2>

        <p className="text-lg md:text-2xl text-white/70 max-w-2xl mb-6 leading-relaxed font-medium">
          Visual design is the language that speaks before words do. I craft the visual identity that makes brands unforgettable.
        </p>

        <p className="text-base md:text-lg text-white/50 max-w-xl mb-12 leading-relaxed">
          From the first pixel to the final color swatch, I design interfaces that don't just look good — they feel like magic. Typography, motion, composition, color theory.
        </p>

        {/* Design tool showcase */}
        <div className="flex flex-wrap items-center justify-center gap-6 max-w-4xl">
          {[
            { name: "UI/UX", icon: "⇧", color: "hsl(350 75% 55%)" },
            { name: "Branding", icon: "■", color: "hsl(225 70% 55%)" },
            { name: "Motion", icon: "↻", color: "hsl(272 60% 55%)" },
            { name: "3D", icon: "▶", color: "hsl(350 75% 60%)" },
            { name: "Print", icon: "◆", color: "hsl(225 70% 60%)" },
            { name: "Illustration", icon: "◇", color: "hsl(272 60% 60%)" },
          ].map((tool, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-2 group"
              style={{ animation: `floatDrift ${6 + (i % 3)}s infinite ease-in-out ${i * 0.4}s` }}
            >
              <div
                className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-2xl font-bold transition-transform duration-300 group-hover:scale-110"
                style={{
                  background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.3), ${tool.color} 50%, rgba(40,20,100,0.8) 100%)`,
                  border: "1px solid rgba(255,255,255,0.25)",
                  boxShadow: `0 8px 24px -4px ${tool.color}60, inset 0 0 20px rgba(255,255,255,0.1)`,
                }}
              >
                <span className="text-white" style={{ textShadow: "0 0 10px rgba(255,255,255,0.5)" }}>
                  {tool.icon}
                </span>
              </div>
              <span className="text-xs font-bold text-white/70">{tool.name}</span>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40">
          <span className="text-xs uppercase tracking-widest">Scroll to continue</span>
          <div className="w-6 h-10 rounded-full border border-white/30 flex justify-center pt-2">
            <div className="w-1.5 h-2.5 rounded-full bg-white/60 animate-bounce"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
