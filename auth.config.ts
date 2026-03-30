import Google from '@auth/core/providers/google';
import { defineConfig } from 'auth-astro';
import type { DefaultSession } from '@auth/core/types';
import { db } from './src/db/index';
import { users } from './src/db/schema';
import { eq } from 'drizzle-orm';

declare module '@auth/core/types' {
  interface Session {
    user: {
      role?: string;
    } & DefaultSession['user'];
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    role?: string;
  }
}

const OWNER_EMAIL = import.meta.env.OWNER_EMAIL;

export default defineConfig({
  providers: [
    Google({
      clientId: import.meta.env.GOOGLE_CLIENT_ID,
      clientSecret: import.meta.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user && user.email) {
        const hasDB = !!import.meta.env.TURSO_DATABASE_URL;

        if (hasDB) {
          // Upsert user in DB
          const existing = await db
            .select()
            .from(users)
            .where(eq(users.email, user.email))
            .get();

          if (existing) {
            // Update name/image in case they changed
            await db
              .update(users)
              .set({ name: user.name ?? existing.name, image: user.image ?? existing.image })
              .where(eq(users.email, user.email));
            token.role = existing.role;
          } else {
            // New user — Owner if matches bootstrap email, otherwise Player
            const role = user.email === OWNER_EMAIL ? 'Owner' : 'Player';
            await db.insert(users).values({
              email: user.email,
              name:  user.name ?? null,
              image: user.image ?? null,
              role,
            });
            token.role = role;
          }
        } else {
          // No DB yet — derive role from email only
          token.role = user.email === OWNER_EMAIL ? 'Owner' : 'Player';
        }

        token.picture = user.image;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role  = token.role ?? 'Player';
        session.user.image = token.picture as string ?? session.user.image;
      }
      return session;
    },
  },
});
