export default {
  guards: {
    'plugins::users-permissions': {
      throttling: {
        interval: 60000,
        limit: 5,
      },
    },
  },
  rateLimits: [
    {
      name: 'global',
      max: 1000,
      window: 60000,
    },
    {
      name: 'auth',
      routes: [
        { path: '/admin/login', max: 50 },
        { path: '/api/auth/local', max: 100 },
      ],
    },
  ],
  helmet: {
    enabled: true,
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        'connect-src': ["'self'", 'https:'],
        'img-src': ["'self'", 'data:', 'blob:', 'https:'],
        'media-src': ["'self'", 'data:', 'blob:', 'https:'],
        'script-src': ["'self'", "'unsafe-inline'"],
        'style-src': ["'self'", "'unsafe-inline'"],
      },
    },
  },
};
