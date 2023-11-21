import { knex } from "knex";

import dbConfigs from "../../knexfile.js";
const environment = process.env.NODE_ENV || "development";

const database = knex(dbConfigs[environment]);

export default database;
