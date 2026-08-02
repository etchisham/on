export default {
  controllers: {
    'site-setting': {
      async find(ctx) {
        const locale = ctx.query.locale || ctx.request.query.locale;
        const entity = await strapi.service('api::site-setting.site-setting').find({
          locale,
          populate: [],
        });
        return this.transformResponse(entity);
      },
      async update(ctx) {
        const { data } = ctx.request.body;
        const locale = data.locale || ctx.query.locale || 'en';
        const entity = await strapi.service('api::site-setting.site-setting').update({
          data: { ...data, locale },
          populate: [],
        });
        return this.transformResponse(entity);
      },
    },
  },
  services: {
    'site-setting': {
      async find(params) {
        const results = await strapi.documents('api::site-setting.site-setting').findMany(params);
        return results;
      },
      async update(params) {
        const existing = await strapi.documents('api::site-setting.site-setting').findFirst();
        if (existing) {
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
