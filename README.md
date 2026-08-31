# ENERJIMMY

Aplicación web (paso 1 de "web primero, app nativa después") para llevar tus
rutinas de gimnasio y tu progreso: crea rutinas por día de la semana, registra
series, peso y repeticiones, y consulta tu historial de progresión por
ejercicio. Pensada para usarse principalmente desde el navegador del móvil.

Cada persona tiene su propia cuenta (nombre + contraseña) y solo ve sus
propias rutinas y registros. La biblioteca de ejercicios es compartida por
todos, más los ejercicios personalizados que cada usuario añada.

## Stack

- **Next.js 14** (App Router) + TypeScript + Tailwind CSS
- **Prisma ORM** sobre **PostgreSQL** — la misma base de datos relacional en
  local, en Neon y en producción, solo cambia `DATABASE_URL`
- **Auth.js (NextAuth v5)** con proveedor de credenciales (nombre +
  contraseña, hasheada con `bcryptjs`), sesión JWT

## Base de datos: Postgres en cualquier entorno

Este proyecto usa Postgres tanto en local como en producción (a diferencia de
una versión anterior que usaba SQLite solo para desarrollo). Necesitas una
cadena de conexión Postgres (`DATABASE_URL`) apunte a donde apunte:

- **Local con Postgres instalado en tu máquina**: crea una base de datos
  vacía (`createdb enerjimmy`) y usa algo como
  `postgresql://usuario:contraseña@localhost:5432/enerjimmy`.
