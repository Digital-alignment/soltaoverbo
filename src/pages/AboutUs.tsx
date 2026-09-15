import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useScroll } from 'framer-motion';
import { Heart, Users, Pencil, ArrowRight, CheckCircle2, BookOpen, Compass } from 'lucide-react';
import PreLoginNavbar from '../components/PreLoginNavbar';
import PreLoginFooter from '../components/PreLoginFooter';
import FoundersSection from '../components/FoundersSection';
import { FullPageScrollStroke } from '../components/ui/svg-follow-scroll';
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

  const { getSection } = usePageContent('about');
  const heroSec = getSection('hero', {
    title: 'auto desenvolvimento em coletivo',
    subtitle: 'existimos para que ninguém precise atravessar as próprias perguntas sozinha. somos uma comunidade viva que usa a escrita para reconhecer as narrativas herdadas, questioná-las e reescrevê-las com mais verdade, consciência e liberdade. sua história deve ser vivida e contada a partir da sua perspectiva, e ninguém mais. quem escreve, dirige e vive a sua vida?',
    image_url: '/whatsapp_image_2025-12-11_at_3.24.18_pm.jpeg',
  });

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
    {
      icon: BookOpen,
      title: 'aprender fazendo',
      description: 'acreditamos que o aprendizado está no ato: fazer, testar, errar, tentar de outro jeito. escrever é o nosso ponto de partida, mas o que muda uma vida não é entender uma ideia: é experimentá-la. aqui a gente aprende a caminhar, caminhando.',
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
                <span className="font-gesto text-acentoTerracota font-normal text-4xl sm:text-5xl lg:text-6xl block mt-1">
                  auto desenvolvimento em coletivo
                </span>
              </h1>

              <p className="text-tintaCarvao/85 text-lg sm:text-xl leading-relaxed max-w-2xl font-medium lowercase">
                existimos para que ninguém precise atravessar as próprias perguntas sozinha. somos uma comunidade viva que usa a escrita para reconhecer as narrativas herdadas, questioná-las e reescrevê-las com mais verdade, consciência e liberdade. sua história deve ser vivida e contada a partir da sua perspectiva, e ninguém mais. quem escreve, dirige e vive a sua vida?
              </p>

              <p className="text-tintaCarvao/70 text-base sm:text-lg italic font-medium lowercase border-t border-papelKraft/30 pt-3">
                reescreva sua história ao ampliar a perspectiva e abrir espaço para uma escrita (e uma vida) mais consciente.
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
                  href="#encontros"
                  className="bg-papelClaro text-acentoAzul border border-papelKraft/50 hover:bg-bgPlataforma text-base sm:text-lg px-8 py-3.5 rounded-full font-medium transition-all shadow-sm flex items-center gap-2.5 cursor-pointer lowercase"
                >
                  <span>ver nossos encontros</span>
                  <BookOpen className="w-5 h-5 text-acentoAzul" />
                </a>
              </div>
            </div>

            {/* Coluna Direita: Card Scrapbook Hero */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl bg-papelClaro p-6 sm:p-7 border border-papelKraft/40 shadow-kraft-lg overflow-hidden group">
                <div className="absolute -top-2 right-8 w-28 h-7 pointer-events-none z-20 opacity-90">
                  <img
                    src="/brand-assets/elements/stickers/fitas-washi-flores-terracota.png"
                    alt="fita washi"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="w-full h-64 sm:h-72 rounded-2xl overflow-hidden border border-papelKraft/40 shadow-sm relative mb-5">
                  <img
                    src={heroSec.image_url || "/whatsapp_image_2025-12-11_at_3.24.18_pm.jpeg"}
                    alt="solta o verbo vivencia"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                <blockquote className="font-editorial text-xl sm:text-2xl text-acentoAzul leading-snug font-bold lowercase">
                  “escrever é encarar com verdade e presença as partes de nós que ainda não tinham nome.”
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2.5 MANIFESTO LARGURA TOTAL "O QUE ACREDITAMOS" */}
      <section className="py-20 sm:py-28 bg-papelClaro border-t border-b border-papelKraft/50 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <span className="text-xs font-bold text-acentoTerracota lowercase tracking-widest block">
            manifesto
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold font-editorial text-acentoAzul lowercase">
            o que acreditamos
          </h2>

          <div className="space-y-6 text-tintaCarvao/90 text-lg sm:text-xl leading-relaxed font-medium lowercase">
            <p>
              acreditamos que somos capazes de transformar a nossa vida quando reconhecemos as narrativas que nos atravessam.
            </p>
            <p>
              muitas vezes repetimos histórias que nos foram introjetadas sem perceber que também temos o poder de escolher outras palavras, outros sentidos e outros capítulos para, assim, criar novos começos e melhores finais.
            </p>
            <p>
              usamos a escrita como a ferramenta acessível e profundamente transformadora que ela é. por meio dela, trilhamos um caminho de dar contorno ao que nos habita: tornar visíveis as histórias que carregamos para então questioná-las e reescrevê-las com mais verdade, consciência e liberdade.
            </p>
            <p className="font-editorial text-2xl text-acentoTerracota font-bold">
              solta o verbo é um convite para despertar a própria voz ao escutá-la através da escrita.
            </p>
          </div>

          <div className="p-8 bg-bgPlataforma rounded-3xl border border-papelKraft/60 text-tintaCarvao/85 text-base sm:text-lg leading-relaxed font-medium lowercase space-y-4 max-w-3xl mx-auto">
            <p>
              acreditamos na escrita como caminho de aprendizagem, verdade e transformação em coletivo. nossos pilares nascem da escuta de si, da troca com o outro e da coragem de escrever uma vida mais verdadeira.
            </p>
            <p className="text-acentoAzul font-bold">
              aqui, aprender é se escutar, partilhar caminhos e dar linguagem ao que é essencial. cultivamos uma escrita que aproxima da própria verdade e transforma quando encontra o coletivo.
            </p>
          </div>
        </div>
      </section>

      {/* 3. NOSSOS PILARES (5 PILARES) */}
      <section className="py-16 sm:py-24 bg-bgPlataforma border-b border-papelKraft/40 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-editorial text-acentoAzul lowercase mb-3">
              o que nos move todos os dias
            </h2>
            <p className="text-tintaCarvao/80 text-base sm:text-lg font-medium lowercase">
              nossos cinco pilares que sustentam cada experiência e cada roda de escrita.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {pillars.map(({ icon: Icon, title, description }, idx) => (
              <div
                key={idx}
                className="bg-papelClaro rounded-2xl p-5 border border-papelKraft/40 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-acentoAzul/40 hover:shadow-md group flex flex-col justify-between"
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

      {/* 4. AS CRIADORAS & FACILITADORAS */}
      <div id="criadoras" className="relative z-10">
        <FoundersSection />
      </div>

      {/* 5. DIÁRIO VISUAL DE ENCONTROS */}
      <section id="galeria" className="py-20 sm:py-28 bg-papelClaro/90 border-t border-b border-papelKraft/40 relative z-10 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-bgPlataforma border border-papelKraft/40 text-acentoAzul text-xs sm:text-sm font-semibold lowercase tracking-wider mb-4 shadow-sm">
              <img
                src="/brand-assets/icons/icone_63.svg"
                alt="galeria"
                className="w-5 h-5 object-contain"
              />
              <span>diário visual</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-editorial text-acentoAzul lowercase mb-4">
              nossos encontros em imagens
            </h2>
            <p className="text-tintaCarvao/80 text-base sm:text-lg font-medium lowercase">
              registros da nossa participação em feiras, oficinas presenciais e momentos de partilha.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {eventGallery.map((photo, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedPhoto(photo)}
                className="relative bg-bgPlataforma/90 backdrop-blur-sm rounded-3xl p-4 border border-papelKraft/40 shadow-kraft transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl cursor-pointer group select-none"
              >
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

      {/* 5.5 SEÇÃO OS EVENTOS QUE CRIAMOS */}
      <section id="encontros" className="py-20 sm:py-28 bg-bgPlataforma border-b border-papelKraft/40 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold text-acentoTerracota lowercase tracking-widest block">
              presenciais
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold font-editorial text-acentoAzul lowercase">
              os eventos que criamos
            </h2>
            <p className="text-tintaCarvao/80 text-base sm:text-lg font-medium lowercase">
              a escrita também sai da tela, e como é bom a gente estar pertinho &lt;3
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Fatto à Femme */}
            <div className="bg-papelClaro rounded-3xl p-6 border border-papelKraft/60 shadow-sm space-y-4">
              <div className="w-full h-48 rounded-2xl overflow-hidden border border-papelKraft/40">
                <img
                  src="/brand-assets/gallery/events/13062026-IMG_6581-2.jpg"
                  alt="feira fatto à femme"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xs font-bold text-acentoTerracota lowercase block">
                florianópolis · 2026
              </span>
              <h3 className="text-xl font-bold font-editorial text-acentoAzul lowercase">
                feira fatto à femme
              </h3>
              <p className="text-tintaCarvao/85 text-sm leading-relaxed font-medium lowercase">
                instalação de escrita e roda de partilha com o público da feira, criando uma pausa poética no meio do evento.
              </p>
            </div>

            {/* Card 2: O Experienciar */}
            <div className="bg-papelClaro rounded-3xl p-6 border border-papelKraft/60 shadow-sm space-y-4">
              <div className="w-full h-48 rounded-2xl overflow-hidden border border-papelKraft/40">
                <img
                  src="/brand-assets/gallery/events/13062026-IMG_5364-2.jpg"
                  alt="evento o experienciar"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xs font-bold text-acentoTerracota lowercase block">
                florianópolis · 2026
              </span>
              <h3 className="text-xl font-bold font-editorial text-acentoAzul lowercase">
                o experienciar
              </h3>
              <p className="text-tintaCarvao/85 text-sm leading-relaxed font-medium lowercase">
                oficina presencial de escrita expressiva e presença para desacelerar e olhar para dentro.
              </p>
            </div>

            {/* Card 3: Próximo em breve */}
            <div className="bg-acentoAzul text-white rounded-3xl p-6 border border-white/20 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-xs font-bold text-acentoOliva lowercase block">
                  em breve
                </span>
                <h3 className="text-xl font-bold font-editorial text-papelClaro lowercase">
                  o próximo, em breve
                </h3>
                <p className="text-papelClaro/85 text-sm leading-relaxed font-medium lowercase">
                  estamos preparando os próximos encontros presenciais. quer saber em primeira mão quando abrirmos vagas?
                </p>
              </div>

              <a
                href="https://wa.me/5511999999999?text=ol%C3%A1!%20gostaria%20de%20saber%20quando%20abrem%20vagas%20para%20os%20pr%C3%B3ximos%20eventos%20presenciais."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-pill-accent text-xs font-bold px-5 py-3 rounded-full text-center lowercase block hover:scale-105 transition-all shadow-md text-tintaCarvao"
              >
                quero saber quando abrir
              </a>
            </div>
          </div>

          <div className="pt-6 border-t border-papelKraft/40 flex flex-col sm:flex-row items-center justify-between gap-6 bg-papelClaro p-6 rounded-3xl shadow-xs">
            <p className="text-tintaCarvao/90 font-medium text-base lowercase">
              quer levar a solta o verbo para o seu evento, retiro ou coletivo? a gente desenha a vivência junto com você.
            </p>
            <a
              href="https://wa.me/5511999999999?text=ol%C3%A1!%20gostaria%20de%20levar%20uma%20experi%C3%AAncia%20da%20solta%20o%20verbo%20para%20nosso%20evento."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pill-primary text-sm px-6 py-3 rounded-full flex items-center gap-2 flex-shrink-0 cursor-pointer lowercase"
            >
              <span>falar com a gente</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </a>
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
                    <span>encontros ao vivo e acervo completo gravado</span>
                  </li>
                </ul>

                <div className="pt-4 flex items-center gap-4">
                  <Link
                    to="/register"
                    className="btn-pill-accent text-base px-8 py-3.5 rounded-full shadow-lg hover:scale-105 transition-all flex items-center gap-2.5 lowercase text-tintaCarvao font-bold"
                  >
                    <span>começar minhas 48 horas grátis</span>
                    <Pencil className="w-5 h-5 text-tintaCarvao" />
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

      {/* 7. PreLoginFooter */}
      <PreLoginFooter />
    </div>
  );
}
