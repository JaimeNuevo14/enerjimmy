"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { importSharedRoutine } from "@/lib/actions";

// Clones the shared routine into a brand new one owned by whoever clicks
// this — see importSharedRoutine in lib/actions.ts: it only ever creates
// rows for the current user, never touches the original owner's data.
export default function ImportRoutineButton({ token }: { token: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setMessage(null);

    const result = await importSharedRoutine(token);

    if (!result.ok || !result.routineId) {
      setLoading(false);
      setMessage(result.message ?? "No se pudo guardar la rutina.");
      return;
    }

    router.push(`/routines/${result.routineId}`);
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        className="btn btn-accent btn-block"
        onClick={handleClick}
        disabled={loading}
      >
        {loading ? "Guardando..." : "Guardar esta rutina en mi perfil"}
      </button>
      {message && (
        <p style={{ color: "#c0392b", fontSize: 13, textAlign: "center" }}>
          {message}
        </p>
      )}
    </div>
  );
}
