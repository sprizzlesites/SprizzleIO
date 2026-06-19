import { useEffect, useRef } from "react";
import { Route } from "wouter";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import VideoBackground from "./components/VideoBackground";
import TextOverlay from "./components/TextOverlay";
import Navbar from "./components/Navbar";
import ScrollProgress from "./components/ScrollProgress";
import IDEPage from "./pages/IDEPage";
import { ScrollContext } from "./ScrollContext";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Zone peak percentages — where each room "fully arrives"
const SNAP_TARGETS = [0, 30, 55, 75, 93];
const SNAP_DELAY_MS = 180;

function useScrollSnap(containerRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    let lastScrollTop = 0;
    let scrollDir = 1;
    let snapActive = false;

    const getSnapTarget = (currentPct: number): number =>
      SNAP_TARGETS.reduce((best, t) =>
        Math.abs(t - currentPct) < Math.abs(best - currentPct) ? t : best
      );

    const onScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      // Kill any active snap tween so user retakes control
      if (snapActive) {
        gsap.killTweensOf(container);
        snapActive = false;
      }

      scrollDir = container.scrollTop > lastScrollTop ? 1 : -1;
      lastScrollTop = container.scrollTop;

      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const c = containerRef.current;
        if (!c) return;
        const scrollableH = c.scrollHeight - c.clientHeight;
        if (scrollableH <= 0) return;
        const currentPct = (c.scrollTop / scrollableH) * 100;
        const targetPct = getSnapTarget(currentPct);
        const targetY = (targetPct / 100) * scrollableH;

        snapActive = true;
        gsap.to(c, {
          scrollTo: { y: targetY },
          duration: 0.28,
          ease: "power2.out",
          onComplete: () => { snapActive = false; },
        });
      }, SNAP_DELAY_MS);
    };

    const attach = (container: HTMLDivElement) => {
      container.addEventListener("scroll", onScroll, { passive: true });
    };
    const detach = (container: HTMLDivElement) => {
      container.removeEventListener("scroll", onScroll);
      clearTimeout(timeoutId);
      gsap.killTweensOf(container);
    };

    let activeContainer: HTMLDivElement | null = null;

    const sync = () => {
      const isDesktop = window.innerWidth >= 768;
      const container = containerRef.current;
      if (!container) return;

      if (isDesktop && activeContainer !== container) {
        if (activeContainer) detach(activeContainer);
        attach(container);
        activeContainer = container;
      } else if (!isDesktop && activeContainer) {
        detach(activeContainer);
        activeContainer = null;
      }
    };

    // Wait one tick for the ref to be populated
    const initId = setTimeout(sync, 0);
    window.addEventListener("resize", sync);

    return () => {
      clearTimeout(initId);
      clearTimeout(timeoutId);
      window.removeEventListener("resize", sync);
      if (activeContainer) detach(activeContainer);
    };
  }, [containerRef]);
}

function HomePage() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useScrollSnap(scrollRef);

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
