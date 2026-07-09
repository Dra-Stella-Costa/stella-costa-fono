import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-5xl flex-col items-start gap-6 px-4 py-24">
      <h1 className="text-4xl font-extrabold text-brand-800">Página não encontrada</h1>
      <p className="max-w-xl text-lg text-brand-700">
        O endereço que você tentou acessar não existe ou foi movido. Que tal voltar para o início?
      </p>
      <Link
        href="/"
        className="rounded-full bg-brand-600 px-6 py-3 text-base font-bold text-white transition-colors hover:bg-brand-700"
      >
        Voltar para o início
      </Link>
    </section>
  );
}
