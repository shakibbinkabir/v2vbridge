import type { ReactNode } from "react";

type Variant = "coral" | "teal" | "neutral";

const VARIANT: Record<Variant, string> = {
  coral: "bg-brand-cream text-brand-coral border-brand-coral/30",
  teal: "bg-brand-teal/10 text-brand-teal border-brand-teal/30",
  neutral: "bg-white text-brand-mute border-brand-rule",
};

export function Tag({
  children,
  variant = "coral",
  className = "",
}: {
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-sans text-xs font-medium ${VARIANT[variant]} ${className}`.trim()}
    >
      {children}
    </span>
  );
}
