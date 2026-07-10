"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type Resultado = { ok: true } | { ok: false; erro: string };

export async function salvarFaq(dados: {
  id: string | null;
  question: string;
  answer: string;
  published: boolean;
}): Promise<Resultado> {
  if (!dados.question.trim() || !dados.answer.trim())
    return { ok: false, erro: "Pergunta e resposta são obrigatórias." };

  const supabase = await createClient();

  if (dados.id) {
    const { error } = await supabase
      .from("faqs")
      .update({ question: dados.question.trim(), answer: dados.answer.trim(), published: dados.published })
      .eq("id", dados.id);
    if (error) return { ok: false, erro: `Não foi possível salvar: ${error.message}` };
  } else {
    // Nova pergunta entra no fim da lista
    const { data: ultima } = await supabase
      .from("faqs")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();
    const { error } = await supabase.from("faqs").insert({
      question: dados.question.trim(),
      answer: dados.answer.trim(),
      published: dados.published,
      sort_order: (ultima?.sort_order ?? 0) + 1,
    });
    if (error) return { ok: false, erro: `Não foi possível salvar: ${error.message}` };
  }

  revalidatePath("/");
  return { ok: true };
}

export async function excluirFaq(id: string): Promise<Resultado> {
  const supabase = await createClient();
  const { error } = await supabase.from("faqs").delete().eq("id", id);
  if (error) return { ok: false, erro: `Não foi possível excluir: ${error.message}` };
  revalidatePath("/");
  return { ok: true };
}

/** Troca a posição com a vizinha de cima/baixo (spec RF-17: reordenar). */
export async function moverFaq(id: string, direcao: "cima" | "baixo"): Promise<Resultado> {
  const supabase = await createClient();
  const { data: todas, error } = await supabase
    .from("faqs")
    .select("id, sort_order")
    .order("sort_order", { ascending: true });
  if (error || !todas) return { ok: false, erro: "Não foi possível reordenar." };

  const i = todas.findIndex((f) => f.id === id);
  const j = direcao === "cima" ? i - 1 : i + 1;
  if (i < 0 || j < 0 || j >= todas.length) return { ok: true }; // já está na ponta

  const [a, b] = [todas[i], todas[j]];
  const r1 = await supabase.from("faqs").update({ sort_order: b.sort_order }).eq("id", a.id);
  const r2 = await supabase.from("faqs").update({ sort_order: a.sort_order }).eq("id", b.id);
  if (r1.error || r2.error) return { ok: false, erro: "Não foi possível reordenar." };

  revalidatePath("/");
  return { ok: true };
}
