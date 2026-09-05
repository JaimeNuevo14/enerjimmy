"use client";

import type { CardioEntryDraft, ExerciseDraftState, StrengthSetDraft } from "./draft";
import { emptyCardio } from "./draft";

// Purely a controlled view over the shared draft state held by
// DayLogSession — no server calls happen here anymore. Every keystroke goes
// straight into the lifted-up draft (and from there into localStorage);
// nothing is written to the database until "Finalizar rutina" is pressed.
export default function ExerciseLogCard({
  exerciseName,
  muscleGroup,
  targetSets,
  targetReps,
  state,
  onChange,
}: {
  exerciseName: string;
  muscleGroup: string;
  targetSets: number;
  targetReps: string;
  state: ExerciseDraftState;
  onChange: (next: ExerciseDraftState) => void;
}) {
  if (muscleGroup === "cardio") {
    const cardio = state.kind === "cardio" ? state.cardio : emptyCardio();
    return (
      <CardioLogCard
        exerciseName={exerciseName}
        cardio={cardio}
        onChange={(next) => onChange({ kind: "cardio", cardio: next })}
      />
    );
  }

  const sets = state.kind === "strength" ? state.sets : [];
  return (
    <StrengthLogCard
      exerciseName={exerciseName}
      targetSets={targetSets}
      targetReps={targetReps}
      sets={sets}
      onChange={(next) => onChange({ kind: "strength", sets: next })}
    />
  );
}

function StrengthLogCard({
  exerciseName,
  targetSets,
  targetReps,
  sets,
  onChange,
}: {
  exerciseName: string;
  targetSets: number;
  targetReps: string;
  sets: StrengthSetDraft[];
  onChange: (sets: StrengthSetDraft[]) => void;
}) {
  function updateRow(i: number, field: keyof StrengthSetDraft, value: string) {
    onChange(sets.map((r, idx) => (idx === i ? { ...r, [field]: value } : r)));
  }

  function addRow() {
    onChange([...sets, { weight: "", reps: "" }]);
  }

  function removeRow(i: number) {
    onChange(sets.filter((_, idx) => idx !== i));
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
            gridTemplateColumns: "28px 1fr 1fr 32px 32px",
            gap: 10,
          }}
        >
          <div className="field-label"></div>
          <div className="field-label">Peso (kg)</div>
          <div className="field-label">Reps</div>
          <div className="field-label"></div>
          <div className="field-label"></div>
        </div>
        {sets.map((row, i) => {
          const done = row.weight !== "" && row.reps !== "";
          return (
            <div key={i} className="set-row has-delete">
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
              <button
                type="button"
                className="set-del"
                onClick={() => removeRow(i)}
                aria-label={`Eliminar serie ${i + 1}`}
              >
                ×
              </button>
            </div>
          );
        })}
        {sets.length === 0 && (
          <p className="empty" style={{ padding: "8px 0" }}>
            Sin series todavía.
          </p>
        )}
      </div>

      <button onClick={addRow} type="button" className="btn btn-ghost btn-block">
        + Añadir serie
      </button>
    </div>
  );
}

// Cardio (cinta, elíptica, bicicleta, ...): one session entry with
// tiempo/ritmo/distancia instead of a grid of weight/reps sets. Freely
// editable at any time before finalizing; no add/remove needed since it's
// already just one entry.
function CardioLogCard({
  exerciseName,
  cardio,
  onChange,
}: {
  exerciseName: string;
  cardio: CardioEntryDraft;
  onChange: (next: CardioEntryDraft) => void;
}) {
  function set<K extends keyof CardioEntryDraft>(field: K, value: CardioEntryDraft[K]) {
    onChange({ ...cardio, [field]: value });
  }

  function numInput(field: keyof CardioEntryDraft, placeholder: string) {
    return (
      <input
        type="number"
        inputMode="numeric"
        min={0}
        value={cardio[field]}
        onChange={(e) => set(field, e.target.value)}
        placeholder={placeholder}
      />
    );
  }

  return (
    <div className="card raised flex flex-col gap-3">
      <div>
        <div className="ex-name" style={{ fontSize: 15 }}>{exerciseName}</div>
        <div className="ex-meta">Cardio · una entrada por sesión</div>
      </div>

      <div>
        <div className="field-label">Tiempo (min : seg)</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }} className="set-row">
          {numInput("minutes", "min")}
          {numInput("seconds", "seg")}
        </div>
      </div>

      <div>
        <div className="field-label">Ritmo (min : seg / km)</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }} className="set-row">
          {numInput("paceMin", "min")}
          {numInput("paceSec", "seg")}
        </div>
      </div>

      <div>
        <div className="field-label">Distancia (km)</div>
        <input
          type="number"
          inputMode="decimal"
          step="0.01"
          min={0}
          value={cardio.distance}
          onChange={(e) => set("distance", e.target.value)}
          placeholder="—"
          className="input"
        />
      </div>
    </div>
  );
}
