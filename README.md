# ENERJIMMY

Aplicación web (paso 1 de "web primero, app nativa después") para llevar tus
rutinas de gimnasio y tu progreso: crea rutinas por día de la semana, registra
series, peso y repeticiones, y consulta tu historial de progresión por
ejercicio. Pensada para usarse principalmente desde el navegador del móvil.

Cada persona tiene su propia cuenta (solo con su nombre, sin contraseña) y
solo ve sus propias rutinas y registros. La biblioteca de ejercicios es
compartida por todos, más los ejercicios personalizados que cada usuario
añada.

## Stack

- **Next.js 14** (App Router) + TypeScript + Tailwind CSS
- **Prisma ORM** sobre **SQLite** (archivo local `prisma/dev.db`) para
  desarrollo — una base de datos relacional real, sin depender de servicios
  externos
- **Auth.js (NextAuth v5)** con proveedor de credenciales (solo nombre, sin
  contraseña), sesión JWT

## Cómo ejecutarlo en local

```bash
npm install
cp .env.example .env
# Genera un secreto y pégalo en NEXTAUTH_SECRET dentro de .env:
openssl rand -base64 32

npx prisma migrate dev --name init
npx prisma db seed

npm run dev
```

Abre http://localhost:3000, regístrate con tu nombre y empieza a crear tu
rutina.

> **Nota sobre `prisma migrate dev`**: en algunos entornos con la red muy
> restringida (sin acceso al CDN de binarios de Prisma), el comando de
> migración puede no poder descargar su motor. Si te ocurre, este proyecto
> incluye una alternativa 100% equivalente que no depende de ninguna
> descarga externa:
>
> ```bash
> npm run db:setup   # crea prisma/dev.db aplicando prisma/migrations/0_init/migration.sql
> npm run db:seed    # siembra los ejercicios (igual que "prisma db seed")
> ```
>
> Ambos caminos producen exactamente el mismo esquema de base de datos. En una
> máquina con acceso normal a internet, usa siempre `npx prisma migrate dev` /
> `npx prisma db seed`, que es el flujo estándar de Prisma.

## Estructura de datos

`User`, `Exercise` (biblioteca compartida + personalizados), `Routine` →
`RoutineDay` (lunes a domingo) → `RoutineExercise` (series/reps objetivo por
ejercicio y día), y `WorkoutLog` (cada serie registrada: peso, reps, fecha).

## Producción con múltiples usuarios (varios dispositivos)

Para que varios amigos/familiares usen la app desde sus propios móviles a la
vez, SQLite en un solo archivo no es suficiente (no es accesible desde fuera
de este servidor). El cambio es pequeño, unos 5 minutos:

1. Crea una base de datos Postgres gratuita (Neon, Supabase o Vercel
   Postgres).
2. En `prisma/schema.prisma`, cambia `provider = "sqlite"` por
   `provider = "postgresql"` en el bloque `datasource`.
3. Define `DATABASE_URL` con la cadena de conexión de Postgres (como variable
   de entorno en Vercel, o en tu `.env`).
4. Ejecuta `npx prisma migrate deploy` contra esa base de datos.

Con eso, cualquier persona que se registre en la app tendrá sus datos en la
misma base de datos compartida en la nube, cada una viendo solo lo suyo.

## Próximos pasos

- **Desplegar la web**: sube el repositorio a GitHub y conéctalo a
  [Vercel](https://vercel.com) (funciona muy bien con Next.js). Añade ahí las
  variables de entorno (`DATABASE_URL` apuntando a tu Postgres, y
  `NEXTAUTH_SECRET`/`NEXTAUTH_URL`) para que Jaime y el resto puedan entrar
  desde cualquier dispositivo con una URL pública.
- **Convertirla en app móvil nativa**: hay dos caminos razonables. (1) Crear
  una app con **React Native / Expo** que consuma esta misma aplicación como
  backend (las rutas API y la base de datos ya están listas para servir a un
  cliente móvil separado). (2) Envolver la web ya desplegada con
  **Capacitor**, lo que da una app nativa instalable muy rápido reutilizando
  todo el código actual, ideal como paso intermedio antes de invertir en una
  app 100% nativa.

## Limitaciones conocidas (MVP)

- No hay contraseña ni verificación de email — el acceso es solo por nombre,
  pensado para un grupo cerrado de confianza (cualquiera que conozca o
  adivine un nombre registrado podría entrar a esa cuenta).
- Una rutina no tiene un concepto explícito de "activa"; el panel de hoy usa
  siempre la rutina creada más recientemente.
- No hay gráficos de progreso, solo la tabla de historial con mínimo, máximo
  y último peso registrado por ejercicio.
- No se puede reordenar días/ejercicios arrastrando; el orden de alta define
  el orden mostrado.
- Sin tests automatizados — se priorizó tener un flujo completo funcionando
  de principio a fin.

## Créditos de ilustraciones

Las ilustraciones de ejercicios que aparecen en el selector de ejercicios y
en la biblioteca de ejercicios provienen en parte del proyecto de código
abierto [workout-guide](https://github.com/bryllim/workout-guide) de Bryl
Lim (algunas derivadas de [Everkinetic](https://github.com/everkinetic/data)),
licenciadas bajo [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
Ver [CREDITS.md](./CREDITS.md) para el detalle completo de atribución y
cobertura (qué ejercicios tienen ilustración real y cuáles usan el ícono de
silueta de respaldo).
