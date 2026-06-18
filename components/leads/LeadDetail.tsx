"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LeadForm } from "./LeadForm";
import { StatusChanger } from "./StatusChanger";
import { Interactions } from "./Interactions";
import { createClient } from "@/lib/supabase/client";
import { STATUS_LABELS } from "@/lib/constants";
import { formatCurrency, whatsappHref } from "@/lib/format";
import type { Interacao, Lead, LeadFormValues } from "@/lib/types";

export function LeadDetail({
  lead,
  interacoes,
}: {
  lead: Lead;
  interacoes: Interacao[];
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const whatsapp = whatsappHref(lead.telefone);
  const valorFechado = formatCurrency(lead.valor_fechado);

  async function handleEdit(values: LeadFormValues) {
    setSaving(true);
    setError(null);

    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("leads")
      .update({ ...values, updated_at: new Date().toISOString() })
      .eq("id", lead.id);

    setSaving(false);

    if (updateError) {
      setError("Não foi possível salvar as alterações.");
      return;
    }

    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight">{lead.nome}</h1>
          <Badge variant="secondary">{STATUS_LABELS[lead.status]}</Badge>
          {valorFechado && (
            <span className="text-sm font-medium text-emerald-600">
              Fechado: {valorFechado}
            </span>
          )}
        </div>
        {whatsapp && (
          <Button
            variant="outline"
            size="sm"
            render={
              <a href={whatsapp} target="_blank" rel="noopener noreferrer" />
            }
          >
            <MessageCircle className="size-4" />
            WhatsApp
          </Button>
        )}
      </div>

      <StatusChanger lead={lead} />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Dados do lead</CardTitle>
        </CardHeader>
        <CardContent>
          <LeadForm
            defaultValues={lead}
            onSubmit={handleEdit}
            submitting={saving}
            error={error}
            submitLabel="Salvar alterações"
          />
        </CardContent>
      </Card>

      <Interactions leadId={lead.id} interacoes={interacoes} />
    </div>
  );
}
