import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Prisma 7 always requires an explicit driver adapter — there is no more
// "give it a connection string and it dials the database itself" mode, even
// for Postgres. @prisma/adapter-pg (node-postgres) works the same way
// against a local Postgres, Neon, Supabase or Vercel Postgres: it just
// speaks standard Postgres wire protocol to whatever DATABASE_URL points at.
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
