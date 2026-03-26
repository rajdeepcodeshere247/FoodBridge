// SQL queries for users table
// Usage: const { findUserByGoogleId } = require('./user.queries');
const pool = require('../../server/config/db.config');

const findUserByGoogleId = async (googleId) => {
  const result = await pool.query('SELECT * FROM users WHERE google_id = $1', [googleId]);
  return result.rows[0];
};

const createUser = async ({ googleId, name, email, avatarUrl, role = 'donor' }) => {
  const result = await pool.query(
    'INSERT INTO users (google_id, name, email, avatar_url, role) VALUES ($1,$2,$3,$4,$5) RETURNING *',
    [googleId, name, email, avatarUrl, role]
  );
  return result.rows[0];
};

const updateUser = async (id, fields) => {
  // TODO: Build dynamic SET clause
};

module.exports = { findUserByGoogleId, createUser, updateUser };
