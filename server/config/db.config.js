// PostgreSQL connection pool
// Docs: https://node-postgres.com/features/pooling
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // OR individual fields (uncomment if not using DATABASE_URL):
  // host: process.env.PGHOST,
  // port: process.env.PGPORT,
  // database: process.env.PGDATABASE,
  // user: process.env.PGUSER,
  // password: process.env.PGPASSWORD,
});

pool.on('connect', () => console.log('✅ Connected to PostgreSQL'));
pool.on('error', (err) => console.error('❌ Database error:', err));

module.exports = pool;
