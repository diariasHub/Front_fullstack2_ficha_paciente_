// Load .env.local and verify PostgreSQL connectivity (CommonJS)
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL not set');
  process.exit(1);
}

const sslEnabled = (process.env.PGSSLMODE || '').toLowerCase() !== 'disable';
const pool = new Pool({ connectionString, ssl: sslEnabled ? { rejectUnauthorized: false } : false, connectionTimeoutMillis: 5000 });

async function main() {
  const client = await pool.connect();
  try {
    const now = await client.query('SELECT NOW() as now');
    console.log('DB connected. NOW =', now.rows[0].now);
    // quick table existence check
    await client.query('CREATE TABLE IF NOT EXISTS insumos (id SERIAL PRIMARY KEY, nombre TEXT NOT NULL, cantidad INTEGER NOT NULL DEFAULT 0)');
    await client.query('CREATE TABLE IF NOT EXISTS consultas (id BIGSERIAL PRIMARY KEY, nombre TEXT, edad INTEGER, rut TEXT, carrera TEXT, telefono TEXT, motivo TEXT, tratamiento TEXT, fecha TEXT, hora TEXT, usuario TEXT, vitales JSONB, insumos JSONB, created_at TIMESTAMP WITH TIME ZONE DEFAULT now())');
    console.log('Schema ensured.');
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((e) => { console.error('DB check error:', e.message); process.exit(1); });
