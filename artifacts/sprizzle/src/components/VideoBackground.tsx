import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function VideoBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [posterVisible, setPosterVisible] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Create video element (hidden in DOM for decoding)
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

    // Canvas sizing with DPR
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

    // Smooth scroll progress state
    const smooth = { current: 0 };
    const target = { current: 0 };
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

    // Animation loop: lerp + throttle + draw
    const loop = () => {
      if (!running) return;

      // Smooth scroll progress with lerp
      const diff = target.current - smooth.current;
      smooth.current += diff * 0.12; // Lerp factor: higher = snappier, lower = smoother

      // Update video time (throttled to avoid seek spam)
      const now = performance.now();
      if (
        video.duration &&
        isFinite(video.duration) &&
        !isSeeking &&
        now - lastSeekTime > 50 // Min 50ms between seeks
      ) {
        const targetTime = video.duration * smooth.current;
        const timeDiff = Math.abs(video.currentTime - targetTime);
        if (timeDiff > 0.03) { // 3 frame threshold at 24fps
          isSeeking = true;
          lastSeekTime = now;
          video.currentTime = targetTime;
        }
      }

      // Draw current frame
      drawVideo();

      rafId = requestAnimationFrame(loop);
    };

    // ScrollTrigger drives target progress
    const trigger = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        target.current = self.progress;
      },
    });

    // Resize handler
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
        if (!rafId) {
          rafId = requestAnimationFrame(loop);
        }
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

    // Fallback: start loop anyway
    rafId = requestAnimationFrame(loop);

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      trigger.kill();
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
