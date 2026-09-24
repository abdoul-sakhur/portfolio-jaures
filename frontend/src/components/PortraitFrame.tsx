import Image from "next/image";
import type { StrapiMedia } from "@/lib/types";
import { mediaUrl } from "@/lib/strapi";

export function PortraitFrame({
  images,
  alt,
  priority = false,
}: {
  images?: StrapiMedia[] | null;
  alt: string;
  priority?: boolean;
}) {
  const [main, inset] = images ?? [];

  return (
    <div className="relative aspect-[4/5] w-full">
      <div className="relative h-full w-full overflow-hidden rounded-sm bg-paper-soft">
        {main ? (
          <Image
            src={mediaUrl(main.url) ?? ""}
            alt={main.alternativeText || alt}
            fill
            sizes="(min-width: 768px) 480px, 100vw"
            className="object-cover"
            priority={priority}
          />
        ) : (
          <div className="flex h-full items-center justify-center font-display text-6xl text-ink/10">
            {alt.charAt(0)}
          </div>
        )}
      </div>

      {inset && (
        <div className="absolute -bottom-6 -right-6 h-28 w-28 overflow-hidden rounded-sm border-4 border-paper shadow-md md:h-36 md:w-36">
          <Image
            src={mediaUrl(inset.url) ?? ""}
            alt={inset.alternativeText || alt}
            fill
            sizes="144px"
            className="object-cover"
          />
        </div>
      )}
    </div>
  );
}
