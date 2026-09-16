import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { usePageContent } from '../hooks/usePageContent';

interface FaqItem {
  question: string;
  answer: string;
}

const faqData: FaqItem[] = [
  {
    question: 'preciso ter experiência com escrita para participar?',
    answer: 'não. aqui não se trata de técnica acadêmica, gramática impecável ou talento literário. o que a gente pratica é escuta interna, presença e liberdade narrativa.',
  },
  {
    question: 'o solta o verbo é um curso de escrita criativa?',
    answer: 'não exatamente. a escrita é a nossa ferramenta, não o nosso produto final. o que buscamos é autodesenvolvimento: dar contorno ao que te habita, reconhecer as narrativas que você repete e reescrevê-las com mais verdade e consciência. quem sai daqui escrevendo melhor, sai também se conhecendo melhor.',
  },
  {
    question: 'isso é terapia?',
    answer: 'não. não somos psicólogas e o solta o verbo não substitui acompanhamento terapêutico. é um espaço de escuta, criação e coletividade, com propostas guiadas e cuidado com o que aparece. se você está em processo terapêutico, a escrita costuma caminhar muito bem ao lado dele.',
  },
  {
    question: 'quem conduz os encontros?',
    answer: 'nós, bru e ju, co-criadoras e facilitadoras do coletivo. saiba mais na página "sobre nós".',
  },
  {
    question: 'como funciona o acesso aos 21 dias de escrita?',
    answer: 'ao comprar os 21 dias de escrita, você recebe acesso imediato à plataforma. a cada dia é liberado um novo exercício guiado com áudio de reflexão, além do acesso à área de membros, nosso espaço de partilha com o grupo. você também tem acesso gratuito aos 21 dias de escrita ao fazer parte do ciclo de aprofundamento.',
  },
  {
    question: 'o que é o ciclo de aprofundamento?',
    answer: 'é a nossa comunidade paga, organizada em travessias de três meses. cada travessia mergulha em um tema de autodesenvolvimento, criatividade e relações humanas, apoiada por um livro-guia e por um convidado especial. a travessia atual é "a coragem de não agradar", com o livro de ichiro kishimi e fumitake koga e a presença da jout jout. para saber mais, acesse "ciclo de aprofundamento" na aba de programas.',
  },
  {
    question: 'o que é o café com letras?',
    answer: 'uma roda de escrita de trinta minutos, toda terça de manhã, para começar o dia pela sua própria voz. café quentinho, caderno aberto e um grupo de pessoas escrevendo junto. sem correção, sem cobrança, sem precisar ler em voz alta. chegue como estiver, e saia mais consciente disso.',
  },
  {
    question: 'quais são as formas de pagamento disponíveis?',
    answer: 'pix à vista com desconto especial, cartão de crédito em até 3x sem juros e boleto bancário.',
  },
  {
    question: 'é necessário instalar algum aplicativo?',
    answer: 'não. você pode acessar pelo navegador ou instalar nossa plataforma como web app no seu celular (no navegador do celular, toque no menu de opções / compartilhar e depois em "adicionar à tela de início").',
  },
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { getSection } = usePageContent('landing');

  const faqSec = getSection('faq', {
    badge_text: 'dúvidas frequentes',
    title: 'perguntas que costumam surgir',
    subtitle: 'respostas simples e diretas para você dar o próximo passo com segurança.',
  });

  const activeFaqItems = faqData.map((item, index) => {
    const qKey = `q${index + 1}`;
    const aKey = `a${index + 1}`;
    return {
      question: faqSec[qKey] || item.question,
      answer: faqSec[aKey] || item.answer,
    };
  });

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 sm:py-28 bg-papelClaro border-t border-b border-papelKraft/40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-bgPlataforma border border-papelKraft/40 text-acentoAzul text-xs sm:text-sm font-semibold lowercase tracking-wider mb-4 shadow-sm">
            <img
              src="/brand-assets/icons/icone_63.svg"
              alt="duvidas"
              className="w-5 h-5 object-contain"
            />
            <span>{faqSec.badge_text || 'dúvidas frequentes'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-editorial text-acentoAzul lowercase mb-4">
            {faqSec.title || 'perguntas que costumam surgir'}
          </h2>
          <p className="text-tintaCarvao/80 text-base sm:text-lg max-w-2xl mx-auto font-medium lowercase">
            {faqSec.subtitle || 'respostas simples e diretas para você dar o próximo passo com segurança.'}
          </p>
        </div>

        <div className="space-y-4">
          {activeFaqItems.map((item, index) => {
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
