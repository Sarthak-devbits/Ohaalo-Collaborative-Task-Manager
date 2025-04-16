import passport from 'passport';
import { Strategy as GoogleStrategyGoogle } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

passport.use(
  new GoogleStrategyGoogle(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: 'http://localhost:3000/api/auth/googleRedirect',
    },
    async (accessToken, refreshToken, profile, done) => {
      done(null, profile);
    }
  )
);

export default passport;
