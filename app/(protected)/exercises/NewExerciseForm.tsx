"use client";

import { useState, useRef } from "react";
import { createCustomExercise } from "@/lib/actions";
import { MUSCLE_LABEL, EQUIPMENT_LABEL } from "@/lib/days";

export default function NewExerciseForm({
  muscleGroups,
  equipmentList,
}: {
  muscleGroups: string[];
  equipmentList: string[];
}) {
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="card raised">
      <button
        onClick={() => setOpen((o) => !o)}
        className="btn btn-ghost btn-block"
        type="button"
      >
        {open ? "− Cancelar" : "+ Añadir ejercicio propio"}
      </button>

      {open && (
        <form
          ref={formRef}
          action={async (formData) => {
            await createCustomExercise(formData);
            formRef.current?.reset();
            setOpen(false);
          }}
          className="flex flex-col gap-2 mt-3"
        >
          <input
            name="name"
            required
            placeholder="Nombre del ejercicio"
            className="input"
          />
          <div className="flex gap-2">
            <select name="muscleGroup" required className="select flex-1">
              {muscleGroups.map((mg) => (
                <option key={mg} value={mg}>
                  {MUSCLE_LABEL[mg] ?? mg}
                </option>
              ))}
            </select>
            <select name="equipment" required className="select flex-1">
              {equipmentList.map((eq) => (
                <option key={eq} value={eq}>
                  {EQUIPMENT_LABEL[eq] ?? eq}
                </option>
              ))}
            </select>
          </div>
          <select name="category" className="select">
            <option value="compuesto">Compuesto</option>
            <option value="aislamiento">Aislamiento</option>
          </select>
          <button type="submit" className="btn btn-accent btn-block">
            Guardar ejercicio
          </button>
        </form>
      )}
    </div>
  );
}
