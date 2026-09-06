"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  renameRoutine,
  deleteRoutine,
  removeExerciseFromDay,
  updateRoutineExerciseTargets,
} from "@/lib/actions";
import { DIA_LABEL, type Dia } from "@/lib/days";
import DaySelector from "./DaySelector";
import ExercisePicker from "./ExercisePicker";
import ShareRoutineButton from "./ShareRoutineButton";

type ExerciseLite = {
  id: string;
  name: string;
  muscleGroup: string;
  equipment: string;
  category: string;
};

export type RoutineExerciseVM = {
  id: string;
  exerciseName: string;
  targetSets: number;
  targetReps: string;
};

export type DayVM = {
  id: string;
  dayOfWeek: string;
  exercises: RoutineExerciseVM[];
};

// The routine detail page's view/edit toggle. Read mode is a clean summary
// (name, days, exercises + targets, "Registrar"); edit mode reveals the
// rename/delete/day/target/add/remove controls that already existed on this
// page, just previously all shown at once. Nothing here changes what those
// underlying server actions do or touches any other user's data — it only
// changes when their controls are visible.
export default function RoutineEditor({
  routineId,
  routineName,
  days,
  exercises,
}: {
  routineId: string;
  routineName: string;
  days: DayVM[];
  exercises: ExerciseLite[];
}) {
  const [editing, setEditing] = useState(false);

  const renameAction = renameRoutine.bind(null, routineId);
  const deleteAction = deleteRoutine.bind(null, routineId);

  return (
    <>
      <div className="card raised flex flex-col gap-3">
        {editing ? (
          <form action={renameAction} className="flex gap-2">
            <input
              name="name"
              defaultValue={routineName}
              className="input"
              style={{ flex: 1, fontWeight: 600 }}
            />
            <button type="submit" className="btn btn-accent btn-sm">
              Guardar
            </button>
          </form>
        ) : (
          <div className="ex-name" style={{ fontSize: 17 }}>
            {routineName}
          </div>
        )}

        <div className="flex gap-2" style={{ flexWrap: "wrap" }}>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => setEditing((v) => !v)}
          >
            {editing ? "Listo" : "Editar rutina"}
          </button>
          <ShareRoutineButton routineId={routineId} routineName={routineName} />
        </div>

        {editing && (
          <form action={deleteAction}>
            <button type="submit" className="link-danger" style={{ fontSize: 13 }}>
              Eliminar rutina
            </button>
          </form>
        )}
      </div>

      {days.map((day) => (
        <div key={day.id} className="card raised">
          <div
            className="flex items-center justify-between"
            style={{
              paddingBottom: 8,
              borderBottom: "1px solid var(--line)",
              marginBottom: 4,
            }}
          >
            {editing ? (
              <DaySelector
                routineId={routineId}
                routineDayId={day.id}
                dayOfWeek={day.dayOfWeek}
              />
            ) : (
              <div className="ex-name" style={{ fontSize: 15 }}>
                {DIA_LABEL[day.dayOfWeek as Dia] ?? day.dayOfWeek}
              </div>
            )}
            {day.exercises.length > 0 && (
              <Link
                href={`/routines/${routineId}/log/${day.dayOfWeek}`}
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
              <ExerciseRow
                key={re.id}
                routineId={routineId}
                exercise={re}
                editing={editing}
              />
            ))}
            {day.exercises.length === 0 && (
              <p className="empty" style={{ padding: "12px 0" }}>
                Sin ejercicios asignados.
              </p>
            )}
          </div>

          {editing && (
            <ExercisePicker
              routineId={routineId}
              routineDayId={day.id}
              exercises={exercises}
            />
          )}
        </div>
      ))}
    </>
  );
}

function ExerciseRow({
  routineId,
  exercise,
  editing,
}: {
  routineId: string;
  exercise: RoutineExerciseVM;
  editing: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [sets, setSets] = useState(String(exercise.targetSets));
  const [reps, setReps] = useState(exercise.targetReps);

  function saveTargets() {
    const fd = new FormData();
    fd.set("targetSets", sets);
    fd.set("targetReps", reps);
    startTransition(() => {
      updateRoutineExerciseTargets(routineId, exercise.id, fd);
    });
  }

  if (!editing) {
    return (
      <div className="ex-row">
        <div>
          <div className="ex-name">{exercise.exerciseName}</div>
          <div className="ex-meta">
            {exercise.targetSets} series x {exercise.targetReps} reps
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ex-row" style={{ alignItems: "flex-start" }}>
      <div style={{ flex: 1 }}>
        <div className="ex-name">{exercise.exerciseName}</div>
        <div className="flex gap-2" style={{ marginTop: 6, alignItems: "center" }}>
          <input
            type="number"
            inputMode="numeric"
            min={1}
            value={sets}
            onChange={(e) => setSets(e.target.value)}
            onBlur={saveTargets}
            className="input"
            style={{ width: 64 }}
            aria-label="Series objetivo"
          />
          <span className="ex-meta">series x</span>
          <input
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            onBlur={saveTargets}
            className="input"
            style={{ width: 80 }}
            aria-label="Reps objetivo"
            placeholder="8-12"
          />
          <span className="ex-meta">reps{pending ? " · guardando…" : ""}</span>
        </div>
      </div>
      <form action={removeExerciseFromDay.bind(null, routineId, exercise.id)}>
        <button type="submit" className="link-danger" style={{ fontSize: 12 }}>
          Quitar
        </button>
      </form>
    </div>
  );
}
