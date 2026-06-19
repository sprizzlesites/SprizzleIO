import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { ScrollContext } from "../ScrollContext";
import Logo3D from "./SprizzleLogo";

interface ZoneConfig {
  id: string;
  label: string;
  title: string;
  description: string;
  tags: string[];
  glow: string;
  color: string;
  enter: number;
  peak: number;
  exit: number;
  gone: number;
  position: { top?: string; bottom?: string; left?: string; right?: string };
  positionMobile?: { top?: string; bottom?: string; left?: string; right?: string };
  align: "left" | "center" | "right";
  maxWidth: string;
  maxWidthMobile?: string;
  showLogo?: boolean;
  showCTA?: boolean;
}

const zones: ZoneConfig[] = [
  {
    id: "portal",
    label: "Portal",
    title: "Sprizzle",
    description:
      "Enter the Sprizzle Realm. A digital world shaped by three forces: Web, Design, and Security.",
    tags: [],
    glow: "rgba(100,50,220,0.3)",
    color: "#cc55ff",
    enter: -5,
    peak: 0,
    exit: 10,
    gone: 17,
    position: { top: "14%", left: "50%" },
    positionMobile: { top: "18%", left: "50%" },
    align: "center",
    maxWidth: "420px",
    maxWidthMobile: "88vw",
    showLogo: true,
  },
  {
    id: "grid",
    label: "The Grid",
    title: "The Grid",
    description:
      "Every line of code is a brick in the digital architecture. I build the structures that power the world wide web.",
    tags: ["React", "TypeScript", "Node.js", "PostgreSQL", "APIs", "DevOps"],
    glow: "rgba(68,255,136,0.25)",
    color: "#44ff88",
    enter: 20,
    peak: 30,
    exit: 38,
    gone: 45,
    position: { bottom: "12%", left: "50%" },
    positionMobile: { bottom: "14%", left: "50%" },
    align: "center",
    maxWidth: "380px",
    maxWidthMobile: "88vw",
  },
  {
    id: "canvas",
    label: "The Canvas",
    title: "The Canvas",
    description:
      "Visual design is the language that speaks before words do. I craft the visual identity that makes brands unforgettable.",
    tags: ["UI/UX", "Branding", "Motion", "3D", "Print", "Illustration"],
    glow: "rgba(255,170,51,0.25)",
    color: "#ffaa33",
    enter: 50,
    peak: 55,
    exit: 61,
    gone: 67,
    position: { bottom: "12%", left: "50%" },
    positionMobile: { bottom: "14%", left: "50%" },
    align: "center",
    maxWidth: "380px",
    maxWidthMobile: "88vw",
  },
  {
    id: "fortress",
    label: "The Fortress",
    title: "The Fortress",
    description:
      "In the digital frontier, security is the fortress that keeps the kingdom standing. I teach the art of digital defense.",
    tags: ["Pen Testing", "Awareness", "Risk Assessment", "Compliance"],
    glow: "rgba(255,51,51,0.25)",
    color: "#ff3333",
    enter: 70,
    peak: 75,
    exit: 77,
    gone: 80,
    position: { bottom: "12%", left: "50%" },
    positionMobile: { bottom: "14%", left: "50%" },
    align: "center",
    maxWidth: "380px",
    maxWidthMobile: "88vw",
  },
  {
    id: "nexus",
    label: "The Nexus",
    title: "The Nexus",
    description:
      "Three forces. One creator. Web, Design, and Security converge here. Ready to build something that matters?",
    tags: [],
    glow: "rgba(170,85,255,0.25)",
    color: "#cc55ff",
    enter: 83,
    peak: 90,
    exit: 96,
    gone: 100,
    position: { bottom: "12%", left: "50%" },
    positionMobile: { bottom: "14%", left: "50%" },
    align: "center",
    maxWidth: "500px",
    maxWidthMobile: "88vw",
    showCTA: true,
  },
];

function computeZoneState(pct: number, zone: ZoneConfig) {
  let opacity = 0;
  let y = 20;
  let scale = 0.95;

  if (pct < zone.enter) {
    opacity = 0;
  } else if (pct < zone.peak) {
    const t = (pct - zone.enter) / (zone.peak - zone.enter);
    opacity = t;
    y = 20 * (1 - t);
    scale = 0.95 + 0.05 * t;
  } else if (pct < zone.exit) {
    opacity = 1;
    y = 0;
    scale = 1;
  } else if (pct < zone.gone) {
    const t = (pct - zone.exit) / (zone.gone - zone.exit);
    opacity = 1 - t;
    y = -20 * t;
    scale = 1 - 0.05 * t;
  } else {
    opacity = 0;
  }

  return { opacity, y, scale };
}

