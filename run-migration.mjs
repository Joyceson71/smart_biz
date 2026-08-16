import postgres from 'postgres';
// NOTE: This script requires `postgres` to be installed locally.
// Run: npm install postgres --save-dev --legacy-peer-deps
// It is intentionally excluded from the default devDependencies.
// Use the Supabase dashboard SQL editor for one-off migrations instead.

import fs from 'fs';
import path from 'path';

const sqlText = fs.readFileSync(path.join(process.cwd(), 'supabase', 'migrations', '00003_advanced_inventory_invoicing.sql'), 'utf-8');

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });

async function main() {
  try {
    console.log("Running migration...");
    // Split by semicolons and run queries one by one or run as a single string
    // postgres.js handles multiple queries in one string if used carefully, or we can use sql.unsafe
    await sql.unsafe(sqlText);
    console.log("Migration executed successfully.");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await sql.end();
  }
}

main();
