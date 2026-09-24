import Image from "next/image";
import type { StrapiMedia } from "@/lib/types";
import { mediaUrl } from "@/lib/strapi";

export function ImageGallery({ images, alt }: { images: StrapiMedia[]; alt: string }) {
  if (images.length === 0) return null;

  const isOddCount = images.length % 2 !== 0;

  return (
    <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 min-[600px]:grid-cols-2">
      {images.map((image, index) => {
        const isLast = index === images.length - 1;
        const centerAlone = isOddCount && isLast;

        return (
          <div
            key={image.id}
            className={
              centerAlone ? "min-[600px]:col-span-2 min-[600px]:mx-auto min-[600px]:w-1/2" : ""
            }
          >
            <Image
              src={mediaUrl(image.url) ?? ""}
              alt={image.alternativeText || alt}
              width={image.width ?? 800}
              height={image.height ?? 600}
              sizes="(min-width: 600px) 50vw, 100vw"
              className="aspect-[4/3] h-auto w-full rounded-sm object-cover"
            />
          </div>
        );
      })}
    </div>
  );
}
