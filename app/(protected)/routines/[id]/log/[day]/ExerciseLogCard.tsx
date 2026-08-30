"use client";

import { useState } from "react";
import { logSets } from "@/lib/actions";

type SetRow = { weight: string; reps: string };

export default function ExerciseLogCard({
  routineId,
  day,
  routineExerciseId,
  exerciseId,
  exerciseName,
  targetSets,
  targetReps,
}: {
  routineId: string;
  day: string;
  routineExerciseId: string;
  exerciseId: string;
  exerciseName: string;
  targetSets: number;
  targetReps: string;
}) {
  const [rows, setRows] = useState<SetRow[]>(
    Array.from({ length: targetSets }, () => ({ weight: "", reps: "" }))
  );
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  function updateRow(i: number, field: keyof SetRow, value: string) {
    setRows((prev) =>
      prev.map((r, idx) => (idx === i ? { ...r, [field]: value } : r))
    );
    setSaved(false);
  }

  function addRow() {
    setRows((prev) => [...prev, { weight: "", reps: "" }]);
  }

  async function handleSave() {
    const sets = rows
      .filter((r) => r.weight !== "" && r.reps !== "")
      .map((r) => ({ weightKg: parseFloat(r.weight), reps: parseInt(r.reps, 10) }));

    if (sets.length === 0) return;

    setSaving(true);
    const formData = new FormData();
    formData.set("exerciseId", exerciseId);
    formData.set("routineExerciseId", routineExerciseId);
    formData.set("sets", JSON.stringify(sets));

    await logSets(routineId, day, formData);
    setSaving(false);
    setSaved(true);
  }

  return (
    <div className="card raised flex flex-col gap-3">
      <div>
        <div className="ex-name" style={{ fontSize: 15 }}>{exerciseName}</div>
        <div className="ex-meta">
          Objetivo: {targetSets} series x {targetReps} reps
        </div>
      </div>

      <div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "28px 1fr 1fr 32px",
            gap: 10,
          }}
        >
          <div className="field-label"></div>
          <div className="field-label">Peso (kg)</div>
          <div className="field-label">Reps</div>
          <div className="field-label"></div>
        </div>
        {rows.map((row, i) => {
          const done = row.weight !== "" && row.reps !== "";
          return (
            <div key={i} className="set-row">
              <span className="idx">{i + 1}</span>
              <input
                type="number"
                inputMode="decimal"
                step="0.5"
                min={0}
                value={row.weight}
                onChange={(e) => updateRow(i, "weight", e.target.value)}
                placeholder="—"
              />
              <input
                type="number"
                inputMode="numeric"
                min={0}
                value={row.reps}
                onChange={(e) => updateRow(i, "reps", e.target.value)}
                placeholder="—"
              />
              <span className={`set-check ${done ? "done" : ""}`}>
                {done ? "✓" : i + 1}
              </span>
            </div>
          );
        })}
      </div>

      <button onClick={addRow} type="button" className="btn btn-ghost btn-block">
        + Añadir serie
      </button>

      <button
        onClick={handleSave}
        disabled={saving}
        type="button"
        className={`btn btn-block ${saved ? "btn-good" : "btn-accent"}`}
      >
        {saving ? "Guardando..." : saved ? "Guardado ✓" : "Guardar y siguiente ejercicio →"}
      </button>
    </div>
  );
}
