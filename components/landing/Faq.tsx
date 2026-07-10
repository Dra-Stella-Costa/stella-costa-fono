import { FAQS, mostrarRascunho } from "@/lib/landing-content";
import { supabase } from "@/lib/supabase";
import { whatsappLink } from "@/lib/site";

/**
 * `<details>`/`<summary>` nativo: expande por teclado e leitor de tela e
 * continua funcional sem JavaScript (edge case da spec).
 * O JSON-LD abaixo espelha exatamente as perguntas do DOM (CHK-051).
 */
export default async function Faq() {
  // AD-008: FAQ cadastrada no painel = validada pela Stella → produção.
  const { data } = await supabase
    .from("faqs")
    .select("question, answer")
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  // Banco vazio: comportamento antigo — rascunho só local (AD-006)
  const faqs = data && data.length > 0 ? data : mostrarRascunho() ? FAQS : [];
  if (faqs.length === 0) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <section id="faq">
      <div className="mx-auto max-w-3xl space-y-8 px-4 py-16">
        <h2 className="font-display text-h2 font-bold text-petroleo-600">
          Perguntas <span className="text-coral-500">frequentes</span>
        </h2>

        <div className="divide-y divide-areia border-y border-areia">
          {faqs.map((f) => (
            <details key={f.question} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-h3 font-bold text-petroleo-600 focus-visible:outline-4 focus-visible:outline-petroleo-300">
                {f.question}
                <span
                  aria-hidden="true"
                  className="shrink-0 text-coral-500 transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="medida-leitura mt-3 text-corpo text-grafite">{f.answer}</p>
            </details>
          ))}
        </div>

        <a
          href={whatsappLink("faq")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-full border-2 border-petroleo-600 px-6 py-3 font-display font-bold text-petroleo-600 transition-all hover:-translate-y-0.5 hover:border-petroleo-700 hover:text-petroleo-700 focus-visible:outline-4 focus-visible:outline-petroleo-300"
        >
          Ficou outra dúvida? Fale comigo
        </a>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </section>
  );
}
