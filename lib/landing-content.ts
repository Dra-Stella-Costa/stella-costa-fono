/**
 * Conteúdo da landing de conversão.
 *
 * ⚠ TODO O CONTEÚDO DESTE ARQUIVO É RASCUNHO NÃO VALIDADO (D3/D4).
 *
 * - DEPOIMENTOS: inventados. Não são reais nem autorizados (LGPD).
 * - FAIXAS_ETARIAS: conteúdo CLÍNICO. Só a Stella (CRFa) pode aprovar.
 * - FAQS: afirmam fatos comerciais NÃO confirmados (duração da sessão, particular,
 *   recibo para reembolso). Publicar sem revisão = compromisso que ela nunca fez.
 *
 * Enquanto `CONTEUDO_VALIDADO` for `false`, o verificador (CHK-043/052) trata a
 * presença destes textos em produção como FAIL. Ao substituir pelo conteúdo real
 * da Stella, vire a flag para `true` na mesma alteração.
 */

/** Vire para `true` somente quando a Stella tiver revisado e aprovado tudo abaixo. */
export const CONTEUDO_VALIDADO = false;

/**
 * Trechos únicos usados pelo verificador para detectar rascunho servido em produção.
 * Se editar os textos, atualize esta lista.
 */
export const MARCADORES_PLACEHOLDER = [
  "Chegamos inseguros e saímos com mais clareza",
  "A teleconsulta funcionou muito bem para a nossa rotina",
  "Fomos bem recebidos e sentimos confiança na avaliação",
  "cerca de 40 a 50 minutos",
  "Posso emitir recibo para reembolso",
];

export type FaixaEtaria = {
  id: string;
  titulo: string;
  /** Rótulo legível que o verify.mjs detecta (ex.: "0-12 meses") */
  faixa: string;
  sinais: string[];
};

export type Depoimento = {
  author: string;
  city: string;
  quote: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

/** Sinais de alerta em linguagem acessível (placeholder clínico — D3). */
export const FAIXAS_ETARIAS: FaixaEtaria[] = [
  {
    id: "0-12",
    titulo: "Bebês",
    faixa: "0-12 meses",
    sinais: [
      "Não reage a sons familiares ou não se acalma com a voz dos pais",
      "Não balbucia (sons como “ba”, “da”) por volta dos 9–12 meses",
      "Não busca o olhar ou o sorriso de quem brinca com ele",
    ],
  },
  {
    id: "1-2",
    titulo: "Primeiros passos na fala",
    faixa: "1-2 anos",
    sinais: [
      "Usa poucas palavras ou gestos para pedir o que quer",
      "Dificuldade em imitar sons e brincadeiras simples",
      "Parece não entender pedidos curtos do dia a dia",
    ],
  },
  {
    id: "2-3",
    titulo: "Frases e interação",
    faixa: "2-3 anos",
    sinais: [
      "Fala pouco ou de forma que só a família entende",
      "Não junta duas palavras (ex.: “quer água”)",
      "Prefere brincar sozinho e evita interações com outras crianças",
    ],
  },
  {
    id: "3-4",
    titulo: "Clareza e compreensão",
    faixa: "3-4 anos",
    sinais: [
      "Pessoas de fora da família têm dificuldade em entender a fala",
      "Troca ou omite muitos sons na fala",
      "Dificuldade em seguir rotinas com dois ou três passos",
    ],
  },
  {
    id: "4+",
    titulo: "Escola e comunicação",
    faixa: "4+ anos",
    sinais: [
      "Fala ainda pouco clara para a idade",
      "Dificuldade em contar o que aconteceu no dia ou em conversas",
      "Evita falar em grupo, na escola ou com desconhecidos",
    ],
  },
];

/**
 * PLACEHOLDER — não são depoimentos reais nem autorizados.
 * Substituir por textos com consentimento (D3) antes do go-live.
 * Spec: seção omitida se array vazio; com seed ≥3 a seção renderiza.
 */
export const DEPOIMENTOS: Depoimento[] = [
  {
    author: "Mariana S.",
    city: "São Gabriel do Oeste",
    quote:
      "Chegamos inseguros e saímos com mais clareza sobre o desenvolvimento da nossa filha. O atendimento é acolhedor e a Stella explica tudo com calma.",
  },
  {
    author: "Carla M.",
    city: "Camapuã",
    quote:
      "A teleconsulta funcionou muito bem para a nossa rotina. Meu filho se envolve nas atividades e eu consigo acompanhar cada orientação.",
  },
  {
    author: "Ana P.",
    city: "Campo Grande",
    quote:
      "Fomos bem recebidos e sentimos confiança na avaliação. É bom ter alguém que entende de infância e fala de forma simples com a família.",
  },
];

/** FAQ placeholder — validar com Stella (D3). Mín. 6 para schema FAQPage. */
export const FAQS: FaqItem[] = [
  {
    question: "A partir de qual idade a criança pode ser atendida?",
    answer:
      "O acompanhamento pode começar cedo, inclusive no primeiro ano de vida, quando há sinais de alerta ou dúvidas da família. A faixa mais comum no consultório é de 1 a 7 anos, mas cada caso é avaliado individualmente.",
  },
  {
    question: "Como funciona a primeira consulta?",
    answer:
      "Na primeira conversa, escuto a história da criança e as preocupações da família. Em seguida, faço uma avaliação lúdica — com brincadeiras e materiais adequados à idade — e explico os próximos passos com clareza, sem pressa.",
  },
  {
    question: "Vocês atendem por convênio?",
    answer:
      "O atendimento é particular. Posso emitir recibo para reembolso, conforme a política do seu plano. Fale comigo no WhatsApp para confirmar os detalhes do seu caso.",
  },
  {
    question: "Qual a duração de cada sessão?",
    answer:
      "As sessões costumam durar cerca de 40 a 50 minutos, de acordo com a idade e o foco do trabalho. Na avaliação inicial combinamos a frequência que faz sentido para a criança e a família.",
  },
  {
    question: "A teleconsulta serve para qualquer situação?",
    answer:
      "A teleconsulta é uma boa opção para muitas demandas de fala e linguagem, orientação familiar e acompanhamento. Em alguns casos, o presencial é mais indicado — na conversa inicial avaliamos juntas o formato mais adequado.",
  },
  {
    question: "Como faço para agendar?",
    answer:
      "Pelo WhatsApp do site (com uma mensagem já pronta) ou pela página de teleconsulta, quando o agendamento online estiver disponível. Respondo com os horários e as orientações para o primeiro contato.",
  },
];
