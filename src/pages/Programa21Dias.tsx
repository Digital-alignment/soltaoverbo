import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  Pencil,
  ArrowRight,
  ShieldCheck,
  Headphones,
  Flame,
  FileText,
  Clock,
  Heart,
  Play,
  Volume2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  X,
} from 'lucide-react';
import PreLoginNavbar from '../components/PreLoginNavbar';
import PreLoginFooter from '../components/PreLoginFooter';
import FoundersSection from '../components/FoundersSection';

interface WeekPhase {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  washiTape: string;
  audioTeaser: string;
  milestones: { days: string; label: string }[];
}

const journeyPhases: WeekPhase[] = [
  {
    number: '01',
    title: 'semana 1: soltar as amarras (dias 1 a 7)',
    subtitle: 'desbloquear a voz e silenciar a crítica interna',
    description: 'nos primeiros sete dias, o foco é perder o medo da folha em branco. você aprende a escrever sem julgar a própria palavra, liberando o fluxo espontâneo de consciência.',
    image: '/brand-assets/gallery/events/13062026-IMG_6581-2.jpg',
    washiTape: '/brand-assets/elements/stickers/fitas-washi-flores-terracota.png',
    audioTeaser: 'áudio 01: perdendo o medo da folha em branco (5 min)',
    milestones: [
      { days: 'dias 1 a 3', label: 'quebrando o gelo e escrevendo sem filtro' },
      { days: 'dias 4 e 5', label: 'identificando e silenciando o censor interno' },
      { days: 'dias 6 e 7', label: 'criando o seu primeiro ritual diário de presença' },
    ],
  },
  {
    number: '02',
    title: 'semana 2: aprofundar e reorganizar (dias 8 a 14)',
    subtitle: 'mapear memórias e dar forma ao caos emocional',
    description: 'na segunda semana, navegamos em camadas mais profundas. a escrita passa a funcionar como uma bússola interna para organizar pensamentos soltos e dar novo significado a cenas vividas.',
    image: '/brand-assets/gallery/events/13062026-IMG_5364-2.jpg',
    washiTape: '/brand-assets/elements/stickers/fitas-washi-flores-azul.png',
    audioTeaser: 'áudio 08: a bússola das emoções e memórias (6 min)',
    milestones: [
      { days: 'dias 8 a 10', label: 'escrita afetiva e ressignificação de memórias' },
      { days: 'dias 11 e 12', label: 'organizando o caos mental em frases curtas' },
      { days: 'dias 13 e 14', label: 'transformando preocupação em movimento criativo' },
    ],
  },
  {
    number: '03',
    title: 'semana 3: autoria e consolidação (dias 15 a 21)',
    subtitle: 'afirmar sua voz autêntica e sustentar o hábito',
    description: 'na reta final, você consolida a escrita como uma prática viva e sustentável. um convite para assumir a autoria da própria história com clareza, liberdade e coragem.',
    image: '/brand-assets/gallery/events/_MG_9849.jpg',
    washiTape: '/brand-assets/elements/stickers/fitas-washi-realistica-azul.png',
    audioTeaser: 'áudio 15: seu manifesto de autoria e coragem (7 min)',
    milestones: [
      { days: 'dias 15 a 17', label: 'encontrando o seu tom e ritmo autoral único' },
      { days: 'dias 18 e 19', label: 'o poder do manifesto pessoal e metas poéticas' },
      { days: 'dias 20 e 21', label: 'ritual de encerramento e continuidade da prática' },
    ],
  },
];

