"use client";

import { useEffect } from "react";

import { EmbedFallback } from "./EmbedFallback";
import { LazyMount } from "./LazyMount";

const SCRIPT_ID = "v2v-ig-embed";
const SCRIPT_SRC = "https://www.instagram.com/embed.js";

type InstgrmGlobal = {
  Embeds?: { process?: () => void };
};

declare global {
  interface Window {
    instgrm?: InstgrmGlobal;
  }
}

function InstagramMounted({ embedUrl }: { embedUrl: string }) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.instgrm?.Embeds?.process) {
      window.instgrm.Embeds.process();
      return;
    }
    if (document.getElementById(SCRIPT_ID)) return;
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.async = true;
    script.src = SCRIPT_SRC;
    document.body.appendChild(script);
  }, []);

  return (
    <blockquote
      className="instagram-media"
      data-instgrm-captioned=""
      data-instgrm-permalink={embedUrl}
      data-instgrm-version="14"
      style={{ background: "#FFF", margin: 0, maxWidth: 540, width: "100%" }}
    >
      <a href={embedUrl} target="_blank" rel="noopener noreferrer">
        View on Instagram
      </a>
    </blockquote>
  );
}

export function InstagramEmbed({ embedUrl }: { embedUrl: string }) {
  return (
    <LazyMount
      fallback={<EmbedFallback platform="Instagram" href={embedUrl} />}
    >
      <InstagramMounted embedUrl={embedUrl} />
    </LazyMount>
  );
}
