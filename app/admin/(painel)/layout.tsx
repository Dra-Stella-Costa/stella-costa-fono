import Link from "next/link";
import { redirect } from "next/navigation";
import BotaoSair from "@/components/admin/BotaoSair";
import { createClient } from "@/lib/supabase/server";
import { STELLA_EMAIL } from "@/lib/site";

/**
 * Guarda de UX das rotas internas do painel (login/atualizar-senha ficam fora
 * deste grupo). Redundante com o middleware de propósito — e a autoridade
 * final continua sendo o RLS.
 */
export default async function PainelLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");
  if (user.email !== STELLA_EMAIL) redirect("/admin/login?erro=nao-autorizado");

  const item =
    "rounded-full px-4 py-2 font-display text-sm font-bold text-petroleo-600 transition-colors hover:bg-areia focus-visible:outline-4 focus-visible:outline-petroleo-300";

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <nav className="mb-8 flex flex-wrap items-center gap-2 border-b border-areia pb-4">
        <Link href="/admin" className={item}>
          Artigos
        </Link>
        <Link href="/admin/depoimentos" className={item}>
          Depoimentos
        </Link>
        <Link href="/admin/faq" className={item}>
          FAQ
        </Link>
        <span className="flex-1" />
        <BotaoSair className={item} />
      </nav>
      {children}
    </div>
  );
}
