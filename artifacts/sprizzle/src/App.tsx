import { useEffect, useRef } from "react";
import { Route } from "wouter";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import VideoBackground from "./components/VideoBackground";
import TextOverlay from "./components/TextOverlay";
import Navbar from "./components/Navbar";
import ScrollProgress from "./components/ScrollProgress";
import IDEPage from "./pages/IDEPage";

gsap.registerPlugin(ScrollTrigger);

function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

export default function App() {
  return (
    <>
      <Route path="/" component={HomePage} />
      <Route path="/ide" component={IDEPage} />
    </>
  );
}
