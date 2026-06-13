import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Portal from "./sections/Portal";
import TheGrid from "./sections/TheGrid";
import TheCanvas from "./sections/TheCanvas";
import TheFortress from "./sections/TheFortress";
import TheNexus from "./sections/TheNexus";
import ScrollProgress from "./components/ScrollProgress";
import ZoneTransition from "./components/ZoneTransition";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>(".section");
      sections.forEach((section, index) => {
        const isLast = index === sections.length - 1;
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: isLast ? "bottom bottom" : "+=100%",
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <ScrollProgress />

      <Portal className="section" />
      <ZoneTransition label="The Grid" color="hsl(130,80%,55%)" />
      <TheGrid className="section" />
      <ZoneTransition label="The Canvas" color="hsl(32,100%,55%)" />
      <TheCanvas className="section" />
      <ZoneTransition label="The Fortress" color="hsl(0,80%,55%)" />
      <TheFortress className="section" />
      <ZoneTransition label="The Nexus" color="hsl(272,60%,55%)" />
      <TheNexus className="section" />
    </div>
  );
}
