import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ENERJIMMY",
    short_name: "ENERJIMMY",
    description:
      "Lleva tus rutinas de gimnasio y tu progreso: series, peso, repeticiones e historial por ejercicio.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#151515",
    theme_color: "#2f9bde",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
