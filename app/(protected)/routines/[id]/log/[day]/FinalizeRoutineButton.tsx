"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { finalizeRoutineDay } from "@/lib/actions";

export default function FinalizeRoutineButton({
  routineId,
  day,
  routineDayId,
}: {
  routineId: string;
  day: string;
  routineDayId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setMessage(null);

    const result = await finalizeRoutineDay(routineId, day, routineDayId);

    if (!result.ok) {
      setLoading(false);
      setMessage(
        result.message ?? "Todavía no has registrado ninguna serie hoy."
      );
      return;
    }

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
