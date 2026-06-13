import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  className?: string;
}

export default function TheFortress({ className = "" }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wallsRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const shieldsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const walls = wallsRef.current;
    const text = textRef.current;
    const shields = shieldsRef.current;
    if (!section || !walls || !text || !shields) return;

    const ctx = gsap.context(() => {
      // Wall scanlines slide
      gsap.from(walls, {
        opacity: 0,
        scaleY: 0,
        transformOrigin: "center top",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          end: "top 20%",
          scrub: 1,
        },
      });

      // Shields rotate in
      const shieldElements = shields.querySelectorAll(".shield-item");
      gsap.from(shieldElements, {
        scale: 0,
        rotation: -180,
        opacity: 0,
        stagger: 0.1,
        scrollTrigger: {
          trigger: section,
          start: "top 50%",
          end: "top 20%",
          scrub: 1,
        },
      });

      // Text entrance
      gsap.from(text, {
        x: -60,
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
      style={{ minHeight: "100dvh", background: "#0a0818" }}
    >
      {/* Animated "wall" background — horizontal scanlines with binary */}
      <div ref={wallsRef} className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Horizontal scanlines */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute left-0 right-0"
            style={{
              top: `${i * 5}%`,
              height: "1px",
              background: "linear-gradient(90deg, transparent, rgba(68,255,136,0.2), transparent)",
              animation: `shimmer ${3 + (i % 3)}s infinite linear ${i * 0.1}s`,
            }}
          />
        ))}

        {/* Vertical binary rain columns */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={`col-${i}`}
            className="absolute top-0 bottom-0 w-8 font-mono text-[10px] overflow-hidden opacity-20"
            style={{
              left: `${10 + i * 11}%`,
              color: i % 2 === 0 ? "hsl(44 100% 55%)" : "hsl(225 70% 55%)",
            }}
          >
            <div
              className="animate-pulse"
              style={{
                animation: `floatUp ${10 + (i % 5)}s infinite linear ${i * 0.8}s`,
              }}
            >
              {Array.from({ length: 30 }).map((_, j) => (
                <div key={j}>{Math.random() > 0.5 ? "1" : "0"}</div>
              ))}
            </div>
          </div>
        ))}

        {/* Glowing horizontal bars — fortress wall panels */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={`bar-${i}`}
            className="absolute left-0 right-0 h-16 opacity-30"
            style={{
              top: `${20 + i * 15}%`,
              background: `linear-gradient(90deg, transparent, ${i % 2 === 0 ? "rgba(255,50,80,0.3)" : "rgba(50,100,255,0.3)"}, transparent)`,
            }}
          />
        ))}
      </div>

      {/* Floating shields */}
      <div ref={shieldsRef} className="absolute inset-0 pointer-events-none overflow-hidden">
        {[
          { size: 80, left: "8%", top: "15%", color: "hsl(350 75% 55%)" },
          { size: 60, left: "85%", top: "25%", color: "hsl(225 70% 55%)" },
          { size: 100, left: "15%", top: "70%", color: "hsl(272 60% 55%)" },
          { size: 50, left: "78%", top: "75%", color: "hsl(350 75% 60%)" },
          { size: 70, left: "50%", top: "10%", color: "hsl(225 70% 60%)" },
          { size: 55, left: "65%", top: "60%", color: "hsl(272 60% 60%)" },
        ].map((shield, i) => (
          <div
            key={i}
            className="shield-item absolute flex items-center justify-center"
            style={{
              left: shield.left,
              top: shield.top,
              width: shield.size,
              height: shield.size,
              animation: `floatDrift ${7 + (i % 3)}s infinite ease-in-out ${i * 0.5}s`,
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke={shield.color} strokeWidth="1.5" className="w-full h-full drop-shadow-lg" style={{ filter: `drop-shadow(0 0 8px ${shield.color})` }}>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        ))}
      </div>

      {/* Main content */}
      <div ref={textRef} className="relative z-10 flex flex-col items-center justify-center min-h-[100dvh] px-4 text-center">
        {/* Section label */}
        <div className="glass-card inline-flex items-center gap-2 px-5 py-2 mb-8 text-sm font-semibold text-white/90 tracking-widest uppercase">
          <span className="w-2 h-2 rounded-full bg-[#ff3333] animate-pulse"></span>
          Zone 03: The Fortress
        </div>

        <h2
          className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight"
          style={{
            textShadow: "0 4px 0 hsl(272 60% 25%), 0 8px 20px rgba(0,0,0,0.5), 0 0 60px rgba(255,51,51,0.3)",
          }}
        >
          The Fortress
        </h2>

        <p className="text-lg md:text-2xl text-white/70 max-w-2xl mb-6 leading-relaxed font-medium">
          In the digital frontier, security is the fortress that keeps the kingdom standing. I teach the art of digital defense.
        </p>

        <p className="text-base md:text-lg text-white/50 max-w-xl mb-12 leading-relaxed">
          Threats evolve. I stay ahead — building defenses, auditing systems, and educating the next generation of digital guardians. Every breach prevented is a world saved.
        </p>

        {/* Security pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
          {[
            { title: "Penetration Testing", desc: "Finding the cracks before the attackers do", color: "hsl(350 75% 55%)" },
            { title: "Security Awareness", desc: "Teaching teams to think like defenders", color: "hsl(225 70% 55%)" },
            { title: "Risk Assessment", desc: "Mapping the threat landscape before it maps you", color: "hsl(272 60% 55%)" },
          ].map((pillar, i) => (
            <div
              key={i}
              className="glass-card p-6 text-left transition-transform duration-300 hover:scale-105"
              style={{
                borderColor: "rgba(255,255,255,0.15)",
                boxShadow: `0 8px 32px -8px ${pillar.color}30`,
              }}
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{
                background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.3), ${pillar.color} 60%)`,
                border: "1px solid rgba(255,255,255,0.25)",
                boxShadow: `0 4px 16px -4px ${pillar.color}50`,
              }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-5 h-5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{pillar.title}</h3>
              <p className="text-sm text-white/50">{pillar.desc}</p>
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
