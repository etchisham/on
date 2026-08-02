export default {
  'page.find': ({ ctx }) => {
    const publicFields = ['title', 'slug', 'seoDescription', 'body'];
    ctx.query = {
      fields: publicFields,
      populate: ['body'],
      pagination: { limit: 100 },
      ...ctx.query,
    };
  },
  'page.findOne': ({ ctx }) => {
    const publicFields = ['title', 'slug', 'seoDescription', 'body'];
    ctx.query = {
      fields: publicFields,
      populate: ['body'],
      ...ctx.query,
    };
  },
};

module.exports = policies;
