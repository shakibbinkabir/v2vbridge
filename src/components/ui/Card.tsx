import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
  as: Tag = "article",
}: {
  children: ReactNode;
  className?: string;
  as?: "article" | "div" | "section" | "li";
}) {
  return (
    <Tag
      className={`flex flex-col rounded-lg border border-brand-rule/70 bg-brand-cream/60 transition hover:-translate-y-0.5 hover:border-brand-teal/40 hover:shadow-sm ${className}`.trim()}
    >
      {children}
    </Tag>
  );
}
