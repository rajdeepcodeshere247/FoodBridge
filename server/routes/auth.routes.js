const express = require('express');
const passport = require('passport');
const authController = require('../controllers/auth.controller');

const router = express.Router();
const hasGoogleOauthConfig = Boolean(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
);
const getClientUrl = (req) => req.app?.locals?.primaryClientUrl || 'https://food-b-ridge-demo.vercel.app';

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/google/status', (req, res) => res.json({ enabled: hasGoogleOauthConfig }));

router.get('/google', (req, res, next) => {
  if (!hasGoogleOauthConfig) {
    return res.status(503).json({ error: 'Google authentication is not configured on the server.' });
  }

  const requestedRedirect = req.query.redirect;
  req.session.postAuthRedirect = typeof requestedRedirect === 'string' && requestedRedirect.startsWith('/')
    ? requestedRedirect
    : '/dashboard';

  next();
}, passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  (req, res, next) => {
    if (!hasGoogleOauthConfig) {
      return res.status(503).json({ error: 'Google authentication is not configured on the server.' });
    }
    return next();
  },
  (req, res, next) => {
    const failureRedirect = `${getClientUrl(req)}/login?error=google_auth_failed`;
    return passport.authenticate('google', { failureRedirect })(req, res, next);
  },
  (req, res) => {
    const postAuthRedirect = req.session?.postAuthRedirect || '/dashboard';
    delete req.session.postAuthRedirect;
    res.redirect(`${getClientUrl(req)}${postAuthRedirect}`);
  }
);

router.post('/logout', authController.logout);
router.get('/logout', authController.logout);
router.get('/me', authController.getMe);

module.exports = router;
