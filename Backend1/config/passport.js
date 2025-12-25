import dotenv from "dotenv";
dotenv.config();

import passport from "passport";
// const GoogleStrategy = require("passport-google-oauth20").Strategy;
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://kitebackend.vercel.app/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // First check by email
        let user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          // Update existing user with Google info
          user.googleId = profile.id;
          user.isGoogleConnected = true;
          // Always update avatar from Google
          user.avatar = profile.photos[0].value;
          await user.save();
        } else {
          // Create new user
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            avatar: profile.photos[0].value,
            authProvider: "google",
            isGoogleConnected: true
          });
        }
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});

