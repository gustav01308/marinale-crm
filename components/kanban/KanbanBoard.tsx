"use client";

import { useEffect, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { STATUS_COLUMNS, isLeadStatus } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import type { Lead } from "@/lib/types";
import { KanbanColumn } from "./KanbanColumn";
import { LeadCardContent } from "./LeadCard";

export function KanbanBoard({ initialLeads }: { initialLeads: Lead[] }) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Mantém o board em sincronia quando o servidor recarrega os dados
  // (ex.: após criar um lead pelo botão "+ Novo Lead").
  useEffect(() => {
    setLeads(initialLeads);
  }, [initialLeads]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 180, tolerance: 6 },
    }),
  );

  const activeLead = leads.find((lead) => lead.id === activeId) ?? null;

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);

    const { active, over } = event;
    if (!over) return;

    const leadId = String(active.id);
    const newStatus = String(over.id);
    if (!isLeadStatus(newStatus)) return;

    const lead = leads.find((item) => item.id === leadId);
    if (!lead || lead.status === newStatus) return;

    // Atualização otimista
    const previous = leads;
    setLeads((current) =>
      current.map((item) =>
        item.id === leadId ? { ...item, status: newStatus } : item,
      ),
    );

    const supabase = createClient();
    const { error } = await supabase
      .from("leads")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", leadId);

    if (error) {
      setLeads(previous); // rollback em caso de falha
    }
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {STATUS_COLUMNS.map((column) => (
          <KanbanColumn
            key={column.value}
            column={column}
            leads={leads.filter((lead) => lead.status === column.value)}
          />
        ))}
      </div>

      <DragOverlay>
        {activeLead ? (
          <div className="rounded-lg border bg-card p-3 shadow-lg">
            <LeadCardContent lead={activeLead} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