function ZonePanel({ zone, scrollPct }: { zone: ZoneConfig; scrollPct: number }) {
  const { opacity, y, scale } = computeZoneState(scrollPct, zone);
  const isVisible = opacity > 0.01;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const isSmall = window.innerWidth < 768;
      setIsMobile(isTouch || isSmall);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!isVisible) return null;

  const pos = isMobile && zone.positionMobile ? zone.positionMobile : zone.position;
  const maxW = isMobile && zone.maxWidthMobile ? zone.maxWidthMobile : zone.maxWidth;
  const padding = isMobile ? "18px 20px" : "28px 32px";
  const logoSize = isMobile ? 90 : 140;

  return (
    <div
      className="fixed z-10"
      style={{
        ...pos,
        transform: `translateX(-50%) translateY(${y}px) scale(${scale})`,
        opacity,
        transition: "opacity 0.05s linear, transform 0.05s linear",
        maxWidth: maxW,
        width: "90vw",
      }}
    >
      <div
        style={{
          background: "rgba(5,2,20,0.72)",
          backdropFilter: "blur(16px)",
          borderRadius: "20px",
          border: "1px solid rgba(255,255,255,0.12)",
          borderTop: "1px solid rgba(255,255,255,0.3)",
          boxShadow: `0 12px 40px -8px ${zone.glow}, inset 0 0 20px rgba(255,255,255,0.02)`,
          padding,
          textAlign: zone.align,
        }}
      >
        {/* Zone label */}
        <div
          className="flex items-center gap-2 mb-3"
          style={{
            justifyContent:
              zone.align === "center"
                ? "center"
                : zone.align === "right"
                  ? "flex-end"
                  : "flex-start",
          }}
        >
          <div
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: zone.color }}
          />
          <span className="text-xs font-bold text-white/60 tracking-[0.25em] uppercase">
            {zone.label}
          </span>
        </div>

        {/* Title / Logo */}
        {zone.showLogo ? (
          <div className="flex justify-center mb-3" style={{ overflow: 'visible' }}>
            <Logo3D size={logoSize} scale={3.0} autoRotate={false} spinOnScroll={false} />
          </div>
        ) : (
          <h2
            className="text-3xl md:text-4xl font-black text-white mb-3 leading-tight"
            style={{ textShadow: "0 4px 20px rgba(0,0,0,0.6)" }}
          >
            {zone.title}
          </h2>
        )}

        {/* Description */}
        <p className="text-white/75 text-sm leading-relaxed mb-3">
          {zone.description}
        </p>

        {/* Tags */}
        {zone.tags.length > 0 && (
          <div
            className="flex flex-wrap gap-2"
            style={{
              justifyContent:
                zone.align === "center"
                  ? "center"
                  : zone.align === "right"
                    ? "flex-end"
                    : "flex-start",
            }}
          >
            {zone.tags.map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 text-xs font-bold rounded-full text-white/80"
                style={{
                  background: `${zone.color}20`,
                  border: `1px solid ${zone.color}40`,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* CTA buttons for Nexus */}
        {zone.showCTA && (
          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-6">
            <Link
              href="/ide"
              className="btn-aero px-6 py-3 text-sm font-bold inline-flex items-center justify-center"
              style={{
                background: "linear-gradient(180deg, hsl(272 60% 60%), hsl(272 60% 40%))",
                boxShadow: "0 8px 16px -4px rgba(120,60,220,0.6), inset 0 -2px 6px rgba(0,0,0,0.2)",
              }}
              data-testid="button-start-project"
            >
              Start a Project
            </Link>
            <button
              className="glass-card px-6 py-3 text-sm font-bold text-white hover:bg-white/20 transition-all"
              data-testid="button-contact"
            >
              Get in Touch
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ScrollHint({ scrollPct }: { scrollPct: number }) {
  const opacity = Math.max(0, 1 - scrollPct / 5);
  if (opacity <= 0) return null;

  return (
    <div
      className="fixed z-10"
      style={{
        bottom: "8%",
        left: "50%",
        transform: "translateX(-50%)",
        opacity,
        transition: "opacity 0.3s ease",
        textAlign: "center",
      }}
    >
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs font-bold text-white/50 tracking-[0.2em] uppercase">
          Scroll to Explore
        </span>
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1">
          <div
            className="w-1.5 h-3 rounded-full bg-white/60"
            style={{
              animation: "scrollBounce 1.5s ease-in-out infinite",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default function TextOverlay() {
  const [scrollPct, setScrollPct] = useState(0);
  const rafRef = useRef<number>(0);
  const lastScrollRef = useRef(0);
  const scrollContainer = useContext(ScrollContext);

  useEffect(() => {
    const container = scrollContainer.current;
    if (!container) return;

    const handleScroll = () => {
      lastScrollRef.current = container.scrollTop;
    };

    const loop = () => {
      const scrollTop = lastScrollRef.current;
      const docHeight = container.scrollHeight - container.clientHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollPct(Math.min(pct, 100));
      rafRef.current = requestAnimationFrame(loop);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      container.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [scrollContainer]);

  return (
    <div className="relative z-10 mobile-scroll-container" style={{ height: "5000px" }}>
      {/* Zone panels */}
      {zones.map((zone) => (
        <ZonePanel key={zone.id} zone={zone} scrollPct={scrollPct} />
      ))}

      {/* Scroll hint */}
      <ScrollHint scrollPct={scrollPct} />

      {/* Footer */}
      <div
        className="fixed bottom-4 left-0 right-0 flex justify-center"
        style={{
          opacity: Math.min(1, Math.max(0, (scrollPct - 95) / 5)),
          transition: "opacity 0.3s ease",
        }}
      >
        <div className="text-white/30 text-xs tracking-wider">
          Sprizzle Realm — Web Developer &middot; Graphic Designer &middot; Security
          Educator
        </div>
      </div>
    </div>
  );
}
