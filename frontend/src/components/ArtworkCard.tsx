import Image from "next/image";
import type { Artwork } from "@/lib/types";
import { getDictionary, type Locale } from "@/lib/i18n";
import { mediaUrl } from "@/lib/strapi";
import { WhatsAppButton } from "./WhatsAppButton";

function formatXOF(value: number) {
  return new Intl.NumberFormat("fr-FR").format(value) + " FCFA";
}

function formatEUR(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function ArtworkCard({
  artwork,
  locale,
  whatsappNumber,
}: {
  artwork: Artwork;
  locale: Locale;
  whatsappNumber?: string | null;
}) {
  const dict = getDictionary(locale);
  const thumb = artwork.thumbnail ?? artwork.images?.[0] ?? null;

  return (
    <article className="group flex flex-col">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm bg-paper-soft">
        {thumb ? (
          <Image
            src={mediaUrl(thumb.url) ?? ""}
            alt={thumb.alternativeText || artwork.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-display text-3xl text-ink/10">
            {artwork.title.charAt(0)}
          </div>
        )}
      </div>

      <div className="mt-4 flex-1">
        <h3 className="font-display text-lg">{artwork.title}</h3>
        <p className="mt-1 text-sm text-ink-soft">
          {artwork.series?.title}
          {artwork.series?.title && (artwork.dimensions || artwork.technique) ? " — " : ""}
          {artwork.dimensions}
          {artwork.dimensions && artwork.technique ? ", " : ""}
          {artwork.technique}
        </p>
        <p className="mt-2 text-sm font-medium">
          {artwork.priceXOF ? (
            <>
              {formatXOF(artwork.priceXOF)}
              {artwork.priceEUR ? (
                <span className="text-ink-soft">
                  {" "}
                  ({dict.works.priceFrom} {formatEUR(artwork.priceEUR, locale)})
                </span>
              ) : null}
            </>
          ) : (
            <span className="text-ink-soft">{dict.works.priceOnRequest}</span>
          )}
        </p>
      </div>

      {whatsappNumber && (
        <div className="mt-4 transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
          <WhatsAppButton
            whatsappNumber={whatsappNumber}
            message={artwork.whatsappMessage ?? undefined}
            label={dict.works.contactWhatsApp}
          />
        </div>
      )}
    </article>
  );
}
