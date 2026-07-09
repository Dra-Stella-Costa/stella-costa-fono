import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  // /teleconsulta e /blog (com artigos publicados) entram aqui quando as
  // rotas existirem (M2/M3) — o verificador acusa a ausência até lá.
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
