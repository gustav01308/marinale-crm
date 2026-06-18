import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Em Next.js 16 o antigo `middleware.ts` foi renomeado para `proxy.ts`
 * (a função exportada chama-se `proxy`). Aqui ele:
 *  - renova a sessão do Supabase a cada requisição;
 *  - redireciona para /login quando não há sessão;
 *  - redireciona para / quando já há sessão e a rota é /login.
 */
export async function proxy(request: NextRequest) {
  // Sem credenciais ainda (.env.local vazio) não há o que proteger:
  // deixa passar para o app subir sem quebrar durante a configuração.
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANTE: não rode código entre createServerClient e getUser().
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLoginRoute = request.nextUrl.pathname.startsWith("/login");

  if (!user && !isLoginRoute) {
    return redirectPreservingCookies(request, "/login", response);
  }

  if (user && isLoginRoute) {
    return redirectPreservingCookies(request, "/", response);
  }

  return response;
}

/** Redireciona mantendo os cookies de sessão eventualmente renovados. */
function redirectPreservingCookies(
  request: NextRequest,
  pathname: string,
  source: NextResponse,
) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  const redirect = NextResponse.redirect(url);
  source.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
  return redirect;
}

export const config = {
  matcher: [
    /*
     * Roda em todas as rotas, exceto:
     * - _next/static (arquivos estáticos)
     * - _next/image (otimização de imagem)
     * - favicon.ico e arquivos de imagem
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
