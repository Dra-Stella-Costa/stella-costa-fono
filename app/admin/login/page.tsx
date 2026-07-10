import LoginForm from "@/components/admin/LoginForm";

type Props = { searchParams: Promise<{ erro?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const { erro } = await searchParams;

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center gap-6 px-4 py-14">
      <div className="space-y-2">
        <h1 className="font-display text-h2 font-bold text-petroleo-600">Painel da Stella</h1>
        <p className="text-apoio text-grafite">Área restrita para gestão do site.</p>
      </div>
      <LoginForm avisoInicial={erro === "nao-autorizado" ? "Esta conta não tem acesso ao painel." : null} />
    </section>
  );
}
