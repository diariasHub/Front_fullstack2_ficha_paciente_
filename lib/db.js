import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.warn('DATABASE_URL is not set. API routes will fail until it is configured.');
}

// Enable SSL by default for AWS RDS unless explicitly disabled
const sslEnabled = (process.env.PGSSLMODE || '').toLowerCase() !== 'disable';

export const pool = connectionString
  ? new Pool({ connectionString, ssl: sslEnabled ? { rejectUnauthorized: false } : false, connectionTimeoutMillis: 5000 })
  : null;

let initialized = false;
export async function ensureSchema() {
  if (!pool || initialized) return;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(`
      CREATE TABLE IF NOT EXISTS insumos (
        id SERIAL PRIMARY KEY,
        nombre TEXT NOT NULL,
        cantidad INTEGER NOT NULL DEFAULT 0
      );
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS consultas (
        id BIGSERIAL PRIMARY KEY,
        nombre TEXT,
        edad INTEGER,
        rut TEXT,
        carrera TEXT,
        telefono TEXT,
        motivo TEXT,
        tratamiento TEXT,
        fecha TEXT,
        hora TEXT,
        usuario TEXT,
        vitales JSONB,
        insumos JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
      );
    `);
    await client.query('COMMIT');
    initialized = true;
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Schema init failed', e);
  } finally {
    client.release();
  }
}
