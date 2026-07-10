import type { MetadataRoute } from "next";
import { getPublishedArticles } from "@/lib/blog";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const artigos = await getPublishedArticles();

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/teleconsulta`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...artigos.map((artigo) => ({
      url: `${SITE_URL}/blog/${artigo.slug}`,
      lastModified: new Date(artigo.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
