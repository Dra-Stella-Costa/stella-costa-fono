import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { STELLA_EMAIL } from "@/lib/site";

// Rotas do admin acessíveis sem sessão (o link de recovery chega deslogado)
const ROTAS_ABERTAS = ["/admin/login", "/admin/atualizar-senha"];

/**
 * Proteção de UX do /admin: renova a sessão e redireciona quem não é a Stella.
 * A segurança real é o RLS (`is_stella()`) — mesmo sem este middleware, o banco
 * recusa qualquer escrita de outro usuário.
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // getUser() (não getSession): valida o token no servidor do Supabase
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const rotaAberta = ROTAS_ABERTAS.some((r) => pathname.startsWith(r));

  if (!rotaAberta && (!user || user.email !== STELLA_EMAIL)) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = user ? "?erro=nao-autorizado" : "";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = { matcher: ["/admin/:path*"] };
