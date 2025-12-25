import dotenv from "dotenv";
dotenv.config();

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";
import { connectDB } from "../utils/db.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://kitebackend.vercel.app/auth/google/callback",
      scope: ['profile', 'email']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('Google OAuth Profile:', profile.emails[0].value);
        
        // Connect to database for this request
        await connectDB();
        
        // Simple user lookup
        let user = await User.findOne({ email: profile.emails[0].value }).lean();

        if (user) {
          console.log('Existing user found, updating...');
          // Update existing user
          user = await User.findByIdAndUpdate(user._id, {
            googleId: profile.id,
            isGoogleConnected: true,
            avatar: profile.photos[0].value
          }, { new: true }).lean();
        } else {
          console.log('Creating new user...');
          // Create new user
          const newUser = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            avatar: profile.photos[0].value,
            authProvider: "google",
            isGoogleConnected: true
          });
          user = newUser.toObject();
        }
        console.log('User processed successfully:', user._id);
        done(null, user);
      } catch (error) {
        console.error('Google OAuth Strategy Error:', error);
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        await connectDB();
        const user = await User.findById(id).lean();
        done(null, user);
    } catch (error) {
        console.error('Deserialize user error:', error);
        done(error, null);
    }
});

