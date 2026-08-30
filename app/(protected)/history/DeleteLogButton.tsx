"use client";

import { deleteWorkoutLog } from "@/lib/actions";

export default function DeleteLogButton({ logId }: { logId: string }) {
  return (
    <button onClick={() => deleteWorkoutLog(logId)} className="link-danger">
      Borrar
    </button>
  );
}
