export default {
  controllers: {
    faq: {
      async find(ctx: unknown) {
        const context = ctx as { query?: Record<string, unknown>; strapi?: unknown };
        const strapi = (global as Record<string, unknown>).strapi as {
          documents: (uid: string) => {
            findMany: (params: Record<string, unknown>) => Promise<unknown[]>;
            findOne: (params: Record<string, unknown>) => Promise<unknown>;
          };
        };
        if (!strapi) throw new Error('Strapi not initialized');
        const locale = (context.query?.locale as string) || 'en';
        const results = await strapi.documents('api::faq.faq').findMany({
          locale,
          sort: { sortOrder: 'asc' },
          fields: ['question', 'answer', 'sortOrder'],
          status: 'published',
        });
        return results;
      },
      async findOne(ctx: unknown) {
        const context = ctx as { params?: Record<string, unknown>; query?: Record<string, unknown> };
        const strapi = (global as Record<string, unknown>).strapi as {
          documents: (uid: string) => {
            findMany: (params: Record<string, unknown>) => Promise<unknown[]>;
            findOne: (params: Record<string, unknown>) => Promise<unknown>;
          };
        };
        if (!strapi) throw new Error('Strapi not initialized');
        const documentId = context.params?.documentId as string;
        const locale = (context.query?.locale as string) || 'en';
        const entity = await strapi.documents('api::faq.faq').findOne({
          documentId,
          locale,
          fields: ['question', 'answer', 'sortOrder'],
          status: 'published',
        });
        return entity;
      },
    },
  },
  services: {
    faq: {
      async findMany(params: Record<string, unknown>) {
        const strapi = (global as Record<string, unknown>).strapi as {
          documents: (uid: string) => { findMany: (p: Record<string, unknown>) => Promise<unknown[]> };
        };
        if (!strapi) throw new Error('Strapi not initialized');
        return strapi.documents('api::faq.faq').findMany(params);
      },
      async findOne(params: Record<string, unknown>) {
        const strapi = (global as Record<string, unknown>).strapi as {
          documents: (uid: string) => { findOne: (p: Record<string, unknown>) => Promise<unknown> };
        };
        if (!strapi) throw new Error('Strapi not initialized');
        return strapi.documents('api::faq.faq').findOne(params);
      },
    },
  },
};
