export default () => ({
  'users-permissions': {
    config: {
      jwt: {
        expiresIn: '7d',
        secret: 'JWT_SECRET',
      },
    },
  },
  i18n: {
    enabled: true,
    config: {
      defaultLocale: 'en',
      locales: ['en', 'ar'],
      localeStrings: {
        en: 'English',
        ar: 'Arabic',
      },
    },
  },
  graphql: {
    enabled: false,
    config: {
      endpoint: '/graphql',
      settings: {
        'defaultLimit': 100,
        'maxLimit': 500,
      },
    },
  },
});
