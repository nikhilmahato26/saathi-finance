import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { createStaff, changeRole } from "./actions";
import { StaffDirectoryClient, type StaffMember } from "./staff-directory-client";

export default async function EmployeesPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/login");

  const staff = await db.user.findMany({
    where: { role: { in: ["EMPLOYEE", "MANAGER"] } },
    orderBy: [{ role: "asc" }, { name: "asc" }],
    include: {
      manager: {
        select: { name: true },
      },
    },
  });

  return (
    <StaffDirectoryClient
      initialStaff={staff as StaffMember[]}
      createStaffAction={createStaff}
      changeRoleAction={changeRole}
    />
  );
}
