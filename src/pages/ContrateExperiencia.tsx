import { useState, useEffect } from 'react';
import {
  MessageCircle,
  Building2,
  Sparkles,
  Users,
  Compass,
  CheckCircle2,
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

export default function ContrateExperiencia() {
  const { getSection } = usePageContent('contrate_experiencia');
  const { getSection: getContactSection } = usePageContent('contacts');
  const { getSection: getTestimonialPoolSection } = usePageContent('testimonials_pool');

  // CMS Sections
  const heroSec = getSection('hero', {
    badge_text: 'experiências sob medida & oficinas B2B',
    title: 'contrate uma experiência:',
    subtitle_gesto: 'momentos que reconectam um grupo com a própria palavra.',
    subtitle: 'levamos rituais de escrita consciente, integração humana e expressão autêntica para dentro da sua empresa, do seu evento ou do seu festival.',
    highlight_box_title: 'propostas exclusivas sob medida para o seu grupo',
    button_text: 'solicitar proposta no whatsapp',
    button_secondary_text: 'ver formatos de experiência',
    image_url: '/brand-assets/gallery/events/13062026-IMG_6581-2.jpg',
    quote_text: '“transformar a rotina de uma equipe começa quando abrimos espaço para a escuta genuína.”',
  });

  const praQuemESec = getSection('pra_quem_e', {
    badge_text: 'públicos & formatos',
    title: 'pra quem é isso',
    subtitle: 'se você cuida de pessoas dentro de uma empresa, organiza um evento que quer sair do lugar comum, ou representa uma marca que busca se aproximar do público de um jeito mais humano, a solta o verbo tem uma experiência pensada pra você.',
    c1_title: 'empresas & rh',
    c1_desc: 'times de rh e people que querem cuidar de verdade da equipe',
    c2_title: 'eventos & retiros',
    c2_desc: 'produtoras de eventos, retiros e festivais que buscam rituais de presença',
    c3_title: 'marcas & ativações',
    c3_desc: 'marcas que querem ativações com significado, não só brinde',
    c4_title: 'coletivos',
    c4_desc: 'coletivos e comunidades que precisam de um espaço pra se escutar',
  });

  const porQueSec = getSection('por_que_escrita', {
    badge_text: 'fundamentação & metodologia',
    title: 'por que escrita',
    body_text: 'não é só uma dinâmica bonitinha. nosso trabalho parte de referências consistentes, como as pesquisas de james pennebaker sobre escrita expressiva e seus efeitos no bem estar emocional, e a curva do esquecimento de ebbinghaus, que reforça a importância da prática recorrente, não só de um encontro isolado. cada experiência também é desenhada com a metodologia design de conexões, criada pra gerar pertencimento real entre as pessoas de um grupo, não só preencher uma tarde de agenda.',
  });

  const galeriaSec = getSection('galeria', {
    badge_text: 'galeria de experiências presenciais',
    title: 'registros dos nossos encontros e oficinas',
    subtitle: 'momentos de partilha, cadernos abertos e rituais de presença em retiros, empresas e festivais pelo brasil.',
    p1_title: 'oficinas corporativas & integração',
    p1_sub: 'vivências de escrita guiada para desacelerar equipes',
    p1_img: '/brand-assets/gallery/events/13062026-IMG_6581-2.jpg',
    p2_title: 'rodas de partilha em retiros',
    p2_sub: 'curadoria de ambiente e escuta sem julgamento',
    p2_img: '/brand-assets/gallery/events/13062026-IMG_5364-2.jpg',
    p3_title: 'experiências para marcas & eventos',
    p3_sub: 'ativações poéticas sob medida com cadernos afetivos',
    p3_img: '/brand-assets/gallery/events/13062026-IMG_6666-2.jpg',
    p4_title: 'imersões presenciais & festivais',
    p4_sub: 'espaço seguro para acolher histórias humanas',
    p4_img: '/brand-assets/gallery/events/_MG_0015.jpg',
    p5_title: 'dinâmicas de escuta ativa',
    p5_sub: 'transformando a rotina de trabalho em presença',
    p5_img: '/brand-assets/gallery/events/_MG_9849.jpg',
    p6_title: 'rituais de abertura & encerramento',
    p6_sub: 'reescrevendo narrativas em comunidade',
    p6_img: '/brand-assets/gallery/events/_MG_9991.jpg',
  });

  const fundSec = getSection('fundamentacao_boxes', {
    box1_title: 'pra quem é isso?',
    box1_bullet1: 'empresas & líderes: que buscam promover saúde mental, humanização, escuta ativa e integração genuína de equipes.',
    box1_bullet2: 'retiros & imersões: facilitadores de autoconhecimento que desejam incluir rodas de partilha e rituais poéticos de escrita.',
    box1_bullet3: 'festivais & eventos culturais: momentos de desaceleração e presença em meio a programações intensas.',
    box1_bullet4: 'marcas & comemorações: ativações poéticas com cadernos afetivos e momentos memoráveis.',
    box2_title: 'por que a escrita?',
    box2_bullet1: 'desaceleração consciente: uma pausa no piloto automático e nas telas para respirar e sentir.',
    box2_bullet2: 'segurança psicológica: criar um ambiente onde todos se sentem acolhidos para se expressar sem julgamento.',
    box2_bullet3: 'escuta ativa: ouvir o outro com presença genuína, fortalecendo a empatia do grupo.',
    box2_bullet4: 'expressão autêntica: colocar no papel sentimentos que muitas vezes não encontram espaço na fala cotidiana.',
    pennebaker_title: 'nosso trabalho nasce de estudo e de vivência',
    pennebaker_desc: 'não improvisamos. cada encontro que desenhamos parte de referências consistentes, como as pesquisas de james pennebaker sobre escrita expressiva e seus efeitos no bem-estar emocional, e a curva do esquecimento de ebbinghaus, que mostra por que a escrita precisa ser prática sustentada e não um evento isolado.',
    pennebaker_highlight: 'é por isso que não entregamos só uma oficina bonita: desenhamos jornadas que continuam vivas depois que a gente vai embora.',
  });

  const formatosSec = getSection('formatos', {
    badge_text: 'formatos sob medida',
    title: 'como levamos a experiência até você',
    subtitle: 'quatro caminhos autorais adaptados para o formato e objetivo da sua iniciativa.',
    f1_title: 'oficinas corporativas & integração',
    f1_desc: 'vivências práticas para empresas que buscam fortalecer a empatia, desacelerar a rotina de trabalho e cultivar um clima de confiança através da escrita consciente.',
    f2_title: 'retiros, festivais & coletivos',
    f2_desc: 'rituais de abertura e encerramento, rodas de partilha e cadernos de bordo, pensados pra festivais, retiros e encontros que já nascem com escuta no centro.',
    f3_title: 'ativações de marca & festas',
    f3_desc: 'curadoria de ambientes afetivos, escrita poética personalizada ao vivo e brindes gráficos memoráveis para marcas e celebrações especiais.',
    f4_title: 'escrita para quem está aprendendo',
    f4_desc: 'atividades de escrita criativa para crianças, jovens e educadores, desenvolvendo imaginação, autoria e escuta desde cedo.',
    sob_medida_title: 'textos autorais para momentos especiais',
    sob_medida_desc: 'escrevemos textos poéticos sob medida para casamentos, homenagens, celebrações de vida e marcos institucionais de empresas: ouvimos a sua história e a devolvemos em palavras inesquecíveis.',
    sob_medida_button: 'encomendar um texto',
  });

  const passoSec = getSection('passo_a_passo', {
    badge_text: 'passo a passo da contratação',
    title: 'como construímos a experiência juntos',
    subtitle: 'quatro etapas simples para criar uma vivência perfeita para o seu grupo.',
    e1_step: '01', e1_title: 'diagnóstico & alinhamento', e1_sub: 'escutar para entender sua intenção', e1_desc: 'conversamos com você para compreender o propósito do evento, perfil dos participantes e o impacto desejado para a experiência.',
    e2_step: '02', e2_title: 'curadoria & roteiro autoral', e2_sub: 'experiência 100% sob medida', e2_desc: 'desenhamos propostas de escrita exclusivas, seleção de músicas, dinâmicas de acolhimento e cadernos de apoio personalizados.',
    e3_step: '03', e3_title: 'facilitação & condução viva', e3_sub: 'presença afetuosa de bruna e júlia', e3_desc: 'conduzimos a vivência com leveza, sensibilidade e profissionalismo, criando uma atmosfera onde todos se sentem seguros para participar.',
    e4_step: '04', e4_title: 'desdobramentos & memórias', e4_sub: 'lembrança duradoura para o grupo', e4_desc: 'entrega de cadernos poéticos e síntese da experiência para que os aprendizados permaneçam vivos após o encontro.',
  });

  const depoimentosSec = getSection('depoimentos', {
    badge_text: 'relatos & impressões reais',
    title: 'vozes e vivências da comunidade',
    subtitle: 'depoimentos reais de quem já participou das nossas oficinas e encontros.',
    selected_ids: 't1,t2,t3,t4,t5,t6,d1,d2,d3,d4,d5,d6,d7,d8',
  });

  const finalCtaSec = getSection('final_cta', {
    badge_text: 'vamos desenhar uma experiência juntos?',
    title: 'vamos desenhar uma experiência juntos?',
    subtitle: 'fale diretamente conosco pelo whatsapp e receba uma proposta personalizada para a sua empresa, evento ou retiro.',
    button_text: 'solicitar proposta no whatsapp',
  });

  const faqSec = getSection('faq', {
    title: 'perguntas frequentes sobre contratação b2b',
    q1: 'as experiências podem ser presenciais ou virtuais?', a1: 'sim, os dois formatos. presencial, a gente leva todo o ritual pra dentro do seu espaço. online, adaptamos a vivência sem perder a profundidade do encontro.',
    q2: 'qual é o número mínimo ou máximo de participantes?', a2: 'não trabalhamos com número fixo. pra formatos mais íntimos, como oficinas corporativas, o grupo costuma ser pequeno. já em festivais e instalações, a experiência é fixa no espaço, e pode receber quantas pessoas quiserem participar. o número ideal depende do formato e do lugar, e isso a gente alinha junto com você.',
    q3: 'quanto custa contratar uma experiência?', a3: 'o investimento varia de acordo com o formato, a duração e o tamanho do grupo. por isso cada proposta é personalizada, fale com a gente pelo whatsapp e te passamos os valores certinhos pro seu caso.',
    q4: 'com quanto tempo de antecedência preciso contratar?', a4: 'o ideal é fechar com pelo menos 1 mês de antecedência, pra gente ter tempo de fazer o diagnóstico, desenhar o roteiro autoral e alinhar tudo com calma antes do dia.',
    q5: 'quem conduz a experiência?', a5: 'bruna e júlia, as criadoras da solta o verbo, conduzem pessoalmente cada experiência. nada é terceirizado, quem desenha o roteiro é quem está com o grupo no dia.',
    q6: 'e se o meu time não tem afinidade com escrita? isso funciona mesmo assim?', a6: 'funciona, e costuma ser exatamente com esses grupos que a experiência mais surpreende. não pedimos talento, só presença. a escrita aqui é ferramenta, não performance.',
    q7: 'como faço para solicitar uma proposta personalizada?', a7: 'basta clicar nos botões de whatsapp desta página pra conversar direto com bruna e júlia. respondemos rápido com todas as informações necessárias.',
  });

  const contactsSec = getContactSection('info', {
    whatsapp: 'https://wa.me/5548991316277?text=ol%C3%A1!%20gostaria%20de%20solicitar%20uma%20proposta%20personalizada%20para%20uma%20experi%C3%AAncia%20do%20solta%20o%20verbo.',
  });

  const whatsappUrl =
    contactsSec.whatsapp ||
    'https://wa.me/5548991316277?text=ol%C3%A1!%20gostaria%20de%20solicitar%20uma%20proposta%20personalizada%20para%20uma%20experi%C3%AAncia%20do%20solta%20o%20verbo.';

  // State for Event Gallery Carousel
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);

  // State for FAQ Accordion
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // State for Deployments Carousel
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);
  const [selectedQuoteModal, setSelectedQuoteModal] = useState<{ quote: string; author: string; role?: string } | null>(null);

  // Event Gallery Array built from galeriaSec
  const eventGallery = [1, 2, 3, 4, 5, 6].map((num, idx) => {
    const washiTape = idx % 2 === 0
      ? '/brand-assets/elements/stickers/fitas-washi-flores-terracota.png'
      : '/brand-assets/elements/stickers/fitas-washi-flores-azul.png';
    return {
      image: galeriaSec[`p${num}_img`] || `/brand-assets/gallery/events/13062026-IMG_6581-2.jpg`,
      title: galeriaSec[`p${num}_title`] || `experiência ${num}`,
      subtitle: galeriaSec[`p${num}_sub`] || `vivências e rituais de presença`,
      washiTape,
    };
  });

  // Auto-play for Event Gallery Carousel (4.5s)
  useEffect(() => {
    if (isCarouselPaused || eventGallery.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % eventGallery.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isCarouselPaused, eventGallery.length]);

  // Construct items from testimonials_pool selection
  const selectedIds = (depoimentosSec.selected_ids || 't1,t2,t3,t4,t5,t6,d1,d2,d3,d4,d5,d6,d7,d8')
    .split(',')
    .map((s: string) => s.trim())
    .filter(Boolean);

  const testimonialsPoolContent: Record<string, any> = {};
  selectedIds.forEach((id: string) => {
    testimonialsPoolContent[id] = getTestimonialPoolSection(id, {});
  });

  const activeDeploymentItems = selectedIds.map((id: string) => {
    const poolItem = testimonialsPoolContent[id] || {};
    if (id.startsWith('d')) {
      return {
        id,
        title: poolItem.quote || 'partilha e acolhimento',
        src: poolItem.image_url || `/brand-assets/deployments/IMG_${id === 'd1' ? '2847.PNG' : '2848.PNG'}`,
        tag: poolItem.event_tag || 'experiências sob medida',
        author: poolItem.author || 'aluna solta o verbo',
        role: poolItem.role || 'print real da comunidade',
      };
    }
    return {
      id,
      title: poolItem.author || 'depoimento de participante',
      quote: poolItem.quote || 'experiência incrível de escrita em coletivo.',
      author: poolItem.author || 'aluna solta o verbo',
      role: poolItem.role || 'membro da comunidade',
      tag: poolItem.event_tag || 'experiências sob medida',
    };
  });

  // Auto-play for Deployments Carousel
  useEffect(() => {
    if (isPaused || activeDeploymentItems.length === 0) return;
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % activeDeploymentItems.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, activeDeploymentItems.length]);

  const nextSlide = () => {
    setCarouselIndex((prev) => (prev + 1) % activeDeploymentItems.length);
  };

  const prevSlide = () => {
    setCarouselIndex((prev) => (prev - 1 + activeDeploymentItems.length) % activeDeploymentItems.length);
  };

  const creationSteps = [1, 2, 3, 4].map((num) => ({
    step: passoSec[`e${num}_step`] || `0${num}`,
    title: passoSec[`e${num}_title`] || `etapa 0${num}`,
    subtitle: passoSec[`e${num}_sub`] || `subtítulo da etapa`,
    description: passoSec[`e${num}_desc`] || `descrição detalhada da etapa.`,
  }));

  const b2bFaqItems = [1, 2, 3, 4, 5, 6, 7].map((num) => ({
    q: faqSec[`q${num}`] || `pergunta frequente ${num}`,
    a: faqSec[`a${num}`] || `resposta detalhada para a pergunta ${num}.`,
  }));

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
                <span>{heroSec.badge_text || 'experiências sob medida & oficinas B2B'}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-editorial text-acentoAzul lowercase leading-[1.1] tracking-tight">
                {heroSec.title || 'contrate uma experiência:'} <br className="hidden sm:inline" />
                <span className="font-gesto text-acentoTerracota font-normal text-5xl sm:text-6xl lg:text-7xl block mt-1">
                  {heroSec.subtitle_gesto || 'momentos que reconectam um grupo com a própria palavra.'}
                </span>
              </h1>

              <p className="text-tintaCarvao/85 text-lg sm:text-xl leading-relaxed max-w-2xl font-medium lowercase">
                {heroSec.subtitle || 'levamos rituais de escrita consciente, integração humana e expressão autêntica para dentro da sua empresa, do seu evento ou do seu festival.'}
              </p>

              {/* Destaque B2B de Alinhamento Direto */}
              <div className="p-5 bg-papelClaro rounded-2xl border border-papelKraft/50 shadow-sm max-w-xl space-y-3">
                <div className="flex items-center gap-3 text-sm font-bold text-acentoAzul lowercase pb-2 border-b border-papelKraft/30">
                  <Building2 className="w-5 h-5 text-acentoTerracota" />
                  <span>{heroSec.highlight_box_title || 'propostas exclusivas sob medida para o seu grupo'}</span>
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
                  className="btn-pill-primary text-base sm:text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-3 lowercase cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 fill-white text-acentoAzul" />
                  <span>{heroSec.button_text || 'solicitar proposta no whatsapp'}</span>
                </a>

                <a
                  href="#formatos"
                  className="bg-papelClaro text-acentoAzul border border-papelKraft/50 hover:bg-bgPlataforma text-base px-7 py-3.5 rounded-full font-medium transition-all shadow-sm flex items-center gap-2 cursor-pointer lowercase"
                >
                  <span>{heroSec.button_secondary_text || 'ver formatos de experiência'}</span>
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
                    {heroSec.quote_text || '“transformar a rotina de uma equipe começa quando abrimos espaço para a escuta genuína.”'}
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

      {/* 3. PRA QUEM É ISSO */}
      <section className="py-20 sm:py-28 bg-papelClaro border-t border-b border-papelKraft/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-bgPlataforma border border-papelKraft/40 text-acentoAzul text-xs sm:text-sm font-semibold lowercase tracking-wider shadow-sm">
              <Users className="w-4 h-4 text-acentoTerracota" />
              <span>{praQuemESec.badge_text || 'públicos & formatos'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-editorial text-acentoAzul lowercase">
              {praQuemESec.title || 'pra quem é isso'}
            </h2>
            <p className="text-tintaCarvao/85 text-base sm:text-lg leading-relaxed font-medium lowercase">
              {praQuemESec.subtitle || 'se você cuida de pessoas dentro de uma empresa, organiza um evento que quer sair do lugar comum, ou representa uma marca que busca se aproximar do público de um jeito mais humano, a solta o verbo tem uma experiência pensada pra você.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Card 1 */}
            <div className="bg-bgPlataforma rounded-3xl p-6 sm:p-7 border border-papelKraft/40 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-acentoAzul/60 hover:shadow-md flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-acentoAzul/10 text-acentoAzul flex items-center justify-center group-hover:bg-acentoAzul group-hover:text-white transition-all">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-acentoTerracota lowercase tracking-wider block">
                  01 · {praQuemESec.c1_title || 'empresas & rh'}
                </span>
                <p className="text-tintaCarvao/90 text-sm sm:text-base leading-relaxed font-medium lowercase">
                  {praQuemESec.c1_desc || 'times de rh e people que querem cuidar de verdade da equipe'}
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-bgPlataforma rounded-3xl p-6 sm:p-7 border border-papelKraft/40 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-acentoAzul/60 hover:shadow-md flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-acentoTerracota/10 text-acentoTerracota flex items-center justify-center group-hover:bg-acentoTerracota group-hover:text-white transition-all">
                  <Sparkles className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-acentoTerracota lowercase tracking-wider block">
                  02 · {praQuemESec.c2_title || 'eventos & retiros'}
                </span>
                <p className="text-tintaCarvao/90 text-sm sm:text-base leading-relaxed font-medium lowercase">
                  {praQuemESec.c2_desc || 'produtoras de eventos, retiros e festivais que buscam rituais de presença'}
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-bgPlataforma rounded-3xl p-6 sm:p-7 border border-papelKraft/40 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-acentoAzul/60 hover:shadow-md flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-acentoOliva/30 text-tintaCarvao flex items-center justify-center group-hover:bg-acentoOliva transition-all">
                  <Heart className="w-6 h-6 text-acentoAzul" />
                </div>
                <span className="text-xs font-bold text-acentoTerracota lowercase tracking-wider block">
                  03 · {praQuemESec.c3_title || 'marcas & ativações'}
                </span>
                <p className="text-tintaCarvao/90 text-sm sm:text-base leading-relaxed font-medium lowercase">
                  {praQuemESec.c3_desc || 'marcas que querem ativações com significado, não só brinde'}
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-bgPlataforma rounded-3xl p-6 sm:p-7 border border-papelKraft/40 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-acentoAzul/60 hover:shadow-md flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-acentoAzul/10 text-acentoAzul flex items-center justify-center group-hover:bg-acentoAzul group-hover:text-white transition-all">
                  <Compass className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-acentoTerracota lowercase tracking-wider block">
                  04 · {praQuemESec.c4_title || 'coletivos'}
                </span>
                <p className="text-tintaCarvao/90 text-sm sm:text-base leading-relaxed font-medium lowercase">
                  {praQuemESec.c4_desc || 'coletivos e comunidades que precisam de um espaço pra se escutar'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. POR QUE ESCRITA */}
      <section className="py-20 sm:py-28 bg-bgPlataforma border-t border-b border-papelKraft/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-papelClaro rounded-3xl p-8 sm:p-12 border border-acentoAzul/20 shadow-kraft text-center space-y-6 relative overflow-hidden">
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
              <span>{porQueSec.badge_text || 'fundamentação & metodologia'}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-editorial text-acentoAzul lowercase">
              {porQueSec.title || 'por que escrita'}
            </h2>

            <p className="text-tintaCarvao/90 text-base sm:text-lg leading-relaxed font-medium lowercase max-w-3xl mx-auto">
              {porQueSec.body_text || 'não é só uma dinâmica bonitinha. nosso trabalho parte de referências consistentes, como as pesquisas de james pennebaker sobre escrita expressiva e seus efeitos no bem estar emocional, e a curva do esquecimento de ebbinghaus, que reforça a importância da prática recorrente, não só de um encontro isolado. cada experiência também é desenhada com a metodologia design de conexões, criada pra gerar pertencimento real entre as pessoas de um grupo, não só preencher uma tarde de agenda.'}
            </p>
          </div>
        </div>
      </section>

      {/* 5. CARRUSEL DE FOTOS DE EVENTOS PRESENCIAIS (Polaroid Scrapbook Grid) */}
      <section className="py-20 sm:py-28 bg-papelClaro border-t border-b border-papelKraft/40 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-bgPlataforma border border-papelKraft/40 text-acentoAzul text-xs sm:text-sm font-semibold lowercase tracking-wider mb-4 shadow-sm">
              <BookOpen className="w-4 h-4 text-acentoTerracota" />
              <span>{galeriaSec.badge_text || 'galeria de experiências presenciais'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-editorial text-acentoAzul lowercase mb-4">
              {galeriaSec.title || 'registros dos nossos encontros e oficinas'}
            </h2>
            <p className="text-tintaCarvao/80 text-base sm:text-lg font-medium lowercase">
              {galeriaSec.subtitle || 'momentos de partilha, cadernos abertos e rituais de presença em retiros, empresas e festivais pelo brasil.'}
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
                  src={eventGallery[currentSlide]?.washiTape || '/brand-assets/elements/stickers/fitas-washi-flores-terracota.png'}
                  alt="fita washi"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="w-full h-72 sm:h-96 rounded-2xl overflow-hidden border border-papelKraft/40 relative mb-6 shadow-sm">
                <img
                  src={eventGallery[currentSlide]?.image || '/brand-assets/gallery/events/13062026-IMG_6581-2.jpg'}
                  alt={eventGallery[currentSlide]?.title || 'oficina solta o verbo'}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-papelKraft/30">
                <div>
                  <h3 className="font-editorial text-2xl font-bold text-acentoAzul lowercase">
                    {eventGallery[currentSlide]?.title}
                  </h3>
                  <p className="text-sm text-tintaCarvao/75 font-medium lowercase">
                    {eventGallery[currentSlide]?.subtitle}
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
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
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

      {/* 6. FUNDAMENTAÇÃO, BULLETS & PENNEBAKER */}
      <section className="py-20 sm:py-24 bg-papelClaro border-t border-b border-papelKraft/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Box 1: Pra quem é isso */}
            <div className="bg-bgPlataforma rounded-3xl p-7 sm:p-8 border border-papelKraft/40 shadow-sm space-y-4">
              <span className="text-xs font-bold text-acentoTerracota lowercase tracking-wider block">
                público & contextos
              </span>
              <h3 className="text-2xl font-bold font-editorial text-acentoAzul lowercase">
                {fundSec.box1_title || 'pra quem é isso?'}
              </h3>
              <ul className="space-y-3 text-tintaCarvao/85 text-sm sm:text-base font-medium lowercase">
                {[
                  fundSec.box1_bullet1 || 'empresas & líderes: que buscam promover saúde mental, humanização, escuta ativa e integração genuína de equipes.',
                  fundSec.box1_bullet2 || 'retiros & imersões: facilitadores de autoconhecimento que desejam incluir rodas de partilha e rituais poéticos de escrita.',
                  fundSec.box1_bullet3 || 'festivais & eventos culturais: momentos de desaceleração e presença em meio a programações intensas.',
                  fundSec.box1_bullet4 || 'marcas & comemorações: ativações poéticas com cadernos afetivos e momentos memoráveis.',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-acentoOliva flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Box 2: Por que a escrita */}
            <div className="bg-bgPlataforma rounded-3xl p-7 sm:p-8 border border-papelKraft/40 shadow-sm space-y-4">
              <span className="text-xs font-bold text-acentoTerracota lowercase tracking-wider block">
                fundamentação & impacto
              </span>
              <h3 className="text-2xl font-bold font-editorial text-acentoAzul lowercase">
                {fundSec.box2_title || 'por que a escrita?'}
              </h3>
              <ul className="space-y-3 text-tintaCarvao/85 text-sm sm:text-base font-medium lowercase">
                {[
                  fundSec.box2_bullet1 || 'desaceleração consciente: uma pausa no piloto automático e nas telas para respirar e sentir.',
                  fundSec.box2_bullet2 || 'segurança psicológica: criar um ambiente onde todos se sentem acolhidos para se expressar sem julgamento.',
                  fundSec.box2_bullet3 || 'escuta ativa: ouvir o outro com presença genuína, fortalecendo a empatia do grupo.',
                  fundSec.box2_bullet4 || 'expressão autêntica: colocar no papel sentimentos que muitas vezes não encontram espaço na fala cotidiana.',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-acentoOliva flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* TEORIA + PRÁTICA (Pennebaker & Ebbinghaus) */}
          <div className="bg-bgPlataforma rounded-3xl p-7 sm:p-10 border border-papelKraft/60 shadow-sm space-y-4 max-w-6xl mx-auto relative overflow-hidden">
            <span className="text-xs font-bold text-acentoTerracota lowercase tracking-widest block">
              teoria + prática / o que sustenta a nossa escrita
            </span>
            <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-acentoAzul lowercase">
              {fundSec.pennebaker_title || 'nosso trabalho nasce de estudo e de vivência'}
            </h3>
            <p className="text-tintaCarvao/90 text-base sm:text-lg leading-relaxed font-medium lowercase">
              {fundSec.pennebaker_desc || 'não improvisamos. cada encontro que desenhamos parte de referências consistentes, como as pesquisas de james pennebaker sobre escrita expressiva e seus efeitos no bem-estar emocional, e a curva do esquecimento de ebbinghaus, que mostra por que a escrita precisa ser prática sustentada e não um evento isolado.'}
            </p>
            <p className="text-acentoAzul font-bold text-base sm:text-lg lowercase pt-2">
              {fundSec.pennebaker_highlight || 'é por isso que não entregamos só uma oficina bonita: desenhamos jornadas que continuam vivas depois que a gente vai embora.'}
            </p>
          </div>
        </div>
      </section>

      {/* 7. FORMATOS DE EXPERIÊNCIAS DISPONÍVEIS (4 Bento Cards + 1 Banner Separado) */}
      <section id="formatos" className="py-20 sm:py-28 bg-bgPlataforma">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-papelClaro border border-papelKraft/40 text-acentoAzul text-xs sm:text-sm font-semibold lowercase tracking-wider mb-4 shadow-sm">
              <Compass className="w-4 h-4 text-acentoTerracota" />
              <span>{formatosSec.badge_text || 'formatos sob medida'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-editorial text-acentoAzul lowercase mb-4">
              {formatosSec.title || 'como levamos a experiência até você'}
            </h2>
            <p className="text-tintaCarvao/80 text-base sm:text-lg font-medium lowercase">
              {formatosSec.subtitle || 'quatro caminhos autorais adaptados para o formato e objetivo da sua iniciativa.'}
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
                  {formatosSec.f1_title || 'oficinas corporativas & integração'}
                </h3>
                <p className="text-tintaCarvao/85 text-xs sm:text-sm leading-relaxed lowercase font-medium mb-6">
                  {formatosSec.f1_desc || 'vivências práticas para empresas que buscam fortalecer a empatia, desacelerar a rotina de trabalho e cultivar um clima de confiança através da escrita consciente.'}
                </p>
              </div>

              <div className="pt-4 border-t border-papelKraft/30">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-full bg-acentoAzul/10 hover:bg-acentoAzul text-acentoAzul hover:text-white transition-all text-xs font-bold flex items-center justify-center gap-2 lowercase cursor-pointer"
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
                  {formatosSec.f2_title || 'retiros, festivais & coletivos'}
                </h3>
                <p className="text-tintaCarvao/85 text-xs sm:text-sm leading-relaxed lowercase font-medium mb-6">
                  {formatosSec.f2_desc || 'rituais de abertura e encerramento, rodas de partilha e cadernos de bordo, pensados pra festivais, retiros e encontros que já nascem com escuta no centro.'}
                </p>
              </div>

              <div className="pt-4 border-t border-papelKraft/30">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-full bg-acentoTerracota/10 hover:bg-acentoTerracota text-acentoTerracota hover:text-white transition-all text-xs font-bold flex items-center justify-center gap-2 lowercase cursor-pointer"
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
                  {formatosSec.f3_title || 'ativações de marca & festas'}
                </h3>
                <p className="text-tintaCarvao/85 text-xs sm:text-sm leading-relaxed lowercase font-medium mb-6">
                  {formatosSec.f3_desc || 'curadoria de ambientes afetivos, escrita poética personalizada ao vivo e brindes gráficos memoráveis para marcas e celebrações especiais.'}
                </p>
              </div>

              <div className="pt-4 border-t border-papelKraft/30">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-full bg-acentoOliva/30 hover:bg-acentoOliva text-acentoAzul transition-all text-xs font-bold flex items-center justify-center gap-2 lowercase cursor-pointer"
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
                  {formatosSec.f4_title || 'escrita para quem está aprendendo'}
                </h3>
                <p className="text-tintaCarvao/85 text-xs sm:text-sm leading-relaxed lowercase font-medium mb-6">
                  {formatosSec.f4_desc || 'atividades de escrita criativa para crianças, jovens e educadores, desenvolvendo imaginação, autoria e escuta desde cedo.'}
                </p>
              </div>

              <div className="pt-4 border-t border-papelKraft/30">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-full bg-acentoAzul/10 hover:bg-acentoAzul text-acentoAzul hover:text-white transition-all text-xs font-bold flex items-center justify-center gap-2 lowercase cursor-pointer"
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
                {formatosSec.sob_medida_title || 'textos autorais para momentos especiais'}
              </h3>
              <p className="text-tintaCarvao/85 text-base sm:text-lg leading-relaxed lowercase font-medium max-w-3xl">
                {formatosSec.sob_medida_desc || 'escrevemos textos poéticos sob medida para casamentos, homenagens, celebrações de vida e marcos institucionais de empresas: ouvimos a sua história e a devolvemos em palavras inesquecíveis.'}
              </p>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pill-primary text-base px-8 py-3.5 rounded-full flex items-center gap-2 flex-shrink-0 cursor-pointer lowercase shadow-md"
            >
              <span>{formatosSec.sob_medida_button || 'encomendar um texto'}</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </a>
          </div>
        </div>
      </section>

      {/* 8. COMO FUNCIONA O PROCESSO DE CRIAÇÃO (4 Etapas) */}
      <section className="py-24 sm:py-32 bg-papelClaro border-t border-b border-papelKraft/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-bgPlataforma border border-papelKraft/40 text-acentoAzul text-xs sm:text-sm font-semibold lowercase tracking-wider mb-4 shadow-sm">
              <Clock className="w-4 h-4 text-acentoTerracota" />
              <span>{passoSec.badge_text || 'passo a passo da contratação'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-editorial text-acentoAzul lowercase mb-4">
              {passoSec.title || 'como construímos a experiência juntos'}
            </h2>
            <p className="text-tintaCarvao/80 text-base sm:text-lg font-medium lowercase">
              {passoSec.subtitle || 'quatro etapas simples para criar uma vivência perfeita para o seu grupo.'}
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

      {/* 9. FACILITADORAS DO PROGRAMA */}
      <FoundersSection />

      {/* 10. DEPOIMENTOS / RELATOS & PRINTS REAIS (DEPLOYMENTS) */}
      <section className="py-20 sm:py-28 bg-papelClaro border-t border-b border-papelKraft/40 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-bgPlataforma border border-papelKraft/40 text-acentoAzul text-xs sm:text-sm font-semibold lowercase tracking-wider mb-4 shadow-sm">
              <Quote className="w-4 h-4 text-acentoTerracota" />
              <span>{depoimentosSec.badge_text || 'relatos & impressões reais'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-editorial text-acentoAzul lowercase mb-4">
              {depoimentosSec.title || 'vozes e vivências da comunidade'}
            </h2>
            <p className="text-tintaCarvao/80 text-base sm:text-lg font-medium lowercase">
              {depoimentosSec.subtitle || 'depoimentos reais de quem já participou das nossas oficinas e encontros.'}
            </p>
          </div>

          {/* Componente de Carrossel de Screenshots e Depoimentos */}
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
                const itemIndex = (carouselIndex + offset) % (activeDeploymentItems.length || 1);
                const item = activeDeploymentItems[itemIndex] || {
                  id: 'd1',
                  title: 'partilha e acolhimento',
                  src: '/brand-assets/deployments/IMG_2847.PNG',
                  tag: 'experiências sob medida',
                };
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
                        setSelectedScreenshot(item.src!);
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
                        
                        {/* Hint Overlay para Ampliar */}
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
                          <p className="text-tintaCarvao/90 text-sm sm:text-base leading-relaxed font-medium lowercase line-clamp-8 font-editorial italic">
                            &ldquo;{item.quote}&rdquo;
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

                        {/* Hint Overlay para Citação */}
                        <div className="absolute inset-0 bg-acentoAzul/20 opacity-0 group-hover/quote:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-xs">
                          <div className="bg-papelClaro/95 text-acentoAzul font-bold px-4 py-2.5 rounded-full text-xs flex items-center gap-2 shadow-xl border border-papelKraft/50 lowercase">
                            <BookOpen className="w-4 h-4 text-acentoTerracota" />
                            <span>ler depoimento completo</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs font-bold text-acentoAzul font-editorial lowercase truncate max-w-[170px]">
                        {item.title}
                      </span>
                      <span className="text-[10px] font-bold text-acentoTerracota bg-acentoTerracota/10 px-2 py-0.5 rounded-full lowercase flex-shrink-0">
                        {item.tag}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pílulas Indicadoras do Carrossel */}
            <div className="flex justify-center items-center gap-2 mt-8">
              {activeDeploymentItems.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCarouselIndex(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
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

      {/* 11. BANNER FINAL DE CONVERSÃO NO WHATSAPP (Sem Preço) */}
      <section className="py-24 sm:py-32 bg-bgPlataforma relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-acentoAzul text-white rounded-3xl p-8 sm:p-14 border border-white/20 shadow-kraft-lg text-center space-y-8 relative overflow-hidden">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-acentoOliva text-xs sm:text-sm font-semibold lowercase tracking-wider">
              <span>{finalCtaSec.badge_text || 'vamos criar juntos'}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-editorial text-papelClaro lowercase">
              {finalCtaSec.title || 'vamos desenhar algo especial juntos?'}
            </h2>

            <p className="text-papelClaro/85 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed font-medium lowercase">
              {finalCtaSec.subtitle || 'fale diretamente com a gente no whatsapp e receba a proposta detalhada.'}
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-pill-accent text-lg px-10 py-4 rounded-full shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-3 w-full sm:w-auto lowercase cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 fill-white text-acentoAzul" />
                <span>{finalCtaSec.button_text || 'solicitar proposta no whatsapp'}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 12. FAQ B2B */}
      <section className="py-20 sm:py-28 bg-papelClaro border-t border-b border-papelKraft/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold font-editorial text-acentoAzul lowercase mb-3">
              {faqSec.title || 'perguntas frequentes sobre nossas experiências'}
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

      {/* MODAL DE ZOOM DE IMAGEM DO PRINT DA COMUNIDADE */}
      {selectedScreenshot && (
        <div
          className="fixed inset-0 z-50 bg-tintaCarvao/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setSelectedScreenshot(null)}
        >
          <div
            className="relative max-w-2xl w-full max-h-[90vh] bg-papelClaro rounded-3xl p-3 border border-papelKraft/60 shadow-2xl flex flex-col items-center overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedScreenshot(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-acentoAzul text-white flex items-center justify-center hover:bg-acentoTerracota transition cursor-pointer shadow-md"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-full h-full max-h-[80vh] overflow-y-auto rounded-2xl flex items-center justify-center p-2">
              <img
                src={selectedScreenshot}
                alt="depoimento em tela cheia"
                className="w-full h-auto max-h-[75vh] object-contain rounded-xl shadow-sm"
              />
            </div>
            <p className="text-xs font-mono text-tintaCarvao/60 lowercase mt-2 text-center">
              relato real da comunidade // solta o verbo
            </p>
          </div>
        </div>
      )}

      {/* MODAL DE CITAÇÃO POÉTICA DEPOIMENTO COMPLETO */}
      {selectedQuoteModal && (
        <div
          className="fixed inset-0 z-50 bg-tintaCarvao/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setSelectedQuoteModal(null)}
        >
          <div
            className="relative max-w-xl w-full bg-papelClaro rounded-3xl p-6 sm:p-8 border border-papelKraft/60 shadow-2xl space-y-6 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedQuoteModal(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-acentoAzul text-white flex items-center justify-center hover:bg-acentoTerracota transition cursor-pointer shadow-md"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4 pt-2">
              <span className="text-5xl font-editorial text-acentoTerracota block font-bold leading-none">“</span>
              <p className="text-tintaCarvao text-base sm:text-lg leading-relaxed font-editorial italic lowercase">
                &ldquo;{selectedQuoteModal.quote}&rdquo;
              </p>
            </div>

            <div className="pt-4 border-t border-papelKraft/40 flex justify-between items-center">
              <div>
                <p className="font-editorial text-base font-bold text-acentoAzul lowercase">
                  {selectedQuoteModal.author}
                </p>
                {selectedQuoteModal.role && (
                  <p className="text-xs text-tintaCarvao/60 font-medium lowercase">
                    {selectedQuoteModal.role}
                  </p>
                )}
              </div>
              <span className="text-xs font-bold text-acentoTerracota bg-acentoTerracota/10 px-3 py-1 rounded-full lowercase">
                relato real
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 13. PreLoginFooter Poético com Shader WebGL */}
      <PreLoginFooter />
    </div>
  );
}
