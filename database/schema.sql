-- ============================================================
-- FoodBridge Database Schema
-- Run this file first to set up all tables
-- ============================================================

-- Enable uuid support (optional)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Users ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id          SERIAL PRIMARY KEY,
  google_id   VARCHAR(255) UNIQUE,
  name        VARCHAR(255) NOT NULL,
  email       VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT,
  avatar_url  TEXT,
  role        VARCHAR(50) DEFAULT 'donor' CHECK (role IN ('donor', 'volunteer', 'ngo', 'admin')),
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── Food Listings ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS food_listings (
  id               SERIAL PRIMARY KEY,
  donor_id         INTEGER REFERENCES users(id) ON DELETE SET NULL,
  title            VARCHAR(255) NOT NULL,
  description      TEXT,
  quantity         VARCHAR(100) NOT NULL,           -- e.g., "20 plates", "5kg"
  food_type        VARCHAR(100),                    -- e.g., "cooked", "raw", "packaged"
  expiry_time      TIMESTAMP NOT NULL,
  image_url        TEXT,
  quality_status   VARCHAR(50) CHECK (quality_status IN ('fresh', 'moderate', 'spoiled')),
  quality_confidence DECIMAL(4,2),                 -- 0.00 to 1.00
  latitude         DECIMAL(9,6) NOT NULL,
  longitude        DECIMAL(9,6) NOT NULL,
  address          TEXT,
  status           VARCHAR(50) DEFAULT 'available' CHECK (status IN ('available', 'claimed', 'delivered', 'expired')),
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── Deliveries ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS deliveries (
  id              SERIAL PRIMARY KEY,
  food_id         INTEGER REFERENCES food_listings(id) ON DELETE CASCADE,
  volunteer_id    INTEGER REFERENCES users(id) ON DELETE SET NULL,
  recipient_id    INTEGER REFERENCES users(id) ON DELETE SET NULL, -- NGO or individual
  status          VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'picked_up', 'delivered', 'cancelled')),
  notes           TEXT,
  claimed_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  delivered_at    TIMESTAMP
);


-- ─── Monetary Donations ──────────────────────────────
CREATE TABLE IF NOT EXISTS donations (
  id                SERIAL PRIMARY KEY,
  donor_name        VARCHAR(255) NOT NULL,
  donor_email       VARCHAR(255) NOT NULL,
  amount            DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  currency          VARCHAR(10) DEFAULT 'INR',
  message           TEXT,
  payment_gateway   VARCHAR(50) DEFAULT 'razorpay',
  payment_method    VARCHAR(50),
  payment_order_id  VARCHAR(255),
  payment_id        VARCHAR(255),
  payment_status    VARCHAR(50) DEFAULT 'created' CHECK (payment_status IN ('created', 'pending', 'paid', 'failed')),
  paid_at           TIMESTAMP,
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── Session Store (express-session + connect-pg-simple) ──
CREATE TABLE IF NOT EXISTS user_sessions (
  sid       varchar NOT NULL COLLATE "default",
  sess      json NOT NULL,
  expire    timestamp(6) NOT NULL
) WITH (OIDS=FALSE);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'user_sessions_pkey'
  ) THEN
    ALTER TABLE user_sessions ADD CONSTRAINT user_sessions_pkey PRIMARY KEY (sid);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS IDX_user_sessions_expire ON user_sessions (expire);

-- ─── Indexes ──────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_food_status ON food_listings(status);
CREATE INDEX IF NOT EXISTS idx_food_donor ON food_listings(donor_id);
CREATE INDEX IF NOT EXISTS idx_food_location ON food_listings(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_delivery_volunteer ON deliveries(volunteer_id);
CREATE INDEX IF NOT EXISTS idx_delivery_food ON deliveries(food_id);
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(payment_status);
