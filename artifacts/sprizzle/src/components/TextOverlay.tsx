import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SprizzleLogo from "./SprizzleLogo";
import { WebGLErrorBoundary } from "./WebGLErrorBoundary";

gsap.registerPlugin(ScrollTrigger);

interface RoomProps {
  children: React.ReactNode;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  width?: string;
  maxWidth?: string;
  align?: "left" | "center" | "right";
  startScroll?: number;
  endScroll?: number;
  glow?: string;
  noGlass?: boolean;
}

function Room({
  children,
  top,
  bottom,
  left,
  right,
  width,
  maxWidth,
  align = "left",
  startScroll = 0,
  endScroll = 1,
  glow = "rgba(100,50,220,0.3)",
  noGlass,
}: RoomProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // Fade in
      gsap.fromTo(
        el,
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          scrollTrigger: {
            trigger: el,
            start: `${startScroll}% center`,
            end: `${startScroll + 5}% center`,
            scrub: true,
          },
        }
      );
      // Fade out
      gsap.to(el, {
        opacity: 0,
        y: -30,
        scale: 0.95,
        scrollTrigger: {
          trigger: el,
          start: `${endScroll - 5}% center`,
          end: `${endScroll}% center`,
          scrub: true,
        },
      });
    }, el);

    return () => ctx.revert();
  }, [startScroll, endScroll]);

  return (
    <div
      ref={ref}
      className="absolute z-10"
      style={{
        top,
        bottom,
        left,
        right,
        width,
        maxWidth,
        textAlign: align,
      }}
    >
      <div
        className={noGlass ? "" : "glass-panel"}
        style={
          noGlass
            ? {}
            : {
                background: "rgba(10,5,30,0.65)",
                backdropFilter: "blur(12px)",
                borderRadius: "20px",
                border: `1px solid rgba(255,255,255,0.15)`,
                borderTop: "1px solid rgba(255,255,255,0.35)",
                boxShadow: `0 12px 40px -8px ${glow}, inset 0 0 20px rgba(255,255,255,0.03)`,
                padding: "28px 32px",
                maxWidth: maxWidth || "420px",
              }
        }
      >
        {children}
      </div>
    </div>
  );
}

