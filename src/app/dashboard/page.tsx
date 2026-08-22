import { redirect } from "next/navigation";
import { auth } from "@/auth";

const ROLE_HOME: Record<string, string> = {
  ADMIN: "/dashboard/admin",
  MANAGER: "/dashboard/manager",
  EMPLOYEE: "/dashboard/employee",
  PARTNER: "/dashboard/partner",
  CUSTOMER: "/dashboard/customer",
};

export default async function DashboardIndexPage() {
  const session = await auth();
  const role = session?.user.role;
  redirect(role && ROLE_HOME[role] ? ROLE_HOME[role] : "/");
}
