import Image from "next/image";
import type { Exhibition } from "@/lib/types";
import { mediaUrl } from "@/lib/strapi";
import { Reveal } from "./Reveal";

export function ExhibitionTimeline({ exhibitions }: { exhibitions: Exhibition[] }) {
  const sorted = [...exhibitions].sort((a, b) => a.order - b.order);

  return (
    <div className="flex flex-col gap-20 md:gap-28">
      {sorted.map((exhibition, index) => {
        const reversed = index % 2 === 1;
        return (
          <Reveal
            key={exhibition.id}
            as="article"
            className={`grid gap-8 md:grid-cols-2 md:items-center md:gap-16 ${
              reversed ? "md:[&>*:first-child]:order-2" : ""
            }`}
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-paper-soft">
              {exhibition.image ? (
                <Image
                  src={mediaUrl(exhibition.image.url) ?? ""}
                  alt={exhibition.title}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center font-display text-4xl text-ink/10">
                  {exhibition.title.charAt(0)}
                </div>
              )}
            </div>

            <div>
              {exhibition.badge && (
                <span className="inline-block rounded-full bg-lilac px-3 py-1 text-xs font-medium uppercase tracking-wide text-paper">
                  {exhibition.badge}
                </span>
              )}
              <h3 className="mt-4 text-2xl md:text-3xl">{exhibition.title}</h3>
              {exhibition.location && (
                <p className="mt-2 text-sm font-medium text-ink-soft">{exhibition.location}</p>
              )}
              {exhibition.description && (
                <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-soft">
                  {exhibition.description}
                </p>
              )}
              {exhibition.curator && (
                <p className="mt-3 text-sm text-ink-soft">{exhibition.curator}</p>
              )}
              {exhibition.countriesList && exhibition.countriesList.length > 0 && (
                <p className="mt-3 text-sm text-ink-soft">
                  {exhibition.countriesList.join(" · ")}
                </p>
              )}
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
