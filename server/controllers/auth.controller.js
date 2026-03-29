const { createUser, findUserByEmail } = require('../../database/queries/user.queries');
const { hashPassword, verifyPassword } = require('../utils/password');

const toPublicUser = (user) => {
  if (!user) return null;
  const { password_hash: _passwordHash, ...publicUser } = user;
  return publicUser;
};

const register = async (req, res, next) => {
  try {
    const { name, email, password, role = 'donor' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
    }

    const existing = await findUserByEmail(email.toLowerCase());
    if (existing) {
      return res.status(409).json({ error: 'An account already exists for this email.' });
    }

    const user = await createUser({
      name: name.trim(),
      email: email.toLowerCase(),
      passwordHash: hashPassword(password),
      role
    });

    req.login(user, (err) => {
      if (err) {
        console.error('Session init failed after register:', err.message);
        return res.status(201).json({
          user: toPublicUser(user),
          session: { active: false, reason: 'session_unavailable' }
        });
      }
      return res.status(201).json({ user: toPublicUser(user), session: { active: true } });
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = await findUserByEmail(email.toLowerCase());
  const valid = user && verifyPassword(password, user.password_hash);

  if (!valid) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  req.login(user, (err) => {
    if (err) {
      console.error('Session init failed after login:', err.message);
      return res.json({
        user: toPublicUser(user),
        session: { active: false, reason: 'session_unavailable' }
      });
    }
    return res.json({ user: toPublicUser(user), session: { active: true } });
  });
};

const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.json({ success: true });
    });
  });
};

const getMe = async (req, res) => {
  res.json({ user: toPublicUser(req.user) });
};

module.exports = { register, login, logout, getMe };
