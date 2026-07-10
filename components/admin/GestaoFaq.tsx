"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { excluirFaq, moverFaq, salvarFaq } from "@/app/admin/(painel)/faq/actions";
import type { FaqItem } from "@/lib/admin/tipos";

const CAMPO =
  "w-full rounded-xl border border-areia bg-white px-4 py-3 text-corpo text-grafite focus-visible:outline-4 focus-visible:outline-petroleo-300";
const VAZIO = { id: null as string | null, question: "", answer: "", published: true };

export default function GestaoFaq({ itens }: { itens: FaqItem[] }) {
  const router = useRouter();
  const [form, setForm] = useState(VAZIO);
  const [aviso, setAviso] = useState<string | null>(null);
  const [ocupado, setOcupado] = useState(false);

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setAviso(null);
    setOcupado(true);
    const r = await salvarFaq(form);
    setOcupado(false);
    if (!r.ok) {
      setAviso(r.erro);
      return;
    }
    setForm(VAZIO);
    router.refresh();
  }

  async function excluir(f: FaqItem) {
    if (!window.confirm(`Excluir a pergunta "${f.question}"?`)) return;
    const r = await excluirFaq(f.id);
    if (!r.ok) setAviso(r.erro);
    router.refresh();
  }

  async function mover(id: string, direcao: "cima" | "baixo") {
    await moverFaq(id, direcao);
    router.refresh();
  }

  return (
    <div className="space-y-8">
      <form onSubmit={salvar} className="space-y-4 rounded-2xl border border-areia p-5">
        <h2 className="font-display text-h3 font-bold text-petroleo-600">
          {form.id ? "Editar pergunta" : "Nova pergunta"}
        </h2>
        <label className="block space-y-1">
          <span className="text-apoio font-semibold text-petroleo-600">Pergunta *</span>
          <input value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} className={CAMPO} />
        </label>
        <label className="block space-y-1">
          <span className="text-apoio font-semibold text-petroleo-600">Resposta *</span>
          <textarea value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} rows={3} className={CAMPO} />
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
        {itens.map((f, i) => (
          <li key={f.id} className="flex flex-wrap items-start gap-3 rounded-2xl border border-areia bg-creme p-4">
            <div className="flex flex-col gap-1">
              <button type="button" onClick={() => mover(f.id, "cima")} disabled={i === 0} aria-label="Mover para cima" className="rounded px-2 font-bold text-petroleo-600 hover:bg-areia disabled:opacity-30">
                ↑
              </button>
              <button type="button" onClick={() => mover(f.id, "baixo")} disabled={i === itens.length - 1} aria-label="Mover para baixo" className="rounded px-2 font-bold text-petroleo-600 hover:bg-areia disabled:opacity-30">
                ↓
              </button>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display font-bold text-petroleo-600">
                {f.question} {!f.published && <span className="font-sans text-apoio font-semibold text-grafite/60">· oculto</span>}
              </p>
              <p className="mt-1 text-apoio text-grafite">{f.answer}</p>
            </div>
            <button type="button" onClick={() => setForm({ id: f.id, question: f.question, answer: f.answer, published: f.published })} className="text-apoio font-semibold text-petroleo-600 underline-offset-4 hover:underline">
              Editar
            </button>
            <button type="button" onClick={() => excluir(f)} className="text-apoio font-semibold text-erro underline-offset-4 hover:underline">
              Excluir
            </button>
          </li>
        ))}
        {itens.length === 0 && <li className="text-apoio text-grafite/70">Nenhuma pergunta cadastrada ainda.</li>}
      </ul>
    </div>
  );
}
