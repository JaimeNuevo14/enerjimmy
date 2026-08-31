"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { randomUUID } from "node:crypto";
import { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DIAS } from "@/lib/days";

async function requireUserId(): Promise<string> {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) redirect("/login");
  return id;
}

// ---------------- Exercises ----------------

export async function createCustomExercise(formData: FormData) {
  const userId = await requireUserId();

  const name = String(formData.get("name") ?? "").trim();
  const muscleGroup = String(formData.get("muscleGroup") ?? "");
  const equipment = String(formData.get("equipment") ?? "");
  const category = String(formData.get("category") ?? "compuesto");

  if (!name || !muscleGroup || !equipment) return;

  await prisma.exercise.create({
    data: {
      name,
      muscleGroup,
      equipment,
      category,
      isCustom: true,
      createdByUserId: userId,
    },
  });

  revalidatePath("/exercises");
}

// ---------------- Routines ----------------

export async function createRoutine(formData: FormData) {
  const userId = await requireUserId();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  // ¿De cuántos días es tu rutina? Clamp to a real week (1-7) and pre-create
  // that many RoutineDay slots right away, in order, defaulting each one to
  // the matching weekday (lunes, martes, ...) so the user can immediately
  // relabel any slot afterwards instead of adding days one by one.
  const rawDayCount = Number(formData.get("dayCount") ?? DIAS.length);
  const dayCount = Number.isFinite(rawDayCount)
    ? Math.min(DIAS.length, Math.max(1, Math.round(rawDayCount)))
    : DIAS.length;

  const routine = await prisma.routine.create({
    data: {
      userId,
      name,
      days: {
        create: DIAS.slice(0, dayCount).map((dia, i) => ({
          dayOfWeek: dia,
          order: i,
        })),
      },
    },
  });

  revalidatePath("/routines");
  redirect(`/routines/${routine.id}`);
}

export async function setRoutineDayOfWeek(
  routineId: string,
  routineDayId: string,
  formData: FormData
) {
  const userId = await requireUserId();
  const dayOfWeek = String(formData.get("dayOfWeek") ?? "");
  if (!DIAS.includes(dayOfWeek as (typeof DIAS)[number])) return;

  await prisma.routineDay.updateMany({
    where: { id: routineDayId, routine: { userId } },
    data: { dayOfWeek },
  });

  revalidatePath(`/routines/${routineId}`);
}

export async function deleteRoutine(routineId: string) {
  const userId = await requireUserId();
  await prisma.routine.deleteMany({ where: { id: routineId, userId } });
  revalidatePath("/routines");
  redirect("/routines");
}

export async function renameRoutine(routineId: string, formData: FormData) {
  const userId = await requireUserId();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  await prisma.routine.updateMany({
    where: { id: routineId, userId },
    data: { name },
  });

  revalidatePath(`/routines/${routineId}`);
  revalidatePath("/routines");
}

// ---------------- Routine exercises (per day) ----------------

async function assertOwnsRoutineDay(userId: string, routineDayId: string) {
  const day = await prisma.routineDay.findFirst({
    where: { id: routineDayId, routine: { userId } },
  });
  if (!day) throw new Error("No autorizado");
  return day;
}

export async function addExerciseToDay(formData: FormData) {
  const userId = await requireUserId();
  const routineId = String(formData.get("routineId") ?? "");
  const routineDayId = String(formData.get("routineDayId") ?? "");
  const exerciseId = String(formData.get("exerciseId") ?? "");
  const targetSets = Number(formData.get("targetSets") ?? 3) || 3;
  const targetReps = String(formData.get("targetReps") ?? "8-12");

  if (!routineDayId || !exerciseId) return;

  await assertOwnsRoutineDay(userId, routineDayId);

  const count = await prisma.routineExercise.count({
    where: { routineDayId },
  });

  await prisma.routineExercise.create({
    data: {
      routineDayId,
      exerciseId,
      order: count,
      targetSets,
      targetReps,
    },
  });

  revalidatePath(`/routines/${routineId}`);
}

