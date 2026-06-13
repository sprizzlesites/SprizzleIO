import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ZoneTransitionProps {
  label: string;
  color: string;
}

export default function ZoneTransition({ label, color }: ZoneTransitionProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            end: "top 60%",
            scrub: 1,
          },
        }
      );
      gsap.to(el, {
        scale: 0,
        opacity: 0,
        scrollTrigger: {
          trigger: el,
          start: "top 40%",
          end: "top 10%",
          scrub: 1,
        },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="relative z-20 flex items-center justify-center pointer-events-none" style={{ height: "200px" }}>
      <div className="relative">
        {/* Outer ring */}
        <div
          className="absolute inset-0 rounded-full animate-pulse"
          style={{
            width: "200px",
            height: "200px",
            left: "-50%",
            top: "-50%",
            transform: "translate(-50%, -50%)",
            border: `2px solid ${color}66`,
            boxShadow: `0 0 60px ${color}44`,
          }}
        />
        {/* Inner ring */}
        <div
          className="absolute rounded-full"
          style={{
            width: "160px",
            height: "160px",
            left: "-50%",
            top: "-50%",
            transform: "translate(-50%, -50%)",
            border: `1px solid ${color}44`,
            borderTop: `2px solid ${color}AA`,
            animation: "spin 3s linear infinite",
          }}
        />
        {/* Label */}
        <div className="relative z-10 text-center">
          <div className="text-xs font-bold text-white/50 tracking-[0.3em] uppercase mb-1">Loading Zone</div>
          <div className="text-2xl font-black text-white" style={{ textShadow: `0 0 20px ${color}88` }}>
            {label}
          </div>
        </div>
      </div>
    </div>
  );
}
