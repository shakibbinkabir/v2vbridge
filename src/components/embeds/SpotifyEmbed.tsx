import { EmbedFallback } from "./EmbedFallback";

export function SpotifyEmbed({
  embedId,
  title,
}: {
  embedId: string;
  title: string;
}) {
  if (!embedId) {
    return (
      <EmbedFallback
        platform="Spotify"
        href="https://open.spotify.com"
      >
        Episode link not configured yet.
      </EmbedFallback>
    );
  }

  const src = `https://open.spotify.com/embed/episode/${encodeURIComponent(embedId)}?utm_source=generator`;
  const directUrl = `https://open.spotify.com/episode/${encodeURIComponent(embedId)}`;

  return (
    <div className="overflow-hidden rounded-xl border border-brand-rule/60 bg-white shadow-sm">
      <iframe
        src={src}
        title={`Spotify episode: ${title}`}
        loading="lazy"
        width="100%"
        height="232"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        allowFullScreen
        className="block w-full"
      />
      <noscript>
        <div className="p-4">
          <a
            href={directUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-brand-teal underline"
          >
            Listen on Spotify →
          </a>
        </div>
      </noscript>
    </div>
  );
}
