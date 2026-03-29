// PostgreSQL connection pool
// Docs: https://node-postgres.com/features/pooling
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;
const usesSslModeInUrl = typeof connectionString === 'string' && /sslmode=/i.test(connectionString);
const shouldEnableSsl = process.env.NODE_ENV === 'production' || usesSslModeInUrl;

const poolConfig = {
  connectionString,
  // OR individual fields (uncomment if not using DATABASE_URL):
  // host: process.env.PGHOST,
  // port: process.env.PGPORT,
  // database: process.env.PGDATABASE,
  // user: process.env.PGUSER,
  // password: process.env.PGPASSWORD,
};

if (shouldEnableSsl) {
  poolConfig.ssl = {
    rejectUnauthorized: process.env.PG_SSL_REJECT_UNAUTHORIZED === 'true'
  };
}

const pool = new Pool(poolConfig);

pool.on('connect', () => console.log('✅ Connected to PostgreSQL'));
pool.on('error', (err) => console.error('❌ Database error:', err));

module.exports = pool;
