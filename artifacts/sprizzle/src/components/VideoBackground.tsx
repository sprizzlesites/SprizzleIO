import { useContext, useEffect, useRef, useState } from "react";
import { ScrollContext } from "../ScrollContext";

function drawFrame(
  video: HTMLVideoElement,
  ctx: CanvasRenderingContext2D,
  canvasW: number,
  canvasH: number,
) {
  if (video.readyState < 2) return;
  const vW = video.videoWidth;
  const vH = video.videoHeight;
  if (!vW || !vH) return;
  const vAspect = vW / vH;
  const cAspect = canvasW / canvasH;
  let sx: number, sy: number, sW: number, sH: number;
  if (cAspect > vAspect) {
    sW = canvasW; sH = canvasW / vAspect; sx = 0; sy = (canvasH - sH) / 2;
  } else {
    sH = canvasH; sW = canvasH * vAspect; sx = (canvasW - sW) / 2; sy = 0;
  }
  ctx.clearRect(0, 0, canvasW, canvasH);
  ctx.drawImage(video, sx, sy, sW, sH);
}

function isBufferedAt(video: HTMLVideoElement, pct: number): boolean {
  const target = video.duration * pct;
  for (let i = 0; i < video.buffered.length; i++) {
    if (video.buffered.start(i) <= target && video.buffered.end(i) >= target) return true;
  }
  return false;
}

/* Desktop: hidden video element, canvas rendering, live seeking */
function DesktopVideoBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [posterVisible, setPosterVisible] = useState(true);
  const scrollContainer = useContext(ScrollContext);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = scrollContainer.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const video = document.createElement("video");
    video.src = `${import.meta.env.BASE_URL}scroll-bg.mp4`;
    video.preload = "auto";
    video.muted = true;
    video.playsInline = true;
    video.style.cssText = "position:absolute;visibility:hidden;pointer-events:none;width:1px;height:1px";
    document.body.appendChild(video);

    let canvasW = 0;
    let canvasH = 0;

    const setCanvasSize = () => {
      canvasW = container.clientWidth;
      canvasH = container.clientHeight;
      canvas.width = canvasW;
      canvas.height = canvasH;
      canvas.style.width = `${canvasW}px`;
      canvas.style.height = `${canvasH}px`;
    };
    setCanvasSize();

    const rawScroll = { current: 0 };
    const smoothScroll = { current: 0 };
    let isSeeking = false;
    let stallTimer: ReturnType<typeof setTimeout> | undefined;
    let decoderActive = false;
    let running = true;
    let rafId: number;

    const onScroll = () => {
      const docHeight = container.scrollHeight - container.clientHeight;
      rawScroll.current = container.scrollTop / Math.max(docHeight, 1);
    };
    container.addEventListener("scroll", onScroll, { passive: true });

    const onSeeked = () => {
      if (stallTimer !== undefined) clearTimeout(stallTimer);
      isSeeking = false;
      drawFrame(video, ctx, canvasW, canvasH);
    };
    video.addEventListener("seeked", onSeeked);

    const loop = () => {
      if (!running) return;
      smoothScroll.current = smoothScroll.current * 0.6 + rawScroll.current * 0.4;
      if (decoderActive && video.duration && isFinite(video.duration) && !isSeeking) {
        const targetTime = video.duration * smoothScroll.current;
        if (Math.abs(video.currentTime - targetTime) > 0.02) {
          isSeeking = true;
          // Unstick the flag if seeked never fires (slow decoder / background tab)
          stallTimer = setTimeout(() => { isSeeking = false; }, 80);
          video.currentTime = targetTime;
        }
      }
      rafId = requestAnimationFrame(loop);
    };

    const onProgress = () => {
      if (!video.duration) return;
      if (isBufferedAt(video, 0.1)) {
        setPosterVisible(false);
        drawFrame(video, ctx, canvasW, canvasH);
        video.removeEventListener("progress", onProgress);
      }
    };
    const onCanPlay = () => {
      setPosterVisible(false);
      drawFrame(video, ctx, canvasW, canvasH);
    };
    video.addEventListener("progress", onProgress);
    video.addEventListener("canplaythrough", onCanPlay, { once: true });

    const activateDecoder = () => {
      if (decoderActive) return;
      const p = video.play();
      if (p !== undefined) {
        p.then(() => { video.playbackRate = 0; decoderActive = true; })
         .catch(() => { decoderActive = true; });
      } else {
        video.playbackRate = 0;
        decoderActive = true;
      }
    };
    container.addEventListener("wheel", activateDecoder, { once: true, passive: true });
    container.addEventListener("click", activateDecoder, { once: true });

    onScroll();
    smoothScroll.current = rawScroll.current;
    rafId = requestAnimationFrame(loop);

    const onResize = () => { setCanvasSize(); drawFrame(video, ctx, canvasW, canvasH); };
    window.addEventListener("resize", onResize);

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      if (stallTimer !== undefined) clearTimeout(stallTimer);
      container.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("progress", onProgress);
      if (video.parentNode) video.parentNode.removeChild(video);
      video.pause();
      video.src = "";
      video.load();
    };
  }, [scrollContainer]);

  return (
    <div className="fixed inset-0 z-0" style={{ backgroundColor: "#0a0a0a" }}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none" }} />
      {posterVisible && (
        <img src={`${import.meta.env.BASE_URL}poster.jpg`} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ pointerEvents: "none" }} />
      )}
    </div>
  );
}

