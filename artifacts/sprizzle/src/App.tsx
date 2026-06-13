import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import VideoBackground from "./components/VideoBackground";
import TextOverlay from "./components/TextOverlay";
import Navbar from "./components/Navbar";
import ScrollProgress from "./components/ScrollProgress";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Force a refresh of ScrollTrigger after all mounts
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div ref={containerRef} className="relative" style={{ backgroundColor: "#0a0a0a", minHeight: "100dvh" }}>
      <VideoBackground />
      <ScrollProgress />
      <Navbar />
      <TextOverlay />
    </div>
  );
}
