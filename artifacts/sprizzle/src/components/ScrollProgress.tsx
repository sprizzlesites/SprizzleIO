import { useEffect, useState } from "react";

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [zone, setZone] = useState("Zone 00: Portal");

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(Math.min(pct, 100));

      const zoneIndex = Math.floor((scrollTop / docHeight) * 5);
      const zones = [
        "Zone 00: Portal",
        "Zone 01: The Grid",
        "Zone 02: The Canvas",
        "Zone 03: The Fortress",
        "Zone 04: The Nexus",
      ];
      setZone(zones[Math.min(zoneIndex, 4)]);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] pointer-events-none">
      {/* Progress bar container */}
      <div className="w-full h-2 bg-black/30 backdrop-blur-sm">
        <div
          className="h-full transition-all duration-100 ease-out"
          style={{
            width: `${progress}%`,
            background: "linear-gradient(90deg, hsl(350 75% 55%), hsl(225 70% 55%), hsl(272 60% 55%))",
            boxShadow: "0 0 12px rgba(120,60,220,0.5)",
          }}
        />
      </div>
      {/* Zone indicator */}
      <div className="flex justify-center mt-2">
        <div
          className="glass-card px-4 py-1 text-xs font-bold tracking-widest uppercase text-white/90"
          style={{
            borderRadius: "999px",
            boxShadow: "0 4px 20px rgba(120,60,220,0.3)",
          }}
        >
          {zone}
        </div>
      </div>
    </div>
  );
}
