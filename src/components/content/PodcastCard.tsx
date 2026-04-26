import Link from "next/link";

import { formatDuration } from "@/lib/format";
import type { PodcastEpisode } from "@/lib/types";

import { Card } from "../ui/Card";
import { Tag } from "../ui/Tag";

export function PodcastCard({
  podcast,
  sectorLabel,
}: {
  podcast: PodcastEpisode;
  sectorLabel?: string;
}) {
  const href = `/podcasts/${podcast.id}`;
  return (
    <Card className="p-5">
      <p className="text-xs uppercase tracking-wider text-brand-coral">
        <span lang="en" className="font-sans">Episode {podcast.episodeNumber}</span>
        <span lang="bn" className="font-bangla">এপিসোড {podcast.episodeNumber}</span>
      </p>

      <h3 className="mt-2 text-lg font-semibold text-brand-teal">
        <Link href={href} className="hover:underline focus-visible:underline">
          <span lang="en" className="font-sans">{podcast.title.en}</span>
          <span lang="bn" className="font-bangla">{podcast.title.bn}</span>
        </Link>
      </h3>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {sectorLabel ? <Tag>{sectorLabel}</Tag> : null}
        <span className="font-sans text-xs text-brand-mute">
          {formatDuration(podcast.durationSeconds)}
        </span>
      </div>

      <Link
        href={href}
        className="mt-5 inline-flex items-center text-sm font-medium text-brand-teal hover:underline"
      >
        <span lang="en" className="font-sans">Listen →</span>
        <span lang="bn" className="font-bangla">শুনুন →</span>
      </Link>
    </Card>
  );
}
