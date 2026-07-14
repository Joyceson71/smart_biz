# SmartBiz Migration Rules

This project uses **hand-written SQL migrations** executed via the Supabase Dashboard SQL Editor or a migration runner. There is no ORM — all database access goes through the Supabase JS client.

## File Naming

```
supabase/migrations/NNNNN_description.sql
```

Files are applied in ascending numeric order. Once a migration file is merged to `main` and applied to production, **it must never be modified**.

## Safety Rules

1. **No `DROP TABLE` in production migrations.** If a table truly needs to be dropped, it must live in a file named `NNNNN_destructive_<description>.sql` and must be explicitly reviewed and approved before being applied to any environment.

2. **No `DROP COLUMN` or `TRUNCATE` in regular migrations.** Follow the same `_destructive_` naming rule.

3. **All `CREATE TABLE` statements must use `IF NOT EXISTS`.**

4. **All `ALTER TABLE ... ADD COLUMN` statements must use `IF NOT EXISTS`.**

5. **All policy creation must be wrapped in a `DO $$ BEGIN IF NOT EXISTS ... END $$;` block** to be safe on re-run.

6. **No migration may rely on application-layer logic.** SQL migrations run directly against the database, not through the ORM.

## Current Migrations

| File | Description |
|------|-------------|
| `00001_init.sql` | Initial `customers` and `invoices` tables with RLS |
| `00002_products_employees.sql` | `products` and `employees` tables with 3D position columns |
| `00003_advanced_inventory_invoicing.sql` | `categories`, `suppliers`, `warehouses`, `invoice_items`, `payments`, `inventory_transactions` tables; alters `products` and `invoices` with advanced columns |
