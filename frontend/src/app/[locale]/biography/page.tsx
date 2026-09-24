import { getDictionary, type Locale } from "@/lib/i18n";
import { getArtistProfile, getQuotes } from "@/lib/strapi";
import { Container } from "@/components/Container";
import { HighlightsGrid } from "@/components/HighlightsGrid";
import { ImageGallery } from "@/components/ImageGallery";
import { PortraitFrame } from "@/components/PortraitFrame";
import { QuoteBlock } from "@/components/QuoteBlock";

export default async function BiographyPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const [profile, quotes] = await Promise.all([getArtistProfile(locale), getQuotes(locale)]);

  if (!profile) {
    return (
      <Container className="py-24">
        <p className="text-ink-soft">—</p>
      </Container>
    );
  }

  return (
    <div>
      <section className="border-b border-line">
        <Container className="grid gap-12 py-16 md:grid-cols-[minmax(0,320px)_1fr] md:py-24">
          <PortraitFrame images={profile.portraitImages} alt={profile.fullName} />

          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-lilac">
              {profile.displayName}
            </p>
            <h1 className="mt-3 text-4xl md:text-5xl">{profile.fullName}</h1>
            {profile.tagline && (
              <p className="mt-2 text-lg text-ink-soft">{profile.tagline}</p>
            )}
            {profile.bio && (
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-soft">
                {profile.bio}
              </p>
            )}
          </div>
        </Container>
      </section>

      {profile.galleryImages && profile.galleryImages.length > 0 && (
        <section className="border-b border-line">
          <Container className="py-20">
            <ImageGallery images={profile.galleryImages} alt={profile.fullName} />
          </Container>
        </section>
      )}

      {profile.stats && profile.stats.length > 0 && (
        <section className="border-b border-line bg-paper-soft">
          <Container className="py-14">
            <h2 className="mb-8 text-center text-sm uppercase tracking-[0.2em] text-ink-soft">
              {dict.biography.statsTitle}
            </h2>
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {profile.stats.map((stat) => (
                <div key={stat.id} className="text-center">
                  <div className="font-display text-4xl text-blue">{stat.value}</div>
                  <div className="mt-2 text-xs uppercase tracking-wide text-ink-soft">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {profile.highlights && profile.highlights.length > 0 && (
        <section>
          <Container className="py-20">
            <HighlightsGrid highlights={profile.highlights} />
          </Container>
        </section>
      )}

      {quotes.length > 0 && (
        <section>
          <Container className="py-20">
            <h2 className="mb-10 text-3xl">{dict.biography.quotesTitle}</h2>
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
              {quotes.map((quote) => (
                <QuoteBlock key={quote.id} quote={quote} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </div>
  );
}
