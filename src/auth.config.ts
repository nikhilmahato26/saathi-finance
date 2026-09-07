import type { NextAuthConfig } from "next-auth";
import type { Role } from "@/generated/prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      name: string;
      mobile: string;
      employeeId?: string | null;
    };
  }

  interface User {
    role?: Role;
    mobile?: string;
    employeeId?: string | null;
  }
}

/**
 * Edge-safe auth config: no providers here, since the Credentials provider
 * needs Prisma (Node-only). Middleware imports this directly; auth.ts
 * extends it with the actual provider for route handlers and server code.
 */
export default {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role as Role;
        token.mobile = user.mobile as string;
        token.employeeId = user.employeeId as string | null | undefined;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as Role;
      session.user.mobile = token.mobile as string;
      session.user.employeeId = token.employeeId as string | null | undefined;
      return session;
    },
  },
} satisfies NextAuthConfig;
