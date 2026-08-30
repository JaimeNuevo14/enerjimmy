import path from "node:path";
import { config as loadEnv } from "dotenv";
import { defineConfig, env } from "prisma/config";

// Prisma 7's config file is evaluated before Prisma's own .env auto-loading
// kicks in, so without this, env("DATABASE_URL") below throws
// "Cannot resolve environment variable" even when .env exists and is correct.
loadEnv();

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  datasource: {
    url: env("DATABASE_URL"),
  },
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
});
