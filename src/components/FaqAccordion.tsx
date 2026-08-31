import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

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
    answer: 'o ciclo de aprofundamento é a nossa comunidade paga por assinatura. inclui encontros quinzenais ao vivo no zoom com bruna e júlia, acesso ilimitado à fogueira comunitária, acervo completo de gravações, mentoria coletiva e materiais exclusivos.',
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
    <section className="py-20 sm:py-28 bg-papelClaro border-t border-b border-papelKraft/40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-bgPlataforma border border-papelKraft/40 text-acentoAzul text-xs sm:text-sm font-semibold uppercase tracking-wider mb-4 shadow-sm">
            <img
              src="/brand-assets/icons/icone_63.svg"
              alt="duvidas"
              className="w-5 h-5 object-contain"
            />
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
                className={`rounded-2xl sm:rounded-3xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'bg-papelClaro border-papelKraft/40 shadow-kraft-lg'
                    : 'bg-bgPlataforma/70 border-papelKraft/30 hover:bg-papelClaro/80 hover:shadow-sm'
                }`}
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full p-5 sm:p-7 text-left flex justify-between items-center gap-4 focus:outline-none cursor-pointer group select-none"
                >
                  <span className="font-bold text-xl sm:text-2xl font-editorial text-acentoAzul lowercase transition-colors">
                    {item.question}
                  </span>

                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                      isOpen
                        ? 'bg-acentoAzul text-white rotate-180 shadow-sm'
                        : 'bg-acentoAzul/10 text-acentoAzul group-hover:bg-acentoAzul group-hover:text-white'
                    }`}
                  >
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>

                <div
                  className={`transition-all duration-500 overflow-hidden ${
                    isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-5 sm:px-7 pb-6 pt-3 border-t border-papelKraft/30 text-tintaCarvao/85 text-base sm:text-lg leading-relaxed font-medium lowercase flex items-start gap-3.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-acentoOliva mt-2 flex-shrink-0 shadow-sm" />
                    <p className="flex-1">{item.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
