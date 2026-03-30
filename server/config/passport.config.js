const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { findUserByGoogleId, createUser, findUserById } = require('../../database/queries/user.queries');

const resolveGoogleCallbackUrl = () => {
  if (process.env.GOOGLE_CALLBACK_URL) return process.env.GOOGLE_CALLBACK_URL;

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}/api/auth/google/callback`;
  }

  const port = process.env.PORT || '5000';
  return `http://localhost:${port}/api/auth/google/callback`;
};

const hasGoogleOauthConfig = Boolean(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
);

if (hasGoogleOauthConfig) {
  const callbackURL = resolveGoogleCallbackUrl();

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const googleId = profile.id;
      const email = profile.emails?.[0]?.value;
      const avatarUrl = profile.photos?.[0]?.value || null;
      const name = profile.displayName || email || 'FoodBridge User';

      if (!googleId || !email) {
        return done(new Error('Google account is missing required profile fields.'), null);
      }

      let user = await findUserByGoogleId(googleId);

      if (!user) {
        user = await createUser({
          googleId,
          name,
          email,
          avatarUrl,
          role: 'donor'
        });
      }

      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }));
}

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await findUserById(id);
    done(null, user || null);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
