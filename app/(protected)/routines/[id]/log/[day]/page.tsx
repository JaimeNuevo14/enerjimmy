import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DIA_LABEL, DIAS } from "@/lib/days";
import DayLogSession from "./DayLogSession";
import type { PreviousLog } from "./DayLogSession";

// Raw SQL (not the typed client — see the comment on history/page.tsx for
// why: speedKmh was added to the schema after this repo's Prisma Client was
// last generated). For a given exercise, finds the most recent PRIOR
// calendar date (strictly before today, so a same-day double session never
// shows itself as "last time") that has WorkoutLog rows for it, then
// returns every row from that one date — a full set of sets for strength,
// or the single cardio entry.
async function getPreviousLog(
  userId: string,
  exerciseId: string,
  muscleGroup: string
): Promise<PreviousLog> {
  const rows = await prisma.$queryRaw<
    {
      date: Date;
      setNumber: number;
      weightKg: number | null;
      reps: number | null;
      durationSeconds: number | null;
      distanceKm: number | null;
      paceSecPerKm: number | null;
      speedKmh: number | null;
    }[]
  >`
    WITH last_day AS (
      SELECT date_trunc('day', "date") AS d
      FROM "WorkoutLog"
      WHERE "userId" = ${userId}
        AND "exerciseId" = ${exerciseId}
        AND "date" < date_trunc('day', now())
      ORDER BY "date" DESC
      LIMIT 1
    )
    SELECT wl."date", wl."setNumber", wl."weightKg", wl."reps",
           wl."durationSeconds", wl."distanceKm", wl."paceSecPerKm", wl."speedKmh"
    FROM "WorkoutLog" wl, last_day
    WHERE wl."userId" = ${userId}
      AND wl."exerciseId" = ${exerciseId}
      AND date_trunc('day', wl."date") = last_day.d
    ORDER BY wl."setNumber" ASC
  `;

  if (rows.length === 0) return null;

  if (muscleGroup === "cardio") {
    const r = rows[0];
    return {
      date: r.date,
      cardio: {
        durationSeconds: r.durationSeconds,
        distanceKm: r.distanceKm,
        speedKmh: r.speedKmh,
        paceSecPerKm: r.paceSecPerKm,
      },
    };
  }

  const sets = rows
    .filter((r) => r.weightKg !== null && r.reps !== null)
    .map((r) => ({ weightKg: r.weightKg as number, reps: r.reps as number }));
  if (sets.length === 0) return null;

  return { date: rows[0].date, sets };
}

export default async function LogDayPage({
  params,
}: {
  params: { id: string; day: string };
}) {
  const session = await auth();
  const userId = session!.user.id;

  if (!DIAS.includes(params.day as (typeof DIAS)[number])) notFound();

  const routine = await prisma.routine.findFirst({
    where: { id: params.id, userId },
    include: {
      days: {
        where: { dayOfWeek: params.day },
        include: {
          exercises: {
            orderBy: { order: "asc" },
            include: { exercise: true },
          },
        },
      },
    },
  });

  if (!routine) notFound();

  const day = routine.days[0];
  const diaLabel = DIA_LABEL[params.day as keyof typeof DIA_LABEL] ?? params.day;

  const previousByExercise = day
    ? Object.fromEntries(
        await Promise.all(
          day.exercises.map(async (re) => [
            re.id,
            await getPreviousLog(userId, re.exerciseId, re.exercise.muscleGroup),
          ])
        )
      )
    : {};

  return (
    <>
      <div>
        <div className="eyebrow">Registrando · {diaLabel}</div>
        <h1 className="h-day" style={{ fontSize: 26 }}>
          {routine.name}
        </h1>
      </div>

      {(!day || day.exercises.length === 0) && (
        <div className="card raised empty">
          No hay ejercicios asignados a este día.
        </div>
      )}

      {day && day.exercises.length > 0 && (
        <DayLogSession
          routineId={routine.id}
          day={params.day}
          routineDayId={day.id}
          exercises={day.exercises.map((re) => ({
            routineExerciseId: re.id,
            exerciseId: re.exerciseId,
            exerciseName: re.exercise.name,
            muscleGroup: re.exercise.muscleGroup,
            targetSets: re.targetSets,
            targetReps: re.targetReps,
            previous: previousByExercise[re.id] ?? null,
          }))}
        />
      )}
    </>
  );
}
