"use client";

import { useTransition } from "react";
import { setRoutineDayOfWeek } from "@/lib/actions";
import { DIAS, DIA_LABEL } from "@/lib/days";

export default function DaySelector({
  routineId,
  routineDayId,
  dayOfWeek,
}: {
  routineId: string;
  routineDayId: string;
  dayOfWeek: string;
}) {
  const [pending, startTransition] = useTransition();
  const action = setRoutineDayOfWeek.bind(null, routineId, routineDayId);

  return (
    <select
      className="day-select"
      value={dayOfWeek}
      disabled={pending}
      aria-label="Día de la semana"
      onChange={(e) => {
        const fd = new FormData();
        fd.set("dayOfWeek", e.target.value);
        startTransition(() => {
          action(fd);
        });
      }}
    >
      {DIAS.map((dia) => (
        <option key={dia} value={dia}>
          {DIA_LABEL[dia]}
        </option>
      ))}
    </select>
  );
}
