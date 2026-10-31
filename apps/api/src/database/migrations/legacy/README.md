# Legacy migrations

These migrations were written against a database that already had the base
schema (they only contain `ALTER TABLE` statements), and some of them add the
same columns more than once. They cannot be executed against a fresh database.

The full schema is now created by `1769400000000-InitialSchema.ts`. These files
are kept for historical reference only and are intentionally excluded from the
data source glob (`src/database/migrations/*.ts`).
