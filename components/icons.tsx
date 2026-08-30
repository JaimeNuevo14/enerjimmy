// Original, hand-drawn line-icons used by the exercise picker.
// Simple geometric glyphs (not photos/traced art), one per muscle group and
// one per equipment type, drawn to fit the app's existing line-art / accent
// color visual language. `currentColor` is used throughout so they inherit
// color from their container (see .muscle-card / .picker-ex-icon in
// globals.css).

import type { ReactNode, SVGProps } from "react";

const base: SVGProps<SVGSVGElement> = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function MuscleIcon({ group, ...props }: { group: string } & SVGProps<SVGSVGElement>) {
  switch (group) {
    case "pecho":
      // Chest plate: two rounded panels meeting at the sternum line.
      return (
        <svg {...base} {...props}>
          <path d="M12 5c-2.2-1.4-5-1.4-7 .3-1 3-.6 7.4 1.6 11 1.8-.6 3.7-2 5.4-4" />
          <path d="M12 5c2.2-1.4 5-1.4 7 .3 1 3 .6 7.4-1.6 11-1.8-.6-3.7-2-5.4-4" />
          <path d="M12 5v8" />
        </svg>
      );
    case "espalda":
      // Lat pulldown silhouette: a V of two wing-like strokes.
      return (
        <svg {...base} {...props}>
          <path d="M12 3v18" />
          <path d="M12 6 4 4c-1 3.5.2 8 4 10.5L12 17" />
          <path d="M12 6l8-2c1 3.5-.2 8-4 10.5L12 17" />
        </svg>
      );
    case "hombros":
      // Two deltoid caps joined by a collar curve.
      return (
        <svg {...base} {...props}>
          <circle cx="6.5" cy="8" r="2.6" />
          <circle cx="17.5" cy="8" r="2.6" />
          <path d="M6.5 10.6C7.5 15 9.5 17 12 17s4.5-2 5.5-6.4" />
        </svg>
      );
    case "biceps":
      // Flexed arm with a bicep bump.
      return (
        <svg {...base} {...props}>
          <path d="M6 18c0-5 1-8 4-9.5C13 7 16 8 17 10.5c.8 2-.2 3.5-2 3.5" />
          <path d="M6 18h4" />
          <path d="M9 8.5c-2 .5-3.2 2.2-3 4.5" />
        </svg>
      );
    case "triceps":
      // Extended arm, triangular tricep highlight.
      return (
        <svg {...base} {...props}>
          <path d="M5 7l6 2 8-2" />
          <path d="M11 9v9" />
          <path d="M11 9l4 3-1 5" />
        </svg>
      );
    case "cuadriceps":
      // Front-leg outline with quad striations.
      return (
        <svg {...base} {...props}>
          <path d="M9 3c-1 3-1 5-1.4 8-.4 3-.1 6-1.1 10h3l1-7 1.5 7h3c-.6-4.5-.5-7.5-1-11-.4-3-1-5.5-2-7z" />
          <path d="M9.5 6v9" />
          <path d="M12 6.5v9" />
        </svg>
      );
    case "isquiotibiales":
      // Back-leg outline with hamstring curve.
      return (
        <svg {...base} {...props}>
          <path d="M10 3c2 2 2.6 4.5 2.6 8 0 3.5.6 6 1.4 10h-3l-1-8-2 8H5c1-4 1.2-7 1.2-10C6.2 7.5 7.5 4.8 10 3z" />
          <path d="M8 8.5c1.2 1.5 1.2 4 .6 6.5" />
        </svg>
      );
    case "gluteos":
      // Two rounded glute lobes.
      return (
        <svg {...base} {...props}>
          <path d="M12 5c-3.5-1.6-8-.2-8.6 4-.5 3.6.8 8 3.6 9.8 1.6-1 2.5-2.6 3-4.6" />
          <path d="M12 5c3.5-1.6 8-.2 8.6 4 .5 3.6-.8 8-3.6 9.8-1.6-1-2.5-2.6-3-4.6" />
          <path d="M12 5v9" />
        </svg>
      );
    case "gemelos":
      // Calf outline with a diamond bulge.
      return (
        <svg {...base} {...props}>
          <path d="M10 3c1.8 1.6 2.6 3.7 2.4 6.3-.2 2.7-1.6 3.7-1.6 6 0 2 .6 3.7 1.6 5.7H9c-.7-2-1-3.7-1-5.7 0-2.3-.5-2.8-1-5C6.4 7.5 7.6 4.8 10 3z" />
          <path d="M8.4 9.5c.6.9 1.6 1.4 2.8 1.4s2.1-.5 2.6-1.3" />
        </svg>
      );
    case "abdomen":
      // Six-pack grid.
      return (
        <svg {...base} {...props}>
          <rect x="8" y="4" width="3.4" height="4.2" rx="1" />
          <rect x="12.6" y="4" width="3.4" height="4.2" rx="1" />
          <rect x="8" y="9.4" width="3.4" height="4.2" rx="1" />
          <rect x="12.6" y="9.4" width="3.4" height="4.2" rx="1" />
          <rect x="8" y="14.8" width="3.4" height="4.2" rx="1" />
          <rect x="12.6" y="14.8" width="3.4" height="4.2" rx="1" />
        </svg>
      );
    case "cardio":
      // Heart with a pulse line through it.
      return (
        <svg {...base} {...props}>
          <path d="M12 20s-7-4.4-9.3-9C.9 7.6 3 4 6.6 4c2 0 3.4 1.1 4.4 2.6C12 5.1 13.4 4 15.4 4 19 4 21.1 7.6 21.3 11 19 15.6 12 20 12 20z" />
          <path d="M5 12h3l1.5-3 2 5 1.5-2.5H19" />
        </svg>
      );
    case "cuerpo_completo":
      // Simple full-body stick figure.
      return (
        <svg {...base} {...props}>
          <circle cx="12" cy="4.2" r="1.9" />
          <path d="M12 7v7" />
          <path d="M12 9 6 12" />
          <path d="M12 9l6 3" />
          <path d="M12 14l-4 6" />
          <path d="M12 14l4 6" />
        </svg>
      );
    default:
      return (
        <svg {...base} {...props}>
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
  }
}

// Improved fallback illustrations for exercises that have no matched
// Everkinetic photo (see lib/exerciseImages.ts). Each is a larger, clearer
// front-facing human body silhouette (original line art, not traced from any
// copyrighted reference) with the relevant muscle region filled in the app's
// accent color -- the same idea as an anatomical highlight diagram, at a size
// where the highlighted area is actually legible.
const bodyOutline =
  "M32 6.5c-3 0-5.4 2.4-5.4 5.4 0 2 1.1 3.8 2.7 4.7-4.7 1.4-8.3 4.6-9.9 8.8" +
  "l-4.6 12c-.7 1.9.7 3.9 2.7 3.9 1.2 0 2.3-.7 2.8-1.9l3-7.4-1.3 15.4-1.8 20.6" +
  "c-.2 2 1.4 3.7 3.4 3.7 1.7 0 3.1-1.2 3.4-2.9l3-16.4 1.9 0 3 16.4c.3 1.7 1.7 2.9 3.4 2.9" +
  "2 0 3.6-1.7 3.4-3.7l-1.8-20.6-1.3-15.4 3 7.4c.5 1.2 1.6 1.9 2.8 1.9 2 0 3.4-2 2.7-3.9" +
  "l-4.6-12c-1.6-4.2-5.2-7.4-9.9-8.8 1.6-.9 2.7-2.7 2.7-4.7 0-3-2.4-5.4-5.4-5.4Z";

function BodyBase(props: SVGProps<SVGPathElement>) {
  return (
    <path
      d={bodyOutline}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinejoin="round"
      opacity={0.55}
      {...props}
    />
  );
}

export function MuscleSilhouette({
  group,
  ...props
}: { group: string } & SVGProps<SVGSVGElement>) {
  const highlight: SVGProps<SVGPathElement> = {
    fill: "var(--accent, currentColor)",
    fillOpacity: 0.85,
    stroke: "none",
  };
  let region: ReactNode = null;
  switch (group) {
    case "pecho":
      region = <path d="M20 20c3.6-2.6 8-2.6 11.7 0 .3 4.3-.4 8-2 10.8-3.5-.5-6.8-2.3-9.7-5.2-.5-2-.5-3.9 0-5.6Z M44 20c-3.6-2.6-8-2.6-11.7 0-.3 4.3.4 8 2 10.8 3.5-.5 6.8-2.3 9.7-5.2.5-2 .5-3.9 0-5.6Z" {...highlight} />;
      break;
    case "espalda":
      region = <path d="M22 17c3.3 3 6.6 4.6 10 4.6s6.7-1.6 10-4.6c1.6 5.5 1.9 11.7 1 18.8-3.9 2-7.6 3-11 3s-7.1-1-11-3c-.9-7.1-.6-13.3 1-18.8Z" {...highlight} />;
      break;
    case "hombros":
      region = (
        <>
          <path d="M14.5 21.5a5.6 5.6 0 1 1 8.3 6.7c-2.6-.4-5-1.9-6.9-4.2a5.6 5.6 0 0 1-1.4-2.5Z" {...highlight} />
          <path d="M49.5 21.5a5.6 5.6 0 1 0-8.3 6.7c2.6-.4 5-1.9 6.9-4.2a5.6 5.6 0 0 0 1.4-2.5Z" {...highlight} />
        </>
      );
      break;
    case "biceps":
      region = (
        <>
          <path d="M13 24c-.6 3.6-.6 7.5.3 11.6a4.3 4.3 0 0 0 7.9-2c-.5-3.4-.4-6.7.4-9.9-3-1-5.9-1-8.6.3Z" {...highlight} />
          <path d="M51 24c.6 3.6.6 7.5-.3 11.6a4.3 4.3 0 0 1-7.9-2c.5-3.4.4-6.7-.4-9.9 3-1 5.9-1 8.6.3Z" {...highlight} />
        </>
      );
      break;
    case "triceps":
      region = (
        <>
          <path d="M14 25c-1 4.3-1.2 9-.7 14.2 2.4 1.1 5 .6 6.6-1.6-.6-4.7-.5-9.3.6-13.8-2.1-.6-4.3-.4-6.5 1.2Z" {...highlight} />
          <path d="M50 25c1 4.3 1.2 9 .7 14.2-2.4 1.1-5 .6-6.6-1.6.6-4.7.5-9.3-.6-13.8 2.1-.6 4.3-.4 6.5 1.2Z" {...highlight} />
        </>
      );
      break;
    case "cuadriceps":
      region = (
        <>
          <path d="M25 46c-.4 5.6-1 11-2.2 16.6h5.7l1.3-13 .1 13h1.4c-.3-5.6-.5-11.1-.4-16.7-2-.6-4-.6-5.9.1Z" {...highlight} />
          <path d="M39 46c.4 5.6 1 11 2.2 16.6h-5.7l-1.3-13-.1 13h-1.4c.3-5.6.5-11.1.4-16.7 2-.6 4-.6 5.9.1Z" {...highlight} />
        </>
      );
      break;
    case "isquiotibiales":
      region = (
        <>
          <path d="M25 46c-.4 5.6-1 11-2.2 16.6h5.7l1.3-13 .1 13h1.4c-.3-5.6-.5-11.1-.4-16.7-2-.6-4-.6-5.9.1Z" {...highlight} opacity={0.5} />
          <path d="M39 46c.4 5.6 1 11 2.2 16.6h-5.7l-1.3-13-.1 13h-1.4c.3-5.6.5-11.1.4-16.7 2-.6 4-.6 5.9.1Z" {...highlight} opacity={0.5} />
          <path d="M23 50c1.8 4.6 1.8 9 0 13.5M41 50c-1.8 4.6-1.8 9 0 13.5" stroke="var(--accent, currentColor)" strokeWidth={1.6} fill="none" strokeLinecap="round" />
        </>
      );
      break;
    case "gluteos":
      region = <path d="M20 40.5c3.6-2.3 8-2.6 12-1 4-1.6 8.4-1.3 12 1 .6 3-.1 5.9-2.1 8-3.3-.6-6.6-.5-9.9.2-3.3-.7-6.6-.8-9.9-.2-2-2.1-2.7-5-2.1-8Z" {...highlight} />;
      break;
    case "gemelos":
      region = (
        <>
          <path d="M25.5 54c-.6 3-1.3 6-2.3 8.9 2.3.9 4.7.6 6.5-1-.1-2.6.2-5.2.9-7.7-1.6-.9-3.3-1-5.1-.2Z" {...highlight} />
          <path d="M38.5 54c.6 3 1.3 6 2.3 8.9-2.3.9-4.7.6-6.5-1 .1-2.6-.2-5.2-.9-7.7 1.6-.9 3.3-1 5.1-.2Z" {...highlight} />
        </>
      );
      break;
    case "abdomen":
      region = (
        <g {...highlight}>
          <rect x="27" y="29" width="4.6" height="5.4" rx="1" />
          <rect x="32.4" y="29" width="4.6" height="5.4" rx="1" />
          <rect x="27" y="35.2" width="4.6" height="5.4" rx="1" />
          <rect x="32.4" y="35.2" width="4.6" height="5.4" rx="1" />
          <rect x="27" y="41.4" width="4.6" height="5.4" rx="1" />
          <rect x="32.4" y="41.4" width="4.6" height="5.4" rx="1" />
        </g>
      );
      break;
    case "cardio":
      region = (
        <path
          d="M32 26c-2.4-3.4-6.9-4.4-10-1.7-3.2 2.8-3.3 7.7-.3 11.4C24.6 39.5 28.6 42 32 44c3.4-2 7.4-4.5 10.3-8.3 3-3.7 2.9-8.6-.3-11.4-3.1-2.7-7.6-1.7-10 1.7Z"
          {...highlight}
        />
      );
      break;
    case "cuerpo_completo":
      return (
        <svg viewBox="0 0 64 72" {...props}>
          <BodyBase />
          <path d={bodyOutline} fill="var(--accent, currentColor)" fillOpacity={0.28} stroke="none" />
        </svg>
      );
    default:
      region = null;
  }
  return (
    <svg viewBox="0 0 64 72" {...props}>
      <BodyBase />
      {region}
    </svg>
  );
}

export function EquipmentIcon({ type, ...props }: { type: string } & SVGProps<SVGSVGElement>) {
  switch (type) {
    case "barra":
      // Barbell: bar with plates on each end.
      return (
        <svg {...base} {...props}>
          <path d="M2 12h2.5M21.5 12H19" />
          <rect x="4.5" y="8" width="2.4" height="8" rx="0.8" />
          <rect x="17.1" y="8" width="2.4" height="8" rx="0.8" />
          <path d="M7 12h10" />
        </svg>
      );
    case "mancuerna":
      // Dumbbell.
      return (
        <svg {...base} {...props}>
          <rect x="2.5" y="9.5" width="3" height="5" rx="1" />
          <rect x="18.5" y="9.5" width="3" height="5" rx="1" />
          <path d="M5.5 12h13" />
        </svg>
      );
    case "maquina":
      // Machine: a frame with a weight stack.
      return (
        <svg {...base} {...props}>
          <rect x="3" y="4" width="7" height="16" rx="1" />
          <path d="M5.5 8h2M5.5 11h2M5.5 14h2" />
          <path d="M12 20V8l7-4v16" />
        </svg>
      );
    case "peso_corporal":
      // Bodyweight: a simple person silhouette.
      return (
        <svg {...base} {...props}>
          <circle cx="12" cy="4.5" r="2" />
          <path d="M7 11l5-2.5L17 11" />
          <path d="M12 8.5V15" />
          <path d="M12 15l-3.5 5.5M12 15l3.5 5.5" />
        </svg>
      );
    case "polea":
      // Cable pulley: wheel with cable running over it.
      return (
        <svg {...base} {...props}>
          <circle cx="12" cy="7" r="3.4" />
          <path d="M12 10.4V16" />
          <path d="M9 20h6" />
          <path d="M12 16l-2.5 4M12 16l2.5 4" />
        </svg>
      );
    case "kettlebell":
      // Kettlebell shape: handle arc + round base.
      return (
        <svg {...base} {...props}>
          <path d="M9 8.5c0-2.2 1.3-4 3-4s3 1.8 3 4" />
          <path d="M7.5 12.5a4.5 5 0 1 0 9 0 4.5 5 0 1 0-9 0Z" />
        </svg>
      );
    case "banda":
      // Resistance band: a looped wavy ribbon.
      return (
        <svg {...base} {...props}>
          <path d="M4 8c3-3 6 3 9 0s6-3 7 0" />
          <path d="M4 15c3-3 6 3 9 0s6-3 7 0" />
        </svg>
      );
    default:
      return (
        <svg {...base} {...props}>
          <rect x="4" y="4" width="16" height="16" rx="3" />
        </svg>
      );
  }
}
