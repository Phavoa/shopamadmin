"use client";

import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { AlertCircle, Loader2 } from "lucide-react";

interface VideoPlayerProps {
  src: string | null;
  poster?: string | null;
  autoPlay?: boolean;
  className?: string;
  minimal?: boolean; // New prop for immersive/strict live mode
}

export default function VideoPlayer({
  src,
  poster,
  autoPlay = true,
  className = "",
  minimal = false,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Reset states when src changes
    setError(null);
    setLoading(true);

    if (!src) {
      setLoading(false);
      return;
    }

    // Auto-proxy CDN URLs to bypass CORS in dev/admin dashboard
    let loadSrc = src;
    if (src.includes("cdn.shopam.org/streams")) {
      loadSrc = src.replace("https://cdn.shopam.org/streams", "/hls-proxy");
      console.log("Proxying HLS URL:", loadSrc);
    }

    let hls: Hls | null = null;

    const handleLoadedMetadata = () => {
      setLoading(false);
      if (autoPlay) {
        video.play().catch((e) => {
          console.error("Autoplay failed:", e);
        });
      }
    };

    const handleHlsError = (
      event: string,
      data: {
        fatal: boolean;
        type: string;
        details: string;
        [key: string]: any;
      },
    ) => {
      if (data.fatal) {
        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            console.log("HLS Network Error, attempting recovery...");
            hls?.startLoad();
            break;
          case Hls.ErrorTypes.MEDIA_ERROR:
            console.log("HLS Media Error, attempting recovery...");
            hls?.recoverMediaError();
            break;
          default:
            console.error("HLS Fatal Error:", data);
            setError(`Playback failed: ${data.details}`);
            setLoading(false);
            hls?.destroy();
            break;
        }
      }
    };

    const handleNativeError = (e: Event) => {
      console.error("Native Video error:", e);
      const err = video.error;
      const message = err
        ? `Error code: ${err.code} - ${err.message}`
        : "Unknown error";
      setError(`Native playback failed: ${message}`);
      setLoading(false);
    };

    if (Hls.isSupported()) {
      hls = new Hls({
        debug: false,
        enableWorker: true,
        // 1. Ultra-Low Latency Configuration
        lowLatencyMode: true,
        backBufferLength: 0, // Do not buffer past content
        liveSyncDurationCount: 3, // Stay 3 segments from live edge
        liveMaxLatencyDurationCount: 10, // Max allowed latency before jumping
        maxLiveSyncPlaybackRate: 2.0, // Catch up speed
        // 2. Start at Live Edge
        startFragPrefetch: true,
      });

      hlsRef.current = hls; // Store ref for cleanup/access

      hls.loadSource(loadSrc);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        handleLoadedMetadata();
        // Force jump to live edge if not already there
        if (autoPlay) {
          video.play().catch(() => {});
        }
      });

      hls.on(Hls.Events.ERROR, handleHlsError);
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Native HLS support (Safari)
      video.src = loadSrc;
      video.addEventListener("loadedmetadata", handleLoadedMetadata);
      video.addEventListener("error", handleNativeError);
    } else {
      setError("HLS is not supported in this browser.");
      setLoading(false);
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
      if (video) {
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
        video.removeEventListener("error", handleNativeError);
      }
    };
  }, [src, autoPlay]);

  return (
    <div className={`relative bg-b overflow-hidden ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/50">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
      )}

      {error && !minimal && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-black/80 text-white p-4 text-center">
          <AlertCircle className="w-8 h-8 mb-2 text-red-500" />
          <p className="text-sm font-semibold">{error}</p>
        </div>
      )}

      <video
        ref={videoRef}
        poster={poster || undefined}
        className={`w-full h-full object-cover ${minimal ? "pointer-events-none" : ""}`}
        controls={!minimal} // Hide controls if strict live mode
        playsInline
        muted={autoPlay} // Muted often required for autoplay
        disablePictureInPicture // Reduce interference
        onContextMenu={(e) => e.preventDefault()} // Disable right click
      />
    </div>
  );
}
