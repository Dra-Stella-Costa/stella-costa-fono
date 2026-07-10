"use client";

import { createClient } from "@/lib/supabase/browser";

const LARGURA_MAX = 1600;
const QUALIDADE = 0.8;

/**
 * Redimensiona no browser (free tier: sem função de servidor) e converte para
 * WebP — foto de celular de 6 MB vira ~150 KB antes de subir pelo 4G.
 */
async function redimensionar(arquivo: File): Promise<Blob> {
  const bitmap = await createImageBitmap(arquivo);
  const escala = Math.min(1, LARGURA_MAX / bitmap.width);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * escala);
  canvas.height = Math.round(bitmap.height * escala);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", QUALIDADE),
  );
  if (!blob) throw new Error("Não foi possível processar a imagem.");
  return blob;
}

/** Sobe ao bucket `media` (escrita restrita à Stella via RLS) e devolve a URL pública. */
export async function uploadImagem(arquivo: File): Promise<string> {
  if (!arquivo.type.startsWith("image/"))
    throw new Error("Escolha um arquivo de imagem (foto, PNG, JPG…).");

  const blob = await redimensionar(arquivo);
  const caminho = `artigos/${crypto.randomUUID()}.webp`;

  const supabase = createClient();
  const { error } = await supabase.storage
    .from("media")
    .upload(caminho, blob, { contentType: "image/webp" });
  if (error) throw new Error(`Falha no upload: ${error.message}. Tente de novo.`);

  return supabase.storage.from("media").getPublicUrl(caminho).data.publicUrl;
}
