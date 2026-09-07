import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { verifyOtp } from "@/lib/otp";
import authConfig from "@/auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        employeeId: { label: "Employee ID", type: "text" },
        password: { label: "Password", type: "password" },
        mobile: { label: "Mobile", type: "text" },
        code: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        // 1. Staff Employee ID + Password authentication
        const employeeId = (credentials?.employeeId as string | undefined)?.trim();
        const password = credentials?.password as string | undefined;

        if (employeeId && password) {
          const user = await db.user.findFirst({
            where: {
              OR: [
                { employeeId: { equals: employeeId, mode: "insensitive" } },
                { mobile: employeeId },
              ],
            },
          });

          if (!user || !user.passwordHash) return null;
          if (user.role === "CUSTOMER") return null;

          const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
          if (!isPasswordValid) return null;

          return {
            id: user.id,
            role: user.role,
            name: user.name,
            mobile: user.mobile,
            employeeId: user.employeeId,
          };
        }

        // 2. Customer OTP verification
        const mobile = (credentials?.mobile as string | undefined)?.trim();
        const code = (credentials?.code as string | undefined)?.trim();

        if (mobile && code) {
          const ok = await verifyOtp(mobile, code);
          if (!ok) return null;

          const user = await db.user.findUnique({ where: { mobile } });
          if (!user) return null;

          return {
            id: user.id,
            role: user.role,
            name: user.name,
            mobile: user.mobile,
            employeeId: user.employeeId,
          };
        }

        return null;
      },
    }),
  ],
});
