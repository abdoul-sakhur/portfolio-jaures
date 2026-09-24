import Link from "next/link";
import { getDictionary, type Locale } from "@/lib/i18n";
import { getArtistProfile, getArtworks, getSettings } from "@/lib/strapi";
import { Container } from "@/components/Container";
import { ArtworkCard } from "@/components/ArtworkCard";
import { PortraitFrame } from "@/components/PortraitFrame";
import { Reveal } from "@/components/Reveal";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const [profile, artworks, settings] = await Promise.all([
    getArtistProfile(locale),
    getArtworks(locale),
    getSettings(locale),
  ]);
  const featured = artworks.slice(0, 6);

  return (
    <div>
      <section className="border-b border-line">
        <Container className="grid gap-12 py-20 md:grid-cols-2 md:items-center md:py-28">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-lilac">
              {profile?.displayName ?? "Jaures"}
            </p>
            <h1 className="mt-4 text-4xl leading-[1.05] md:text-6xl">
              {profile?.tagline ?? "Ivorian visual artist"}
            </h1>
            {profile?.bio && (
              <p className="mt-6 max-w-lg text-base leading-relaxed text-ink-soft">
                {profile.bio}
              </p>
            )}
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href={`/${locale}/works`}
                className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition hover:bg-blue"
              >
                {dict.nav.works}
              </Link>
              <Link
                href={`/${locale}/biography`}
                className="rounded-full border border-ink px-6 py-3 text-sm font-medium transition hover:border-lilac hover:text-lilac"
              >
                {dict.nav.biography}
              </Link>
            </div>
          </div>

          <PortraitFrame
            images={profile?.portraitImages}
            alt={profile?.fullName ?? profile?.displayName ?? "Jaures"}
            priority
          />
        </Container>
      </section>

      {profile?.stats && profile.stats.length > 0 && (
        <section className="border-b border-line bg-paper-soft">
          <Container className="grid grid-cols-2 gap-8 py-14 md:grid-cols-4">
            {profile.stats.map((stat) => (
              <div key={stat.id} className="text-center">
                <div className="font-display text-4xl text-blue">{stat.value}</div>
                <div className="mt-2 text-xs uppercase tracking-wide text-ink-soft">
                  {stat.label}
                </div>
              </div>
            ))}
          </Container>
        </section>
      )}

      {featured.length > 0 && (
        <section>
          <Container className="py-20">
            <div className="mb-10 flex items-end justify-between">
              <h2 className="text-3xl">{dict.works.title}</h2>
              <Link
                href={`/${locale}/works`}
                className="text-sm font-medium text-ink-soft transition hover:text-ink"
              >
                {locale === "fr" ? "Voir tout →" : "View all →"}
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((artwork, index) => (
                <Reveal key={artwork.id} delay={(index % 6) * 60}>
                  <ArtworkCard
                    artwork={artwork}
                    locale={locale}
                    whatsappNumber={settings?.whatsappNumber}
                  />
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}
    </div>
  );
}
