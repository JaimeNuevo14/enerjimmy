import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ExercisePicker from "./ExercisePicker";
import DeleteLogButton from "./DeleteLogButton";
import Sparkline from "./Sparkline";

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: { exerciseId?: string };
}) {
  const session = await auth();
  const userId = session!.user.id;

  // Exercises the user has actually logged, so the picker is relevant.
  const loggedExerciseIds = await prisma.workoutLog.findMany({
    where: { userId },
    distinct: ["exerciseId"],
    select: { exerciseId: true },
  });

  const exercises = await prisma.exercise.findMany({
    where: { id: { in: loggedExerciseIds.map((l) => l.exerciseId) } },
    orderBy: { name: "asc" },
  });

  const exerciseId = searchParams.exerciseId ?? exercises[0]?.id;

  const logs = exerciseId
    ? await prisma.workoutLog.findMany({
        where: { userId, exerciseId },
        orderBy: [{ date: "asc" }, { setNumber: "asc" }],
      })
    : [];

  const weights = logs.map((l) => l.weightKg);
  const summary = logs.length
    ? {
        min: Math.min(...weights),
        max: Math.max(...weights),
        last: logs[logs.length - 1].weightKg,
      }
    : null;

  return (
    <>
      <div>
        <div className="eyebrow">Historial</div>
        <h1 className="h-day" style={{ fontSize: 28 }}>
          Progreso
        </h1>
      </div>

      {exercises.length === 0 && (
        <div className="card raised empty">
          Aún no has registrado ningún entrenamiento.
        </div>
      )}

      {exercises.length > 0 && (
        <>
          <ExercisePicker
            exercises={exercises.map((e) => ({ id: e.id, name: e.name }))}
            selected={exerciseId}
          />

          {summary && (
            <div className="stat-row">
              <div className="stat">
                <div className="n">{summary.last}&nbsp;kg</div>
                <div className="l">último peso</div>
              </div>
              <div className="stat">
                <div className="n up">{summary.max}&nbsp;kg</div>
                <div className="l">máximo</div>
              </div>
              <div className="stat">
                <div className="n">{summary.min}&nbsp;kg</div>
                <div className="l">mínimo</div>
              </div>
            </div>
          )}

          {weights.length > 0 && <Sparkline values={weights} />}

          <div className="card raised" style={{ overflowX: "auto" }}>
            <table className="hist-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Set</th>
                  <th>Peso</th>
                  <th>Reps</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {logs
                  .slice()
                  .reverse()
                  .map((log) => (
                    <tr key={log.id}>
                      <td>{log.date.toLocaleDateString("es-ES")}</td>
                      <td className="num">{log.setNumber}</td>
                      <td className="num">{log.weightKg} kg</td>
                      <td className="num">{log.reps}</td>
                      <td>
                        <DeleteLogButton logId={log.id} />
                      </td>
                    </tr>
                  ))}
                {logs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="empty">
                      Sin registros para este ejercicio.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}
