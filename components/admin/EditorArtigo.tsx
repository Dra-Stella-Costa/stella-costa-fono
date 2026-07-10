"use client";

import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useRef, useState } from "react";
import { uploadImagem } from "@/components/admin/upload";

type Props = { valorInicial: string; onChange: (html: string) => void };

/**
 * Editor rico (US-11): emite o mesmo HTML que o blog sanitiza e renderiza.
 * Toolbar mínima pensada para o polegar — Stella publica do celular.
 */
export default function EditorArtigo({ valorInicial, onChange }: Props) {
  const [avisoUpload, setAvisoUpload] = useState<string | null>(null);
  const inputImagem = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Link.configure({ openOnClick: false }),
      Image,
      Placeholder.configure({ placeholder: "Escreva o artigo aqui…" }),
    ],
    content: valorInicial,
    immediatelyRender: false, // SSR do App Router
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "prose prose-headings:font-display prose-headings:text-petroleo-600 prose-a:text-coral-600 min-h-72 max-w-none px-3 py-2 focus:outline-none text-grafite",
      },
    },
  });

  if (!editor) return <div className="min-h-72 rounded-xl border border-areia bg-white" />;

  async function inserirImagem(arquivo: File) {
    setAvisoUpload(null);
    try {
      const url = await uploadImagem(arquivo);
      editor!.chain().focus().setImage({ src: url, alt: "" }).run();
    } catch (e) {
      // Rede móvel instável (edge case do spec): o texto fica intacto, só avisa
      setAvisoUpload(e instanceof Error ? e.message : "Falha no upload. Tente de novo.");
    }
  }

  function definirLink() {
    const atual = editor!.getAttributes("link").href as string | undefined;
    const url = window.prompt("Endereço do link (https://…)", atual ?? "https://");
    if (url === null) return;
    if (url === "" || url === "https://") editor!.chain().focus().unsetLink().run();
    else editor!.chain().focus().setLink({ href: url }).run();
  }

  return (
    <div className="rounded-xl border border-areia bg-white">
      <div className="flex flex-wrap gap-1 border-b border-areia p-2">
        <Botao editor={editor} ativo="bold" onClick={() => editor.chain().focus().toggleBold().run()} rotulo="N" title="Negrito" className="font-bold" />
        <Botao editor={editor} ativo="italic" onClick={() => editor.chain().focus().toggleItalic().run()} rotulo="I" title="Itálico" className="italic" />
        <Botao editor={editor} ativo="heading" ativoAttrs={{ level: 2 }} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} rotulo="T1" title="Título" />
        <Botao editor={editor} ativo="heading" ativoAttrs={{ level: 3 }} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} rotulo="T2" title="Subtítulo" />
        <Botao editor={editor} ativo="bulletList" onClick={() => editor.chain().focus().toggleBulletList().run()} rotulo="•" title="Lista" />
        <Botao editor={editor} ativo="orderedList" onClick={() => editor.chain().focus().toggleOrderedList().run()} rotulo="1." title="Lista numerada" />
        <Botao editor={editor} ativo="link" onClick={definirLink} rotulo="Link" title="Link" />
        <Botao editor={editor} onClick={() => inputImagem.current?.click()} rotulo="Foto" title="Inserir imagem" />
        <input
          ref={inputImagem}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) inserirImagem(f);
            e.target.value = "";
          }}
        />
      </div>
      {avisoUpload && <p className="px-3 pt-2 text-apoio font-semibold text-erro">{avisoUpload}</p>}
      <EditorContent editor={editor} />
    </div>
  );
}

function Botao({
  editor,
  ativo,
  ativoAttrs,
  onClick,
  rotulo,
  title,
  className = "",
}: {
  editor: Editor;
  ativo?: string;
  ativoAttrs?: Record<string, unknown>;
  onClick: () => void;
  rotulo: string;
  title: string;
  className?: string;
}) {
  const estaAtivo = ativo ? editor.isActive(ativo, ativoAttrs) : false;
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`min-w-10 rounded-lg px-3 py-2 font-display text-sm font-bold transition-colors focus-visible:outline-4 focus-visible:outline-petroleo-300 ${
        estaAtivo ? "bg-petroleo-600 text-white" : "text-petroleo-600 hover:bg-areia"
      } ${className}`}
    >
      {rotulo}
    </button>
  );
}
