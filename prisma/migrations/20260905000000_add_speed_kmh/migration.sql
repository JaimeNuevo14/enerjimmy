-- Purely additive migration: adds one nullable column to WorkoutLog.
-- Nothing here drops, renames or retypes an existing column or table, so it
-- is safe to run against a database that already has real data.

-- AlterTable: cardio entries now capture the speed the user reads directly
-- off their machine (km/h) instead of asking them to type a pace in
-- min:sec/km. The old "paceSecPerKm" column is left untouched — any cardio
-- rows logged before this change keep it and keep displaying correctly;
-- new cardio rows populate "speedKmh" instead (and lib/actions.ts derives a
-- paceSecPerKm from it too, only for backward-compatible display code that
-- still reads that column).
ALTER TABLE "WorkoutLog" ADD COLUMN "speedKmh" DOUBLE PRECISION;
