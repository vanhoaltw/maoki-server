import { Application } from "express";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@apollo/server/express4";
import resolvers from "./resolvers";
import path from "path";

import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeTypeDefs } from "@graphql-tools/merge";
import { formatErrorMiddleware } from "@/middlewares/formatError";
import { MyContext } from "./context";
import { AuthenticationError } from "./graphqlError";
import moment from "moment";
import { User } from "@/models";

const typesArray = loadFilesSync(path.join(__dirname, "./typeDefs"), {
  extensions: ["gql"],
});

const getContext = async (token: string): Promise<MyContext | null> => {
  let me: User;
  const decoded = User.decodeToken(token);
  if (decoded) {
    if (decoded.id) {
      me = await User.query().findOne({ id: decoded.id });
    }
    if (me && decoded.sid) {
      // check sid
      if (!me.sids || me.sids.indexOf(decoded.sid) === -1) {
        throw new AuthenticationError("INVALID_TOKEN");
      }

      const isExpired = moment(decoded.at, "YYYYMMDDHHmmss")
        .add(90, "days")
        .isBefore(moment());
      if (isExpired) throw new AuthenticationError("EXPIRED_TOKEN");
    }
    return { me };
  }

  return null;
};

const getDynamicContext = async (authorization: string) => {
  const HEADER_REGEX = /Bearer (.*)$/;
  try {
    if (authorization) {
      const token = HEADER_REGEX.exec(authorization)?.[1];
      const ctx = await getContext(token);
      return ctx;
    }
    // throw new AuthenticationError("Missing auth token!");
  } catch (err) {
    if (err instanceof Error) {
      // throw new AuthenticationError(err.message);
    }
  }
};

const createGraphqlServer = async (app: Application, httpServer: any) => {
  const server = new ApolloServer({
    typeDefs: mergeTypeDefs(typesArray),
    resolvers,
    formatError: formatErrorMiddleware,
    introspection: process.env.NODE_ENV !== "production",
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    persistedQueries: { ttl: 900 },
  });

  await server.start();
  const endpoint = "/graphql";

  app.use(
    endpoint,
    expressMiddleware(server, {
      context: async ({ req }) => {
        const authorization =
          req.headers.authorization || req.headers.Authorization;
        let ctx: MyContext = {};
        if (authorization) {
          ctx = await getDynamicContext(<string>authorization);
        }

        return {
          ...ctx,
          clientIp: req.headers["cf-connecting-ip"]?.toString?.() || req.ip,
        };
      },
    })
  );

  return endpoint;
};

export default createGraphqlServer;
