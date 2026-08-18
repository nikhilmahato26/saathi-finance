import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import authConfig from "@/auth.config";
import type { Role } from "@/generated/prisma/client";

const { auth } = NextAuth(authConfig);

const ROUTE_ROLES: Record<string, Role[]> = {
  "/dashboard/admin": ["ADMIN"],
  "/dashboard/manager": ["MANAGER", "ADMIN"],
  "/dashboard/employee": ["EMPLOYEE", "ADMIN"],
  "/dashboard/partner": ["PARTNER", "ADMIN"],
};

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const matchedPrefix = Object.keys(ROUTE_ROLES).find((prefix) =>
    pathname.startsWith(prefix),
  );
  if (!matchedPrefix) return NextResponse.next();

  const session = req.auth;
  if (!session?.user) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    return NextResponse.redirect(loginUrl);
  }

  const allowedRoles = ROUTE_ROLES[matchedPrefix];
  if (!allowedRoles.includes(session.user.role)) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
