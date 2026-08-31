-- Purely additive migration: adds a nullable password column, relaxes two
-- NOT NULL constraints (with no data loss — existing rows already satisfy
-- them, they just stop being required for future cardio rows), adds nullable
-- cardio columns + a nullable session FK, and creates a new table. Nothing
-- here drops, renames or retypes an existing column or table, so it is safe
-- to run against a database that already has real data.

-- AlterTable: User gets an optional password hash. Existing accounts get
-- NULL here, which lib/auth.ts treats as "no password set yet" and adopts
-- the next login attempt's password instead of rejecting it.
ALTER TABLE "User" ADD COLUMN "passwordHash" TEXT;

-- AlterTable: WorkoutLog's weightKg/reps become optional so cardio entries
-- (which use duration/pace/distance instead) can omit them, and gains the
-- cardio fields plus the link to a finalized WorkoutSession.
ALTER TABLE "WorkoutLog" ALTER COLUMN "weightKg" DROP NOT NULL;
ALTER TABLE "WorkoutLog" ALTER COLUMN "reps" DROP NOT NULL;
ALTER TABLE "WorkoutLog" ADD COLUMN "durationSeconds" INTEGER;
ALTER TABLE "WorkoutLog" ADD COLUMN "distanceKm" DOUBLE PRECISION;
ALTER TABLE "WorkoutLog" ADD COLUMN "paceSecPerKm" INTEGER;
ALTER TABLE "WorkoutLog" ADD COLUMN "workoutSessionId" TEXT;

-- CreateTable: WorkoutSession, the "Finalizar rutina" summary record.
CREATE TABLE "WorkoutSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "routineDayId" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalWeightKg" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalSets" INTEGER NOT NULL DEFAULT 0,
    "totalExercises" INTEGER NOT NULL DEFAULT 0,
    "totalReps" INTEGER,
    "totalCardioDistanceKm" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkoutSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WorkoutSession_userId_idx" ON "WorkoutSession"("userId");
CREATE INDEX "WorkoutSession_routineDayId_idx" ON "WorkoutSession"("routineDayId");
CREATE INDEX "WorkoutLog_workoutSessionId_idx" ON "WorkoutLog"("workoutSessionId");

-- AddForeignKey
ALTER TABLE "WorkoutSession" ADD CONSTRAINT "WorkoutSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "WorkoutSession" ADD CONSTRAINT "WorkoutSession_routineDayId_fkey" FOREIGN KEY ("routineDayId") REFERENCES "RoutineDay"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "WorkoutLog" ADD CONSTRAINT "WorkoutLog_workoutSessionId_fkey" FOREIGN KEY ("workoutSessionId") REFERENCES "WorkoutSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;
