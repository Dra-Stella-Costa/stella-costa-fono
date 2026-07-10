import OndaDeVoz from "@/components/OndaDeVoz";
import { DEPOIMENTOS, mostrarRascunho } from "@/lib/landing-content";
import { supabase } from "@/lib/supabase";

export default async function Depoimentos() {
  // AD-008: depoimento cadastrado no painel = validado pela Stella (com o
  // lembrete LGPD no formulário) → pode renderizar em produção.
  const { data } = await supabase
    .from("testimonials")
    .select("author_name, city, quote")
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  // Banco vazio: vale o comportamento antigo — rascunho só local (AD-006)
  const depoimentos =
    data && data.length > 0
      ? data.map((d) => ({ author: d.author_name, city: d.city, quote: d.quote }))
      : mostrarRascunho()
        ? DEPOIMENTOS
        : [];

  // Spec US-04.3: nunca renderizar a seção vazia.
  if (depoimentos.length === 0) return null;

  return (
    <section id="depoimentos" className="bg-areia/50">
      <div className="mx-auto max-w-5xl space-y-8 px-4 py-16">
        <div className="space-y-3">
          <OndaDeVoz className="h-6 w-12" cor="coral" />
          <h2 className="font-display text-h2 font-bold text-petroleo-600">
            O que as <span className="text-coral-500">famílias</span> dizem
          </h2>
        </div>

        {/* Sem imagens: LGPD proíbe foto de menores (CHK-041) */}
        <ul className="grid gap-5 md:grid-cols-3">
          {depoimentos.map((d) => (
            <li
              key={`${d.author}-${d.quote.slice(0, 20)}`}
              className="relative rounded-2xl rounded-bl-none border border-areia bg-creme p-5"
            >
              <blockquote className="text-corpo italic text-grafite">“{d.quote}”</blockquote>
              <p className="mt-4 text-apoio font-semibold text-petroleo-600">
                {d.author}
                {d.city ? ` · ${d.city}` : ""}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
