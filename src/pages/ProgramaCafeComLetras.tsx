import { useState, useEffect } from 'react';
import {
  Coffee,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Clock,
  Calendar,
  Quote,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  X,
} from 'lucide-react';
import PreLoginNavbar from '../components/PreLoginNavbar';
import PreLoginFooter from '../components/PreLoginFooter';
import FoundersSection from '../components/FoundersSection';
import PaymentModal from '../components/PaymentModal';
import { usePageContent } from '../hooks/usePageContent';

const defaultPillars = [
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

const defaultFaqItems = [
  { q: 'quando acontecem os encontros?', a: 'toda terça-feira, das 8h às 8h30 da manhã (horário de brasília), ao vivo no zoom.' },
  { q: 'o café é semanal ou mensal?', a: 'semanal. toda terça temos nosso encontro marcado.' },
  { q: 'o encontro fica gravado?', a: 'não. o café é ao vivo. é um ritual de presença.' },
  { q: 'e se eu não puder participar numa terça?', a: 'você não fica de fora: enviamos o exercício do dia no grupo de whatsapp, para você escrever no seu tempo e partilhar com a gente. não existe falta nem cobrança: você vem nas terças que puder.' },
  { q: 'sou obrigada a ler meu texto em voz alta?', a: 'nunca. a partilha é sempre voluntária (e isso também é escrever junto).' },
  { q: 'preciso ter experiência com escrita?', a: 'não. aqui é um espaço sem julgamento onde não se corrige texto, se escuta gente. o único pré-requisito é vontade de escrever e estar junto.' },
  { q: 'preciso escrever à mão?', a: 'gostamos de papel e caneta, mas escreva como for melhor para você. você também tem acesso à nossa plataforma digital e pode escrever por lá (e compartilhar na nossa área de partilha).' },
  { q: 'quem está no ciclo de aprofundamento paga?', a: 'não. o café com letras está incluído na travessia do ciclo, sem custo adicional.' },
  { q: 'posso cancelar quando quiser?', a: 'sim. é um passe mensal, sem fidelidade. e você tem garantia incondicional de 7 dias: se não for para você, devolvemos o valor integral.' },
  { q: 'preciso levar algum material?', a: 'só caderno, caneta e um café. o resto deixa com a gente.' },
];

export default function ProgramaCafeComLetras() {
  const { getSection } = usePageContent('programa_cafe_com_letras');
  const { getSection: getPoolSection } = usePageContent('testimonials_pool');

  const heroSec = getSection('hero', {
    badge_text: 'roda semanal de escrita coletiva · 30 minutos · online',
    title: 'café com letras',
    subtitle_gesto: 'ritual de escrita semanal',
    subtitle: 'uma roda de escrita de trinta minutos, toda terça de manhã, para começar o dia pela sua própria voz. café quentinho, caderno aberto e um grupo de pessoas escrevendo junto. sem correção, sem cobrança, sem precisar ler em voz alta. chegue como estiver, e saia mais consciente disso.',
    button_text: 'sim, quero minha xícara por R$97/mês',
    button_secondary_text: 'como funciona o café com letras ↓',
    schedule_badge: 'toda terça-feira · 8h às 8h30 (30 min) · zoom',
    price_text: 'R$ 97,00',
    price_subtext: '/mês',
    ciclo_badge: '100% incluso para quem está no ciclo de aprofundamento',
    guarantee_text: 'garantia incondicional de 7 dias',
    quote: '“escrever junto é descobrir que a sua palavra não estava sozinha.”',
    image_url: '/brand-assets/gallery/events/_MG_9849.jpg',
  });

  const inspiracaoSec = getSection('inspiracao', {
    quote_text: '“escrevo quando estou inspirado. e faço questão de estar inspirado às nove horas de cada manhã.”',
    quote_author: '(peter de vries)',
    title_terracota: 'a nossa hora é às oito.',
    title_azul: 'inspiração não é sorte, é encontro marcado.',
    p1: 'mas verdade seja dita, às vezes a gente precisa de um empurrãozinho para escrever. e para isso o café com letras existe: para te inspirar a fazer isso em coletivo. toda terça, às 8h, tem gente sentando junto. você não precisa decidir se hoje é o dia, não precisa achar assunto, não precisa estar inspirada antes de começar: a hora já está marcada e o tema, pronto.',
    p2: 'o tema muda toda semana. a magia desse encontro você descobre na prática: quando escrevemos sobre um tema, ele passa a ser mais vivo em você. com mais consciência, o que antes teria passado batido vira a oportunidade de enxergar o seu entorno de uma nova maneira.',
  });

  const pilaresSec = getSection('pilares', {
    title: 'que trinta minutos por semana fazem com você',
    subtitle: 'quatro pilares pensados para caber de verdade na sua rotina e ainda assim mexer com ela.',
    p1_step: '01', p1_category: 'ritual de terça-feira', p1_title: 'começar a semana pela sua voz', p1_desc: 'meia hora, das 8h às 8h30, antes das reuniões, das mensagens e das urgências dos outros. você entra na semana tendo escutado a si mesma primeiro. o resto do dia acontece a partir de outro lugar.',
    p2_step: '02', p2_category: 'autoconhecimento', p2_title: 'escrita sem julgamento', p2_desc: 'não tem bonito ou feio, certo ou errado e nem forma certa. você para de escrever para ser lida e começa a escrever para se entender (é aí que a escrita vira ferramenta).',
    p3_step: '03', p3_category: 'espaço seguro', p3_title: 'vulnerabilidade e conexão', p3_desc: 'você descobre que se vulnerabilizar, antes de mais nada, é se permitir enregar a própria história de outra maneira. e aqui você faz isso num ambiente seguro, sem obrigação de performar nem de mostrar.',
    p4_step: '04', p4_category: 'comunidade ativa', p4_title: 'roda contínua no whatsapp', p4_desc: 'o grupo onde os textos da terça seguem circulando e onde o exercício do dia é enviado, para quem não conseguiu estar na roda escrever no seu tempo.',
  });

  const depoimentosSec = getSection('depoimentos', {
    badge_text: 'vozes de quem já toma esse café com a gente',
    title: 'vozes de quem já toma esse café com a gente',
    subtitle: 'mensagens reais de quem escreve com a gente nas terças.',
    selected_ids: 't7,t8,t9,d11,d12,d13,d14',
  });

  const finalCtaSec = getSection('final_cta', {
    title: 'sua próxima terça pode começar diferente',
    subtitle: 'você não precisa esperar a vontade chegar, nem ter assunto, nem saber escrever. precisa só aparecer numa terça, às 8h.',
    price_text: '97 reais · 100% incluso para quem está no ciclo de aprofundamento',
    button_text: 'sim, quero minha xícara por R$97/mês',
  });

  const faqSec = getSection('faq', {
    title: 'perguntas frequentes sobre o café com letras',
  });

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Estado do Carrossel de Screenshots / Depoimentos
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);
  const [selectedQuoteModal, setSelectedQuoteModal] = useState<{ quote: string; author: string; role: string } | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const rawSelectedIds = (depoimentosSec.selected_ids || 't1,t2,t3,t4,t5,t6,d1,d2,d3,d4,d5')
    .split(',')
    .map((s: string) => s.trim())
    .filter(Boolean);

  const activeDeploymentItems = rawSelectedIds.map((tId: string) => {
    const item = getPoolSection(tId, {});
    return {
      id: tId,
      src: item.image_url || '',
      title: item.title || item.quote || 'relato real',
      quote: item.quote || '',
      author: item.author || 'aluna solta o verbo',
      role: item.role || item.event_tag || 'café com letras',
      tag: item.event_tag || 'depoimento real',
    };
  });

  // Auto-play do carrossel a cada 4 segundos
  useEffect(() => {
    if (isPaused || selectedScreenshot !== null || selectedQuoteModal !== null || activeDeploymentItems.length === 0) return;
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % activeDeploymentItems.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused, selectedScreenshot, selectedQuoteModal, activeDeploymentItems.length]);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  const nextSlide = () => {
    if (activeDeploymentItems.length === 0) return;
    setCarouselIndex((prev) => (prev + 1) % activeDeploymentItems.length);
  };

  const prevSlide = () => {
    if (activeDeploymentItems.length === 0) return;
    setCarouselIndex((prev) => (prev - 1 + activeDeploymentItems.length) % activeDeploymentItems.length);
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
                <span>{heroSec.badge_text || 'roda semanal de escrita coletiva · 30 minutos · online'}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-editorial text-acentoAzul lowercase leading-[1.1] tracking-tight">
                {heroSec.title || 'café com letras'} <br />
                <span className="font-gesto text-acentoTerracota font-normal text-4xl sm:text-5xl lg:text-6xl block mt-1">
                  {heroSec.subtitle_gesto || 'ritual de escrita semanal'}
                </span>
              </h1>

              <p className="text-tintaCarvao/85 text-lg sm:text-xl leading-relaxed max-w-2xl font-medium lowercase">
                {heroSec.subtitle || 'uma roda de escrita de trinta minutos, toda terça de manhã, para começar o dia pela sua própria voz. café quentinho, caderno aberto e um grupo de pessoas escrevendo junto. sem correção, sem cobrança, sem precisar ler em voz alta. chegue como estiver, e saia mais consciente disso.'}
              </p>

              {/* Botão CTA Principal */}
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => setIsPaymentModalOpen(true)}
                  className="btn-pill-primary text-base sm:text-lg px-8 py-4 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all flex items-center gap-3 cursor-pointer lowercase"
                >
                  <span>{heroSec.button_text || 'sim, quero minha xícara por R$97/mês'}</span>
                  <ArrowRight className="w-5 h-5 text-white" />
                </button>

                <a
                  href="#como-funciona"
                  className="bg-papelClaro hover:bg-papelClaro/80 border border-papelKraft/60 text-acentoAzul text-base sm:text-lg px-7 py-4 rounded-full font-medium transition-all shadow-xs flex items-center gap-2 lowercase"
                >
                  <span>{heroSec.button_secondary_text || 'como funciona o café com letras ↓'}</span>
                </a>
              </div>
            </div>

            {/* Coluna Direita: Box de Oferta e Frase Inspiradora */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-3xl bg-papelClaro p-8 sm:p-10 border border-papelKraft/60 shadow-kraft-lg space-y-6">
                <div className="space-y-3 pb-4 border-b border-papelKraft/40">
                  <div className="flex items-center gap-2 text-xs font-bold text-acentoTerracota lowercase">
                    <Calendar className="w-4 h-4" />
                    <span>{heroSec.schedule_badge || 'toda terça-feira · 8h às 8h30 (30 min) · zoom'}</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold font-editorial text-acentoAzul">
                      {heroSec.price_text || 'R$ 97,00'}
                    </span>
                    <span className="text-sm font-medium text-tintaCarvao/70 lowercase">
                      {heroSec.price_subtext || '/mês'}
                    </span>
                  </div>
                  <p className="text-xs text-acentoOliva font-bold lowercase bg-acentoOliva/10 px-3 py-1 rounded-full w-fit">
                    {heroSec.ciclo_badge || '100% incluso para quem está no ciclo de aprofundamento'}
                  </p>
                  <p className="text-xs text-tintaCarvao/60 font-medium lowercase flex items-center gap-1.5 pt-1">
                    <ShieldCheck className="w-4 h-4 text-acentoOliva" />
                    <span>{heroSec.guarantee_text || 'garantia incondicional de 7 dias'}</span>
                  </p>
                </div>

                <div className="p-4 bg-bgPlataforma rounded-2xl border border-papelKraft/50 space-y-2">
                  <blockquote className="font-editorial text-xl font-bold text-acentoAzul lowercase">
                    {heroSec.quote || '“escrever junto é descobrir que a sua palavra não estava sozinha.”'}
                  </blockquote>
                </div>

                <button
                  onClick={() => setIsPaymentModalOpen(true)}
                  className="w-full btn-pill-primary text-base py-3.5 rounded-full shadow-md hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer lowercase"
                >
                  <span>{heroSec.button_text || 'sim, quero minha xícara por R$97/mês'}</span>
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
              {inspiracaoSec.quote_text || '“escrevo quando estou inspirado. e faço questão de estar inspirado às nove horas de cada manhã.”'}
            </blockquote>
            <p className="text-xs font-bold text-tintaCarvao/60 lowercase tracking-wider">
              {inspiracaoSec.quote_author || '(peter de vries)'}
            </p>
          </div>

          <div className="space-y-4 text-tintaCarvao/85 text-base sm:text-lg leading-relaxed font-medium lowercase">
            <p className="font-bold text-acentoTerracota text-xl">{inspiracaoSec.title_terracota || 'a nossa hora é às oito.'}</p>
            <p className="font-bold text-acentoAzul">{inspiracaoSec.title_azul || 'inspiração não é sorte, é encontro marcado.'}</p>
            <p>
              {inspiracaoSec.p1 || 'mas verdade seja dita, às vezes a gente precisa de um empurrãozinho para escrever. e para isso o café com letras existe: para te inspirar a fazer isso em coletivo. toda terça, às 8h, tem gente sentando junto. você não precisa decidir se hoje é o dia, não precisa achar assunto, não precisa estar inspirada antes de começar: a hora já está marcada e o tema, pronto.'}
            </p>
            <p>
              {inspiracaoSec.p2 || 'o tema muda toda semana. a magia desse encontro você descobre na prática: quando escrevemos sobre um tema, ele passa a ser mais vivo em você. com mais consciência, o que antes teria passado batido vira a oportunidade de enxergar o seu entorno de uma nova maneira.'}
            </p>
          </div>
        </div>
      </section>

      {/* 4. OS 4 PILARES */}
      <section className="py-20 sm:py-28 bg-bgPlataforma">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-5xl font-bold font-editorial text-acentoAzul lowercase">
              {pilaresSec.title || 'que trinta minutos por semana fazem com você'}
            </h2>
            <p className="text-tintaCarvao/80 text-base sm:text-lg font-medium lowercase">
              {pilaresSec.subtitle || 'quatro pilares pensados para caber de verdade na sua rotina e ainda assim mexer com ela.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((num) => {
              const def = defaultPillars[num - 1];
              const step = pilaresSec[`p${num}_step`] || def.step;
              const category = pilaresSec[`p${num}_category`] || def.category;
              const title = pilaresSec[`p${num}_title`] || def.title;
              const description = pilaresSec[`p${num}_desc`] || def.description;

              return (
                <div
                  key={step}
                  className="bg-papelClaro rounded-3xl p-8 border border-papelKraft/60 shadow-sm flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-gesto text-3xl text-acentoTerracota">
                        {step}
                      </span>
                      <span className="text-xs font-bold text-acentoAzul bg-acentoAzul/10 px-3 py-1 rounded-full lowercase">
                        {category}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold font-editorial text-acentoAzul lowercase">
                      {title}
                    </h3>
                    <p className="text-tintaCarvao/85 text-base leading-relaxed font-medium lowercase">
                      {description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. QUEM SERVE ESSE CAFÉ */}
      <FoundersSection />

      {/* 6. VOZES & DEPLOYMENTS DE QUEM JÁ TOMA ESSE CAFÉ COM A GENTE */}
      <section className="py-20 sm:py-28 bg-papelClaro border-t border-b border-papelKraft/50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-bgPlataforma border border-papelKraft/40 text-acentoAzul text-xs sm:text-sm font-semibold lowercase tracking-wider mb-2 shadow-sm">
              <Coffee className="w-4 h-4 text-acentoTerracota" />
              <span>{depoimentosSec.badge_text || 'vozes de quem já toma esse café com a gente'}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold font-editorial text-acentoAzul lowercase">
              {depoimentosSec.title || 'vozes de quem já toma esse café com a gente'}
            </h2>
            <p className="text-tintaCarvao/80 text-base sm:text-lg font-medium lowercase">
              {depoimentosSec.subtitle || 'mensagens reais de quem escreve com a gente nas terças.'}
            </p>
          </div>

          {/* Componente de Carrossel de Deployments/Prints e Relatos */}
          {activeDeploymentItems.length > 0 && (
            <div
              className="relative max-w-5xl mx-auto"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Botões de Navegação Lateral */}
              <button
                onClick={prevSlide}
                aria-label="depoimento anterior"
                className="absolute -left-4 sm:-left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-papelClaro/90 backdrop-blur-sm border border-papelKraft/60 shadow-lg text-acentoAzul hover:bg-acentoAzul hover:text-white transition-all flex items-center justify-center cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={nextSlide}
                aria-label="próximo depoimento"
                className="absolute -right-4 sm:-right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-papelClaro/90 backdrop-blur-sm border border-papelKraft/60 shadow-lg text-acentoAzul hover:bg-acentoAzul hover:text-white transition-all flex items-center justify-center cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Grid de 3 Cards Visíveis em Desktop */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                {[0, 1, 2].map((offset) => {
                  const itemIndex = (carouselIndex + offset) % activeDeploymentItems.length;
                  const item = activeDeploymentItems[itemIndex];
                  const washiTapeImage =
                    offset % 2 === 0
                      ? '/brand-assets/elements/stickers/fitas-washi-flores-terracota.png'
                      : '/brand-assets/elements/stickers/fitas-washi-flores-azul.png';

                  const hasImage = Boolean(item.src);

                  return (
                    <div
                      key={`${item.id}-${offset}`}
                      onClick={() => {
                        if (hasImage) {
                          setSelectedScreenshot(item.src);
                        } else if (item.quote) {
                          setSelectedQuoteModal({ quote: item.quote, author: item.author, role: item.role });
                        }
                      }}
                      className="relative bg-bgPlataforma rounded-3xl p-4 sm:p-5 border border-papelKraft/40 shadow-kraft transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl cursor-pointer group select-none flex flex-col justify-between"
                    >
                      {/* Sticker Fita Washi */}
                      <div className="absolute -top-3.5 left-6 w-28 h-7 pointer-events-none z-20 opacity-90">
                        <img
                          src={washiTapeImage}
                          alt="fita washi"
                          className="w-full h-full object-contain"
                        />
                      </div>

                      {hasImage ? (
                        /* Frame com Foto 100% Visível em object-contain */
                        <div className="w-full h-[400px] sm:h-[440px] rounded-2xl overflow-hidden border border-papelKraft/30 relative bg-papelClaro p-2 flex items-center justify-center shadow-inner group/img mb-3">
                          <img
                            src={item.src}
                            alt={item.title}
                            className="w-full h-full object-contain object-top transition-transform duration-500 group-hover/img:scale-105"
                          />
                          <div className="absolute inset-0 bg-acentoAzul/20 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-xs">
                            <div className="bg-papelClaro/95 text-acentoAzul font-bold px-4 py-2.5 rounded-full text-xs flex items-center gap-2 shadow-xl border border-papelKraft/50 lowercase">
                              <ZoomIn className="w-4 h-4 text-acentoTerracota" />
                              <span>ampliar depoimento em tela cheia</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Frame para Depoimento em Texto */
                        <div className="w-full h-[400px] sm:h-[440px] rounded-2xl border border-papelKraft/30 relative bg-papelClaro p-6 flex flex-col justify-between shadow-inner group/quote mb-3 overflow-hidden">
                          <div className="space-y-3">
                            <span className="text-4xl font-editorial text-acentoTerracota/50 block font-bold leading-none">“</span>
                            <p className="text-tintaCarvao/90 text-sm sm:text-base leading-relaxed font-medium lowercase line-clamp-8">
                              {item.quote}
                            </p>
                          </div>
                          <div className="pt-3 border-t border-papelKraft/30">
                            <p className="font-editorial text-sm font-bold text-acentoAzul lowercase">
                              {item.author}
                            </p>
                            <p className="text-xs text-tintaCarvao/60 font-medium lowercase">
                              {item.role}
                            </p>
                          </div>
                          <div className="absolute inset-0 bg-acentoAzul/20 opacity-0 group-hover/quote:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-xs">
                            <div className="bg-papelClaro/95 text-acentoAzul font-bold px-4 py-2.5 rounded-full text-xs flex items-center gap-2 shadow-xl border border-papelKraft/50 lowercase">
                              <ZoomIn className="w-4 h-4 text-acentoTerracota" />
                              <span>ler depoimento completo</span>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="px-2 text-center pt-1 border-t border-papelKraft/30 flex items-center justify-between">
                        <span className="font-editorial text-sm font-bold text-acentoAzul lowercase truncate max-w-[70%]">
                          {item.title}
                        </span>
                        <span className="text-[11px] font-bold text-acentoTerracota bg-acentoTerracota/10 px-2.5 py-0.5 rounded-full lowercase flex-shrink-0">
                          {item.tag}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pílulas Indicadoras de Slide */}
              <div className="flex justify-center items-center gap-2 mt-8">
                {activeDeploymentItems.slice(0, 8).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCarouselIndex(idx)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      carouselIndex === idx
                        ? 'w-8 bg-acentoTerracota'
                        : 'w-2.5 bg-papelKraft/50 hover:bg-acentoAzul/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Modal de Screenshot Ampliado em Tela Cheia */}
      {selectedScreenshot && (
        <div
          className="fixed inset-0 z-50 bg-acentoAzul/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setSelectedScreenshot(null)}
        >
          <div
            className="bg-papelClaro rounded-3xl p-4 sm:p-6 border border-papelKraft/60 shadow-2xl max-w-2xl w-full relative animate-fadeIn flex flex-col items-center max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedScreenshot(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-acentoAzul text-white hover:bg-acentoTerracota transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-full h-full max-h-[75vh] overflow-y-auto rounded-2xl border border-papelKraft/40 mb-4 bg-white flex items-center justify-center">
              <img
                src={selectedScreenshot}
                alt="depoimento ampliado"
                className="w-full h-auto object-contain rounded-xl"
              />
            </div>

            <button
              onClick={() => setSelectedScreenshot(null)}
              className="btn-pill-primary w-full py-3 rounded-full text-center text-sm font-semibold lowercase"
            >
              fechar imagem
            </button>
          </div>
        </div>
      )}

      {/* Modal de Depoimento em Texto Ampliado */}
      {selectedQuoteModal && (
        <div
          className="fixed inset-0 z-50 bg-acentoAzul/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setSelectedQuoteModal(null)}
        >
          <div
            className="bg-papelClaro rounded-3xl p-6 sm:p-8 border border-papelKraft/60 shadow-2xl max-w-xl w-full relative animate-fadeIn flex flex-col space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedQuoteModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-acentoAzul text-white hover:bg-acentoTerracota transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4 pt-2">
              <span className="text-4xl font-editorial text-acentoTerracota block font-bold leading-none">“</span>
              <p className="text-tintaCarvao text-base sm:text-lg leading-relaxed font-medium lowercase">
                {selectedQuoteModal.quote}
              </p>
              <div className="pt-4 border-t border-papelKraft/40">
                <p className="font-editorial text-lg font-bold text-acentoAzul lowercase">
                  {selectedQuoteModal.author}
                </p>
                <p className="text-xs text-tintaCarvao/70 font-medium lowercase">
                  {selectedQuoteModal.role}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedQuoteModal(null)}
              className="btn-pill-primary w-full py-3 rounded-full text-center text-sm font-semibold lowercase mt-4"
            >
              fechar depoimento
            </button>
          </div>
        </div>
      )}

      {/* 7. CTA FINAL */}
      <section className="py-20 bg-acentoAzul text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
          <h2 className="text-3xl sm:text-5xl font-bold font-editorial text-papelClaro lowercase leading-tight">
            {finalCtaSec.title || 'sua próxima terça pode começar diferente'}
          </h2>
          <p className="text-papelClaro/85 text-lg sm:text-xl font-medium lowercase max-w-2xl mx-auto">
            {finalCtaSec.subtitle || 'você não precisa esperar a vontade chegar, nem ter assunto, nem saber escrever. precisa só aparecer numa terça, às 8h.'}
          </p>
          <div className="p-4 bg-white/10 rounded-2xl max-w-md mx-auto border border-white/20">
            <span className="text-papelClaro font-bold text-lg block lowercase">
              {finalCtaSec.price_text || '97 reais · 100% incluso para quem está no ciclo de aprofundamento'}
            </span>
          </div>
          <div className="pt-4 flex items-center justify-center">
            <button
              onClick={() => setIsPaymentModalOpen(true)}
              className="btn-pill-accent text-lg px-9 py-4 rounded-full shadow-lg hover:scale-105 transition-all flex items-center gap-3 cursor-pointer lowercase"
            >
              <span>{finalCtaSec.button_text || 'sim, quero minha xícara por R$97/mês'}</span>
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
              {faqSec.title || 'perguntas frequentes sobre o café com letras'}
            </h2>
          </div>

          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
              const qVal = faqSec[`q${num}`] || defaultFaqItems[num - 1]?.q;
              const aVal = faqSec[`a${num}`] || defaultFaqItems[num - 1]?.a;
              if (!qVal) return null;
              const idx = num - 1;
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
                    <span>{qVal}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-acentoAzul transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 text-tintaCarvao/85 text-base leading-relaxed font-medium lowercase border-t border-papelKraft/30 pt-4">
                      {aVal}
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

