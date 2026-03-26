// Authentication routes — Google OAuth flow
const express = require('express');
const router = express.Router();
const passport = require('passport');
// const authController = require('../controllers/auth.controller');

// GET /api/auth/google — Redirect to Google login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// GET /api/auth/google/callback — Google redirects here after login
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => res.redirect(process.env.CLIENT_URL + '/dashboard')
);

// GET /api/auth/logout
router.get('/logout', (req, res) => {
  req.logout(() => res.redirect(process.env.CLIENT_URL));
});

// GET /api/auth/me — Get current logged-in user
router.get('/me', (req, res) => {
  // TODO: return req.user from session
  res.json({ user: req.user || null });
});

module.exports = router;
