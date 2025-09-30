// Load .env.local and verify PostgreSQL connectivity (CommonJS)
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
const { Pool } = require('pg');
const { URL } = require('url');

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL not set');
  process.exit(1);
}

const sslEnabled = (process.env.PGSSLMODE || '').toLowerCase() !== 'disable';
const connectionTimeoutMillis = Number(process.env.DB_CONNECT_TIMEOUT || 5000);
const pool = new Pool({ connectionString, ssl: sslEnabled ? { rejectUnauthorized: false } : false, connectionTimeoutMillis });

async function createDatabaseIfMissing(err) {
  // Postgres error code for invalid_catalog_name (database does not exist)
  if (!err || err.code !== '3D000') return false;
  const u = new URL(connectionString);
  const targetDb = (u.pathname || '').replace(/^\//, '');
  if (!targetDb) return false;
  // Build admin URL to default 'postgres' database
  const adminUrl = new URL(connectionString);
  adminUrl.pathname = '/postgres';
  const adminPool = new Pool({ connectionString: adminUrl.toString(), ssl: sslEnabled ? { rejectUnauthorized: false } : false, connectionTimeoutMillis });
  try {
    const client = await adminPool.connect();
    try {
      // Basic sanitization for identifier (allow letters, numbers, underscore, dash)
      if (!/^[A-Za-z0-9_-]+$/.test(targetDb)) throw new Error('Invalid database name');
      await client.query(`CREATE DATABASE "${targetDb}"`);
      console.log(`Database '${targetDb}' created.`);
      return true;
    } finally {
      client.release();
      await adminPool.end();
    }
  } catch (e) {
    console.error('Failed to create database:', e.message);
    return false;
  }
}

async function ensureSchemaOnPool(p) {
  const client = await p.connect();
  try {
    const now = await client.query('SELECT NOW() as now');
    console.log('DB connected. NOW =', now.rows[0].now);
    await client.query('CREATE TABLE IF NOT EXISTS insumos (id SERIAL PRIMARY KEY, nombre TEXT NOT NULL, cantidad INTEGER NOT NULL DEFAULT 0)');
    await client.query('CREATE TABLE IF NOT EXISTS consultas (id BIGSERIAL PRIMARY KEY, nombre TEXT, edad INTEGER, rut TEXT, carrera TEXT, telefono TEXT, motivo TEXT, tratamiento TEXT, fecha TEXT, hora TEXT, usuario TEXT, vitales JSONB, insumos JSONB, created_at TIMESTAMP WITH TIME ZONE DEFAULT now())');
    console.log('Schema ensured.');
  } finally {
    client.release();
  }
}

async function main() {
  try {
    await ensureSchemaOnPool(pool);
  } catch (e) {
    if (await createDatabaseIfMissing(e)) {
      // Recreate pool to the originally intended database
      const retryPool = new Pool({ connectionString, ssl: sslEnabled ? { rejectUnauthorized: false } : false, connectionTimeoutMillis });
      try {
        await ensureSchemaOnPool(retryPool);
      } finally {
        await retryPool.end();
      }
      return;
    }
    throw e;
  } finally {
    await pool.end();
  }
}

main().catch((e) => { console.error('DB check error:', e.message); process.exit(1); });
