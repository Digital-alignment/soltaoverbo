import { useState } from 'react';
import {
  Coffee,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Clock,
  Calendar,
  Quote,
  ChevronDown,
} from 'lucide-react';
import PreLoginNavbar from '../components/PreLoginNavbar';
import PreLoginFooter from '../components/PreLoginFooter';
import FoundersSection from '../components/FoundersSection';
import PaymentModal from '../components/PaymentModal';

const pillars = [
  {
    step: '01',
    category: 'ritual de terça-feira',
    title: 'começar a semana pela sua voz',
    description:
      'meia hora, das 8h às 8h30, antes das reuniões, das mensagens e das urgências dos outros. você entra na semana tendo escutado a si mesma primeiro. o resto do dia acontece a partir de outro lugar.',
  },
  {
    step: '02',
    category: 'autoconhecimento',
    title: 'escrita sem julgamento',
    description:
      'não tem bonito ou feio, certo ou errado e nem forma certa. você para de escrever para ser lida e começa a escrever para se entender (é aí que a escrita vira ferramenta).',
  },
  {
    step: '03',
    category: 'espaço seguro',
    title: 'vulnerabilidade e conexão',
    description:
      'você descobre que se vulnerabilizar, antes de mais nada, é se permitir enregar a própria história de outra maneira. e aqui você faz isso num ambiente seguro, sem obrigação de performar nem de mostrar.',
  },
  {
    step: '04',
    category: 'comunidade ativa',
    title: 'roda contínua no whatsapp',
    description:
      'o grupo onde os textos da terça seguem circulando e onde o exercício do dia é enviado, para quem não conseguiu estar na roda escrever no seu tempo.',
  },
];

const realTestimonials = [
  {
    quote:
      'em 2022 entrei num processo muito profundo de autoconhecimento e passei por várias experiências. em todas elas, o denominador comum era a escrita como uma das principais e mais efetivas ferramentas pra me entender.',
    author: 'bárbara alcântara (babi)',
    tag: 'participante do café com letras',
  },
  {
    quote:
      'o simples fato de estar em sangha, ouvindo escritas pessoais diversas e se inspirando nelas, é o néctar da solta o verbo. minha escrita começou a pegar no tranco. menos analítica, mais expressiva e autêntica.',
    author: 'tom vitralli',
    tag: 'participante do café com letras',
  },
  {
    quote:
      'conhecer o solta o verbo foi um resgate desse instrumento, e ao mesmo tempo uma expansão de como colocar palavras: não como uma técnica engessada, mas inspiracional e fluida. sinto-me cada vez mais presente.',
    author: 'jess',
    tag: 'participante do café com letras',
  },
];

const faqItems = [
  {
    q: 'quando acontecem os encontros?',
    a: 'toda terça-feira, das 8h às 8h30 da manhã (horário de brasília), ao vivo no zoom.',
  },
  {
    q: 'o café é semanal ou mensal?',
    a: 'semanal. toda terça temos nosso encontro marcado.',
  },
  {
    q: 'o encontro fica gravado?',
    a: 'não. o café é ao vivo. é um ritual de presença.',
  },
  {
    q: 'e se eu não puder participar numa terça?',
    a: 'você não fica de fora: enviamos o exercício do dia no grupo de whatsapp, para você escrever no seu tempo e partilhar com a gente. não existe falta nem cobrança: você vem nas terças que puder.',
  },
  {
    q: 'sou obrigada a ler meu texto em voz alta?',
    a: 'nunca. a partilha é sempre voluntária (e isso também é escrever junto).',
  },
  {
    q: 'preciso ter experiência com escrita?',
    a: 'não. aqui é um espaço sem julgamento onde não se corrige texto, se escuta gente. o único pré-requisito é vontade de escrever e estar junto.',
  },
  {
    q: 'preciso escrever à mão?',
    a: 'gostamos de papel e caneta, mas escreva como for melhor para você. você também tem acesso à nossa plataforma digital e pode escrever por lá (e compartilhar na nossa área de partilha).',
  },
  {
    q: 'quem está no ciclo de aprofundamento paga?',
    a: 'não. o café com letras está incluído na travessia do ciclo, sem custo adicional.',
  },
  {
    q: 'posso cancelar quando quiser?',
    a: 'sim. é um passe mensal, sem fidelidade. e você tem garantia incondicional de 7 dias: se não for para você, devolvemos o valor integral.',
  },
  {
    q: 'preciso levar algum material?',
    a: 'só caderno, caneta e um café. o resto deixa com a gente.',
  },
];

