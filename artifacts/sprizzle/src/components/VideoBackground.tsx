import { useEffect, useRef, useState } from "react";

/* Desktop: canvas-based rendering from hidden video */
function DesktopVideoBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [posterVisible, setPosterVisible] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const video = document.createElement("video");
    video.src = `${import.meta.env.BASE_URL}scroll-bg.mp4`;
    video.preload = "auto";
    video.muted = true;
    video.playsInline = true;
    video.style.position = "absolute";
    video.style.visibility = "hidden";
    video.style.pointerEvents = "none";
    video.style.width = "1px";
    video.style.height = "1px";
    document.body.appendChild(video);
    videoRef.current = video;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let canvasW = 0;
    let canvasH = 0;

    const setCanvasSize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvasW = w;
      canvasH = h;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    setCanvasSize();

    const rawScroll = { current: 0 };
    const smoothScroll = { current: 0 };
    let isSeeking = false;
    let lastSeekTime = 0;
    let running = true;
    let rafId: number;

    const drawVideo = () => {
      if (!video || video.readyState < 2) return;
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
    };

    const onScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      rawScroll.current = window.scrollY / Math.max(docHeight, 1);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const loop = () => {
      if (!running) return;
      const now = performance.now();
      const lerp = 0.08;
      smoothScroll.current = smoothScroll.current * (1 - lerp) + rawScroll.current * lerp;
      if (video.duration && isFinite(video.duration) && !isSeeking && now - lastSeekTime > 40) {
        const targetTime = video.duration * smoothScroll.current;
        if (Math.abs(video.currentTime - targetTime) > 0.02) {
          isSeeking = true;
          lastSeekTime = now;
          video.currentTime = targetTime;
        }
      }
      drawVideo();
      rafId = requestAnimationFrame(loop);
    };

    const onResize = () => { setCanvasSize(); drawVideo(); };
    window.addEventListener("resize", onResize);

    const onReady = () => {
      if (video.readyState >= 2) {
        setPosterVisible(false);
        setCanvasSize();
        drawVideo();
      }
    };
    const onSeeked = () => { isSeeking = false; drawVideo(); };

    video.addEventListener("loadedmetadata", onReady, { once: true });
    video.addEventListener("loadeddata", onReady, { once: true });
    video.addEventListener("canplaythrough", onReady, { once: true });
    video.addEventListener("seeked", onSeeked);

    onScroll();
    smoothScroll.current = rawScroll.current;
    rafId = requestAnimationFrame(loop);

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      video.removeEventListener("seeked", onSeeked);
      if (video.parentNode) video.parentNode.removeChild(video);
      video.pause();
      video.src = "";
      video.load();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0" style={{ backgroundColor: "#0a0a0a" }}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none" }} />
      {posterVisible && (
        <img src={`${import.meta.env.BASE_URL}poster.jpg`} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ pointerEvents: "none" }} />
      )}
    </div>
  );
}

/* Mobile: canvas + visible video element */
function MobileVideoBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [posterVisible, setPosterVisible] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let canvasW = 0;
    let canvasH = 0;

    const setCanvasSize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvasW = w;
      canvasH = h;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    setCanvasSize();

    const rawScroll = { current: 0 };
    const smoothScroll = { current: 0 };
    let isSeeking = false;
    let lastSeekTime = 0;
    let running = true;
    let rafId: number;
    let decoderActive = false;

    const drawVideo = () => {
      if (!video || video.readyState < 2) return;
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
    };

    const onScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      rawScroll.current = window.scrollY / Math.max(docHeight, 1);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const loop = () => {
      if (!running) return;
      const now = performance.now();
      const lerp = 0.08;
      smoothScroll.current = smoothScroll.current * (1 - lerp) + rawScroll.current * lerp;
      if (decoderActive && video.duration && isFinite(video.duration) && !isSeeking && now - lastSeekTime > 40) {
        const targetTime = video.duration * smoothScroll.current;
        if (Math.abs(video.currentTime - targetTime) > 0.02) {
          isSeeking = true;
          lastSeekTime = now;
          video.currentTime = targetTime;
        }
      }
      drawVideo();
      rafId = requestAnimationFrame(loop);
    };

    const onSeeked = () => { isSeeking = false; drawVideo(); };

    const onReady = () => {
      if (video.readyState >= 2) {
        setPosterVisible(false);
        setCanvasSize();
        drawVideo();
      }
    };

    video.addEventListener("loadedmetadata", onReady, { once: true });
    video.addEventListener("loadeddata", onReady, { once: true });
    video.addEventListener("canplaythrough", onReady, { once: true });
    video.addEventListener("seeked", onSeeked);

    // Activate decoder: play() then set playbackRate = 0
    // This keeps video in 'playing' state (decoder stays active)
    const onGesture = () => {
      if (decoderActive) return;
      const p = video.play();
      if (p !== undefined) {
        p.then(() => {
          video.playbackRate = 0;
          decoderActive = true;
        }).catch(() => {
          // play() rejected — decoder still may be active
          decoderActive = true;
        });
      } else {
        video.play();
        video.playbackRate = 0;
        decoderActive = true;
      }
    };
    window.addEventListener("touchstart", onGesture, { once: true, passive: true });
    window.addEventListener("click", onGesture, { once: true });
    window.addEventListener("wheel", onGesture, { once: true, passive: true });

    onScroll();
    smoothScroll.current = rawScroll.current;
    rafId = requestAnimationFrame(loop);

    const onResize = () => { setCanvasSize(); drawVideo(); };
    window.addEventListener("resize", onResize);

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      video.removeEventListener("seeked", onSeeked);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0" style={{ backgroundColor: "#0a0a0a" }}>
      {/* Video element: visible in DOM but covered by canvas */}
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
