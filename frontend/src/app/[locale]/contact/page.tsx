import { getDictionary, type Locale } from "@/lib/i18n";
import { getSettings } from "@/lib/strapi";
import { Container } from "@/components/Container";
import { ContactCards } from "@/components/ContactCards";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const settings = await getSettings(locale);

  return (
    <Container className="py-16 md:py-24">
      <div className="max-w-2xl">
        <h1 className="text-4xl md:text-5xl">{dict.contact.title}</h1>
        <p className="mt-4 text-ink-soft">{dict.contact.intro}</p>
        {settings?.whatsappNumber && (
          <div className="mt-6">
            <WhatsAppButton whatsappNumber={settings.whatsappNumber} label={dict.contact.whatsapp} />
          </div>
        )}
      </div>

      {settings && (
        <div className="mt-12">
          <ContactCards settings={settings} locale={locale} />
        </div>
      )}
    </Container>
  );
}
