import type { ElementType, ReactNode } from "react";

import type { BilingualString } from "@/lib/types";

type Variant = "stacked" | "side-by-side";

export function BilingualText({
  content,
  as: Tag = "p" as ElementType,
  variant = "stacked",
  className = "",
  enClassName = "",
  bnClassName = "",
}: {
  content: BilingualString;
  as?: ElementType;
  variant?: Variant;
  className?: string;
  enClassName?: string;
  bnClassName?: string;
}) {
  if (variant === "side-by-side") {
    return (
      <Tag className={`flex flex-wrap items-baseline gap-x-2 ${className}`.trim()}>
        <span lang="en" className={`font-sans ${enClassName}`.trim()}>
          {content.en}
        </span>
        <span
          lang="bn"
          className={`font-bangla ${bnClassName}`.trim()}
          aria-label={`Bangla: ${content.bn}`}
        >
          {content.bn}
        </span>
      </Tag>
    );
  }

  return (
    <Tag className={className}>
      <span lang="en" className={`font-sans ${enClassName}`.trim()}>
        {content.en}
      </span>
      <span lang="bn" className={`font-bangla ${bnClassName}`.trim()}>
        {content.bn}
      </span>
    </Tag>
  );
}

export function isBilingualString(value: unknown): value is BilingualString {
  return (
    typeof value === "object" &&
    value !== null &&
    "en" in value &&
    "bn" in value &&
    typeof (value as { en: unknown }).en === "string" &&
    typeof (value as { bn: unknown }).bn === "string"
  );
}

export function bilingualChildren(
  bilingual: BilingualString,
): { en: ReactNode; bn: ReactNode } {
  return {
    en: <span lang="en" className="font-sans">{bilingual.en}</span>,
    bn: <span lang="bn" className="font-bangla">{bilingual.bn}</span>,
  };
}
