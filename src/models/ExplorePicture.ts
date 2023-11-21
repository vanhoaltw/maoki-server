import { Model } from "objection";
import BaseModel from "./Base";
import Listing from "./Listing";

class ExplorePictue extends BaseModel {
  id!: number;
  listingId!: number;
  caption?: string;
  originalPicture?: string;
  picture?: string;

  listing?: Listing;

  static tableName = "explore_picture";

  static get jsonSchema() {
    return {
      type: "object",
      required: ["listingId"],
      properties: {
        id: { type: "integer" },
        listingId: { type: "integer" },
        caption: { type: "string" },
        originalPicture: { type: "string" },
        picture: { type: "string" },
      },
    };
  }

  static get relationMappings() {
    return {
      listing: {
        relation: Model.BelongsToOneRelation,
        modelClass: Listing,
        join: {
          from: "explore_picture.listingId",
          to: "listing.id",
        },
      },
    };
  }
}

export default ExplorePictue;
