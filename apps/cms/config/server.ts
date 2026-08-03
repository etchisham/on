export default () => ({
  host: '0.0.0.0',
  port: 1337,
  app: {
    keys: ['key1', 'key2'],
  },
  webhooks: {
    populateRelations: true,
  },
  url: 'http://localhost:1337',
});
