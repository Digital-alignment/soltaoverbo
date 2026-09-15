import { useState, useEffect } from 'react';
import {
  MessageCircle,
  Building2,
  Sparkles,
  Users,
  Compass,
  CheckCircle2,
  Calendar,
  Clock,
  ArrowRight,
  Heart,
  Pencil,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ZoomIn,
  X,
  BookOpen,
  Quote,
} from 'lucide-react';
import PreLoginNavbar from '../components/PreLoginNavbar';
import PreLoginFooter from '../components/PreLoginFooter';
import FoundersSection from '../components/FoundersSection';
import { usePageContent } from '../hooks/usePageContent';

interface EventPhoto {
  image: string;
  title: string;
  subtitle: string;
  washiTape: string;
}

const eventGallery: EventPhoto[] = [
  {
    image: '/brand-assets/gallery/events/13062026-IMG_6581-2.jpg',
    title: 'oficinas corporativas & integração',
    subtitle: 'vivências de escrita guiada para desacelerar equipes',
    washiTape: '/brand-assets/elements/stickers/fitas-washi-flores-terracota.png',
  },
  {
    image: '/brand-assets/gallery/events/13062026-IMG_5364-2.jpg',
    title: 'rodas de partilha em retiros',
    subtitle: 'curadoria de ambiente e escuta sem julgamento',
    washiTape: '/brand-assets/elements/stickers/fitas-washi-flores-azul.png',
  },
  {
    image: '/brand-assets/gallery/events/13062026-IMG_6666-2.jpg',
    title: 'experiências para marcas & eventos',
    subtitle: 'ativações poéticas sob medida com cadernos afetivos',
    washiTape: '/brand-assets/elements/stickers/fitas-washi-realistica-azul.png',
  },
  {
    image: '/brand-assets/gallery/events/_MG_0015.jpg',
    title: 'imersões presenciais & festivais',
    subtitle: 'espaço seguro para acolher histórias humanas',
    washiTape: '/brand-assets/elements/stickers/fitas-washi-flores-terracota.png',
  },
  {
    image: '/brand-assets/gallery/events/_MG_9849.jpg',
    title: 'dinâmicas de escuta ativa',
    subtitle: 'transformando a rotina de trabalho em presença',
    washiTape: '/brand-assets/elements/stickers/fitas-washi-flores-azul.png',
  },
  {
    image: '/brand-assets/gallery/events/_MG_9991.jpg',
    title: 'rituais de abertura & encerramento',
    subtitle: 'reescrevendo narrativas em comunidade',
    washiTape: '/brand-assets/elements/stickers/fitas-washi-realistica-azul.png',
  },
];

const formTestimonials = [
  {
    quote: 'em 2022 entrei num processo muito profundo de autoconhecimento e passei por várias experiências. em todas elas, o denominador comum era a escrita como uma das principais e mais efetivas ferramentas pra me entender.',
    author: 'bárbara alcântara (babi)',
    tag: 'café com letras & ciclo',
  },
  {
    quote: 'gostei de aprender sobre a resistência, sobre a importância da troca e, principalmente, sobre o quanto é possível escrever em só 15 minutos! vocês são demais, eu encontrei aleatoriamente o solta o verbo e sou muito grata por isso.',
    author: 'bárbara alcântara (babi)',
    tag: 'café com letras & ciclo',
  },
  {
    quote: 'o simples fato de estar em sangha, ouvindo escritas pessoais diverse e se inspirando nelas, é o néctar da solta o verbo.',
    author: 'tom vitralli',
    bio: 'explorador de realidades, andarilho de alma',
    tag: '21 dias & ciclo',
  },
  {
    quote: 'minha escrita começou a pegar no tranco. menos analítica, mais expressiva e autêntica. apesar de já escrever poesias antes, o fluxo da escrita melhorou muito!',
    author: 'tom vitralli',
    bio: 'explorador de realidades, andarilho de alma',
    tag: '21 dias & ciclo',
  },
  {
    quote: 'conhecer o solta o verbo foi um resgate desse instrumento, e ao mesmo tempo uma expansão de como colocar palavras: não como uma técnica engessada, mas inspiracional e fluida. sinto-me cada vez mais presente.',
    author: 'jess',
    tag: '21 dias & ciclo',
  },
  {
    quote: 'essa comunidade é um fio de vida humana, principalmente nessa transição planetária. agradeço e indico para quem busca uma comunidade aberta para avançar.',
    author: 'jess',
    tag: '21 dias & ciclo',
  },
];

