import { auth } from "@/auth";
import { db } from "@/lib/db";
import { calculateAchievements } from "@/lib/target-calculations";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ManagerTargetsPage() {
  const session = await auth();
  if (!session?.user) return null;
  const period = "2026-08"; // Hardcoded for demo/current period

  const team = await db.user.findMany({
    where: { managerId: session.user.id }
  });

  const achievements = await Promise.all(
    team.map(async (member) => {
      const stats = await calculateAchievements(member.id, period);
      return { member, stats };
    })
  );

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Team Targets</h1>
        <p className="text-sm text-muted-foreground">Monitor your team&apos;s target achievements for {period}.</p>
      </div>

      {achievements.length === 0 ? (
        <Card><CardContent className="pt-6">No team members found.</CardContent></Card>
      ) : (
        achievements.map(({ member, stats }) => (
          <Card key={member.id}>
            <CardHeader>
              <CardTitle>{member.name} ({member.role})</CardTitle>
            </CardHeader>
            <CardContent>
              {stats.length === 0 ? (
                <p className="text-sm text-muted-foreground">No targets set for this period.</p>
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
        ))
      )}
    </div>
  );
}
