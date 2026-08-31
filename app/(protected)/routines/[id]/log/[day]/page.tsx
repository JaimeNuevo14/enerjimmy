import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DIA_LABEL, DIAS } from "@/lib/days";
import ExerciseLogCard from "./ExerciseLogCard";
import FinalizeRoutineButton from "./FinalizeRoutineButton";

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

      {day?.exercises.map((re) => (
        <ExerciseLogCard
          key={re.id}
          routineId={routine.id}
          day={params.day}
          routineExerciseId={re.id}
          exerciseId={re.exerciseId}
          exerciseName={re.exercise.name}
          muscleGroup={re.exercise.muscleGroup}
          targetSets={re.targetSets}
          targetReps={re.targetReps}
        />
      ))}

      {day && day.exercises.length > 0 && (
        <FinalizeRoutineButton
          routineId={routine.id}
          day={params.day}
          routineDayId={day.id}
        />
      )}
    </>
  );
}
