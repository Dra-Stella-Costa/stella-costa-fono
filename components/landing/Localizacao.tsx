import { ADDRESS, CITY } from "@/lib/site";

export default function Localizacao() {
  return (
    <section id="localizacao" className="bg-areia/50">
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-16">
        <h2 className="font-display text-h2 font-bold text-petroleo-600">
          Onde <span className="text-coral-500">atendo</span>
        </h2>

        {/* TODO (D3): endereço completo do consultório */}
        <p className="medida-leitura text-corpo text-grafite">
          Atendimento presencial em {CITY} e teleconsulta para famílias de todo o Brasil.
        </p>

        {/* loading="lazy": o mapa não entra no caminho do LCP (spec RF-08.2) */}
        <iframe
          title={`Mapa de ${ADDRESS.addressLocality}, ${ADDRESS.addressRegion}`}
          src="https://www.google.com/maps?q=S%C3%A3o%20Gabriel%20do%20Oeste%2C%20MS&output=embed"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-80 w-full rounded-2xl border border-areia"
        />
      </div>
    </section>
  );
}
