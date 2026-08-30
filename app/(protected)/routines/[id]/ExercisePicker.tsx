"use client";

import { useMemo, useState } from "react";
import { addExerciseToDay } from "@/lib/actions";
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

export default function ExercisePicker({
  routineId,
  routineDayId,
  exercises,
}: {
  routineId: string;
  routineDayId: string;
  exercises: ExerciseLite[];
}) {
  const [open, setOpen] = useState(false);
  const [group, setGroup] = useState<string | null>(null);
  const [selected, setSelected] = useState<ExerciseLite | null>(null);
  const [targetSets, setTargetSets] = useState("3");
  const [targetReps, setTargetReps] = useState("8-12");
  const [pending, setPending] = useState(false);

  const groupsPresent = useMemo(
    () => MUSCLE_GROUPS.filter((mg) => exercises.some((e) => e.muscleGroup === mg)),
    [exercises]
  );

  const groupExercises = useMemo(
    () => (group ? exercises.filter((e) => e.muscleGroup === group) : []),
    [group, exercises]
  );

  function reset() {
    setOpen(false);
    setGroup(null);
    setSelected(null);
    setTargetSets("3");
    setTargetReps("8-12");
  }

  async function handleAdd() {
    if (!selected) return;
    setPending(true);
    const fd = new FormData();
    fd.set("routineId", routineId);
    fd.set("routineDayId", routineDayId);
    fd.set("exerciseId", selected.id);
    fd.set("targetSets", targetSets || "3");
    fd.set("targetReps", targetReps || "8-12");
    try {
      await addExerciseToDay(fd);
    } finally {
      setPending(false);
      reset();
    }
  }

  const title = selected
    ? "Series y repeticiones"
    : group
      ? MUSCLE_LABEL[group] ?? group
      : "Elige un grupo muscular";

  return (
    <div style={{ paddingTop: 10, borderTop: "1px solid var(--line)" }}>
      <button
        onClick={() => setOpen(true)}
        type="button"
        className="btn btn-ghost btn-block btn-sm"
      >
        + Añadir ejercicio
      </button>

      {open && (
        <div
          className="picker-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Selector de ejercicios"
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
                    <p className="empty">No hay ejercicios disponibles todavía.</p>
                  )}
                </div>
              )}

              {group && !selected && (
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
                        onClick={() => setSelected(ex)}
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
                        No hay ejercicios en este grupo todavía.
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

              {selected && (
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    className="picker-back"
                    onClick={() => setSelected(null)}
                  >
                    ‹ {selected.name}
                  </button>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min={1}
                      value={targetSets}
                      onChange={(e) => setTargetSets(e.target.value)}
                      className="input"
                      style={{ width: 80 }}
                      placeholder="Series"
                      aria-label="Series objetivo"
                    />
                    <input
                      value={targetReps}
                      onChange={(e) => setTargetReps(e.target.value)}
                      className="input"
                      style={{ flex: 1 }}
                      placeholder="Reps (ej: 8-12)"
                      aria-label="Repeticiones objetivo"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAdd}
                    disabled={pending}
                    className="btn btn-accent btn-block btn-sm"
                  >
                    {pending ? "Añadiendo…" : "Añadir a este día"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
