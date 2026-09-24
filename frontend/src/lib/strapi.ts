import type { Locale } from "./i18n";
import type {
  Artwork,
  ArtistProfile,
  Exhibition,
  Quote,
  Series,
  Settings,
} from "./types";

// Data fetches (getArtworks, getSettings, ...) run server-side (Server Components),
// so they can use an internal Docker network hostname (e.g. http://backend:1337).
// Falls back to the public URL for local dev, where there's no separate network.
const STRAPI_INTERNAL_URL =
  process.env.STRAPI_INTERNAL_URL ?? process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";

// Image URLs are fetched directly by the browser (next/image optimization is
// disabled, see next.config.ts), so they must use the publicly reachable host.
const STRAPI_PUBLIC_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";

async function fetchAPI<T>(path: string, revalidate = 60): Promise<T> {
  const res = await fetch(`${STRAPI_INTERNAL_URL}/api${path}`, {
    next: { revalidate },
  });

  if (!res.ok) {
    throw new Error(`Strapi request failed: ${res.status} ${path}`);
  }

  return res.json();
}

export function mediaUrl(url?: string | null): string | null {
  if (!url) return null;
  return url.startsWith("http") ? url : `${STRAPI_PUBLIC_URL}${url}`;
}

function flattenMedia(media: unknown) {
  if (!media) return null;
  return media as { id: number; url: string; alternativeText?: string | null; width?: number | null; height?: number | null };
}

export async function getSeries(locale: Locale): Promise<Series[]> {
  const res = await fetchAPI<{ data: Series[] }>(
    `/series?locale=${locale}&sort=title:asc&pagination[pageSize]=100`
  );
  return res.data;
}

export async function getArtworks(
  locale: Locale,
  opts: { seriesSlug?: string; search?: string } = {}
): Promise<Artwork[]> {
  const params = new URLSearchParams();
  params.set("locale", locale);
  params.set("sort", "createdAt:desc");
  params.set("pagination[pageSize]", "100");
  params.set("populate[thumbnail]", "true");
  params.set("populate[images]", "true");
  params.set("populate[series]", "true");

  if (opts.seriesSlug) {
    params.set("filters[series][slug][$eq]", opts.seriesSlug);
  }
  if (opts.search) {
    params.set("filters[$or][0][title][$containsi]", opts.search);
    params.set("filters[$or][1][technique][$containsi]", opts.search);
    params.set("filters[$or][2][series][title][$containsi]", opts.search);
  }

  const res = await fetchAPI<{ data: Artwork[] }>(`/artworks?${params.toString()}`);
  return res.data.map((a) => ({
    ...a,
    thumbnail: flattenMedia(a.thumbnail),
    images: Array.isArray(a.images) ? a.images.map((m) => flattenMedia(m)!).filter(Boolean) : [],
  }));
}

export async function getArtworkBySlug(locale: Locale, slug: string): Promise<Artwork | null> {
  const params = new URLSearchParams();
  params.set("locale", locale);
  params.set("filters[slug][$eq]", slug);
  params.set("populate[thumbnail]", "true");
  params.set("populate[images]", "true");
  params.set("populate[series]", "true");

  const res = await fetchAPI<{ data: Artwork[] }>(`/artworks?${params.toString()}`);
  const artwork = res.data[0];
  if (!artwork) return null;
  return {
    ...artwork,
    thumbnail: flattenMedia(artwork.thumbnail),
    images: Array.isArray(artwork.images)
      ? artwork.images.map((m) => flattenMedia(m)!).filter(Boolean)
      : [],
  };
}

export async function getArtistProfile(locale: Locale): Promise<ArtistProfile | null> {
  const res = await fetchAPI<{ data: ArtistProfile }>(
    `/artist-profile?locale=${locale}&populate[portraitImages]=true&populate[galleryImages]=true&populate[stats]=true&populate[highlights]=true`
  );
  if (!res.data) return null;
  return {
    ...res.data,
    portraitImages: Array.isArray(res.data.portraitImages)
      ? res.data.portraitImages.map((m) => flattenMedia(m)!).filter(Boolean)
      : [],
    galleryImages: Array.isArray(res.data.galleryImages)
      ? res.data.galleryImages.map((m) => flattenMedia(m)!).filter(Boolean)
      : [],
  };
}

export async function getExhibitions(locale: Locale): Promise<Exhibition[]> {
  const res = await fetchAPI<{ data: Exhibition[] }>(
    `/exhibitions?locale=${locale}&sort=order:asc&populate[image]=true&pagination[pageSize]=50`
  );
  return res.data.map((e) => ({ ...e, image: flattenMedia(e.image) }));
}

export async function getQuotes(locale: Locale): Promise<Quote[]> {
  const res = await fetchAPI<{ data: Quote[] }>(
    `/quotes?locale=${locale}&sort=order:asc&pagination[pageSize]=50`
  );
  return res.data;
}

export async function getSettings(locale: Locale): Promise<Settings | null> {
  const res = await fetchAPI<{ data: Settings }>(
    `/setting?locale=${locale}&populate[logo]=true`
  );
  if (!res.data) return null;
  return { ...res.data, logo: flattenMedia(res.data.logo) };
}
