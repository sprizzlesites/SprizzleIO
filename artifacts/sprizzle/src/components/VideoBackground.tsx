import { useEffect, useRef, useState } from "react";

function drawBitmap(
  bitmap: ImageBitmap,
  ctx: CanvasRenderingContext2D,
  canvasW: number,
  canvasH: number,
) {
  const vAspect = bitmap.width / bitmap.height;
  const cAspect = canvasW / canvasH;
  let sx: number, sy: number, sW: number, sH: number;
  if (cAspect > vAspect) {
    sW = canvasW; sH = canvasW / vAspect; sx = 0; sy = (canvasH - sH) / 2;
  } else {
    sH = canvasH; sW = canvasH * vAspect; sx = (canvasW - sW) / 2; sy = 0;
  }
  ctx.clearRect(0, 0, canvasW, canvasH);
  ctx.drawImage(bitmap, sx, sy, sW, sH);
}

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

async function seekTo(video: HTMLVideoElement, time: number): Promise<void> {
  return new Promise((resolve) => {
    const onSeeked = () => { video.removeEventListener("seeked", onSeeked); resolve(); };
    video.addEventListener("seeked", onSeeked);
    video.currentTime = time;
  });
}

/* Desktop: pre-cache all frames as ImageBitmaps, then scrub from array */
function DesktopVideoBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
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
    video.style.cssText = "position:absolute;visibility:hidden;pointer-events:none;width:1px;height:1px";
    document.body.appendChild(video);

    const dpr = 1;
    let canvasW = 0;
    let canvasH = 0;

    const setCanvasSize = () => {
      canvasW = window.innerWidth;
      canvasH = window.innerHeight;
      canvas.width = canvasW * dpr;
      canvas.height = canvasH * dpr;
      canvas.style.width = `${canvasW}px`;
      canvas.style.height = `${canvasH}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    setCanvasSize();

    const rawScroll = { current: 0 };
    const smoothScroll = { current: 0 };
    const frames: ImageBitmap[] = [];
    let scrubEnabled = false;
    let running = true;
    let rafId: number;
    let aborted = false;

    const onScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      rawScroll.current = window.scrollY / Math.max(docHeight, 1);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const onResize = () => { setCanvasSize(); };
    window.addEventListener("resize", onResize);

    // RAF loop: once scrubbing is enabled, draw from the cached frame array
    const loop = () => {
      if (!running) return;
      const lerp = 0.08;
      smoothScroll.current = smoothScroll.current * (1 - lerp) + rawScroll.current * lerp;
      if (scrubEnabled && frames.length > 0) {
        const idx = Math.round(smoothScroll.current * (frames.length - 1));
        const bitmap = frames[Math.min(idx, frames.length - 1)];
        if (bitmap) drawBitmap(bitmap, ctx, canvasW, canvasH);
      }
      rafId = requestAnimationFrame(loop);
    };

    // Capture pass: seek to each frame time, grab an ImageBitmap
    const FRAME_COUNT = 120;
    const captureFrames = async () => {
      if (!video.duration || !isFinite(video.duration)) return;

      const captureW = Math.min(Math.round(window.innerWidth), 960);
      const captureH = Math.round(captureW / (video.videoWidth / video.videoHeight));

      for (let i = 0; i < FRAME_COUNT; i++) {
        if (aborted) break;
        const t = (i / (FRAME_COUNT - 1)) * video.duration;
        await seekTo(video, t);
        if (aborted) break;
        try {
          // createImageBitmap resize is supported in Chrome/Edge; Firefox ignores it (fine)
          const bitmap = await createImageBitmap(video, { resizeWidth: captureW, resizeHeight: captureH });
          frames.push(bitmap);
        } catch {
          // Fallback: capture at native resolution
          const bitmap = await createImageBitmap(video);
          frames.push(bitmap);
        }

        // Progressive unlock: start scrubbing after first 30 frames
        if (frames.length === 30) {
          setPosterVisible(false);
          scrubEnabled = true;
        }
      }
    };

    // Wait for enough buffering before starting the capture pass
    const startCapture = () => {
      onScroll();
      smoothScroll.current = rawScroll.current;
      rafId = requestAnimationFrame(loop);
      captureFrames();
    };

    const onCanPlayThrough = () => startCapture();
    const onProgress = () => {
      if (video.duration && isBufferedAt(video, 0.5)) {
        video.removeEventListener("progress", onProgress);
        startCapture();
      }
    };

    video.addEventListener("canplaythrough", onCanPlayThrough, { once: true });
    video.addEventListener("progress", onProgress);

    return () => {
      aborted = true;
      running = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      video.removeEventListener("progress", onProgress);
      video.removeEventListener("canplaythrough", onCanPlayThrough);
      if (video.parentNode) video.parentNode.removeChild(video);
      video.pause();
      video.src = "";
      video.load();
      // Free GPU memory
      frames.forEach((b) => b.close());
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

/* Mobile: canvas + visible video element (unchanged — working well) */
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

    const dpr = 1;
    let canvasW = 0;
    let canvasH = 0;

    const setCanvasSize = () => {
      canvasW = window.innerWidth;
      canvasH = window.innerHeight;
      canvas.width = canvasW * dpr;
      canvas.height = canvasH * dpr;
      canvas.style.width = `${canvasW}px`;
      canvas.style.height = `${canvasH}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    setCanvasSize();

    const rawScroll = { current: 0 };
    const smoothScroll = { current: 0 };
    let isSeeking = false;
    let decoderActive = false;
    let running = true;
    let rafId: number;

    const onScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      rawScroll.current = window.scrollY / Math.max(docHeight, 1);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const onSeeked = () => {
      isSeeking = false;
      drawFrame(video, ctx, canvasW, canvasH);
    };
    video.addEventListener("seeked", onSeeked);

    const loop = () => {
      if (!running) return;
      const lerp = 0.08;
      smoothScroll.current = smoothScroll.current * (1 - lerp) + rawScroll.current * lerp;
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
    window.addEventListener("touchstart", onGesture, { once: true, passive: true });
    window.addEventListener("click", onGesture, { once: true });
    window.addEventListener("wheel", onGesture, { once: true, passive: true });

    onScroll();
    smoothScroll.current = rawScroll.current;
    rafId = requestAnimationFrame(loop);

    const onResize = () => { setCanvasSize(); drawFrame(video, ctx, canvasW, canvasH); };
    window.addEventListener("resize", onResize);

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("progress", onProgress);
    };
  }, []);

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
