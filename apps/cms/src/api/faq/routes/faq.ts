export default {
  routes: [
    {
      method: 'GET',
      path: '/faqs',
      handler: 'faq.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/faqs/:documentId',
      handler: 'faq.findOne',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
