-- FUTURE SCHEMA (not required for V1)

-- REFERENCE ONLY — DO NOT RUN AGAINST PRODUCTION DB
-- Tables are created by initDb() in src/db.js

-- PostgreSQL schema + seed data for Barclay Salon booking backend
BEGIN;

-- Extensions (optional but useful)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('ADMIN', 'OWNER', 'HAIRDRESSER', 'CUSTOMER');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE appointment_status AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE request_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- =========================
-- Tables (Future "full" schema)
-- =========================

CREATE TABLE IF NOT EXISTS users (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role               user_role NOT NULL DEFAULT 'CUSTOMER',
  email              TEXT NOT NULL UNIQUE,
  password_hash      TEXT NOT NULL,
  first_name         TEXT,
  last_name          TEXT,
  phone              TEXT,
  is_active          BOOLEAN NOT NULL DEFAULT TRUE,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS services (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name               TEXT NOT NULL,
  category           TEXT NOT NULL,
  base_price_cents   INTEGER NOT NULL CHECK (base_price_cents >= 0),
  duration_minutes   INTEGER NOT NULL CHECK (duration_minutes > 0),
  is_active          BOOLEAN NOT NULL DEFAULT TRUE,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS availability (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hairdresser_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  day_of_week        SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sun ... 6=Sat
  start_minute       SMALLINT NOT NULL CHECK (start_minute BETWEEN 0 AND 1440),
  end_minute         SMALLINT NOT NULL CHECK (end_minute BETWEEN 0 AND 1440),
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT availability_time_order CHECK (end_minute > start_minute)
);

CREATE UNIQUE INDEX IF NOT EXISTS availability_unique
  ON availability(hairdresser_id, day_of_week, start_minute, end_minute);

CREATE TABLE IF NOT EXISTS time_off (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hairdresser_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  start_date         DATE NOT NULL,
  end_date           DATE NOT NULL,
  status             request_status NOT NULL DEFAULT 'PENDING',
  notes              TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT time_off_date_order CHECK (end_date >= start_date)
);

CREATE TABLE IF NOT EXISTS appointments (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id        UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  hairdresser_id     UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  service_id         UUID NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
  start_time         TIMESTAMPTZ NOT NULL,
  end_time           TIMESTAMPTZ NOT NULL,
  status             appointment_status NOT NULL DEFAULT 'PENDING',
  notes              TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT appt_time_order CHECK (end_time > start_time)
);

CREATE INDEX IF NOT EXISTS appointments_hairdresser_time_idx
  ON appointments(hairdresser_id, start_time, end_time);

CREATE INDEX IF NOT EXISTS appointments_customer_time_idx
  ON appointments(customer_id, start_time, end_time);

CREATE TABLE IF NOT EXISTS paystubs (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hairdresser_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  file_url           TEXT NOT NULL,
  period_start       DATE NOT NULL,
  period_end         DATE NOT NULL,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT paystub_period_order CHECK (period_end >= period_start)
);

-- =========================
-- V1 "Guest booking" tables (no logins needed yet)
-- Keeps your current API working without requiring users/hairdressers
-- =========================

CREATE TABLE IF NOT EXISTS customers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS guest_appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id INTEGER REFERENCES customers(id) ON DELETE SET NULL,
  service_id TEXT NOT NULL,
  service_name TEXT NOT NULL,
  datetime TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'requested',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_guest_appointments_datetime
  ON guest_appointments(datetime);

-- =========================
-- Seed: Services (prices in cents)
-- (safe to keep; used later when you switch service_id -> UUID)
-- =========================

INSERT INTO services (name, category, base_price_cents, duration_minutes)
VALUES
  ('Haircut - Buzz Cut (clippers)', 'Haircuts', 2900, 30),
  ('Haircut - Children/12', 'Haircuts', 3500, 30),
  ('Haircut - Clippers (some scissor work)', 'Haircuts', 4800, 45),
  ('Haircut - Extra Long (bottom of shoulder blade)', 'Haircuts', 7600, 75),
  ('Haircut - Long (collarbone to mid-back)', 'Haircuts', 7100, 60),
  ('Haircut - Medium (above collarbone)', 'Haircuts', 6600, 60),
  ('Haircut - Short (chin length or above)', 'Haircuts', 6100, 45),
  ('Shampoo / Blowout', 'Haircuts', 3600, 45),
  ('Full Foil Custom Blonding Service (31+ foils)', 'Color', 13300, 120),
  ('Partial Foil Custom Blonding Service (11-31 foils)', 'Color', 11200, 90),
  ('Full Balayage Custom Blonding Service', 'Color', 14000, 150),
  ('Partial Balayage Custom Blonding Service', 'Color', 12500, 120),
  ('Full Mesh Cap Custom Blonding Service', 'Color', 9400, 90),
  ('Partial Mesh Cap Custom Blonding Service', 'Color', 8000, 75),
  ('Permanent Color', 'Color', 8400, 90),
  ('Demi-Permanent Color', 'Color', 8400, 90),
  ('Men''s Camo Color', 'Color', 4800, 45),
  ('Bleach Retouch (per hour)', 'Color', 9300, 60),
  ('Color Correction (per hour)', 'Color', 9300, 60),
  ('Glaze', 'Color', 4500, 45),
  ('Brow Tint', 'Color', 2000, 15),
  ('Fashion Color', 'Color', 8800, 120),
  ('Full Perm', 'Texture', 9200, 120),
  ('Partial Perm', 'Texture', 7400, 90),
  ('Spiral Perm', 'Texture', 12900, 180),
  ('Straightening (per hour)', 'Texture', 9000, 60),
  ('Hair Extensions (consultation)', 'Texture', 0, 30),
  ('Brazilian Blowout', 'Texture', 29000, 180),
  ('Shot Phase Deep Conditioning Treatment', 'Treatments', 3000, 15),
  ('ABC Bonding Deep Treatment', 'Treatments', 3000, 15),
  ('Pre Art Treatment', 'Treatments', 1500, 10),
  ('Cat Treatment', 'Treatments', 1500, 10),
  ('Heat Treatment', 'Treatments', 3500, 20),
  ('Chin Wax', 'Waxing', 1500, 15),
  ('Brow Wax', 'Waxing', 2000, 15),
  ('Nose Wax', 'Waxing', 1500, 15),
  ('Lip Wax', 'Waxing', 1500, 15),
  ('Ear Wax', 'Waxing', 1500, 15),
  ('Custom Color & Glaze Pkg', 'Packages', 13300, 120),
  ('Full Foil Custom Pkg - Base Color & Glaze', 'Packages', 26800, 180),
  ('Partial Foil Custom Pkg - Base Color & Glaze', 'Packages', 24800, 165),
  ('Full Balayage Custom Pkg - Base Color & Glaze', 'Packages', 27800, 195),
  ('Partial Balayage Custom Pkg - Base Color & Glaze', 'Packages', 26300, 180),
  ('Full Mesh Cap Custom Pkg - Base Color & Glaze', 'Packages', 21600, 165),
  ('Special Shine Bomb Blowout (standalone glaze)', 'Packages', 8800, 60)
ON CONFLICT DO NOTHING;

COMMIT;
