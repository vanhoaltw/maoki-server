import express from "express";
import http from "http";

import responseTime from "@/middlewares/reponseTime";
import cors from "@/middlewares/cors";
import config from "@/configs/config";
import database from "@/configs/database";

import { oauth } from "./controllers/auth";
import createGraphqlServer from "./graphql";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(responseTime);
app.use(cors);

oauth(app);

async function start(): Promise<void> {
  try {
    await database.raw("SELECT 1 + 1 AS result");
    const httpServer = http.createServer(app);
    const graphqlEndpoint = await createGraphqlServer(app, httpServer);

    httpServer.listen(config.port, () => {
      console.log("NODE_ENV", config.nodeEnv);
      console.log(`🚀 Server ready at http://localhost:${config.port}`);
      console.log(
        `🚀 Graphql server ready at http://localhost:${config.port}${graphqlEndpoint}`
      );
    });
  } catch (error) {
    console.log({ error });
    process.exit(1);
  }
}

start();
