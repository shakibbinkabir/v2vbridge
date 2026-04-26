import type { ReactNode } from "react";

export function Prose({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto w-full max-w-prose space-y-5 text-base leading-relaxed text-brand-ink/90 [&>h2]:mt-8 [&>h2]:font-sans [&>h2]:text-2xl [&>h2]:font-semibold [&>h2]:text-brand-teal [&>h3]:mt-6 [&>h3]:font-sans [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:text-brand-teal [&>p]:font-sans ${className}`.trim()}
    >
      {children}
    </div>
  );
}
