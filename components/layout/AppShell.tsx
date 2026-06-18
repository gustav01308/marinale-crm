"use client";

import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import { QuickAddButton } from "@/components/leads/QuickAddButton";
import { LogoutButton } from "@/components/layout/LogoutButton";

/**
 * Casca da aplicação autenticada.
 * Mobile-first: barra no topo em telas pequenas, sidebar fixa no desktop.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col md:flex-row">
      {/* Barra superior (mobile) */}
      <header className="sticky top-0 z-20 flex items-center justify-between gap-2 border-b bg-sidebar px-4 py-3 md:hidden">
        <Brand />
        <div className="flex items-center gap-2">
          <QuickAddButton />
          <LogoutButton />
        </div>
      </header>

      {/* Sidebar (desktop) */}
      <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r bg-sidebar p-4 md:flex">
        <div className="mb-8">
          <Brand />
        </div>
        <nav className="flex flex-col gap-1">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent"
          >
            <LayoutGrid className="size-4" />
            Leads
          </Link>
        </nav>
        <div className="mt-auto flex flex-col gap-2">
          <QuickAddButton className="w-full" />
          <LogoutButton className="w-full justify-start" />
        </div>
      </aside>

      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}

function Brand() {
  return (
    <Link href="/" className="text-lg font-bold tracking-tight">
      Marinale <span className="text-muted-foreground">CRM</span>
    </Link>
  );
}
