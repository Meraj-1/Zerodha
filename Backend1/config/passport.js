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
        
        // Skip database operations completely - create user from Google profile
        const user = {
          _id: 'google_' + profile.id,
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          avatar: profile.photos[0].value,
          authProvider: "google",
          isGoogleConnected: true,
          balance: 0,
          role: 'user'
        };
        
        console.log('User created from Google profile successfully:', user._id);
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
        // Skip database lookup for Google OAuth users
        if (typeof id === 'string' && id.startsWith('google_')) {
            const user = {
                _id: id,
                isGoogleUser: true,
                balance: 0
            };
            done(null, user);
            return;
        }
        
        // For regular users, return minimal user object to avoid DB issues
        done(null, { _id: id, isTemp: true });
    } catch (error) {
        console.error('Deserialize user error:', error);
        done(null, { _id: id, isTemp: true });
    }
});