export default function TextOverlay() {
  return (
    <div className="relative z-10" style={{ height: "5000px" }}>
      {/* Room 0: Portal — Entry Chamber */}
      <Room
        top="10%"
        right="5%"
        maxWidth="420px"
        align="left"
        startScroll={0}
        endScroll={18}
        glow="rgba(100,50,220,0.3)"
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-[#ff4466] animate-pulse"></div>
          <span className="text-xs font-bold text-white/60 tracking-[0.25em] uppercase">Zone 00: Portal</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-3 leading-tight" style={{ textShadow: "0 4px 20px rgba(0,0,0,0.5)" }}>
          Sprizzle
        </h1>
        <p className="text-white/70 text-base leading-relaxed mb-4">
          Enter the Sprizzle Realm. A digital world shaped by three forces: Web, Design, and Security.
        </p>
        <div className="flex items-center gap-2 mb-4">
          <div className="relative" style={{ width: "80px", height: "80px" }}>
            <WebGLErrorBoundary>
              <div className="w-full h-full">
                <SprizzleLogo />
              </div>
            </WebGLErrorBoundary>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="btn-aero px-5 py-2.5 text-sm font-bold" data-testid="button-enter-realm">Enter the Realm</button>
        </div>
      </Room>

      {/* Room 1: The Grid — Dev Chamber */}
      <Room
        bottom="12%"
        left="5%"
        maxWidth="380px"
        align="left"
        startScroll={20}
        endScroll={38}
        glow="rgba(68,255,136,0.25)"
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-[#44ff88] animate-pulse"></div>
          <span className="text-xs font-bold text-white/60 tracking-[0.25em] uppercase">Zone 01: The Grid</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-white mb-3 leading-tight" style={{ textShadow: "0 4px 20px rgba(0,0,0,0.5)" }}>
          The Grid
        </h2>
        <p className="text-white/70 text-sm leading-relaxed mb-3">
          Every line of code is a brick in the digital architecture. I build the structures that power the world wide web.
        </p>
        <div className="flex flex-wrap gap-2">
          {["React", "TypeScript", "Node.js", "PostgreSQL", "APIs", "DevOps"].map((tag, i) => (
            <span
              key={i}
              className="px-3 py-1 text-xs font-bold rounded-full text-white/80"
              style={{ background: "rgba(68,255,136,0.12)", border: "1px solid rgba(68,255,136,0.25)" }}
            >
              {tag}
            </span>
          ))}
        </div>
      </Room>

      {/* Room 2: The Canvas — Art Chamber */}
      <Room
        top="8%"
        left="8%"
        maxWidth="380px"
        align="left"
        startScroll={40}
        endScroll={58}
        glow="rgba(255,170,51,0.25)"
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-[#ffaa33] animate-pulse"></div>
          <span className="text-xs font-bold text-white/60 tracking-[0.25em] uppercase">Zone 02: The Canvas</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-white mb-3 leading-tight" style={{ textShadow: "0 4px 20px rgba(0,0,0,0.5)" }}>
          The Canvas
        </h2>
        <p className="text-white/70 text-sm leading-relaxed mb-3">
          Visual design is the language that speaks before words do. I craft the visual identity that makes brands unforgettable.
        </p>
        <div className="flex flex-wrap gap-2">
          {["UI/UX", "Branding", "Motion", "3D", "Print", "Illustration"].map((tag, i) => (
            <span
              key={i}
              className="px-3 py-1 text-xs font-bold rounded-full text-white/80"
              style={{ background: "rgba(255,170,51,0.12)", border: "1px solid rgba(255,170,51,0.25)" }}
            >
              {tag}
            </span>
          ))}
        </div>
      </Room>

      {/* Room 3: The Fortress — Security Chamber */}
      <Room
        top="15%"
        right="8%"
        maxWidth="380px"
        align="right"
        startScroll={60}
        endScroll={78}
        glow="rgba(255,51,51,0.25)"
      >
        <div className="flex items-center justify-end gap-2 mb-3">
          <span className="text-xs font-bold text-white/60 tracking-[0.25em] uppercase">Zone 03: The Fortress</span>
          <div className="w-2 h-2 rounded-full bg-[#ff3333] animate-pulse"></div>
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-white mb-3 leading-tight" style={{ textShadow: "0 4px 20px rgba(0,0,0,0.5)" }}>
          The Fortress
        </h2>
        <p className="text-white/70 text-sm leading-relaxed mb-3">
          In the digital frontier, security is the fortress that keeps the kingdom standing. I teach the art of digital defense.
        </p>
        <div className="flex flex-wrap gap-2 justify-end">
          {["Pen Testing", "Awareness", "Risk Assessment"].map((tag, i) => (
            <span
              key={i}
              className="px-3 py-1 text-xs font-bold rounded-full text-white/80"
              style={{ background: "rgba(255,51,51,0.12)", border: "1px solid rgba(255,51,51,0.25)" }}
            >
              {tag}
            </span>
          ))}
        </div>
      </Room>

      {/* Room 4: The Nexus — Convergence Chamber */}
      <Room
        bottom="15%"
        left="50%"
        maxWidth="500px"
        align="center"
        startScroll={80}
        endScroll={95}
        glow="rgba(170,85,255,0.25)"
        noGlass
      >
        <div className="glass-panel" style={{
          background: "rgba(10,5,30,0.65)",
          backdropFilter: "blur(12px)",
          borderRadius: "20px",
          border: "1px solid rgba(255,255,255,0.15)",
          borderTop: "1px solid rgba(255,255,255,0.35)",
          boxShadow: "0 12px 40px -8px rgba(170,85,255,0.3), inset 0 0 20px rgba(255,255,255,0.03)",
          padding: "32px 40px",
        }}>
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-[#cc55ff] animate-pulse"></div>
            <span className="text-xs font-bold text-white/60 tracking-[0.25em] uppercase">The Nexus</span>
            <div className="w-2 h-2 rounded-full bg-[#cc55ff] animate-pulse"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3 leading-tight" style={{ textShadow: "0 4px 20px rgba(0,0,0,0.5)" }}>
            The Nexus
          </h2>
          <p className="text-white/70 text-sm leading-relaxed mb-6">
            Three forces. One creator. Web, Design, and Security converge here. Ready to build something that matters?
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button className="btn-aero px-6 py-3 text-sm font-bold" style={{
              background: "linear-gradient(180deg, hsl(272 60% 60%), hsl(272 60% 40%))",
              boxShadow: "0 8px 16px -4px rgba(120,60,220,0.6), inset 0 -2px 6px rgba(0,0,0,0.2)",
            }} data-testid="button-start-project">
              Start a Project
            </button>
            <button className="glass-card px-6 py-3 text-sm font-bold text-white hover:bg-white/20 transition-all" data-testid="button-contact">
              Get in Touch
            </button>
          </div>
        </div>
      </Room>

      {/* Footer — always visible at bottom */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
        <div className="text-white/30 text-xs tracking-wider">
          Sprizzle Realm — Web Developer &middot; Graphic Designer &middot; Security Educator
        </div>
      </div>
    </div>
  );
}
