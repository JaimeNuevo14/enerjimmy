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
