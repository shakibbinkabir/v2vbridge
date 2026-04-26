import type { ReactNode } from "react";

import { Container } from "./Container";

type Tone = "cream" | "teal" | "white";

const TONE_CLASSES: Record<Tone, string> = {
  cream: "bg-brand-cream text-brand-ink",
  teal: "bg-brand-teal text-white",
  white: "bg-white text-brand-ink",
};

export function Section({
  children,
  tone = "cream",
  className = "",
  contained = true,
  as: Tag = "section",
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
  contained?: boolean;
  as?: "section" | "header" | "footer" | "div";
}) {
  const inner = contained ? <Container>{children}</Container> : children;
  return (
    <Tag className={`py-14 sm:py-20 ${TONE_CLASSES[tone]} ${className}`.trim()}>
      {inner}
    </Tag>
  );
}
