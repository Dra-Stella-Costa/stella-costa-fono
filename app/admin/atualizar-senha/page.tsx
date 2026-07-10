"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/browser";

/**
 * Destino do link de recuperação: o client (PKCE) troca o `?code=` da URL por
 * uma sessão temporária automaticamente; aqui só definimos a senha nova.
 */
export default function AtualizarSenhaPage() {
  const router = useRouter();
  const [senha, setSenha] = useState("");
  const [confirma, setConfirma] = useState("");
  const [aviso, setAviso] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setAviso(null);
    if (senha.length < 8) {
      setAviso("A senha precisa ter pelo menos 8 caracteres.");
      return;
    }
    if (senha !== confirma) {
      setAviso("As senhas não coincidem.");
      return;
    }
    setEnviando(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: senha });
    setEnviando(false);
    if (error) {
      setAviso("Link expirado ou inválido. Solicite a recuperação de novo na tela de login.");
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  const campo =
    "w-full rounded-xl border border-areia bg-white px-4 py-3 text-corpo text-grafite focus-visible:outline-4 focus-visible:outline-petroleo-300";

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center gap-6 px-4 py-14">
      <h1 className="font-display text-h2 font-bold text-petroleo-600">Definir nova senha</h1>
      <form onSubmit={salvar} className="space-y-4">
        <label className="block space-y-1">
          <span className="text-apoio font-semibold text-petroleo-600">Nova senha</span>
          <input
            type="password"
            required
            autoComplete="new-password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className={campo}
          />
        </label>
        <label className="block space-y-1">
          <span className="text-apoio font-semibold text-petroleo-600">Repetir a senha</span>
          <input
            type="password"
            required
            autoComplete="new-password"
            value={confirma}
            onChange={(e) => setConfirma(e.target.value)}
            className={campo}
          />
        </label>

        {aviso && <p className="text-apoio font-semibold text-erro">{aviso}</p>}

        <button
          type="submit"
          disabled={enviando}
          className="w-full rounded-full bg-coral-500 px-6 py-3 font-display font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-coral-600 focus-visible:outline-4 focus-visible:outline-petroleo-300 disabled:opacity-60"
        >
          {enviando ? "Salvando…" : "Salvar e entrar"}
        </button>
      </form>
    </section>
  );
}
