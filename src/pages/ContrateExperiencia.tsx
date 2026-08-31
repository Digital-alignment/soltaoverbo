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
} from 'lucide-react';
import PreLoginNavbar from '../components/PreLoginNavbar';
import PreLoginFooter from '../components/PreLoginFooter';
import FoundersSection from '../components/FoundersSection';

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

const deploymentScreenshots = [
  { src: '/brand-assets/deployments/IMG_2864.jpg', title: 'depoimento de oficina B2B' },
  { src: '/brand-assets/deployments/IMG_2865.jpg', title: 'feedback de encontro presencial' },
  { src: '/brand-assets/deployments/IMG_2867.jpg', title: 'transformação de equipe' },
  { src: '/brand-assets/deployments/IMG_2868.jpg', title: 'presença no evento' },
  { src: '/brand-assets/deployments/IMG_2870.jpg', title: 'relato de vivência sob medida' },
  { src: '/brand-assets/deployments/IMG_2877.jpg', title: 'carinho dos participantes' },
  { src: '/brand-assets/deployments/IMG_2878.jpg', title: 'potência da escrita em grupo' },
  { src: '/brand-assets/deployments/IMG_8065.PNG', title: 'experiência transformadora' },
  { src: '/brand-assets/deployments/IMG_8068.PNG', title: 'conexões autênticas' },
  { src: '/brand-assets/deployments/IMG_8850.PNG', title: 'gratidão dos parceiros' },
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
    a: 'sim! realizamos vivências presenciais em qualquer cidade do brasil (mediante alinhamento de logística) e também oficinas virtuais interativas ao vivo via zoom.',
  },
  {
    q: 'qual é o número mínimo ou máximo de participantes?',
    a: 'adaptamos o formato para pequenos grupos de liderança (10 a 15 pessoas), encontros de médio porte ou grandes auditórios e festivais.',
  },
  {
    q: 'como funciona a personalização dos temas?',
    a: 'toda a curadoria poética e os exercícios de escrita são criados sob medida para dialogar com a cultura da sua empresa, tema do retiro ou propósito da marca.',
  },
  {
    q: 'como faço para solicitar uma proposta personalizada?',
    a: 'basta clicar nos botões de whatsapp nesta página para conversar diretamente com bruna e júlia. respondemos rapidamente com todas as informações necessárias!',
  },
];

