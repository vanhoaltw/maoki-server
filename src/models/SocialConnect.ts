import { Model } from "objection";
import BaseModel from "./Base";
import User from "./User";

class SocialConnect extends BaseModel {
  id!: number;
  userId!: number;
  provider: string;
  providerToken: string;

  user: User;

  static tableName = "social_connect";

  static get jsonSchema() {
    return {
      type: "object",
      required: ["userId", "providerToken"],
      properties: {
        id: { type: "integer" },
        userId: { type: "integer" },
        provider: { type: "string" },
        providerToken: { type: "string" },
      },
    };
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "social_connect.userId",
          to: "user.id",
        },
      },
    };
  }
}

export default SocialConnect;
