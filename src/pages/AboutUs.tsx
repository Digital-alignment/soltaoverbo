import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useScroll } from 'framer-motion';
import { Heart, Users, Pencil, ArrowRight, CheckCircle2, BookOpen, Compass } from 'lucide-react';
import PreLoginNavbar from '../components/PreLoginNavbar';
import PreLoginFooter from '../components/PreLoginFooter';
import FoundersSection from '../components/FoundersSection';
import { FullPageScrollStroke } from '../components/ui/svg-follow-scroll';

interface EventPhoto {
  image: string;
  title: string;
  subtitle: string;
  washiTape: string;
}

const eventGallery: EventPhoto[] = [
  {
    image: '/brand-assets/gallery/events/13062026-IMG_6581-2.jpg',
    title: 'oficinas presenciais',
    subtitle: 'vivências de escrita consciente & integração',
    washiTape: '/brand-assets/elements/stickers/fitas-washi-flores-terracota.png',
  },
  {
    image: '/brand-assets/gallery/events/13062026-IMG_5364-2.jpg',
    title: 'rodas de partilha',
    subtitle: 'cadernos abertos, diálogos profundos e escuta',
    washiTape: '/brand-assets/elements/stickers/fitas-washi-flores-azul.png',
  },
  {
    image: '/brand-assets/gallery/events/13062026-IMG_6666-2.jpg',
    title: 'experiências sob medida',
    subtitle: 'encontros para retiros, festivais e coletivos',
    washiTape: '/brand-assets/elements/stickers/fitas-washi-realistica-azul.png',
  },
  {
    image: '/brand-assets/gallery/events/_MG_0015.jpg',
    title: 'curadoria de ambiente',
    subtitle: 'espaço seguro para acolher histórias humanas',
    washiTape: '/brand-assets/elements/stickers/fitas-washi-flores-terracota.png',
  },
  {
    image: '/brand-assets/gallery/events/_MG_9849.jpg',
    title: 'conexões autênticas',
    subtitle: 'transformando a rotina através da poesia',
    washiTape: '/brand-assets/elements/stickers/fitas-washi-flores-azul.png',
  },
  {
    image: '/brand-assets/gallery/events/_MG_9991.jpg',
    title: 'rituais de presença',
    subtitle: 'reescrevendo narrativas em comunidade',
    washiTape: '/brand-assets/elements/stickers/fitas-washi-realistica-azul.png',
  },
];

