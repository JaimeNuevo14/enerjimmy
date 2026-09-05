"use client";

import { useEffect, useMemo, useState } from "react";
import ExerciseLogCard from "./ExerciseLogCard";
import FinalizeRoutineButton from "./FinalizeRoutineButton";
import {
  clearDraft,
  clearOtherDrafts,
  draftStorageKey,
  emptyCardio,
  loadDraft,
  saveDraft,
  todayISO,
  type DayDraft,
  type ExerciseDraftState,
} from "./draft";

// Purely informational "last time" hint shown at the top of an
// ExerciseLogCard — read-only, never touches draft state.
export type PreviousLog =
  | { date: Date; sets: { weightKg: number; reps: number }[] }
  | {
      date: Date;
      cardio: {
        durationSeconds: number | null;
        distanceKm: number | null;
        speedKmh: number | null;
        paceSecPerKm: number | null;
      };
    }
  | null;

export type ExerciseMeta = {
  routineExerciseId: string;
  exerciseId: string;
  exerciseName: string;
  muscleGroup: string;
  targetSets: number;
  targetReps: string;
  previous: PreviousLog;
};

function defaultStateFor(ex: ExerciseMeta): ExerciseDraftState {
  return ex.muscleGroup === "cardio"
    ? { kind: "cardio", cardio: emptyCardio() }
    : {
        kind: "strength",
        sets: Array.from({ length: ex.targetSets }, () => ({ weight: "", reps: "" })),
      };
}

function buildInitialDraft(exercises: ExerciseMeta[]): DayDraft {
  const initial: DayDraft = {};
  for (const ex of exercises) {
    initial[ex.routineExerciseId] = defaultStateFor(ex);
  }
  return initial;
}

// The whole day's in-progress logging state lives here, lifted above every
// ExerciseLogCard, and is mirrored into localStorage so a closed tab/crashed
// browser can recover it. Nothing reaches the database until the "Finalizar
// rutina" button below sends the full draft to finalizeRoutineDay.
export default function DayLogSession({
  routineId,
  day,
  routineDayId,
  exercises,
}: {
  routineId: string;
  day: string;
  routineDayId: string;
  exercises: ExerciseMeta[];
}) {
  const dateISO = useMemo(() => todayISO(), []);
  const storageKey = useMemo(
    () => draftStorageKey(routineId, day, dateISO),
    [routineId, day, dateISO]
  );

  const [draft, setDraft] = useState<DayDraft>(() => buildInitialDraft(exercises));
  const [ready, setReady] = useState(false);

  // Rehydrate from localStorage once on mount, merging into the freshly
  // built defaults so a routine changed since the last draft (an exercise
  // added/removed) never crashes on a missing/stale key.
  useEffect(() => {
    clearOtherDrafts(routineId, day, storageKey);
    const stored = loadDraft(storageKey);
    if (stored) {
      setDraft((current) => {
        const merged: DayDraft = { ...current };
        for (const key of Object.keys(merged)) {
          if (stored[key]) merged[key] = stored[key];
        }
        return merged;
      });
    }
    setReady(true);
    // Only re-run if we're now looking at a different draft slot entirely.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  // Persist on every change, once past the initial hydration (so we never
  // clobber a just-loaded draft with the blank defaults from first render).
  useEffect(() => {
    if (!ready) return;
    saveDraft(storageKey, draft);
  }, [draft, ready, storageKey]);

  function updateExercise(routineExerciseId: string, next: ExerciseDraftState) {
    setDraft((prev) => ({ ...prev, [routineExerciseId]: next }));
  }

  function handleFinalized() {
    clearDraft(storageKey);
  }

  return (
    <>
      {exercises.map((ex) => (
        <ExerciseLogCard
          key={ex.routineExerciseId}
          exerciseName={ex.exerciseName}
          muscleGroup={ex.muscleGroup}
          targetSets={ex.targetSets}
          targetReps={ex.targetReps}
          previous={ex.previous}
          state={draft[ex.routineExerciseId] ?? defaultStateFor(ex)}
          onChange={(next) => updateExercise(ex.routineExerciseId, next)}
        />
      ))}

      <FinalizeRoutineButton
        routineId={routineId}
        day={day}
        routineDayId={routineDayId}
        exercises={exercises}
        draft={draft}
        onFinalized={handleFinalized}
      />
    </>
  );
}