export default function ContrateExperiencia() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Estado do carrossel de screenshots de depoimentos
  const [screenshotIndex, setScreenshotIndex] = useState(0);
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);
  const [isScreenshotPaused, setIsScreenshotPaused] = useState(false);

  const whatsappUrl =
    'https://wa.me/5548991316277?text=ol%C3%A1!%20gostaria%20de%20solicitar%20uma%20proposta%20personalizada%20para%20uma%20experi%C3%AAncia%20do%20solta%20o%20verbo.';

  // Auto-play do carrossel de fotos de eventos (4.5s)
  useEffect(() => {
    if (isCarouselPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % eventGallery.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isCarouselPaused]);

  // Auto-play do carrossel de screenshots de depoimentos (4s)
  useEffect(() => {
    if (isScreenshotPaused || selectedScreenshot !== null) return;
    const interval = setInterval(() => {
      setScreenshotIndex((prev) => (prev + 1) % deploymentScreenshots.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isScreenshotPaused, selectedScreenshot]);

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
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-papelClaro border border-papelKraft/40 text-acentoAzul text-xs sm:text-sm font-semibold uppercase tracking-wider shadow-sm">
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
                  a arte do encontro no seu evento.
                </span>
              </h1>

              <p className="text-tintaCarvao/85 text-lg sm:text-xl leading-relaxed max-w-2xl font-medium lowercase">
                levamos a escrita consciente, rodas de partilha e curadoria poética para empresas, retiros, festivais e marcas. vivências sob medida que criam pontes de escuta autêntica e marcam momentos inesquecíveis.
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
                    src="/brand-assets/gallery/events/13062026-IMG_6581-2.jpg"
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

      {/* 3. CARRUSEL DE FOTOS DE EVENTOS PRESENCIAIS (Polaroid Scrapbook Grid) */}
      <section className="py-20 sm:py-28 bg-papelClaro border-t border-b border-papelKraft/40 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-bgPlataforma border border-papelKraft/40 text-acentoAzul text-xs sm:text-sm font-semibold uppercase tracking-wider mb-4 shadow-sm">
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

      {/* 4. FORMATOS DE EXPERIÊNCIAS DISPONÍVEIS (3 Bento Cards) */}
      <section id="formatos" className="py-20 sm:py-28 bg-bgPlataforma">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-papelClaro border border-papelKraft/40 text-acentoAzul text-xs sm:text-sm font-semibold uppercase tracking-wider mb-4 shadow-sm">
              <Compass className="w-4 h-4 text-acentoTerracota" />
              <span>formatos sob medida</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-editorial text-acentoAzul lowercase mb-4">
              como levamos a experiência até você
            </h2>
            <p className="text-tintaCarvao/80 text-base sm:text-lg font-medium lowercase">
              três caminhos autorais adaptados para o formato e objetivo da sua iniciativa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Bento Card 1: Empresas */}
            <div className="bg-papelClaro rounded-3xl p-7 sm:p-8 border border-papelKraft/40 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-acentoAzul/40 hover:shadow-md flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-acentoAzul/10 text-acentoAzul flex items-center justify-center mb-6 group-hover:bg-acentoAzul group-hover:text-white transition-all">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-acentoTerracota uppercase tracking-wider block mb-1">
                  formato 01 // corporativo
                </span>
                <h3 className="text-2xl font-bold font-editorial text-acentoAzul lowercase mb-3 group-hover:text-acentoTerracota transition-colors">
                  oficinas corporativas & integração
                </h3>
                <p className="text-tintaCarvao/85 text-sm sm:text-base leading-relaxed lowercase font-medium mb-6">
                  vivências práticas para empresas que buscam fortalecer a empatia, desacelerar a rotina de trabalho e cultivar um clima de confiança através da escrita consciente.
                </p>
              </div>

              <div className="pt-4 border-t border-papelKraft/30">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-full bg-acentoAzul/10 hover:bg-acentoAzul text-acentoAzul hover:text-white transition-all text-xs font-bold flex items-center justify-center gap-2 lowercase"
                >
                  <span>solicitar proposta para empresas</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Bento Card 2: Retiros & Festivais */}
            <div className="bg-papelClaro rounded-3xl p-7 sm:p-8 border border-papelKraft/40 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-acentoAzul/40 hover:shadow-md flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-acentoTerracota/10 text-acentoTerracota flex items-center justify-center mb-6 group-hover:bg-acentoTerracota group-hover:text-white transition-all">
                  <Users className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-acentoTerracota uppercase tracking-wider block mb-1">
                  formato 02 // imersões
                </span>
                <h3 className="text-2xl font-bold font-editorial text-acentoAzul lowercase mb-3 group-hover:text-acentoTerracota transition-colors">
                  retiros, festivais & coletivos
                </h3>
                <p className="text-tintaCarvao/85 text-sm sm:text-base leading-relaxed lowercase font-medium mb-6">
                  rituais de abertura e encerramento, rodas de escuta ao redor do fogo e curadoria de cadernos de bordo para eventos de bem-estar e autoconhecimento.
                </p>
              </div>

              <div className="pt-4 border-t border-papelKraft/30">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-full bg-acentoTerracota/10 hover:bg-acentoTerracota text-acentoTerracota hover:text-white transition-all text-xs font-bold flex items-center justify-center gap-2 lowercase"
                >
                  <span>solicitar proposta para retiros</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Bento Card 3: Marcas & Ativações */}
            <div className="bg-papelClaro rounded-3xl p-7 sm:p-8 border border-papelKraft/40 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-acentoAzul/40 hover:shadow-md flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-acentoOliva/30 text-tintaCarvao flex items-center justify-center mb-6 group-hover:bg-acentoOliva transition-all">
                  <Sparkles className="w-6 h-6 text-acentoAzul" />
                </div>
                <span className="text-xs font-bold text-acentoTerracota uppercase tracking-wider block mb-1">
                  formato 03 // marcas
                </span>
                <h3 className="text-2xl font-bold font-editorial text-acentoAzul lowercase mb-3 group-hover:text-acentoTerracota transition-colors">
                  ativações de marca & festas
                </h3>
                <p className="text-tintaCarvao/85 text-sm sm:text-base leading-relaxed lowercase font-medium mb-6">
                  curadoria de ambientes afetivos, escrita poética personalizada ao vivo e brindes gráficos memoráveis para marcas e celebrações especiais.
                </p>
              </div>

              <div className="pt-4 border-t border-papelKraft/30">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-full bg-acentoOliva/30 hover:bg-acentoOliva text-acentoAzul transition-all text-xs font-bold flex items-center justify-center gap-2 lowercase"
                >
                  <span>solicitar proposta para marcas</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. COMO FUNCIONA O PROCESSO DE CRIAÇÃO (4 Etapas) */}
      <section className="py-24 sm:py-32 bg-papelClaro border-t border-b border-papelKraft/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-bgPlataforma border border-papelKraft/40 text-acentoAzul text-xs sm:text-sm font-semibold uppercase tracking-wider mb-4 shadow-sm">
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

      {/* 7. CARROSSEL DE SCREENSHOTS REAIS DE DEPOIMENTOS & IMPRESSÕES B2B */}
      <section className="py-20 sm:py-28 bg-papelClaro border-t border-b border-papelKraft/40 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-bgPlataforma border border-papelKraft/40 text-acentoAzul text-xs sm:text-sm font-semibold uppercase tracking-wider mb-4 shadow-sm">
              <img
                src="/brand-assets/icons/icone_63.svg"
                alt="icone"
                className="w-5 h-5 object-contain"
              />
              <span>relatos & impressões reais</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-editorial text-acentoAzul lowercase mb-4">
              o que dizem quem já viveu nossas experiências
            </h2>
            <p className="text-tintaCarvao/80 text-base sm:text-lg font-medium lowercase">
              depoimentos e trocas espontâneas após nossas oficinas e encontros presenciais.
            </p>
          </div>

          <div
            className="relative max-w-5xl mx-auto"
            onMouseEnter={() => setIsScreenshotPaused(true)}
            onMouseLeave={() => setIsScreenshotPaused(false)}
          >
            <button
              onClick={() =>
                setScreenshotIndex(
                  (prev) => (prev - 1 + deploymentScreenshots.length) % deploymentScreenshots.length
                )
              }
              aria-label="depoimento anterior"
              className="absolute -left-4 sm:-left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-papelClaro/90 backdrop-blur-sm border border-papelKraft/60 shadow-lg text-acentoAzul hover:bg-acentoAzul hover:text-white transition-all flex items-center justify-center cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={() =>
                setScreenshotIndex((prev) => (prev + 1) % deploymentScreenshots.length)
              }
              aria-label="próximo depoimento"
              className="absolute -right-4 sm:-right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-papelClaro/90 backdrop-blur-sm border border-papelKraft/60 shadow-lg text-acentoAzul hover:bg-acentoAzul hover:text-white transition-all flex items-center justify-center cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {[0, 1, 2].map((offset) => {
                const itemIndex = (screenshotIndex + offset) % deploymentScreenshots.length;
                const item = deploymentScreenshots[itemIndex];
                const washiTapeImage =
                  offset % 2 === 0
                    ? '/brand-assets/elements/stickers/fitas-washi-flores-terracota.png'
                    : '/brand-assets/elements/stickers/fitas-washi-flores-azul.png';

                return (
                  <div
                    key={itemIndex}
                    onClick={() => setSelectedScreenshot(item.src)}
                    className="relative bg-bgPlataforma rounded-3xl p-4 sm:p-5 border border-papelKraft/40 shadow-kraft transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl cursor-pointer group select-none flex flex-col justify-between"
                  >
                    <div className="absolute -top-3.5 left-6 w-28 h-7 pointer-events-none z-20 opacity-90">
                      <img
                        src={washiTapeImage}
                        alt="fita washi"
                        className="w-full h-full object-contain"
                      />
                    </div>

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

                    <div className="px-2 text-center pt-1 border-t border-papelKraft/30 flex items-center justify-between">
                      <span className="font-editorial text-sm font-bold text-acentoAzul lowercase">
                        {item.title}
                      </span>
                      <span className="text-[11px] font-bold text-acentoTerracota bg-acentoTerracota/10 px-2.5 py-0.5 rounded-full lowercase">
                        print real
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center items-center gap-2 mt-8">
              {deploymentScreenshots.slice(0, 8).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setScreenshotIndex(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    screenshotIndex === idx
                      ? 'w-8 bg-acentoTerracota'
                      : 'w-2.5 bg-papelKraft/50 hover:bg-acentoAzul/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Modal de Screenshot Ampliado */}
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

      {/* 8. BANNER FINAL DE CONVERSÃO NO WHATSAPP (Sem Preço) */}
      <section className="py-24 sm:py-32 bg-bgPlataforma relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-acentoAzul text-white rounded-3xl p-8 sm:p-14 border border-white/20 shadow-kraft-lg text-center space-y-8 relative overflow-hidden">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-acentoOliva text-xs sm:text-sm font-semibold uppercase tracking-wider">
              <span>vamos criar juntos</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-editorial text-papelClaro lowercase">
              pronto para levar a solta o verbo até o seu grupo?
            </h2>

            <p className="text-papelClaro/85 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed font-medium lowercase">
              fale diretamente com bruna riedel e júlia alvim pelo whatsapp para alinhar datas, formatos e receber uma proposta sob medida.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-pill-accent text-lg px-10 py-4 rounded-full shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-3 w-full sm:w-auto lowercase cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 fill-white text-acentoAzul" />
                <span>conversar no whatsapp agora</span>
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
