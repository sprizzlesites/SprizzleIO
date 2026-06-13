import { useEffect, useRef, useState } from "react";

export default function VideoBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [posterVisible, setPosterVisible] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Create hidden video element
    const video = document.createElement("video");
    video.src = "/scroll-bg.mp4";
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

    // Canvas sizing
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

    // Scroll inertia physics
    const rawScroll = { current: 0 };    // Instant scroll position
    const smoothScroll = { current: 0 }; // Smooth position (velocity-driven)
    const velocity = { current: 0 };     // Scroll momentum
    const maxScroll = { current: 0 };    // Total scrollable height

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
        sW = canvasW;
        sH = canvasW / vAspect;
        sx = 0;
        sy = (canvasH - sH) / 2;
      } else {
        sH = canvasH;
        sW = canvasH * vAspect;
        sx = (canvasW - sW) / 2;
        sy = 0;
      }

      ctx.clearRect(0, 0, canvasW, canvasH);
      ctx.drawImage(video, sx, sy, sW, sH);
    };

    // Track scroll velocity
    const onScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      maxScroll.current = docHeight;
      const newPos = window.scrollY / Math.max(docHeight, 1);
      const delta = newPos - rawScroll.current;
      velocity.current += delta * 0.35; // impulse from scroll delta
      rawScroll.current = newPos;
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    // Animation loop: physics + throttle + draw
    const loop = () => {
      if (!running) return;

      const now = performance.now();

      // Inertia physics: velocity decays with friction, glides to a stop
      velocity.current *= 0.94; // Friction: higher = more glide, lower = snappier
      if (Math.abs(velocity.current) < 0.00005) {
        velocity.current = 0;
      }

      // Spring: smoothScroll is pulled toward rawScroll by the spring force
      const springForce = (rawScroll.current - smoothScroll.current) * 0.06;
      velocity.current += springForce;

      // Apply velocity
      smoothScroll.current += velocity.current;
      smoothScroll.current = Math.max(0, Math.min(1, smoothScroll.current));

      // Update video time (throttled)
      if (
        video.duration &&
        isFinite(video.duration) &&
        !isSeeking &&
        now - lastSeekTime > 40
      ) {
        const targetTime = video.duration * smoothScroll.current;
        const timeDiff = Math.abs(video.currentTime - targetTime);
        if (timeDiff > 0.02) {
          isSeeking = true;
          lastSeekTime = now;
          video.currentTime = targetTime;
        }
      }

      drawVideo();
      rafId = requestAnimationFrame(loop);
    };

    // Resize
    const onResize = () => {
      setCanvasSize();
      drawVideo();
    };
    window.addEventListener("resize", onResize);

    // Video ready
    const onReady = () => {
      if (video.readyState >= 2) {
        setPosterVisible(false);
        setCanvasSize();
        drawVideo();
      }
    };

    const onSeeked = () => {
      isSeeking = false;
      drawVideo();
    };

    video.addEventListener("loadedmetadata", onReady, { once: true });
    video.addEventListener("loadeddata", onReady, { once: true });
    video.addEventListener("canplaythrough", onReady, { once: true });
    video.addEventListener("seeked", onSeeked);

    // Initialize scroll position
    onScroll();
    smoothScroll.current = rawScroll.current;

    rafId = requestAnimationFrame(loop);

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      video.removeEventListener("seeked", onSeeked);
      if (video.parentNode) {
        video.parentNode.removeChild(video);
      }
      video.pause();
      video.src = "";
      video.load();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0" style={{ backgroundColor: "#0a0a0a" }}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: "none" }}
      />
      {posterVisible && (
        <img
          src="/poster.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ pointerEvents: "none" }}
        />
      )}
    </div>
  );
}
