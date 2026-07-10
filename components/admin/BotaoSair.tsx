"use client";

import { createClient } from "@/lib/supabase/browser";

export default function BotaoSair({ className }: { className?: string }) {
  async function sair() {
    await createClient().auth.signOut();
    window.location.href = "/admin/login";
  }

  return (
    <button type="button" onClick={sair} className={className}>
      Sair
    </button>
  );
}
