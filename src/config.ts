import "dotenv/config";

export default {
  nodeEnv: process.env.NODE_ENV || "development",
  port: process.env.PORT || 3010,
  database: {
    type: "pg",
    connection: {
      host: process.env.DATABASE_HOST || "127.0.0.1",
      port: process.env.DATABASE_PORT || 3306,
      database: process.env.DATABASE_NAME || "quotes",
      user: process.env.DATABASE_USER || "quotes",
      password: process.env.DATABASE_PASSWORD || "p4ssw0rd",
    },
    // migrations: {
    //   directory: __dirname + "/migrations",
    // },
    // seeds: {
    //   directory: __dirname + "/seeds",
    // },
  },
  google: {
    clientId: "958439718673-982mfbdk6uhlr28ho9nn836nr5s0vcco.apps.googleusercontent.com",
    clientSecret: "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",
  },
  jwtSecret: "nguyenvanhoa2001",
  defaultQuery: `
  `,
};
