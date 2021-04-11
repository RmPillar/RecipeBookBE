const { DB_URL } = process.env;
const ENV = process.env.NODE_ENV || 'production';

const baseConfig = {
  client: 'pg',
  migrations: {
    directory: './db/migrations',
  },
  seeds: {
    directory: './db/seeds',
  },
};

const customConfig = {
  production: {
    connection: {
      url: DB_URL,
      ssl: { rejectUnauthorized: false },
      user: 'ydaknzcbiyjkdi',
      password: 'dcbjufc4mr2jii',
    },
  },
  development: {
    connection: {
      database: 'recipe_book',
    },
  },
  test: {
    connection: {
      database: 'recipe_book_test',
    },
  },
};

module.exports = { ...customConfig[ENV], ...baseConfig };