export default function ProgramaCafeComLetras() {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  return (
    <div className="min-h-screen bg-bgPlataforma text-tintaCarvao selection:bg-acentoTerracota/20 selection:text-acentoAzul">
      {/* 1. Header Navbar Sticky */}
      <PreLoginNavbar />

      {/* 2. HERO SECTION */}
      <section className="relative pt-12 pb-16 sm:pt-16 sm:pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Coluna Esquerda: Hero Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-papelClaro border border-papelKraft/60 text-acentoAzul text-xs sm:text-sm font-semibold lowercase tracking-wider shadow-sm">
                <Coffee className="w-4 h-4 text-acentoTerracota" />
                <span>roda semanal de escrita coletiva · 30 minutos · online</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-editorial text-acentoAzul lowercase leading-[1.1] tracking-tight">
                café com letras <br />
                <span className="font-gesto text-acentoTerracota font-normal text-4xl sm:text-5xl lg:text-6xl block mt-1">
                  ritual de escrita semanal
                </span>
              </h1>

              <p className="text-tintaCarvao/85 text-lg sm:text-xl leading-relaxed max-w-2xl font-medium lowercase">
                uma roda de escrita de trinta minutos, toda terça de manhã, para começar o dia pela sua própria voz. café quentinho, caderno aberto e um grupo de pessoas escrevendo junto. sem correção, sem cobrança, sem precisar ler em voz alta. chegue como estiver, e saia mais consciente disso.
              </p>

              {/* Botão CTA Principal */}
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => setIsPaymentModalOpen(true)}
                  className="btn-pill-primary text-base sm:text-lg px-8 py-4 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all flex items-center gap-3 cursor-pointer lowercase"
                >
                  <span>sim, quero minha xícara por R$97/mês</span>
                  <ArrowRight className="w-5 h-5 text-white" />
                </button>

                <a
                  href="#como-funciona"
                  className="bg-papelClaro hover:bg-papelClaro/80 border border-papelKraft/60 text-acentoAzul text-base sm:text-lg px-7 py-4 rounded-full font-medium transition-all shadow-xs flex items-center gap-2 lowercase"
                >
                  <span>como funciona o café com letras ↓</span>
                </a>
              </div>
            </div>

            {/* Coluna Direita: Box de Oferta e Frase Inspiradora */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-3xl bg-papelClaro p-8 sm:p-10 border border-papelKraft/60 shadow-kraft-lg space-y-6">
                <div className="space-y-3 pb-4 border-b border-papelKraft/40">
                  <div className="flex items-center gap-2 text-xs font-bold text-acentoTerracota lowercase">
                    <Calendar className="w-4 h-4" />
                    <span>toda terça-feira · 8h às 8h30 (30 min) · zoom</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold font-editorial text-acentoAzul">
                      R$ 97,00
                    </span>
                    <span className="text-sm font-medium text-tintaCarvao/70 lowercase">
                      /mês
                    </span>
                  </div>
                  <p className="text-xs text-acentoOliva font-bold lowercase bg-acentoOliva/10 px-3 py-1 rounded-full w-fit">
                    100% incluso para quem está no ciclo de aprofundamento
                  </p>
                  <p className="text-xs text-tintaCarvao/60 font-medium lowercase flex items-center gap-1.5 pt-1">
                    <ShieldCheck className="w-4 h-4 text-acentoOliva" />
                    <span>garantia incondicional de 7 dias</span>
                  </p>
                </div>

                <div className="p-4 bg-bgPlataforma rounded-2xl border border-papelKraft/50 space-y-2">
                  <blockquote className="font-editorial text-xl font-bold text-acentoAzul lowercase">
                    “escrever junto é descobrir que a sua palavra não estava sozinha.”
                  </blockquote>
                </div>

                <button
                  onClick={() => setIsPaymentModalOpen(true)}
                  className="w-full btn-pill-primary text-base py-3.5 rounded-full shadow-md hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer lowercase"
                >
                  <span>sim, quero minha xícara por R$97/mês</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. A INSPIRAÇÃO TEM HORA MARCADA */}
      <section id="como-funciona" className="py-16 sm:py-24 bg-papelClaro border-t border-b border-papelKraft/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="p-6 bg-bgPlataforma rounded-3xl border border-papelKraft/60 space-y-3 shadow-xs">
            <Quote className="w-8 h-8 text-acentoAzul/30" />
            <blockquote className="font-editorial text-2xl sm:text-3xl font-bold text-acentoAzul lowercase">
              “escrevo quando estou inspirado. e faço questão de estar inspirado às nove horas de cada manhã.”
            </blockquote>
            <p className="text-xs font-bold text-tintaCarvao/60 lowercase tracking-wider">
              (peter de vries)
            </p>
          </div>

          <div className="space-y-4 text-tintaCarvao/85 text-base sm:text-lg leading-relaxed font-medium lowercase">
            <p className="font-bold text-acentoTerracota text-xl">a nossa hora é às oito.</p>
            <p className="font-bold text-acentoAzul">inspiração não é sorte, é encontro marcado.</p>
            <p>
              mas verdade seja dita, às vezes a gente precisa de um empurrãozinho para escrever. e para isso o café com letras existe: para te inspirar a fazer isso em coletivo. toda terça, às 8h, tem gente sentando junto. você não precisa decidir se hoje é o dia, não precisa achar assunto, não precisa estar inspirada antes de começar: a hora já está marcada e o tema, pronto.
            </p>
            <p>
              o tema muda toda semana. a magia desse encontro você descobre na prática: quando escrevemos sobre um tema, ele passa a ser mais vivo em você. com mais consciência, o que antes teria passado batido vira a oportunidade de enxergar o seu entorno de uma nova maneira.
            </p>
          </div>
        </div>
      </section>

      {/* 4. OS 4 PILARES */}
      <section className="py-20 sm:py-28 bg-bgPlataforma">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-5xl font-bold font-editorial text-acentoAzul lowercase">
              que trinta minutos por semana fazem com você
            </h2>
            <p className="text-tintaCarvao/80 text-base sm:text-lg font-medium lowercase">
              quatro pilares pensados para caber de verdade na sua rotina e ainda assim mexer com ela.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pillars.map((item) => (
              <div
                key={item.step}
                className="bg-papelClaro rounded-3xl p-8 border border-papelKraft/60 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-gesto text-3xl text-acentoTerracota">
                      {item.step}
                    </span>
                    <span className="text-xs font-bold text-acentoAzul bg-acentoAzul/10 px-3 py-1 rounded-full lowercase">
                      {item.category}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold font-editorial text-acentoAzul lowercase">
                    {item.title}
                  </h3>
                  <p className="text-tintaCarvao/85 text-base leading-relaxed font-medium lowercase">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. QUEM SERVE ESSE CAFÉ */}
      <FoundersSection />

      {/* 6. VOZES DE QUEM JÁ TOMA ESSE CAFÉ COM A GENTE */}
      <section className="py-20 sm:py-28 bg-papelClaro border-t border-b border-papelKraft/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-5xl font-bold font-editorial text-acentoAzul lowercase">
              vozes de quem já toma esse café com a gente
            </h2>
            <p className="text-tintaCarvao/80 text-base sm:text-lg font-medium lowercase">
              mensagens reais de quem escreve com a gente nas terças.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {realTestimonials.map((item, idx) => (
              <div
                key={idx}
                className="bg-bgPlataforma rounded-3xl p-8 border border-papelKraft/60 shadow-sm flex flex-col justify-between space-y-6"
              >
                <Quote className="w-8 h-8 text-acentoAzul/30" />
                <p className="text-tintaCarvao/90 text-base leading-relaxed font-medium italic lowercase">
                  “{item.quote}”
                </p>
                <div className="pt-4 border-t border-papelKraft/40">
                  <h4 className="font-bold text-acentoAzul text-base lowercase">
                    {item.author}
                  </h4>
                  <p className="text-xs text-tintaCarvao/60 font-medium lowercase">
                    {item.tag}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CTA FINAL */}
      <section className="py-20 bg-acentoAzul text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
          <h2 className="text-3xl sm:text-5xl font-bold font-editorial text-papelClaro lowercase leading-tight">
            sua próxima terça pode começar diferente
          </h2>
          <p className="text-papelClaro/85 text-lg sm:text-xl font-medium lowercase max-w-2xl mx-auto">
            você não precisa esperar a vontade chegar, nem ter assunto, nem saber escrever. precisa só aparecer numa terça, às 8h.
          </p>
          <div className="p-4 bg-white/10 rounded-2xl max-w-md mx-auto border border-white/20">
            <span className="text-papelClaro font-bold text-lg block lowercase">
              97 reais · 100% incluso para quem está no ciclo de aprofundamento
            </span>
          </div>
          <div className="pt-4 flex items-center justify-center">
            <button
              onClick={() => setIsPaymentModalOpen(true)}
              className="btn-pill-accent text-lg px-9 py-4 rounded-full shadow-lg hover:scale-105 transition-all flex items-center gap-3 cursor-pointer lowercase"
            >
              <span>sim, quero minha xícara por R$97/mês</span>
              <ArrowRight className="w-5 h-5 text-tintaCarvao" />
            </button>
          </div>
        </div>
      </section>

      {/* 8. FAQ DO CAFÉ COM LETRAS */}
      <section className="py-20 sm:py-28 bg-papelClaro">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold font-editorial text-acentoAzul lowercase mb-3">
              perguntas frequentes sobre o café com letras
            </h2>
          </div>

          <div className="space-y-4">
            {faqItems.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-bgPlataforma rounded-2xl border border-papelKraft/60 overflow-hidden shadow-xs"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left p-6 flex items-center justify-between gap-4 font-editorial font-bold text-lg text-acentoAzul lowercase cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-acentoAzul transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 text-tintaCarvao/85 text-base leading-relaxed font-medium lowercase border-t border-papelKraft/30 pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Rodapé Pré-Login */}
      <PreLoginFooter />

      {/* Modal de Pagamento */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        productKey="cafecomletras"
      />
    </div>
  );
}
