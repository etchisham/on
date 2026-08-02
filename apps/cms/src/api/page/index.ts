export default {
  controllers: {
    page: {
      async find(ctx) {
        const populate = ctx.query.populate || ['body'];
        const locale = ctx.query.locale || ctx.request.query.locale;
        const { results, pagination } = await strapi.service('api::page.page').find({
          query: { ...ctx.query, populate, locale },
        });
        return this.transformResponse(results, { pagination });
      },
      async findOne(ctx) {
        const { documentId } = ctx.params;
        const locale = ctx.query.locale || ctx.request.query.locale;
        const entity = await strapi.service('api::page.page').findOne(documentId, {
          locale,
          populate: ['body'],
        });
        return this.transformResponse(entity);
      },
      async create(ctx) {
        const { data } = ctx.request.body;
        const locale = data.locale || ctx.query.locale || 'en';
        const entity = await strapi.service('api::page.page').create({
          data: { ...data, locale },
          populate: ['body'],
        });
        return this.transformResponse(entity);
      },
      async update(ctx) {
        const { documentId } = ctx.params;
        const { data } = ctx.request.body;
        const entity = await strapi.service('api::page.page').update(documentId, {
          data,
          populate: ['body'],
        });
        return this.transformResponse(entity);
      },
    },
  },
  services: {
    page: {
      async find(params) {
        return strapi.documents('api::page.page').findMany(params);
      },
      async findOne(documentId, params) {
        return strapi.documents('api::page.page').findOne({ documentId, ...params });
      },
      async create(params) {
        return strapi.documents('api::page.page').create(params);
      },
      async update(documentId, params) {
        return strapi.documents('api::page.page').update({ documentId, ...params });
      },
      async delete(documentId) {
        return strapi.documents('api::page.page').delete({ documentId });
      },
    },
  },
};