- **Local sin instalar Postgres (recomendado, más simple)**: crea una rama de
  desarrollo gratuita en [Neon](https://neon.tech) y copia su cadena de
  conexión — así tu entorno local ya es idéntico al de producción.
- **Producción**: Neon, Vercel Postgres o Supabase funcionan igual de bien,
  ya que Prisma solo necesita una `DATABASE_URL` de Postgres estándar.

## Cómo ejecutarlo en local

```bash
npm install
cp .env.example .env
# Pega tu cadena de conexión Postgres en DATABASE_URL dentro de .env.

# Genera un secreto y pégalo en NEXTAUTH_SECRET dentro de .env:
openssl rand -base64 32

npx prisma migrate deploy
npx prisma db seed

npm run dev
```

Abre http://localhost:3000, regístrate con tu nombre y empieza a crear tu
rutina.

`npx prisma migrate deploy` + `npx prisma db seed` son los comandos estándar
para dejar lista cualquier base de datos Postgres nueva (sea local, Neon o
cualquier otro proveedor): aplican las migraciones en `prisma/migrations/` y
siembran la biblioteca de ejercicios.

## Desplegar en Vercel

1. En [vercel.com](https://vercel.com), importa el repositorio de GitHub
   (`github.com/JaimeNuevo14/enerjimmy`).
2. En la configuración del proyecto, añade las variables de entorno:
   - `DATABASE_URL`: la cadena de conexión de tu base de datos Neon (u otro
     Postgres).
   - `NEXTAUTH_SECRET`: genera uno con `openssl rand -base64 32`.
   - `NEXTAUTH_URL`: la URL pública del despliegue (p. ej.
     `https://enerjimmy.vercel.app`). Como esta URL solo se conoce después
     del primer despliegue, puedes dejar un valor provisional y actualizarlo
     luego (Vercel también expone `https://<tu-proyecto>.vercel.app`, así que
     normalmente ya sabes la URL de antemano).
3. Despliega. Vercel instala dependencias (`npm install`, que ejecuta
   `prisma generate` automáticamente vía `postinstall`) y construye la app,
   pero **no** aplica migraciones ni siembra datos por ti.
4. Después del primer despliegue, ejecuta una vez, desde tu propia máquina,
   las migraciones y la siembra contra la base de datos de producción:

   ```bash
   export DATABASE_URL="<la misma cadena de conexión de Neon que pusiste en Vercel>"
   npx prisma migrate deploy
   npx prisma db seed
   ```

   (En Windows/PowerShell: `$env:DATABASE_URL="..."` en vez de `export`.)

Con eso, la app en producción ya tiene el esquema y los 177 ejercicios de la
biblioteca, y cualquiera puede registrarse desde la URL pública.

## Estructura de datos

`User`, `Exercise` (biblioteca compartida + personalizados), `Routine` →
`RoutineDay` (lunes a domingo) → `RoutineExercise` (series/reps objetivo por
ejercicio y día), y `WorkoutLog` (cada serie registrada: peso y reps para
ejercicios normales, o tiempo/ritmo/distancia para ejercicios de
`muscleGroup === "cardio"` — un `WorkoutLog` es lo uno o lo otro, nunca
ambos). Al pulsar "Finalizar rutina" se crea un `WorkoutSession` que agrupa
los `WorkoutLog` registrados ese día para ese `RoutineDay` y guarda los
totales ya calculados (peso total movido, series, ejercicios, distancia
cardio) para mostrarlos en Historial sin recalcular.

## Múltiples usuarios (varios dispositivos)

Como la base de datos ya es Postgres alojado (Neon, Supabase o Vercel
Postgres), varios amigos/familiares pueden usar la app desde sus propios
móviles a la vez sin ningún cambio adicional: cualquier persona que se
registre en la app desplegada en Vercel tendrá sus datos en esa misma base de
datos compartida en la nube, cada una viendo solo lo suyo.

## Instalar ENERJIMMY como app en el móvil (PWA)

ENERJIMMY es una **Progressive Web App (PWA)**: se puede "instalar" desde el
navegador del móvil para que aparezca como un icono más en la pantalla de
inicio y se abra a pantalla completa, sin la barra de direcciones del
navegador — sin pasar por ninguna app store.

**Android (Chrome):**

1. Abre la app desplegada en Chrome.
2. Toca el menú (los tres puntos, arriba a la derecha).
3. Elige **"Instalar app"** (o **"Añadir a pantalla de inicio"**, según la
   versión de Chrome).
4. Confirma. El icono de ENERJIMMY aparecerá en la pantalla de inicio y se
   abrirá en su propia ventana, sin la interfaz del navegador.

**iPhone (Safari):**

1. Abre la app desplegada en Safari (tiene que ser Safari, no Chrome — en
   iOS solo Safari puede instalar PWAs en la pantalla de inicio).
2. Toca el botón de **compartir** (el cuadrado con la flecha hacia arriba).
3. Elige **"Añadir a pantalla de inicio"**.
4. Confirma el nombre y toca "Añadir". El icono aparecerá junto a tus demás
   apps.

**¿Qué es (y qué no es) una PWA?**

Es una web que se comporta como una app instalada: tiene su propio icono,
abre sin barra de navegador ("standalone"), y recuerda tu sesión igual que
cualquier pestaña del navegador. Sigue siendo, por dentro, la misma web — no
es una app nativa distribuida por Google Play o la App Store, no tiene acceso
a APIs nativas del teléfono más allá de lo que ya permite un navegador, y
(en esta implementación) **no funciona sin conexión**: como los datos y el
login viven en la base de datos en la nube, se deja deliberadamente sin cache
todo lo que no sea el icono/estilos básicos, para evitar mostrar datos
desactualizados o de otra sesión.

## Próximos pasos

- **Desplegar la web**: ver la sección "Desplegar en Vercel" más arriba.
- **Convertirla en app móvil nativa**: hay dos caminos razonables. (1) Crear
  una app con **React Native / Expo** que consuma esta misma aplicación como
  backend (las rutas API y la base de datos ya están listas para servir a un
  cliente móvil separado). (2) Envolver la web ya desplegada con
  **Capacitor**, lo que da una app nativa instalable muy rápido reutilizando
  todo el código actual, ideal como paso intermedio antes de invertir en una
  app 100% nativa.

## Limitaciones conocidas (MVP)

- Login por nombre + contraseña, sin verificación de email ni "olvidé mi
  contraseña" — pensado para un grupo cerrado de confianza; si alguien
  olvida su contraseña hay que arreglarlo a mano en la base de datos (poner
  su `passwordHash` a `NULL` para que el siguiente login adopte una nueva).
  Las cuentas creadas antes de esta función siguen intactas: la primera vez
  que esa persona inicie sesión con contraseña, la que escriba se guarda
  como la suya a partir de ese momento.
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
