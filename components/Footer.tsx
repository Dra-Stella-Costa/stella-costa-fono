import Pipa from "@/components/Pipa";
import { CITY, CRFA_NUMBER, SITE_NAME } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="bg-petroleo-600 text-petroleo-100">
      <div className="mx-auto max-w-5xl space-y-5 px-4 py-10">
        <div className="flex items-center gap-3">
          <Pipa className="h-10 w-8" />
          <div className="leading-tight">
            <p className="font-display text-lg font-extrabold text-creme">Stella Costa</p>
            <p className="text-eyebrow font-bold uppercase tracking-[0.14em] text-sol-500">
              Fonoaudiologia Infantil
            </p>
          </div>
        </div>

        <p className="text-apoio font-semibold text-creme">
          {CITY}
          {CRFA_NUMBER ? ` · CRFa ${CRFA_NUMBER}` : ""} · Teleconsulta em todo o Brasil
        </p>

        <p className="medida-leitura text-apoio">
          <span className="font-semibold text-creme">Aviso de privacidade:</span> este site não
          coleta dados pessoais por formulários próprios. Os agendamentos de teleconsulta são
          processados pela plataforma Cal.com, que trata os dados informados no agendamento (nome e
          e-mail do responsável) conforme a política de privacidade dela. O contato por WhatsApp
          acontece diretamente no aplicativo, fora deste site.
        </p>

        <p className="text-apoio text-petroleo-300">
          © {new Date().getFullYear()} {SITE_NAME}. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
