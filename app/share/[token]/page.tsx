import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DIA_LABEL, type Dia } from "@/lib/days";
import ImportRoutineButton from "./ImportRoutineButton";

// Always fetch fresh — see the same note on every other data page in this
// app (routines/[id]/page.tsx etc.).
export const dynamic = "force-dynamic";

export default async function SharedRoutinePage({
  params,
}: {
  params: { token: string };
}) {
  const session = await auth();
  if (!session?.user) {
    redirect(`/login?callbackUrl=${encodeURIComponent(`/share/${params.token}`)}`);
  }
  const userId = session.user.id;

  // shareToken was added to the schema after this repo's Prisma Client was
  // last generated in this environment — see the same comment in
  // lib/actions.ts — so the lookup by token goes through raw SQL.
  const rows = await prisma.$queryRaw<
    { id: string; name: string; userId: string; ownerName: string }[]
  >`
    SELECT r."id", r."name", r."userId", u."name" AS "ownerName"
    FROM "Routine" r
    JOIN "User" u ON u."id" = r."userId"
    WHERE r."shareToken" = ${params.token}
  `;
  const routineRow = rows[0];

  if (!routineRow) {
    return (
      <div className="card raised empty">
        Este enlace de rutina no es válido o ya no existe.
      </div>
    );
  }

  const days = await prisma.routineDay.findMany({
    where: { routineId: routineRow.id },
    orderBy: { order: "asc" },
    include: {
      exercises: {
        orderBy: { order: "asc" },
        include: { exercise: true },
      },
    },
  });

  const isOwnRoutine = routineRow.userId === userId;

  return (
    <>
      <div>
        <div className="eyebrow">Rutina compartida</div>
        <h1 className="h-day" style={{ fontSize: 26 }}>
          {routineRow.name}
        </h1>
        <p className="ex-meta" style={{ marginTop: 4 }}>
          Compartida por {routineRow.ownerName}
        </p>
      </div>

      {days.map((day) => (
        <div key={day.id} className="card raised">
          <div className="ex-name" style={{ fontSize: 15, marginBottom: 8 }}>
            {DIA_LABEL[day.dayOfWeek as Dia] ?? day.dayOfWeek}
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
              </div>
            ))}
            {day.exercises.length === 0 && (
              <p className="empty" style={{ padding: "12px 0" }}>
                Sin ejercicios asignados.
              </p>
            )}
          </div>
        </div>
      ))}

      {isOwnRoutine ? (
        <p className="ex-meta">
          Esta es tu propia rutina — ábrela desde{" "}
          <a href={`/routines/${routineRow.id}`} style={{ color: "var(--accent)", fontWeight: 600 }}>
            Rutinas
          </a>
          .
        </p>
      ) : (
        <ImportRoutineButton token={params.token} />
      )}
    </>
  );
}
