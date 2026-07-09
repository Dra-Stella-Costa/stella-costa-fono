import Image from "next/image";

/**
 * Moldura "arco de pipa" (manual §04): topo em arco alto, base com cantos de 24px,
 * contorno tracejado em Sol deslocado 10px, lembrando linha de pipa.
 * Alternativa proprietária aos arcos genéricos de clínica.
 */
export default function FotoArcoDePipa({
  src,
  alt,
  priority = false,
  className = "",
}: {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    // O padding reserva os 10px do contorno; sem ele o tracejado seria cortado
    // pelo overflow-hidden da seção do hero.
    <div className={`relative p-[10px] ${className}`}>
      {/* contorno tracejado 10px ao redor da foto, acompanhando o arco */}
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-b-[34px] rounded-t-full border-2 border-dashed border-sol-500"
      />
      <div className="relative aspect-4/5 overflow-hidden rounded-b-3xl rounded-t-full bg-areia">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 1024px) 100vw, 40vw"
          className="object-cover object-top"
        />
      </div>
    </div>
  );
}