const deploymentScreenshots = [
  { src: '/brand-assets/deployments/IMG_2847.PNG', title: 'partilha e acolhimento' },
  { src: '/brand-assets/deployments/IMG_2848.PNG', title: 'desbloqueio criativo' },
  { src: '/brand-assets/deployments/IMG_2849.PNG', title: 'relação com o caderno' },
  { src: '/brand-assets/deployments/IMG_2864.jpg', title: 'mensagens de alunas' },
  { src: '/brand-assets/deployments/IMG_2865.jpg', title: 'depoimento espontâneo' },
  { src: '/brand-assets/deployments/IMG_2867.jpg', title: 'transformação diária' },
  { src: '/brand-assets/deployments/IMG_2868.jpg', title: 'reflexão comunitária' },
  { src: '/brand-assets/deployments/IMG_2870.jpg', title: 'vozes da fogueira' },
  { src: '/brand-assets/deployments/IMG_2877.jpg', title: 'carinho e presença' },
  { src: '/brand-assets/deployments/IMG_2878.jpg', title: 'impacto da escrita' },
  { src: '/brand-assets/deployments/IMG_8065.PNG', title: 'relato de experiência' },
  { src: '/brand-assets/deployments/IMG_8066.PNG', title: 'prints do grupo' },
  { src: '/brand-assets/deployments/IMG_8067.PNG', title: 'experiência dos 21 dias' },
  { src: '/brand-assets/deployments/IMG_8068.PNG', title: 'trocas poéticas' },
  { src: '/brand-assets/deployments/IMG_8069.PNG', title: 'ritmo pessoal' },
  { src: '/brand-assets/deployments/IMG_8151.PNG', title: 'caderno em movimento' },
  { src: '/brand-assets/deployments/IMG_8846.PNG', title: 'comunidade acolhedora' },
  { src: '/brand-assets/deployments/IMG_8850.PNG', title: 'gratidão das leitoras' },
];

const faqItems = [
  {
    q: 'quanto tempo preciso dedicar por dia?',
    a: 'apenas 15 a 20 minutos diários! o programa foi desenhado para se encaixar com leveza na sua rotina, sem pesar como obrigação.',
  },
  {
    q: 'e se eu me atrasar ou perder algum dia?',
    a: 'não se preocupe! o desafio é 100% self-paced. todo o conteúdo fica gravado e acessível na sua área de membros para você fazer no seu próprio ritmo.',
  },
  {
    q: 'preciso mostrar meus textos para outras pessoas?',
    a: 'jamais! a escrita é sua e de mais ninguém. a nossa fogueira de partilha é um espaço seguro e totalmente opcional para quem sente o desejo de compartilhar.',
  },
  {
    q: 'como funciona a garantia de 7 dias?',
    a: 'você pode entrar, experimentar os primeiros exercícios e áudios durante 7 dias. se sentir que não é o momento para você, devolvemos 100% do valor investido sem perguntas.',
  },
];

