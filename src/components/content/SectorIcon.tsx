type Props = { sector: string; className?: string; title?: string };

const PATHS: Record<string, string> = {
  tailoring:
    "M30 75 L50 25 L70 75 M40 50 L60 50 M50 25 L50 80",
  "fish-drying":
    "M20 50 Q35 30 55 50 Q35 70 20 50 Z M55 50 L75 40 L75 60 Z M28 48 L28 52",
  dairy:
    "M40 30 L60 30 L65 45 L65 75 Q50 80 35 75 L35 45 Z M40 40 L60 40",
  handicraft:
    "M50 25 L25 50 L50 75 L75 50 Z M50 25 L50 75 M25 50 L75 50",
  "organic-farming":
    "M50 80 L50 40 M50 40 Q35 40 30 25 Q45 28 50 40 Q55 28 70 25 Q65 40 50 40 M30 80 L70 80",
};

function key(sector: string) {
  return sector.toLowerCase().replace(/\s+/g, "-");
}

export function SectorIcon({ sector, className, title }: Props) {
  const k = key(sector);
  const d = PATHS[k] ?? "M30 70 Q50 30 70 70 M30 70 L70 70";
  const label = title ?? `${sector} icon`;
  return (
    <svg
      viewBox="0 0 100 100"
      role="img"
      aria-label={label}
      className={className}
    >
      <title>{label}</title>
      <rect width="100" height="100" rx="12" fill="var(--color-brand-cream)" />
      <path
        d={d}
        fill="none"
        stroke="var(--color-brand-coral)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
