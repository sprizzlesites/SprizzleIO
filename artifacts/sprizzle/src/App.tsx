import { useEffect, useRef } from "react";
import { Route } from "wouter";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import VideoBackground from "./components/VideoBackground";
import TextOverlay from "./components/TextOverlay";
import Navbar from "./components/Navbar";
import ScrollProgress from "./components/ScrollProgress";
import IDEPage from "./pages/IDEPage";
import { ScrollContext } from "./ScrollContext";

gsap.registerPlugin(ScrollTrigger);

function HomePage() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ScrollContext value={scrollRef}>
      <div
        ref={scrollRef}
        style={{
          position: "fixed",
          inset: 0,
          overflowY: "scroll",
          backgroundColor: "#0a0a0a",
        }}
      >
        <VideoBackground />
        <ScrollProgress />
        <Navbar />
        <TextOverlay />
      </div>
    </ScrollContext>
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
