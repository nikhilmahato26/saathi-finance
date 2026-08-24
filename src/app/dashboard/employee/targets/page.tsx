import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { calculateAchievements } from "@/lib/target-calculations";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default async function EmployeeTargetsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  
  const period = "2026-08"; // Hardcoded for demo/current period

  // Fetch only the logged-in user's achievements
  const stats = await calculateAchievements(session.user.id, period);

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">My Targets</h1>
        <p className="text-sm text-muted-foreground">Monitor your personal target progress for {period}.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
          <CardDescription>
            Your progress towards the goals set by your manager.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stats.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">No targets have been set for you this period.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Achieved</TableHead>
                  <TableHead>Completion</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.map(s => (
                  <TableRow key={s.type}>
                    <TableCell className="font-medium">{s.type}</TableCell>
                    <TableCell>{s.targetValue}</TableCell>
                    <TableCell>{s.achievedValue}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${s.percentage >= 100 ? 'bg-green-500' : 'bg-primary'}`} 
                            style={{ width: `${Math.min(s.percentage, 100)}%` }} 
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{s.percentage}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
