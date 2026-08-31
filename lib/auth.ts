import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

// `passwordHash` was added to User after this app already had real accounts
// in production (see prisma/migrations/20260831000000_add_password_cardio_sessions).
// The generated Prisma Client in this environment predates that column, so
// it's read/written here via parameterized raw SQL instead of the typed
// client — functionally identical, just not going through the (stale) typed
// model. Once `prisma generate` is re-run with network access this could be
// switched back to `prisma.user.findUnique`/`update`, but the raw form below
// is already safe and correct as shipped.
type AuthUserRow = { id: string; name: string; passwordHash: string | null };

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        name: { label: "Nombre", type: "text" },
        password: { label: "Contraseña", type: "password" },
      },
      authorize: async (credentials) => {
        const name = credentials?.name as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!name || !password) return null;

        const rows = await prisma.$queryRaw<AuthUserRow[]>`
          SELECT "id", "name", "passwordHash" FROM "User" WHERE "name" = ${name} LIMIT 1
        `;
        const user = rows[0];
        if (!user) return null;

        if (user.passwordHash === null) {
          // Pre-password account (created before this feature existed):
          // adopt whatever they just typed as their password, so their
          // existing routines/logs stay attached to the same account.
          const hash = await bcrypt.hash(password, 10);
          await prisma.$executeRaw`
            UPDATE "User" SET "passwordHash" = ${hash} WHERE "id" = ${user.id}
          `;
          return { id: user.id, name: user.name };
        }

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        return { id: user.id, name: user.name };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    },
  },
});
