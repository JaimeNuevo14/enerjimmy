"use client";

import { useState } from "react";
import { getOrCreateShareToken } from "@/lib/actions";

// Generates (or reuses) this routine's share link and hands it to whatever
// share surface the device offers — the native share sheet (WhatsApp shows
// up there directly on a phone) or, on desktop, a WhatsApp web-share link
// plus a copyable field as a fallback. Never touches anyone's workout data:
// the only write is the routine's own shareToken column (see
// getOrCreateShareToken in lib/actions.ts).
export default function ShareRoutineButton({
  routineId,
  routineName,
}: {
  routineId: string;
  routineName: string;
}) {
  const [loading, setLoading] = useState(false);
  const [link, setLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    setLoading(true);
    setError(null);

    const result = await getOrCreateShareToken(routineId);
    setLoading(false);

    if (!result.ok || !result.token) {
      setError(result.message ?? "No se pudo compartir la rutina.");
      return;
    }

    const url = `${window.location.origin}/share/${result.token}`;
    setLink(url);
    const message = `Prueba mi rutina "${routineName}" en ENERJIMMY: ${url}`;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "ENERJIMMY", text: message, url });
        return;
      } catch {
        // User dismissed the native share sheet, or it's unsupported for
        // this content — fall back to opening WhatsApp directly below.
      }
    }

    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  }

  async function handleCopy() {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable (older browser / permissions) — the
      // visible read-only field below still lets the user select and copy
      // it by hand.
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        className="btn btn-ghost btn-sm"
        onClick={handleShare}
        disabled={loading}
      >
        {loading ? "Generando enlace..." : "Compartir rutina"}
      </button>

      {error && <p style={{ color: "#c0392b", fontSize: 13 }}>{error}</p>}

      {link && (
        <div className="flex gap-2" style={{ alignItems: "center" }}>
          <input
            readOnly
            value={link}
            className="input"
            style={{ flex: 1, fontSize: 12 }}
            onFocus={(e) => e.target.select()}
            aria-label="Enlace para compartir"
          />
          <button type="button" className="btn btn-ghost btn-sm" onClick={handleCopy}>
            {copied ? "Copiado" : "Copiar"}
          </button>
        </div>
      )}
    </div>
  );
}
