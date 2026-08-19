import postgres from 'postgres';
import fs from 'fs';
import path from 'path';

// NOTE: postgres devDep is intentional — used only by this script.
// Run: npm install postgres --save-dev --legacy-peer-deps
// For one-off migrations, prefer the Supabase dashboard SQL editor.

const migrationsDir = path.join(process.cwd(), 'supabase', 'migrations');
const files = fs.readdirSync(migrationsDir)
  .filter(f => f.endsWith('.sql'))
  .sort();

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });

async function main() {
  for (const file of files) {
    const filePath = path.join(migrationsDir, file);
    const sqlText = fs.readFileSync(filePath, 'utf-8');
    try {
      console.log(`Running ${file}...`);
      await sql.unsafe(sqlText);
      console.log(`✓ ${file}`);
    } catch (err) {
      console.error(`✗ ${file}:`, err.message);
      // Continue — all migrations are idempotent
    }
  }
  await sql.end();
}

main();