const creationSteps = [
  {
    step: '01',
    title: 'diagnóstico & alinhamento',
    subtitle: 'escutar para entender sua intenção',
    description: 'conversamos com você para compreender o propósito do evento, perfil dos participantes e o impacto desejado para a experiência.',
  },
  {
    step: '02',
    title: 'curadoria & roteiro autoral',
    subtitle: 'experiência 100% sob medida',
    description: 'desenhamos propostas de escrita exclusivas, seleção de músicas, dinâmicas de acolhimento e cadernos de apoio personalizados.',
  },
  {
    step: '03',
    title: 'facilitação & condução viva',
    subtitle: 'presença afetuosa de bruna e júlia',
    description: 'conduzimos a vivência com leveza, sensibilidade e profissionalismo, criando uma atmosfera onde todos se sentem seguros para participar.',
  },
  {
    step: '04',
    title: 'desdobramentos & memórias',
    subtitle: 'lembrança duradoura para o grupo',
    description: 'entrega de cadernos poéticos e síntese da experiência para que os aprendizados permaneçam vivos após o encontro.',
  },
];

const b2bFaqItems = [
  {
    q: 'as experiências podem ser presenciais ou virtuais?',
    a: 'sim, os dois formatos. presencial, a gente leva todo o ritual pra dentro do seu espaço. online, adaptamos a vivência sem perder a profundidade do encontro.',
  },
  {
    q: 'qual é o número mínimo ou máximo de participantes?',
    a: 'não trabalhamos com número fixo. pra formatos mais íntimos, como oficinas corporativas, o grupo costuma ser pequeno. já em festivais e instalações, a experiência é fixa no espaço, e pode receber quantas pessoas quiserem participar. o número ideal depende do formato e do lugar, e isso a gente alinha junto com você.',
  },
  {
    q: 'quanto custa contratar uma experiência?',
    a: 'o investimento varia de acordo com o formato, a duração e o tamanho do grupo. por isso cada proposta é personalizada, fale com a gente pelo whatsapp e te passamos os valores certinhos pro seu caso.',
  },
  {
    q: 'com quanto tempo de antecedência preciso contratar?',
    a: 'o ideal é fechar com pelo menos 1 mês de antecedência, pra gente ter tempo de fazer o diagnóstico, desenhar o roteiro autoral e alinhar tudo com calma antes do dia.',
  },
  {
    q: 'quem conduz a experiência?',
    a: 'bruna e júlia, as criadoras da solta o verbo, conduzem pessoalmente cada experiência. nada é terceirizado, quem desenha o roteiro é quem está com o grupo no dia.',
  },
  {
    q: 'e se o meu time não tem afinidade com escrita? isso funciona mesmo assim?',
    a: 'funciona, e costuma ser exatamente com esses grupos que a experiência mais surpreende. não pedimos talento, só presença. a escrita aqui é ferramenta, não performance.',
  },
  {
    q: 'como faço para solicitar uma proposta personalizada?',
    a: 'basta clicar nos botões de whatsapp desta página pra conversar direto com bruna e júlia. respondemos rápido com todas as informações necessárias.',
  },
];

