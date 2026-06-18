import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { LeadDetail } from "@/components/leads/LeadDetail";
import type { Interacao, Lead } from "@/lib/types";

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: leadData } = await supabase
    .from("leads")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!leadData) {
    notFound();
  }

  const lead = leadData as Lead;

  const { data: interacoesData } = await supabase
    .from("interacoes")
    .select("*")
    .eq("lead_id", id)
    .order("created_at", { ascending: false });

  const interacoes = (interacoesData ?? []) as Interacao[];

  return (
    <div className="mx-auto max-w-2xl p-4 md:p-6">
      <Link
        href="/"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Voltar para o Kanban
      </Link>
      <LeadDetail lead={lead} interacoes={interacoes} />
    </div>
  );
}
