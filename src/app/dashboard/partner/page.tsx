import { EmptyState } from "@/components/dashboard/empty-state";

const MODULES = [
  { title: "My leads", hint: "Leads you've originated will appear here." },
  { title: "Referrals", hint: "Your referral records across products will show up here." },
];

export default function PartnerOverviewPage() {
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">My leads</h1>
        <p className="text-sm text-muted-foreground">Leads and referrals you&apos;ve originated.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {MODULES.map((module) => (
          <EmptyState key={module.title} title={module.title} hint={module.hint} />
        ))}
      </div>
    </div>
  );
}
