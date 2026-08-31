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
  Quote,
  Heart,
  Play,
  Volume2,
  Video,
  Users,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  X,
  Sparkles,
} from 'lucide-react';
import PreLoginNavbar from '../components/PreLoginNavbar';
import PreLoginFooter from '../components/PreLoginFooter';
import FoundersSection from '../components/FoundersSection';

interface LiveStep {
  step: string;
  time: string;
  title: string;
  description: string;
  color: string;
}

const liveStructure: LiveStep[] = [
  {
    step: '01',
    time: '15 minutos',
    title: 'abertura & ritual de presença',
    description: 'acender a vela, desacelerar da correria do dia e preparar o corpo e a mente para acolher as palavras.',
    color: 'bg-acentoAzul/10 text-acentoAzul border-acentoAzul/30',
  },
  {
    step: '02',
    time: '40 minutos',
    title: 'provocação poética & laboratório em tempo real',
    description: 'bruna e júlia trazem o tema central do ciclo e conduzem um exercício prático de escrita ao vivo.',
    color: 'bg-acentoTerracota/10 text-acentoTerracota border-acentoTerracota/30',
  },
  {
    step: '03',
    time: '35 minutos',
    title: 'fogueira de leitura & partilha afetiva',
    description: 'espaço voluntário e acolhedor para ler os textos produzidos no encontro e receber escuta atenta.',
    color: 'bg-acentoOliva/20 text-tintaCarvao border-acentoOliva/40',
  },
];

const deploymentScreenshots = [
  { src: '/brand-assets/deployments/IMG_2864.jpg', title: 'troca viva nos encontros' },
  { src: '/brand-assets/deployments/IMG_2865.jpg', title: 'escrita como refúgio' },
  { src: '/brand-assets/deployments/IMG_2867.jpg', title: 'transformação constante' },
  { src: '/brand-assets/deployments/IMG_2868.jpg', title: 'acolhimento comunitário' },
  { src: '/brand-assets/deployments/IMG_2870.jpg', title: 'vozes da fogueira ao vivo' },
  { src: '/brand-assets/deployments/IMG_2877.jpg', title: 'carinho das facilitadoras' },
  { src: '/brand-assets/deployments/IMG_2878.jpg', title: 'potência da partilha' },
  { src: '/brand-assets/deployments/IMG_8065.PNG', title: 'depoimento de aluna' },
  { src: '/brand-assets/deployments/IMG_8066.PNG', title: 'mensagens da comunidade' },
  { src: '/brand-assets/deployments/IMG_8067.PNG', title: 'experiência do ciclo' },
  { src: '/brand-assets/deployments/IMG_8068.PNG', title: 'conexões autênticas' },
  { src: '/brand-assets/deployments/IMG_8069.PNG', title: 'ritmo de escrita' },
  { src: '/brand-assets/deployments/IMG_8151.PNG', title: 'cadernos em movimento' },
  { src: '/brand-assets/deployments/IMG_8846.PNG', title: 'vínculos de afeto' },
  { src: '/brand-assets/deployments/IMG_8850.PNG', title: 'gratidão no ciclo' },
];

const faqItems = [
  {
    q: 'quando acontecem os encontros ao vivo?',
    a: 'os encontros acontecem quinzenalmente via zoom, geralmente às terças ou quintas-feiras no período da noite (19h30 às 21h). a agenda completa é enviada com antecedência.',
  },
  {
    q: 'e se eu não puder participar ao vivo de algum encontro?',
    a: 'sem problemas! todos os encontros são gravados na íntegra e disponibilizados na sua área de membros em até 24 horas, junto com os cadernos de apoio em pdf.',
  },
  {
    q: 'sou obrigada a ler meus textos nos encontros ao vivo?',
    a: 'de forma alguma! a leitura e a partilha na fogueira são 100% voluntárias. você pode participar apenas ouvindo, escrevendo e sentindo a energia do grupo.',
  },
  {
    q: 'como funciona o cancelamento e a garantia?',
    a: 'você conta com 7 dias de garantia incondicional. se dentro desse período você sentir que o ciclo não é para você, basta solicitar e devolvemos 100% do seu investimento.',
  },
];

