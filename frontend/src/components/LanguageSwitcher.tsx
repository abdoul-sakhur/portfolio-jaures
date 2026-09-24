"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n";

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const rest = pathname.split("/").slice(2).join("/");

  return (
    <div className="flex items-center gap-1 text-sm">
      {locales.map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          <Link
            href={`/${l}${rest ? `/${rest}` : ""}`}
            className={`uppercase tracking-wide transition ${
              l === locale ? "text-ink font-semibold" : "text-ink-soft hover:text-ink"
            }`}
          >
            {l}
          </Link>
          {i < locales.length - 1 && <span className="text-line">/</span>}
        </span>
      ))}
    </div>
  );
}
