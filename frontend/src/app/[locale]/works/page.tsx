import { getDictionary, type Locale } from "@/lib/i18n";
import { getArtworks, getSeries, getSettings } from "@/lib/strapi";
import { Container } from "@/components/Container";
import { WorksGallery } from "@/components/WorksGallery";

export default async function WorksPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const [artworks, series, settings] = await Promise.all([
    getArtworks(locale),
    getSeries(locale),
    getSettings(locale),
  ]);

  return (
    <Container className="py-16 md:py-24">
      <h1 className="text-4xl md:text-5xl">{dict.works.title}</h1>
      <div className="mt-10">
        <WorksGallery
          artworks={artworks}
          series={series}
          locale={locale}
          whatsappNumber={settings?.whatsappNumber}
        />
      </div>
    </Container>
  );
}
