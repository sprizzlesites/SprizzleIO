import { useContext, useEffect, useRef, useState } from "react";
import { ScrollContext } from "../ScrollContext";

const COLS = 10, ROWS = 10, N_FRAMES = 100;
const FRAME_W_DESKTOP = 1280, FRAME_H_DESKTOP = 720;
const FRAME_W_MOBILE  = 640,  FRAME_H_MOBILE  = 360;

export default function VideoBackground() {
  const divRef = useRef<HTMLDivElement>(null);
  const scrollContainer = useContext(ScrollContext);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = divRef.current;
    const container = scrollContainer.current;
    if (!el || !container) return;

    const isMobile = window.innerWidth < 768;
    const frameW = isMobile ? FRAME_W_MOBILE : FRAME_W_DESKTOP;
    const frameH = isMobile ? FRAME_H_MOBILE : FRAME_H_DESKTOP;
    const src = isMobile
      ? `${import.meta.env.BASE_URL}sprite-mobile.webp`
      : `${import.meta.env.BASE_URL}sprite-desktop.webp`;

    let displayCellW = 0;
    let displayCellH = 0;

    const applySize = () => {
      const vW = el.clientWidth;
      const vH = el.clientHeight;
      const aspect = frameW / frameH;
      let cellW: number, cellH: number;
      if (vW / vH > aspect) {
        cellW = vW; cellH = vW / aspect;
      } else {
        cellH = vH; cellW = vH * aspect;
      }
      displayCellW = cellW;
      displayCellH = cellH;
      el.style.backgroundSize = `${cellW * COLS}px ${cellH * ROWS}px`;
    };

    const applyFrame = (pct: number) => {
      const frameIdx = Math.round(pct * (N_FRAMES - 1) / 100);
      const col = frameIdx % COLS;
      const row = Math.floor(frameIdx / COLS);
      el.style.backgroundPosition = `${-(col * displayCellW)}px ${-(row * displayCellH)}px`;
    };

    const onScroll = () => {
      const docH = container.scrollHeight - container.clientHeight;
      const pct = docH > 0 ? (container.scrollTop / docH) * 100 : 0;
      applyFrame(Math.min(pct, 100));
    };

    const onResize = () => { applySize(); onScroll(); };

    const img = new window.Image();
    img.src = src;
    img.onload = () => {
      el.style.backgroundImage = `url(${src})`;
      setLoaded(true);
      applySize();
      applyFrame(0);
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      container.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [scrollContainer]);

  return (
    <div className="fixed inset-0 z-0" style={{ backgroundColor: "#0a0a0a" }}>
      <div
        ref={divRef}
        className="absolute inset-0"
        style={{ backgroundRepeat: "no-repeat" }}
      />
      {!loaded && (
        <img
          src={`${import.meta.env.BASE_URL}poster.jpg`}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ pointerEvents: "none" }}
        />
      )}
    </div>
  );
}
