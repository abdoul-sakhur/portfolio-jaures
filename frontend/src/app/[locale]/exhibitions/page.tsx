import { getDictionary, type Locale } from "@/lib/i18n";
import { getExhibitions } from "@/lib/strapi";
import { Container } from "@/components/Container";
import { ExhibitionTimeline } from "@/components/ExhibitionTimeline";

export default async function ExhibitionsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const exhibitions = await getExhibitions(locale);

  return (
    <Container className="py-16 md:py-24">
      <h1 className="text-4xl md:text-5xl">{dict.exhibitions.title}</h1>
      <div className="mt-16">
        <ExhibitionTimeline exhibitions={exhibitions} />
      </div>
    </Container>
  );
}