export async function removeExerciseFromDay(
  routineId: string,
  routineExerciseId: string
) {
  const userId = await requireUserId();

  await prisma.routineExercise.deleteMany({
    where: {
      id: routineExerciseId,
      routineDay: { routine: { userId } },
    },
  });

  revalidatePath(`/routines/${routineId}`);
}

export async function updateRoutineExerciseTargets(
  routineId: string,
  routineExerciseId: string,
  formData: FormData
) {
  const userId = await requireUserId();
  const targetSets = Number(formData.get("targetSets") ?? 3) || 3;
  const targetReps = String(formData.get("targetReps") ?? "8-12");

  await prisma.routineExercise.updateMany({
    where: {
      id: routineExerciseId,
      routineDay: { routine: { userId } },
    },
    data: { targetSets, targetReps },
  });

  revalidatePath(`/routines/${routineId}`);
}

// ---------------- Workout logs ----------------

export async function logSets(
  routineId: string | null,
  day: string | null,
  formData: FormData
) {
  const userId = await requireUserId();

  const exerciseId = String(formData.get("exerciseId") ?? "");
  const routineExerciseId = formData.get("routineExerciseId")
    ? String(formData.get("routineExerciseId"))
    : null;
  const setsRaw = String(formData.get("sets") ?? "[]");

  if (!exerciseId) return;

  let sets: { weightKg: number; reps: number }[] = [];
  try {
    sets = JSON.parse(setsRaw);
  } catch {
    sets = [];
  }

  const validSets = sets.filter(
    (s) =>
      typeof s.weightKg === "number" &&
      typeof s.reps === "number" &&
      !Number.isNaN(s.weightKg) &&
      !Number.isNaN(s.reps) &&
      s.reps > 0
  );

  if (validSets.length === 0) return;

  await prisma.$transaction(
    validSets.map((s, i) =>
      prisma.workoutLog.create({
        data: {
          userId,
          exerciseId,
          routineExerciseId,
          setNumber: i + 1,
          weightKg: s.weightKg,
          reps: s.reps,
        },
      })
    )
  );

  if (routineId) {
    revalidatePath(`/routines/${routineId}/log/${day}`);
  }
  revalidatePath("/");
  revalidatePath("/history");
}

export async function deleteWorkoutLog(logId: string) {
  const userId = await requireUserId();
  await prisma.workoutLog.deleteMany({ where: { id: logId, userId } });
  revalidatePath("/history");
}

// Cardio exercises (muscleGroup === "cardio") log one session entry —
// tiempo/ritmo/distancia — instead of a grid of weight/reps sets.
//
// weightKg/reps/durationSeconds/distanceKm/paceSecPerKm were added to
// WorkoutLog after the Prisma Client already generated in this environment
// (see prisma/migrations/20260831000000_add_password_cardio_sessions), so
// this goes through parameterized raw SQL rather than the typed
// `prisma.workoutLog.create` used by logSets above. It is otherwise the
// same insert.
export async function logCardio(
  routineId: string | null,
  day: string | null,
  formData: FormData
) {
  const userId = await requireUserId();

  const exerciseId = String(formData.get("exerciseId") ?? "");
  const routineExerciseId = formData.get("routineExerciseId")
    ? String(formData.get("routineExerciseId"))
    : null;

  const durationSecondsRaw = formData.get("durationSeconds");
  const distanceKmRaw = formData.get("distanceKm");
  const paceSecPerKmRaw = formData.get("paceSecPerKm");

  const durationSeconds =
    durationSecondsRaw !== null && durationSecondsRaw !== ""
      ? Number(durationSecondsRaw)
      : null;
  const distanceKm =
    distanceKmRaw !== null && distanceKmRaw !== ""
      ? Number(distanceKmRaw)
      : null;
  const paceSecPerKm =
    paceSecPerKmRaw !== null && paceSecPerKmRaw !== ""
      ? Number(paceSecPerKmRaw)
      : null;

  if (!exerciseId) return;
  if (
    (durationSeconds === null || Number.isNaN(durationSeconds)) &&
    (distanceKm === null || Number.isNaN(distanceKm)) &&
    (paceSecPerKm === null || Number.isNaN(paceSecPerKm))
  ) {
    return;
  }

  const id = randomUUID();
  await prisma.$executeRaw`
    INSERT INTO "WorkoutLog"
      ("id", "userId", "routineExerciseId", "exerciseId", "date", "setNumber", "durationSeconds", "distanceKm", "paceSecPerKm")
    VALUES
      (${id}, ${userId}, ${routineExerciseId}, ${exerciseId}, CURRENT_TIMESTAMP, 1,
       ${Number.isFinite(durationSeconds as number) ? durationSeconds : null},
       ${Number.isFinite(distanceKm as number) ? distanceKm : null},
       ${Number.isFinite(paceSecPerKm as number) ? paceSecPerKm : null})
  `;

  if (routineId) {
    revalidatePath(`/routines/${routineId}/log/${day}`);
  }
  revalidatePath("/");
  revalidatePath("/history");
}

