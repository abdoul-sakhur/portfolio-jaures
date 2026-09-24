"use client";

import { useState } from "react";
import Link from "next/link";
import { Download } from "lucide-react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { getDictionary, type Locale } from "@/lib/i18n";

export function MobileNav({
  navItems,
  locale,
}: {
  navItems: { href: string; label: string }[];
  locale: Locale;
}) {
  const dict = getDictionary(locale);
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Menu"
        aria-expanded={open}
        className="flex h-9 w-9 flex-col items-center justify-center gap-1.5"
      >
        <span
          className={`h-px w-5 bg-ink transition ${open ? "translate-y-[3.5px] rotate-45" : ""}`}
        />
        <span
          className={`h-px w-5 bg-ink transition ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute inset-x-0 top-20 border-b border-line bg-paper px-6 py-6">
          <nav className="flex flex-col gap-4 text-base">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-ink-soft transition hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <a
            href="/brochure-jaures-agohi.pdf"
            download
            onClick={() => setOpen(false)}
            className="mt-6 inline-flex items-center gap-2 text-base text-ink-soft transition hover:text-ink"
          >
            <Download className="h-4 w-4" strokeWidth={1.5} />
            {dict.nav.brochure}
          </a>
          <div className="mt-6">
            <LanguageSwitcher locale={locale} />
          </div>
        </div>
      )}
    </div>
  );
}
