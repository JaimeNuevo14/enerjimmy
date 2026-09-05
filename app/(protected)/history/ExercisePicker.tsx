"use client";

import { useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { MUSCLE_GROUPS, MUSCLE_LABEL, EQUIPMENT_LABEL } from "@/lib/days";
import { MuscleIcon } from "@/components/icons";
import ExerciseVisual from "@/components/ExerciseVisual";

type ExerciseLite = {
  id: string;
  name: string;
  muscleGroup: string;
  equipment: string;
  category: string;
};

// Same muscle-group-first picker pattern as routines/[id]/ExercisePicker,
// adapted for history: step 1 picks a muscle group (only ones the user has
// actually logged), step 2 picks the exercise (with its real illustration
// or fallback silhouette), which then navigates to ?exerciseId=... exactly
// like the old <select>'s onChange did.
export default function ExercisePicker({
  exercises,
  selected,
}: {
  exercises: ExerciseLite[];
  selected?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [group, setGroup] = useState<string | null>(null);

  const groupsPresent = useMemo(
    () => MUSCLE_GROUPS.filter((mg) => exercises.some((e) => e.muscleGroup === mg)),
    [exercises]
  );

  const groupExercises = useMemo(
    () => (group ? exercises.filter((e) => e.muscleGroup === group) : []),
    [group, exercises]
  );

  const selectedExercise = exercises.find((e) => e.id === selected) ?? null;

  function reset() {
    setOpen(false);
    setGroup(null);
  }

  function pick(ex: ExerciseLite) {
    reset();
    router.push(`${pathname}?exerciseId=${ex.id}`);
  }

  const title = group ? MUSCLE_LABEL[group] ?? group : "Elige un grupo muscular";

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="picker-trigger"
        aria-haspopup="dialog"
      >
        <span className="picker-trigger-icon">
          {selectedExercise && (
            <ExerciseVisual
              name={selectedExercise.name}
              muscleGroup={selectedExercise.muscleGroup}
              className="picker-ex-icon-visual"
            />
          )}
        </span>
        <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {selectedExercise ? selectedExercise.name : "Elige un ejercicio"}
        </span>
        <span aria-hidden="true">›</span>
      </button>

      {open && (
        <div
          className="picker-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Selector de ejercicios del historial"
          onClick={(e) => {
            if (e.target === e.currentTarget) reset();
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") reset();
          }}
        >
          <div className="picker-panel">
            <div className="picker-header">
              <span>{title}</span>
              <button
                type="button"
                className="picker-close"
                onClick={reset}
                aria-label="Cerrar selector de ejercicios"
              >
                ×
              </button>
            </div>

            <div className="picker-body">
              {!group && (
                <div className="picker-grid">
                  {groupsPresent.map((mg) => (
                    <button
                      key={mg}
                      type="button"
                      className="muscle-card"
                      onClick={() => setGroup(mg)}
                    >
                      <MuscleIcon group={mg} aria-hidden="true" />
                      <span>{MUSCLE_LABEL[mg] ?? mg}</span>
                    </button>
                  ))}
                  {groupsPresent.length === 0 && (
                    <p className="empty">Aún no tienes ejercicios registrados.</p>
                  )}
                </div>
              )}

              {group && (
                <>
                  <button
                    type="button"
                    className="picker-back"
                    onClick={() => setGroup(null)}
                  >
                    ‹ Grupos musculares
                  </button>
                  <div className="picker-list">
                    {groupExercises.map((ex) => (
                      <button
                        key={ex.id}
                        type="button"
                        className="picker-ex-item"
                        onClick={() => pick(ex)}
                      >
                        <div className="picker-ex-icon">
                          <ExerciseVisual
                            name={ex.name}
                            muscleGroup={ex.muscleGroup}
                            className="picker-ex-icon-visual"
                          />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className="ex-name">{ex.name}</div>
                          <div className="tag" style={{ marginTop: 2 }}>
                            {EQUIPMENT_LABEL[ex.equipment] ?? ex.equipment} ·{" "}
                            {ex.category}
                          </div>
                        </div>
                      </button>
                    ))}
                    {groupExercises.length === 0 && (
                      <p className="empty">
                        No hay ejercicios registrados en este grupo.
                      </p>
                    )}
                  </div>
                  <p className="picker-attribution">
                    Ilustraciones de ejercicios: proyecto{" "}
                    <a
                      href="https://github.com/bryllim/workout-guide"
                      target="_blank"
                      rel="noreferrer"
                    >
                      workout-guide
                    </a>{" "}
                    (Everkinetic), CC BY-SA 4.0.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
