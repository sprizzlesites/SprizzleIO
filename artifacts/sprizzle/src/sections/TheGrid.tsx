import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  className?: string;
}

export default function TheGrid({ className = "" }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const grid = gridRef.current;
    const text = textRef.current;
    const nodes = nodesRef.current;
    if (!section || !grid || !text || !nodes) return;

    const ctx = gsap.context(() => {
      // Grid lines fade in + perspective shift
      gsap.from(grid, {
        opacity: 0,
        scale: 0.8,
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          end: "top 20%",
          scrub: 1,
        },
      });

      // Text slides up from below
      gsap.from(text, {
        y: 100,
        opacity: 0,
        scrollTrigger: {
          trigger: section,
          start: "top 60%",
          end: "top 10%",
          scrub: 1,
        },
      });

      // Nodes scatter in
      const nodeElements = nodes.querySelectorAll(".grid-node");
      gsap.from(nodeElements, {
        scale: 0,
        opacity: 0,
        stagger: 0.05,
        scrollTrigger: {
          trigger: section,
          start: "top 50%",
          end: "top 20%",
          scrub: 1,
        },
      });

      // Grid lines move
      const lines = grid.querySelectorAll(".grid-line");
      lines.forEach((line, i) => {
        gsap.to(line, {
          strokeDashoffset: 0,
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "top 20%",
            scrub: 1,
          },
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`relative w-full overflow-hidden bg-[#0d0b1e] ${className}`}
      style={{ minHeight: "100dvh" }}
    >
      {/* Animated grid background */}
      <div ref={gridRef} className="absolute inset-0 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          {/* Horizontal grid lines */}
          {Array.from({ length: 12 }).map((_, i) => (
            <line
              key={`h-${i}`}
              className="grid-line"
              x1="0" y1={`${(i + 1) * 8.33}%`} x2="100%" y2={`${(i + 1) * 8.33}%`}
              stroke="rgba(100,50,220,0.25)"
              strokeWidth="1"
              strokeDasharray="1000"
              strokeDashoffset="1000"
            />
          ))}
          {/* Vertical grid lines */}
          {Array.from({ length: 16 }).map((_, i) => (
            <line
              key={`v-${i}`}
              className="grid-line"
              x1={`${(i + 1) * 6.25}%`} y1="0" x2={`${(i + 1) * 6.25}%`} y2="100%"
              stroke="rgba(100,50,220,0.25)"
              strokeWidth="1"
              strokeDasharray="1000"
              strokeDashoffset="1000"
            />
          ))}
        </svg>
      </div>

      {/* Floating code nodes */}
      <div ref={nodesRef} className="absolute inset-0 pointer-events-none overflow-hidden">
        {[
          { text: "<div>", left: "8%", top: "15%", color: "hsl(350 75% 55%)" },
          { text: "const", left: "75%", top: "22%", color: "hsl(225 70% 55%)" },
          { text: "function()", left: "18%", top: "65%", color: "hsl(272 60% 55%)" },
          { text: "await", left: "82%", top: "72%", color: "hsl(350 75% 60%)" },
          { text: "{...}", left: "55%", top: "85%", color: "hsl(225 70% 60%)" },
          { text: "export", left: "35%", top: "12%", color: "hsl(272 60% 60%)" },
          { text: "return", left: "65%", top: "55%", color: "hsl(350 75% 50%)" },
          { text: "import", left: "5%", top: "45%", color: "hsl(225 70% 50%)" },
          { text: "useState", left: "88%", top: "38%", color: "hsl(272 60% 50%)" },
          { text: "=>", left: "45%", top: "45%", color: "hsl(350 75% 55%)" },
        ].map((node, i) => (
          <div
            key={i}
            className="grid-node absolute font-mono text-sm font-bold opacity-80"
            style={{
              left: node.left,
              top: node.top,
              color: node.color,
              textShadow: `0 0 12px ${node.color}`,
              animation: `floatDrift ${6 + (i % 4)}s infinite ease-in-out ${i * 0.3}s`,
            }}
          >
            {node.text}
          </div>
        ))}
      </div>

      {/* Main content */}
      <div ref={textRef} className="relative z-10 flex flex-col items-center justify-center min-h-[100dvh] px-4 text-center">
        {/* Section label */}
        <div className="glass-card inline-flex items-center gap-2 px-5 py-2 mb-8 text-sm font-semibold text-white/90 tracking-widest uppercase">
          <span className="w-2 h-2 rounded-full bg-[#44ff88] animate-pulse"></span>
          Zone 01: The Grid
        </div>

        <h2
          className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight"
          style={{
            textShadow: "0 4px 0 hsl(272 60% 25%), 0 8px 20px rgba(0,0,0,0.5), 0 0 60px rgba(68,255,136,0.3)",
          }}
        >
          The Grid
        </h2>

        <p className="text-lg md:text-2xl text-white/70 max-w-2xl mb-6 leading-relaxed font-medium">
          Every line of code is a brick in the digital architecture. I build the structures that power the world wide web.
        </p>

        <p className="text-base md:text-lg text-white/50 max-w-xl mb-12 leading-relaxed">
          From the frontend pixels you see to the backend systems you never do, I engineer the digital infrastructure that keeps the internet running.
        </p>

        {/* Skill grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl w-full">
          {[
            { label: "Frontend", sub: "React, Vue, TypeScript" },
            { label: "Backend", sub: "Node.js, PostgreSQL" },
            { label: "APIs", sub: "REST, GraphQL" },
            { label: "DevOps", sub: "CI/CD, Docker" },
          ].map((skill, i) => (
            <div
              key={i}
              className="glass-card p-4 text-center hover:scale-105 transition-transform duration-300"
              style={{
                borderColor: "rgba(255,255,255,0.15)",
                boxShadow: "0 8px 32px -8px rgba(68,255,136,0.15)",
              }}
            >
              <div className="text-sm font-bold text-white/90 mb-1">{skill.label}</div>
              <div className="text-xs text-white/50">{skill.sub}</div>
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
