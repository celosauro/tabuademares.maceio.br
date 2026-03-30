import { useState } from 'react';
import { Question, CaretDown, CaretUp } from '@phosphor-icons/react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: 'O que é a tábua de marés?',
    answer: 'A tábua de marés é uma previsão dos horários e alturas das marés para um determinado local. As informações são calculadas com base em dados astronômicos (posição da Lua e do Sol) e geográficos, permitindo prever com precisão quando o nível do mar estará alto (preamar) ou baixo (baixa-mar).'
  },
  {
    question: 'Como funciona o fenômeno das marés?',
    answer: 'As marés são causadas principalmente pela atração gravitacional da Lua sobre os oceanos, com influência também do Sol. Quando a Lua está mais próxima, a água é "puxada", criando a maré alta. O ciclo completo ocorre aproximadamente a cada 12 horas e 25 minutos, resultando em duas marés altas e duas baixas por dia.'
  },
  {
    question: 'Qual a diferença entre maré alta e baixa?',
    answer: 'A maré alta (preamar) é o momento em que o nível do mar atinge seu ponto máximo, enquanto a maré baixa (baixa-mar) é quando atinge o mínimo. Em Maceió, a variação típica é de cerca de 2 metros entre os extremos, podendo ser maior durante as marés de sizígia (lua cheia ou nova).'
  },
  {
    question: 'O que significa a altura da maré?',
    answer: 'A altura da maré é medida em metros e indica o nível do mar em relação ao Nível de Redução (NR), que é o zero da carta náutica local. Uma altura de 2.0m significa que o mar está 2 metros acima desse nível de referência.'
  },
  {
    question: 'Para que serve a tábua de marés?',
    answer: 'A tábua de marés é essencial para: pescadores (melhores horários de pesca), navegadores (segurança em canais e áreas rasas), surfistas (condições de onda), banhistas (segurança nas praias), praticantes de esportes náuticos e profissionais que trabalham no ambiente marinho.'
  },
  {
    question: 'De onde vêm esses dados?',
    answer: 'Todos os dados são fornecidos pelo Centro de Hidrografia da Marinha (CHM), órgão oficial da Marinha do Brasil responsável pelas previsões de maré. Os horários são específicos para o Porto de Maceió, podendo haver pequenas variações para praias mais distantes.'
  },
];

interface AccordionItemProps {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}

function AccordionItem({ item, isOpen, onToggle }: AccordionItemProps) {
  return (
    <div className="border-b border-tide-100 last:border-none">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 text-left focus:outline-none focus:ring-2 focus:ring-tide-200 rounded-lg"
        aria-expanded={isOpen}
      >
        <span className="font-medium text-tide-700 text-fluid-sm pr-4">{item.question}</span>
        {isOpen ? (
          <CaretUp className="w-5 h-5 text-tide-500 flex-shrink-0" weight="bold" />
        ) : (
          <CaretDown className="w-5 h-5 text-tide-500 flex-shrink-0" weight="bold" />
        )}
      </button>
      {isOpen && (
        <div className="pb-4 text-tide-600 text-fluid-sm leading-relaxed">
          {item.answer}
        </div>
      )}
    </div>
  );
}

interface InfoSectionProps {
  className?: string;
}

export function InfoSection({ className = '' }: InfoSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className={`bg-white rounded-xl shadow-sm border border-tide-100 ${className}`}>
      {/* FAQ Accordion */}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Question weight="duotone" className="w-5 h-5 text-tide-500" />
          <h3 className="text-fluid-base font-semibold text-tide-700">
            Perguntas Frequentes
          </h3>
        </div>
        <div className="divide-y divide-tide-100">
          {faqData.map((item, index) => (
            <AccordionItem
              key={index}
              item={item}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </div>
      </div>

      {/* Source Attribution */}
      <div className="bg-tide-50 rounded-b-xl p-4 text-center">
        <p className="text-fluid-xs text-tide-500">
          Dados oficiais: <strong>Marinha do Brasil - Centro de Hidrografia da Marinha (CHM)</strong>
          <br />
          Os horários são calculados para o Porto de Maceió (Lat: 9°40'S, Long: 35°44'W)
        </p>
      </div>
    </section>
  );
}
