"use client";

import Link from "next/link";
import { useDraggable } from "@dnd-kit/core";
import { Car, GripVertical, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/format";
import type { Lead } from "@/lib/types";

/** Conteúdo visual do card, reutilizado pelo DragOverlay. */
export function LeadCardContent({ lead }: { lead: Lead }) {
  const valor = formatCurrency(lead.valor_estimado);

  return (
    <div className="space-y-1">
      <p className="pr-6 font-medium leading-tight">{lead.nome}</p>
      {lead.telefone && (
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Phone className="size-3 shrink-0" />
          <span className="truncate">{lead.telefone}</span>
        </p>
      )}
      {lead.veiculo && (
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Car className="size-3 shrink-0" />
          <span className="truncate">{lead.veiculo}</span>
        </p>
      )}
      {lead.problema && (
        <p className="line-clamp-2 text-xs text-muted-foreground">
          {lead.problema}
        </p>
      )}
      {valor && <p className="pt-1 text-sm font-semibold">{valor}</p>}
    </div>
  );
}

export function LeadCard({ lead }: { lead: Lead }) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, isDragging } =
    useDraggable({ id: lead.id });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "relative rounded-lg border bg-card p-3 shadow-sm transition-shadow hover:shadow-md",
        isDragging && "opacity-40",
      )}
    >
      <button
        ref={setActivatorNodeRef}
        type="button"
        aria-label="Arrastar lead"
        className="absolute right-1 top-1 cursor-grab touch-none rounded p-1 text-muted-foreground hover:bg-muted active:cursor-grabbing"
        {...listeners}
        {...attributes}
      >
        <GripVertical className="size-4" />
      </button>
      <Link href={`/leads/${lead.id}`} className="block">
        <LeadCardContent lead={lead} />
      </Link>
    </div>
  );
}
