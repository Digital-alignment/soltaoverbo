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

interface CreatedEvent {
  id: string;
  title: string;
  location: string;
  year: string;
  shortDescription: string;
  fullDescription: string;
  image: string;
  washiTape: string;
  highlights: string[];
}

export default function AboutUs() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<EventPhoto | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CreatedEvent | null>(null);

  const { getSection } = usePageContent('about');

  const heroSec = getSection('hero', {
    badge_text: 'nossa essência & manifesto',
    title_prefix: 'solta o verbo:',
    title: 'auto desenvolvimento em coletivo',
    subtitle: 'existimos para que ninguém precise atravessar as próprias perguntas sozinha. somos uma comunidade viva que usa a escrita para reconhecer as narrativas herdadas, questioná-las e reescrevê-las com mais verdade, consciência e liberdade. sua história deve ser vivida e contada a partir da sua perspectiva, e ninguém mais. quem escreve, dirige e vive a sua vida?',
    italic_quote: 'reescreva sua história ao ampliar a perspectiva e abrir espaço para uma escrita (e uma vida) mais consciente.',
    button_text: 'conhecer as facilitadoras',
    button_link: '#criadoras',
    button_secondary_text: 'ver nossos encontros',
    button_secondary_link: '#encontros',
    image_url: '/whatsapp_image_2025-12-11_at_3.24.18_pm.jpeg',
    card_quote: 'escrever é encarar com verdade e presença as partes de nós que ainda não tinham nome.',
  });

  const manifestoSec = getSection('manifesto', {
    badge_text: 'manifesto',
    title: 'o que acreditamos',
    p1: 'acreditamos que somos capazes de transformar a nossa vida quando reconhecemos as narrativas que nos atravessam.',
    p2: 'muitas vezes repetimos histórias que nos foram introjetadas sem perceber que também temos o poder de escolher outras palavras, outros sentidos e outros capítulos para, assim, criar novos começos e melhores finais.',
    p3: 'usamos a escrita como a ferramenta acessível e profundamente transformadora que ela é. por meio dela, trilhamos um caminho de dar contorno ao que nos habita: tornar visíveis as histórias que carregamos para então questioná-las e reescrevê-las com mais verdade, consciência e liberdade.',
    highlight_quote: 'solta o verbo é um convite para despertar a própria voz ao escutá-la através da escrita.',
    box_p1: 'acreditamos na escrita como caminho de aprendizagem, verdade e transformação em coletivo. nossos pilares nascem da escuta de si, da troca com o outro e da coragem de escrever uma vida mais verdadeira.',
    box_p2: 'aqui, aprender é se escutar, partilhar caminhos e dar linguagem ao que é essencial. cultivamos uma escrita que aproxima da própria verdade e transforma quando encontra o coletivo.',
  });

  const pilaresSec = getSection('pilares', {
    title: 'o que nos move todos os dias',
    subtitle: 'nossos cinco pilares que sustentam cada experiência e cada roda de escrita.',
    pilar_1_title: 'encontros reais',
    pilar_1_desc: 'onde cada pessoa pode chegar como está. conversas que abrem espaço para o que realmente importa, sem máscaras ou julgamento.',
    pilar_2_title: 'vínculos & proteção',
    pilar_2_desc: 'rituais que fortalecem a confiança e criam uma rede de apoio genuína contra a solidão e o isolamento dos tempos atuais.',
    pilar_3_title: 'expressão & autoria',
    pilar_3_desc: 'exercícios guiados que colocam o sentir em movimento, dando forma poética às emoções e organizando o caos interno.',
    pilar_4_title: 'potência criativa',
    pilar_4_desc: 'transformar padrões limitantes e narrativas herdadas em força de vida e liberdade de escolha.',
    pilar_5_title: 'aprender fazendo',
    pilar_5_desc: 'acreditamos que o aprendizado está no ato: fazer, testar, errar, tentar de outro jeito. escrever é o nosso ponto de partida, mas o que muda uma vida não é entender uma ideia: é experimentá-la. aqui a gente aprende a caminhando, caminhando.',
  });

  const galeriaSec = getSection('galeria', {
    badge_text: 'diário visual',
    title: 'nossos encontros em imagens',
    subtitle: 'registros da nossa participação em feiras, oficinas presenciais e momentos de partilha.',
    photo_1_title: 'oficinas presenciais',
    photo_1_subtitle: 'vivências de escrita consciente & integração',
    photo_1_image: '/brand-assets/gallery/events/13062026-IMG_6581-2.jpg',
    photo_2_title: 'rodas de partilha',
    photo_2_subtitle: 'cadernos abertos, diálogos profundos e escuta',
    photo_2_image: '/brand-assets/gallery/events/13062026-IMG_5364-2.jpg',
    photo_3_title: 'experiências sob medida',
    photo_3_subtitle: 'encontros para retiros, festivais e coletivos',
    photo_3_image: '/brand-assets/gallery/events/13062026-IMG_6666-2.jpg',
    photo_4_title: 'curadoria de ambiente',
    photo_4_subtitle: 'espaço seguro para acolher histórias humanas',
    photo_4_image: '/brand-assets/gallery/events/_MG_0015.jpg',
    photo_5_title: 'conexões autênticas',
    photo_5_subtitle: 'transformando a rotina através da poesia',
    photo_5_image: '/brand-assets/gallery/events/_MG_9849.jpg',
    photo_6_title: 'rituais de presença',
    photo_6_subtitle: 'reescrevendo narrativas em comunidade',
    photo_6_image: '/brand-assets/gallery/events/_MG_9991.jpg',
  });

  const eventosSec = getSection('eventos_criados', {
    badge_text: 'presenciais',
    title: 'os eventos que criamos',
    subtitle: 'a escrita também sai da tela, e como é bom a gente estar pertinho <3',
    evt1_title: 'feira fatto à femme',
    evt1_location: 'florianópolis',
    evt1_year: '2026',
    evt1_short: 'instalação de escrita e roda de partilha com o público da feira, criando uma pausa poética no meio do evento.',
    evt1_full: 'uma vivência poética ocupando o espaço público da feira fatto à femme em florianópolis. criamos um varal de histórias e uma mesa de escrita aberta onde centenas de pessoas pararam entre as alamedas da feira para colocar sentimentos no papel, pendurar suas frases no varal e compartilhar pausas necessárias em meio à movimentação do evento.',
    evt1_image: '/brand-assets/gallery/events/13062026-IMG_6581-2.jpg',
    evt1_hl1: 'varal poético comunitário com mais de 100 mensagens penduradas',
    evt1_hl2: 'rodas espontâneas de escuta e acolhimento com os visitantes da feira',
    evt1_hl3: 'espaço de desaceleração e reconexão autoral no meio do evento',
    evt2_title: 'o experienciar',
    evt2_location: 'florianópolis',
    evt2_year: '2026',
    evt2_short: 'oficina presencial de escrita expressiva e presença para desacelerar e olhar para dentro.',
    evt2_full: 'uma imersão presencial intimista focada no autodesenvolvimento e na escrita sem filtro. durante quatro horas, facilitamos rituais de presença, dinâmicas de escuta em dupla, café com prosa e produção autoral guiada em um ambiente integrado com a natureza.',
    evt2_image: '/brand-assets/gallery/events/13062026-IMG_5364-2.jpg',
    evt2_hl1: 'práticas de escrita expressiva baseadas nas pesquisas de james pennebaker',
    evt2_hl2: 'roda de partilha segura, afetiva e totalmente livre de julgamentos',
    evt2_hl3: 'cadernos artesanais e kit de rituais entregues a cada participante',
    next_badge: 'em breve',
    next_title: 'o próximo, em breve',
    next_text: 'estamos preparando os próximos encontros presenciais. quer saber em primeira mão quando abrirmos vagas?',
    next_button_text: 'quero saber quando abrir',
    next_button_link: 'https://wa.me/5511999999999?text=ol%C3%A1!%20gostaria%20de%20saber%20quando%20abrem%20vagas%20para%20os%20pr%C3%B3ximos%20eventos%20presenciais.',
    footer_text: 'quer levar a solta o verbo para o seu evento, retiro ou coletivo? a gente desenha a vivência junto com você.',
    footer_button_text: 'falar com a gente',
    footer_button_link: 'https://wa.me/5511999999999?text=ol%C3%A1!%20gostaria%20de%20levar%20uma%20experi%C3%AAncia%20da%20solta%20o%20verbo%20para%20nosso%20evento.',
  });

  const ecossistemaSec = getSection('ecossistema_digital', {
    badge_text: 'o nosso ecossistema digital',
    title: 'um ambiente livre de algoritmos e distrações',
    subtitle: 'nossa plataforma foi desenhada para que você possa publicar textos, interagir com leitoras apaixonadas por palavras e manter um diário de bordo digital com privacidade e respeito.',
    bullet_1: 'editor limpo e focado no essencial da escrita',
    bullet_2: 'acesso à fogueira de partilha comunitária diária',
    bullet_3: 'encontros ao vivo e acervo completo gravado',
    button_text: 'começar minhas 48 horas grátis',
    button_link: '/register',
    image_url: '/whatsapp_image_2025-12-11_at_4.25.25_pm.jpeg',
  });

  const { scrollYProgress } = useScroll({
    target: pageRef,
    offset: ['start start', 'end end'],
  });

  const pillars = [
    { icon: Heart, title: pilaresSec.pilar_1_title || 'encontros reais', description: pilaresSec.pilar_1_desc || 'onde cada pessoa pode chegar como está...' },
    { icon: Users, title: pilaresSec.pilar_2_title || 'vínculos & proteção', description: pilaresSec.pilar_2_desc || 'rituais que fortalecem...' },
    { icon: Pencil, title: pilaresSec.pilar_3_title || 'expressão & autoria', description: pilaresSec.pilar_3_desc || 'exercícios guiados...' },
    { icon: Compass, title: pilaresSec.pilar_4_title || 'potência criativa', description: pilaresSec.pilar_4_desc || 'transformar padrões limitantes...' },
    { icon: BookOpen, title: pilaresSec.pilar_5_title || 'aprender fazendo', description: pilaresSec.pilar_5_desc || 'acreditamos que o aprendizado...' },
  ];

  const eventGallery: EventPhoto[] = [
    { image: galeriaSec.photo_1_image || '/brand-assets/gallery/events/13062026-IMG_6581-2.jpg', title: galeriaSec.photo_1_title || 'oficinas presenciais', subtitle: galeriaSec.photo_1_subtitle || 'vivências de escrita consciente & integração', washiTape: '/brand-assets/elements/stickers/fitas-washi-flores-terracota.png' },
    { image: galeriaSec.photo_2_image || '/brand-assets/gallery/events/13062026-IMG_5364-2.jpg', title: galeriaSec.photo_2_title || 'rodas de partilha', subtitle: galeriaSec.photo_2_subtitle || 'cadernos abertos, diálogos profundos e escuta', washiTape: '/brand-assets/elements/stickers/fitas-washi-flores-azul.png' },
    { image: galeriaSec.photo_3_image || '/brand-assets/gallery/events/13062026-IMG_6666-2.jpg', title: galeriaSec.photo_3_title || 'experiências sob medida', subtitle: galeriaSec.photo_3_subtitle || 'encontros para retiros, festivais e coletivos', washiTape: '/brand-assets/elements/stickers/fitas-washi-realistica-azul.png' },
    { image: galeriaSec.photo_4_image || '/brand-assets/gallery/events/_MG_0015.jpg', title: galeriaSec.photo_4_title || 'curadoria de ambiente', subtitle: galeriaSec.photo_4_subtitle || 'espaço seguro para acolher histórias humanas', washiTape: '/brand-assets/elements/stickers/fitas-washi-flores-terracota.png' },
    { image: galeriaSec.photo_5_image || '/brand-assets/gallery/events/_MG_9849.jpg', title: galeriaSec.photo_5_title || 'conexões autênticas', subtitle: galeriaSec.photo_5_subtitle || 'transformando a rotina através da poesia', washiTape: '/brand-assets/elements/stickers/fitas-washi-flores-azul.png' },
    { image: galeriaSec.photo_6_image || '/brand-assets/gallery/events/_MG_9991.jpg', title: galeriaSec.photo_6_title || 'rituais de presença', subtitle: galeriaSec.photo_6_subtitle || 'reescrevendo narrativas em comunidade', washiTape: '/brand-assets/elements/stickers/fitas-washi-realistica-azul.png' },
  ];

  const createdEvents: CreatedEvent[] = [
    {
      id: 'fatto-a-femme',
      title: eventosSec.evt1_title || 'feira fatto à femme',
      location: eventosSec.evt1_location || 'florianópolis',
      year: eventosSec.evt1_year || '2026',
      shortDescription: eventosSec.evt1_short || 'instalação de escrita e roda de partilha...',
      fullDescription: eventosSec.evt1_full || 'uma vivência poética ocupando o espaço público...',
      image: eventosSec.evt1_image || '/brand-assets/gallery/events/13062026-IMG_6581-2.jpg',
      washiTape: '/brand-assets/elements/stickers/fitas-washi-flores-terracota.png',
      highlights: [
        eventosSec.evt1_hl1 || 'varal poético comunitário com mais de 100 mensagens penduradas',
        eventosSec.evt1_hl2 || 'rodas espontâneas de escuta e acolhimento com os visitantes da feira',
        eventosSec.evt1_hl3 || 'espaço de desaceleração e reconexão autoral no meio do evento',
      ],
    },
    {
      id: 'o-experienciar',
      title: eventosSec.evt2_title || 'o experienciar',
      location: eventosSec.evt2_location || 'florianópolis',
      year: eventosSec.evt2_year || '2026',
      shortDescription: eventosSec.evt2_short || 'oficina presencial de escrita expressiva...',
      fullDescription: eventosSec.evt2_full || 'uma imersão presencial intimista focada...',
      image: eventosSec.evt2_image || '/brand-assets/gallery/events/13062026-IMG_5364-2.jpg',
      washiTape: '/brand-assets/elements/stickers/fitas-washi-flores-azul.png',
      highlights: [
        eventosSec.evt2_hl1 || 'práticas de escrita expressiva baseadas nas pesquisas de james pennebaker',
        eventosSec.evt2_hl2 || 'roda de partilha segura, afetiva e totalmente livre de julgamentos',
        eventosSec.evt2_hl3 || 'cadernos artesanais e kit de rituais entregues a cada participante',
      ],
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
                <span>{heroSec.badge_text || 'nossa essência & manifesto'}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-editorial text-acentoAzul lowercase leading-[1.1] tracking-tight">
                {heroSec.title_prefix || 'solta o verbo:'} <br className="hidden sm:inline" />
                <span className="font-gesto text-acentoTerracota font-normal text-4xl sm:text-5xl lg:text-6xl block mt-1">
                  {heroSec.title || 'auto desenvolvimento em coletivo'}
                </span>
              </h1>

              <p className="text-tintaCarvao/85 text-lg sm:text-xl leading-relaxed max-w-2xl font-medium lowercase">
                {heroSec.subtitle || 'existimos para que ninguém precise atravessar as próprias perguntas sozinha...'}
              </p>

              <p className="text-tintaCarvao/70 text-base sm:text-lg italic font-medium lowercase border-t border-papelKraft/30 pt-3">
                {heroSec.italic_quote || 'reescreva sua história ao ampliar a perspectiva...'}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href={heroSec.button_link || '#criadoras'}
                  className="btn-pill-primary text-base sm:text-lg px-8 py-3.5 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2.5"
                >
                  <span>{heroSec.button_text || 'conhecer as facilitadoras'}</span>
                  <ArrowRight className="w-5 h-5 text-white" />
                </a>

                <a
                  href={heroSec.button_secondary_link || '#encontros'}
                  className="bg-papelClaro text-acentoAzul border border-papelKraft/50 hover:bg-bgPlataforma text-base sm:text-lg px-8 py-3.5 rounded-full font-medium transition-all shadow-sm flex items-center gap-2.5 cursor-pointer lowercase"
                >
                  <span>{heroSec.button_secondary_text || 'ver nossos encontros'}</span>
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
                  “{heroSec.card_quote || 'escrever é encarar com verdade e presença as partes de nós que ainda não tinham nome.'}”
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
            {manifestoSec.badge_text || 'manifesto'}
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold font-editorial text-acentoAzul lowercase">
            {manifestoSec.title || 'o que acreditamos'}
          </h2>

          <div className="space-y-6 text-tintaCarvao/90 text-lg sm:text-xl leading-relaxed font-medium lowercase">
            <p>{manifestoSec.p1 || 'acreditamos que somos capazes de transformar a nossa vida quando reconhecemos as narrativas que nos atravessam.'}</p>
            <p>{manifestoSec.p2 || 'muitas vezes repetimos histórias que nos foram introjetadas sem perceber que também temos o poder de escolher outras palavras...'}</p>
            <p>{manifestoSec.p3 || 'usamos a escrita como a ferramenta acessível e profundamente transformadora que ela é...'}</p>
            <p className="font-editorial text-2xl text-acentoTerracota font-bold">
              {manifestoSec.highlight_quote || 'solta o verbo é um convite para despertar a própria voz ao escutá-la através da escrita.'}
            </p>
          </div>

          <div className="p-8 bg-bgPlataforma rounded-3xl border border-papelKraft/60 text-tintaCarvao/85 text-base sm:text-lg leading-relaxed font-medium lowercase space-y-4 max-w-3xl mx-auto">
            <p>{manifestoSec.box_p1 || 'acreditamos na escrita como caminho de aprendizagem...'}</p>
            <p className="text-acentoAzul font-bold">
              {manifestoSec.box_p2 || 'aqui, aprender é se escutar, partilhar caminhos e dar linguagem...'}`
            </p>
          </div>
        </div>
      </section>

      {/* 3. NOSSOS PILARES (5 PILARES) */}
      <section className="py-16 sm:py-24 bg-bgPlataforma border-b border-papelKraft/40 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-editorial text-acentoAzul lowercase mb-3">
              {pilaresSec.title || 'o que nos move todos os dias'}
            </h2>
            <p className="text-tintaCarvao/80 text-base sm:text-lg font-medium lowercase">
              {pilaresSec.subtitle || 'nossos cinco pilares que sustentam cada experiência e cada roda de escrita.'}
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
              <span>{galeriaSec.badge_text || 'diário visual'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-editorial text-acentoAzul lowercase mb-4">
              {galeriaSec.title || 'nossos encontros em imagens'}
            </h2>
            <p className="text-tintaCarvao/80 text-base sm:text-lg font-medium lowercase">
              {galeriaSec.subtitle || 'registros da nossa participação em feiras, oficinas presenciais e momentos de partilha.'}
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
              {eventosSec.badge_text || 'presenciais'}
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold font-editorial text-acentoAzul lowercase">
              {eventosSec.title || 'os eventos que criamos'}
            </h2>
            <p className="text-tintaCarvao/80 text-base sm:text-lg font-medium lowercase">
              {eventosSec.subtitle || 'a escrita também sai da tela, e como é bom a gente estar pertinho <3'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {createdEvents.map((evt) => (
              <div
                key={evt.id}
                onClick={() => setSelectedEvent(evt)}
                className="relative bg-papelClaro rounded-3xl p-6 border border-papelKraft/60 shadow-kraft transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl cursor-pointer group flex flex-col justify-between select-none"
              >
                <div className="absolute -top-3.5 left-6 w-28 h-7 pointer-events-none z-20 opacity-90">
                  <img
                    src={evt.washiTape}
                    alt="fita washi"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="space-y-4">
                  <div className="w-full h-52 rounded-2xl overflow-hidden border border-papelKraft/40 relative shadow-sm group/photo bg-bgPlataforma">
                    <img
                      src={evt.image}
                      alt={evt.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover/photo:scale-105"
                    />
                    <div className="absolute inset-0 bg-acentoAzul/20 opacity-0 group-hover/photo:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-xs">
                      <span className="bg-papelClaro/95 text-acentoAzul font-bold px-4 py-2 rounded-full text-xs shadow-md border border-papelKraft/50 lowercase">
                        ver detalhes do evento →
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-acentoTerracota lowercase block tracking-wider">
                    {evt.location} · {evt.year}
                  </span>

                  <h3 className="text-xl font-bold font-editorial text-acentoAzul lowercase group-hover:text-acentoTerracota transition-colors">
                    {evt.title}
                  </h3>

                  <p className="text-tintaCarvao/85 text-sm leading-relaxed font-medium lowercase">
                    {evt.shortDescription}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-papelKraft/40 flex items-center justify-between text-xs font-bold text-acentoAzul">
                  <span>ver fotos & história</span>
                  <ArrowRight className="w-4 h-4 text-acentoTerracota group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}

            {/* Card 3: Próximo em breve */}
            <div className="bg-acentoAzul text-white rounded-3xl p-6 sm:p-8 border border-white/20 shadow-kraft-lg space-y-4 flex flex-col justify-between relative overflow-hidden group">
              <div className="space-y-4 relative z-10">
                <span className="text-xs font-bold text-acentoOliva lowercase block tracking-widest">
                  {eventosSec.next_badge || 'em breve'}
                </span>
                <h3 className="text-2xl font-bold font-editorial text-papelClaro lowercase">
                  {eventosSec.next_title || 'o próximo, em breve'}
                </h3>
                <p className="text-papelClaro/85 text-sm sm:text-base leading-relaxed font-medium lowercase">
                  {eventosSec.next_text || 'estamos preparando os próximos encontros presenciais...'}
                </p>
              </div>

              <a
                href={eventosSec.next_button_link || "https://wa.me/5511999999999?text=ol%C3%A1!%20gostaria%20de%20saber%20quando%20abrem%20vagas%20para%20os%20pr%C3%B3ximos%20eventos%20presenciais."}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-pill-accent text-sm font-bold px-6 py-3.5 rounded-full text-center lowercase block hover:scale-105 transition-all shadow-md text-tintaCarvao relative z-10"
              >
                {eventosSec.next_button_text || 'quero saber quando abrir'}
              </a>
            </div>
          </div>

          <div className="pt-6 border-t border-papelKraft/40 flex flex-col sm:flex-row items-center justify-between gap-6 bg-papelClaro p-6 rounded-3xl shadow-xs">
            <p className="text-tintaCarvao/90 font-medium text-base lowercase">
              {eventosSec.footer_text || 'quer levar a solta o verbo para o seu evento, retiro ou coletivo? a gente desenha a vivência junto com você.'}
            </p>
            <a
              href={eventosSec.footer_button_link || "https://wa.me/5511999999999?text=ol%C3%A1!%20gostaria%20de%20levar%20uma%20experi%C3%AAncia%20da%20solta%20o%20verbo%20para%20nosso%20evento."}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pill-primary text-sm px-6 py-3 rounded-full flex items-center gap-2 flex-shrink-0 cursor-pointer lowercase"
            >
              <span>{eventosSec.footer_button_text || 'falar com a gente'}</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </a>
          </div>
        </div>
      </section>

      {/* Modal Pop-up Detalhado de Evento Realizado */}
      {selectedEvent && (
        <div
          className="fixed inset-0 z-50 bg-acentoAzul/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="bg-papelClaro rounded-3xl p-6 sm:p-8 border border-papelKraft/60 shadow-2xl max-w-3xl w-full relative animate-fadeIn max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative mb-6">
              <div className="w-full h-72 sm:h-96 rounded-2xl overflow-hidden border border-papelKraft/40 shadow-sm relative bg-bgPlataforma">
                <img
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="absolute top-3 left-4 px-3.5 py-1.5 rounded-full bg-papelClaro/90 backdrop-blur-sm border border-papelKraft/60 text-acentoTerracota text-xs font-bold lowercase shadow-md">
                {selectedEvent.location} · {selectedEvent.year}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-editorial text-3xl sm:text-4xl font-bold text-acentoAzul lowercase">
                {selectedEvent.title}
              </h3>

              <p className="text-tintaCarvao/90 text-base sm:text-lg leading-relaxed font-medium lowercase border-b border-papelKraft/30 pb-4">
                {selectedEvent.fullDescription}
              </p>

              <div className="space-y-2.5 pt-1">
                <span className="text-xs font-bold text-acentoAzul lowercase tracking-wider block">
                  destaques do evento:
                </span>
                <ul className="space-y-2">
                  {selectedEvent.highlights.map((hl, hIdx) => (
                    <li key={hIdx} className="flex items-start gap-3 text-tintaCarvao/85 text-sm font-medium lowercase">
                      <CheckCircle2 className="w-4 h-4 text-acentoOliva flex-shrink-0 mt-0.5" />
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 border-t border-papelKraft/40 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="btn-pill-primary flex-1 py-3.5 rounded-full text-center text-sm font-semibold lowercase cursor-pointer shadow-md"
                >
                  fechar detalhes
                </button>
                <a
                  href="https://wa.me/5511999999999?text=ol%C3%A1!%20gostaria%20de%20saber%20mais%20sobre%20os%20eventos%20presenciais."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-bgPlataforma text-acentoAzul hover:bg-papelKraft/20 border border-papelKraft/60 px-6 py-3.5 rounded-full text-center text-sm font-semibold lowercase flex items-center justify-center gap-2"
                >
                  <span>falar no whatsapp</span>
                  <ArrowRight className="w-4 h-4 text-acentoAzul" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Foto Ampliada da Galeria */}
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
                  <span>{ecossistemaSec.badge_text || 'o nosso ecossistema digital'}</span>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-editorial text-papelClaro lowercase leading-tight">
                  {ecossistemaSec.title || 'um ambiente livre de algoritmos e distrações'}
                </h2>

                <p className="text-papelClaro/85 text-base sm:text-lg leading-relaxed lowercase font-medium">
                  {ecossistemaSec.subtitle || 'nossa plataforma foi desenhada para que você possa publicar textos...'}
                </p>

                <ul className="space-y-3 text-papelClaro/90 font-medium text-base lowercase">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-acentoOliva flex-shrink-0" />
                    <span>{ecossistemaSec.bullet_1 || 'editor limpo e focado no essencial da escrita'}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-acentoOliva flex-shrink-0" />
                    <span>{ecossistemaSec.bullet_2 || 'acesso à fogueira de partilha comunitária diária'}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-acentoOliva flex-shrink-0" />
                    <span>{ecossistemaSec.bullet_3 || 'encontros ao vivo e acervo completo gravado'}</span>
                  </li>
                </ul>

                <div className="pt-4 flex items-center gap-4">
                  <Link
                    to={ecossistemaSec.button_link || "/register"}
                    className="btn-pill-accent text-base px-8 py-3.5 rounded-full shadow-lg hover:scale-105 transition-all flex items-center gap-2.5 lowercase text-tintaCarvao font-bold"
                  >
                    <span>{ecossistemaSec.button_text || 'começar minhas 48 horas grátis'}</span>
                    <Pencil className="w-5 h-5 text-tintaCarvao" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-papelClaro p-2">
                  <img
                    src={ecossistemaSec.image_url || "/whatsapp_image_2025-12-11_at_4.25.25_pm.jpeg"}
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
