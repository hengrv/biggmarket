import { PrismaAdapter } from "@auth/prisma-adapter";
import type { DefaultSession, NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { UserRole } from "@prisma/client";
import { env } from "~/env";

import { db } from "~/server/db";

/**
 * Module augmentation for `next-auth` types. Add custom properties to the `session`
 * object and keep type safety.
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      username?: string;
      role: UserRole;
    } & DefaultSession["user"];
  }

  interface User {
    username?: string;
    role: UserRole;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    /**
     * ...add more providers here.
     *
     */
  ],
  // @ts-expect-error - Fix later
  adapter: PrismaAdapter(db),
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
        username: user.username,
        role: user.role,
      },
    }),
  },
  events: {
    createUser: async ({ user }) => {
      // This event is triggered only when a new user is created
      if (user?.email) {
        try {
          // Extract base username from email (part before @)
          const baseUsername = user.email.split("@")[0]?.toLowerCase();

          // Check if username exists and generate a unique one if needed
          let uniqueUsername = baseUsername;
          let counter = 1;

          while (true) {
            const existingUsername = await db.user.findFirst({
              where: { username: uniqueUsername },
            });

            if (!existingUsername) break;

            // Username exists, try with a number appended
            uniqueUsername = `${baseUsername}${counter}`;
            counter++;
          }

          // Update the user with the unique username
          await db.user.update({
            where: { id: user.id },
            data: { username: uniqueUsername },
          });
        } catch (error) {
          console.error("Error setting username:", error);
        }
      }
    },
  },
} satisfies NextAuthConfig;
