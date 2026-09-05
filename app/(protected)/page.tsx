import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DIA_LABEL, hoyDia } from "@/lib/days";
import { MUSCLE_LABEL, EQUIPMENT_LABEL } from "@/lib/days";

// Always render fresh from Postgres — never let Next's Full Route
// Cache or the client Router Cache serve a stale snapshot of this
// user's live data (routines, logs, "última vez", session totals...).
export const dynamic = "force-dynamic";


export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user.id;

  const routine = await prisma.routine.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      days: {
        include: {
          exercises: {
            include: { exercise: true },
            orderBy: { order: "asc" },
          },
        },
      },
    },
  });

  const dia = hoyDia();
  const diaLabel = DIA_LABEL[dia];

  const todayDay = routine?.days.find((d) => d.dayOfWeek === dia);
  const exerciseCount = todayDay?.exercises.length ?? 0;

  const lastLog = await prisma.workoutLog.findFirst({
    where: { userId },
    orderBy: { date: "desc" },
  });

  return (
    <>
      <div>
        <div className="eyebrow">{diaLabel}</div>
        <div className="h-day">
          {routine ? routine.name : "Sin rutina"}
        </div>
      </div>

      {routine && (
        <div className="stat-row">
          <div className="stat">
            <div className="n">{exerciseCount}</div>
            <div className="l">ejercicio{exerciseCount !== 1 ? "s" : ""} hoy</div>
          </div>
          <div className="stat">
            <div className="n">{routine.days.length}</div>
            <div className="l">días en la rutina</div>
          </div>
          <div className="stat">
            <div className="n">
              {lastLog ? lastLog.date.toLocaleDateString("es-ES") : "—"}
            </div>
            <div className="l">último registro</div>
          </div>
        </div>
      )}

      {!routine && (
        <div className="card raised empty" style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
          <p style={{ color: "var(--ink-muted)" }}>
            Todavía no tienes ninguna rutina creada.
          </p>
          <Link href="/routines" className="btn btn-accent">
            Crear mi primera rutina
          </Link>
        </div>
      )}

      {routine && (!todayDay || todayDay.exercises.length === 0) && (
        <div className="card raised empty" style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
          <p style={{ color: "var(--ink-muted)" }}>
            No hay ejercicios asignados para {diaLabel.toLowerCase()} en tu
            rutina.
          </p>
          <Link href={`/routines/${routine.id}`} className="btn btn-accent">
            Editar rutina
          </Link>
        </div>
      )}

      {routine && todayDay && todayDay.exercises.length > 0 && (
        <>
          <div className="card raised">
            {todayDay.exercises.map((re) => (
              <div key={re.id} className="ex-row">
                <div>
                  <div className="ex-name">{re.exercise.name}</div>
                  <div className="ex-meta">
                    {MUSCLE_LABEL[re.exercise.muscleGroup] ?? re.exercise.muscleGroup} ·{" "}
                    {EQUIPMENT_LABEL[re.exercise.equipment] ?? re.exercise.equipment}
                  </div>
                </div>
                <div className="ex-target">
                  {re.targetSets}×{re.targetReps}
                </div>
              </div>
            ))}
          </div>
          <Link
            href={`/routines/${routine.id}/log/${dia}`}
            prefetch={false}
            className="btn btn-accent btn-block"
          >
            Empezar a registrar →
          </Link>
        </>
      )}
    </>
  );
}
