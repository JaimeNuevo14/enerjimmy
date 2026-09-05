"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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

export async function deleteWorkoutLog(logId: string) {
  const userId = await requireUserId();
  await prisma.workoutLog.deleteMany({ where: { id: logId, userId } });
  revalidatePath("/history");
}

// ---------------- "Finalizar rutina" (draft-until-finalize) ----------------

// The whole day's draft, built client-side (see the log/[day] page's
// DayLogSession + draft.ts) and sent here in one shot only when the user
// presses "Finalizar rutina". Nothing is written to the database before
// that — see the WorkoutLog model comment for the strength-vs-cardio shape.
export type FinalizeEntry = {
  routineExerciseId: string;
  exerciseId: string;
  kind: "strength" | "cardio";
  sets?: { weightKg: number; reps: number }[];
  cardio?: {
    durationSeconds?: number | null;
    paceSecPerKm?: number | null;
    distanceKm?: number | null;
  };
};

export async function finalizeRoutineDay(
  routineId: string,
  day: string,
  routineDayId: string,
  entries: FinalizeEntry[]
): Promise<{ ok: boolean; message?: string; sessionId?: string }> {
  const userId = await requireUserId();

  const routineDay = await prisma.routineDay.findFirst({
    where: { id: routineDayId, routine: { id: routineId, userId } },
  });
  if (!routineDay) return { ok: false, message: "No autorizado." };

  type LogRow = {
    exerciseId: string;
    routineExerciseId: string;
    setNumber: number;
    weightKg: number | null;
    reps: number | null;
    durationSeconds: number | null;
    distanceKm: number | null;
    paceSecPerKm: number | null;
  };

  const logRows: LogRow[] = [];
  const exerciseIdsWithData = new Set<string>();

  for (const entry of Array.isArray(entries) ? entries : []) {
    if (!entry?.routineExerciseId || !entry?.exerciseId) continue;

    if (entry.kind === "strength") {
      const validSets = (entry.sets ?? []).filter(
        (s) =>
          typeof s?.weightKg === "number" &&
          typeof s?.reps === "number" &&
          !Number.isNaN(s.weightKg) &&
          !Number.isNaN(s.reps) &&
          s.reps > 0
      );
      validSets.forEach((s, i) => {
        exerciseIdsWithData.add(entry.exerciseId);
        logRows.push({
          exerciseId: entry.exerciseId,
          routineExerciseId: entry.routineExerciseId,
          setNumber: i + 1,
          weightKg: s.weightKg,
          reps: s.reps,
          durationSeconds: null,
          distanceKm: null,
          paceSecPerKm: null,
        });
      });
    } else if (entry.kind === "cardio") {
      const c = entry.cardio;
      const durationSeconds =
        typeof c?.durationSeconds === "number" && Number.isFinite(c.durationSeconds)
          ? c.durationSeconds
          : null;
      const distanceKm =
        typeof c?.distanceKm === "number" && Number.isFinite(c.distanceKm)
          ? c.distanceKm
          : null;
      const paceSecPerKm =
        typeof c?.paceSecPerKm === "number" && Number.isFinite(c.paceSecPerKm)
          ? c.paceSecPerKm
          : null;

      if (durationSeconds !== null || distanceKm !== null || paceSecPerKm !== null) {
        exerciseIdsWithData.add(entry.exerciseId);
        logRows.push({
          exerciseId: entry.exerciseId,
          routineExerciseId: entry.routineExerciseId,
          setNumber: 1,
          weightKg: null,
          reps: null,
          durationSeconds,
          distanceKm,
          paceSecPerKm,
        });
      }
    }
  }

  if (logRows.length === 0) {
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

  for (const r of logRows) {
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

  // Single transaction: the session row and every one of its WorkoutLog
  // rows are created together, already tagged with the new session's id —
  // if anything fails partway through, nothing is written at all.
  const sessionId = await prisma.$transaction(async (tx) => {
    const session = await tx.workoutSession.create({
      data: {
        userId,
        routineDayId,
        totalWeightKg,
        totalSets,
        totalExercises: exerciseIdsWithData.size,
        totalReps,
        totalCardioDistanceKm: hasCardio ? totalCardioDistanceKm : null,
      },
    });

    await tx.workoutLog.createMany({
      data: logRows.map((r) => ({
        userId,
        exerciseId: r.exerciseId,
        routineExerciseId: r.routineExerciseId,
        workoutSessionId: session.id,
        setNumber: r.setNumber,
        weightKg: r.weightKg,
        reps: r.reps,
        durationSeconds: r.durationSeconds,
        distanceKm: r.distanceKm,
        paceSecPerKm: r.paceSecPerKm,
      })),
    });

    return session.id;
  });

  revalidatePath(`/routines/${routineId}/log/${day}`);
  revalidatePath("/history");
  revalidatePath("/");

  return { ok: true, sessionId };
}
