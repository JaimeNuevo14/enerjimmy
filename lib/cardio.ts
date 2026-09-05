// Small shared helpers for displaying cardio numbers, used by both the
// history page and the "Última vez" hint on the day-logging page.

// Cardio rows logged before "velocidad media (km/h)" replaced the old
// "ritmo (min:seg/km)" input only have paceSecPerKm — this derives an
// equivalent speed from it so those old rows still show a sensible number
// instead of a blank.
export function effectiveSpeedKmh(
  speedKmh: number | null | undefined,
  paceSecPerKm: number | null | undefined
): number | null {
  if (typeof speedKmh === "number" && Number.isFinite(speedKmh) && speedKmh > 0) {
    return speedKmh;
  }
  if (typeof paceSecPerKm === "number" && Number.isFinite(paceSecPerKm) && paceSecPerKm > 0) {
    return 3600 / paceSecPerKm;
  }
  return null;
}

export function formatMinSec(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.round(totalSeconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

// "10" or "10.5" — trims a trailing ".0" without extra decimals otherwise.
export function formatSpeedKmh(speedKmh: number) {
  const rounded = Math.round(speedKmh * 10) / 10;
  return rounded % 1 === 0 ? String(rounded) : rounded.toFixed(1);
}
