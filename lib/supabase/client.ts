import { createBrowserClient } from "@supabase/ssr";

/**
 * Cliente Supabase para uso no navegador (Client Components).
 * A sessão é mantida em cookies para que o servidor/proxy também a enxergue.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
