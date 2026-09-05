"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { finalizeRoutineDay, type FinalizeEntry } from "@/lib/actions";
import type { DayDraft } from "./draft";
import type { ExerciseMeta } from "./DayLogSession";

export default function FinalizeRoutineButton({
  routineId,
  day,
  routineDayId,
  exercises,
  draft,
  onFinalized,
}: {
  routineId: string;
  day: string;
  routineDayId: string;
  exercises: ExerciseMeta[];
  draft: DayDraft;
  onFinalized: () => void;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function buildEntries(): FinalizeEntry[] {
    return exercises.map((ex) => {
      const state = draft[ex.routineExerciseId];

      if (ex.muscleGroup === "cardio") {
        const c = state?.kind === "cardio" ? state.cardio : null;
        const durationSeconds =
          c && (c.minutes !== "" || c.seconds !== "")
            ? (parseInt(c.minutes || "0", 10) || 0) * 60 +
              (parseInt(c.seconds || "0", 10) || 0)
            : null;
        const speedKmh =
          c && c.speedKmh !== "" && !Number.isNaN(parseFloat(c.speedKmh))
            ? parseFloat(c.speedKmh)
            : null;
        const distanceKm = c && c.distance !== "" ? parseFloat(c.distance) : null;

        return {
          routineExerciseId: ex.routineExerciseId,
          exerciseId: ex.exerciseId,
          kind: "cardio",
          cardio: { durationSeconds, speedKmh, distanceKm },
        };
      }

      const sets = state?.kind === "strength" ? state.sets : [];
      const validSets = sets
        .filter((r) => r.weight !== "" && r.reps !== "")
        .map((r) => ({ weightKg: parseFloat(r.weight), reps: parseInt(r.reps, 10) }));

      return {
        routineExerciseId: ex.routineExerciseId,
        exerciseId: ex.exerciseId,
        kind: "strength",
        sets: validSets,
      };
    });
  }

  async function handleClick() {
    setLoading(true);
    setMessage(null);

    const entries = buildEntries();
    const result = await finalizeRoutineDay(routineId, day, routineDayId, entries);

    if (!result.ok) {
      setLoading(false);
      setMessage(
        result.message ?? "Todavía no has registrado ninguna serie hoy."
      );
      return;
    }

    onFinalized();
    router.push("/history");
  }

  return (
    <div className="flex flex-col gap-2" style={{ marginTop: 4 }}>
      <button
        onClick={handleClick}
        disabled={loading}
        type="button"
        className="btn btn-accent btn-block"
      >
        {loading ? "Finalizando..." : "Finalizar rutina"}
      </button>
      {message && (
        <p
          style={{
            color: "var(--ink-faint)",
            fontSize: 13,
            textAlign: "center",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}
