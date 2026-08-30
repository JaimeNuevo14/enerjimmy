import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createRoutine } from "@/lib/actions";

export default async function RoutinesPage() {
  const session = await auth();
  const userId = session!.user.id;

  const routines = await prisma.routine.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { days: true } } },
  });

  return (
    <>
      <div>
        <div className="eyebrow">Tus rutinas</div>
        <h1 className="h-day" style={{ fontSize: 28 }}>
          Mis rutinas
        </h1>
      </div>

      <div className="flex flex-col gap-2">
        {routines.map((r) => (
          <Link key={r.id} href={`/routines/${r.id}`} className="routine-card">
            <div>
              <div className="rname">{r.name}</div>
              <div className="rdays">
                Creada el {r.createdAt.toLocaleDateString("es-ES")} ·{" "}
                {r._count.days} días
              </div>
            </div>
            <span className="arrow">›</span>
          </Link>
        ))}
        {routines.length === 0 && (
          <div className="card raised empty">Aún no has creado ninguna rutina.</div>
        )}
      </div>

      <div className="card raised">
        <p className="field-label" style={{ fontSize: 13, color: "var(--ink)", fontWeight: 600, marginBottom: 8 }}>
          Crear nueva rutina
        </p>
        <form action={createRoutine} className="flex flex-col gap-2">
          <input
            name="name"
            required
            placeholder="Ej: Push Pull Legs"
            className="input"
          />
          <div className="flex items-center gap-2">
            <label
              htmlFor="dayCount"
              className="field-label"
              style={{ margin: 0, flex: 1 }}
            >
              ¿De cuántos días es tu rutina?
            </label>
            <input
              id="dayCount"
              name="dayCount"
              type="number"
              min={1}
              max={7}
              defaultValue={4}
              required
              className="input"
              style={{ width: 64, textAlign: "center", flexShrink: 0 }}
            />
          </div>
          <button type="submit" className="btn btn-accent btn-block">
            Crear
          </button>
        </form>
      </div>
    </>
  );
}
