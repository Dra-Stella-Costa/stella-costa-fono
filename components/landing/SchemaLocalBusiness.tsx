import { ADDRESS, PROFESSIONAL_NAME, SITE_NAME, SITE_URL, telephoneE164 } from "@/lib/site";

/** JSON-LD MedicalBusiness da home (RF-06 / CHK-182). */
export default function SchemaLocalBusiness() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: SITE_NAME,
    founder: { "@type": "Person", name: PROFESSIONAL_NAME },
    medicalSpecialty: "Speech-Language Pathology",
    url: SITE_URL,
    image: `${SITE_URL}/imagens/stella-institucional.jpg`,
    telephone: telephoneE164(),
    address: {
      "@type": "PostalAddress",
      // streetAddress omitido enquanto D3 pendente — não inventar endereço
      addressLocality: ADDRESS.addressLocality,
      addressRegion: ADDRESS.addressRegion,
      addressCountry: ADDRESS.addressCountry,
    },
    areaServed: [
      { "@type": "City", name: ADDRESS.addressLocality },
      { "@type": "Country", name: "Brasil" },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
