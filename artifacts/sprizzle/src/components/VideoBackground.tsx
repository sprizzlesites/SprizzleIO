import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const [posterVisible, setPosterVisible] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const setup = () => {
      if (triggerRef.current) return;
      triggerRef.current = ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          if (video.duration && isFinite(video.duration)) {
            video.currentTime = video.duration * self.progress;
          }
        },
      });
    };

    const onLoaded = () => {
      setPosterVisible(false);
      setup();
    };

    if (video.readyState >= 1) {
      onLoaded();
    } else {
      video.addEventListener("loadedmetadata", onLoaded, { once: true });
      video.addEventListener("loadeddata", onLoaded, { once: true });
    }

    return () => {
      triggerRef.current?.kill();
      triggerRef.current = null;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0" style={{ backgroundColor: "#0a0a0a" }}>
      <video
        ref={videoRef}
        src="/scroll-bg.mp4"
        preload="auto"
        muted
        playsInline
        poster="/poster.jpg"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ pointerEvents: "none" }}
        data-testid="scroll-video"
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
