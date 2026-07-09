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
    <div className={`relative ${className}`}>
      {/* contorno tracejado deslocado 10px */}
      <div
        aria-hidden="true"
        className="absolute inset-0 translate-x-[10px] translate-y-[10px] rounded-b-3xl rounded-t-full border-2 border-dashed border-sol-500"
      />
      <div className="relative aspect-4/5 overflow-hidden rounded-b-3xl rounded-t-full bg-areia">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 1024px) 100vw, 40vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}
