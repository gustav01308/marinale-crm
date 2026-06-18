create table leads (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  telefone text,
  origem text default 'meta_ads',
  veiculo text,
  problema text,
  status text default 'novo' check (status in ('novo','contato_feito','negociacao','fechado','perdido')),
  valor_estimado numeric,
  valor_fechado numeric,
  observacoes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table interacoes (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references leads(id) on delete cascade,
  nota text not null,
  created_at timestamptz default now()
);

alter table leads enable row level security;
alter table interacoes enable row level security;

create policy "auth users full access" on leads
  for all using (auth.uid() is not null);
create policy "auth users full access" on interacoes
  for all using (auth.uid() is not null);
