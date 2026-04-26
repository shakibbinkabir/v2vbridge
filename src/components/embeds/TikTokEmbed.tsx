"use client";

import { useEffect } from "react";

import { EmbedFallback } from "./EmbedFallback";
import { LazyMount } from "./LazyMount";

const SCRIPT_ID = "v2v-tiktok-embed";
const SCRIPT_SRC = "https://www.tiktok.com/embed.js";

function videoIdFromUrl(url: string): string | null {
  const match = url.match(/\/video\/(\d+)/);
  return match ? match[1] ?? null : null;
}

function TikTokMounted({ embedUrl }: { embedUrl: string }) {
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.getElementById(SCRIPT_ID)) return;
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.async = true;
    script.src = SCRIPT_SRC;
    document.body.appendChild(script);
  }, []);

  const videoId = videoIdFromUrl(embedUrl);

  return (
    <blockquote
      className="tiktok-embed"
      cite={embedUrl}
      data-video-id={videoId ?? undefined}
      style={{ maxWidth: 605, minWidth: 280, margin: 0 }}
    >
      <section>
        <a
          href={embedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-sans text-brand-teal underline"
        >
          View on TikTok
        </a>
      </section>
    </blockquote>
  );
}

export function TikTokEmbed({ embedUrl }: { embedUrl: string }) {
  return (
    <LazyMount fallback={<EmbedFallback platform="TikTok" href={embedUrl} />}>
      <TikTokMounted embedUrl={embedUrl} />
    </LazyMount>
  );
}
