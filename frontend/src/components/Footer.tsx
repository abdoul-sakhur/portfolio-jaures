import Link from "next/link";
import { getDictionary, type Locale } from "@/lib/i18n";
import type { Settings } from "@/lib/types";
import { Container } from "./Container";

export function Footer({ locale, settings }: { locale: Locale; settings: Settings | null }) {
  const dict = getDictionary(locale);
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-line bg-paper-soft">
      <Container className="grid gap-10 py-14 md:grid-cols-3">
        <div>
          <div className="font-display text-lg">{settings?.siteName ?? "Jaures"}</div>
          {settings?.galleryDescription && (
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-soft">
              {settings.galleryDescription}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 text-sm text-ink-soft">
          <Link href={`/${locale}/works`} className="transition hover:text-ink">
            {dict.nav.works}
          </Link>
          <Link href={`/${locale}/biography`} className="transition hover:text-ink">
            {dict.nav.biography}
          </Link>
          <Link href={`/${locale}/exhibitions`} className="transition hover:text-ink">
            {dict.nav.exhibitions}
          </Link>
          <Link href={`/${locale}/contact`} className="transition hover:text-ink">
            {dict.nav.contact}
          </Link>
        </div>

        <div className="flex flex-col gap-2 text-sm text-ink-soft">
          {settings?.email && (
            <a href={`mailto:${settings.email}`} className="transition hover:text-ink">
              {settings.email}
            </a>
          )}
          {settings?.phone && <span>{settings.phone}</span>}
          {settings?.instagramHandles?.map((ig) => (
            <a
              key={ig.handle}
              href={ig.url}
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-ink"
            >
              {ig.handle}
            </a>
          ))}
          {settings?.facebookUrl && (
            <a
              href={settings.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-ink"
            >
              {dict.contact.facebook}
            </a>
          )}
        </div>
      </Container>

      <div className="border-t border-line py-6">
        <Container className="text-xs text-ink-soft">
          © {year} {settings?.siteName ?? "Jaures"}. {dict.footer.rights}
        </Container>
      </div>
    </footer>
  );
}
