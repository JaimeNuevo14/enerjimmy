import path from "node:path";
import { defineConfig } from "prisma/config";

function dbUrl() {
  const url = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
  const file = url.replace(/^file:/, "");
  return `file:${path.resolve(file)}`;
}

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: dbUrl(),
  },
});
