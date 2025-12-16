import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2, BookOpen, Users, Lightbulb, Heart, Pen, ChevronDown, ChevronLeft, ChevronRight, PenTool, Sparkles, RefreshCw } from 'lucide-react';
import PreLoginNavbar from '../components/PreLoginNavbar';
import PreLoginFooter from '../components/PreLoginFooter';
import PaymentModal from '../components/PaymentModal';
import AuthPromptModal from '../components/AuthPromptModal';
import WavyLine from '../components/WavyLine';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export default function RoteiroOriginal() {
  const { user } = useAuth();
  const location = useLocation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [visibleSteps, setVisibleSteps] = useState<Set<number>>(new Set());
  const [visibleSections, setVisibleSections] = useState<Set<number>>(new Set());
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isAuthPromptModalOpen, setIsAuthPromptModalOpen] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const stepsRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);

    const params = new URLSearchParams(location.search);
    const openCheckout = params.get('openCheckout');

    if (openCheckout === 'true' && user) {
      const checkoutIntent = localStorage.getItem('checkout_intent');
      if (checkoutIntent) {
        setIsPaymentModalOpen(true);
        localStorage.removeItem('checkout_intent');
      }
    }
  }, [location, user]);

  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 2);
    }, 9000);
    return () => clearInterval(interval);
  }, [autoPlay]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = stepsRefs.current.indexOf(entry.target as HTMLDivElement);
            if (index !== -1) {
              setVisibleSteps((prev) => new Set([...prev, index]));
            }
            const sectionIndex = sectionRefs.current.indexOf(entry.target as HTMLDivElement);
            if (sectionIndex !== -1) {
              setVisibleSections((prev) => new Set([...prev, sectionIndex]));
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    stepsRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      stepsRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
      sectionRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  const trackCheckoutAttempt = async () => {
    try {
      await supabase.from('checkout_attempts').insert({
        user_id: user?.id || null,
        email: user?.email || '',
        source_page: 'roteiro-original',
        attempted_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error tracking checkout attempt:', error);
    }
  };

  const handleCheckoutClick = async () => {
    await trackCheckoutAttempt();

    if (!user) {
      setIsAuthPromptModalOpen(true);
    } else {
      setIsPaymentModalOpen(true);
    }
  };

  const heroSlides = [
    {
      title: 'roteiro original',
      subtitle: 'construa seu próprio caminho autoral',
      description: 'um convite para questionar as antigas narrativas impostas que já não condizem com o que você quer contar sobre a sua vida.',
      ctaText: 'garantir minha vaga e começar a transformação',
      image: '/whatsapp_image_2025-12-11_at_4.25.25_pm.jpeg'
    },
    {
      title: 'inspiração coletiva',
      subtitle: '',
      description: 'para se inspirar com as histórias de outras pessoas em processo de reinvenção, percebendo que você não está sozinho(a) nas dúvidas.',
      ctaText: 'garantir minha vaga e começar a transformação',
      image: '/whatsapp_image_2025-12-11_at_3.35.23_pm.jpeg'
    }
  ];

  const journeySteps = [
    { date: '13/01', title: 'prólogo – abertura do caminho', desc: 'o chamado à jornada, conexão inicial do grupo, apresentação dos propósitos e combinados.', guest: null },
    { date: '20/01', title: 'capítulo 1 – era uma vez: perspectivas', desc: 'reconhecimento do passado, das narrativas herdadas e pertencimento.', guest: null },
    { date: '27/01', title: 'capítulo 1 – convidada', desc: 'elen cristina (corpo território) - "o futuro é ancestral."', guest: 'elen cristina' },
    { date: '03/02', title: 'capítulo 2 – o futuro se constrói em comunidade', desc: 'o poder do coletivo e como as histórias se entrelaçam na comunidade.', guest: null },
    { date: '10/02', title: 'capítulo 2 – convidada', desc: 'marcelle xavier (instituto amuta) - representa o espaço seguro para transformação, cura e construção coletiva.', guest: 'marcelle xavier' },
    { date: '17/02', title: 'capítulo 3 – clímax: o destino é a jornada em si', desc: 'reflexão sobre conquistas, dúvidas e o verdadeiro propósito da travessia.', guest: null },
    { date: '24/02', title: 'capítulo 3 – convidado', desc: 'gabriel tarso (fotógrafo e montanhista) - metáfora viva da entrega às montanhas e o aprendizado na travessia.', guest: 'gabriel tarso' },
    { date: '09/03', title: 'capítulo 4 – segura firme: a descida', desc: 'a descida como momento fértil de renovação e possibilidade de leveza.', guest: null },
    { date: '16/03', title: 'capítulo 4 – convidada', desc: 'caca rhenius (caórdico aprendizagem) - sabedoria da ludicidade, experimentação e prazer no aprender.', guest: 'caca rhenius' },
    { date: '23/03', title: 'capítulo 5 – e foram felizes para sempre?', desc: 'um olhar sobre finais e recomeços, e a continuidade da narrativa pessoal.', guest: null },
    { date: '30/03', title: 'capítulo 5 – convidado', desc: 'rodrigo brites (membuka) - transforma conversas difíceis em clareza: o que se mantém quando tudo muda?', guest: 'rodrigo brites' },
    { date: '02/04', title: 'epílogo – fechamento simbólico', desc: 'integração das vivências e celebração das novas narrativas construídas.', guest: null }
  ];

  const benefits = [
    { icon: Heart, title: 'autoconhecimento profundo', desc: 'para mergulhar no autoconhecimento de forma criativa, usando a escrita como ferramenta para elaborar histórias internas e fortalecer a própria autonomia nas decisões.' },
    { icon: BookOpen, title: 'escrita autêntica e curativa', desc: 'para aprender a escrever com verdade, indo além da técnica, e desenvolver uma prática que apoia reflexão, expressão e cura emocional.' },
    { icon: Users, title: 'inspiração coletiva', desc: 'para se inspirar com as histórias de outras pessoas em processo de reinvenção, percebendo que você não está sozinho(a) nas dúvidas.' },
    { icon: Lightbulb, title: 'clareza nas transições', desc: 'para atravessar transições pessoais ou profissionais com mais clareza, coragem e visão, transformando mudanças em oportunidade.' },
    { icon: Pen, title: 'libertação de padrões', desc: 'para se libertar de padrões limitantes, crenças antigas e narrativas cansadas, abrindo espaço para uma voz mais honesta.' },
    { icon: Users, title: 'pertencimento genuíno', desc: 'para pertencer a uma comunidade que valoriza sensibilidade, escuta e autenticidade, em que há trocas reais e apoio mútuo.' }
  ];

  const audienceTypes = [
    { icon: Sparkles, title: 'busca autoconhecimento criativo', desc: 'para quem sente um chamado para se conhecer melhor e quer um caminho criativo de autodesenvolvimento, sem fórmulas prontas.' },
    { icon: PenTool, title: 'deseja escrever com verdade', desc: 'para quem gosta de escrever (ou deseja começar) e quer usar a escrita como espaço de verdade, não só de técnica ou produtividade.' },
    { icon: RefreshCw, title: 'está em fase de transição', desc: 'para quem está atravessando mudanças internas, ciclos de encerramento ou recomeços e busca apoio.' }
  ];

  const bonusClasses = [
    { name: 'bruno kilary', focus: 'meditação e socioemocional', desc: 'silêncio, presença e autorregulação.' },
    { name: 'lucy hallak', focus: 'o olhar poético para o cotidiano', desc: 'a escrita como exercício de presença no mundo.' },
    { name: 'mauricio assis', focus: 'teu lugar no mundo', desc: 'comunidade, pertencimento e redes de apoio.' }
  ];

  const faqs = [
    { q: 'quando começa a mentoria?', a: 'a mentoria inicia terça-feira, dia 13 de janeiro.' },
    { q: 'as aulas são ao vivo?', a: 'sim! os encontros serão ao vivo, realizados pelo zoom, e as aulas ficarão gravadas e disponíveis no aplicativo da solta o verbo. é fundamental que se programe para participar ao vivo, pois sua presença é essencial para as trocas de experiências e para a construção da comunidade.' },
    { q: 'por quanto tempo terei acesso aos encontros gravados?', a: 'o acesso do curso tem duração de 1 ano a partir da data de início.' },
    { q: 'tem garantia?', a: 'sim. após o início da comunidade, você tem 7 dias de garantia incondicional. se por algum motivo você achar que as aulas e o método não corresponderam às suas expectativas, você pode solicitar seu dinheiro de volta (dentro dos 7 dias).' },
    { q: 'quais as formas de pagamento?', a: 'você pode parcelar em até 8x no cartão ou obter 5% de desconto no pagamento à vista via pix.' },
    { q: 'preciso saber escrever bem para participar?', a: 'não. aqui não avaliamos técnica literária. o foco é expressão, autenticidade e processo. a escrita é o canal, não o objetivo final.' },
    { q: 'o que acontece depois que a mentoria termina?', a: 'você pode continuar dentro da comunidade solta o verbo, com encontros periódicos e práticas de escrita, mantendo a rede de apoio ativa.' }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % 2);
    setAutoPlay(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + 2) % 2);
    setAutoPlay(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setAutoPlay(false);
  };

  const slide = heroSlides[currentSlide];

  return (
    <div className="min-h-screen bg-paper overflow-x-hidden">
      <PreLoginNavbar />

      {/* Hero Slider Section */}
      <section className="relative py-16 md:py-24 lg:py-32 overflow-hidden bg-deepBlue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div key={currentSlide} className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

            {/* Text Content */}
            <div className="order-2 lg:order-1 space-y-6">
              <h1 className="font-editorial text-4xl md:text-5xl lg:text-6xl font-bold text-paper leading-tight slide-fade-in-title">
                {slide.title}
              </h1>

              {slide.subtitle && (
                <p className="text-xl md:text-2xl text-paper/90 font-editorial slide-fade-in-subtitle">
                  {slide.subtitle}
                </p>
              )}

              <div className="pt-2 slide-fade-in-description">
                <WavyLine color="#BEC540" width={150} />
              </div>

              <p className="text-base md:text-lg text-paper/80 leading-relaxed max-w-xl slide-fade-in-description">
                {slide.description}
              </p>

              <div className="pt-4 slide-fade-in-buttons">
                <button
                  onClick={handleCheckoutClick}
                  className="btn-primary text-base md:text-lg px-6 py-3 md:px-8 md:py-4 hover:scale-105 transition-transform"
                >
                  {slide.ctaText}
                </button>
              </div>
            </div>

            {/* Image */}
            <div className="order-1 lg:order-2 flex justify-center lg:justify-end slide-fade-in-image">
              <div className="w-full max-w-md lg:max-w-lg h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden border-4 border-paper/20 shadow-2xl">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Slider Controls */}
          <div className="flex items-center justify-between mt-12 lg:mt-16 pt-8 border-t border-paper/20">
            <div className="flex gap-3">
              {heroSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToSlide(idx)}
                  className="transition-all duration-500"
                  aria-label={`ir para slide ${idx + 1}`}
                >
                  <div
                    className={`rounded-full transition-all duration-500 ${
                      idx === currentSlide ? 'w-8 h-3 bg-limeGreen' : 'w-3 h-3 bg-paper/40'
                    }`}
                  />
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={prevSlide}
                className="p-2 md:p-3 rounded-lg transition-all duration-300 hover:scale-110 border-2 border-paper/40 hover:border-limeGreen text-paper"
                aria-label="slide anterior"
              >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="p-2 md:p-3 rounded-lg transition-all duration-300 hover:scale-110 border-2 border-paper/40 hover:border-limeGreen text-paper"
                aria-label="próximo slide"
              >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section
        ref={(el) => { sectionRefs.current[0] = el; }}
        className={`py-20 md:py-28 bg-white border-y-2 border-deepBlue/10 transition-all duration-700 ${
          visibleSections.has(0) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-editorial text-3xl md:text-4xl lg:text-5xl text-deepBlue text-center mb-6">
            nossa metodologia
          </h2>

          <div className="flex justify-center mb-8">
            <WavyLine color="#FD5E32" width={180} />
          </div>

          <p className="text-center text-deepBlue/70 mb-16 text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
            uma jornada com 12 encontros divididos em 5 grandes temas, cada um acompanhado por uma pessoa inspiradora que amplia o olhar e provoca reflexões profundas.
          </p>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              { icon: Pen, title: 'escrita criativa + investigação interna', desc: 'desenvolva sua autenticidade através de práticas criativas de escrita.' },
              { icon: Lightbulb, title: 'inspiração externa + vivências coletivas', desc: 'aprenda com mestres convidados e histórias transformadoras.' },
              { icon: Users, title: 'exercícios práticos + partilha entre pessoas reais', desc: 'pratique em comunidade e estabeleça conexões genuínas.' }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="card border-2 border-deepBlue/10 hover:border-actionOrange/40 hover:shadow-xl transition-all duration-300 group"
                  style={{ transitionDelay: `${idx * 100}ms` }}
                >
                  <Icon className="w-12 h-12 md:w-14 md:h-14 text-actionOrange mb-4 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="font-editorial text-xl md:text-2xl text-deepBlue mb-3">{item.title}</h3>
                  <p className="text-deepBlue/70 text-sm md:text-base leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Who Is This For */}
      <section
        ref={(el) => { sectionRefs.current[1] = el; }}
        className={`py-20 md:py-28 bg-paper transition-all duration-700 ${
          visibleSections.has(1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-editorial text-3xl md:text-4xl lg:text-5xl text-center text-deepBlue mb-16">
            para quem é o roteiro original?
          </h2>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {audienceTypes.map((type, idx) => {
              const Icon = type.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 md:p-8 border-2 border-deepBlue/10 hover:border-limeGreen/50 hover:shadow-lg transition-all duration-300 group"
                  style={{ transitionDelay: `${idx * 100}ms` }}
                >
                  <Icon className="w-12 h-12 md:w-14 md:h-14 text-limeGreen mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" />
                  <h3 className="font-editorial text-xl md:text-2xl text-deepBlue mb-4">{type.title}</h3>
                  <p className="text-deepBlue/70 text-sm md:text-base leading-relaxed">{type.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 12-Week Journey */}
      <section
        ref={(el) => { sectionRefs.current[2] = el; }}
        className={`py-20 md:py-28 bg-white border-y-2 border-deepBlue/10 transition-all duration-700 ${
          visibleSections.has(2) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-editorial text-3xl md:text-4xl lg:text-5xl text-center text-deepBlue mb-16">
            estrutura da jornada (12 encontros)
          </h2>

          <div className="relative">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-deepBlue/20 transform -translate-x-1/2"></div>

            <div className="space-y-8 md:space-y-12">
              {journeySteps.map((step, idx) => (
                <div
                  key={idx}
                  ref={(el) => {
                    stepsRefs.current[idx] = el;
                  }}
                  className={`transition-all duration-700 ease-out ${
                    visibleSteps.has(idx)
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-8'
                  }`}
                >
                  <div className={`md:grid md:grid-cols-2 gap-8 items-center ${idx % 2 === 1 ? 'md:direction-rtl' : ''}`}>
                    <div className={`${idx % 2 === 1 ? 'md:order-2' : 'md:order-1'}`}>
                      <div className={`flex gap-4 md:gap-0 ${idx % 2 === 1 ? 'md:justify-end' : ''}`}>
                        <div className="md:hidden flex-shrink-0">
                          <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-center font-editorial font-bold text-white text-xs md:text-sm shadow-lg ${
                            step.guest ? 'bg-actionOrange' : 'bg-deepBlue'
                          }`}>
                            {step.date}
                          </div>
                        </div>
                        <div className="flex-grow md:hidden">
                          <h4 className="font-editorial text-base md:text-lg text-deepBlue mb-2">{step.title}</h4>
                          <p className="text-deepBlue/70 text-sm">{step.desc}</p>
                          {step.guest && (
                            <p className="text-actionOrange font-semibold mt-2 text-sm">convidado: {step.guest}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className={`hidden md:flex items-center justify-center ${idx % 2 === 1 ? 'md:order-1 md:justify-start' : 'md:order-2 md:justify-end'}`}>
                      <div className="relative">
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center text-center font-editorial font-bold text-white text-sm shadow-lg transition-transform duration-300 hover:scale-110 ${
                          step.guest ? 'bg-actionOrange' : 'bg-deepBlue'
                        }`}>
                          {step.date}
                        </div>
                      </div>
                    </div>

                    <div className={`hidden md:block ${idx % 2 === 1 ? 'md:order-2 md:text-right' : 'md:order-1'}`}>
                      <h4 className="font-editorial text-xl md:text-2xl text-deepBlue mb-3">{step.title}</h4>
                      <p className="text-deepBlue/70 leading-relaxed">{step.desc}</p>
                      {step.guest && (
                        <p className="text-actionOrange font-semibold mt-3">convidado: {step.guest}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section
        ref={(el) => { sectionRefs.current[3] = el; }}
        className={`py-20 md:py-28 bg-paper transition-all duration-700 ${
          visibleSections.has(3) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-editorial text-3xl md:text-4xl lg:text-5xl text-center text-deepBlue mb-16">
            por que escolher o roteiro original?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {benefits.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={idx}
                  className="card border-2 border-deepBlue/10 hover:border-actionOrange/40 hover:shadow-xl transition-all duration-300 group bg-white"
                  style={{ transitionDelay: `${idx * 50}ms` }}
                >
                  <Icon className="w-10 h-10 md:w-12 md:h-12 text-actionOrange mb-4 group-hover:scale-110 transition-transform duration-300" />
                  <h4 className="font-editorial text-lg md:text-xl text-deepBlue mb-3">{benefit.title}</h4>
                  <p className="text-deepBlue/70 text-sm md:text-base leading-relaxed">{benefit.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bonus Classes */}
      <section
        ref={(el) => { sectionRefs.current[4] = el; }}
        className={`py-20 md:py-28 bg-white border-y-2 border-deepBlue/10 transition-all duration-700 ${
          visibleSections.has(4) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-editorial text-3xl md:text-4xl lg:text-5xl text-center text-deepBlue mb-4">
            3 aulas bônus exclusivas
          </h2>
          <p className="text-center text-deepBlue/70 mb-16 text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
            além de toda a jornada, você terá acesso a aulas bônus ao vivo com convidados que complementarão sua imersão
          </p>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {bonusClasses.map((cls, idx) => (
              <div
                key={idx}
                className="card border-2 border-limeGreen/30 hover:border-limeGreen/70 hover:shadow-xl transition-all duration-300"
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <div className="text-3xl md:text-4xl font-editorial text-deepBlue mb-4 font-bold">{cls.name}</div>
                <h4 className="text-base md:text-lg font-medium text-actionOrange mb-3">{cls.focus}</h4>
                <p className="text-deepBlue/70 text-sm md:text-base leading-relaxed">{cls.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Section */}
      <section
        ref={(el) => { sectionRefs.current[5] = el; }}
        className={`py-20 md:py-28 bg-paper transition-all duration-700 ${
          visibleSections.has(5) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-editorial text-3xl md:text-4xl lg:text-5xl text-center text-deepBlue mb-16">
            investimento no seu roteiro original
          </h2>

          <div className="mb-16">
            <h3 className="text-xl md:text-2xl font-bold text-deepBlue mb-8 text-center">o que você terá acesso:</h3>
            <div className="space-y-4">
              {[
                '12 encontros semanais coletivos ao vivo (3 meses)',
                'grupo de apoio exclusivo no whatsapp',
                'acesso total ao aplicativo da solta o verbo',
                'gravações dos encontros por 1 ano',
                'desconto em todos os cursos da plataforma por 1 ano',
                '1 encontro individual com bruna ou julia (bônus exclusivo!)',
                'apoio contínuo e suporte personalizado ao longo da mentoria'
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 bg-white p-4 md:p-5 rounded-xl border-2 border-deepBlue/10 hover:border-limeGreen/40 transition-all duration-300"
                  style={{ transitionDelay: `${idx * 50}ms` }}
                >
                  <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-limeGreen flex-shrink-0 mt-0.5" />
                  <span className="text-base md:text-lg text-deepBlue/80">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div id="garantir" className="text-center">
            <button
              onClick={handleCheckoutClick}
              className="btn-primary text-base md:text-lg px-8 py-4 mb-4 hover:scale-105 transition-transform"
            >
              inscreva-se agora
            </button>
            <p className="text-deepBlue/60 mt-4 text-sm md:text-base">
              pagamento único ou parcelado em até 12x
            </p>
          </div>
        </div>
      </section>

      {/* Diversity Scholarships */}
      <section
        ref={(el) => { sectionRefs.current[6] = el; }}
        className={`py-20 md:py-28 bg-actionOrange/10 border-y-2 border-actionOrange/30 transition-all duration-700 ${
          visibleSections.has(6) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-editorial text-3xl md:text-4xl lg:text-5xl text-center text-deepBlue mb-8">
            bolsas de diversidade
          </h2>
          <div className="bg-white rounded-2xl p-6 md:p-10 lg:p-12 border-2 border-actionOrange/30 shadow-lg">
            <p className="text-base md:text-lg text-deepBlue/80 leading-relaxed mb-6">
              acreditamos profundamente que histórias transformam o mundo — e que todas as pessoas merecem espaço e apoio para contar as suas.
            </p>
            <p className="text-base md:text-lg text-deepBlue/80 leading-relaxed mb-8">
              por isso, abrimos <strong>bolsas de diversidade</strong> para o roteiro original.
            </p>
            <p className="text-base md:text-lg text-deepBlue/80 leading-relaxed mb-8">
              nosso objetivo é ampliar o acesso a pessoas que fazem parte de grupos historicamente sub-representados e que desejam fortalecer suas narrativas e práticas de escrita.
            </p>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSd62HRo20xTLs7J-jI-oa_Oxt94MZDRsxwyhCkjkePgoTzO8g/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block btn-primary text-base md:text-lg hover:scale-105 transition-transform"
            >
              preencher formulário de candidatura
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section
        ref={(el) => { sectionRefs.current[7] = el; }}
        className={`py-20 md:py-28 bg-paper transition-all duration-700 ${
          visibleSections.has(7) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-editorial text-3xl md:text-4xl lg:text-5xl text-center text-deepBlue mb-16">
            perguntas frequentes
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border-2 border-deepBlue/10 rounded-xl overflow-hidden bg-white hover:border-deepBlue/30 transition-all duration-300"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  className="w-full px-5 py-4 md:px-8 md:py-6 flex justify-between items-center hover:bg-deepBlue/5 transition-colors"
                >
                  <h3 className="font-bold text-base md:text-lg text-deepBlue text-left">{faq.q}</h3>
                  <ChevronDown className={`w-5 h-5 md:w-6 md:h-6 text-actionOrange flex-shrink-0 transition-transform duration-300 ${expandedFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {expandedFaq === idx && (
                  <div className="px-5 py-4 md:px-8 md:py-6 border-t-2 border-deepBlue/10 bg-deepBlue/5 animate-fade-in">
                    <p className="text-deepBlue/80 text-sm md:text-base leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        userEmail={user?.email || ''}
      />

      {/* Auth Prompt Modal */}
      <AuthPromptModal
        isOpen={isAuthPromptModalOpen}
        onClose={() => setIsAuthPromptModalOpen(false)}
      />

      {/* Footer */}
      <PreLoginFooter />
    </div>
  );
}
