const pool = require('../../server/config/db.config');

const findUserByGoogleId = async (googleId) => {
  const result = await pool.query('SELECT * FROM users WHERE google_id = $1', [googleId]);
  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

const findUserById = async (id) => {
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0];
};

const createUser = async ({
  googleId = null,
  name,
  email,
  passwordHash = null,
  avatarUrl = null,
  role = 'donor'
}) => {
  const result = await pool.query(
    `INSERT INTO users (google_id, name, email, password_hash, avatar_url, role)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [googleId, name, email, passwordHash, avatarUrl, role]
  );
  return result.rows[0];
};

const updateUser = async (id, fields) => {
  const allowed = {
    name: 'name',
    email: 'email',
    avatarUrl: 'avatar_url',
    role: 'role'
  };

  const updates = Object.entries(fields)
    .filter(([key, value]) => Object.prototype.hasOwnProperty.call(allowed, key) && value !== undefined);

  if (!updates.length) {
    return findUserById(id);
  }

  const setClause = updates.map(([key], idx) => `${allowed[key]} = $${idx + 2}`).join(', ');
  const values = [id, ...updates.map(([, value]) => value)];

  const result = await pool.query(
    `UPDATE users SET ${setClause} WHERE id = $1 RETURNING *`,
    values
  );

  return result.rows[0];
  };

module.exports = {
  findUserByGoogleId,
  findUserByEmail,
  findUserById,
  createUser,
  updateUser
};
