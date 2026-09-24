'use strict';

const { compileStrapi, createStrapi } = require('@strapi/strapi');

const whatsappMessage = (title, dimensions, locale) =>
  locale === 'fr'
    ? `Bonjour, je suis intéressé(e) par l'œuvre « ${title} » (${dimensions} cm). Pouvez-vous me donner plus d'informations ?`
    : `Hello, I'm interested in the artwork "${title}" (${dimensions} cm). Could you give me more information?`;

const TECHNIQUE_FR = 'Collage de pagnes et de tissus';
const TECHNIQUE_EN = 'Fabric and wax-print collage';

const SERIES = [
  { slug: 'les-visages-des-anges', fr: 'Les visages des anges', en: 'The Faces of Angels' },
  { slug: 'le-poids-des-reves', fr: 'Le poids des rêves', en: 'The Weight of Dreams' },
  { slug: 'le-fil-de-la-transmission', fr: 'Le fil de la transmission', en: 'The Thread of Transmission' },
  { slug: 'elevation', fr: 'Élévation', en: 'Elevation' },
  { slug: 'art-religieux', fr: 'Art religieux', en: 'Religious Art' },
  { slug: 'portrait', fr: 'Portrait', en: 'Portrait' },
];

const ARTWORKS = [
  { slug: 'ba-bla-1', series: 'les-visages-des-anges', title: 'Bâ Blâ 1', year: '2026', dimensions: '100 x 81' },
  { slug: 'ba-bla-2', series: 'les-visages-des-anges', title: 'Bâ Blâ 2', year: '2026', dimensions: '66 x 55' },
  { slug: 'ba-bla-3', series: 'les-visages-des-anges', title: 'Bâ Blâ 3', year: '2026', dimensions: '65 x 50' },
  { slug: 'tchanvie-1', series: 'le-poids-des-reves', title: 'Tchanvié 1', year: '2026', dimensions: '100 x 73' },
  { slug: 'tchanvie-2', series: 'le-poids-des-reves', title: 'Tchanvié 2', year: '2026', dimensions: '100 x 73' },
  { slug: 'tchanvie-3', series: 'le-fil-de-la-transmission', title: 'Tchanvié 3', year: '2026', dimensions: '100 x 81' },
  { slug: 'aboussouan', series: 'le-fil-de-la-transmission', title: 'Aboussouan', year: '2026', dimensions: '100 x 66' },
  { slug: 'sie-ni-wa', series: 'le-fil-de-la-transmission', title: 'Siê Nî Wa', year: '2025', dimensions: '100 x 83' },
  { slug: 'ye-sre-1', series: 'elevation', title: 'Yé Srê 1', year: '2026', dimensions: '100 x 81' },
  { slug: 'mystere-douloureux', series: 'art-religieux', title: 'Mystère Douloureux', year: '2026', dimensions: '39 x 30' },
  { slug: 'a-la-croix-1', series: 'art-religieux', title: 'À la Croix 1', year: '2025', dimensions: '102 x 72' },
  { slug: 'a-la-croix-2', series: 'art-religieux', title: 'À la Croix 2', year: '2026', dimensions: '41 x 30' },
  { slug: 'padre', series: 'portrait', title: 'Padre', year: '2026', dimensions: '65 x 50' },
  { slug: 'la-face-du-christ-1', series: 'art-religieux', title: 'La Face du Christ', year: '2025', dimensions: '106 x 73' },
  { slug: 'la-face-du-christ-2', series: 'art-religieux', title: 'La Face du Christ', year: '2025', dimensions: '106 x 73' },
  { slug: 'nan-ni-wa', series: 'le-fil-de-la-transmission', title: 'Nan Nî Wa', year: '2026', dimensions: '100 x 73' },
];

const PAGES = [
  {
    slug: 'home',
    titleFr: 'Accueil',
    titleEn: 'Home',
    metaFr: 'Jaurès Agohi — artiste peintre ivoirien, spécialiste du collage de pagnes et de tissus.',
    metaEn: 'Jaurès Agohi — Ivorian painter specializing in fabric and wax-print collage.',
  },
  {
    slug: 'works',
    titleFr: 'Œuvres',
    titleEn: 'Works',
    metaFr: "Parcourez la galerie complète des œuvres de Jaurès Agohi, filtrables par série.",
    metaEn: "Browse Jaurès Agohi's complete gallery of artworks, filterable by series.",
  },
  {
    slug: 'biography',
    titleFr: 'Biographie',
    titleEn: 'Biography',
    metaFr: 'Le parcours et la démarche artistique de Jaurès Agohi.',
    metaEn: "Jaurès Agohi's journey and artistic approach.",
  },
  {
    slug: 'exhibitions',
    titleFr: 'Expositions',
    titleEn: 'Exhibitions',
    metaFr: 'Les expositions de Jaurès Agohi, en Côte d’Ivoire et à l’international.',
    metaEn: "Jaurès Agohi's exhibitions, in Ivory Coast and internationally.",
  },
  {
    slug: 'contact',
    titleFr: 'Contact',
    titleEn: 'Contact',
    metaFr: 'Contactez Jaurès Agohi Arts pour toute demande, acquisition ou collaboration.',
    metaEn: 'Contact Jaurès Agohi Arts for any inquiry, acquisition or collaboration.',
  },
];

