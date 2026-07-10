import GestaoDepoimentos from "@/components/admin/GestaoDepoimentos";
import type { Depoimento } from "@/lib/admin/tipos";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDepoimentosPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("id, author_name, city, quote, sort_order, published")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw new Error(`Supabase (depoimentos): ${error.message}`);

  return (
    <section className="space-y-6">
      <h1 className="font-display text-h2 font-bold text-petroleo-600">Depoimentos</h1>
      <GestaoDepoimentos itens={(data ?? []) as Depoimento[]} />
    </section>
  );
}
