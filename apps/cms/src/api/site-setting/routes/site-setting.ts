export default {
  routes: [
    {
      method: 'GET',
      path: '/site-setting',
      handler: 'site-setting.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/site-setting',
      handler: 'site-setting.update',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
