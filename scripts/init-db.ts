/**
 * Crea el archivo SQLite local y aplica el esquema (prisma/migrations/0_init/migration.sql)
 * usando better-sqlite3 directamente.
 *
 * Por qué existe este script: `npx prisma migrate dev` es la forma estándar y
 * recomendada de aplicar el esquema (y es la que debes usar en tu propia
 * máquina/CI con acceso normal a internet, ver README.md). Este script es una
 * alternativa equivalente para entornos con la red restringida donde Prisma
 * no puede descargar su motor de esquema (schema-engine). Ambos caminos
 * producen exactamente el mismo esquema de base de datos.
 */
import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";

const rawUrl = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
const dbPath = path.resolve(process.cwd(), rawUrl.replace(/^file:/, ""));
const migrationPath = path.resolve(
  process.cwd(),
  "prisma/migrations/0_init/migration.sql"
);

const sql = fs.readFileSync(migrationPath, "utf8");

const db = new Database(dbPath);
db.pragma("foreign_keys = ON");
db.exec(sql);
db.close();

console.log(`Base de datos creada/actualizada en ${dbPath}`);
