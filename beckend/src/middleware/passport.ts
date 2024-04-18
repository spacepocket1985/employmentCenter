import mongoose from "mongoose";

import { Strategy, ExtractJwt } from "passport-jwt";

import keys from "../config/keys";

interface Passport {
  use(strategy: Strategy): void;
}

const User = mongoose.model("User");

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: keys.jwt,
};

export const MyPassport = (passport: Passport): void => {
  passport.use(
    new Strategy(options, async (payload, done) => {
      try {
        const user = await User.findById(payload.userId).select("name id");

        if (user) {
          done(null, user);
        } else {
          done(null, false);
        }
      } catch (error) {
        console.log(error);
      }
    })
  );
};
