export default {
  controllers: {
    page: {
      async find(ctx: unknown) {
        const context = ctx as { query?: Record<string, unknown>; request?: { query?: Record<string, unknown> } };
        const strapi = (global as Record<string, unknown>).strapi as { service: (name: string) => Record<string, (p: unknown) => Promise<unknown>> };
        if (!strapi) throw new Error('Strapi not initialized');
        const populate = (context.query?.populate as string[]) || ['body'];
        const locale = (context.query?.locale as string) || (context.request?.query?.locale as string);
        const { results, pagination } = (await strapi.service('api::page.page').find({
          query: { ...context.query, populate, locale },
        })) as { results: unknown[]; pagination: unknown };
        return { results, pagination };
      },
      async findOne(ctx: unknown) {
        const context = ctx as { params?: Record<string, unknown>; query?: Record<string, unknown>; request?: { query?: Record<string, unknown> } };
        const strapi = (global as Record<string, unknown>).strapi as { service: (name: string) => Record<string, (...args: unknown[]) => Promise<unknown>> };
        if (!strapi) throw new Error('Strapi not initialized');
        const documentId = context.params?.documentId as string;
        const locale = (context.query?.locale as string) || (context.request?.query?.locale as string);
        const entity = await strapi.service('api::page.page').findOne({
          documentId,
          locale,
          populate: ['body'],
        });
        return entity;
      },
      async create(ctx: unknown) {
        const context = ctx as { query?: Record<string, unknown>; request?: { body?: { data?: Record<string, unknown> } } };
        const strapi = (global as Record<string, unknown>).strapi as { service: (name: string) => Record<string, (p: unknown) => Promise<unknown>> };
        if (!strapi) throw new Error('Strapi not initialized');
        const data = context.request?.body?.data || {};
        const locale = (data.locale as string) || (context.query?.locale as string) || 'en';
        const entity = await strapi.service('api::page.page').create({
          data: { ...data, locale },
          populate: ['body'],
        });
        return entity;
      },
      async update(ctx: unknown) {
        const context = ctx as { params?: Record<string, unknown>; request?: { body?: { data?: Record<string, unknown> } } };
        const strapi = (global as Record<string, unknown>).strapi as { service: (name: string) => Record<string, (...args: unknown[]) => Promise<unknown>> };
        if (!strapi) throw new Error('Strapi not initialized');
        const documentId = context.params?.documentId as string;
        const data = context.request?.body?.data || {};
        const entity = await strapi.service('api::page.page').update({
          documentId,
          data,
          populate: ['body'],
        });
        return entity;
      },
    },
  },
  services: {
    page: {
      async find(params: Record<string, unknown>) {
        const strapi = (global as Record<string, unknown>).strapi as { documents: (uid: string) => { findMany: (p: Record<string, unknown>) => Promise<unknown[]> } };
        if (!strapi) throw new Error('Strapi not initialized');
        return strapi.documents('api::page.page').findMany(params);
      },
      async findOne(params: Record<string, unknown>) {
        const strapi = (global as Record<string, unknown>).strapi as { documents: (uid: string) => { findOne: (p: Record<string, unknown>) => Promise<unknown> } };
        if (!strapi) throw new Error('Strapi not initialized');
        return strapi.documents('api::page.page').findOne(params);
      },
      async create(params: Record<string, unknown>) {
        const strapi = (global as Record<string, unknown>).strapi as { documents: (uid: string) => { create: (p: Record<string, unknown>) => Promise<unknown> } };
        if (!strapi) throw new Error('Strapi not initialized');
        return strapi.documents('api::page.page').create(params);
      },
      async update(params: Record<string, unknown>) {
        const strapi = (global as Record<string, unknown>).strapi as { documents: (uid: string) => { update: (p: Record<string, unknown>) => Promise<unknown> } };
        if (!strapi) throw new Error('Strapi not initialized');
        return strapi.documents('api::page.page').update(params);
      },
      async delete(documentId: string) {
        const strapi = (global as Record<string, unknown>).strapi as { documents: (uid: string) => { delete: (p: Record<string, unknown>) => Promise<unknown> } };
        if (!strapi) throw new Error('Strapi not initialized');
        return strapi.documents('api::page.page').delete({ documentId });
      },
    },
  },
};
