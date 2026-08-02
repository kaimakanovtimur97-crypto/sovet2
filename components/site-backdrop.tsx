"use client";

import { useEffect, useRef, useState } from "react";

const VIDEO_VERSION = "20260731-higgs-a05f6fa1";

export function SiteBackdrop() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const markReady = () => {
      if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        setReady(true);
      }
    };

    const startPlayback = () => {
      markReady();
      void video.play().catch(() => {
        // Some browsers postpone autoplay until the tab becomes active.
      });
    };

    const handleVisibility = () => {
      if (!document.hidden) startPlayback();
    };

    video.addEventListener("loadeddata", startPlayback);
    video.addEventListener("canplay", startPlayback);
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("pointerdown", startPlayback, { once: true });

    video.load();
    startPlayback();

    return () => {
      video.removeEventListener("loadeddata", startPlayback);
      video.removeEventListener("canplay", startPlayback);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("pointerdown", startPlayback);
    };
  }, []);

  return (
    <div className={`site-backdrop${ready ? " is-video-ready" : ""}`} aria-hidden="true">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster="/ambient-bg-poster.webp"
        width="1280"
        height="720"
        disablePictureInPicture
      >
        <source
          media="(max-width: 700px)"
          src={`/ambient-bg-mobile.mp4?v=${VIDEO_VERSION}`}
          type="video/mp4"
        />
        <source
          src={`/ambient-bg-desktop.mp4?v=${VIDEO_VERSION}`}
          type="video/mp4"
        />
      </video>
      <div className="site-backdrop-shade" />
      <div className="site-backdrop-aurora" />
    </div>
  );
}
