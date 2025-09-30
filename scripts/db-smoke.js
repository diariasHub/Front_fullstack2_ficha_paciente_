// Quick DB smoke test using pg Pool and .env.local
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
const { Pool } = require('pg');

(async () => {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error('Missing DATABASE_URL');
  const sslEnabled = (process.env.PGSSLMODE || '').toLowerCase() !== 'disable';
  const connectionTimeoutMillis = Number(process.env.DB_CONNECT_TIMEOUT || 5000);
  const pool = new Pool({ connectionString, ssl: sslEnabled ? { rejectUnauthorized: false } : false, connectionTimeoutMillis });
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('CREATE TABLE IF NOT EXISTS insumos (id SERIAL PRIMARY KEY, nombre TEXT NOT NULL, cantidad INTEGER NOT NULL DEFAULT 0)');
    await client.query('CREATE TABLE IF NOT EXISTS consultas (id BIGSERIAL PRIMARY KEY, nombre TEXT, edad INTEGER, rut TEXT, carrera TEXT, telefono TEXT, motivo TEXT, tratamiento TEXT, fecha TEXT, hora TEXT, usuario TEXT, vitales JSONB, insumos JSONB, created_at TIMESTAMP WITH TIME ZONE DEFAULT now())');
    const ins = await client.query('INSERT INTO insumos (nombre, cantidad) VALUES ($1,$2) RETURNING id,nombre,cantidad', ['Test-Item', 5]);
    const sel = await client.query('SELECT id,nombre,cantidad FROM insumos ORDER BY id DESC LIMIT 3');
    const cons = await client.query("INSERT INTO consultas (nombre,motivo,fecha,hora,usuario,vitales,insumos) VALUES ('Smoke','Check','2025-09-30','12:00','admin','[]','[]') RETURNING id");
    await client.query('COMMIT');
    console.log('Smoke OK:', { insertedInsumo: ins.rows[0], lastInsumos: sel.rows, consultaId: cons.rows[0].id });
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Smoke failed:', e.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
})();
