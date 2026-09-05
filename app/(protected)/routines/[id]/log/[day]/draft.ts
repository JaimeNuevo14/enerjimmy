// Shared types + localStorage helpers for the "draft until finalize" flow on
// the day-logging page. Nothing here talks to the server: everything a user
// types while logging a day lives only in client state + localStorage until
// "Finalizar rutina" is pressed, at which point the whole draft is sent to
// `finalizeRoutineDay` in one shot (see lib/actions.ts).

export type StrengthSetDraft = { weight: string; reps: string };

export type CardioEntryDraft = {
  minutes: string;
  seconds: string;
  paceMin: string;
  paceSec: string;
  distance: string;
};

export type ExerciseDraftState =
  | { kind: "strength"; sets: StrengthSetDraft[] }
  | { kind: "cardio"; cardio: CardioEntryDraft };

// Keyed by routineExerciseId.
export type DayDraft = Record<string, ExerciseDraftState>;

export function emptyCardio(): CardioEntryDraft {
  return { minutes: "", seconds: "", paceMin: "", paceSec: "", distance: "" };
}

// There is no userId available on the client (session lives server-side),
// so the key is scoped by routine + day + calendar date instead — good
// enough to keep one user's in-progress draft from bleeding into another
// day/routine, and to naturally "expire" once the date rolls over.
export function draftStorageKey(routineId: string, day: string, dateISO: string) {
  return `enerjimmy-draft:${routineId}:${day}:${dateISO}`;
}

export function todayISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

export function loadDraft(key: string): DayDraft | null {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as DayDraft;
  } catch {
    return null;
  }
}

export function saveDraft(key: string, draft: DayDraft) {
  try {
    window.localStorage.setItem(key, JSON.stringify(draft));
  } catch {
    // Private browsing / quota exceeded / storage disabled: the draft just
    // won't survive a reload, but logging in the current tab still works.
  }
}

export function clearDraft(key: string) {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

// Prunes any other stored draft for this same routine + day (i.e. a
// different date) so an old, never-finalized session doesn't resurface
// inside a fresh one for the same day slot.
export function clearOtherDrafts(routineId: string, day: string, keepKey: string) {
  try {
    const prefix = `enerjimmy-draft:${routineId}:${day}:`;
    const toRemove: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k && k.startsWith(prefix) && k !== keepKey) toRemove.push(k);
    }
    toRemove.forEach((k) => window.localStorage.removeItem(k));
  } catch {
    // ignore
  }
}
