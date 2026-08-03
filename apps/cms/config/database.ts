export default () => ({
  connection: {
    client: 'postgres',
    connection: {
      connectionString: 'postgresql://strapi:strapi@postgres:5432/strapi',
      host: 'postgres',
      port: 5432,
      database: 'strapi',
      user: 'strapi',
      password: 'strapi',
      ssl: false,
    },
    pool: {
      min: 2,
      max: 10,
    },
    acquireConnectionTimeout: 60000,
  },
});
