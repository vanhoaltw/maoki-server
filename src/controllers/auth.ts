import { AuthenticationError } from "apollo-server-express";
import { Application } from "express";
import got from "got";
import moment from "moment";
import { SocialConnect, User } from "../models";

import { takeRight, uniq } from "lodash";
import { OAuth2Client } from "google-auth-library";

import env from "@/configs/config";
import { IndentifyVerificationType } from "@/generated/graphql";

const googleClient = new OAuth2Client(
  env.google.clientId,
  env.google.clientSecret,
  "postmessage"
);

const processLogin = async (user: User) => {
  const sid = Number(moment().unix());
  const activeLogin = takeRight(uniq([...(user.sids || []), sid]), 10); // keep 10 last login

  const finalUser = await user.$query().patchAndFetch({
    sids: activeLogin,
  });

  return finalUser.toJsonWithToken(sid);
};

const oauth = (app: Application) => {
  app.post("/auth/facebook", async (req, res) => {
    const { token } = req.body || {};
    const parsedRes = await got
      .post("https://graph.facebook.com/me", {
        searchParams: {
          access_token: token,
          fields:
            "id,email,birthday,gender,name,first_name,last_name,picture.height(480),link",
        },
      })
      .json<any>();

    if (!parsedRes.email) {
      throw new AuthenticationError(
        "No email address found from this account! Please use other login method"
      );
    }

    const fbProfile = {
      email: parsedRes.email,
      emailVerified: !!parsedRes.email,
      username: `fb_${String(parsedRes.id).substring(0, 20)}`,
      firstName: parsedRes.first_name,
      lastName: parsedRes.last_name,
      gender: parsedRes.gender,
      birthday: parsedRes.birthday
        ? moment.utc(parsedRes.birthday, "MM/DD/YYYY").toDate()
        : null,
      avatar: `https://graph.facebook.com/${parsedRes.id}/picture?height=480&width=480`,
    };

    const userProvider = await SocialConnect.query()
      .withGraphFetched("user")
      .findOne({
        provider: "facebook",
        providerToken: parsedRes.id,
      });

    let user = userProvider.user;

    if (!userProvider) {
      await SocialConnect.query().insert({
        userId: user.id,
        provider: "facebook",
        providerToken: parsedRes.id,
      });
    }

    if (!user) {
      user = await User.query().insertGraph(fbProfile);
    }

    console.log({ user });

    return res
      .status(200)
      .json({ success: true, token: processLogin(user), user });
  });

  app.post("/auth/google", async (req, res) => {
    const { code } = req.body || {};
    try {
      if (!code) throw new AuthenticationError("INVALID_TOKEN");
      const { tokens } = await googleClient.getToken(code);

      const idToken = tokens.id_token;
      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: env.google.clientId,
      });

      const payload = ticket.getPayload();

      const profile = {
        email: payload.email,
        identityVerificationTypes: payload.email_verified
          ? [IndentifyVerificationType.Email]
          : [],
        username: `gg_${String(payload.sub).substring(0, 20)}`,
        passwordHash: payload.sub,
        firstName: payload?.given_name,
        lastName: payload?.family_name,
        avatar: payload.picture,
        lastActivedAt: moment().toISOString(),
      };

      const userProvider = await SocialConnect.query()
        .withGraphFetched("user")
        .findOne({
          provider: "google",
          providerToken: payload.sub,
        });

      let user = userProvider?.user;

      if (!user) {
        user = await User.query().insertGraph(profile);
      }

      if (!userProvider) {
        await SocialConnect.query().insert({
          userId: user?.id,
          provider: "google",
          providerToken: payload.sub,
        });
      }

      return res
        .status(200)
        .json({ success: true, token: await processLogin(user), user });
    } catch (error) {
      console.log({ error });
      res
        .status(401)
        .json({ success: false, code: 401, message: error?.message });
    }
  });
};

export { oauth };
