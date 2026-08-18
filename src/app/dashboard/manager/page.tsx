import { EmptyState } from "@/components/dashboard/empty-state";

const MODULES = [
  { title: "Team leads", hint: "Leads assigned to your team will appear here." },
  { title: "Pending files", hint: "Files awaiting action will show up here." },
  { title: "Delayed files", hint: "Files past their follow-up date will be flagged here." },
  { title: "Team target vs achievement", hint: "Team performance will be tracked here." },
];

export default function ManagerOverviewPage() {
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground">Your team&apos;s leads and performance.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {MODULES.map((module) => (
          <EmptyState key={module.title} title={module.title} hint={module.hint} />
        ))}
      </div>
    </div>
  );
}
