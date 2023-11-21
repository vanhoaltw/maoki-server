import "dotenv/config";

export default {
  nodeEnv: process.env.NODE_ENV || "development",
  port: process.env.PORT || 3010,
  google: {
    clientId:
      "958439718673-982mfbdk6uhlr28ho9nn836nr5s0vcco.apps.googleusercontent.com",
    clientSecret: "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",
  },
  jwtSecret: "nguyenvanhoa2001",
  defaultQuery: `
  `,
};
