import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/dashboard/empty-state";

export default async function ManagerTeamPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const team = await db.user.findMany({
    where: { managerId: session.user.id },
    orderBy: { name: "asc" },
  });

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Team members</h1>
        <p className="text-sm text-muted-foreground">
          Employees assigned to your team.
        </p>
      </div>

      {team.length > 0 ? (
        <div className="rounded-lg border bg-card text-card-foreground overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {team.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {member.role.charAt(0) + member.role.slice(1).toLowerCase()}
                  </TableCell>
                  <TableCell>{member.mobile}</TableCell>
                  <TableCell>{member.email ?? "—"}</TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {member.createdAt.toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <EmptyState title="No team members yet" hint="Employees assigned to you will appear here." />
      )}
    </div>
  );
}
