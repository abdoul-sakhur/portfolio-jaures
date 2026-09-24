export interface StrapiMedia {
  id: number;
  url: string;
  alternativeText?: string | null;
  width?: number | null;
  height?: number | null;
}

export interface Series {
  id: number;
  documentId: string;
  title: string;
  slug: string;
}

export interface Artwork {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  year?: string | null;
  dimensions?: string | null;
  technique?: string | null;
  priceXOF?: number | null;
  priceEUR?: number | null;
  whatsappMessage?: string | null;
  thumbnail?: StrapiMedia | null;
  images?: StrapiMedia[] | null;
  series?: Series | null;
}

export interface BioStat {
  id: number;
  value: string;
  label: string;
}

export interface BioHighlight {
  id: number;
  icon?: string | null;
  title: string;
  description?: string | null;
  order: number;
}

export interface ArtistProfile {
  fullName: string;
  displayName?: string | null;
  tagline?: string | null;
  bio?: string | null;
  portraitImages?: StrapiMedia[] | null;
  galleryImages?: StrapiMedia[] | null;
  stats?: BioStat[];
  highlights?: BioHighlight[];
}

export interface Quote {
  id: number;
  documentId: string;
  title?: string | null;
  quoteText: string;
  author?: string | null;
  authorRole?: string | null;
  style: "highlighted" | "bordered";
  order: number;
}

export interface Exhibition {
  id: number;
  documentId: string;
  title: string;
  badge?: string | null;
  location?: string | null;
  description?: string | null;
  curator?: string | null;
  image?: StrapiMedia | null;
  countriesList?: string[] | null;
  order: number;
}

export interface Settings {
  siteName?: string | null;
  galleryName?: string | null;
  galleryDescription?: string | null;
  logo?: StrapiMedia | null;
  email?: string | null;
  phone?: string | null;
  whatsappNumber?: string | null;
  address?: string | null;
  instagramHandles?: { handle: string; url: string }[] | null;
  facebookUrl?: string | null;
}

export interface Page {
  id: number;
  documentId: string;
  slug: string;
  title: string;
  metaDescription?: string | null;
}
