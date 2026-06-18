"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LeadForm } from "@/components/leads/LeadForm";
import { createClient } from "@/lib/supabase/client";
import type { LeadFormValues } from "@/lib/types";

export function QuickAddButton({ className }: { className?: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate(values: LeadFormValues) {
    setSaving(true);
    setError(null);

    const supabase = createClient();
    const { error: insertError } = await supabase
      .from("leads")
      .insert({ ...values, status: "novo" });

    setSaving(false);

    if (insertError) {
      setError("Não foi possível salvar o lead. Tente novamente.");
      return;
    }

    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" className={className} />}>
        <Plus className="size-4" />
        Novo Lead
      </DialogTrigger>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Lead</DialogTitle>
          <DialogDescription>
            Cadastre um lead que chegou pelo WhatsApp.
          </DialogDescription>
        </DialogHeader>
        <LeadForm
          onSubmit={handleCreate}
          submitting={saving}
          error={error}
          submitLabel="Salvar lead"
        />
      </DialogContent>
    </Dialog>
  );
}
