"use client";

import { useRouter, usePathname } from "next/navigation";

export default function ExercisePicker({
  exercises,
  selected,
}: {
  exercises: { id: string; name: string }[];
  selected?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <select
      defaultValue={selected}
      onChange={(e) => router.push(`${pathname}?exerciseId=${e.target.value}`)}
      className="select"
    >
      {exercises.map((ex) => (
        <option key={ex.id} value={ex.id}>
          {ex.name}
        </option>
      ))}
    </select>
  );
}
