"use client";

import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import type { StatusColumn } from "@/lib/constants";
import type { Lead } from "@/lib/types";
import { LeadCard } from "./LeadCard";

export function KanbanColumn({
  column,
  leads,
}: {
  column: StatusColumn;
  leads: Lead[];
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.value });

  return (
    <div className="flex w-72 shrink-0 flex-col">
      <div className="mb-2 flex items-center gap-2 px-1">
        <span className={cn("size-2.5 rounded-full", column.accent)} />
        <h2 className="text-sm font-semibold">{column.label}</h2>
        <span className="text-sm text-muted-foreground">({leads.length})</span>
      </div>
      <div
        ref={setNodeRef}
        className={cn(
          "flex min-h-28 flex-1 flex-col gap-2 rounded-lg border border-dashed bg-muted/30 p-2 transition-colors",
          isOver && "border-primary/50 bg-muted",
        )}
      >
        {leads.map((lead) => (
          <LeadCard key={lead.id} lead={lead} />
        ))}
        {leads.length === 0 && (
          <p className="px-1 py-8 text-center text-xs text-muted-foreground">
            Nenhum lead
          </p>
        )}
      </div>
    </div>
  );
}
