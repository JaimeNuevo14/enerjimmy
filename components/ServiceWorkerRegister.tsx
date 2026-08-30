"use client";

import { useEffect } from "react";

/**
 * Registra el service worker minimo (public/sw.js) en el navegador.
 * Ver public/sw.js para por que es deliberadamente un passthrough sin cache.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Instalar como PWA es una mejora opcional: si el registro falla
      // (navegador sin soporte, contexto no seguro, etc.) la app sigue
      // funcionando normalmente en el navegador.
    });
  }, []);

  return null;
}