export default function ContrateExperiencia() {
  const { getSection } = usePageContent('contrate_experiencia');
  const { getSection: getContactSection } = usePageContent('contacts');

  const heroSec = getSection('hero', {
    title: 'momentos que reconectam um grupo com a própria palavra.',
    subtitle: 'levamos rituais de escrita consciente, integração humana e expressão autêntica para dentro da sua empresa, do seu evento ou do seu festival.',
  });

  const contactsSec = getContactSection('info', {
    whatsapp: 'https://wa.me/5548991316277?text=ol%C3%A1!%20gostaria%20de%20solicitar%20uma%20proposta%20personalizada%20para%20uma%20experi%C3%AAncia%20do%20solta%20o%20verbo.',
  });

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const whatsappUrl =
    contactsSec.whatsapp ||
    'https://wa.me/5548991316277?text=ol%C3%A1!%20gostaria%20de%20solicitar%20uma%20proposta%20personalizada%20para%20uma%20experi%C3%AAncia%20do%20solta%20o%20verbo.';

  // Auto-play do carrossel de fotos de eventos (4.5s)
  useEffect(() => {
    if (isCarouselPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % eventGallery.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isCarouselPaused]);

  return (
    <div className="min-h-screen bg-bgPlataforma text-tintaCarvao selection:bg-acentoTerracota/20 selection:text-acentoAzul">
      {/* 1. Header Navbar Sticky */}
      <PreLoginNavbar />

      {/* 2. HERO SECTION B2B (Experiências sob Medida) */}
      <section className="relative pt-12 pb-16 sm:pt-16 sm:pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Coluna Esquerda: Copy B2B & Posicionamento */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-papelClaro border border-papelKraft/40 text-acentoAzul text-xs sm:text-sm font-semibold lowercase tracking-wider shadow-sm">
                <img
                  src="/brand-assets/icons/icone_63.svg"
                  alt="chama viva"
                  className="w-5 h-5 object-contain"
                />
                <span>experiências sob medida & oficinas B2B</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-editorial text-acentoAzul lowercase leading-[1.1] tracking-tight">
                contrate uma experiência: <br className="hidden sm:inline" />
                <span className="font-gesto text-acentoTerracota font-normal text-5xl sm:text-6xl lg:text-7xl block mt-1">
                  {heroSec.title || 'momentos que reconectam um grupo com a própria palavra.'}
                </span>
              </h1>

              <p className="text-tintaCarvao/85 text-lg sm:text-xl leading-relaxed max-w-2xl font-medium lowercase">
                {heroSec.subtitle || 'levamos rituais de escrita consciente, integração humana e expressão autêntica para dentro da sua empresa, do seu evento ou do seu festival.'}
              </p>

              {/* Destaque B2B de Alinhamento Direto */}
              <div className="p-5 bg-papelClaro rounded-2xl border border-papelKraft/50 shadow-sm max-w-xl space-y-3">
                <div className="flex items-center gap-3 text-sm font-bold text-acentoAzul lowercase pb-2 border-b border-papelKraft/30">
                  <Building2 className="w-5 h-5 text-acentoTerracota" />
                  <span>propostas exclusivas sob medida para o seu grupo</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-tintaCarvao/80 font-medium lowercase">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-acentoOliva flex-shrink-0" />
                    <span>presencial ou online</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-acentoOliva flex-shrink-0" />
                    <span>roteiro 100% personalizado</span>
                  </span>
                </div>
              </div>

              {/* Botões CTA Principais (Enviam ao WhatsApp) */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-pill-primary text-base sm:text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-3 lowercase"
                >
                  <MessageCircle className="w-5 h-5 fill-white text-acentoAzul" />
                  <span>solicitar proposta no whatsapp</span>
                </a>

                <a
                  href="#formatos"
                  className="bg-papelClaro text-acentoAzul border border-papelKraft/50 hover:bg-bgPlataforma text-base px-7 py-3.5 rounded-full font-medium transition-all shadow-sm flex items-center gap-2 cursor-pointer lowercase"
                >
                  <span>ver formatos de experiência</span>
                  <ArrowRight className="w-4 h-4 text-acentoAzul" />
                </a>
              </div>
            </div>

            {/* Coluna Direita: Scrapbook Bento Card com Foto de Eventos */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl bg-papelClaro p-6 sm:p-8 border border-papelKraft/40 shadow-kraft-lg overflow-hidden group">
                {/* Sticker Fita Washi */}
                <div className="absolute -top-2 right-8 w-28 h-7 pointer-events-none z-20 opacity-90">
                  <img
                    src="/brand-assets/elements/stickers/fitas-washi-flores-terracota.png"
                    alt="fita washi"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="w-full h-64 sm:h-72 rounded-2xl overflow-hidden border border-papelKraft/40 shadow-sm relative mb-5">
                  <img
                    src={heroSec.image_url || "/brand-assets/gallery/events/13062026-IMG_6581-2.jpg"}
                    alt="experiencia solta o verbo eventos"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                <div className="space-y-2">
                  <blockquote className="font-editorial text-xl sm:text-2xl text-acentoAzul leading-snug font-bold lowercase">
                    “transformar a rotina de uma equipe começa quando abrimos espaço para a escuta genuína.”
                  </blockquote>
                  <p className="text-xs text-tintaCarvao/60 font-mono lowercase pt-2 border-t border-papelKraft/30">
                    vivências sob medida // solta o verbo colectivo
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2.5. PRA QUEM É ISSO */}
      <section className="py-20 sm:py-28 bg-papelClaro border-t border-b border-papelKraft/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-bgPlataforma border border-papelKraft/40 text-acentoAzul text-xs sm:text-sm font-semibold lowercase tracking-wider shadow-sm">
              <Users className="w-4 h-4 text-acentoTerracota" />
              <span>públicos & formatos</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-editorial text-acentoAzul lowercase">
              pra quem é isso
            </h2>
            <p className="text-tintaCarvao/85 text-base sm:text-lg leading-relaxed font-medium lowercase">
              se você cuida de pessoas dentro de uma empresa, organiza um evento que quer sair do lugar comum, ou representa uma marca que busca se aproximar do público de um jeito mais humano, a solta o verbo tem uma experiência pensada pra você.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Card 1 */}
            <div className="bg-bgPlataforma rounded-3xl p-6 sm:p-7 border border-papelKraft/40 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-acentoAzul/60 hover:shadow-md flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-acentoAzul/10 text-acentoAzul flex items-center justify-center group-hover:bg-acentoAzul group-hover:text-white transition-all">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-acentoTerracota uppercase tracking-wider block">
                  01 · empresas & rh
                </span>
                <p className="text-tintaCarvao/90 text-sm sm:text-base leading-relaxed font-medium lowercase">
                  times de rh e people que querem cuidar de verdade da equipe
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-bgPlataforma rounded-3xl p-6 sm:p-7 border border-papelKraft/40 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-acentoAzul/60 hover:shadow-md flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-acentoTerracota/10 text-acentoTerracota flex items-center justify-center group-hover:bg-acentoTerracota group-hover:text-white transition-all">
                  <Sparkles className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-acentoTerracota uppercase tracking-wider block">
                  02 · eventos & retiros
                </span>
                <p className="text-tintaCarvao/90 text-sm sm:text-base leading-relaxed font-medium lowercase">
                  produtoras de eventos, retiros e festivais que buscam rituais de presença
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-bgPlataforma rounded-3xl p-6 sm:p-7 border border-papelKraft/40 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-acentoAzul/60 hover:shadow-md flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-acentoOliva/30 text-tintaCarvao flex items-center justify-center group-hover:bg-acentoOliva transition-all">
                  <Heart className="w-6 h-6 text-acentoAzul" />
                </div>
                <span className="text-xs font-bold text-acentoTerracota uppercase tracking-wider block">
                  03 · marcas & ativações
                </span>
                <p className="text-tintaCarvao/90 text-sm sm:text-base leading-relaxed font-medium lowercase">
                  marcas que querem ativações com significado, não só brinde
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-bgPlataforma rounded-3xl p-6 sm:p-7 border border-papelKraft/40 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-acentoAzul/60 hover:shadow-md flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-acentoAzul/10 text-acentoAzul flex items-center justify-center group-hover:bg-acentoAzul group-hover:text-white transition-all">
                  <Compass className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-acentoTerracota uppercase tracking-wider block">
                  04 · coletivos
                </span>
                <p className="text-tintaCarvao/90 text-sm sm:text-base leading-relaxed font-medium lowercase">
                  coletivos e comunidades que precisam de um espaço pra se escutar
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2.8. POR QUE ESCRITA */}
      <section className="py-20 sm:py-28 bg-bgPlataforma border-t border-b border-papelKraft/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-papelClaro rounded-3xl p-8 sm:p-12 border-2 border-acentoAzul/20 shadow-kraft text-center space-y-6 relative overflow-hidden">
            {/* Sticker Fita Washi */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-36 h-8 pointer-events-none z-20 opacity-90">
              <img
                src="/brand-assets/elements/stickers/fitas-washi-flores-azul.png"
                alt="fita washi"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-bgPlataforma border border-papelKraft/40 text-acentoAzul text-xs sm:text-sm font-semibold lowercase tracking-wider shadow-sm pt-2">
              <BookOpen className="w-4 h-4 text-acentoTerracota" />
              <span>fundamentação & metodologia</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-editorial text-acentoAzul lowercase">
              por que escrita
            </h2>

            <p className="text-tintaCarvao/90 text-base sm:text-lg leading-relaxed font-medium lowercase max-w-3xl mx-auto">
              não é só uma dinâmica bonitinha. nosso trabalho parte de referências consistentes, como as pesquisas de james pennebaker sobre escrita expressiva e seus efeitos no bem estar emocional, e a curva do esquecimento de ebbinghaus, que reforça a importância da prática recorrente, não só de um encontro isolado. cada experiência também é desenhada com a metodologia design de conexões, criada pra gerar pertencimento real entre as pessoas de um grupo, não só preencher uma tarde de agenda.
            </p>
          </div>
        </div>
      </section>

      {/* 3. CARRUSEL DE FOTOS DE EVENTOS PRESENCIAIS (Polaroid Scrapbook Grid) */}
      <section className="py-20 sm:py-28 bg-papelClaro border-t border-b border-papelKraft/40 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-bgPlataforma border border-papelKraft/40 text-acentoAzul text-xs sm:text-sm font-semibold lowercase tracking-wider mb-4 shadow-sm">
              <BookOpen className="w-4 h-4 text-acentoTerracota" />
              <span>galeria de experiências presenciais</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-editorial text-acentoAzul lowercase mb-4">
              registros dos nossos encontros e oficinas
            </h2>
            <p className="text-tintaCarvao/80 text-base sm:text-lg font-medium lowercase">
              momentos de partilha, cadernos abertos e rituais de presença em retiros, empresas e festivais pelo brasil.
            </p>
          </div>

          {/* Carrusel de Galería de Eventos */}
          <div
            className="relative max-w-4xl mx-auto"
            onMouseEnter={() => setIsCarouselPaused(true)}
            onMouseLeave={() => setIsCarouselPaused(false)}
          >
            <div className="relative rounded-3xl bg-bgPlataforma p-6 sm:p-8 border border-papelKraft/40 shadow-kraft-lg overflow-hidden group select-none">
              {/* Sticker Fita Washi */}
              <div className="absolute -top-3 left-10 w-32 h-7 pointer-events-none z-30 opacity-90">
                <img
                  src={eventGallery[currentSlide].washiTape}
                  alt="fita washi"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="w-full h-72 sm:h-96 rounded-2xl overflow-hidden border border-papelKraft/40 relative mb-6 shadow-sm">
                <img
                  src={eventGallery[currentSlide].image}
                  alt={eventGallery[currentSlide].title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-papelKraft/30">
                <div>
                  <h3 className="font-editorial text-2xl font-bold text-acentoAzul lowercase">
                    {eventGallery[currentSlide].title}
                  </h3>
                  <p className="text-sm text-tintaCarvao/75 font-medium lowercase">
                    {eventGallery[currentSlide].subtitle}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setCurrentSlide(
                        (prev) => (prev - 1 + eventGallery.length) % eventGallery.length
                      )
                    }
                    className="w-10 h-10 rounded-full bg-papelClaro border border-papelKraft/50 text-acentoAzul hover:bg-acentoAzul hover:text-white transition-all flex items-center justify-center cursor-pointer shadow-xs"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentSlide((prev) => (prev + 1) % eventGallery.length)
                    }
                    className="w-10 h-10 rounded-full bg-papelClaro border border-papelKraft/50 text-acentoAzul hover:bg-acentoAzul hover:text-white transition-all flex items-center justify-center cursor-pointer shadow-xs"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Pílulas Indicadoras */}
            <div className="flex justify-center items-center gap-2 mt-6">
              {eventGallery.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    currentSlide === idx
                      ? 'w-8 bg-acentoTerracota'
                      : 'w-2.5 bg-papelKraft/50 hover:bg-acentoAzul/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. PRA QUEM É ISSO & POR QUE A ESCRITA */}
      <section className="py-20 sm:py-24 bg-papelClaro border-t border-b border-papelKraft/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Box 1: Pra quem é isso */}
            <div className="bg-bgPlataforma rounded-3xl p-7 sm:p-8 border border-papelKraft/40 shadow-sm space-y-4">
              <span className="text-xs font-bold text-acentoTerracota lowercase tracking-wider block">
                público & contextos
              </span>
              <h3 className="text-2xl font-bold font-editorial text-acentoAzul lowercase">
                pra quem é isso?
              </h3>
              <ul className="space-y-3 text-tintaCarvao/85 text-sm sm:text-base font-medium lowercase">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-acentoOliva flex-shrink-0 mt-0.5" />
                  <span><strong>empresas & líderes:</strong> que buscam promover saúde mental, humanização, escuta ativa e integração genuína de equipes.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-acentoOliva flex-shrink-0 mt-0.5" />
                  <span><strong>retiros & imersões:</strong> facilitadores de autoconhecimento que desejam incluir rodas de partilha e rituais poéticos de escrita.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-acentoOliva flex-shrink-0 mt-0.5" />
                  <span><strong>festivais & eventos culturais:</strong> momentos de desaceleração e presença em meio a programações intensas.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-acentoOliva flex-shrink-0 mt-0.5" />
                  <span><strong>marcas & comemorações:</strong> ativações poéticas com cadernos afetivos e momentos memoráveis.</span>
                </li>
              </ul>
            </div>

            {/* Box 2: Por que a escrita */}
            <div className="bg-bgPlataforma rounded-3xl p-7 sm:p-8 border border-papelKraft/40 shadow-sm space-y-4">
              <span className="text-xs font-bold text-acentoTerracota lowercase tracking-wider block">
                fundamentação & impacto
              </span>
              <h3 className="text-2xl font-bold font-editorial text-acentoAzul lowercase">
                por que a escrita?
              </h3>
              <ul className="space-y-3 text-tintaCarvao/85 text-sm sm:text-base font-medium lowercase">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-acentoOliva flex-shrink-0 mt-0.5" />
                  <span><strong>desaceleração consciente:</strong> uma pausa no piloto automático e nas telas para respirar e sentir.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-acentoOliva flex-shrink-0 mt-0.5" />
                  <span><strong>segurança psicológica:</strong> criar um ambiente onde todos se sentem acolhidos para se expressar sem julgamento.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-acentoOliva flex-shrink-0 mt-0.5" />
                  <span><strong>escuta ativa:</strong> ouvir o outro com presença genuína, fortalecendo a empatia do grupo.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-acentoOliva flex-shrink-0 mt-0.5" />
                  <span><strong>expressão autêntica:</strong> colocar no papel sentimentos que muitas vezes não encontram espaço na fala cotidiana.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* TEORIA + PRÁTICA (Pennebaker & Ebbinghaus) */}
          <div className="bg-bgPlataforma rounded-3xl p-7 sm:p-10 border border-papelKraft/60 shadow-sm space-y-4 max-w-6xl mx-auto relative overflow-hidden">
            <span className="text-xs font-bold text-acentoTerracota lowercase tracking-widest block">
              teoria + prática / o que sustenta a nossa escrita
            </span>
            <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-acentoAzul lowercase">
              nosso trabalho nasce de estudo e de vivência
            </h3>
            <p className="text-tintaCarvao/90 text-base sm:text-lg leading-relaxed font-medium lowercase">
              não improvisamos. cada encontro que desenhamos parte de referências consistentes, como as pesquisas de <strong>james pennebaker</strong> sobre escrita expressiva e seus efeitos no bem-estar emocional, e a <strong>curva do esquecimento de ebbinghaus</strong>, que mostra por que a escrita precisa ser prática sustentada e não um evento isolado.
            </p>
            <p className="text-acentoAzul font-bold text-base sm:text-lg lowercase pt-2">
              é por isso que não entregamos só uma oficina bonita: desenhamos jornadas que continuam vivas depois que a gente vai embora.
            </p>
          </div>
        </div>
      </section>

      {/* 5. FORMATOS DE EXPERIÊNCIAS DISPONÍVEIS (4 Bento Cards + 1 Banner Separado) */}
      <section id="formatos" className="py-20 sm:py-28 bg-bgPlataforma">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-papelClaro border border-papelKraft/40 text-acentoAzul text-xs sm:text-sm font-semibold lowercase tracking-wider mb-4 shadow-sm">
              <Compass className="w-4 h-4 text-acentoTerracota" />
              <span>formatos sob medida</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-editorial text-acentoAzul lowercase mb-4">
              como levamos a experiência até você
            </h2>
            <p className="text-tintaCarvao/80 text-base sm:text-lg font-medium lowercase">
              quatro caminhos autorais adaptados para o formato e objetivo da sua iniciativa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {/* Bento Card 1: Empresas */}
            <div className="bg-papelClaro rounded-3xl p-6 sm:p-7 border border-papelKraft/40 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-acentoAzul/40 hover:shadow-md flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-acentoAzul/10 text-acentoAzul flex items-center justify-center mb-5 group-hover:bg-acentoAzul group-hover:text-white transition-all">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-acentoTerracota lowercase tracking-wider block mb-1">
                  formato 01 // corporativo
                </span>
                <h3 className="text-xl font-bold font-editorial text-acentoAzul lowercase mb-3 group-hover:text-acentoTerracota transition-colors">
                  oficinas corporativas & integração
                </h3>
                <p className="text-tintaCarvao/85 text-xs sm:text-sm leading-relaxed lowercase font-medium mb-6">
                  vivências práticas para empresas que buscam fortalecer a empatia, desacelerar a rotina de trabalho e cultivar um clima de confiança através da escrita consciente.
                </p>
              </div>

              <div className="pt-4 border-t border-papelKraft/30">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-full bg-acentoAzul/10 hover:bg-acentoAzul text-acentoAzul hover:text-white transition-all text-xs font-bold flex items-center justify-center gap-2 lowercase"
                >
                  <span>solicitar proposta</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Bento Card 2: Retiros & Festivais */}
            <div className="bg-papelClaro rounded-3xl p-6 sm:p-7 border border-papelKraft/40 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-acentoAzul/40 hover:shadow-md flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-acentoTerracota/10 text-acentoTerracota flex items-center justify-center mb-5 group-hover:bg-acentoTerracota group-hover:text-white transition-all">
                  <Users className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-acentoTerracota lowercase tracking-wider block mb-1">
                  formato 02 // imersões
                </span>
                <h3 className="text-xl font-bold font-editorial text-acentoAzul lowercase mb-3 group-hover:text-acentoTerracota transition-colors">
                  retiros, festivais & coletivos
                </h3>
                <p className="text-tintaCarvao/85 text-xs sm:text-sm leading-relaxed lowercase font-medium mb-6">
                  rituais de abertura e encerramento, rodas de partilha e cadernos de bordo, pensados pra festivais, retiros e encontros que já nascem com escuta no centro.
                </p>
              </div>

              <div className="pt-4 border-t border-papelKraft/30">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-full bg-acentoTerracota/10 hover:bg-acentoTerracota text-acentoTerracota hover:text-white transition-all text-xs font-bold flex items-center justify-center gap-2 lowercase"
                >
                  <span>solicitar proposta</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Bento Card 3: Marcas & Ativações */}
            <div className="bg-papelClaro rounded-3xl p-6 sm:p-7 border border-papelKraft/40 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-acentoAzul/40 hover:shadow-md flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-acentoOliva/30 text-tintaCarvao flex items-center justify-center mb-5 group-hover:bg-acentoOliva transition-all">
                  <Sparkles className="w-6 h-6 text-acentoAzul" />
                </div>
                <span className="text-xs font-bold text-acentoTerracota lowercase tracking-wider block mb-1">
                  formato 03 // marcas
                </span>
                <h3 className="text-xl font-bold font-editorial text-acentoAzul lowercase mb-3 group-hover:text-acentoTerracota transition-colors">
                  ativações de marca & festas
                </h3>
                <p className="text-tintaCarvao/85 text-xs sm:text-sm leading-relaxed lowercase font-medium mb-6">
                  curadoria de ambientes afetivos, escrita poética personalizada ao vivo e brindes gráficos memoráveis para marcas e celebrações especiais.
                </p>
              </div>

              <div className="pt-4 border-t border-papelKraft/30">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-full bg-acentoOliva/30 hover:bg-acentoOliva text-acentoAzul transition-all text-xs font-bold flex items-center justify-center gap-2 lowercase"
                >
                  <span>solicitar proposta</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Bento Card 4: Educação */}
            <div className="bg-papelClaro rounded-3xl p-6 sm:p-7 border border-papelKraft/40 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-acentoAzul/40 hover:shadow-md flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-acentoAzul/10 text-acentoAzul flex items-center justify-center mb-5 group-hover:bg-acentoAzul group-hover:text-white transition-all">
                  <Pencil className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-acentoTerracota lowercase tracking-wider block mb-1">
                  formato 04 // educação
                </span>
                <h3 className="text-xl font-bold font-editorial text-acentoAzul lowercase mb-3 group-hover:text-acentoTerracota transition-colors">
                  escrita para quem está aprendendo
                </h3>
                <p className="text-tintaCarvao/85 text-xs sm:text-sm leading-relaxed lowercase font-medium mb-6">
                  atividades de escrita criativa para crianças, jovens e educadores, desenvolvendo imaginação, autoria e escuta desde cedo.
                </p>
              </div>

              <div className="pt-4 border-t border-papelKraft/30">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-full bg-acentoAzul/10 hover:bg-acentoAzul text-acentoAzul hover:text-white transition-all text-xs font-bold flex items-center justify-center gap-2 lowercase"
                >
                  <span>solicitar proposta para escolas</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* BANNER SEPARADO: PALAVRAS SOB MEDIDA (Textos para momentos especiais) */}
          <div className="max-w-7xl mx-auto bg-papelClaro rounded-3xl p-7 sm:p-10 border border-papelKraft/60 shadow-kraft-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-acentoTerracota lowercase tracking-wider bg-acentoTerracota/10 px-3 py-1 rounded-full inline-block">
                palavras sob medida // projetos sob encomenda
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-editorial text-acentoAzul lowercase">
                textos autorais para momentos especiais
              </h3>
              <p className="text-tintaCarvao/85 text-base sm:text-lg leading-relaxed lowercase font-medium max-w-3xl">
                escrevemos textos poéticos sob medida para casamentos, homenagens, celebrações de vida e marcos institucionais de empresas: ouvimos a sua história e a devolvemos em palavras inesquecíveis.
              </p>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pill-primary text-base px-8 py-3.5 rounded-full flex items-center gap-2 flex-shrink-0 cursor-pointer lowercase shadow-md"
            >
              <span>encomendar um texto</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </a>
          </div>
        </div>
      </section>

      {/* 5. COMO FUNCIONA O PROCESSO DE CRIAÇÃO (4 Etapas) */}
      <section className="py-24 sm:py-32 bg-papelClaro border-t border-b border-papelKraft/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-bgPlataforma border border-papelKraft/40 text-acentoAzul text-xs sm:text-sm font-semibold lowercase tracking-wider mb-4 shadow-sm">
              <Clock className="w-4 h-4 text-acentoTerracota" />
              <span>passo a passo da contratação</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-editorial text-acentoAzul lowercase mb-4">
              como construímos a experiência juntos
            </h2>
            <p className="text-tintaCarvao/80 text-base sm:text-lg font-medium lowercase">
              quatro etapas simples para criar uma vivência perfeita para o seu grupo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {creationSteps.map((item, idx) => (
              <div
                key={idx}
                className="bg-bgPlataforma rounded-3xl p-6 border border-papelKraft/40 shadow-sm flex flex-col justify-between space-y-4 hover:-translate-y-1 transition-transform"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-editorial text-3xl font-bold text-acentoTerracota">
                      {item.step}
                    </span>
                    <span className="text-[11px] font-bold text-acentoAzul bg-papelClaro px-2.5 py-0.5 rounded-full border border-papelKraft/40 lowercase">
                      etapa 0{idx + 1}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold font-editorial text-acentoAzul lowercase">
                    {item.title}
                  </h3>

                  <p className="font-gesto text-acentoTerracota text-xl font-normal">
                    {item.subtitle}
                  </p>

                  <p className="text-tintaCarvao/85 text-xs sm:text-sm leading-relaxed font-medium lowercase">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-papelKraft/30 text-xs font-bold text-acentoAzul/70 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-acentoOliva" />
                  <span>alinhamento contínuo</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FACILITADORAS DO PROGRAMA */}
      <FoundersSection />

      {/* 7. PARTILHAS REAIS */}
      <section className="py-20 sm:py-28 bg-papelClaro border-t border-b border-papelKraft/40 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-editorial text-acentoAzul lowercase">
              partilhas reais
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {formTestimonials.map((item, idx) => {
              const washiTapeImage =
                idx % 2 === 0
                  ? '/brand-assets/elements/stickers/fitas-washi-flores-terracota.png'
                  : '/brand-assets/elements/stickers/fitas-washi-flores-azul.png';

              return (
                <div
                  key={idx}
                  className="relative bg-bgPlataforma rounded-3xl p-6 sm:p-7 border border-papelKraft/40 shadow-kraft transition-all duration-300 hover:-translate-y-1 hover:border-acentoAzul/60 hover:shadow-md flex flex-col justify-between group"
                >
                  <div className="absolute -top-3.5 left-6 w-28 h-7 pointer-events-none z-20 opacity-90">
                    <img
                      src={washiTapeImage}
                      alt="fita washi"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="space-y-3 pt-3">
                    <Quote className="w-7 h-7 text-acentoTerracota/70" />
                    <p className="text-tintaCarvao/90 text-sm sm:text-base leading-relaxed font-medium lowercase italic font-editorial">
                      &ldquo;{item.quote}&rdquo;
                    </p>
                  </div>

                  <div className="pt-4 mt-5 border-t border-papelKraft/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-acentoAzul text-sm lowercase block">
                        {item.author}
                      </span>
                      {item.bio && (
                        <span className="text-xs text-tintaCarvao/60 font-medium lowercase block">
                          {item.bio}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-bold text-acentoTerracota bg-acentoTerracota/10 px-2.5 py-1 rounded-full lowercase w-fit">
                      {item.tag}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. BANNER FINAL DE CONVERSÃO NO WHATSAPP (Sem Preço) */}
      <section className="py-24 sm:py-32 bg-bgPlataforma relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-acentoAzul text-white rounded-3xl p-8 sm:p-14 border border-white/20 shadow-kraft-lg text-center space-y-8 relative overflow-hidden">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-acentoOliva text-xs sm:text-sm font-semibold lowercase tracking-wider">
              <span>vamos criar juntos</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-editorial text-papelClaro lowercase">
              vamos desenhar algo especial juntos?
            </h2>

            <p className="text-papelClaro/85 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed font-medium lowercase">
              fale diretamente com a gente no whatsapp e receba a proposta detalhada.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-pill-accent text-lg px-10 py-4 rounded-full shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-3 w-full sm:w-auto lowercase cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 fill-white text-acentoAzul" />
                <span>solicitar proposta no whatsapp</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FAQ B2B */}
      <section className="py-20 sm:py-28 bg-papelClaro border-t border-b border-papelKraft/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold font-editorial text-acentoAzul lowercase mb-3">
              perguntas frequentes sobre nossas experiências
            </h2>
          </div>

          <div className="space-y-4">
            {b2bFaqItems.map((item, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? 'bg-papelClaro border-acentoTerracota/50 shadow-kraft-lg'
                      : 'bg-bgPlataforma/70 border-papelKraft/40 hover:border-acentoAzul/40'
                  }`}
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full p-5 sm:p-6 text-left flex justify-between items-center gap-4 cursor-pointer focus:outline-none select-none"
                  >
                    <span className="font-bold text-lg sm:text-xl font-editorial text-acentoAzul lowercase">
                      {item.q}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-acentoAzul transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-acentoTerracota' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-papelKraft/30 text-tintaCarvao/85 text-base leading-relaxed font-medium lowercase">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 10. PreLoginFooter Poético com Shader WebGL */}
      <PreLoginFooter />
    </div>
  );
}
