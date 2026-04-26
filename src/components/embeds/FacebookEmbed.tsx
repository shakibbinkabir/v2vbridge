"use client";

import { useEffect } from "react";

import { EmbedFallback } from "./EmbedFallback";
import { LazyMount } from "./LazyMount";

const ROOT_ID = "fb-root";
const SCRIPT_ID = "v2v-fb-embed";
const SCRIPT_SRC = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v18.0";

type FBGlobal = {
  XFBML?: { parse?: () => void };
};

declare global {
  interface Window {
    FB?: FBGlobal;
  }
}

function FacebookMounted({ embedUrl }: { embedUrl: string }) {
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!document.getElementById(ROOT_ID)) {
      const root = document.createElement("div");
      root.id = ROOT_ID;
      document.body.appendChild(root);
    }
    if (window.FB?.XFBML?.parse) {
      window.FB.XFBML.parse();
      return;
    }
    if (document.getElementById(SCRIPT_ID)) return;
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.async = true;
    script.defer = true;
    script.crossOrigin = "anonymous";
    script.src = SCRIPT_SRC;
    document.body.appendChild(script);
  }, []);

  return (
    <div
      className="fb-post"
      data-href={embedUrl}
      data-width="500"
      data-show-text="true"
    >
      <blockquote cite={embedUrl} className="fb-xfbml-parse-ignore">
        <a
          href={embedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-sans text-brand-teal underline"
        >
          View on Facebook
        </a>
      </blockquote>
    </div>
  );
}

export function FacebookEmbed({ embedUrl }: { embedUrl: string }) {
  return (
    <LazyMount fallback={<EmbedFallback platform="Facebook" href={embedUrl} />}>
      <FacebookMounted embedUrl={embedUrl} />
    </LazyMount>
  );
}
