import type { Metadata } from "next";

import { Container } from "@/components/layout/Container";
import {
  getAllEntrepreneurs,
  getAllPublishedPodcasts,
  getAllPublishedReels,
} from "@/lib/content";
import type { Entrepreneur, PodcastEpisode, Reel } from "@/lib/types";

export const metadata: Metadata = {
  title: "V2V Bridge Audit",
  description:
    "Internal compliance surface for Plan International Bangladesh monitors.",
  robots: { index: false, follow: false },
};

type AuditRow =
  | {
      kind: "podcast";
      id: string;
      type: "Podcast";
      title: string;
      publishedAt: string | null;
    }
  | {
      kind: "entrepreneur";
      id: string;
      type: "Entrepreneur";
      title: string;
      publishedAt: string | null;
      ysc1: string;
      ysc2: string;
      projectLead: string;
      consentFormFilename: string;
    }
  | {
      kind: "reel";
      id: string;
      type: "Reel";
      title: string;
      publishedAt: string | null;
    };

function buildRows(
  entrepreneurs: Entrepreneur[],
  podcasts: PodcastEpisode[],
  reels: Reel[],
): AuditRow[] {
  const rows: AuditRow[] = [];

  for (const e of entrepreneurs) {
    rows.push({
      kind: "entrepreneur",
      id: e.id,
      type: "Entrepreneur",
      title: e.displayName,
      publishedAt: e.publishedAt ?? null,
      ysc1: e.reviewers.ysc1,
      ysc2: e.reviewers.ysc2,
      projectLead: e.reviewers.projectLead,
      consentFormFilename: e.consentFormFilename,
    });
  }

  for (const p of podcasts) {
    rows.push({
      kind: "podcast",
      id: p.id,
      type: "Podcast",
      title: p.title.en,
      publishedAt: p.publishedAt ?? null,
    });
  }

  for (const r of reels) {
    rows.push({
      kind: "reel",
      id: r.id,
      type: "Reel",
      title: r.caption.en,
      publishedAt: r.publishedAt ?? null,
    });
  }

  return rows.sort((a, b) => a.id.localeCompare(b.id));
}

const TYPE_BADGE: Record<AuditRow["type"], string> = {
  Podcast: "bg-brand-teal text-white",
  Entrepreneur: "bg-brand-coral text-white",
  Reel: "bg-brand-ink text-white",
};

