/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["pg", "@prisma/adapter-pg"],
    // Every authenticated page reads live data straight from Postgres
    // (routines, history, "última vez", session totals...). Next's client
    // Router Cache otherwise keeps a dynamically-rendered page's RSC
    // payload around for staleTimes.dynamic seconds (30s by default) and,
    // for a page prefetched via <Link> with no loading.tsx boundary, can
    // hold on to that first snapshot well past that window until some
    // other navigation/revalidation happens to evict it. That's exactly
    // what made "Última vez" look like it only updated after pressing
    // "Finalizar rutina" (whose revalidatePath call was the only thing
    // that ever invalidated it) — setting this to 0 makes every dynamic
    // page refetch from the server on every visit, no exceptions.
    staleTimes: {
      dynamic: 0,
    },
  },
};

export default nextConfig;
