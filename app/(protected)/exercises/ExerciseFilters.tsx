"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { MUSCLE_LABEL, EQUIPMENT_LABEL } from "@/lib/days";

export default function ExerciseFilters({
  muscleGroups,
  equipmentList,
}: {
  muscleGroups: string[];
  equipmentList: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  }

  const activeMuscle = searchParams.get("muscleGroup") ?? "";

  return (
    <div className="flex flex-col gap-3">
      <div className="search-input" style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span>🔍</span>
        <input
          placeholder="Buscar ejercicio…"
          defaultValue={searchParams.get("q") ?? ""}
          onChange={(e) => update("q", e.target.value)}
          style={{
            border: "none",
            background: "transparent",
            outline: "none",
            width: "100%",
            font: "inherit",
            color: "var(--ink)",
          }}
        />
      </div>

      <div className="chips">
        <button
          type="button"
          className={`chip ${activeMuscle === "" ? "on" : ""}`}
          onClick={() => update("muscleGroup", "")}
        >
          Todos
        </button>
        {muscleGroups.map((mg) => (
          <button
            key={mg}
            type="button"
            className={`chip ${activeMuscle === mg ? "on" : ""}`}
            onClick={() => update("muscleGroup", activeMuscle === mg ? "" : mg)}
          >
            {MUSCLE_LABEL[mg] ?? mg}
          </button>
        ))}
      </div>

      <select
        defaultValue={searchParams.get("equipment") ?? ""}
        onChange={(e) => update("equipment", e.target.value)}
        className="select"
      >
        <option value="">Todo el equipo</option>
        {equipmentList.map((eq) => (
          <option key={eq} value={eq}>
            {EQUIPMENT_LABEL[eq] ?? eq}
          </option>
        ))}
      </select>
    </div>
  );
}
