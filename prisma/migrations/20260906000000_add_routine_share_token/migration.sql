-- Additive only: new nullable column + unique index. No existing column is
-- altered, dropped, or renamed, and no existing row is touched — every
-- current Routine simply gets shareToken = NULL (Postgres unique indexes
-- allow any number of NULLs, so this never collides).
ALTER TABLE "Routine" ADD COLUMN "shareToken" TEXT;
CREATE UNIQUE INDEX "Routine_shareToken_key" ON "Routine"("shareToken");
