import type { MetadataRoute } from "next";
import { mostrarRascunho } from "@/lib/landing-content";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const rotas: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  // /teleconsulta só entra no sitemap quando estiver publicada (D4) — indexar uma
  // rota que responde 404 é pior do que não indexá-la.
  if (mostrarRascunho()) {
    rotas.push({
      url: `${SITE_URL}/teleconsulta`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  // /blog e artigos entram em M3.
  return rotas;
}
