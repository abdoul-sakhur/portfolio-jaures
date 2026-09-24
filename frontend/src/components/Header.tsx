import Link from "next/link";
import { Download } from "lucide-react";
import { getDictionary, type Locale } from "@/lib/i18n";
import type { Settings } from "@/lib/types";
import { Container } from "./Container";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileNav } from "./MobileNav";

export function Header({ locale, settings }: { locale: Locale; settings: Settings | null }) {
  const dict = getDictionary(locale);
  const siteName = settings?.siteName ?? "Jaures";

  const navItems = [
    { href: `/${locale}/works`, label: dict.nav.works },
    { href: `/${locale}/biography`, label: dict.nav.biography },
    { href: `/${locale}/exhibitions`, label: dict.nav.exhibitions },
    { href: `/${locale}/contact`, label: dict.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
      <Container className="flex h-20 items-center justify-between">
        <Link href={`/${locale}`} className="font-display text-xl tracking-tight">
          {siteName}
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-ink-soft md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-ink">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-6 md:flex">
          <a
            href="/brochure-jaures-agohi.pdf"
            download
            className="inline-flex items-center gap-2 rounded-full border border-ink px-4 py-2 text-sm font-medium transition hover:border-lilac hover:text-lilac"
          >
            <Download className="h-4 w-4" strokeWidth={1.5} />
            {dict.nav.brochure}
          </a>
          <LanguageSwitcher locale={locale} />
        </div>

        <MobileNav navItems={navItems} locale={locale} />
      </Container>
    </header>
  );
}