export default function ProgramaCiclo() {
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
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
    localStorage.setItem('checkout_intent', 'ciclo');
    navigate('/register?product=ciclo');
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

      {/* 2. HERO SECTION DE VENDAS DO CICLO (High Conversion Hero) */}
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
                <span>mentoria ao vivo & comunidade viva</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-editorial text-acentoAzul lowercase leading-[1.1] tracking-tight">
                ciclo de aprofundamento: <br className="hidden sm:inline" />
                <span className="font-gesto text-acentoTerracota font-normal text-5xl sm:text-6xl lg:text-7xl block mt-1">
                  onde a escrita ganha laços e maturidade.
                </span>
              </h1>

              <p className="text-tintaCarvao/85 text-lg sm:text-xl leading-relaxed max-w-2xl font-medium lowercase">
                encontros quinzenais ao vivo no zoom, mentorias com bruna riedel e júlia alvim, fogueira comunitária ativa e acervo completo de gravações para sustentar sua voz o ano todo.
              </p>

              {/* Destaque de Preço & Garantia */}
              <div className="p-5 bg-papelClaro rounded-2xl border border-papelKraft/50 shadow-sm max-w-xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-papelKraft/30">
                  <div>
                    <span className="text-[11px] font-bold text-tintaCarvao/60 uppercase tracking-wider block">
                      investimento no ciclo
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl sm:text-4xl font-bold font-editorial text-acentoAzul">
                        R$ 297,00
                      </span>
                      <span className="text-xs sm:text-sm text-tintaCarvao/70 lowercase font-medium">
                        à vista (ou 3x R$ 99,00)
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
                    <span>encontros ao vivo quinzenais</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-acentoOliva flex-shrink-0" />
                    <span>acervo completo gravado</span>
                  </span>
                </div>
              </div>

              {/* Botões CTA Principais */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={handleEnroll}
                  className="btn-pill-primary text-base sm:text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-3 cursor-pointer lowercase"
                >
                  <span>garantir minha vaga no ciclo — R$ 297</span>
                  <Pencil className="w-5 h-5 text-white" />
                </button>

                <a
                  href="#video-apresentacao"
                  className="bg-papelClaro text-acentoAzul border border-papelKraft/50 hover:bg-bgPlataforma text-base px-7 py-3.5 rounded-full font-medium transition-all shadow-sm flex items-center gap-2 cursor-pointer lowercase"
                >
                  <span>ver vídeo das facilitadoras</span>
                  <Play className="w-4 h-4 text-acentoTerracota fill-acentoTerracota" />
                </a>
              </div>
            </div>

            {/* Coluna Direita: Scrapbook Card da Comunidade */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl bg-papelClaro p-6 sm:p-8 border border-papelKraft/40 shadow-kraft-lg overflow-hidden group">
                {/* Sticker Fita Washi */}
                <div className="absolute -top-2 right-8 w-28 h-7 pointer-events-none z-20 opacity-90">
                  <img
                    src="/brand-assets/elements/stickers/fitas-washi-flores-azul.png"
                    alt="fita washi"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="w-full h-64 sm:h-72 rounded-2xl overflow-hidden border border-papelKraft/40 shadow-sm relative mb-5">
                  <img
                    src="/brand-assets/gallery/events/13062026-IMG_5364-2.jpg"
                    alt="ciclo de aprofundamento solta o verbo"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                <div className="space-y-2">
                  <blockquote className="font-editorial text-xl sm:text-2xl text-acentoAzul leading-snug font-bold lowercase">
                    “no ciclo, a escrita deixa de ser um ato solitário para se tornar uma rede de escuta e afeto.”
                  </blockquote>
                  <p className="text-xs text-tintaCarvao/60 font-mono lowercase pt-2 border-t border-papelKraft/30">
                    mentoria ao vivo // solta o verbo colectivo
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SEÇÃO VÍDEO DE APRESENTAÇÃO DO CICLO */}
      <section id="video-apresentacao" className="py-16 sm:py-24 bg-papelClaro border-t border-b border-papelKraft/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-bgPlataforma border border-papelKraft/40 text-acentoAzul text-xs sm:text-sm font-semibold uppercase tracking-wider mb-4 shadow-sm">
              <Play className="w-4 h-4 text-acentoTerracota fill-acentoTerracota" />
              <span>mensagem das facilitadoras</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-editorial text-acentoAzul lowercase mb-3">
              como funciona a mentoria no ciclo
            </h2>
            <p className="text-tintaCarvao/80 text-base sm:text-lg font-medium lowercase">
              bruna e júlia explicam a dinâmica dos encontros ao vivo, laboratórios e fogueira de partilha.
            </p>
          </div>

          <div className="relative rounded-3xl bg-bgPlataforma p-3 sm:p-6 border border-papelKraft/40 shadow-kraft-lg overflow-hidden group select-none">
            <div className="absolute -top-2 left-8 sm:left-12 w-28 sm:w-36 h-7 sm:h-9 pointer-events-none z-30 opacity-90">
              <img
                src="/brand-assets/elements/stickers/fitas-washi-flores-terracota.png"
                alt="fita washi"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-papelKraft/40 shadow-inner bg-acentoAzul">
              {!isPlayingVideo ? (
                <div
                  onClick={() => setIsPlayingVideo(true)}
                  className="absolute inset-0 cursor-pointer group/thumb w-full h-full"
                >
                  <img
                    src="/brand-assets/gallery/events/13062026-IMG_5364-2.jpg"
                    alt="capa do video ciclo de aprofundamento"
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover/thumb:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-acentoAzul/85 via-acentoAzul/40 to-acentoAzul/30 transition-opacity duration-300 group-hover/thumb:opacity-90" />

                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4 text-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-acentoTerracota text-white flex items-center justify-center shadow-2xl transition-all duration-300 group-hover/thumb:scale-110 group-hover/thumb:bg-acentoTerracota/90 animate-pulse mb-3">
                      <Play className="w-7 h-7 sm:w-9 sm:h-9 lg:w-11 lg:h-11 fill-white translate-x-0.5" />
                    </div>
                    <span className="bg-papelClaro/95 backdrop-blur-sm text-acentoAzul font-editorial font-bold px-5 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-base shadow-lg lowercase border border-papelKraft/50">
                      clique para assistir à apresentação (3 min)
                    </span>
                  </div>
                </div>
              ) : (
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&rel=0`}
                  title="Ciclo de Aprofundamento - Apresentação"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 4. OS 4 PILARES DA MENTORIA (Bento Grid) */}
      <section className="py-20 sm:py-28 bg-bgPlataforma">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-papelClaro border border-papelKraft/40 text-acentoAzul text-xs sm:text-sm font-semibold uppercase tracking-wider mb-4 shadow-sm">
              <img
                src="/brand-assets/icons/icone_63.svg"
                alt="icone"
                className="w-5 h-5 object-contain"
              />
              <span>estrutura da mentoria</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-editorial text-acentoAzul lowercase mb-4">
              o que faz do ciclo uma jornada transformadora
            </h2>
            <p className="text-tintaCarvao/80 text-base sm:text-lg font-medium lowercase">
              quatro pilares desenhados para dar profundidade, constância e apoio ao seu processo de escrita.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Bento Card 1 */}
            <div className="bg-papelClaro rounded-3xl p-6 sm:p-7 border border-papelKraft/40 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-acentoAzul/40 hover:shadow-md flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-acentoAzul/10 text-acentoAzul flex items-center justify-center mb-5 group-hover:bg-acentoAzul group-hover:text-white transition-all">
                  <Video className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-editorial text-acentoAzul lowercase mb-2 group-hover:text-acentoTerracota transition-colors">
                  encontros ao vivo no zoom
                </h3>
                <p className="text-tintaCarvao/80 text-sm sm:text-base leading-relaxed lowercase font-medium">
                  mentorias quinzenais com exercícios guiados em tempo real, partilhas e orientações de bruna e júlia.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-papelKraft/30 text-xs font-bold text-acentoAzul opacity-70">
                <span>01 // mentoria ao vivo</span>
              </div>
            </div>

            {/* Bento Card 2 */}
            <div className="bg-papelClaro rounded-3xl p-6 sm:p-7 border border-papelKraft/40 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-acentoAzul/40 hover:shadow-md flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-acentoTerracota/10 text-acentoTerracota flex items-center justify-center mb-5 group-hover:bg-acentoTerracota group-hover:text-white transition-all">
                  <Flame className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-editorial text-acentoAzul lowercase mb-2 group-hover:text-acentoTerracota transition-colors">
                  fogueira comunitária viva
                </h3>
                <p className="text-tintaCarvao/80 text-sm sm:text-base leading-relaxed lowercase font-medium">
                  espaço exclusivo e acolhedor para publicar seus textos, ler colegas e receber retorno afetivo.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-papelKraft/30 text-xs font-bold text-acentoAzul opacity-70">
                <span>02 // comunidade 365 dias</span>
              </div>
            </div>

            {/* Bento Card 3 */}
            <div className="bg-papelClaro rounded-3xl p-6 sm:p-7 border border-papelKraft/40 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-acentoAzul/40 hover:shadow-md flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-acentoOliva/30 text-tintaCarvao flex items-center justify-center mb-5 group-hover:bg-acentoOliva transition-all">
                  <BookOpen className="w-6 h-6 text-acentoAzul" />
                </div>
                <h3 className="text-xl font-bold font-editorial text-acentoAzul lowercase mb-2 group-hover:text-acentoTerracota transition-colors">
                  acervo completo de aulas
                </h3>
                <p className="text-tintaCarvao/80 text-sm sm:text-base leading-relaxed lowercase font-medium">
                  acesso ilimitado às gravações de todas as mentorias anteriores e materiais de estudo.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-papelKraft/30 text-xs font-bold text-acentoAzul opacity-70">
                <span>03 // biblioteca digital</span>
              </div>
            </div>

            {/* Bento Card 4 */}
            <div className="bg-papelClaro rounded-3xl p-6 sm:p-7 border border-papelKraft/40 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-acentoAzul/40 hover:shadow-md flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-acentoAzul/10 text-acentoAzul flex items-center justify-center mb-5 group-hover:bg-acentoAzul group-hover:text-white transition-all">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-editorial text-acentoAzul lowercase mb-2 group-hover:text-acentoTerracota transition-colors">
                  cadernos poéticos em pdf
                </h3>
                <p className="text-tintaCarvao/80 text-sm sm:text-base leading-relaxed lowercase font-medium">
                  materiais de apoio artesanais preparados exclusivamente para cada ciclo temático de escrita.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-papelKraft/30 text-xs font-bold text-acentoAzul opacity-70">
                <span>04 // cadernos exclusivos</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. A ESTRUTURA DOS ENCONTROS AO VIVO (Duração de 1h30 em 3 Etapas) */}
      <section className="py-24 sm:py-32 bg-papelClaro border-t border-b border-papelKraft/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-bgPlataforma border border-papelKraft/40 text-acentoAzul text-xs sm:text-sm font-semibold uppercase tracking-wider mb-4 shadow-sm">
              <Clock className="w-4 h-4 text-acentoTerracota" />
              <span>dinâmica dos encontros no zoom</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-editorial text-acentoAzul lowercase mb-4">
              como funciona um encontro quinzenal (1h30)
            </h2>
            <p className="text-tintaCarvao/80 text-base sm:text-lg font-medium lowercase">
              uma estrutura pensada para conduzir você da agitação diária à entrega poética.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {liveStructure.map((item, idx) => (
              <div
                key={idx}
                className="bg-bgPlataforma rounded-3xl p-7 border border-papelKraft/40 shadow-kraft flex flex-col justify-between space-y-4 hover:-translate-y-1 transition-transform"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-editorial text-3xl font-bold text-acentoTerracota">
                      {item.step}
                    </span>
                    <span className="text-xs font-bold text-acentoAzul bg-papelClaro px-3 py-1 rounded-full border border-papelKraft/40 lowercase">
                      {item.time}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold font-editorial text-acentoAzul lowercase">
                    {item.title}
                  </h3>

                  <p className="text-tintaCarvao/85 text-sm sm:text-base leading-relaxed font-medium lowercase">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-papelKraft/30 flex items-center gap-2 text-xs font-bold text-acentoAzul/70">
                  <CheckCircle2 className="w-4 h-4 text-acentoOliva" />
                  <span>etapa 0{idx + 1} da mentoria</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. PARA QUEM É X PARA QUEM NÃO É */}
      <section className="py-20 sm:py-28 bg-bgPlataforma">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-editorial text-acentoAzul lowercase mb-4">
              o ciclo de aprofundamento é para você?
            </h2>
            <p className="text-tintaCarvao/80 text-base sm:text-lg font-medium lowercase">
              transparência e clareza sobre o perfil do grupo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* SIM / PARA QUEM É */}
            <div className="bg-papelClaro rounded-3xl p-8 border border-papelKraft/40 shadow-sm space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-acentoOliva/20 text-tintaCarvao text-xs font-bold uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-acentoOliva" />
                <span>o ciclo É para você se:</span>
              </div>

              <ul className="space-y-4 text-tintaCarvao/85 text-base lowercase font-medium">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-acentoOliva flex-shrink-0 mt-0.5" />
                  <span>deseja praticar a escrita acompanhada ao vivo de forma contínua</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-acentoOliva flex-shrink-0 mt-0.5" />
                  <span>busca pertencer a uma comunidade viva sem algoritmos ou julgamentos</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-acentoOliva flex-shrink-0 mt-0.5" />
                  <span>quer aprofundar sua voz autoral e aprender com os feedbacks das mentores</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-acentoOliva flex-shrink-0 mt-0.5" />
                  <span>valoriza trocas afetivas e a presença em grupo</span>
                </li>
              </ul>
            </div>

            {/* NÃO / PARA QUEM NÃO É */}
            <div className="bg-papelClaro rounded-3xl p-8 border border-papelKraft/40 shadow-sm space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-acentoTerracota/10 text-acentoTerracota text-xs font-bold uppercase tracking-wider">
                <XCircle className="w-4 h-4 text-acentoTerracota" />
                <span>NÃO é para você se:</span>
              </div>

              <ul className="space-y-4 text-tintaCarvao/85 text-base lowercase font-medium">
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-acentoTerracota flex-shrink-0 mt-0.5" />
                  <span>procura apenas um curso gravado passivo sem qualquer interação humana</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-acentoTerracota flex-shrink-0 mt-0.5" />
                  <span>busca técnicas rígidas de redação comercial ou copywriting publicitário</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-acentoTerracota flex-shrink-0 mt-0.5" />
                  <span>não deseja se conectar com o sentir ou com o processo criativo autoral</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FACILITADORAS DO PROGRAMA */}
      <FoundersSection />

      {/* 8. CARROSSEL DE SCREENSHOTS REAIS DE ALUNAS DO CICLO */}
      <section className="py-20 sm:py-28 bg-papelClaro border-t border-b border-papelKraft/40 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-bgPlataforma border border-papelKraft/40 text-acentoAzul text-xs sm:text-sm font-semibold uppercase tracking-wider mb-4 shadow-sm">
              <img
                src="/brand-assets/icons/icone_63.svg"
                alt="icone"
                className="w-5 h-5 object-contain"
              />
              <span>relatos & trocas reais do ciclo</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-editorial text-acentoAzul lowercase mb-4">
              vozes e prints das nossas alunas
            </h2>
            <p className="text-tintaCarvao/80 text-base sm:text-lg font-medium lowercase">
              depoimentos espontâneos das mentorias ao vivo e trocas na fogueira comunitária.
            </p>
          </div>

          <div
            className="relative max-w-5xl mx-auto"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
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

      {/* 9. BOX FINAL DE OFERTA & CHECKOUT DO CICLO */}
      <section className="py-24 sm:py-32 bg-bgPlataforma relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-acentoAzul text-white rounded-3xl p-8 sm:p-14 border border-white/20 shadow-kraft-lg text-center space-y-8 relative overflow-hidden">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-acentoOliva text-xs sm:text-sm font-semibold uppercase tracking-wider">
              <span>vagas abertas para o novo ciclo</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-editorial text-papelClaro lowercase">
              pronta para aprofundar sua escrita em comunidade?
            </h2>

            <p className="text-papelClaro/85 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed font-medium lowercase">
              garanta sua vaga no ciclo de aprofundamento e tenha acesso aos encontros ao vivo, fogueira diária e acervo de gravações.
            </p>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 max-w-lg mx-auto space-y-4">
              <span className="text-xs font-bold text-papelClaro/70 uppercase tracking-wider block">
                investimento no ciclo completo
              </span>

              <div className="flex justify-center items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-bold font-editorial text-white">
                  R$ 297,00
                </span>
                <span className="text-sm text-papelClaro/80 lowercase">
                  à vista (ou 3x R$ 99,00)
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
                <span>sim! quero garantir minha vaga no ciclo</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 10. FAQ DO CICLO */}
      <section className="py-20 sm:py-28 bg-papelClaro border-t border-b border-papelKraft/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold font-editorial text-acentoAzul lowercase mb-3">
              perguntas frequentes sobre o ciclo
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