export default function AuditPage() {
  const entrepreneurs = getAllEntrepreneurs();
  const podcasts = getAllPublishedPodcasts();
  const reels = getAllPublishedReels();

  const rows = buildRows(entrepreneurs, podcasts, reels);
  const total = rows.length;
  const totalPodcasts = podcasts.length;
  const totalEntrepreneurs = entrepreneurs.length;
  const totalReels = reels.length;
  const missingConsent = entrepreneurs.filter(
    (e) => !e.consentFormFilename || e.consentFormFilename.trim() === "",
  ).length;

  const consentOk = missingConsent === 0;

  return (
    <div className="bg-white">
      <div
        role="note"
        className="bg-brand-coral text-white"
      >
        <Container className="py-3">
          <p className="font-sans text-sm font-semibold">
            Internal — for Plan International Bangladesh monitors only. Not
            indexed, not linked from public navigation. Do not share this URL
            outside the audit chain.
          </p>
        </Container>
      </div>

      <Container className="py-12">
        <header className="mb-10">
          <p className="mb-2 text-xs uppercase tracking-[0.2em] text-brand-coral">
            Audit surface
          </p>
          <h1 className="font-sans text-3xl font-semibold text-brand-teal">
            V2V Bridge content audit
          </h1>
          <p className="mt-3 max-w-2xl font-sans text-sm text-brand-mute">
            Live snapshot of every published item across podcasts,
            entrepreneurs, and reels. Generated at build time from the
            content store. A machine-readable copy is available at{" "}
            <a
              href="/audit/log.json"
              className="text-brand-teal underline underline-offset-4"
            >
              /audit/log.json
            </a>
            .
          </p>
        </header>

        <section
          aria-labelledby="audit-stats"
          className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <h2 id="audit-stats" className="sr-only">
            Summary statistics
          </h2>
          <Stat label="Total items" value={total} />
          <Stat label="Podcasts" value={totalPodcasts} />
          <Stat label="Entrepreneurs" value={totalEntrepreneurs} />
          <Stat label="Reels" value={totalReels} />
          <Stat
            label="Missing consent forms"
            value={missingConsent}
            tone={consentOk ? "ok" : "alert"}
            note={
              consentOk
                ? "All entrepreneur records reference a consent form."
                : "FLAG: every entrepreneur record must reference a signed consent form on file."
            }
          />
        </section>

        <section aria-labelledby="audit-table-heading">
          <h2
            id="audit-table-heading"
            className="mb-4 font-sans text-xl font-semibold text-brand-ink"
          >
            All published items
          </h2>

          {rows.length === 0 ? (
            <p className="rounded border border-brand-rule bg-brand-cream p-6 font-sans text-sm text-brand-mute">
              No published items yet. The audit table will populate as the
              content team flips items to <code>published: true</code>.
            </p>
          ) : (
            <div className="overflow-x-auto rounded border border-brand-rule">
              <table className="w-full border-collapse font-sans text-sm">
                <thead className="bg-brand-cream text-left text-brand-ink">
                  <tr>
                    <Th>Item ID</Th>
                    <Th>Type</Th>
                    <Th>Title / display name</Th>
                    <Th>Published</Th>
                    <Th>YSC reviewer 1</Th>
                    <Th>YSC reviewer 2</Th>
                    <Th>Project Lead signoff</Th>
                    <Th>Consent form</Th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr
                      key={`${row.kind}-${row.id}`}
                      className="border-t border-brand-rule align-top odd:bg-white even:bg-brand-cream/40"
                    >
                      <Td>
                        <code className="text-brand-teal">{row.id}</code>
                      </Td>
                      <Td>
                        <span
                          className={`inline-block rounded px-2 py-0.5 text-xs font-semibold ${TYPE_BADGE[row.type]}`}
                        >
                          {row.type}
                        </span>
                      </Td>
                      <Td>{row.title}</Td>
                      <Td>{row.publishedAt ?? <Dash />}</Td>
                      {row.kind === "entrepreneur" ? (
                        <>
                          <Td>{row.ysc1}</Td>
                          <Td>{row.ysc2}</Td>
                          <Td>{row.projectLead}</Td>
                          <Td>
                            <code className="text-brand-mute">
                              {row.consentFormFilename}
                            </code>
                          </Td>
                        </>
                      ) : (
                        <>
                          <Td>
                            <Dash />
                          </Td>
                          <Td>
                            <Dash />
                          </Td>
                          <Td>
                            <Dash />
                          </Td>
                          <Td>
                            <Dash />
                          </Td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <footer className="mt-10 border-t border-brand-rule pt-6 font-sans text-xs text-brand-mute">
          Generated at build time. To refresh, redeploy the site. Reviewer
          fields and consent filenames live in
          {" "}
          <code>/content/entrepreneurs/*.json</code>; flip{" "}
          <code>published: true</code> to expose an item on the public layer.
        </footer>
      </Container>
    </div>
  );
}

function Stat({
  label,
  value,
  tone = "neutral",
  note,
}: {
  label: string;
  value: number;
  tone?: "neutral" | "ok" | "alert";
  note?: string;
}) {
  const valueClass =
    tone === "alert"
      ? "text-brand-coral"
      : tone === "ok"
        ? "text-brand-teal"
        : "text-brand-ink";
  return (
    <div className="rounded border border-brand-rule bg-white p-4">
      <p className="text-xs uppercase tracking-wide text-brand-mute">{label}</p>
      <p className={`mt-1 font-sans text-2xl font-semibold ${valueClass}`}>
        {value}
      </p>
      {note ? (
        <p className="mt-2 text-xs text-brand-mute">{note}</p>
      ) : null}
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th
      scope="col"
      className="border-b border-brand-rule px-3 py-2 font-semibold"
    >
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-3 py-2 text-brand-ink">{children}</td>;
}

function Dash() {
  return <span className="text-brand-rule">—</span>;
}
