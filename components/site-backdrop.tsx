"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const VIDEO_VERSION = "20260731-higgs-a05f6fa1";

export function SiteBackdrop() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const resetFrame = window.requestAnimationFrame(() => setReady(false));
    const video = videoRef.current;
    if (!video || pathname !== "/") {
      return () => window.cancelAnimationFrame(resetFrame);
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const connection = navigator as Navigator & { connection?: { saveData?: boolean } };
    if (reduceMotion || connection.connection?.saveData) {
      return () => window.cancelAnimationFrame(resetFrame);
    }

    let started = false;
    let sourceAttached = false;
    let timer = 0;
    const source = window.matchMedia("(max-width: 700px)").matches
      ? `/ambient-bg-mobile.mp4?v=${VIDEO_VERSION}`
      : `/ambient-bg-desktop.mp4?v=${VIDEO_VERSION}`;

    const markReady = () => {
      if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        setReady(true);
      }
    };

    const startPlayback = () => {
      if (!sourceAttached) {
        video.src = source;
        sourceAttached = true;
        video.load();
      }
      started = true;
      markReady();
      void video.play().catch(() => {
        // Some browsers postpone autoplay until the tab becomes active.
      });
    };

    const handleVisibility = () => {
      if (document.hidden) video.pause();
      else if (started) startPlayback();
    };

    video.addEventListener("loadeddata", startPlayback);
    video.addEventListener("canplay", startPlayback);
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("pointerdown", startPlayback, { once: true });

    // Keep the lightweight poster during the first render. Loading the ambient
    // video after the LCP window preserves the visual direction without making
    // the decorative asset compete with the page's primary content.
    timer = window.setTimeout(() => {
      startPlayback();
    }, 4000);

    return () => {
      video.removeEventListener("loadeddata", startPlayback);
      video.removeEventListener("canplay", startPlayback);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("pointerdown", startPlayback);
      window.cancelAnimationFrame(resetFrame);
      window.clearTimeout(timer);
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, [pathname]);

  return (
    <div className={`site-backdrop${ready ? " is-video-ready" : ""}`} aria-hidden="true">
      <video
        ref={videoRef}
        loop
        muted
        playsInline
        preload="none"
        poster="/ambient-bg-poster.webp"
        width="1280"
        height="720"
        disablePictureInPicture
      />
      <div className="site-backdrop-shade" />
      <div className="site-backdrop-aurora" />
    </div>
  );
}
