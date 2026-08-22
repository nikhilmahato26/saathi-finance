import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function ActivityLogPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    redirect("/login");
  }

  // Fetch the latest 100 activity logs
  const logs = await db.activityLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      actor: {
        select: { name: true, role: true },
      },
    },
  });

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Activity Log</h1>
        <p className="text-sm text-muted-foreground">
          Recent system events and user actions across the platform.
        </p>
      </div>

      <div className="rounded-lg border divide-y overflow-hidden">
        {logs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground text-xs uppercase">
                <tr>
                  <th className="px-4 py-3 font-medium">Timestamp</th>
                  <th className="px-4 py-3 font-medium">Actor</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                  <th className="px-4 py-3 font-medium">Entity</th>
                  <th className="px-4 py-3 font-medium">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                      {log.createdAt.toLocaleString("en-IN", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {log.actor.name} <span className="text-xs text-muted-foreground font-normal">({log.actor.role})</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-foreground">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                      {log.entityType} ({log.entityId.slice(0, 8)}...)
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                      {log.ipAddress}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No activity logs found.
          </div>
        )}
      </div>
    </div>
  );
}
