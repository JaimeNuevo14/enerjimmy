import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import RoutineEditor from "./RoutineEditor";

// Always render fresh from Postgres — never let Next's Full Route
// Cache or the client Router Cache serve a stale snapshot of this
// user's live data (routines, logs, "última vez", session totals...).
export const dynamic = "force-dynamic";

export default async function RoutineDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  const userId = session!.user.id;

  const routine = await prisma.routine.findFirst({
    where: { id: params.id, userId },
    include: {
      days: {
        orderBy: { order: "asc" },
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

  const exercises = await prisma.exercise.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <RoutineEditor
      routineId={routine.id}
      routineName={routine.name}
      days={routine.days.map((day) => ({
        id: day.id,
        dayOfWeek: day.dayOfWeek,
        exercises: day.exercises.map((re) => ({
          id: re.id,
          exerciseName: re.exercise.name,
          targetSets: re.targetSets,
          targetReps: re.targetReps,
        })),
      }))}
      exercises={exercises.map((e) => ({
        id: e.id,
        name: e.name,
        muscleGroup: e.muscleGroup,
        equipment: e.equipment,
        category: e.category,
      }))}
    />
  );
}
