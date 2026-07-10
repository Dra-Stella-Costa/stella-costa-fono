import FormArtigo from "@/components/admin/FormArtigo";

export default function NovoArtigoPage() {
  return (
    <section className="space-y-6">
      <h1 className="font-display text-h2 font-bold text-petroleo-600">Novo artigo</h1>
      <FormArtigo
        inicial={{
          id: null,
          title: "",
          slug: "",
          excerpt: "",
          content: "",
          cover_url: null,
          meta_title: "",
          meta_description: "",
          status: "draft",
        }}
      />
    </section>
  );
}
