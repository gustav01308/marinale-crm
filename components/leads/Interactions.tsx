"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { formatDateTime } from "@/lib/format";
import type { Interacao } from "@/lib/types";

export function Interactions({
  leadId,
  interacoes,
}: {
  leadId: string;
  interacoes: Interacao[];
}) {
  const router = useRouter();
  const [nota, setNota] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAdd() {
    const value = nota.trim();
    if (!value) return;

    setSaving(true);
    setError(null);

    const supabase = createClient();
    const { error: insertError } = await supabase
      .from("interacoes")
      .insert({ lead_id: leadId, nota: value });

    setSaving(false);

    if (insertError) {
      setError("Não foi possível adicionar a nota.");
      return;
    }

    setNota("");
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Histórico de interações</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Textarea
            placeholder="Adicionar uma nota (ex.: cliente vai trazer o carro na quinta)"
            value={nota}
            onChange={(event) => setNota(event.target.value)}
            rows={2}
          />
          <div className="flex justify-end">
            <Button
              size="sm"
              onClick={handleAdd}
              disabled={saving || nota.trim() === ""}
            >
              {saving ? "Adicionando..." : "Adicionar nota"}
            </Button>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <ul className="space-y-3">
          {interacoes.length === 0 && (
            <li className="text-sm text-muted-foreground">
              Nenhuma interação ainda.
            </li>
          )}
          {interacoes.map((interacao) => (
            <li
              key={interacao.id}
              className="rounded-md border bg-muted/20 p-3"
            >
              <p className="whitespace-pre-wrap text-sm">{interacao.nota}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {formatDateTime(interacao.created_at)}
              </p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
