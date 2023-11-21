import { Model } from "objection";
import BaseModel from "./Base";
import User from "./User";
import ExplorePictue from "./ExplorePicture";

class Listing extends BaseModel {
  id!: number;
  userId!: number;
  name?: string;
  title?: string;
  price?: number;
  bedroom?: number;
  bedCount?: number;
  bathroom?: number;
  description?: string;
  latitude?: number;
  longitude?: number;
  city?: string;
  isActive?: boolean;

  isFavorite?: boolean;
  user?: User;
  explorePicture?: ExplorePictue[];

  static tableName = "listing";

  static get jsonSchema() {
    return {
      type: "object",
      required: ["userId"],
      properties: {
        id: { type: "integer" },
        userId: { type: "integer" },
        name: { type: "string" },
        title: { type: "string" },
        description: { type: "string" },
        price: { type: "integer" },
        bedroom: { type: "integer" },
        bedCount: { type: "integer" },
        bathroom: { type: "integer" },
        latitude: { type: "integer" },
        longitude: { type: "integer" },
        city: { type: "string" },
        isActive: { type: "boolean" },
      },
    };
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "listing.userId",
          to: "user.id",
        },
      },
      favorite: {
        relation: Model.ManyToManyRelation,
        modelClass: User,
        join: {
          from: "listing.id",
          through: {
            from: "favorite_listing.targetId",
            to: "favorite_listing.fromId",
          },
          to: "user.id",
        },
      },
      explorePicture: {
        relation: Model.HasManyRelation,
        modelClass: ExplorePictue,
        join: {
          from: "listing.id",
          to: "explore_picture.listingId",
        },
      },
    };
  }
}

export default Listing;
