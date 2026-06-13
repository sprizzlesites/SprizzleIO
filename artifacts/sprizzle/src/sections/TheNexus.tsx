import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  className?: string;
}

export default function TheNexus({ className = "" }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const text = textRef.current;
    const cards = cardsRef.current;
    if (!section || !text || !cards) return;

    const ctx = gsap.context(() => {
      gsap.from(text, {
        scale: 0.8,
        opacity: 0,
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          end: "top 20%",
          scrub: 1,
        },
      });

      const cardElements = cards.querySelectorAll(".nexus-card");
      gsap.from(cardElements, {
        y: 60,
        opacity: 0,
        stagger: 0.15,
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
      style={{
        minHeight: "100dvh",
        background: "linear-gradient(180deg, #0a0818 0%, #1a0a2e 40%, #2d1a4e 70%, #1a0a2e 100%)",
      }}
    >
      {/* Animated background orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[
          { size: 400, left: "-10%", top: "-10%", color: "hsl(350 75% 55%)", blur: 80, opacity: 0.15 },
          { size: 350, left: "70%", top: "60%", color: "hsl(225 70% 55%)", blur: 80, opacity: 0.15 },
          { size: 300, left: "30%", top: "80%", color: "hsl(272 60% 55%)", blur: 60, opacity: 0.2 },
        ].map((orb, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: orb.size,
              height: orb.size,
              left: orb.left,
              top: orb.top,
              background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
              filter: `blur(${orb.blur}px)`,
              opacity: orb.opacity,
              animation: `floatDrift ${12 + i}s infinite ease-in-out`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[100dvh] px-4 text-center">
        <div ref={textRef}>
          {/* Section label */}
          <div className="glass-card inline-flex items-center gap-2 px-5 py-2 mb-8 text-sm font-semibold text-white/90 tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-[#cc55ff] animate-pulse"></span>
            The Nexus
          </div>

          <h2
            className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight"
            style={{
              textShadow: "0 4px 0 hsl(272 60% 25%), 0 8px 20px rgba(0,0,0,0.5), 0 0 60px rgba(204,85,255,0.3)",
            }}
          >
            The Nexus
          </h2>

          <p className="text-lg md:text-2xl text-white/70 max-w-2xl mb-6 leading-relaxed font-medium">
            Three forces. One creator. Web, Design, and Security converge at the Sprizzle Nexus.
          </p>

          <p className="text-base md:text-lg text-white/50 max-w-xl mb-12 leading-relaxed">
            Ready to build something that matters? I craft digital experiences at the intersection of code, art, and armor. Let's create your next world.
          </p>
        </div>

        {/* Three realm cards */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full mb-12">
          {[
            {
              title: "The Grid",
              subtitle: "Web Development",
              desc: "Full-stack architecture, frontend engineering, API design, and deployment pipelines.",
              color: "hsl(130 80% 55%)",
              icon: "⟷",
            },
            {
              title: "The Canvas",
              subtitle: "Graphic Design",
              desc: "UI/UX, brand identity, motion design, and visual storytelling that moves people.",
              color: "hsl(32 100% 55%)",
              icon: "■",
            },
            {
              title: "The Fortress",
              subtitle: "Security Education",
              desc: "Penetration testing, security audits, and team training for the digital frontier.",
              color: "hsl(0 80% 55%)",
              icon: "⚠",
            },
          ].map((realm, i) => (
            <div
              key={i}
              className="nexus-card glass-card p-6 text-left transition-transform duration-300 hover:scale-105"
              style={{
                borderColor: "rgba(255,255,255,0.2)",
                boxShadow: `0 12px 40px -8px ${realm.color}30`,
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold"
                  style={{
                    background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.3), ${realm.color} 60%)`,
                    border: "1px solid rgba(255,255,255,0.25)",
                    boxShadow: `0 4px 16px -4px ${realm.color}50`,
                  }}
                >
                  <span className="text-white">{realm.icon}</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{realm.title}</h3>
                  <span className="text-xs text-white/50 uppercase tracking-wider">{realm.subtitle}</span>
                </div>
              </div>
              <p className="text-sm text-white/60 leading-relaxed">{realm.desc}</p>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
          <button
            className="btn-aero w-full sm:w-auto px-10 py-5 text-xl font-bold transition-transform duration-300 hover:-translate-y-0.5"
            style={{
              background: "linear-gradient(180deg, hsl(272 60% 60%), hsl(272 60% 40%))",
              boxShadow: "0 8px 16px -4px rgba(120,60,220,0.6), inset 0 -2px 6px rgba(0,0,0,0.2)",
            }}
            data-testid="button-start-project"
          >
            Start a Project
          </button>
          <button
            className="glass-card w-full sm:w-auto px-10 py-5 text-xl font-bold text-white hover:bg-white/20 transition-all duration-300"
            data-testid="button-contact"
          >
            Get in Touch
          </button>
        </div>

        {/* Footer */}
        <footer className="w-full max-w-4xl text-center text-white/40 text-sm pb-8">
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6"></div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{
                  background: "radial-gradient(circle at 32% 28%, rgba(255,255,255,0.6), hsl(272 60% 50%) 60%, hsl(272 90% 20%) 100%)",
                }}
              >
                S
              </div>
              <span className="font-bold text-white/70">Sprizzle</span>
            </div>
            <div className="flex items-center gap-6">
              <span className="hover:text-white/70 transition-colors cursor-pointer">Web</span>
              <span className="hover:text-white/70 transition-colors cursor-pointer">Design</span>
              <span className="hover:text-white/70 transition-colors cursor-pointer">Security</span>
            </div>
            <span>Sprizzle Realm</span>
          </div>
        </footer>
      </div>
    </section>
  );
}
