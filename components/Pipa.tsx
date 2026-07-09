/**
 * Símbolo da marca: pipa + onda sonora (manual §01).
 * Cores fixas do sistema — o manual proíbe recolorir o símbolo.
 * `variant="mono"` é a versão monocromática (carimbo, fundo de baixa impressão).
 */
export default function Pipa({
  className = "h-8 w-8",
  variant = "cor",
}: {
  className?: string;
  variant?: "cor" | "mono";
}) {
  const esquerda = variant === "mono" ? "#17527B" : "#FF6F61";
  const direita = variant === "mono" ? "#103B59" : "#FFC145";
  const baixo = variant === "mono" ? "#103B59" : "#E8503F";
  const linha = variant === "mono" ? "#17527B" : "#FFC145";
  const onda = variant === "mono" ? "#17527B" : "#17527B";

  return (
    <svg viewBox="0 0 48 64" className={className} aria-hidden="true" focusable="false">
      {/* corpo da pipa: quatro triângulos a partir do centro */}
      <path d="M24 2 L4 22 L24 22 Z" fill={esquerda} />
      <path d="M24 2 L44 22 L24 22 Z" fill={direita} />
      <path d="M4 22 L24 42 L24 22 Z" fill={baixo} />
      <path d="M44 22 L24 42 L24 22 Z" fill={esquerda} />
      {/* linha da pipa */}
      <path d="M24 42 Q28 48 24 52" stroke={linha} strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* onda sonora na ponta da linha */}
      <g stroke={onda} strokeWidth="2" strokeLinecap="round">
        <line x1="16" y1="57" x2="16" y2="60" />
        <line x1="20" y1="54" x2="20" y2="61" />
        <line x1="24" y1="52" x2="24" y2="62" />
        <line x1="28" y1="55" x2="28" y2="60" />
        <line x1="32" y1="57" x2="32" y2="59" />
      </g>
    </svg>
  );
}
