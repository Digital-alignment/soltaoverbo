import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Quote,
  Heart,
  Pencil,
  BookOpen,
  Users,
} from 'lucide-react';
import PreLoginNavbar from '../components/PreLoginNavbar';
import PreLoginFooter from '../components/PreLoginFooter';
import FaqAccordion from '../components/FaqAccordion';
import ContrateExperienciaSection from '../components/ContrateExperienciaSection';
import FoundersSection from '../components/FoundersSection';
import { BRAND_ASSETS } from '../config/brandAssets';

export default function Landing() {
  const pillars = [
    {
      title: 'essência humana',
      description:
        'escrever é mais do que juntar palavras: é um jeito de ouvir o que vive dentro, organizar o caos e dar forma ao que ainda é sussurro.',
    },
    {
      title: 'disciplina criativa',
      description:
        'criar hábitos de escrita que não pesem como obrigação, mas que funcionem como pequenos rituais de presença e alívio mental.',
    },
    {
      title: 'viver em coletivo',
      description:
        'acreditamos que ninguém deveria atravessar transições sozinha. estar em comunidade protege a saúde mental e reduz a solidão.',
    },
    {
      title: 'ampliar o olhar',
      description:
        'escrever e escutar em grupo exercita empatia, alarga perspectivas e ajuda a encontrar novos significados para velhas cenas.',
    },
    {
      title: 'sair do modo passivo',
      description:
        'a escrita ajuda a questionar narrativas herdadas, tomar decisões mais conscientes e transformar preocupação em movimento.',
    },
    {
      title: 'autonomia e coragem',
      description:
        'o propósito é que cada pessoa se torne autora da própria história, com ferramentas internas e clareza de direção.',
    },
  ];

  const testimonials = [
    {
      quote:
        'o solta o verbo me devolveu a coragem de colocar no papel aquilo que eu nem sabia que precisava dizer. a comunidade é um abraço quente em dias frios.',
      author: 'marina lima',
      role: 'aluna dos 21 dias de escrita',
    },
    {
      quote:
        'os encontros do ciclo de aprofundamento viraram o momento mais esperado da minha semana. as facilitadoras conduzem cada roda com uma sensibilidade única.',
      author: 'carla mendes',
      role: 'membro do ciclo de aprofundamento',
    },
    {
      quote:
        'participar do café com letras foi um divisor de águas. descobri que a escrita não precisa ser solitária, mas sim uma partilha viva.',
      author: 'luciana albuquerque',
      role: 'participante do café com letras',
    },
  ];

  return (
    <div className="min-h-screen bg-bgPlataforma text-tintaCarvao selection:bg-acentoTerracota/20 selection:text-acentoAzul">
      {/* 1. Header Navbar Pré-Login Sticky */}
      <PreLoginNavbar />

      {/* 2. HERO SECTION */}
      <section className="relative pt-12 pb-20 sm:pt-16 sm:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Coluna Esquerda: Manifiesto & Botões de Ação */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-papelClaro border border-papelKraft/60 text-acentoAzul text-xs sm:text-sm font-semibold lowercase shadow-sm">
                <img
                  src="/brand-assets/icons/icone_63.svg"
                  alt="chama viva"
                  className="w-[3.5rem] h-auto object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <span>mentoria coletiva & escrita consciente</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-editorial text-acentoAzul lowercase leading-[1.1] tracking-tight">
                roteiro original: <br className="hidden sm:inline" />
                <span className="font-gesto text-acentoTerracota font-normal text-5xl sm:text-6xl lg:text-7xl block mt-1">
                  a narrativa muda
                </span>{' '}
                a partir do ponto que você solta o verbo.
              </h1>

              <p className="text-tintaCarvao/85 text-lg sm:text-xl leading-relaxed max-w-2xl font-medium lowercase">
                reescreva sua história, amplie perspectivas e abra espaço para uma escrita mais consciente. um convite para questionar narrativas impostas e escrever seu próprio caminho.
              </p>

              {/* Botões CTA Principais */}
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <a
                  href="#produtos"
                  className="btn-pill-primary text-base sm:text-lg px-8 py-3.5 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2.5"
                >
                  <span>conhecer os programas</span>
                  <Pencil className="w-5 h-5 text-white" />
                </a>

                <a
                  href="#sobre-nos"
                  className="bg-acentoAzul text-white hover:bg-acentoAzul/90 hover:scale-105 text-base sm:text-lg px-8 py-3.5 rounded-full font-medium transition-all shadow-md flex items-center gap-2.5 cursor-pointer"
                >
                  <span>saiba mais</span>
                  <ArrowRight className="w-5 h-5 text-white flex-shrink-0" />
                </a>
              </div>
            </div>

            {/* Coluna Direita: Card Bento Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl bg-papelClaro p-8 sm:p-12 border border-papelKraft/60 shadow-kraft-lg overflow-hidden group">
                <div className="absolute -top-10 -right-10 opacity-10 transition-transform duration-700 group-hover:rotate-12">
                  <img
                    src={BRAND_ASSETS.logos.icon}
                    alt="monograma sv"
                    className="w-72 h-72 object-contain"
                  />
                </div>

                <div className="relative z-10 space-y-6 py-4">
                  <blockquote className="font-editorial text-2xl sm:text-3xl lg:text-4xl text-acentoAzul leading-snug font-bold lowercase">
                    “a palavra dita alivia. a palavra escrita liberta e constrói o amanhã.”
                  </blockquote>

                  <div className="pt-6 border-t border-papelKraft/40">
                    <p className="font-bold text-acentoAzul text-lg lowercase">
                      comunidade solta o verbo
                    </p>
                    <p className="text-sm text-tintaCarvao/60 lowercase font-medium">
                      movimento de escrita e presença
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SEÇÃO DOS 3 PRODUTOS */}
      <section id="produtos" className="py-20 sm:py-28 bg-papelClaro border-t border-b border-papelKraft/50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-14 sm:mb-20">
            {/* Em versão móvel: A imagem aparece ANTES do título */}
            <div className="block lg:hidden w-full max-w-xs mx-auto mb-6">
              <img
                src="/brand-assets/elements/collages/writes-torn-out-sheets-paper-trendy-vintage-style-mixed-media-art.png"
                alt="escrita artesanal"
                className="w-full h-auto object-contain drop-shadow-md animate-fadeIn"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Coluna Esquerda: Título & Subtítulo alinhados para o lado esquerdo no desktop */}
              <div className="lg:col-span-7 text-center lg:text-left space-y-4">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-editorial text-acentoAzul lowercase leading-[1.15]">
                  escolha a experiência ideal para o seu momento
                </h2>
                <p className="text-tintaCarvao/80 text-base sm:text-lg font-medium lowercase max-w-2xl mx-auto lg:mx-0">
                  três formatos desenhados para acolher a sua jornada de escrita, do primeiro passo ao aprofundamento contínuo.
                </p>
              </div>

              {/* Coluna Direita: Imagem com efeito de aparição da direita (Apenas Desktop) */}
              <div className="hidden lg:flex lg:col-span-5 justify-end relative">
                <div className="relative max-w-sm w-full animate-slideInRight group">
                  <img
                    src="/brand-assets/elements/collages/writes-torn-out-sheets-paper-trendy-vintage-style-mixed-media-art.png"
                    alt="colagem poética de escrita"
                    className="w-full h-auto object-contain drop-shadow-lg transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-16">
            {/* PRODUTO 1: 21 Dias de Escrita */}
            <div className="rounded-3xl bg-bgPlataforma p-8 sm:p-12 border border-papelKraft/60 shadow-kraft-lg relative overflow-hidden group">
              <div className="absolute -bottom-12 -right-12 opacity-[0.06] pointer-events-none select-none transition-transform duration-700 group-hover:scale-105">
                <img
                  src="/brand-assets/icons/icone_63.svg"
                  alt="watermark"
                  className="w-96 h-96 object-contain"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative z-10">
                <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-3xl sm:text-4xl font-bold font-editorial text-acentoAzul lowercase">
                      21 dias de escrita (sua história tem valor)
                    </h3>

                    <p className="text-tintaCarvao/85 text-base sm:text-lg leading-relaxed lowercase font-medium">
                      uma jornada prática de 21 dias para desbloquear sua voz e criar um hábito vivo de escrita guiada. receba exercícios diários, áudios inspiradores e acesso à fogueira de apoio durante todo o desafio.
                    </p>

                    <ul className="space-y-3 pt-2 text-tintaCarvao/90 font-medium text-base lowercase">
                      <li className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-acentoOliva flex-shrink-0" />
                        <span>21 exercícios práticos de escrita consciente liberados dia a dia</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-acentoOliva flex-shrink-0" />
                        <span>áudios de reflexão e acervo em formato de podcast interno</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-acentoOliva flex-shrink-0" />
                        <span>acesso à fogueira comunitária durante os 21 dias de jornada</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-6 border-t border-papelKraft/40 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                    <div className="space-y-0.5">
                      <span className="text-[11px] font-bold text-tintaCarvao/60 lowercase block">
                        investimento à vista
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl sm:text-3xl font-bold font-editorial text-acentoAzul">
                          R$ 77,00
                        </span>
                        <span className="text-xs sm:text-sm font-medium text-tintaCarvao/70 lowercase">
                          (ou 2x R$ 38,50)
                        </span>
                      </div>
                    </div>

                    <Link
                      to="/register?product=21dias"
                      className="btn-pill-primary text-base px-7 py-3 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2"
                    >
                      <span>garantir minha vaga</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                <div className="lg:col-span-5 flex flex-col justify-between bg-papelClaro p-6 sm:p-8 rounded-2xl border border-papelKraft/50 space-y-5 shadow-sm">
                  <div className="w-full h-48 sm:h-56 rounded-xl overflow-hidden border border-papelKraft/40 relative shadow-sm group">
                    <img
                      src="/brand-assets/elements/collages/png-retro-collages-whit-book-publication-flower-plant.png"
                      alt="arte e escrita solta o verbo"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/brand-assets/gallery/events/13062026-IMG_6581-2.jpg';
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xl font-bold font-editorial text-acentoAzul lowercase">
                      para quem é este programa?
                    </h4>
                    <p className="text-tintaCarvao/80 text-sm sm:text-base leading-relaxed lowercase font-medium">
                      ideal para quem deseja destravar a escrita, organizar pensamentos soltos e criar uma rotina constante sem pressão de perfeccionismo.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* PRODUTO 2: Ciclo de Aprofundamento */}
            <div className="rounded-3xl bg-acentoAzul text-white p-8 sm:p-12 shadow-kraft-lg relative overflow-hidden border border-white/20 group">
              <div className="absolute -bottom-12 -right-12 opacity-[0.08] pointer-events-none select-none transition-transform duration-700 group-hover:scale-105">
                <img
                  src="/brand-assets/logos/monogram/monograma-sv-white.svg"
                  alt="watermark"
                  className="w-96 h-96 object-contain"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative z-10">
                <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-3xl sm:text-4xl font-bold font-editorial text-papelClaro lowercase">
                      ciclo de aprofundamento (comunidade paga)
                    </h3>

                    <p className="text-papelClaro/90 text-base sm:text-lg leading-relaxed lowercase font-medium">
                      o espaço contínuo de mentoria e escrita em grupo. encontros quinzenais ao vivo com bruna e júlia, mentoria em tempo real, acervo completo de gravações e acesso ilimitado à fogueira durante todo o ano.
                    </p>

                    <ul className="space-y-3 pt-2 text-papelClaro/90 font-medium text-base lowercase">
                      <li className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-acentoOliva flex-shrink-0" />
                        <span>encontros quinzenais ao vivo no zoom com mentorias coletivas</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-acentoOliva flex-shrink-0" />
                        <span>acesso contínuo e ilimitado à fogueira de partilha 365 dias por ano</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-acentoOliva flex-shrink-0" />
                        <span>acervo completo de todas as aulas, oficinas e materiais gravados</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-6 border-t border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                    <div className="space-y-0.5">
                      <span className="text-[11px] font-bold text-papelClaro/70 lowercase block">
                        plano anual especial
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl sm:text-3xl font-bold font-editorial text-white">
                          R$ 597,00
                        </span>
                        <span className="text-xs sm:text-sm font-medium text-papelClaro/80 lowercase">
                          / ano (ou 3x R$ 239,00)
                        </span>
                      </div>
                    </div>

                    <Link
                      to="/register?product=ciclo"
                      className="btn-pill-accent text-base px-7 py-3 rounded-full shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2"
                    >
                      <span>fazer parte do ciclo</span>
                      <Users className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                <div className="lg:col-span-5 flex flex-col justify-between bg-white/10 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-white/20 space-y-5 shadow-sm">
                  <div className="w-full h-48 sm:h-56 rounded-xl overflow-hidden border border-white/20 relative shadow-sm group">
                    <img
                      src="/brand-assets/gallery/events/13062026-IMG_5364-2.jpg"
                      alt="comunidade ciclo de aprofundamento"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/brand-assets/elements/collages/png-person-reading-book-flower-sitting-person.png';
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xl font-bold font-editorial text-papelClaro lowercase">
                      o que você vivencia no ciclo?
                    </h4>
                    <p className="text-papelClaro/85 text-sm sm:text-base leading-relaxed lowercase font-medium">
                      uma comunidade madura, onde a escrita é tratada com profundidade, acolhimento e compromisso com o desenvolvimento humano contínuo.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* PRODUTO 3: Café com Letras */}
            <div className="rounded-3xl bg-bgPlataforma p-8 sm:p-12 border border-papelKraft/60 shadow-kraft-lg relative overflow-hidden group">
              <div className="absolute -bottom-12 -right-12 opacity-[0.06] pointer-events-none select-none transition-transform duration-700 group-hover:scale-105">
                <img
                  src="/brand-assets/icons/icone_63.svg"
                  alt="watermark"
                  className="w-96 h-96 object-contain"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative z-10">
                <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-3xl sm:text-4xl font-bold font-editorial text-acentoAzul lowercase">
                      café com letras (rodas de escrita)
                    </h3>

                    <p className="text-tintaCarvao/85 text-base sm:text-lg leading-relaxed lowercase font-medium">
                      nossas rodas temáticas presenciais e virtuais com café quente, cadernos abertos e leitura em grupo. um espaço intimista para experimentar propostas poéticas pontuais.
                    </p>
                  </div>

                  <div className="pt-6 border-t border-papelKraft/40 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                    <div className="space-y-0.5">
                      <span className="text-[11px] font-bold text-tintaCarvao/60 lowercase block">
                        modalidade por edição
                      </span>
                      <span className="text-2xl sm:text-3xl font-bold font-editorial text-acentoAzul lowercase block">
                        inscrições por evento
                      </span>
                    </div>

                    <Link
                      to="/programs#cafe-com-letras"
                      className="btn-pill-secondary text-base px-7 py-3 rounded-full border border-papelKraft/70 hover:bg-papelClaro transition-all flex items-center justify-center gap-2"
                    >
                      <span>ver próximas edições</span>
                      <ArrowRight className="w-4 h-4 text-acentoAzul" />
                    </Link>
                  </div>
                </div>

                <div className="lg:col-span-5 flex flex-col justify-between bg-papelClaro p-6 sm:p-8 rounded-2xl border border-papelKraft/50 space-y-5 shadow-sm">
                  <div className="w-full h-48 sm:h-56 rounded-xl overflow-hidden border border-papelKraft/40 relative shadow-sm group">
                    <img
                      src="/brand-assets/gallery/events/13062026-IMG_6666-2.jpg"
                      alt="café com letras roda de escrita"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/brand-assets/elements/collages/png-retro-collages-whit-book-publication-flower-plant.png';
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xl font-bold font-editorial text-acentoAzul lowercase">
                      um respiro na rotina
                    </h4>
                    <p className="text-tintaCarvao/80 text-sm sm:text-base leading-relaxed lowercase font-medium">
                      ideais para quem quer experimentar a metodologia do solta o verbo de forma leve e ter um momento de pausa poética no seu mês.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PILARES DA ESCRITA CONSCIENTE */}
      <section className="py-20 sm:py-28 bg-bgPlataforma relative overflow-hidden">
        {/* Textura de Fundo */}
        <div
          className="absolute inset-0 opacity-[0.05] bg-cover bg-center pointer-events-none mix-blend-multiply"
          style={{ backgroundImage: "url('/brand-assets/textures/papel-semente.jpg')" }}
        />

        {/* Elemento Gráfico de Colagem Retro Animal no Canto Inferior Esquerdo (Desktop UI Elegante) */}
        <div className="hidden lg:block absolute -bottom-10 left-2 xl:left-8 z-0 pointer-events-none select-none opacity-90 transition-transform duration-700 hover:scale-105">
          <img
            src="/brand-assets/elements/collages/retro-animal-collage-sticker-png-scrapbook-paper-clip-art-border-frame.png"
            alt="colagem retro animal scrapbook"
            className="w-72 xl:w-80 h-auto object-contain drop-shadow-md"
          />
        </div>

        {/* Em versão móvel: Fica sutilmente atrás dos cards sem poluir */}
        <div className="block lg:hidden absolute -bottom-8 -left-8 z-0 pointer-events-none select-none opacity-20">
          <img
            src="/brand-assets/elements/collages/retro-animal-collage-sticker-png-scrapbook-paper-clip-art-border-frame.png"
            alt="colagem retro animal scrapbook"
            className="w-52 h-auto object-contain"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-editorial text-acentoAzul lowercase mb-3">
              os fundamentos do nosso movimento
            </h2>
            <p className="text-tintaCarvao/80 text-base sm:text-lg font-medium lowercase">
              nossa prática é sustentada por valores que colocam a humanidade e a presença no centro.
            </p>
          </div>

          {/* Grid de Cards com Respiro no Desktop para destacar a Colagem */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:pl-16 xl:pl-20 relative z-10">
            {pillars.map((pillar, index) => (
              <div
                key={index}
                className="bg-papelClaro/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-7 border border-papelKraft/60 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-papelKraft relative overflow-hidden flex flex-col justify-between"
              >
                <span className="text-3xl sm:text-4xl font-bold font-editorial text-acentoAzul/15 absolute top-3.5 right-5 select-none">
                  0{index + 1}
                </span>

                <div>
                  <div className="w-6 h-1 rounded-full bg-acentoOliva mb-3.5" />
                  <h3 className="text-xl sm:text-2xl font-bold font-editorial text-acentoAzul lowercase mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-tintaCarvao/85 text-sm sm:text-base leading-relaxed lowercase font-medium">
                    {pillar.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. DEPOIMENTOS & PROVA SOCIAL */}
      <section className="py-24 sm:py-32 bg-papelClaro border-t border-b border-papelKraft/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-bgPlataforma border border-papelKraft/60 text-acentoAzul text-xs sm:text-sm font-semibold lowercase mb-4 shadow-sm">
              <Heart className="w-4 h-4 text-acentoTerracota" />
              <span>vozes da nossa comunidade</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-editorial text-acentoAzul lowercase mb-4">
              o que dizem as pessoas que soltam o verbo
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((item, idx) => (
              <div
                key={idx}
                className="bg-bgPlataforma/70 rounded-3xl p-8 border border-papelKraft/60 shadow-kraft flex flex-col justify-between relative"
              >
                <Quote className="w-8 h-8 text-acentoAzul/20 mb-4" />
                <p className="text-tintaCarvao/90 text-base sm:text-lg leading-relaxed lowercase font-medium italic mb-6">
                  “{item.quote}”
                </p>

                <div className="flex items-center gap-3.5 pt-4 border-t border-papelKraft/40">
                  <div className="w-11 h-11 rounded-full bg-acentoAzul text-white font-bold flex items-center justify-center text-sm shadow-sm lowercase font-editorial">
                    {item.author.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-acentoAzul text-base lowercase">
                      {item.author}
                    </h4>
                    <p className="text-xs text-tintaCarvao/60 lowercase font-medium">
                      {item.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. SEÇÃO SOBRE AS CO-CRIADORAS */}
      <FoundersSection />

      {/* 7. SEÇÃO B2B: CONTRATE UMA EXPERIÊNCIA (Com Carrossel Animado de Fotos) */}
      <ContrateExperienciaSection />

      {/* 8. PERGUNTAS FREQUENTES */}
      <FaqAccordion />

      {/* 9. PreLoginFooter Poético */}
      <PreLoginFooter />
    </div>
  );
}
