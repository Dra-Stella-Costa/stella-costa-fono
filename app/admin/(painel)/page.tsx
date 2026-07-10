import Link from "next/link";
import { formatarData } from "@/lib/blog";
import { createClient } from "@/lib/supabase/server";

export default async function AdminArtigosPage() {
  const supabase = await createClient();
  // A sessão da Stella enxerga rascunhos (policy "stella full access articles")
  const { data: artigos, error } = await supabase
    .from("articles")
    .select("id, title, slug, status, published_at, updated_at")
    .order("updated_at", { ascending: false });

  if (error) throw new Error(`Supabase (lista do painel): ${error.message}`);

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-h2 font-bold text-petroleo-600">Artigos</h1>
        <Link
          href="/admin/artigos/novo"
          className="rounded-full bg-coral-500 px-6 py-3 font-display font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-coral-600 focus-visible:outline-4 focus-visible:outline-petroleo-300"
        >
          + Novo artigo
        </Link>
      </div>

      {(artigos ?? []).length === 0 ? (
        <p className="rounded-2xl border border-areia bg-areia/50 p-8 text-corpo text-grafite">
          Nenhum artigo ainda. Toque em <strong>+ Novo artigo</strong> para escrever o primeiro.
        </p>
      ) : (
        <ul className="divide-y divide-areia border-y border-areia">
          {artigos!.map((a) => (
            <li key={a.id}>
              <Link
                href={`/admin/artigos/${a.id}`}
                className="flex flex-wrap items-center gap-3 py-4 focus-visible:outline-4 focus-visible:outline-petroleo-300"
              >
                <span
                  className={`rounded-full px-3 py-1 text-apoio font-bold ${
                    a.status === "published" ? "bg-sucesso/15 text-sucesso" : "bg-areia text-grafite"
                  }`}
                >
                  {a.status === "published" ? "Publicado" : "Rascunho"}
                </span>
                <span className="flex-1 font-display font-bold text-petroleo-600">
                  {a.title || "(sem título)"}
                </span>
                <span className="text-apoio text-grafite/70">
                  {formatarData(a.published_at ?? a.updated_at)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
