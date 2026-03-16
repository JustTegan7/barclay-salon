// src/db.js
const { Pool } = require("pg");

const DATABASE_URL = process.env.DATABASE_URL;

const pool = DATABASE_URL
  ? new Pool({ connectionString: DATABASE_URL })
  : null;

async function query(text, params) {
  if (!pool) throw new Error("DATABASE_URL not set (DB disabled).");
  return pool.query(text, params);
}

async function initDb() {
  if (!pool) return;

  await query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

  // Users
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id                  SERIAL PRIMARY KEY,
      email               TEXT UNIQUE NOT NULL,
      password_hash       TEXT NOT NULL,
      role                TEXT NOT NULL DEFAULT 'HAIRDRESSER',
      is_active           BOOLEAN NOT NULL DEFAULT true,
      must_reset_password BOOLEAN NOT NULL DEFAULT false,
      display_name        TEXT,
      phone               TEXT,
      address             TEXT,
      created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  // Customers
  await query(`
    CREATE TABLE IF NOT EXISTS customers (
      id         SERIAL PRIMARY KEY,
      name       TEXT NOT NULL,
      email      TEXT,
      phone      TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  // Guest appointments
  await query(`
    CREATE TABLE IF NOT EXISTS guest_appointments (
      id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      customer_id      INTEGER REFERENCES customers(id) ON DELETE SET NULL,
      assigned_staff_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      service_id       TEXT NOT NULL,
      service_name     TEXT NOT NULL,
      datetime         TIMESTAMPTZ NOT NULL,
      status           TEXT NOT NULL DEFAULT 'requested',
      created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await query(`
    CREATE INDEX IF NOT EXISTS idx_guest_appointments_datetime
    ON guest_appointments(datetime);
  `);

  // Time-off requests
  await query(`
    CREATE TABLE IF NOT EXISTS time_off_requests (
      id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      start_date DATE NOT NULL,
      end_date   DATE NOT NULL,
      note       TEXT,
      status     TEXT NOT NULL DEFAULT 'pending',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}

module.exports = { pool, query, initDb };
