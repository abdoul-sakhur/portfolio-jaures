"use client";

import { useMemo, useState } from "react";
import type { Artwork, Series } from "@/lib/types";
import { getDictionary, type Locale } from "@/lib/i18n";
import { ArtworkCard } from "./ArtworkCard";
import { Reveal } from "./Reveal";

export function WorksGallery({
  artworks,
  series,
  locale,
  whatsappNumber,
}: {
  artworks: Artwork[];
  series: Series[];
  locale: Locale;
  whatsappNumber?: string | null;
}) {
  const dict = getDictionary(locale);
  const [search, setSearch] = useState("");
  const [activeSeries, setActiveSeries] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return artworks.filter((artwork) => {
      const matchesSeries = !activeSeries || artwork.series?.slug === activeSeries;
      if (!matchesSeries) return false;
      if (!term) return true;
      const haystack = [artwork.title, artwork.series?.title, artwork.technique]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(term);
    });
  }, [artworks, search, activeSeries]);

  return (
    <div>
      <div className="flex flex-col gap-6">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={dict.works.searchPlaceholder}
          className="w-full max-w-md rounded-full border border-line bg-transparent px-5 py-3 text-sm outline-none transition focus:border-ink"
        />

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveSeries(null)}
            className={`rounded-full border px-4 py-1.5 text-sm transition ${
              activeSeries === null
                ? "border-ink bg-ink text-paper"
                : "border-line text-ink-soft hover:border-ink hover:text-ink"
            }`}
          >
            {dict.works.allSeries}
          </button>
          {series.map((s) => (
            <button
              key={s.slug}
              onClick={() => setActiveSeries(s.slug)}
              className={`rounded-full border px-4 py-1.5 text-sm transition ${
                activeSeries === s.slug
                  ? "border-ink bg-ink text-paper"
                  : "border-line text-ink-soft hover:border-ink hover:text-ink"
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-16 text-center text-sm text-ink-soft">{dict.works.noResults}</p>
      ) : (
        <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((artwork, index) => (
            <Reveal key={artwork.id} delay={(index % 6) * 60}>
              <ArtworkCard artwork={artwork} locale={locale} whatsappNumber={whatsappNumber} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
