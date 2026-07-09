import { CITY, CRFA_NUMBER, SITE_NAME } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t border-brand-100 bg-brand-50">
      <div className="mx-auto max-w-5xl space-y-4 px-4 py-8 text-sm text-brand-800">
        <p className="font-bold">
          {SITE_NAME} · {CITY}
          {CRFA_NUMBER ? ` · CRFa ${CRFA_NUMBER}` : null}
        </p>
        <p className="max-w-3xl text-brand-700">
          <span className="font-semibold">Aviso de privacidade:</span> este site não coleta dados
          pessoais por formulários próprios. Os agendamentos de teleconsulta são processados pela
          plataforma Cal.com, que trata os dados informados no agendamento (nome e e-mail do
          responsável) conforme a política de privacidade dela. O contato por WhatsApp acontece
          diretamente no aplicativo, fora deste site.
        </p>
        <p className="text-brand-600">
          © {new Date().getFullYear()} {SITE_NAME}. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
