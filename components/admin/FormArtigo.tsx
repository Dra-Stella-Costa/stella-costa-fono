"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  despublicarArtigo,
  excluirArtigo,
  publicarArtigo,
  salvarArtigo,
} from "@/app/admin/(painel)/artigos/actions";
import EditorArtigo from "@/components/admin/EditorArtigo";
import PreviewCompartilhamento from "@/components/admin/PreviewCompartilhamento";
import { uploadImagem } from "@/components/admin/upload";
import { gerarSlug, type ArtigoEditavel } from "@/lib/admin/tipos";

const CAMPO =
  "w-full rounded-xl border border-areia bg-white px-4 py-3 text-corpo text-grafite focus-visible:outline-4 focus-visible:outline-petroleo-300";
const ROTULO = "text-apoio font-semibold text-petroleo-600";

export default function FormArtigo({ inicial }: { inicial: ArtigoEditavel }) {
  const router = useRouter();
  const [artigo, setArtigo] = useState(inicial);
  const [slugManual, setSlugManual] = useState(inicial.status === "published" || !!inicial.slug);
  const [aviso, setAviso] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [ocupado, setOcupado] = useState(false);
  const [temBackup, setTemBackup] = useState(false);

  const chaveBackup = `admin-artigo-${inicial.id ?? "novo"}`;

  // Autosave local (edge case do spec: sessão expirar no meio da escrita).
  // O texto sobrevive no aparelho; limpamos após salvar no banco.
  const artigoRef = useRef(artigo);
  artigoRef.current = artigo;
  useEffect(() => {
    const intervalo = setInterval(() => {
      try {
        localStorage.setItem(chaveBackup, JSON.stringify(artigoRef.current));
      } catch {}
    }, 3000);
    return () => clearInterval(intervalo);
  }, [chaveBackup]);

  useEffect(() => {
    try {
      const salvo = localStorage.getItem(chaveBackup);
      if (salvo && salvo !== JSON.stringify(inicial)) setTemBackup(true);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function campo<K extends keyof ArtigoEditavel>(k: K, v: ArtigoEditavel[K]) {
    setArtigo((a) => {
      const prox = { ...a, [k]: v };
      // Slug acompanha o título até ser editado à mão ou o artigo publicado
      if (k === "title" && !slugManual) prox.slug = gerarSlug(String(v));
      return prox;
    });
  }

  function recuperarBackup() {
    try {
      const salvo = localStorage.getItem(chaveBackup);
      if (salvo) setArtigo(JSON.parse(salvo));
    } catch {}
    setTemBackup(false);
  }

  async function executar(acao: () => Promise<{ ok: boolean; id?: string; erro?: string }>, msgOk: string) {
    setAviso(null);
    setOk(null);
    setOcupado(true);
    const r = await acao();
    setOcupado(false);
    if (!r.ok) {
      setAviso(r.erro ?? "Algo deu errado. Tente de novo.");
      return null;
    }
    setOk(msgOk);
    try {
      localStorage.removeItem(chaveBackup);
    } catch {}
    return r.id ?? null;
  }

  async function salvar(): Promise<string | null> {
    const id = await executar(() => salvarArtigo(artigo), "Rascunho salvo.");
    if (id && !artigo.id) {
      setArtigo((a) => ({ ...a, id }));
      router.replace(`/admin/artigos/${id}`);
    }
    return id ?? artigo.id;
  }

  async function publicar() {
    const id = await salvar();
    if (!id) return;
    const r = await executar(() => publicarArtigo(id), "Publicado! Já está no site.");
    if (r) {
      setArtigo((a) => ({ ...a, status: "published" }));
      setSlugManual(true);
    }
  }

  async function despublicar() {
    if (!artigo.id) return;
    const r = await executar(() => despublicarArtigo(artigo.id!), "Despublicado — saiu do site.");
    if (r) setArtigo((a) => ({ ...a, status: "draft" }));
  }

  async function excluir() {
    if (!artigo.id) return;
    // Confirmação explícita exigida pelo spec (US-11 AC5)
    if (!window.confirm(`Excluir "${artigo.title || "este artigo"}" de vez? Não dá para desfazer.`)) return;
    const r = await executar(() => excluirArtigo(artigo.id!), "Excluído.");
    if (r) router.push("/admin");
  }

  async function subirCapa(arquivo: File) {
    setAviso(null);
    try {
      campo("cover_url", await uploadImagem(arquivo));
    } catch (e) {
      setAviso(e instanceof Error ? e.message : "Falha no upload da capa.");
    }
  }

  const publicado = artigo.status === "published";

  return (
    <div className="space-y-6">
      {temBackup && (
        <div className="flex flex-wrap items-center gap-3 rounded-xl bg-sol-100 p-4">
          <p className="text-apoio font-semibold text-grafite">
            Há um texto não salvo deste artigo neste aparelho.
          </p>
          <button type="button" onClick={recuperarBackup} className="rounded-full border-2 border-petroleo-600 px-4 py-1.5 font-display text-sm font-bold text-petroleo-600">
            Recuperar
          </button>
          <button type="button" onClick={() => setTemBackup(false)} className="text-apoio font-semibold text-grafite underline-offset-4 hover:underline">
            Ignorar
          </button>
        </div>
      )}

      <div className="flex items-center gap-3">
        <span
          className={`rounded-full px-3 py-1 text-apoio font-bold ${
            publicado ? "bg-sucesso/15 text-sucesso" : "bg-areia text-grafite"
          }`}
        >
          {publicado ? "Publicado" : "Rascunho"}
        </span>
        {artigo.slug && publicado && (
          <a href={`/blog/${artigo.slug}`} target="_blank" rel="noopener noreferrer" className="text-apoio font-semibold text-petroleo-600 underline-offset-4 hover:underline">
            Ver no site ↗
          </a>
        )}
      </div>

      <label className="block space-y-1">
        <span className={ROTULO}>Título *</span>
        <input value={artigo.title} onChange={(e) => campo("title", e.target.value)} className={CAMPO} placeholder="Ex.: Meu filho de 2 anos não fala: quando buscar ajuda?" />
      </label>

      <label className="block space-y-1">
        <span className={ROTULO}>Slug (endereço do artigo) *</span>
        <input
          value={artigo.slug}
          onChange={(e) => {
            setSlugManual(true);
            campo("slug", gerarSlug(e.target.value) || e.target.value);
          }}
          disabled={publicado}
          className={`${CAMPO} disabled:opacity-60`}
        />
        {publicado && <span className="text-apoio text-grafite/70">Slug travado: o artigo publicado já tem endereço no Google.</span>}
      </label>

      <label className="block space-y-1">
        <span className={ROTULO}>Resumo (aparece na listagem e no compartilhamento)</span>
        <textarea value={artigo.excerpt} onChange={(e) => campo("excerpt", e.target.value)} rows={2} className={CAMPO} />
      </label>

      <div className="space-y-1">
        <span className={ROTULO}>Imagem de capa</span>
        <div className="flex flex-wrap items-center gap-3">
          <label className="cursor-pointer rounded-full border-2 border-petroleo-600 px-4 py-2 font-display text-sm font-bold text-petroleo-600 transition-all hover:-translate-y-0.5">
            {artigo.cover_url ? "Trocar capa" : "Enviar capa"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) subirCapa(f);
                e.target.value = "";
              }}
            />
          </label>
          {artigo.cover_url && (
            <button type="button" onClick={() => campo("cover_url", null)} className="text-apoio font-semibold text-erro underline-offset-4 hover:underline">
              Remover
            </button>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <span className={ROTULO}>Conteúdo</span>
        <EditorArtigo valorInicial={inicial.content} onChange={(html) => campo("content", html)} />
      </div>

      <details className="rounded-xl border border-areia p-4">
        <summary className="cursor-pointer font-display font-bold text-petroleo-600">SEO (opcional)</summary>
        <div className="mt-4 space-y-4">
          <label className="block space-y-1">
            <span className={ROTULO}>Título para o Google (vazio = usa o título)</span>
            <input value={artigo.meta_title} onChange={(e) => campo("meta_title", e.target.value)} className={CAMPO} />
          </label>
          <label className="block space-y-1">
            <span className={ROTULO}>Descrição para o Google (vazio = usa o resumo)</span>
            <textarea value={artigo.meta_description} onChange={(e) => campo("meta_description", e.target.value)} rows={2} className={CAMPO} />
          </label>
        </div>
      </details>

      <PreviewCompartilhamento
        titulo={artigo.title}
        metaTitle={artigo.meta_title}
        metaDescription={artigo.meta_description}
        excerpt={artigo.excerpt}
        coverUrl={artigo.cover_url}
        slug={artigo.slug}
      />

      {aviso && <p className="text-apoio font-semibold text-erro">{aviso}</p>}
      {ok && <p className="text-apoio font-semibold text-sucesso">{ok}</p>}

      <div className="flex flex-wrap gap-3 border-t border-areia pt-6">
        <button type="button" onClick={salvar} disabled={ocupado} className="rounded-full border-2 border-petroleo-600 px-6 py-3 font-display font-bold text-petroleo-600 transition-all hover:-translate-y-0.5 disabled:opacity-60">
          Salvar rascunho
        </button>
        {publicado ? (
          <button type="button" onClick={despublicar} disabled={ocupado} className="rounded-full border-2 border-petroleo-600 px-6 py-3 font-display font-bold text-petroleo-600 transition-all hover:-translate-y-0.5 disabled:opacity-60">
            Despublicar
          </button>
        ) : (
          <button type="button" onClick={publicar} disabled={ocupado} className="rounded-full bg-coral-500 px-6 py-3 font-display font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-coral-600 disabled:opacity-60">
            Publicar
          </button>
        )}
        {publicado && (
          <button type="button" onClick={publicar} disabled={ocupado} className="rounded-full bg-coral-500 px-6 py-3 font-display font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-coral-600 disabled:opacity-60">
            Salvar e republicar
          </button>
        )}
        <span className="flex-1" />
        {artigo.id && (
          <button type="button" onClick={excluir} disabled={ocupado} className="rounded-full px-6 py-3 font-display font-bold text-erro transition-colors hover:bg-erro/10 disabled:opacity-60">
            Excluir
          </button>
        )}
      </div>
    </div>
  );
}
