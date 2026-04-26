import type { ReactNode } from "react";

import type { BilingualString } from "@/lib/types";

import { Container } from "../layout/Container";

import { BilingualText } from "./BilingualText";

export function Hero({
  title,
  kicker,
  intro,
  actions,
  tone = "cream",
}: {
  title: BilingualString;
  kicker?: BilingualString;
  intro?: BilingualString;
  actions?: ReactNode;
  tone?: "cream" | "teal";
}) {
  const isTeal = tone === "teal";
  return (
    <section
      className={`${
        isTeal ? "bg-brand-teal text-white" : "bg-brand-cream text-brand-ink"
      } py-16 sm:py-24`}
    >
      <Container className="max-w-3xl">
        {kicker ? (
          <p
            className={`mb-4 text-sm uppercase tracking-[0.2em] ${
              isTeal ? "text-brand-cream/80" : "text-brand-coral"
            }`}
          >
            <span lang="en" className="font-sans">{kicker.en}</span>
            <span lang="bn" className="font-bangla">{kicker.bn}</span>
          </p>
        ) : null}

        <BilingualText
          content={title}
          as="h1"
          className="font-sans text-4xl font-semibold leading-tight tracking-tight sm:text-5xl"
        />

        {intro ? (
          <BilingualText
            content={intro}
            as="p"
            className={`mt-6 max-w-2xl text-lg ${
              isTeal ? "text-brand-cream/90" : "text-brand-ink/90"
            }`}
          />
        ) : null}

        {actions ? <div className="mt-8 flex flex-wrap gap-3">{actions}</div> : null}
      </Container>
    </section>
  );
}
