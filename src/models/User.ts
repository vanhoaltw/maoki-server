import { Model } from "objection";
import BaseModel from "./Base";
import SocialConnect from "./SocialConnect";

import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";
import moment from "moment";
import config from "@/configs/config";

class User extends BaseModel {
  firstName?: string;
  lastName: string;
  username: string;
  email: string;
  identityVerificationTypes?: string[];
  birthday?: Date;
  passwordHash?: string;
  bio?: string;
  titleText?: string;
  gender?: string;
  avatar?: string;
  favoriteSong?: string;
  work?: string;
  school?: string;
  location?: string;
  managedListingsTotalCount?: number;
  guestType?: string;
  isAvailable?: boolean;
  isSuperhost?: boolean;
  completeOnboarding?: boolean;
  lastActivedAt?: string;
  registeredAt?: Date;

  provider?: SocialConnect;

  sids?: number[];
  sid?: number;

  static tableName = "user";

  static get jsonSchema() {
    return {
      type: "object",
      required: ["email", "username"],
      properties: {
        id: { type: "integer" },
        firstName: { type: "string" },
        lastName: { type: "string" },
        identityVerificationTypes: {
          type: "array",
          items: { type: "string" },
        },
        username: { type: "string" },
        email: { type: "string" },
        bio: { type: "string" },
        gender: { type: "string" },
        avatar: { type: "string" },
        address: { type: "string" },
        isAvailable: { type: "boolean", default: false },
        completeOnboarding: { type: "boolean", default: false },
        lastActivedAt: { type: ["null", "string"], format: "date-time" },
      },
    };
  }

  static get relationMappings() {
    return {
      provider: {
        relation: Model.HasManyRelation,
        modelClass: SocialConnect,
        join: {
          from: "user.id",
          to: "social_connect.userId",
        },
      },
    };
  }

  get $secureFields(): string[] {
    return ["passwordHash"];
  }

  static comparePassword(input: string, password: string) {
    return bcrypt.compareSync(input, password);
  }

  toJsonWithToken(sid: number): string {
    const token = jwt.sign(
      {
        id: this.id,
        at: moment().format("YYYYMMDDHHmmss"),
        sid: sid,
      },
      config.jwtSecret
    );

    return token;
  }

  static decodeToken(token: string): Record<string, any> {
    try {
      const decoded = jwt.verify(token, config.jwtSecret);
      return decoded as Record<string, any>;
    } catch (err) {
      if (err instanceof Error) {
        throw err;
      }
    }
  }
}

export default User;
