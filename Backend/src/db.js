// src/db.js
const { Pool } = require("pg");

const DATABASE_URL = process.env.DATABASE_URL;

// If DATABASE_URL isn't set, we run in memory mode (server still works, but no persistence)
const pool = DATABASE_URL
  ? new Pool({
      connectionString: DATABASE_URL,
      // ssl: { rejectUnauthorized: false }, // enable when deploying to providers that require SSL
    })
  : null;

async function query(text, params) {
  if (!pool) throw new Error("DATABASE_URL not set (DB disabled).");
  return pool.query(text, params);
}

/**
 * Minimal V1 persistence tables:
 * - customers
 * - guest_appointments
 *
 * IMPORTANT:
 * Your sql/schema.sql contains a much larger “future schema”.
 * This initDb is intentionally small so booking works NOW without logins.
 */
async function initDb() {
  if (!pool) return;

  // Helpful extension for UUID generation if you use DEFAULT uuid_generate_v4()
  await query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

  await query(`
    CREATE TABLE IF NOT EXISTS customers (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS guest_appointments (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      customer_id INTEGER REFERENCES customers(id) ON DELETE SET NULL,
      service_id TEXT NOT NULL,
      service_name TEXT NOT NULL,
      datetime TIMESTAMPTZ NOT NULL,
      status TEXT NOT NULL DEFAULT 'requested',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await query(`
    CREATE INDEX IF NOT EXISTS idx_guest_appointments_datetime
    ON guest_appointments(datetime);
  `);
}

module.exports = { pool, query, initDb };
