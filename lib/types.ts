export type LeadStatus =
  | "novo"
  | "contato_feito"
  | "negociacao"
  | "fechado"
  | "perdido";

export interface Lead {
  id: string;
  nome: string;
  telefone: string | null;
  origem: string | null;
  veiculo: string | null;
  problema: string | null;
  status: LeadStatus;
  valor_estimado: number | null;
  valor_fechado: number | null;
  observacoes: string | null;
  created_at: string;
  updated_at: string;
}

/** Campos preenchidos pelo formulário de criação/edição de lead. */
export interface LeadFormValues {
  nome: string;
  telefone: string | null;
  veiculo: string | null;
  problema: string | null;
  valor_estimado: number | null;
  observacoes: string | null;
}

export interface Interacao {
  id: string;
  lead_id: string;
  nota: string;
  created_at: string;
}
