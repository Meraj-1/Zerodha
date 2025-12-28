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
        await connectDB();
        
        let user = await User.findOne({ email: profile.emails[0].value });
        
        if (!user) {
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            avatar: profile.photos[0].value,
            authProvider: "google",
            isGoogleConnected: true,
            balance: 0,
            role: 'user'
          });
          console.log('New Google user created:', user._id);
        } else {
          user.googleId = profile.id;
          user.isGoogleConnected = true;
          user.avatar = profile.photos[0].value;
          await user.save();
          console.log('Existing user updated:', user._id);
        }
        
        done(null, user);
      } catch (error) {
        console.error('Google OAuth Strategy Error:', error);
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
    console.log('Serializing user:', user._id);
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        console.log('Deserializing user ID:', id);
        await connectDB();
        
        const user = await User.findById(id);
        if (user) {
            console.log('User found:', user._id);
            done(null, user);
        } else {
            console.log('User not found:', id);
            done(null, false);
        }
    } catch (error) {
        console.error('Deserialize user error:', error);
        done(error, null);
    }
});

