import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DIA_LABEL } from "@/lib/days";
import ExercisePicker from "./ExercisePicker";
import DeleteLogButton from "./DeleteLogButton";
import Sparkline from "./Sparkline";

// weightKg/reps/durationSeconds/distanceKm/paceSecPerKm and the whole
// WorkoutSession table were added after the Prisma Client already generated
// in this environment (see prisma/migrations/20260831000000_add_password_cardio_sessions),
// so this page reads them via parameterized raw SQL rather than the typed
// client, which would otherwise silently omit the new columns.
type LogRow = {
  id: string;
  date: Date;
  setNumber: number;
  weightKg: number | null;
  reps: number | null;
  durationSeconds: number | null;
  distanceKm: number | null;
  paceSecPerKm: number | null;
};

type SessionRow = {
  id: string;
  date: Date;
  routineDayId: string | null;
  dayOfWeek: string | null;
  routineName: string | null;
  totalWeightKg: number;
  totalSets: number;
  totalExercises: number;
  totalReps: number | null;
  totalCardioDistanceKm: number | null;
};

function formatMinSec(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.round(totalSeconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

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
  const selectedExercise = exercises.find((e) => e.id === exerciseId);
  const isCardio = selectedExercise?.muscleGroup === "cardio";

  const logs = exerciseId
    ? await prisma.$queryRaw<LogRow[]>`
        SELECT "id", "date", "setNumber", "weightKg", "reps",
               "durationSeconds", "distanceKm", "paceSecPerKm"
        FROM "WorkoutLog"
        WHERE "userId" = ${userId} AND "exerciseId" = ${exerciseId}
        ORDER BY "date" ASC, "setNumber" ASC
      `
    : [];

  const weights = logs
    .map((l) => l.weightKg)
    .filter((w): w is number => w !== null);
  const summary =
    !isCardio && weights.length
      ? {
          min: Math.min(...weights),
          max: Math.max(...weights),
          last: weights[weights.length - 1],
        }
      : null;

  const sessions = await prisma.$queryRaw<SessionRow[]>`
    SELECT ws."id", ws."date", ws."routineDayId", rd."dayOfWeek" AS "dayOfWeek",
           r."name" AS "routineName", ws."totalWeightKg", ws."totalSets",
           ws."totalExercises", ws."totalReps", ws."totalCardioDistanceKm"
    FROM "WorkoutSession" ws
    LEFT JOIN "RoutineDay" rd ON rd."id" = ws."routineDayId"
    LEFT JOIN "Routine" r ON r."id" = rd."routineId"
    WHERE ws."userId" = ${userId}
    ORDER BY ws."date" DESC
    LIMIT 20
  `;

  return (
    <>
      <div>
        <div className="eyebrow">Historial</div>
        <h1 className="h-day" style={{ fontSize: 28 }}>
          Progreso
        </h1>
      </div>

      {exercises.length === 0 && sessions.length === 0 && (
        <div className="card raised empty">
          Aún no has registrado ningún entrenamiento.
        </div>
      )}

      {exercises.length > 0 && (
        <>
          <ExercisePicker
            exercises={exercises.map((e) => ({
              id: e.id,
              name: e.name,
              muscleGroup: e.muscleGroup,
              equipment: e.equipment,
              category: e.category,
            }))}
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

          {!isCardio && weights.length > 0 && <Sparkline values={weights} />}

          <div className="card raised" style={{ overflowX: "auto" }}>
            <table className="hist-table">
              <thead>
                {isCardio ? (
                  <tr>
                    <th>Fecha</th>
                    <th>Tiempo</th>
                    <th>Ritmo</th>
                    <th>Distancia</th>
                    <th></th>
                  </tr>
                ) : (
                  <tr>
                    <th>Fecha</th>
                    <th>Set</th>
                    <th>Peso</th>
                    <th>Reps</th>
                    <th></th>
                  </tr>
                )}
              </thead>
              <tbody>
                {logs
                  .slice()
                  .reverse()
                  .map((log) =>
                    isCardio ? (
                      <tr key={log.id}>
                        <td>{log.date.toLocaleDateString("es-ES")}</td>
                        <td className="num">
                          {log.durationSeconds != null
                            ? formatMinSec(log.durationSeconds)
                            : "—"}
                        </td>
                        <td className="num">
                          {log.paceSecPerKm != null
                            ? `${formatMinSec(log.paceSecPerKm)} /km`
                            : "—"}
                        </td>
                        <td className="num">
                          {log.distanceKm != null
                            ? `${log.distanceKm} km`
                            : "—"}
                        </td>
                        <td>
                          <DeleteLogButton logId={log.id} />
                        </td>
                      </tr>
                    ) : (
                      <tr key={log.id}>
                        <td>{log.date.toLocaleDateString("es-ES")}</td>
                        <td className="num">{log.setNumber}</td>
                        <td className="num">{log.weightKg} kg</td>
                        <td className="num">{log.reps}</td>
                        <td>
                          <DeleteLogButton logId={log.id} />
                        </td>
                      </tr>
                    )
                  )}
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

      {sessions.length > 0 && (
        <div className="flex flex-col gap-3" style={{ marginTop: 8 }}>
          <div className="eyebrow">Resumen de sesiones</div>

          {sessions.map((s) => {
            const dayLabel = s.dayOfWeek
              ? DIA_LABEL[s.dayOfWeek as keyof typeof DIA_LABEL] ?? s.dayOfWeek
              : null;
            return (
              <div key={s.id} className="card raised flex flex-col gap-3">
                <div>
                  <div className="ex-name" style={{ fontSize: 15 }}>
                    {s.routineName ?? "Sesión"}
                    {dayLabel ? ` · ${dayLabel}` : ""}
                  </div>
                  <div className="ex-meta">
                    {s.date.toLocaleDateString("es-ES", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                  </div>
                </div>

                <div className="stat-row">
                  <div className="stat">
                    <div className="n">{s.totalSets}</div>
                    <div className="l">series</div>
                  </div>
                  <div className="stat">
                    <div className="n">{s.totalExercises}</div>
                    <div className="l">ejercicios</div>
                  </div>
                </div>

                <div className="stat-row">
                  <div className="stat">
                    <div className="n up">
                      {Math.round(s.totalWeightKg).toLocaleString("es-ES")}
                      &nbsp;kg
                    </div>
                    <div className="l">peso total movido</div>
                  </div>
                  {s.totalReps !== null && (
                    <div className="stat">
                      <div className="n">{s.totalReps}</div>
                      <div className="l">reps totales</div>
                    </div>
                  )}
                </div>

                {s.totalCardioDistanceKm !== null && (
                  <div className="stat-row">
                    <div className="stat">
                      <div className="n">
                        {s.totalCardioDistanceKm}&nbsp;km
                      </div>
                      <div className="l">distancia cardio</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
