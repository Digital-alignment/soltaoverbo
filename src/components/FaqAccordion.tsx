import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const faqData: FaqItem[] = [
  {
    question: 'como funciona o acesso aos 21 dias de escrita?',
    answer: 'ao garantir sua vaga no 21 dias de escrita, você recebe acesso imediato à plataforma. a cada dia é liberado um novo exercício guiado, áudio de reflexão e o espaço da nossa fogueira para partilha com o grupo.',
  },
  {
    question: 'o que está incluído no ciclo de aprofundamento?',
    answer: 'o ciclo de aprofundamento é a nossa comunidade paga por assinatura. inclui encontros quinzenais ao vivo com a ashuan, acesso ilimitado à fogueira comunitária, acervo completo de gravações, mentoria coletiva e materiais exclusivos.',
  },
  {
    question: 'preciso ter experiência prévia com escrita?',
    answer: 'não! o solta o verbo não é sobre técnica acadêmica ou gramática rígida, mas sobre escuta interna, presença e liberdade narrativa. qualquer pessoa disposta a escrever sua própria história é bem-vinda.',
  },
  {
    question: 'quais são as formas de pagamento disponíveis?',
    answer: 'aceitamos pagamento à vista via pix (com desconto especial), cartão de crédito com parcelamento em até 3x sem juros, e boleto bancário.',
  },
  {
    question: 'como funciona a comunidade gratuita x paga?',
    answer: 'estamos fazendo a transição para tornar a nossa comunidade ainda mais acolhedora e sustentável. o 21 dias de escrita dá acesso durante a jornada. o ciclo de aprofundamento é o espaço vivo contínuo com encontros ao vivo.',
  },
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 sm:py-28 bg-papelClaro border-t border-b border-papelKraft/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-bgPlataforma border border-papelKraft/60 text-acentoAzul text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
            <HelpCircle className="w-4 h-4 text-acentoTerracota" />
            <span>dúvidas frequentes</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-editorial text-acentoAzul lowercase mb-4">
            perguntas que costumam surgir
          </h2>
          <p className="text-tintaCarvao/80 text-base sm:text-lg max-w-2xl mx-auto font-medium lowercase">
            respostas simples e diretas para você dar o próximo passo com segurança.
          </p>
        </div>

        <div className="space-y-4">
          {faqData.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-3xl border border-papelKraft/60 bg-bgPlataforma/60 overflow-hidden transition-all duration-300 shadow-sm hover:border-papelKraft"
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full py-5 px-6 sm:px-8 text-left flex justify-between items-center gap-4 focus:outline-none"
                >
                  <span className="font-semibold text-lg sm:text-xl text-acentoAzul lowercase font-editorial">
                    {item.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full bg-papelClaro border border-papelKraft/60 flex items-center justify-center text-acentoAzul transition-transform duration-300 flex-shrink-0 ${
                      isOpen ? 'rotate-180 bg-acentoAzul text-white border-transparent' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 sm:px-8 pb-6 text-tintaCarvao/85 text-base sm:text-lg leading-relaxed lowercase font-medium border-t border-papelKraft/30 pt-4 animate-fadeIn">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
