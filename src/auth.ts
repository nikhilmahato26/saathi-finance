import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import { verifyOtp } from "@/lib/otp";
import authConfig from "@/auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Mobile + OTP",
      credentials: {
        mobile: { label: "Mobile", type: "text" },
        code: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        const mobile = credentials?.mobile as string | undefined;
        const code = credentials?.code as string | undefined;
        if (!mobile || !code) return null;

        const ok = await verifyOtp(mobile, code);
        if (!ok) return null;

        const user = await db.user.findUnique({ where: { mobile } });
        if (!user) return null;

        return {
          id: user.id,
          role: user.role,
          name: user.name,
          mobile: user.mobile,
        };
      },
    }),
  ],
});
