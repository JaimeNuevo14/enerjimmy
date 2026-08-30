// Service worker minimo para ENERJIMMY.
//
// Objetivo unico: cumplir el criterio de "instalable" de Chrome/Android
// (que exista un service worker con un manejador de "fetch"). Deliberadamente
// NO implementa cache offline de datos: esta es una app con sesion (login) y
// datos en vivo desde Postgres, y cachear respuestas de /api/* o de paginas
// autenticadas podria mostrar informacion vieja o de otro usuario. Por eso
// cada peticion se deja pasar directo a la red (network-only / passthrough).
//
// Si en el futuro se quiere cache real de assets estaticos (JS/CSS/iconos),
// hay que excluir explicitamente /api/* y cualquier ruta autenticada, y usar
// una estrategia network-first con revalidacion cuidadosa.

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Manejador de fetch de solo paso (no intercepta ni cachea nada). Su sola
// presencia satisface el criterio de instalabilidad de los navegadores
// basados en Chromium, sin ningun riesgo de datos obsoletos.
self.addEventListener("fetch", () => {});
