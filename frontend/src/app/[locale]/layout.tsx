import type { Metadata } from "next";
import { Cormorant_Garamond, Karla } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { isLocale, type Locale } from "@/lib/i18n";
import { getSettings } from "@/lib/strapi";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const karla = Karla({
  variable: "--font-karla",
  subsets: ["latin"],
});

// Rendered per-request rather than pre-built statically, so `next build` never
// needs the Strapi backend to be reachable (important for building the Docker
// image independently from the backend container).
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const settings = await getSettings(locale);

  return {
    title: {
      default: settings?.galleryName ?? "Jaures",
      template: `%s — ${settings?.siteName ?? "Jaures"}`,
    },
    description: settings?.galleryDescription ?? undefined,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const settings = await getSettings(locale as Locale);

  return (
    <html
      lang={locale}
      className={`${cormorant.variable} ${karla.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-paper text-ink">
        <Header locale={locale as Locale} settings={settings} />
        <main className="flex-1">{children}</main>
        <Footer locale={locale as Locale} settings={settings} />
      </body>
    </html>
  );
}
