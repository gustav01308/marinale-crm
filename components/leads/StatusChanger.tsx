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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { STATUS_COLUMNS, STATUS_LABELS, isLeadStatus } from "@/lib/constants";
import type { Lead, LeadStatus } from "@/lib/types";

export function StatusChanger({ lead }: { lead: Lead }) {
  const router = useRouter();
  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const [valorFechado, setValorFechado] = useState(
    lead.valor_fechado != null ? String(lead.valor_fechado) : "",
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function persist(newStatus: LeadStatus, valor?: number | null) {
    setSaving(true);
    setError(null);

    const payload: Record<string, unknown> = {
      status: newStatus,
      updated_at: new Date().toISOString(),
    };
    if (valor !== undefined) {
      payload.valor_fechado = valor;
    }

    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("leads")
      .update(payload)
      .eq("id", lead.id);

    setSaving(false);

    if (updateError) {
      setError("Não foi possível atualizar o status.");
      return;
    }

    router.refresh();
  }

  function handleStatusChange(value: string | null) {
    if (value === null || !isLeadStatus(value)) return;
    setStatus(value);
    // "Fechado" exige confirmar o valor; os demais salvam na hora.
    if (value !== "fechado") {
      void persist(value);
    }
  }

  function handleConfirmFechado() {
    const parsed =
      valorFechado.trim() === ""
        ? null
        : Number(valorFechado.replace(",", "."));

    if (parsed !== null && Number.isNaN(parsed)) {
      setError("Informe um valor válido.");
      return;
    }

    void persist("fechado", parsed);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Select
          items={STATUS_LABELS}
          value={status}
          onValueChange={handleStatusChange}
        >
          <SelectTrigger className="w-full sm:w-60">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_COLUMNS.map((column) => (
              <SelectItem key={column.value} value={column.value}>
                {column.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {status === "fechado" && (
          <div className="space-y-2 rounded-md border bg-muted/30 p-3">
            <Label htmlFor="valor_fechado">Valor fechado (R$)</Label>
            <Input
              id="valor_fechado"
              inputMode="decimal"
              placeholder="0,00"
              value={valorFechado}
              onChange={(event) => setValorFechado(event.target.value)}
            />
            <Button size="sm" onClick={handleConfirmFechado} disabled={saving}>
              {saving ? "Salvando..." : "Confirmar fechamento"}
            </Button>
          </div>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}
      </CardContent>
    </Card>
  );
}
