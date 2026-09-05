import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  renameRoutine,
  deleteRoutine,
  removeExerciseFromDay,
} from "@/lib/actions";
import ExercisePicker from "./ExercisePicker";
import DaySelector from "./DaySelector";

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

  const renameAction = renameRoutine.bind(null, routine.id);
  const deleteAction = deleteRoutine.bind(null, routine.id);

  return (
    <>
      <div className="card raised flex flex-col gap-3">
        <form action={renameAction} className="flex gap-2">
          <input
            name="name"
            defaultValue={routine.name}
            className="input"
            style={{ flex: 1, fontWeight: 600 }}
          />
          <button type="submit" className="btn btn-accent btn-sm">
            Guardar
          </button>
        </form>
        <form action={deleteAction}>
          <button type="submit" className="link-danger">
            Eliminar rutina
          </button>
        </form>
      </div>

      {routine.days.map((day) => (
        <div key={day.id} className="card raised">
          <div className="flex items-center justify-between" style={{ paddingBottom: 8, borderBottom: "1px solid var(--line)", marginBottom: 4 }}>
            <DaySelector
              routineId={routine.id}
              routineDayId={day.id}
              dayOfWeek={day.dayOfWeek}
            />
            {day.exercises.length > 0 && (
              <Link
                href={`/routines/${routine.id}/log/${day.dayOfWeek}`}
                prefetch={false}
                className="ex-target"
                style={{ color: "var(--good)", fontWeight: 600 }}
              >
                Registrar →
              </Link>
            )}
          </div>

          <div>
            {day.exercises.map((re) => (
              <div key={re.id} className="ex-row">
                <div>
                  <div className="ex-name">{re.exercise.name}</div>
                  <div className="ex-meta">
                    {re.targetSets} series x {re.targetReps} reps
                  </div>
                </div>
                <form
                  action={removeExerciseFromDay.bind(
                    null,
                    routine.id,
                    re.id
                  )}
                >
                  <button type="submit" className="link-danger" style={{ fontSize: 12 }}>
                    Quitar
                  </button>
                </form>
              </div>
            ))}
            {day.exercises.length === 0 && (
              <p className="empty" style={{ padding: "12px 0" }}>
                Sin ejercicios asignados.
              </p>
            )}
          </div>

          <ExercisePicker
            routineId={routine.id}
            routineDayId={day.id}
            exercises={exercises.map((e) => ({
              id: e.id,
              name: e.name,
              muscleGroup: e.muscleGroup,
              equipment: e.equipment,
              category: e.category,
            }))}
          />
        </div>
      ))}
    </>
  );
}
