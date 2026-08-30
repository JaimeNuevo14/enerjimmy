import { MuscleSilhouette } from "@/components/icons";
import { getExerciseImage } from "@/lib/exerciseImages";

/**
 * Shows the real matched Everkinetic illustration for an exercise when one
 * exists (see lib/exerciseImages.ts), otherwise falls back to the improved
 * muscle-group silhouette. Used in the exercise picker and the exercise
 * library so every row has a clear, sizeable visual instead of a tiny
 * generic glyph.
 */
export default function ExerciseVisual({
  name,
  muscleGroup,
  className,
}: {
  name: string;
  muscleGroup: string;
  className?: string;
}) {
  const image = getExerciseImage(name);
  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={image} alt="" aria-hidden="true" className={className} loading="lazy" />
    );
  }
  return <MuscleSilhouette group={muscleGroup} aria-hidden="true" className={className} />;
}
