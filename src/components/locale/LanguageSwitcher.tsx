"use client";

import type { Locale } from "@/lib/locale";

import { useLocale } from "./LocaleProvider";

const OPTIONS: { value: Locale; label: string; lang: string }[] = [
  { value: "en", label: "EN", lang: "en" },
  { value: "bn", label: "বাং", lang: "bn" },
];

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale, setLocale } = useLocale();
  return (
    <div
      role="group"
      aria-label="Language"
      className={`inline-flex items-center rounded-full border border-brand-rule/70 bg-white p-0.5 text-xs ${className}`.trim()}
    >
      {OPTIONS.map((option) => {
        const active = locale === option.value;
        return (
          <button
            key={option.value}
            type="button"
            lang={option.lang}
            data-loc-keep=""
            aria-pressed={active}
            onClick={() => setLocale(option.value)}
            className={
              "rounded-full px-3 py-1 transition " +
              (active
                ? "bg-brand-teal text-white"
                : "text-brand-mute hover:text-brand-teal")
            }
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
