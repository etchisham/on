export default ({ env }) => ({
  origin: env.array('CORS_ORIGINS', ['http://localhost:3000', 'http://localhost:3333']),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS'],
  headers: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
});
