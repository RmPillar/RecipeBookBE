const { DB_URL } = process.env;
const ENV = process.env.NODE_ENV || 'development';

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
    ssl: true,
    connection: {
      url: DB_URL,
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
