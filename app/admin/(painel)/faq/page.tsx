import GestaoFaq from "@/components/admin/GestaoFaq";
import type { FaqItem } from "@/lib/admin/tipos";
import { createClient } from "@/lib/supabase/server";

export default async function AdminFaqPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("faqs")
    .select("id, question, answer, sort_order, published")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw new Error(`Supabase (FAQ): ${error.message}`);

  return (
    <section className="space-y-6">
      <h1 className="font-display text-h2 font-bold text-petroleo-600">Perguntas frequentes</h1>
      <GestaoFaq itens={(data ?? []) as FaqItem[]} />
    </section>
  );
}
