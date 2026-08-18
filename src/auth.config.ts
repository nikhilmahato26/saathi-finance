import type { NextAuthConfig } from "next-auth";
import type { Role } from "@/generated/prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      name: string;
      mobile: string;
    };
  }

  interface User {
    role?: Role;
    mobile?: string;
  }
}

/**
 * Edge-safe auth config: no providers here, since the Credentials provider
 * needs Prisma (Node-only). Middleware imports this directly; auth.ts
 * extends it with the actual provider for route handlers and server code.
 */
export default {
  session: { strategy: "jwt" },
  pages: { signIn: "/verify" },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role as Role;
        token.mobile = user.mobile as string;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as Role;
      session.user.mobile = token.mobile as string;
      return session;
    },
  },
} satisfies NextAuthConfig;
