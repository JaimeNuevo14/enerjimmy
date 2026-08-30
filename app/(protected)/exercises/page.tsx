import { prisma } from "@/lib/prisma";
import { MUSCLE_GROUPS, EQUIPMENT, MUSCLE_LABEL, EQUIPMENT_LABEL } from "@/lib/days";
import NewExerciseForm from "./NewExerciseForm";
import ExerciseFilters from "./ExerciseFilters";
import ExerciseVisual from "@/components/ExerciseVisual";

export default async function ExercisesPage({
  searchParams,
}: {
  searchParams: { q?: string; muscleGroup?: string; equipment?: string };
}) {
  const { q, muscleGroup, equipment } = searchParams;

  const exercises = await prisma.exercise.findMany({
    where: {
      ...(q
        ? { name: { contains: q } }
        : {}),
      ...(muscleGroup ? { muscleGroup } : {}),
      ...(equipment ? { equipment } : {}),
    },
    orderBy: { name: "asc" },
  });

  return (
    <>
      <div>
        <div className="eyebrow">Biblioteca</div>
        <h1 style={{ fontSize: 20, fontWeight: 700 }}>
          {exercises.length} ejercicio{exercises.length !== 1 ? "s" : ""}
        </h1>
      </div>

      <ExerciseFilters
        muscleGroups={MUSCLE_GROUPS as unknown as string[]}
        equipmentList={EQUIPMENT as unknown as string[]}
      />

      <div className="card raised">
        {exercises.map((ex) => (
          <div key={ex.id} className="lib-item">
            <div className="lib-item-visual">
              <ExerciseVisual
                name={ex.name}
                muscleGroup={ex.muscleGroup}
                className="lib-item-visual-img"
              />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="ex-name">
                {ex.name}
                {ex.isCustom && (
                  <span
                    className="tag"
                    style={{
                      marginLeft: 8,
                      color: "var(--accent)",
                      background: "var(--accent-soft)",
                      padding: "2px 8px",
                      borderRadius: 100,
                    }}
                  >
                    Personalizado
                  </span>
                )}
              </div>
              <div className="tag" style={{ marginTop: 2 }}>
                {MUSCLE_LABEL[ex.muscleGroup] ?? ex.muscleGroup} ·{" "}
                {EQUIPMENT_LABEL[ex.equipment] ?? ex.equipment} · {ex.category}
              </div>
            </div>
          </div>
        ))}
        {exercises.length === 0 && (
          <p className="empty">No se encontraron ejercicios con esos filtros.</p>
        )}
      </div>

      <NewExerciseForm
        muscleGroups={MUSCLE_GROUPS as unknown as string[]}
        equipmentList={EQUIPMENT as unknown as string[]}
      />

      <p className="page-attribution">
        Algunas ilustraciones de ejercicios provienen del proyecto{" "}
        <a href="https://github.com/bryllim/workout-guide" target="_blank" rel="noreferrer">
          workout-guide
        </a>{" "}
        (assets derivados de Everkinetic), licenciadas bajo{" "}
        <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">
          CC BY-SA 4.0
        </a>
        .
      </p>
    </>
  );
}
