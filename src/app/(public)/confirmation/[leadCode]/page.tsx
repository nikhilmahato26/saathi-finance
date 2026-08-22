import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/site/logo-mark";
import { db } from "@/lib/db";

export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ leadCode: string }>;
}) {
  const { leadCode } = await params;
  const lead = await db.lead.findUnique({ where: { leadCode } });
  if (!lead) notFound();

  return (
    <section className="mx-auto max-w-md px-4 py-20 text-center sm:px-6">
      <LogoMark className="mx-auto h-14 w-auto" />
      <h1 className="mt-6 text-2xl font-semibold tracking-tight">
        Thanks. We&apos;ve got your details.
      </h1>
      <p className="mt-3 text-muted-foreground">
        A Saathi Finance advisor will call you shortly to complete your application.
      </p>
      <div className="mt-6 rounded-md border bg-muted px-4 py-3">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Your Lead ID</p>
        <p className="mt-1 font-mono text-lg font-semibold">{lead.leadCode}</p>
      </div>
      <Button
        size="lg"
        className="mt-8"
        nativeButton={false}
        render={<Link href={`/status/${lead.leadCode}`}>Track your status</Link>}
      />
    </section>
  );
}
