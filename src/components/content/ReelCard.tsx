import Link from "next/link";

import type { Reel } from "@/lib/types";

import { Card } from "../ui/Card";

const PLATFORM_LABEL: Record<Reel["platform"], string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  facebook: "Facebook",
};

const PLATFORM_TINT: Record<Reel["platform"], string> = {
  instagram:
    "bg-gradient-to-br from-fuchsia-500/20 via-pink-500/20 to-amber-400/20",
  tiktok:
    "bg-gradient-to-br from-cyan-500/20 via-rose-500/20 to-black/30",
  facebook:
    "bg-gradient-to-br from-blue-600/20 via-blue-500/20 to-blue-400/20",
};

function excerpt(text: string, max = 110): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + "…";
}

export function ReelCard({
  reel,
  linkTo = "entrepreneur",
}: {
  reel: Reel;
  linkTo?: "entrepreneur" | "platform";
}) {
  const href =
    linkTo === "platform"
      ? reel.embedUrl
      : `/entrepreneurs/${reel.entrepreneurId}`;
  const isExternal = linkTo === "platform";
  const platformLabel = PLATFORM_LABEL[reel.platform];

  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    isExternal ? (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {children}
      </a>
    ) : (
      <Link href={href} className="block">
        {children}
      </Link>
    );

  return (
    <Card className="overflow-hidden">
      <Wrapper>
        <div
          className={`relative flex aspect-[9/12] w-full items-end ${PLATFORM_TINT[reel.platform]} bg-brand-cream`}
        >
          <span className="absolute right-3 top-3 inline-flex items-center rounded-full border border-white/40 bg-black/40 px-2.5 py-0.5 font-sans text-[11px] font-medium uppercase tracking-wide text-white">
            {platformLabel}
          </span>
          <div className="relative z-10 w-full bg-gradient-to-t from-black/60 to-transparent p-4">
            <p className="text-sm text-white">
              <span lang="en" className="font-sans">{excerpt(reel.caption.en)}</span>
              <span lang="bn" className="font-bangla">{excerpt(reel.caption.bn)}</span>
            </p>
          </div>
        </div>
      </Wrapper>

      {!isExternal ? (
        <a
          href={reel.embedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block px-4 py-2 font-sans text-xs text-brand-mute hover:text-brand-teal"
        >
          Open on {platformLabel} →
        </a>
      ) : null}
    </Card>
  );
}
