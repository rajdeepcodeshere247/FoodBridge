require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const session = require('express-session');
const passport = require('passport');
const connectPgSimple = require('connect-pg-simple');
const pool = require('./config/db.config');

const authRoutes = require('./routes/auth.routes');
const foodRoutes = require('./routes/food.routes');
const errorHandler = require('./middleware/error.middleware');
require('./config/passport.config');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const clientUrlList = (process.env.CLIENT_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const normalizeOrigin = (origin) => {
  try {
    return new URL(origin).origin;
  } catch {
    return null;
  }
};
const defaultAllowedOrigins = [
  'http://localhost:3000',
  'https://food-b-ridge-demo.vercel.app'
];
const configuredOrigins = clientUrlList.map(normalizeOrigin).filter(Boolean);
const primaryClientUrl = configuredOrigins[0] || defaultAllowedOrigins[1];

app.use(helmet());
app.use(morgan('dev'));
app.set('trust proxy', 1);
app.use(cors({
  origin: true,
  credentials: false
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.locals.primaryClientUrl = primaryClientUrl;
const PgSession = connectPgSimple(session);
app.use(session({
  store: new PgSession({
    pool,
    tableName: 'user_sessions',
    createTableIfMissing: true
  }),
  secret: process.env.SESSION_SECRET || 'dev_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/foods', foodRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'FoodBridge API is running 🚀' });
});

app.use(errorHandler);

const verifyDatabaseConnection = async () => {
  await pool.query('SELECT 1');
};

app.get('/api/health/db', async (req, res, next) => {
  try {
    await verifyDatabaseConnection();
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    next(error);
  }
});

const startServer = async () => {
  try {
    await verifyDatabaseConnection();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to PostgreSQL. Check DATABASE_URL and DB availability.');
    console.error(error.message);
    process.exit(1);
  }
};

if (!process.env.VERCEL && require.main === module) {
  startServer();
}

module.exports = app;
