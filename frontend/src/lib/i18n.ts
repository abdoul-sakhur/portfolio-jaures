export const locales = ["fr", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fr";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

type Dictionary = {
  nav: {
    works: string;
    biography: string;
    exhibitions: string;
    contact: string;
    home: string;
    brochure: string;
  };
  works: {
    title: string;
    searchPlaceholder: string;
    allSeries: string;
    noResults: string;
    contactWhatsApp: string;
    priceFrom: string;
    priceOnRequest: string;
  };
  biography: { statsTitle: string; quotesTitle: string };
  exhibitions: { title: string };
  contact: {
    title: string;
    intro: string;
    email: string;
    phone: string;
    instagram: string;
    facebook: string;
    address: string;
    whatsapp: string;
  };
  footer: { rights: string };
};

const fr: Dictionary = {
  nav: {
    home: "Accueil",
    works: "Œuvres",
    biography: "Biographie",
    exhibitions: "Expositions",
    contact: "Contact",
    brochure: "Télécharger brochure",
  },
  works: {
    title: "Œuvres",
    searchPlaceholder: "Rechercher un titre, une série, une technique…",
    allSeries: "Toutes les séries",
    noResults: "Aucune œuvre ne correspond à votre recherche.",
    contactWhatsApp: "Contacter sur WhatsApp",
    priceFrom: "à partir de",
    priceOnRequest: "Prix sur demande",
  },
  biography: {
    statsTitle: "En quelques chiffres",
    quotesTitle: "Ils en parlent",
  },
  exhibitions: {
    title: "Expositions",
  },
  contact: {
    title: "Contact",
    intro: "Une question, un projet d'acquisition ou une collaboration ? Écrivez-nous.",
    email: "Email",
    phone: "Téléphone",
    instagram: "Instagram",
    facebook: "Facebook",
    address: "Adresse",
    whatsapp: "Discuter sur WhatsApp",
  },
  footer: {
    rights: "Tous droits réservés.",
  },
};

const en: Dictionary = {
  nav: {
    home: "Home",
    works: "Works",
    biography: "Biography",
    exhibitions: "Exhibitions",
    contact: "Contact",
    brochure: "Download brochure",
  },
  works: {
    title: "Works",
    searchPlaceholder: "Search a title, series, technique…",
    allSeries: "All series",
    noResults: "No artwork matches your search.",
    contactWhatsApp: "Contact on WhatsApp",
    priceFrom: "from",
    priceOnRequest: "Price on request",
  },
  biography: {
    statsTitle: "In a few numbers",
    quotesTitle: "They said it",
  },
  exhibitions: {
    title: "Exhibitions",
  },
  contact: {
    title: "Contact",
    intro: "A question, an acquisition project or a collaboration? Get in touch.",
    email: "Email",
    phone: "Phone",
    instagram: "Instagram",
    facebook: "Facebook",
    address: "Address",
    whatsapp: "Chat on WhatsApp",
  },
  footer: {
    rights: "All rights reserved.",
  },
};

const dictionaries: Record<Locale, Dictionary> = { fr, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
