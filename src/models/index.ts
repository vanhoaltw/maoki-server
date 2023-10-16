import database from "@/database";
import { Model } from "objection";
import User from "./User";
import SocialConnect from "./SocialConnect";

Model.knex(database);

export { User, SocialConnect };