export default function Programa21Dias() {
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  
  // Estado do Carrossel de Screenshots de Depoimentos
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const navigate = useNavigate();
  const youtubeVideoId = 'dQw4w9WgXcQ';

  // Auto-play do carrossel a cada 4 segundos
  useEffect(() => {
    if (isPaused || selectedScreenshot !== null) return;
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % deploymentScreenshots.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused, selectedScreenshot]);

  const handleEnroll = () => {
    localStorage.setItem('checkout_intent', '21dias');
    navigate('/register?product=21dias');
  };

  const nextSlide = () => {
    setCarouselIndex((prev) => (prev + 1) % deploymentScreenshots.length);
  };

  const prevSlide = () => {
    setCarouselIndex((prev) => (prev - 1 + deploymentScreenshots.length) % deploymentScreenshots.length);
  };

  return (
    <div className="min-h-screen bg-bgPlataforma text-tintaCarvao selection:bg-acentoTerracota/20 selection:text-acentoAzul">
      {/* 1. Header Navbar Sticky */}
      <PreLoginNavbar />

      {/* 2. HERO SECTION DE VENDAS (High Conversion Hero) */}
      <section className="relative pt-12 pb-16 sm:pt-16 sm:pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Coluna Esquerda: Copy Persuasivo & Oferta */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-papelClaro border border-papelKraft/40 text-acentoAzul text-xs sm:text-sm font-semibold uppercase tracking-wider shadow-sm">
                <img
                  src="/brand-assets/icons/icone_63.svg"
                  alt="chama viva"
                  className="w-5 h-5 object-contain"
                />
                <span>jornada self-paced de escrita guiada</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-editorial text-acentoAzul lowercase leading-[1.1] tracking-tight">
                21 dias de escrita: <br className="hidden sm:inline" />
                <span className="font-gesto text-acentoTerracota font-normal text-5xl sm:text-6xl lg:text-7xl block mt-1">
                  sua história tem valor.
                </span>
              </h1>

              <p className="text-tintaCarvao/85 text-lg sm:text-xl leading-relaxed max-w-2xl font-medium lowercase">
                um método simples e acolhedor de 21 dias para destravar sua voz, organizar o caos mental e criar um hábito diário de presença — sem pressão ou perfeccionismo.
              </p>

              {/* Destaque de Preço & Garantia */}
              <div className="p-5 bg-papelClaro rounded-2xl border border-papelKraft/50 shadow-sm max-w-xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-papelKraft/30">
                  <div>
                    <span className="text-[11px] font-bold text-tintaCarvao/60 uppercase tracking-wider block">
                      investimento promocional
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl sm:text-4xl font-bold font-editorial text-acentoAzul">
                        R$ 77,00
                      </span>
                      <span className="text-xs sm:text-sm text-tintaCarvao/70 lowercase font-medium">
                        à vista (ou 2x R$ 38,50)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-semibold text-acentoOliva bg-acentoOliva/10 px-3.5 py-1.5 rounded-full border border-acentoOliva/30 w-fit">
                    <ShieldCheck className="w-4 h-4 text-acentoOliva" />
                    <span>garantia de 7 dias</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-tintaCarvao/80 font-medium lowercase">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-acentoOliva flex-shrink-0" />
                    <span>acesso imediato</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-acentoOliva flex-shrink-0" />
                    <span>15 min por dia</span>
                  </span>
                </div>
              </div>

              {/* Botões CTA Principais */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={handleEnroll}
                  className="btn-pill-primary text-base sm:text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-3 cursor-pointer lowercase"
                >
                  <span>garantir minha vaga por R$ 77</span>
                  <Pencil className="w-5 h-5 text-white" />
                </button>

                <a
                  href="#video-apresentacao"
                  className="bg-papelClaro text-acentoAzul border border-papelKraft/50 hover:bg-bgPlataforma text-base px-7 py-3.5 rounded-full font-medium transition-all shadow-sm flex items-center gap-2 cursor-pointer lowercase"
                >
                  <span>assista ao vídeo de apresentação</span>
                  <Play className="w-4 h-4 text-acentoTerracota fill-acentoTerracota" />
                </a>
              </div>
            </div>

            {/* Coluna Direita: Scrapbook Bento Card com Arte Retro */}
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
                    src="/brand-assets/elements/collages/png-retro-collages-whit-book-publication-flower-plant.png"
                    alt="21 dias de escrita solta o verbo"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/brand-assets/gallery/events/13062026-IMG_6581-2.jpg';
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <blockquote className="font-editorial text-xl sm:text-2xl text-acentoAzul leading-snug font-bold lowercase">
                    “em 21 dias, você não aprende apenas a escrever: aprende a se ouvir com compaixão.”
                  </blockquote>
                  <p className="text-xs text-tintaCarvao/60 font-mono lowercase pt-2 border-t border-papelKraft/30">
                    método autoral // solta o verbo colectivo
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SEÇÃO VÍDEO DE APRESENTAÇÃO DE YOUTUBE (Com Capa da Galeria) */}
      <section id="video-apresentacao" className="py-16 sm:py-24 bg-papelClaro border-t border-b border-papelKraft/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-bgPlataforma border border-papelKraft/40 text-acentoAzul text-xs sm:text-sm font-semibold uppercase tracking-wider mb-4 shadow-sm">
              <Play className="w-4 h-4 text-acentoTerracota fill-acentoTerracota" />
              <span>mensagem das facilitadoras</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-editorial text-acentoAzul lowercase mb-3">
              assista à apresentação do programa
            </h2>
            <p className="text-tintaCarvao/80 text-base sm:text-lg font-medium lowercase">
              bruna riedel e júlia alvim contam como os 21 dias vão transformar a sua relação com as palavras.
            </p>
          </div>

          {/* Reproductor de Video Estilo Scrapbook con Capa da Galeria */}
          <div className="relative rounded-3xl bg-bgPlataforma p-3 sm:p-6 border border-papelKraft/40 shadow-kraft-lg overflow-hidden group select-none">
            {/* Sticker Fita Washi Superior */}
            <div className="absolute -top-2 left-8 sm:left-12 w-28 sm:w-36 h-7 sm:h-9 pointer-events-none z-30 opacity-90">
              <img
                src="/brand-assets/elements/stickers/fitas-washi-flores-azul.png"
                alt="fita washi"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-papelKraft/40 shadow-inner bg-acentoAzul">
              {!isPlayingVideo ? (
                /* Capa da Galería con Foto 100% Cobertura e Botão Play Centralizado */
                <div
                  onClick={() => setIsPlayingVideo(true)}
                  className="absolute inset-0 cursor-pointer group/thumb w-full h-full"
                >
                  <img
                    src="/brand-assets/gallery/events/13062026-IMG_6581-2.jpg"
                    alt="capa do video 21 dias de escrita"
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover/thumb:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-acentoAzul/85 via-acentoAzul/40 to-acentoAzul/30 transition-opacity duration-300 group-hover/thumb:opacity-90" />

                  {/* Botón Play y Pill Centralizados Absolutos */}
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4 text-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-acentoTerracota text-white flex items-center justify-center shadow-2xl transition-all duration-300 group-hover/thumb:scale-110 group-hover/thumb:bg-acentoTerracota/90 animate-pulse mb-3">
                      <Play className="w-7 h-7 sm:w-9 sm:h-9 lg:w-11 lg:h-11 fill-white translate-x-0.5" />
                    </div>
                    <span className="bg-papelClaro/95 backdrop-blur-sm text-acentoAzul font-editorial font-bold px-5 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-base shadow-lg lowercase border border-papelKraft/50">
                      clique para assistir ao vídeo (3 min)
                    </span>
                  </div>
                </div>
              ) : (
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&rel=0`}
                  title="21 Dias de Escrita - Apresentação"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 4. ENTREGÁVEIS & O QUE ESTÁ INCLUÍDO (Bento Grid) */}
      <section className="py-20 sm:py-28 bg-bgPlataforma">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-papelClaro border border-papelKraft/40 text-acentoAzul text-xs sm:text-sm font-semibold uppercase tracking-wider mb-4 shadow-sm">
              <img
                src="/brand-assets/icons/icone_63.svg"
                alt="icone"
                className="w-5 h-5 object-contain"
              />
              <span>tudo o que você recebe</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-editorial text-acentoAzul lowercase mb-4">
              uma experiência completa para sua jornada de escrita
            </h2>
            <p className="text-tintaCarvao/80 text-base sm:text-lg font-medium lowercase">
              quatro pilares desenhados para acolher o seu ritmo e garantir o seu hábito.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-papelClaro rounded-3xl p-6 sm:p-7 border border-papelKraft/40 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-acentoAzul/40 hover:shadow-md flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-acentoAzul/10 text-acentoAzul flex items-center justify-center mb-5 group-hover:bg-acentoAzul group-hover:text-white transition-all">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-editorial text-acentoAzul lowercase mb-2 group-hover:text-acentoTerracota transition-colors">
                  21 exercícios guiados
                </h3>
                <p className="text-tintaCarvao/80 text-sm sm:text-base leading-relaxed lowercase font-medium">
                  liberados dia a dia na plataforma com comandos poéticos e reflexões práticas para aplicar em 15 minutos.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-papelKraft/30 text-xs font-bold text-acentoAzul opacity-70">
                <span>01 // plataforma própria</span>
              </div>
            </div>

            <div className="bg-papelClaro rounded-3xl p-6 sm:p-7 border border-papelKraft/40 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-acentoAzul/40 hover:shadow-md flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-acentoTerracota/10 text-acentoTerracota flex items-center justify-center mb-5 group-hover:bg-acentoTerracota group-hover:text-white transition-all">
                  <Headphones className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-editorial text-acentoAzul lowercase mb-2 group-hover:text-acentoTerracota transition-colors">
                  pílulas em áudio
                </h3>
                <p className="text-tintaCarvao/80 text-sm sm:text-base leading-relaxed lowercase font-medium">
                  áudios inspiradores conduzidos pelas facilitadoras em formato de podcast interno para ouvir onde e quando quiser.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-papelKraft/30 text-xs font-bold text-acentoAzul opacity-70">
                <span>02 // podcast interno</span>
              </div>
            </div>

            <div className="bg-papelClaro rounded-3xl p-6 sm:p-7 border border-papelKraft/40 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-acentoAzul/40 hover:shadow-md flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-acentoOliva/30 text-tintaCarvao flex items-center justify-center mb-5 group-hover:bg-acentoOliva transition-all">
                  <Flame className="w-6 h-6 text-acentoAzul" />
                </div>
                <h3 className="text-xl font-bold font-editorial text-acentoAzul lowercase mb-2 group-hover:text-acentoTerracota transition-colors">
                  fogueira comunitária
                </h3>
                <p className="text-tintaCarvao/80 text-sm sm:text-base leading-relaxed lowercase font-medium">
                  acesso ilimitado ao espaço seguro de partilha durante todo o desafio para ler e trocar com outras leitoras.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-papelKraft/30 text-xs font-bold text-acentoAzul opacity-70">
                <span>03 // comunidade viva</span>
              </div>
            </div>

            <div className="bg-papelClaro rounded-3xl p-6 sm:p-7 border border-papelKraft/40 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-acentoAzul/40 hover:shadow-md flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-acentoAzul/10 text-acentoAzul flex items-center justify-center mb-5 group-hover:bg-acentoAzul group-hover:text-white transition-all">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-editorial text-acentoAzul lowercase mb-2 group-hover:text-acentoTerracota transition-colors">
                  diário de bordo em pdf
                </h3>
                <p className="text-tintaCarvao/80 text-sm sm:text-base leading-relaxed lowercase font-medium">
                  material gráfico artesanal para baixar, imprimir ou usar digitalmente como guia durante e após os 21 dias.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-papelKraft/30 text-xs font-bold text-acentoAzul opacity-70">
                <span>04 // caderno artesanal</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. A TRILHA DOS 21 DIAS (Experiência Imersiva em Cards Bento com Fotos Reais) */}
      <section id="trilha" className="py-24 sm:py-32 bg-papelClaro border-t border-b border-papelKraft/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-bgPlataforma border border-papelKraft/40 text-acentoAzul text-xs sm:text-sm font-semibold uppercase tracking-wider mb-4 shadow-sm">
              <Clock className="w-4 h-4 text-acentoTerracota" />
              <span>a sua jornada passo a passo</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-editorial text-acentoAzul lowercase mb-4">
              como a mágica acontece em 3 semanas
            </h2>
            <p className="text-tintaCarvao/80 text-base sm:text-lg font-medium lowercase">
              três fases evolutivas desenhadas para transformar a sua relação com as palavras.
            </p>
          </div>

          <div className="space-y-12 max-w-5xl mx-auto">
            {journeyPhases.map((phase, idx) => {
              const isSelected = activePhaseIndex === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setActivePhaseIndex(idx)}
                  className={`rounded-3xl bg-bgPlataforma p-6 sm:p-8 lg:p-10 border transition-all duration-500 shadow-kraft-lg relative overflow-hidden group cursor-pointer ${
                    isSelected ? 'border-acentoTerracota/60 shadow-2xl' : 'border-papelKraft/40 hover:border-papelKraft'
                  }`}
                >
                  <div className="absolute -top-1 left-8 w-28 h-7 pointer-events-none z-20 opacity-85">
                    <img
                      src={phase.washiTape}
                      alt="fita washi"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    <div className="lg:col-span-5 relative">
                      <div className="w-full h-60 sm:h-72 rounded-2xl overflow-hidden border border-papelKraft/40 shadow-sm relative group/img">
                        <img
                          src={phase.image}
                          alt={phase.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-acentoAzul/70 via-transparent to-transparent flex items-end p-4">
                          <span className="font-editorial text-xs font-bold text-papelClaro uppercase tracking-wider bg-acentoAzul/80 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
                            fase 0{idx + 1} // 7 dias
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-7 space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-acentoTerracota text-white font-editorial font-bold text-sm flex items-center justify-center shadow-sm">
                          {phase.number}
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-bold font-editorial text-acentoAzul lowercase">
                          {phase.title}
                        </h3>
                      </div>

                      <p className="font-gesto text-acentoTerracota text-2xl font-normal">
                        {phase.subtitle}
                      </p>

                      <p className="text-tintaCarvao/85 text-base leading-relaxed font-medium lowercase">
                        {phase.description}
                      </p>

                      <div className="inline-flex items-center gap-2.5 text-xs font-semibold text-acentoAzul bg-papelClaro px-4 py-2 rounded-full border border-papelKraft/50 shadow-xs">
                        <Volume2 className="w-4 h-4 text-acentoTerracota animate-pulse" />
                        <span>{phase.audioTeaser}</span>
                      </div>

                      <div className="pt-3 border-t border-papelKraft/30 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {phase.milestones.map((m, mIdx) => (
                          <div
                            key={mIdx}
                            className="p-3 bg-papelClaro rounded-xl border border-papelKraft/40 space-y-1"
                          >
                            <span className="text-[11px] font-bold text-acentoTerracota uppercase tracking-wider block">
                              {m.days}
                            </span>
                            <p className="text-xs text-tintaCarvao/80 font-medium lowercase line-clamp-2">
                              {m.label}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. PARA QUEM É X PARA QUEM NÃO É */}
      <section className="py-20 sm:py-28 bg-bgPlataforma">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-editorial text-acentoAzul lowercase mb-4">
              este programa é para você?
            </h2>
            <p className="text-tintaCarvao/80 text-base sm:text-lg font-medium lowercase">
              transparência e respeito com o seu tempo e investimento.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-papelClaro rounded-3xl p-8 border border-papelKraft/40 shadow-sm space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-acentoOliva/20 text-tintaCarvao text-xs font-bold uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-acentoOliva" />
                <span>este programa É para você se:</span>
              </div>

              <ul className="space-y-4 text-tintaCarvao/85 text-base lowercase font-medium">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-acentoOliva flex-shrink-0 mt-0.5" />
                  <span>deseja destravar a escrita e criar um hábito constante sem cobranças</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-acentoOliva flex-shrink-0 mt-0.5" />
                  <span>busca organizar pensamentos dispersos e aliviar o estresse diário</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-acentoOliva flex-shrink-0 mt-0.5" />
                  <span>quer um espaço seguro para sentir, refletir e ressignificar histórias</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-acentoOliva flex-shrink-0 mt-0.5" />
                  <span>prefere aprender no seu próprio ritmo com apenas 15 minutos por dia</span>
                </li>
              </ul>
            </div>

            <div className="bg-papelClaro rounded-3xl p-8 border border-papelKraft/40 shadow-sm space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-acentoTerracota/10 text-acentoTerracota text-xs font-bold uppercase tracking-wider">
                <XCircle className="w-4 h-4 text-acentoTerracota" />
                <span>NÃO é para você se:</span>
              </div>

              <ul className="space-y-4 text-tintaCarvao/85 text-base lowercase font-medium">
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-acentoTerracota flex-shrink-0 mt-0.5" />
                  <span>procura um curso técnico de gramática acadêmica ou regras rígidas</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-acentoTerracota flex-shrink-0 mt-0.5" />
                  <span>busca fórmulas mágicas de publicação de livros sem dedicação pessoal</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-acentoTerracota flex-shrink-0 mt-0.5" />
                  <span>não está disposta a olhar para dentro com afeto e escuta genuína</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FACILITADORAS DO PROGRAMA */}
      <FoundersSection />

      {/* 8. CARROSSEL DE SCREENSHOTS REAIS DE DEPOIMENTOS (public/brand-assets/deployments) */}
      <section className="py-20 sm:py-28 bg-papelClaro border-t border-b border-papelKraft/40 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-bgPlataforma border border-papelKraft/40 text-acentoAzul text-xs sm:text-sm font-semibold uppercase tracking-wider mb-4 shadow-sm">
              <img
                src="/brand-assets/icons/icone_63.svg"
                alt="icone"
                className="w-5 h-5 object-contain"
              />
              <span>relatos & impressões reais da comunidade</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-editorial text-acentoAzul lowercase mb-4">
              vozes e prints de quem viveu os 21 dias
            </h2>
            <p className="text-tintaCarvao/80 text-base sm:text-lg font-medium lowercase">
              mensagens reais, trocas espontâneas e relatos de transformação compartilhados pelas nossas alunas.
            </p>
          </div>

          {/* Componente de Carrossel de Screenshots */}
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[0, 1, 2].map((offset) => {
                const itemIndex = (carouselIndex + offset) % deploymentScreenshots.length;
                const item = deploymentScreenshots[itemIndex];
                const washiTapeImage =
                  offset % 2 === 0
                    ? '/brand-assets/elements/stickers/fitas-washi-flores-terracota.png'
                    : '/brand-assets/elements/stickers/fitas-washi-flores-azul.png';

                return (
                  <div
                    key={itemIndex}
                    onClick={() => setSelectedScreenshot(item.src)}
                    className="relative bg-bgPlataforma rounded-3xl p-3 sm:p-4 border border-papelKraft/40 shadow-kraft transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl cursor-pointer group select-none"
                  >
                    {/* Sticker Fita Washi */}
                    <div className="absolute -top-3 left-6 w-24 h-6 pointer-events-none z-20 opacity-90">
                      <img
                        src={washiTapeImage}
                        alt="fita washi"
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-papelKraft/30 relative mb-3 bg-white flex items-center justify-center">
                      <img
                        src={item.src}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-acentoAzul/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="bg-papelClaro text-acentoAzul font-bold px-4 py-2 rounded-full text-xs flex items-center gap-2 shadow-lg lowercase">
                          <ZoomIn className="w-4 h-4 text-acentoTerracota" />
                          <span>ampliar depoimento</span>
                        </div>
                      </div>
                    </div>

                    <div className="px-2 text-center">
                      <span className="font-editorial text-sm font-bold text-acentoAzul lowercase">
                        {item.title}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pílulas Indicadoras de Slide */}
            <div className="flex justify-center items-center gap-2 mt-8">
              {deploymentScreenshots.slice(0, 8).map((_, idx) => (
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

      {/* 9. BOX FINAL DE OFERTA & CHECKOUT */}
      <section className="py-24 sm:py-32 bg-bgPlataforma relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-acentoAzul text-white rounded-3xl p-8 sm:p-14 border border-white/20 shadow-kraft-lg text-center space-y-8 relative overflow-hidden">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-acentoOliva text-xs sm:text-sm font-semibold uppercase tracking-wider">
              <span>inscrições abertas com preço promocional</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-editorial text-papelClaro lowercase">
              pronta para soltar o verbo e escrever sua história?
            </h2>

            <p className="text-papelClaro/85 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed font-medium lowercase">
              garanta seu acesso imediato aos 21 dias de exercícios, áudios inspiradores e à fogueira de partilha comunitária.
            </p>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 max-w-lg mx-auto space-y-4">
              <span className="text-xs font-bold text-papelClaro/70 uppercase tracking-wider block">
                investimento único com acesso completo
              </span>

              <div className="flex justify-center items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-bold font-editorial text-white">
                  R$ 77,00
                </span>
                <span className="text-sm text-papelClaro/80 lowercase">
                  à vista (ou 2x R$ 38,50)
                </span>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs font-bold text-acentoOliva pt-2 border-t border-white/15">
                <ShieldCheck className="w-4 h-4 text-acentoOliva" />
                <span>garantia incondicional de 7 dias sem riscos</span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleEnroll}
                className="btn-pill-accent text-lg px-10 py-4 rounded-full shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-3 w-full sm:w-auto lowercase cursor-pointer"
              >
                <span>sim! quero garantir minha vaga agora</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 10. FAQ DO PROGRAMA */}
      <section className="py-20 sm:py-28 bg-papelClaro border-t border-b border-papelKraft/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold font-editorial text-acentoAzul lowercase mb-3">
              perguntas frequentes sobre os 21 dias
            </h2>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, index) => {
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

      {/* 11. PreLoginFooter Poético com Shader WebGL */}
      <PreLoginFooter />
    </div>
  );
}
