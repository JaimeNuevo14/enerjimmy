# Créditos de ilustraciones de ejercicios

Muchas de las ilustraciones que aparecen junto a los ejercicios en el
selector de ejercicios (`app/(protected)/routines/[id]/ExercisePicker.tsx`)
y en la biblioteca de ejercicios (`app/(protected)/exercises/page.tsx`)
provienen del proyecto de código abierto **[workout-guide](https://github.com/bryllim/workout-guide)**
(paquete npm `@bryllim/workout-guide`) de Bryl Lim.

- El código de ese proyecto está bajo licencia MIT.
- Las ilustraciones (`assets/`) están bajo licencia
  **[Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)](https://creativecommons.org/licenses/by-sa/4.0/)**.
- Parte de esas ilustraciones son adaptaciones rasterizadas de obras de
  **[Everkinetic](https://github.com/everkinetic/data)**, también bajo
  CC BY-SA 4.0. La atribución exacta de cada pieza (fuente, autor, cambios
  realizados) está registrada en el `manifest.json` del paquete
  `@bryllim/workout-guide`.

Las imágenes usadas en esta aplicación están copiadas localmente en
`public/exercise-images/` (una PNG por ejercicio, 512×512, fondo
transparente) para no depender de ninguna red o CDN en tiempo de ejecución.
El mapeo entre cada ejercicio en español de `prisma/seed.ts` y su
ilustración correspondiente está en `lib/exerciseImages.ts`.

De los 177 ejercicios sembrados, 138 tienen una ilustración real
correspondiente (129 imágenes distintas, algunas reutilizadas entre
variantes muy similares del mismo movimiento). Los 39 ejercicios restantes
no tienen un equivalente confiable en el dataset y usan en su lugar un
ícono de silueta corporal mejorado (diseño propio, ver
`components/icons.tsx`, función `MuscleSilhouette`), que resalta la zona
muscular correspondiente.

En cumplimiento de la licencia CC BY-SA 4.0, esta atribución también se
muestra de forma visible (aunque discreta) dentro de la aplicación: al pie
del selector de ejercicios y al pie de la página de biblioteca de
ejercicios.

Si redistribuyes o modificas estas imágenes, debes mantener esta
atribución y distribuir tus adaptaciones bajo la misma licencia
(CC BY-SA 4.0).
