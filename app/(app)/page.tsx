import { createClient } from "@/lib/supabase/server";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Lead } from "@/lib/types";

const configured =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default async function KanbanPage() {
  if (!configured) {
    return (
      <div className="p-4 md:p-6">
        <Card className="mx-auto max-w-lg">
          <CardHeader>
            <CardTitle>Configure o Supabase</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              Preencha o arquivo <code className="font-mono">.env.local</code>{" "}
              com a URL e a chave anon do seu projeto Supabase e rode a migration{" "}
              <code className="font-mono">
                supabase/migrations/0001_init.sql
              </code>{" "}
              no SQL Editor.
            </p>
            <p>Depois reinicie o servidor de desenvolvimento.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  const leads = (data ?? []) as Lead[];

  return (
    <div className="p-4 md:p-6">
      <h1 className="mb-4 text-2xl font-bold tracking-tight">Leads</h1>
      <KanbanBoard initialLeads={leads} />
    </div>
  );
}
