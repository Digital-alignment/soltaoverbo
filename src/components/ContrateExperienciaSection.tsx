import { useState, useEffect } from 'react';
import { MessageCircle, Building2, Users2, Compass, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { BRAND_ASSETS } from '../config/brandAssets';

interface GallerySlide {
  image: string;
  title: string;
  subtitle: string;
}

const eventSlides: GallerySlide[] = [
  {
    image: '/brand-assets/gallery/events/13062026-IMG_6581-2.jpg',
    title: 'oficinas presenciais',
    subtitle: 'vivências de escrita consciente & integração de equipes',
  },
  {
    image: '/brand-assets/gallery/events/13062026-IMG_5364-2.jpg',
    title: 'rodas de partilha',
    subtitle: 'cadernos abertos, diálogos profundos e presença',
  },
  {
    image: '/brand-assets/gallery/events/13062026-IMG_6666-2.jpg',
    title: 'experiências sob medida',
    subtitle: 'encontros intimistas para retiros, festivais e marcas',
  },
  {
    image: '/brand-assets/gallery/events/_MG_0015.jpg',
    title: 'curadoria de ambiente',
    subtitle: 'espaço seguro para acolher histórias e alinhar propósitos',
  },
  {
    image: '/brand-assets/gallery/events/_MG_9849.jpg',
    title: 'conexões humanas',
    subtitle: 'transformando a rotina através da disciplina poética',
  },
];

export default function ContrateExperienciaSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play do carrossel a cada 4.5 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % eventSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % eventSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + eventSlides.length) % eventSlides.length);
  };

  const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(
    'olá! gostaria de saber mais sobre como contratar uma experiência ou oficina do solta o verbo para nossa empresa/evento.'
  )}`;

  const highlights = [
    {
      icon: Building2,
      badge: 'empresas & corporativo',
      title: 'oficinas corporativas',
      description: 'workshops de escrita consciente para aliviar o estresse, integrar equipes e estimular a comunicação autêntica no trabalho.',
    },
    {
      icon: Users2,
      badge: 'coletivos & retiros',
      title: 'rodas de escrita para coletivos',
      description: 'encontros presenciais ou virtuais sob medida para festivais, comunidades, retiros e grupos de reflexão.',
    },
    {
      icon: Compass,
      badge: 'marcas & curadoria',
      title: 'curadoria narrativa personalizada',
      description: 'criação de cadernos artesanais, temas exclusivos e dinâmicas guiadas pensadas para o propósito da sua marca.',
    },
  ];

  return (
    <section id="experiencias" className="py-20 sm:py-28 bg-bgPlataforma relative overflow-hidden">
      {/* Elemento de Marca d'Água de Fundo */}
      <div className="absolute -right-20 -bottom-20 opacity-5 pointer-events-none select-none">
        <img
          src={BRAND_ASSETS.logos.icon}
          alt="watermark"
          className="w-96 h-96 object-contain"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-papelClaro rounded-3xl p-6 sm:p-10 lg:p-14 border border-papelKraft/60 shadow-kraft-lg space-y-12">
          {/* Header e Layout Dividido com o Carrossel Animado */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Texto de Apresentação */}
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-bgPlataforma border border-papelKraft/60 text-acentoAzul text-xs sm:text-sm font-semibold lowercase tracking-wider shadow-sm">
                <img
                  src="/brand-assets/icons/icone_63.svg"
                  alt="chama viva"
                  className="w-5 h-5 object-contain"
                />
                <span>para marcas, empresas e eventos</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-editorial text-acentoAzul lowercase leading-tight">
                contrate uma experiência solta o verbo
              </h2>

              <p className="text-tintaCarvao/85 text-base sm:text-lg leading-relaxed font-medium lowercase">
                levamos nossas vivências, rodas de escrita consciente e oficinas narrativas sob medida para a sua equipe, retiro ou evento presencial.
              </p>
            </div>

            {/* Carrossel de Fotos de Eventos Animado Estilo Polaroid Scrapbook */}
            <div className="lg:col-span-6">
              <div className="relative bg-bgPlataforma rounded-3xl p-4 sm:p-5 border border-papelKraft/60 shadow-kraft-lg overflow-hidden group select-none">
                {/* Sticker Fita Washi no Canto Superior */}
                <div className="absolute -top-2 left-8 w-28 h-7 pointer-events-none z-30 opacity-90">
                  <img
                    src="/brand-assets/elements/stickers/fitas-washi-flores-terracota.png"
                    alt="fita washi"
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Contêiner de Imagem com Transição Suave */}
                <div className="relative h-60 sm:h-72 w-full rounded-2xl overflow-hidden shadow-sm border border-papelKraft/40">
                  {eventSlides.map((slide, idx) => (
                    <div
                      key={idx}
                      className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                        idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                      }`}
                    >
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                      />
                      {/* Degradê de Texto e Legenda */}
                      <div className="absolute inset-0 bg-gradient-to-t from-acentoAzul/90 via-transparent to-transparent flex flex-col justify-end p-5 text-white">
                        <span className="font-editorial text-xl sm:text-2xl font-bold lowercase text-papelClaro">
                          {slide.title}
                        </span>
                        <p className="text-xs sm:text-sm text-papelClaro/85 font-medium lowercase">
                          {slide.subtitle}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Botões de Navegação Anterior / Próximo */}
                  <button
                    onClick={prevSlide}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-papelClaro/80 hover:bg-papelClaro text-acentoAzul flex items-center justify-center shadow-md transition-all active:scale-95"
                    aria-label="foto anterior"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    onClick={nextSlide}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-papelClaro/80 hover:bg-papelClaro text-acentoAzul flex items-center justify-center shadow-md transition-all active:scale-95"
                    aria-label="próxima foto"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Indicadores de Bolinhas / Dots */}
                <div className="flex justify-center items-center gap-2 pt-3.5">
                  {eventSlides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        idx === currentSlide
                          ? 'w-6 bg-acentoTerracota'
                          : 'w-2 bg-papelKraft/50 hover:bg-papelKraft'
                      }`}
                      aria-label={`ir para slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Highlights Bento Grid Compacto e Dinâmico */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {highlights.map(({ icon: Icon, badge, title, description }, idx) => (
              <div
                key={idx}
                className="bg-bgPlataforma/70 rounded-2xl p-5 sm:p-6 border border-papelKraft/60 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-acentoAzul/40 hover:shadow-md group flex flex-col justify-between relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-acentoAzul/10 text-acentoAzul flex items-center justify-center group-hover:bg-acentoAzul group-hover:text-white transition-all">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-tintaCarvao/60 lowercase tracking-wider bg-papelKraft/30 px-2.5 py-1 rounded-full">
                      {badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold font-editorial text-acentoAzul lowercase mb-2 group-hover:text-acentoTerracota transition-colors">
                    {title}
                  </h3>
                  <p className="text-tintaCarvao/80 text-sm sm:text-base leading-relaxed lowercase font-medium">
                    {description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-papelKraft/30 flex items-center justify-between text-xs font-bold text-acentoAzul opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>saiba mais</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>

          {/* Banner CTA WhatsApp Elegante com Marca D'Água e Alto Contraste */}
          <div className="relative rounded-2xl bg-[#0D0859] text-white p-6 sm:p-8 lg:p-10 shadow-kraft flex flex-col sm:flex-row items-center justify-between gap-6 border border-acentoTerracota/30 overflow-hidden group">
            {/* Marca d'Água de Ícone Oficial no Fundo */}
            <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none select-none transition-transform duration-700 group-hover:scale-105">
              <img
                src="/brand-assets/icons/icone_63.svg"
                alt="watermark"
                className="w-48 h-48 object-contain filter invert"
              />
            </div>

            <div className="space-y-1.5 relative z-10 text-center sm:text-left">
              <h4 className="text-2xl sm:text-3xl font-editorial font-bold lowercase text-papelClaro">
                vamos desenhar algo especial juntos?
              </h4>
              <p className="text-papelClaro/85 text-sm sm:text-base lowercase font-medium">
                fale diretamente conosco pelo whatsapp e receba a proposta detalhada.
              </p>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#BEC540] text-[#0D0859] hover:bg-[#BEC540]/90 font-bold px-8 py-3.5 rounded-full text-base sm:text-lg flex items-center gap-3 transition-all hover:scale-105 shadow-lg flex-shrink-0 cursor-pointer relative z-10 lowercase"
            >
              <MessageCircle className="w-5 h-5 text-[#0D0859]" />
              <span>falar no whatsapp</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
