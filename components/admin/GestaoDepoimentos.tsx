"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { excluirDepoimento, salvarDepoimento } from "@/app/admin/(painel)/depoimentos/actions";
import type { Depoimento } from "@/lib/admin/tipos";

const CAMPO =
  "w-full rounded-xl border border-areia bg-white px-4 py-3 text-corpo text-grafite focus-visible:outline-4 focus-visible:outline-petroleo-300";
const VAZIO = { id: null as string | null, author_name: "", city: "", quote: "", published: true };

export default function GestaoDepoimentos({ itens }: { itens: Depoimento[] }) {
  const router = useRouter();
  const [form, setForm] = useState(VAZIO);
  const [aviso, setAviso] = useState<string | null>(null);
  const [ocupado, setOcupado] = useState(false);

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setAviso(null);
    setOcupado(true);
    const r = await salvarDepoimento(form);
    setOcupado(false);
    if (!r.ok) {
      setAviso(r.erro);
      return;
    }
    setForm(VAZIO);
    router.refresh();
  }

  async function excluir(d: Depoimento) {
    if (!window.confirm(`Excluir o depoimento de ${d.author_name}?`)) return;
    const r = await excluirDepoimento(d.id);
    if (!r.ok) setAviso(r.erro);
    router.refresh();
  }

  return (
    <div className="space-y-8">
      <form onSubmit={salvar} className="space-y-4 rounded-2xl border border-areia p-5">
        <h2 className="font-display text-h3 font-bold text-petroleo-600">
          {form.id ? "Editar depoimento" : "Novo depoimento"}
        </h2>
        {/* Lembrete LGPD exigido pelo spec (RF-17 AC3) */}
        <p className="rounded-xl bg-sol-100 p-3 text-apoio text-grafite">
          ⚠ Publique apenas depoimentos <strong>reais</strong>, com <strong>consentimento do
          responsável</strong> guardado (print ou assinatura). Use nome abreviado — ex.:
          &ldquo;Mariana S.&rdquo; — e nunca foto ou nome de criança.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-1">
            <span className="text-apoio font-semibold text-petroleo-600">Nome abreviado *</span>
            <input value={form.author_name} onChange={(e) => setForm({ ...form, author_name: e.target.value })} placeholder="Mariana S." className={CAMPO} />
          </label>
          <label className="block space-y-1">
            <span className="text-apoio font-semibold text-petroleo-600">Cidade</span>
            <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="São Gabriel do Oeste" className={CAMPO} />
          </label>
        </div>
        <label className="block space-y-1">
          <span className="text-apoio font-semibold text-petroleo-600">Depoimento *</span>
          <textarea value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} rows={3} className={CAMPO} />
        </label>
        <label className="flex items-center gap-2 text-apoio font-semibold text-petroleo-600">
          <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="size-4" />
          Visível no site
        </label>

        {aviso && <p className="text-apoio font-semibold text-erro">{aviso}</p>}

        <div className="flex gap-3">
          <button type="submit" disabled={ocupado} className="rounded-full bg-coral-500 px-6 py-3 font-display font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-coral-600 disabled:opacity-60">
            {form.id ? "Salvar alterações" : "Adicionar"}
          </button>
          {form.id && (
            <button type="button" onClick={() => setForm(VAZIO)} className="rounded-full border-2 border-petroleo-600 px-6 py-3 font-display font-bold text-petroleo-600">
              Cancelar
            </button>
          )}
        </div>
      </form>

      <ul className="space-y-3">
        {itens.map((d) => (
          <li key={d.id} className="flex flex-wrap items-start gap-3 rounded-2xl border border-areia bg-creme p-4">
            <div className="min-w-0 flex-1">
              <p className="text-corpo italic text-grafite">“{d.quote}”</p>
              <p className="mt-1 text-apoio font-semibold text-petroleo-600">
                {d.author_name}
                {d.city ? ` · ${d.city}` : ""} {!d.published && <span className="text-grafite/60">· oculto</span>}
              </p>
            </div>
            <button type="button" onClick={() => setForm({ id: d.id, author_name: d.author_name, city: d.city ?? "", quote: d.quote, published: d.published })} className="text-apoio font-semibold text-petroleo-600 underline-offset-4 hover:underline">
              Editar
            </button>
            <button type="button" onClick={() => excluir(d)} className="text-apoio font-semibold text-erro underline-offset-4 hover:underline">
              Excluir
            </button>
          </li>
        ))}
        {itens.length === 0 && <li className="text-apoio text-grafite/70">Nenhum depoimento cadastrado ainda.</li>}
      </ul>
    </div>
  );
}