async function run() {
  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();
  app.log.level = 'error';

  try {
    console.log('Seeding series...');
    const seriesDocBySlug = {};
    for (const s of SERIES) {
      const doc = await app.documents('api::series.serie').create({
        data: { title: s.fr, slug: s.slug },
        locale: 'fr',
        status: 'published',
      });
      await app.documents('api::series.serie').update({
        documentId: doc.documentId,
        locale: 'en',
        data: { title: s.en, slug: s.slug },
        status: 'published',
      });
      seriesDocBySlug[s.slug] = doc.documentId;
    }

    console.log('Seeding artworks...');
    for (const a of ARTWORKS) {
      const doc = await app.documents('api::artwork.artwork').create({
        data: {
          title: a.title,
          slug: a.slug,
          series: seriesDocBySlug[a.series],
          year: a.year,
          dimensions: `${a.dimensions} cm`,
          technique: TECHNIQUE_FR,
          whatsappMessage: whatsappMessage(a.title, a.dimensions, 'fr'),
        },
        locale: 'fr',
        status: 'published',
      });
      await app.documents('api::artwork.artwork').update({
        documentId: doc.documentId,
        locale: 'en',
        data: {
          title: a.title,
          slug: a.slug,
          technique: TECHNIQUE_EN,
          whatsappMessage: whatsappMessage(a.title, a.dimensions, 'en'),
        },
        status: 'published',
      });
    }

    console.log('Seeding artist profile...');
    const statsFr = [
      { value: String(ARTWORKS.length), label: 'Œuvres' },
      { value: String(SERIES.length), label: 'Séries' },
      { value: '2025', label: 'Débuts artistiques' },
    ];
    const statsEn = [
      { value: String(ARTWORKS.length), label: 'Artworks' },
      { value: String(SERIES.length), label: 'Series' },
      { value: '2025', label: 'Artistic beginnings' },
    ];

    const highlightsFr = [
      {
        icon: 'palette',
        title: 'Collage de pagnes & tissus',
        description:
          "Les tissus sont sélectionnés, découpés puis assemblés afin de créer progressivement les formes, les volumes, les visages et les détails de l'œuvre — jouant avec la matière, la couleur, le motif, la texture, la lumière et le contraste. Le pagne devient une véritable matière picturale.",
        order: 1,
      },
      {
        icon: 'globe',
        title: 'Un langage visuel personnel',
        description:
          "À travers cette démarche, Jaurès Agohi cherche à créer un langage visuel personnel, profondément inspiré de son environnement culturel ivoirien et africain. Le pagne n'est pas seulement un matériau esthétique : il est aussi un élément de mémoire, d'identité et de culture.",
        order: 2,
      },
      {
        icon: 'award',
        title: 'Un parcours autodidacte',
        description:
          "Sa pratique artistique s'est progressivement construite à travers l'expérimentation, la recherche personnelle et l'observation. Depuis décembre 2025, le collage de pagnes et de tissus constitue le cœur de sa démarche artistique.",
        order: 3,
      },
      {
        icon: 'users',
        title: 'Une double vie professionnelle',
        description:
          "En parallèle de son activité de Responsable d'Études et de Projets au sein d'un cabinet d'études, Jaurès Agohi poursuit le développement de son univers artistique.",
        order: 4,
      },
    ];
    const highlightsEn = [
      {
        icon: 'palette',
        title: 'Fabric & wax-print collage',
        description:
          'Fabrics are selected, cut and then assembled to progressively build the shapes, volumes, faces and details of the work — playing with material, color, pattern, texture, light and contrast. The fabric becomes a genuine pictorial matter.',
        order: 1,
      },
      {
        icon: 'globe',
        title: 'A personal visual language',
        description:
          "Through this approach, Jaurès Agohi seeks to create a personal visual language, deeply inspired by his Ivorian and African cultural environment. Fabric is not only an aesthetic material: it also carries memory, identity and culture.",
        order: 2,
      },
      {
        icon: 'award',
        title: 'A self-taught journey',
        description:
          'His artistic practice has been built progressively through experimentation, personal research and observation. Since December 2025, fabric and wax-print collage has been at the heart of his artistic approach.',
        order: 3,
      },
      {
        icon: 'users',
        title: 'A dual professional life',
        description:
          'Alongside his work as Head of Studies and Projects at a research firm, Jaurès Agohi continues to develop his artistic world.',
        order: 4,
      },
    ];

    const profileDoc = await app.documents('api::artist-profile.artist-profile').create({
      data: {
        fullName: 'Jaurès Agohi',
        displayName: 'Jaurès Agohi',
        tagline: 'Artiste peintre ivoirien',
        bio: "Jaurès Agohi est un artiste peintre ivoirien autodidacte, diplômé d'un Master 2 en Sociologie de l'Université Félix Houphouët-Boigny d'Abidjan. Il exerce actuellement comme Responsable d'Études et de Projets au sein d'un cabinet d'études, tout en développant parallèlement son parcours artistique. Sa démarche artistique repose principalement sur une technique originale de collage de pagnes et de tissus, à travers laquelle il explore les possibilités offertes par les textures, les motifs, les couleurs et les matières textiles.",
        stats: statsFr,
        highlights: highlightsFr,
      },
      locale: 'fr',
      status: 'published',
    });
    await app.documents('api::artist-profile.artist-profile').update({
      documentId: profileDoc.documentId,
      locale: 'en',
      data: {
        tagline: 'Ivorian visual artist',
        bio: "Jaurès Agohi is a self-taught Ivorian painter with a Master's degree in Sociology from Félix Houphouët-Boigny University in Abidjan. He currently works as Head of Studies and Projects at a research firm, while developing his artistic path in parallel. His artistic approach rests mainly on an original technique of fabric and wax-print collage, through which he explores the possibilities offered by textures, patterns, colors and textile materials.",
        stats: statsEn,
        highlights: highlightsEn,
      },
      status: 'published',
    });

    console.log('Seeding pages...');
    const pageDocBySlug = {};
    for (const p of PAGES) {
      const doc = await app.documents('api::page.page').create({
        data: { slug: p.slug, title: p.titleFr, metaDescription: p.metaFr },
        locale: 'fr',
        status: 'published',
      });
      await app.documents('api::page.page').update({
        documentId: doc.documentId,
        locale: 'en',
        data: { slug: p.slug, title: p.titleEn, metaDescription: p.metaEn },
        status: 'published',
      });
      pageDocBySlug[p.slug] = doc.documentId;
    }

    console.log('Seeding quote...');
    const quote1 = await app.documents('api::quote.quote').create({
      data: {
        quoteText: 'Je transforme le pagne en matière, la matière en image, et l’image en histoire.',
        author: 'Jaurès Agohi',
        style: 'highlighted',
        order: 1,
        page: pageDocBySlug['biography'],
      },
      locale: 'fr',
      status: 'published',
    });
    await app.documents('api::quote.quote').update({
      documentId: quote1.documentId,
      locale: 'en',
      data: {
        quoteText: 'I transform fabric into matter, matter into image, and image into story.',
      },
      status: 'published',
    });

    console.log('Seeding exhibitions...');
    const exhibitionDoc = await app.documents('api::exhibition.exhibition').create({
      data: {
        title: 'Exposition-vente',
        badge: '7 AU 14 DÉCEMBRE 2025',
        location: 'Bon Pasteur, Abidjan',
        description:
          "Première exposition-vente de l'artiste, présentant une sélection de ses œuvres en collage de pagnes et de tissus.",
        curator: null,
        countriesList: ["Côte d'Ivoire"],
        order: 1,
      },
      locale: 'fr',
      status: 'published',
    });
    await app.documents('api::exhibition.exhibition').update({
      documentId: exhibitionDoc.documentId,
      locale: 'en',
      data: {
        title: 'Exhibition & Sale',
        badge: 'DECEMBER 7–14, 2025',
        location: 'Bon Pasteur, Abidjan',
        description:
          "The artist's first exhibition and sale, presenting a selection of his fabric and wax-print collage works.",
      },
      status: 'published',
    });

    console.log('Seeding sections...');
    const heroSection = await app.documents('api::section.section').create({
      data: {
        type: 'hero-bio',
        title: 'Jaurès Agohi',
        subtitle: 'Artiste peintre ivoirien',
        content:
          'Autodidacte, Jaurès Agohi développe une technique originale de collage de pagnes et de tissus, explorant la matière, la mémoire et l’identité culturelle ivoirienne.',
        order: 1,
        pages: [pageDocBySlug['home']],
      },
      locale: 'fr',
      status: 'published',
    });
    await app.documents('api::section.section').update({
      documentId: heroSection.documentId,
      locale: 'en',
      data: {
        title: 'Jaurès Agohi',
        subtitle: 'Ivorian visual artist',
        content:
          'Self-taught, Jaurès Agohi develops an original technique of fabric and wax-print collage, exploring matter, memory and Ivorian cultural identity.',
      },
      status: 'published',
    });

    const galleryPreviewSection = await app.documents('api::section.section').create({
      data: {
        type: 'gallery-grid',
        title: 'Œuvres récentes',
        subtitle: 'Une sélection de la galerie',
        order: 2,
        pages: [pageDocBySlug['home'], pageDocBySlug['works']],
      },
      locale: 'fr',
      status: 'published',
    });
    await app.documents('api::section.section').update({
      documentId: galleryPreviewSection.documentId,
      locale: 'en',
      data: {
        title: 'Recent works',
        subtitle: 'A selection from the gallery',
      },
      status: 'published',
    });

    const quoteSection = await app.documents('api::section.section').create({
      data: {
        type: 'quote-block',
        title: 'Citation',
        order: 3,
        pages: [pageDocBySlug['biography']],
      },
      locale: 'fr',
      status: 'published',
    });
    await app.documents('api::section.section').update({
      documentId: quoteSection.documentId,
      locale: 'en',
      data: { title: 'Quote' },
      status: 'published',
    });

    const timelineSection = await app.documents('api::section.section').create({
      data: {
        type: 'exhibitions-timeline',
        title: 'Parcours d’expositions',
        order: 1,
        pages: [pageDocBySlug['exhibitions']],
      },
      locale: 'fr',
      status: 'published',
    });
    await app.documents('api::section.section').update({
      documentId: timelineSection.documentId,
      locale: 'en',
      data: { title: 'Exhibition timeline' },
      status: 'published',
    });

    const contactSection = await app.documents('api::section.section').create({
      data: {
        type: 'contact-cards',
        title: 'Contact',
        subtitle: 'Parlons de votre projet',
        order: 1,
        pages: [pageDocBySlug['contact']],
      },
      locale: 'fr',
      status: 'published',
    });
    await app.documents('api::section.section').update({
      documentId: contactSection.documentId,
      locale: 'en',
      data: {
        title: 'Contact',
        subtitle: "Let's talk about your project",
      },
      status: 'published',
    });

    console.log('Linking section items (exhibitions timeline, quote)...');
    await app.documents('api::section-item.section-item').create({
      data: { order: 1, section: timelineSection.documentId, exhibition: exhibitionDoc.documentId },
    });
    await app.documents('api::section-item.section-item').create({
      data: { order: 1, section: quoteSection.documentId, quote: quote1.documentId },
    });

    console.log('Seeding settings...');
    const settingsDoc = await app.documents('api::setting.setting').create({
      data: {
        siteName: 'Jaurès Agohi Arts',
        galleryName: 'Jaurès Agohi Arts',
        galleryDescription:
          'La galerie officielle de l’artiste Jaurès Agohi, peintre ivoirien spécialisé dans le collage de pagnes et de tissus.',
        email: 'jauresagohik@gmail.com',
        phone: '+225 07 47 48 64 08',
        whatsappNumber: '2250747486408',
        address: 'Cocody Riviera 4, Abidjan, Côte d’Ivoire',
        instagramHandles: [
          { handle: '@jaures_agohi_art', url: 'https://www.instagram.com/jaures_agohi_art/' },
        ],
        facebookUrl: 'https://www.facebook.com/profile.php?id=61568033399751',
        quickLinks: [
          pageDocBySlug['works'],
          pageDocBySlug['biography'],
          pageDocBySlug['exhibitions'],
          pageDocBySlug['contact'],
        ],
      },
      locale: 'fr',
      status: 'published',
    });
    await app.documents('api::setting.setting').update({
      documentId: settingsDoc.documentId,
      locale: 'en',
      data: {
        galleryName: 'Jaurès Agohi Arts',
        galleryDescription:
          'The official gallery of artist Jaurès Agohi, an Ivorian painter specializing in fabric and wax-print collage.',
        address: 'Cocody Riviera 4, Abidjan, Ivory Coast',
      },
      status: 'published',
    });

    console.log('Seed complete.');
  } catch (err) {
    console.error('Seed failed:', err);
  } finally {
    await app.destroy();
    process.exit(0);
  }
}

run();
