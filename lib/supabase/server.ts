import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Client do painel em Server Components/Actions: carrega a sessão da Stella
 * via cookie — é o JWT dela que o RLS avalia. O site público continua usando
 * o client anônimo de `lib/supabase.ts`.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Server Component sem acesso de escrita: o middleware renova a sessão
          }
        },
      },
    },
  );
}
