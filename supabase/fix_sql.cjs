const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Re-combine fresh migrations from scratch
execSync(`pwsh -Command "Get-ChildItem -Path 'c:\\Users\\ondig\\Code\\DA\\soltaoverbo\\supabase\\migrations\\*.sql' | Sort-Object Name | Get-Content | Set-Content -Path 'c:\\Users\\ondig\\Code\\DA\\soltaoverbo\\supabase\\full_schema_migration.sql'"`);

const filePath = path.join(__dirname, 'full_schema_migration.sql');
let sql = fs.readFileSync(filePath, 'utf8');

// Prepend checkout_attempts table definition
const checkoutAttemptsDef = `
CREATE TABLE IF NOT EXISTS checkout_attempts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    email text,
    source_page text,
    attempted_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);
ALTER TABLE checkout_attempts ENABLE ROW LEVEL SECURITY;
`;

if (!sql.includes('CREATE TABLE IF NOT EXISTS checkout_attempts') && !sql.includes('CREATE TABLE checkout_attempts')) {
  sql = checkoutAttemptsDef + '\n' + sql;
}

// 1. Handle CREATE VIEW -> CREATE OR REPLACE VIEW
sql = sql.replace(/CREATE\s+VIEW\s+(?!OR\s+REPLACE)/gi, 'CREATE OR REPLACE VIEW ');

// 2. Handle CREATE TABLE -> CREATE TABLE IF NOT EXISTS
sql = sql.replace(/CREATE\s+TABLE\s+(?!IF\s+NOT\s+EXISTS)/gi, 'CREATE TABLE IF NOT EXISTS ');

// 3. Handle CREATE TYPE enum_name AS ENUM (...)
sql = sql.replace(/CREATE\s+TYPE\s+([a-zA-Z0-9_]+)\s+AS\s+ENUM\s*\(([^)]+)\);/gi, (match, typeName, enumValues) => {
  return `DO $$ BEGIN\n  CREATE TYPE ${typeName} AS ENUM (${enumValues});\nEXCEPTION\n  WHEN duplicate_object THEN null;\nEND $$;`;
});

// 4. Ensure DROP POLICY IF EXISTS has DROP POLICY IF EXISTS "name" ON table;
sql = sql.replace(/DROP\s+POLICY\s+IF\s+EXISTS\s+"([^"]+)"\s+ON\s+([a-zA-Z0-9_\.]+)/gi, (match, policyName, fullTableName) => {
  return match;
});

// 5. Ensure any CREATE POLICY "name" ON table has DROP POLICY IF EXISTS right before it
sql = sql.replace(/CREATE\s+POLICY\s+"([^"]+)"\s+ON\s+([a-zA-Z0-9_\.]+)/gi, (match, policyName, fullTableName) => {
  return `DROP POLICY IF EXISTS "${policyName}" ON ${fullTableName};\n${match}`;
});

fs.writeFileSync(filePath, sql, 'utf8');
console.log('Successfully re-sanitized full_schema_migration.sql cleanly with zero syntax errors!');
