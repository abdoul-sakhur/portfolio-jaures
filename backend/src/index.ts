import type { Core } from '@strapi/strapi';

const PUBLIC_READ_PERMISSIONS: Record<string, string[]> = {
  'api::page.page': ['find', 'findOne'],
  'api::section.section': ['find', 'findOne'],
  'api::section-item.section-item': ['find', 'findOne'],
  'api::artwork.artwork': ['find', 'findOne'],
  'api::series.serie': ['find', 'findOne'],
  'api::artist-profile.artist-profile': ['find'],
  'api::quote.quote': ['find', 'findOne'],
  'api::exhibition.exhibition': ['find', 'findOne'],
  'api::setting.setting': ['find'],
};

const PUBLIC_CREATE_PERMISSIONS: Record<string, string[]> = {
  'api::contact-message.contact-message': ['create'],
};

async function ensureFrenchLocale({ strapi }: { strapi: Core.Strapi }) {
  const localesService = strapi.plugin('i18n').service('locales');
  const existingLocales = await localesService.find();
  const hasFrench = existingLocales.some((locale: { code: string }) => locale.code === 'fr');

  if (!hasFrench) {
    await localesService.create({ code: 'fr', name: 'French (fr)' });
  }

  await localesService.setDefaultLocale({ code: 'fr' });
}

async function ensurePublicPermissions({ strapi }: { strapi: Core.Strapi }) {
  const publicRole = await strapi
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'public' } });

  if (!publicRole) return;

  const allPermissions: Record<string, string[]> = {
    ...PUBLIC_READ_PERMISSIONS,
    ...PUBLIC_CREATE_PERMISSIONS,
  };

  for (const [uid, actions] of Object.entries(allPermissions)) {
    for (const action of actions) {
      const actionName = `${uid}.${action}`;

      const existingPermission = await strapi
        .query('plugin::users-permissions.permission')
        .findOne({ where: { action: actionName, role: publicRole.id } });

      if (!existingPermission) {
        await strapi.query('plugin::users-permissions.permission').create({
          data: { action: actionName, role: publicRole.id },
        });
      }
    }
  }
}

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await ensureFrenchLocale({ strapi });
    await ensurePublicPermissions({ strapi });
  },
};
