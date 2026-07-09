# Imagens públicas

Tudo aqui é servido em `https://dominio/imagens/<arquivo>`. Só entram imagens
que precisam de URL pública. Assets de marca (logo, favicon) ficam em `public/`.

## Convenção de nomes

| Arquivo | Uso | Formato |
|---------|-----|---------|
| `stella-institucional.jpg` | Foto do hero e da seção "Sobre" (manual §05: fundo claro, olhando para a câmera) | JPG ou WebP, ≥1200px de largura, retrato 4:5 |
| `blog/<slug>-capa.jpg` | Capa de artigo (também usada no Open Graph) | 1200×630 |

## Regras (manual §05 + LGPD/CFFa)

- **Imagem de criança identificável só com termo de autorização assinado pelos responsáveis.**
  Na dúvida, use foto de detalhe (mãos, jogos, materiais).
- Proibido antes/depois e qualquer imagem que exponha diagnóstico de criança identificável.
- Nunca usar foto em depoimentos (CHK-041).
- Sempre renderizar via `next/image` — nunca `<img>` cru (CHK-186). O Next converte
  para WebP/AVIF e gera os tamanhos responsivos automaticamente.
- Fotos de pessoas usam a moldura "arco de pipa" (manual §04).
