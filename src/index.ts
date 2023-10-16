import express from "express";
import { createHandler } from "graphql-http/lib/use/express";
import responseTime from "@/middlewares/reponseTime";
import cors from "@/middlewares/cors";
import config from "@/config";
import schema from "@/schema";
import database from "@/database";
import context from "@/context";

import { oauth } from "./auth";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(responseTime);
app.use(cors);

oauth(app);

app.all(
  "/graphql",
  createHandler({
    schema,
    context: context as any,
  })
);

async function start(): Promise<void> {
  try {
    // check database connection
    await database.raw("SELECT 1 + 1 AS result");

    if ("migrations" in config.database) {
      await database.migrate.latest();
    }

    app.listen(config.port, () => {
      console.log("NODE_ENV", config.nodeEnv);
      console.log("DATABASE", config.database);
      console.log(`🚀 Server ready at http://localhost:${config.port}`);
    });
  } catch (error) {
    console.log({ error });
    process.exit(1);
  }
}

start();