// ---------------- "Finalizar rutina" session summary ----------------

type SessionLogRow = {
  id: string;
  exerciseId: string;
  weightKg: number | null;
  reps: number | null;
  distanceKm: number | null;
};

export async function finalizeRoutineDay(
  routineId: string,
  day: string,
  routineDayId: string
): Promise<{ ok: boolean; message?: string; sessionId?: string }> {
  const userId = await requireUserId();

  const routineDay = await prisma.routineDay.findFirst({
    where: { id: routineDayId, routine: { id: routineId, userId } },
  });
  if (!routineDay) return { ok: false, message: "No autorizado." };

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  // "This session's logs" = every WorkoutLog for this user + this routine
  // day, logged today, not already attached to a finalized session — i.e.
  // whatever the user just entered on this log page before hitting
  // "Finalizar rutina".
  const rows = await prisma.$queryRaw<SessionLogRow[]>`
    SELECT wl."id", wl."exerciseId", wl."weightKg", wl."reps", wl."distanceKm"
    FROM "WorkoutLog" wl
    JOIN "RoutineExercise" re ON re."id" = wl."routineExerciseId"
    WHERE wl."userId" = ${userId}
      AND re."routineDayId" = ${routineDayId}
      AND wl."workoutSessionId" IS NULL
      AND wl."date" >= ${startOfDay}
      AND wl."date" < ${endOfDay}
  `;

  if (rows.length === 0) {
    return {
      ok: false,
      message: "Todavía no has registrado ninguna serie hoy.",
    };
  }

  let totalWeightKg = 0;
  let totalSets = 0;
  let totalReps = 0;
  let totalCardioDistanceKm = 0;
  let hasCardio = false;
  const exerciseIds = new Set<string>();

  for (const r of rows) {
    exerciseIds.add(r.exerciseId);
    if (r.weightKg !== null && r.reps !== null) {
      totalWeightKg += r.weightKg * r.reps;
      totalSets += 1;
      totalReps += r.reps;
    }
    if (r.distanceKm !== null) {
      hasCardio = true;
      totalCardioDistanceKm += r.distanceKm;
    }
  }

  const sessionId = randomUUID();
  await prisma.$executeRaw`
    INSERT INTO "WorkoutSession"
      ("id", "userId", "routineDayId", "date", "totalWeightKg", "totalSets", "totalExercises", "totalReps", "totalCardioDistanceKm", "createdAt")
    VALUES
      (${sessionId}, ${userId}, ${routineDayId}, CURRENT_TIMESTAMP, ${totalWeightKg}, ${totalSets}, ${exerciseIds.size}, ${totalReps}, ${hasCardio ? totalCardioDistanceKm : null}, CURRENT_TIMESTAMP)
  `;

  const logIds = rows.map((r) => r.id);
  await prisma.$executeRaw`
    UPDATE "WorkoutLog" SET "workoutSessionId" = ${sessionId}
    WHERE "id" IN (${Prisma.join(logIds)})
  `;

  revalidatePath(`/routines/${routineId}/log/${day}`);
  revalidatePath("/history");

  return { ok: true, sessionId };
}
