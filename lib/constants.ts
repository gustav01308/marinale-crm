import type { LeadStatus } from "./types";

export interface StatusColumn {
  value: LeadStatus;
  label: string;
  /** Classe Tailwind usada como cor de destaque da coluna/badge. */
  accent: string;
}

/** Colunas do Kanban, na ordem em que aparecem. */
export const STATUS_COLUMNS: StatusColumn[] = [
  { value: "novo", label: "Novo", accent: "bg-blue-500" },
  { value: "contato_feito", label: "Contato Feito", accent: "bg-amber-500" },
  { value: "negociacao", label: "Negociação", accent: "bg-purple-500" },
  { value: "fechado", label: "Fechado", accent: "bg-emerald-500" },
  { value: "perdido", label: "Perdido", accent: "bg-rose-500" },
];

export const STATUS_LABELS: Record<LeadStatus, string> = {
  novo: "Novo",
  contato_feito: "Contato Feito",
  negociacao: "Negociação",
  fechado: "Fechado",
  perdido: "Perdido",
};

export function isLeadStatus(value: string): value is LeadStatus {
  return value in STATUS_LABELS;
}
