import { notFound } from "next/navigation";
import FormArtigo from "@/components/admin/FormArtigo";
import { createClient } from "@/lib/supabase/server";

type Props = { params: Promise<{ id: string }> };

export default async function EditarArtigoPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: a } = await supabase
    .from("articles")
    .select("id, title, slug, excerpt, content, cover_url, meta_title, meta_description, status")
    .eq("id", id)
    .maybeSingle();

  if (!a) notFound();

  return (
    <section className="space-y-6">
      <h1 className="font-display text-h2 font-bold text-petroleo-600">Editar artigo</h1>
      <FormArtigo
        inicial={{
          id: a.id,
          title: a.title ?? "",
          slug: a.slug ?? "",
          excerpt: a.excerpt ?? "",
          content: a.content ?? "",
          cover_url: a.cover_url,
          meta_title: a.meta_title ?? "",
          meta_description: a.meta_description ?? "",
          status: a.status,
        }}
      />
    </section>
  );
}