export default function AboutUs() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<EventPhoto | null>(null);

  const { scrollYProgress } = useScroll({
    target: pageRef,
    offset: ['start start', 'end end'],
  });

  const pillars = [
    {
      icon: Heart,
      title: 'encontros reais',
      description: 'onde cada pessoa pode chegar como está. conversas que abrem espaço para o que realmente importa, sem máscaras ou julgamento.',
    },
    {
      icon: Users,
      title: 'vínculos & proteção',
      description: 'rituais que fortalecem a confiança e criam uma rede de apoio genuína contra a solidão e o isolamento dos tempos atuais.',
    },
    {
      icon: Pencil,
      title: 'expressão & autoria',
      description: 'exercícios guiados que colocam o sentir em movimento, dando forma poética às emoções e organizando o caos interno.',
    },
    {
      icon: Compass,
      title: 'potência criativa',
      description: 'transformar padrões limitantes e narrativas herdadas em força de vida e liberdade de escolha.',
    },
  ];

  return (
    <div ref={pageRef} className="min-h-screen bg-bgPlataforma text-tintaCarvao selection:bg-acentoTerracota/20 selection:text-acentoAzul relative overflow-x-clip">
      {/* 1. Header Navbar Sticky */}
      <PreLoginNavbar />

      {/* SVG Stroke Animado que Recorre TODA a Página de 0% a 100% */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden opacity-75">
        <FullPageScrollStroke
          scrollYProgress={scrollYProgress}
          color="#FF6B35"
          strokeWidth={18}
        />
      </div>

      {/* 2. HERO SECTION SOBRE NÓS */}
      <section className="relative pt-12 pb-16 sm:pt-16 sm:pb-24 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Coluna Esquerda: Texto de Manifesto */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-papelClaro border border-papelKraft/40 text-acentoAzul text-xs sm:text-sm font-semibold lowercase tracking-wider shadow-sm">
                <img
                  src="/brand-assets/icons/icone_63.svg"
                  alt="chama viva"
                  className="w-5 h-5 object-contain"
                />
                <span>nossa essência & manifesto</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-editorial text-acentoAzul lowercase leading-[1.1] tracking-tight">
                solta o verbo: <br className="hidden sm:inline" />
                <span className="font-gesto text-acentoTerracota font-normal text-5xl sm:text-6xl lg:text-7xl block mt-1">
                  uma comunidade viva
                </span>{' '}
                onde a expressão transforma realidades.
              </h1>

              <p className="text-tintaCarvao/85 text-lg sm:text-xl leading-relaxed max-w-2xl font-medium lowercase">
                a escrita é nosso eixo central — mas o encontro, a escuta e a criação coletiva sustentam toda a nossa jornada. um convite para desacelerar, cultivar presença e dar forma ao que vive dentro.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href="#criadoras"
                  className="btn-pill-primary text-base sm:text-lg px-8 py-3.5 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2.5"
                >
                  <span>conhecer as facilitadoras</span>
                  <ArrowRight className="w-5 h-5 text-white" />
                </a>

                <a
                  href="#galeria"
                  className="bg-papelClaro text-acentoAzul border border-papelKraft/50 hover:bg-bgPlataforma text-base sm:text-lg px-8 py-3.5 rounded-full font-medium transition-all shadow-sm flex items-center gap-2.5 cursor-pointer lowercase"
                >
                  <span>ver galeria de encontros</span>
                  <BookOpen className="w-5 h-5 text-acentoAzul" />
                </a>
              </div>
            </div>

            {/* Coluna Direita: Card Scrapbook Hero */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl bg-papelClaro p-6 sm:p-7 border border-papelKraft/40 shadow-kraft-lg overflow-hidden group">
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
                    src="/whatsapp_image_2025-12-11_at_3.24.18_pm.jpeg"
                    alt="solta o verbo vivencia"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                <blockquote className="font-editorial text-xl sm:text-2xl text-acentoAzul leading-snug font-bold lowercase">
                  “escrever é um ato de coragem para dizer ao mundo: eu existo e minha história tem valor.”
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. A ARTE DE VIVER MELHOR & NOSSOS PILARES (Versão Compacta & Elegante) */}
      <section className="py-16 sm:py-20 bg-papelClaro/90 border-t border-b border-papelKraft/40 relative z-10 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-bgPlataforma border border-papelKraft/40 text-acentoAzul text-xs sm:text-sm font-semibold lowercase tracking-wider mb-4 shadow-sm">
              <img
                src="/brand-assets/icons/icone_63.svg"
                alt="chama viva"
                className="w-5 h-5 object-contain"
              />
              <span>a arte de viver melhor</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-editorial text-acentoAzul lowercase mb-3">
              o que nos move todos os dias
            </h2>
            <p className="text-tintaCarvao/80 text-base sm:text-lg font-medium lowercase">
              nós criamos espaços seguros para que cada pessoa exerça sua voz, cultive hábitos de expressão e transforme padrões limitantes em potência criativa.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {pillars.map(({ icon: Icon, title, description }, idx) => (
              <div
                key={idx}
                className="bg-bgPlataforma/80 backdrop-blur-sm rounded-2xl p-5 border border-papelKraft/40 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-acentoAzul/40 hover:shadow-md group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3.5">
                    <div className="w-10 h-10 rounded-xl bg-acentoAzul/10 text-acentoAzul flex items-center justify-center group-hover:bg-acentoAzul group-hover:text-white transition-all">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-editorial text-sm font-bold text-tintaCarvao/40">
                      0{idx + 1}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold font-editorial text-acentoAzul lowercase mb-2 group-hover:text-acentoTerracota transition-colors">
                    {title}
                  </h3>
                  <p className="text-tintaCarvao/80 text-xs sm:text-sm leading-relaxed lowercase font-medium">
                    {description}
                  </p>
                </div>

                <div className="pt-3 mt-4 border-t border-papelKraft/30 flex items-center justify-between text-[11px] font-bold text-acentoAzul/70">
                  <span>pilar 0{idx + 1}</span>
                  <span className="w-2 h-2 rounded-full bg-acentoOliva shadow-sm" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. AS CRIADORAS & FACILITADORAS (Bruna Riedel & Júlia Alvim) */}
      <div id="criadoras" className="relative z-10">
        <FoundersSection />
      </div>

      {/* 5. GALERIA DE ENCONTROS & VIVÊNCIAS (Scrapbook Grid) */}
      <section id="galeria" className="py-20 sm:py-28 bg-papelClaro/90 border-t border-b border-papelKraft/40 relative z-10 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-bgPlataforma border border-papelKraft/40 text-acentoAzul text-xs sm:text-sm font-semibold lowercase tracking-wider mb-4 shadow-sm">
              <img
                src="/brand-assets/icons/icone_63.svg"
                alt="galeria"
                className="w-5 h-5 object-contain"
              />
              <span>diário visual de encontros</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-editorial text-acentoAzul lowercase mb-4">
              nossas vivências em imagens
            </h2>
            <p className="text-tintaCarvao/80 text-base sm:text-lg font-medium lowercase">
              registros das nossas rodas de escrita, oficinas presenciais, retiros e momentos de partilha no brasil e no mundo.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {eventGallery.map((photo, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedPhoto(photo)}
                className="relative bg-bgPlataforma/90 backdrop-blur-sm rounded-3xl p-4 border border-papelKraft/40 shadow-kraft transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl cursor-pointer group select-none"
              >
                {/* Sticker Fita Washi */}
                <div className="absolute -top-3 left-6 w-24 h-6 pointer-events-none z-20 opacity-90">
                  <img
                    src={photo.washiTape}
                    alt="fita washi"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="w-full h-56 rounded-2xl overflow-hidden border border-papelKraft/30 relative mb-4">
                  <img
                    src={photo.image}
                    alt={photo.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                <div className="px-2 space-y-1">
                  <h3 className="font-editorial text-xl font-bold text-acentoAzul lowercase">
                    {photo.title}
                  </h3>
                  <p className="text-xs text-tintaCarvao/70 font-medium lowercase">
                    {photo.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal de Foto Ampliada */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-acentoAzul/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="bg-papelClaro rounded-3xl p-6 sm:p-8 border border-papelKraft/60 shadow-2xl max-w-3xl w-full relative animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-papelKraft/40 mb-6">
              <img
                src={selectedPhoto.image}
                alt={selectedPhoto.title}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-acentoAzul lowercase mb-2">
              {selectedPhoto.title}
            </h3>
            <p className="text-tintaCarvao/80 text-base font-medium lowercase mb-6">
              {selectedPhoto.subtitle}
            </p>
            <button
              onClick={() => setSelectedPhoto(null)}
              className="btn-pill-primary w-full py-3 rounded-full text-center text-sm font-semibold lowercase"
            >
              fechar visualização
            </button>
          </div>
        </div>
      )}

      {/* 6. PLATAFORMA DIGITAL & ÁREA DE MEMBROS */}
      <section className="py-20 sm:py-28 bg-bgPlataforma relative overflow-hidden z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-acentoAzul text-white rounded-3xl p-8 sm:p-12 lg:p-16 border border-white/20 shadow-kraft-lg relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-acentoOliva text-xs font-semibold lowercase tracking-wider">
                  <span>o nosso ecossistema digital</span>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-editorial text-papelClaro lowercase leading-tight">
                  um ambiente livre de algoritmos e distrações
                </h2>

                <p className="text-papelClaro/85 text-base sm:text-lg leading-relaxed lowercase font-medium">
                  nossa plataforma foi desenhada para que você possa publicar textos, interagir com leitoras apaixonadas por palavras e manter um diário de bordo digital com privacidade e respeito.
                </p>

                <ul className="space-y-3 text-papelClaro/90 font-medium text-base lowercase">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-acentoOliva flex-shrink-0" />
                    <span>editor limpo e focado no essencial da escrita</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-acentoOliva flex-shrink-0" />
                    <span>acesso à fogueira de partilha comunitária diária</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-acentoOliva flex-shrink-0" />
                    <span>mentoria quinzenal ao vivo e acervo completo gravado</span>
                  </li>
                </ul>

                <div className="pt-4 flex items-center gap-4">
                  <Link
                    to="/register"
                    className="btn-pill-accent text-base px-8 py-3.5 rounded-full shadow-lg hover:scale-105 transition-all flex items-center gap-2.5 lowercase"
                  >
                    <span>criar minha conta gratuita</span>
                    <Pencil className="w-5 h-5" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-papelClaro p-2">
                  <img
                    src="/whatsapp_image_2025-12-11_at_4.25.25_pm.jpeg"
                    alt="plataforma solta o verbo"
                    className="w-full h-auto rounded-xl object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. PreLoginFooter Poético com WebGL Shader */}
      <PreLoginFooter />
    </div>
  );
}