/* Mobile: canvas + visible video element (unchanged) */
function MobileVideoBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [posterVisible, setPosterVisible] = useState(true);
  const scrollContainer = useContext(ScrollContext);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const container = scrollContainer.current;
    if (!canvas || !video || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let canvasW = 0;
    let canvasH = 0;

    const setCanvasSize = () => {
      canvasW = container.clientWidth;
      canvasH = container.clientHeight;
      canvas.width = canvasW;
      canvas.height = canvasH;
      canvas.style.width = `${canvasW}px`;
      canvas.style.height = `${canvasH}px`;
    };
    setCanvasSize();

    const rawScroll = { current: 0 };
    const smoothScroll = { current: 0 };
    let isSeeking = false;
    let decoderActive = false;
    let running = true;
    let rafId: number;

    const onScroll = () => {
      const docHeight = container.scrollHeight - container.clientHeight;
      rawScroll.current = container.scrollTop / Math.max(docHeight, 1);
    };
    container.addEventListener("scroll", onScroll, { passive: true });

    const onSeeked = () => {
      isSeeking = false;
      drawFrame(video, ctx, canvasW, canvasH);
    };
    video.addEventListener("seeked", onSeeked);

    const loop = () => {
      if (!running) return;
      smoothScroll.current = smoothScroll.current * 0.92 + rawScroll.current * 0.08;
      if (decoderActive && video.duration && isFinite(video.duration) && !isSeeking) {
        const targetTime = video.duration * smoothScroll.current;
        if (Math.abs(video.currentTime - targetTime) > 0.02) {
          isSeeking = true;
          video.currentTime = targetTime;
        }
      }
      rafId = requestAnimationFrame(loop);
    };

    const onProgress = () => {
      if (!video.duration) return;
      if (isBufferedAt(video, 0.1)) {
        setPosterVisible(false);
        drawFrame(video, ctx, canvasW, canvasH);
        video.removeEventListener("progress", onProgress);
      }
    };
    const onCanPlay = () => {
      setPosterVisible(false);
      drawFrame(video, ctx, canvasW, canvasH);
    };
    video.addEventListener("progress", onProgress);
    video.addEventListener("canplaythrough", onCanPlay, { once: true });

    const onGesture = () => {
      if (decoderActive) return;
      const p = video.play();
      if (p !== undefined) {
        p.then(() => { video.playbackRate = 0; decoderActive = true; })
         .catch(() => { decoderActive = true; });
      } else {
        video.play();
        video.playbackRate = 0;
        decoderActive = true;
      }
    };
    container.addEventListener("touchstart", onGesture, { once: true, passive: true });
    container.addEventListener("click", onGesture, { once: true });
    container.addEventListener("wheel", onGesture, { once: true, passive: true });

    onScroll();
    smoothScroll.current = rawScroll.current;
    rafId = requestAnimationFrame(loop);

    const onResize = () => { setCanvasSize(); drawFrame(video, ctx, canvasW, canvasH); };
    window.addEventListener("resize", onResize);

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      container.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("progress", onProgress);
    };
  }, [scrollContainer]);

  return (
    <div className="fixed inset-0 z-0" style={{ backgroundColor: "#0a0a0a" }}>
      <video
        ref={videoRef}
        src={`${import.meta.env.BASE_URL}scroll-bg-mobile.mp4`}
        muted
        playsInline
        preload="auto"
        style={{
          position: "fixed",
          top: 0, left: 0,
          width: "100%", height: "100%",
          objectFit: "cover",
          zIndex: 0,
          pointerEvents: "none",
          opacity: 0.01,
        }}
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: "none", zIndex: 1 }}
      />
      {posterVisible && (
        <img
          src={`${import.meta.env.BASE_URL}poster.jpg`}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ pointerEvents: "none", zIndex: 2 }}
        />
      )}
    </div>
  );
}

export default function VideoBackground() {
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

  return isMobile ? <MobileVideoBackground /> : <DesktopVideoBackground />;
}
