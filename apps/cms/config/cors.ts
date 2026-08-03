export default () => ({
  origin: ['http://localhost:3000', 'http://localhost:3333'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS'],
  headers: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
});
