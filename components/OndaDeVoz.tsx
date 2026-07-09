/**
 * Grafismo "onda de voz" (manual §04): divisor de seções, detalhe em cartões,
 * bullet de listas. Só em Coral ou Sol. Máximo dois grafismos por tela.
 */
export default function OndaDeVoz({
  className = "h-6 w-10",
  cor = "coral",
}: {
  className?: string;
  cor?: "coral" | "sol";
}) {
  const stroke = cor === "coral" ? "#FF6F61" : "#FFC145";
  return (
    <svg viewBox="0 0 40 24" className={className} aria-hidden="true" focusable="false">
      <g stroke={stroke} strokeWidth="2.5" strokeLinecap="round">
        <line x1="4" y1="9" x2="4" y2="15" />
        <line x1="12" y1="4" x2="12" y2="20" />
        <line x1="20" y1="1" x2="20" y2="23" />
        <line x1="28" y1="6" x2="28" y2="18" />
        <line x1="36" y1="10" x2="36" y2="14" />
      </g>
    </svg>
  );
}
