import { useContext, useEffect, useState } from "react";
import { ScrollContext } from "../ScrollContext";

interface Zone {
  label: string;
  start: number;
  end: number;
  color: string;
}

const zones: Zone[] = [
  { label: "Portal", start: 0, end: 20, color: "#cc55ff" },
  { label: "The Grid", start: 20, end: 45, color: "#44ff88" },
  { label: "The Canvas", start: 50, end: 67, color: "#ffaa33" },
  { label: "The Fortress", start: 60, end: 83, color: "#ff3333" },
  { label: "The Nexus", start: 83, end: 100, color: "#cc55ff" },
];

function getCurrentZone(pct: number): Zone | null {
  for (const zone of zones) {
    if (pct >= zone.start && pct < zone.end) return zone;
  }
  if (pct >= 98) return zones[zones.length - 1];
  return null;
}

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [zone, setZone] = useState<Zone | null>(zones[0]);
  const scrollContainer = useContext(ScrollContext);

  useEffect(() => {
    const container = scrollContainer.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const docHeight = container.scrollHeight - container.clientHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(Math.min(pct, 100));
      setZone(getCurrentZone(pct));
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => container.removeEventListener("scroll", handleScroll);
  }, [scrollContainer]);

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] pointer-events-none">
      <div className="w-full h-1.5 bg-black/40 backdrop-blur-sm">
        <div
          className="h-full transition-all duration-75 ease-out"
          style={{
            width: `${progress}%`,
            background: zone
              ? `linear-gradient(90deg, ${zone.color}, ${zone.color}cc)`
              : "linear-gradient(90deg, #cc55ff, #44ff88)",
            boxShadow: zone
              ? `0 0 10px ${zone.color}80`
              : "0 0 10px rgba(120,60,220,0.5)",
          }}
        />
      </div>
      <div className="flex justify-center mt-2">
        <div
          className="px-4 py-1 text-xs font-bold tracking-widest uppercase text-white/90"
          style={{
            borderRadius: "999px",
            background: zone ? `${zone.color}25` : "rgba(255,255,255,0.1)",
            border: zone ? `1px solid ${zone.color}50` : "1px solid rgba(255,255,255,0.15)",
            backdropFilter: "blur(12px)",
            boxShadow: zone ? `0 4px 20px ${zone.color}30` : "0 4px 20px rgba(120,60,220,0.2)",
            transition: "all 0.3s ease",
          }}
        >
          {zone ? `${zone.label}` : "The Realm"}
        </div>
      </div>
    </div>
  );
}
