'use strict';

const { compileStrapi, createStrapi } = require('@strapi/strapi');

async function run() {
  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();
  app.log.level = 'error';

  try {
    const data = {
      instagramHandles: [
        { handle: '@jaures_agohi_art', url: 'https://www.instagram.com/jaures_agohi_art/' },
      ],
      facebookUrl: 'https://www.facebook.com/profile.php?id=61568033399751',
    };

    for (const locale of ['fr', 'en']) {
      const existing = await app.documents('api::setting.setting').findFirst({ locale });
      if (!existing) {
        console.log(`No settings entry for locale "${locale}", skipping.`);
        continue;
      }
      await app.documents('api::setting.setting').update({
        documentId: existing.documentId,
        locale,
        data,
        status: 'published',
      });
      console.log(`Updated settings for locale "${locale}".`);
    }
  } catch (err) {
    console.error('Update failed:', err);
  } finally {
    await app.destroy();
    process.exit(0);
  }
}

run();
