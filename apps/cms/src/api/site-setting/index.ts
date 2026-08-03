export default {
  controllers: {
    'site-setting': {
      async find(ctx: unknown) {
        const context = ctx as { query?: Record<string, unknown>; request?: { query?: Record<string, unknown> } };
        const strapi = (global as Record<string, unknown>).strapi as { service: (name: string) => Record<string, (p: unknown) => Promise<unknown>> };
        if (!strapi) throw new Error('Strapi not initialized');
        const locale = (context.query?.locale as string) || (context.request?.query?.locale as string);
        const entity = await strapi.service('api::site-setting.site-setting').find({
          locale,
          populate: [],
        });
        return entity;
      },
      async update(ctx: unknown) {
        const context = ctx as { query?: Record<string, unknown>; request?: { body?: { data?: Record<string, unknown> } } };
        const strapi = (global as Record<string, unknown>).strapi as { service: (name: string) => Record<string, (p: unknown) => Promise<unknown>> };
        if (!strapi) throw new Error('Strapi not initialized');
        const data = context.request?.body?.data || {};
        const locale = (data.locale as string) || (context.query?.locale as string) || 'en';
        const entity = await strapi.service('api::site-setting.site-setting').update({
          data: { ...data, locale },
          populate: [],
        });
        return entity;
      },
    },
  },
  services: {
    'site-setting': {
      async find(params: Record<string, unknown>) {
        const strapi = (global as Record<string, unknown>).strapi as { documents: (uid: string) => { findMany: (p: Record<string, unknown>) => Promise<unknown[]> } };
        if (!strapi) throw new Error('Strapi not initialized');
        return strapi.documents('api::site-setting.site-setting').findMany(params);
      },
      async update(params: Record<string, unknown>) {
        const strapi = (global as Record<string, unknown>).strapi as { documents: (uid: string) => { findFirst: () => Promise<{ documentId?: string } | null>; update: (p: Record<string, unknown>) => Promise<unknown>; create: (p: Record<string, unknown>) => Promise<unknown> } };
        if (!strapi) throw new Error('Strapi not initialized');
        const existing = await strapi.documents('api::site-setting.site-setting').findFirst();
        if (existing && existing.documentId) {
          return strapi.documents('api::site-setting.site-setting').update({
            documentId: existing.documentId,
            ...params,
          });
        }
        return strapi.documents('api::site-setting.site-setting').create(params);
      },
    },
  },
};
