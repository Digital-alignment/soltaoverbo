const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'full_schema_migration.sql');
let sql = fs.readFileSync(filePath, 'utf8');

// Replace CREATE POLICY "policy_name" ON table_name with DROP POLICY IF EXISTS first
sql = sql.replace(/CREATE\s+POLICY\s+"([^"]+)"\s+ON\s+(?:public\.)?([a-zA-Z0-9_]+)/gi, (match, policyName, tableName) => {
  return `DROP POLICY IF EXISTS "${policyName}" ON ${tableName};\n${match}`;
});

// Also handle unquoted policy names if any: CREATE POLICY policy_name ON table_name
sql = sql.replace(/CREATE\s+POLICY\s+([a-zA-Z0-9_]+)\s+ON\s+(?:public\.)?([a-zA-Z0-9_]+)/gi, (match, policyName, tableName) => {
  if (policyName.toUpperCase() === 'IF') return match;
  return `DROP POLICY IF EXISTS ${policyName} ON ${tableName};\n${match}`;
});

fs.writeFileSync(filePath, sql, 'utf8');
console.log('Successfully sanitized full_schema_migration.sql with DROP POLICY IF EXISTS!');
