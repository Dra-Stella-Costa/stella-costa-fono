import Link from "next/link";
import Pipa from "@/components/Pipa";

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-5xl flex-col items-start gap-6 px-4 py-24">
      <Pipa className="h-16 w-12" />
      <h1 className="font-display text-h2 font-bold text-petroleo-600">
        Essa pipa <span className="text-coral-500">se soltou da linha</span>
      </h1>
      <p className="medida-leitura text-corpo text-grafite">
        A página que você procurou não existe ou mudou de endereço. Vamos voltar para o começo?
      </p>
      <Link
        href="/"
        className="rounded-full bg-coral-500 px-6 py-3 font-display font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-coral-600 focus-visible:outline-4 focus-visible:outline-petroleo-300"
      >
        Voltar para o início
      </Link>
    </section>
  );
}
