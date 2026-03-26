// Google OAuth 2.0 — Passport.js strategy
// Docs: http://www.passportjs.org/packages/passport-google-oauth20/
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const pool = require('./db.config');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // TODO: Find or create user in DB using profile.id, profile.displayName, profile.emails[0].value
      return done(null, profile);
    } catch (err) {
      return done(err, null);
    }
  }
));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  // TODO: Fetch full user object from DB by id
  done(null, { id });
});

module.exports = passport;
