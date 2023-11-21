/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

require("dotenv/config");

module.exports = {
  development: {
    client: "postgresql",
    connection: {
      host: process.env.DATABASE_HOST || "127.0.0.1",
      port: process.env.DATABASE_PORT || 3306,
      database: process.env.DATABASE_NAME || "quotes",
      user: process.env.DATABASE_USER || "quotes",
      password: process.env.DATABASE_PASSWORD || "p4ssw0rd",
    },
    seeds: {
      directory: "./seeds/init",
    },
  },
  staging: {
    client: "postgresql",
    connection: {
      database: "my_db",
      user: "username",
      password: "password",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
  production: {
    client: "postgresql",
    connection: {
      database: "my_db",
      user: "username",
      password: "password",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
};
