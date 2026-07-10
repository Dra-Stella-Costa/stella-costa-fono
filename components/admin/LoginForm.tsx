"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/browser";

const CAMPO =
  "w-full rounded-xl border border-areia bg-white px-4 py-3 text-corpo text-grafite focus-visible:outline-4 focus-visible:outline-petroleo-300";

export default function LoginForm({ avisoInicial }: { avisoInicial: string | null }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [aviso, setAviso] = useState(avisoInicial);
  const [ok, setOk] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setAviso(null);
    setOk(null);
    setEnviando(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
    setEnviando(false);
    if (error) {
      // Mensagem única de propósito: não revelar se o e-mail existe
      setAviso("E-mail ou senha inválidos.");
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  async function recuperarSenha() {
    setAviso(null);
    setOk(null);
    if (!email) {
      setAviso("Preencha o e-mail para recuperar a senha.");
      return;
    }
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/atualizar-senha`,
    });
    if (error) setAviso("Não foi possível enviar o e-mail agora. Tente de novo em instantes.");
    else setOk("Se o e-mail estiver cadastrado, você receberá o link de redefinição.");
  }

  return (
    <form onSubmit={entrar} className="space-y-4">
      <label className="block space-y-1">
        <span className="text-apoio font-semibold text-petroleo-600">E-mail</span>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={CAMPO}
        />
      </label>
      <label className="block space-y-1">
        <span className="text-apoio font-semibold text-petroleo-600">Senha</span>
        <input
          type="password"
          required
          autoComplete="current-password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className={CAMPO}
        />
      </label>

      {aviso && <p className="text-apoio font-semibold text-erro">{aviso}</p>}
      {ok && <p className="text-apoio font-semibold text-sucesso">{ok}</p>}

      <button
        type="submit"
        disabled={enviando}
        className="w-full rounded-full bg-coral-500 px-6 py-3 font-display font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-coral-600 focus-visible:outline-4 focus-visible:outline-petroleo-300 disabled:opacity-60"
      >
        {enviando ? "Entrando…" : "Entrar"}
      </button>
      <button
        type="button"
        onClick={recuperarSenha}
        className="w-full text-apoio font-semibold text-petroleo-600 underline-offset-4 hover:underline"
      >
        Esqueci a senha
      </button>
    </form>
  );
}
