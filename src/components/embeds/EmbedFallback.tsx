import type { ReactNode } from "react";

export function EmbedFallback({
  platform,
  href,
  children,
}: {
  platform: string;
  href: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-start justify-between gap-3 rounded-lg border border-brand-rule bg-white p-5 text-sm text-brand-ink/80">
      <div className="font-sans">
        <p className="font-medium text-brand-teal">{platform} embed</p>
        <p className="mt-1 text-brand-mute">
          {children ??
            "Embedded media loads when the embed comes into view. If the platform script is blocked, use the link below."}
        </p>
      </div>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 font-sans font-medium text-brand-teal underline-offset-4 hover:underline"
      >
        Open on {platform} →
      </a>
    </div>
  );
}
