"use client";

import { useEffect, useState } from "react";

/**
 * Compartilhamento do artigo (US P2 / RF-09): Web Share API quando o aparelho
 * suporta; sempre com fallback de WhatsApp e copiar link.
 */
export default function CompartilharArtigo({ url, titulo }: { url: string; titulo: string }) {
  const [temShareNativo, setTemShareNativo] = useState(false);
  const [copiado, setCopiado] = useState(false);

  // Detecção só no cliente — no SSR `navigator` não existe
  useEffect(() => {
    setTemShareNativo(typeof navigator !== "undefined" && "share" in navigator);
  }, []);

  async function compartilharNativo() {
    try {
      await navigator.share({ title: titulo, url });
    } catch {
      // usuário cancelou o share sheet — nada a fazer
    }
  }

  async function copiarLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      // clipboard bloqueado (http/permite): o leitor ainda tem a barra de endereço
    }
  }

  const botaoSecundario =
    "rounded-full border-2 border-petroleo-600 px-4 py-2 font-display text-sm font-bold text-petroleo-600 transition-all hover:-translate-y-0.5 hover:border-petroleo-700 hover:text-petroleo-700 focus-visible:outline-4 focus-visible:outline-petroleo-300";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <p className="text-apoio font-semibold text-petroleo-600">Conhece outra família que precisa ler isso?</p>
      {temShareNativo && (
        <button type="button" onClick={compartilharNativo} className={botaoSecundario}>
          Compartilhar
        </button>
      )}
      <a
        href={`https://wa.me/?text=${encodeURIComponent(`${titulo} — ${url}`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={botaoSecundario}
      >
        Enviar no WhatsApp
      </a>
      <button type="button" onClick={copiarLink} className={botaoSecundario} aria-live="polite">
        {copiado ? "Link copiado!" : "Copiar link"}
      </button>
    </div>
  );
}
