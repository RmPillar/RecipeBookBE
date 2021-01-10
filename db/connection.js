const ENV = process.env.NODE_ENV || 'development';
const connection = require('knex');

const dbConfig =
  ENV === 'production'
    ? {
        client: 'pg',
        connection: process.env.DATABASE_URL,
        connectTimeout: 90000,
      }
    : require('../knexfile');

module.exports = connection(dbConfig);
