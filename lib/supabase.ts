import { createClient } from "@supabase/supabase-js";

// Anon key + RLS: leitura anônima só enxerga conteúdo publicado (migration 0001).
// Env ausente derruba o build de propósito — sem fallback silencioso (lição L-003).
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!url || !anonKey) {
  throw new Error(
    "Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY (.env.local e painel da Vercel).",
  );
}

// Site público não tem sessão de usuário; auth só existe no painel-admin.
export const supabase = createClient(url, anonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
