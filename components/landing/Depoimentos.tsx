import OndaDeVoz from "@/components/OndaDeVoz";
import { DEPOIMENTOS } from "@/lib/landing-content";

export default function Depoimentos() {
  // Spec US-04.3: nunca renderizar a seção vazia.
  if (DEPOIMENTOS.length === 0) return null;

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
          {DEPOIMENTOS.map((d) => (
            <li
              key={d.author}
              className="relative rounded-2xl rounded-bl-none border border-areia bg-creme p-5"
            >
              <blockquote className="text-corpo italic text-grafite">“{d.quote}”</blockquote>
              <p className="mt-4 text-apoio font-semibold text-petroleo-600">
                {d.author} · {d.city}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
