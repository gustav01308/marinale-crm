"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { LeadFormValues } from "@/lib/types";

const leadSchema = z.object({
  nome: z.string().trim().min(1, "Informe o nome do lead"),
  telefone: z.string(),
  veiculo: z.string(),
  problema: z.string(),
  valor_estimado: z
    .string()
    .refine(
      (value) =>
        value.trim() === "" || !Number.isNaN(Number(value.replace(",", "."))),
      "Valor inválido",
    ),
  observacoes: z.string(),
});

type LeadFormFields = z.infer<typeof leadSchema>;

interface LeadFormProps {
  defaultValues?: LeadFormValues | null;
  onSubmit: (values: LeadFormValues) => void | Promise<void>;
  submitting?: boolean;
  error?: string | null;
  submitLabel?: string;
}

function emptyToNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

/** Formulário reutilizável para criar e editar um lead. */
export function LeadForm({
  defaultValues,
  onSubmit,
  submitting = false,
  error,
  submitLabel = "Salvar",
}: LeadFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadFormFields>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      nome: defaultValues?.nome ?? "",
      telefone: defaultValues?.telefone ?? "",
      veiculo: defaultValues?.veiculo ?? "",
      problema: defaultValues?.problema ?? "",
      valor_estimado:
        defaultValues?.valor_estimado != null
          ? String(defaultValues.valor_estimado)
          : "",
      observacoes: defaultValues?.observacoes ?? "",
    },
  });

  const submit = handleSubmit(async (fields) => {
    const parsed =
      fields.valor_estimado.trim() === ""
        ? null
        : Number(fields.valor_estimado.replace(",", "."));

    await onSubmit({
      nome: fields.nome.trim(),
      telefone: emptyToNull(fields.telefone),
      veiculo: emptyToNull(fields.veiculo),
      problema: emptyToNull(fields.problema),
      valor_estimado: parsed != null && !Number.isNaN(parsed) ? parsed : null,
      observacoes: emptyToNull(fields.observacoes),
    });
  });

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nome">Nome *</Label>
        <Input id="nome" placeholder="Nome do cliente" {...register("nome")} />
        {errors.nome && (
          <p className="text-sm text-destructive">{errors.nome.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="telefone">Telefone</Label>
        <Input
          id="telefone"
          inputMode="tel"
          placeholder="(48) 99999-9999"
          {...register("telefone")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="veiculo">Veículo</Label>
        <Input
          id="veiculo"
          placeholder="Ex.: Gol 1.0 2015"
          {...register("veiculo")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="problema">Problema</Label>
        <Textarea
          id="problema"
          rows={2}
          placeholder="O que o cliente relatou"
          {...register("problema")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="valor_estimado">Valor estimado (R$)</Label>
        <Input
          id="valor_estimado"
          inputMode="decimal"
          placeholder="0,00"
          {...register("valor_estimado")}
        />
        {errors.valor_estimado && (
          <p className="text-sm text-destructive">
            {errors.valor_estimado.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="observacoes">Observações</Label>
        <Textarea id="observacoes" rows={2} {...register("observacoes")} />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex justify-end gap-2 pt-1">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Salvando..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
