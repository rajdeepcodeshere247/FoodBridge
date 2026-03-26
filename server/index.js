require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const session = require('express-session');
const passport = require('passport');

// TODO: Import routes
// const authRoutes = require('./routes/auth.routes');
// const foodRoutes = require('./routes/food.routes');
// const userRoutes = require('./routes/user.routes');
// const deliveryRoutes = require('./routes/delivery.routes');

// TODO: Import passport config
// require('./config/passport.config');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ────────────────────────────────────
app.use(helmet());
app.use(morgan('dev'));
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production', maxAge: 24 * 60 * 60 * 1000 }
}));
app.use(passport.initialize());
app.use(passport.session());

// ─── Routes ───────────────────────────────────────
// TODO: Mount routes
// app.use('/api/auth', authRoutes);
// app.use('/api/food', foodRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/deliveries', deliveryRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'FoodBridge API is running 🚀' });
});

// ─── Start Server ──────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
