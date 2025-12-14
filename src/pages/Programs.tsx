import { Link } from 'react-router-dom';
import { BookOpen, Users, Sparkles, PenTool, Heart, Zap, ArrowDown, CheckCircle } from 'lucide-react';
import PreLoginNavbar from '../components/PreLoginNavbar';
import PreLoginFooter from '../components/PreLoginFooter';
import WavyLine from '../components/WavyLine';
import { useState, useEffect } from 'react';

export default function Programs() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToPrograms = () => {
    const element = document.getElementById('programs-section');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-paper overflow-x-hidden">
      <PreLoginNavbar />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-28">
        <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h1 className="font-editorial text-5xl md:text-6xl lg:text-7xl font-bold text-deepBlue mb-6">
            a arte de viver melhor
          </h1>
          <div className="flex justify-center mb-8">
            <WavyLine color="#BEC540" width={250} animate />
          </div>

          <div className="max-w-4xl mx-auto space-y-6 mb-12">
            <p className="text-xl md:text-2xl text-deepBlue font-medium leading-relaxed">
              uma comunidade viva de autodesenvolvimento, onde a expressão é caminho para transformar realidades.
            </p>

            <p className="text-lg md:text-xl text-deepBlue/80 leading-relaxed">
              a escrita é nosso eixo central — mas o encontro, a escuta e a criação coletiva sustentam toda a jornada.
            </p>

            <p className="text-lg md:text-xl text-deepBlue italic font-medium mt-8">
              "se você sente que tem algo dentro querendo ganhar forma, chega mais."
            </p>
          </div>

          <h2 className="text-2xl md:text-3xl font-editorial font-bold text-deepBlue mb-8">
            bora a escrever tua história!
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={scrollToPrograms}
              className="inline-flex items-center gap-2 px-8 py-4 bg-deepBlue text-white font-bold rounded-full hover:bg-deepBlue/90 transition-all duration-300 hover:shadow-xl hover:scale-105"
            >
              escolha seu caminho
              <ArrowDown className="w-5 h-5 animate-bounce" />
            </button>
            <Link
              to="/roteirooriginal"
              className="inline-flex items-center gap-2 px-8 py-4 bg-actionOrange text-white font-bold rounded-full hover:bg-actionOrange/90 transition-all duration-300 hover:shadow-xl hover:scale-105"
            >
              mentoria roteiro original
            </Link>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-white/60 backdrop-blur-sm py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="text-center mb-12">
              <h2 className="font-editorial text-4xl md:text-5xl font-bold text-deepBlue mb-4">
                nosso objetivo: crescimento coletivo
              </h2>
              <div className="flex justify-center">
                <WavyLine color="#FF6B35" width={200} animate />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              <div className="bg-white rounded-3xl p-8 md:p-10 shadow-lg border-2 border-deepBlue/10 hover:shadow-2xl transition-all duration-500">
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-limeGreen/20 rounded-xl flex items-center justify-center">
                    <Heart className="w-6 h-6 text-deepBlue" />
                  </div>
                  <p className="text-base md:text-lg text-deepBlue/80 leading-relaxed">
                    nós criamos espaços seguros para que cada pessoa exerça sua voz, cultive hábitos de expressão, amplie perspectivas e transforme padrões limitantes em potência criativa.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 md:p-10 shadow-lg border-2 border-deepBlue/10 hover:shadow-2xl transition-all duration-500">
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-actionOrange/20 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-deepBlue" />
                  </div>
                  <p className="text-base md:text-lg text-deepBlue/80 leading-relaxed">
                    acreditamos que todo processo criativo floresce melhor em comunidade. por isso, reunimos pessoas que querem se aprofundar, se fortalecer e caminhar juntas - não pela lógica do "produzir mais", mas pela arte de viver melhor.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-16">
          <h2 className="font-editorial text-4xl md:text-5xl font-bold text-deepBlue mb-4">
            o processo solta o verbo
          </h2>
          <div className="flex justify-center">
            <WavyLine color="#BEC540" width={200} animate />
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6 md:gap-4">
          <div className={`group bg-white/60 backdrop-blur-sm rounded-3xl p-8 border-2 border-deepBlue/10 hover:border-limeGreen/50 transition-all duration-500 hover:shadow-2xl text-center ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '300ms' }}>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-limeGreen/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <MessageCircle className="w-8 h-8 text-deepBlue" />
              </div>
            </div>
            <h3 className="font-editorial text-2xl font-bold text-deepBlue mb-3">encontros reais</h3>
            <p className="text-sm md:text-base text-deepBlue/70 leading-relaxed">
              onde cada pessoa pode chegar como está. conversas que abrem espaço para o que importa e nos fortalecem.
            </p>
          </div>

          <div className={`group bg-white/60 backdrop-blur-sm rounded-3xl p-8 border-2 border-deepBlue/10 hover:border-actionOrange/50 transition-all duration-500 hover:shadow-2xl text-center ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '400ms' }}>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-actionOrange/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <Heart className="w-8 h-8 text-deepBlue" />
              </div>
            </div>
            <h3 className="font-editorial text-2xl font-bold text-deepBlue mb-3">vínculos</h3>
            <p className="text-sm md:text-base text-deepBlue/70 leading-relaxed">
              rituais que fortalecem a confiança e criam uma rede de apoio genuína e sem julgamentos.
            </p>
          </div>

          <div className={`group bg-white/60 backdrop-blur-sm rounded-3xl p-8 border-2 border-deepBlue/10 hover:border-limeGreen/50 transition-all duration-500 hover:shadow-2xl text-center ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '500ms' }}>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-limeGreen/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <PenTool className="w-8 h-8 text-deepBlue" />
              </div>
            </div>
            <h3 className="font-editorial text-2xl font-bold text-deepBlue mb-3">expressão</h3>
            <p className="text-sm md:text-base text-deepBlue/70 leading-relaxed">
              exercícios que nos colocam em movimento e dão forma ao que sentimos. a escrita como ferramenta de desabafo.
            </p>
          </div>

          <div className={`group bg-white/60 backdrop-blur-sm rounded-3xl p-8 border-2 border-deepBlue/10 hover:border-actionOrange/50 transition-all duration-500 hover:shadow-2xl text-center ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '600ms' }}>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-actionOrange/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <Zap className="w-8 h-8 text-deepBlue" />
              </div>
            </div>
            <h3 className="font-editorial text-2xl font-bold text-deepBlue mb-3">potência</h3>
            <p className="text-sm md:text-base text-deepBlue/70 leading-relaxed">
              transformar padrões limitantes em força criativa através da escrita consciente e compartilhada.
            </p>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-16">
          <h2 className="font-editorial text-4xl md:text-5xl font-bold text-deepBlue mb-4">
            escolha seu caminho
          </h2>
          <div className="flex justify-center mb-8">
            <WavyLine color="#BEC540" width={200} animate />
          </div>
          <p className="text-lg md:text-xl text-deepBlue/80 max-w-3xl mx-auto leading-relaxed">
            da plataforma gratuita à nossa mentoria profunda, temos um espaço para sua voz ecoar.
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
          {/* Program 1: Platform */}
          <div
            className={`group bg-white/60 backdrop-blur-sm rounded-3xl p-6 md:p-10 border-2 border-deepBlue/10 hover:border-limeGreen/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: '200ms' }}
          >
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-limeGreen/20 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                  <BookOpen className="w-8 h-8 md:w-10 md:h-10 text-deepBlue" />
                </div>
              </div>
              <div className="flex-grow space-y-4">
                <div>
                  <span className="inline-block px-3 py-1 bg-limeGreen/30 text-deepBlue text-xs font-bold rounded-full mb-3">
                    plataforma totalmente gratuita
                  </span>
                  <h2 className="font-editorial text-2xl md:text-3xl font-bold text-deepBlue mb-3">
                    plataforma solta o verbo
                  </h2>
                  <p className="text-base md:text-lg text-deepBlue/70 leading-relaxed mb-4">
                    um espaço seguro e gratuito para compartilhar seus textos, ler pessoas que te inspiram e se conectar com uma comunidade que sente o mundo através da escrita. você pode utilizá-la para chegar a mais pessoas, compartilhar sua visão e se conectar com uma rede de apoio que valoriza a expressão autêntica.
                  </p>
                  <p className="text-sm md:text-base text-deepBlue/60 italic mb-4">
                    livre de algoritmos que limitam sua expressão
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm md:text-base text-deepBlue/80">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-limeGreen flex-shrink-0" />
                    <span>publique seus textos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-limeGreen flex-shrink-0" />
                    <span>leia e comente</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-limeGreen flex-shrink-0" />
                    <span>perfil personalizado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-limeGreen flex-shrink-0" />
                    <span>conexão real</span>
                  </div>
                </div>
                <div className="pt-4">
                  <Link
                    to="/register"
                    className="inline-block px-6 md:px-8 py-3 md:py-4 bg-deepBlue text-white font-bold rounded-full hover:bg-deepBlue/90 transition-all duration-300 hover:shadow-xl hover:scale-105"
                  >
                    criar conta gratuita
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Program 2: 21-Day Challenge */}
          <div
            className={`group bg-white/60 backdrop-blur-sm rounded-3xl p-6 md:p-10 border-2 border-deepBlue/10 hover:border-actionOrange/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: '400ms' }}
          >
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-actionOrange/20 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                  <PenTool className="w-8 h-8 md:w-10 md:h-10 text-deepBlue" />
                </div>
              </div>
              <div className="flex-grow space-y-4">
                <div>
                  <span className="inline-block px-3 py-1 bg-actionOrange/30 text-deepBlue text-xs font-bold rounded-full mb-3">
                    curso gratuito
                  </span>
                  <h2 className="font-editorial text-2xl md:text-3xl font-bold text-deepBlue mb-3">
                    desafio 21 dias de escrita
                  </h2>
                  <p className="text-base md:text-lg text-deepBlue/70 leading-relaxed mb-4">
                    o pontapé inicial para a sua jornada. uma jornada prática para destravar sua expressão. durante 21 dias, você receberá estímulos diários para criar o hábito de escrever sem julgamento e soltar o verbo.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm md:text-base text-deepBlue/80">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-actionOrange flex-shrink-0" />
                    <span>exercícios diários</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-actionOrange flex-shrink-0" />
                    <span>material de apoio</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-actionOrange flex-shrink-0" />
                    <span>comunidade ativa</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-actionOrange flex-shrink-0" />
                    <span>autoconhecimento</span>
                  </div>
                </div>
                <div className="pt-4 flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/register"
                    className="inline-block px-6 md:px-8 py-3 md:py-4 bg-deepBlue text-white font-bold rounded-full hover:bg-deepBlue/90 transition-all duration-300 hover:shadow-xl hover:scale-105"
                  >
                    começar agora
                  </Link>
                  <span className="text-sm md:text-base text-deepBlue/60 flex items-center">
                    inscrições abertas
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Program 3: Premium Mentorship */}
          <div
            className={`group relative rounded-3xl p-6 md:p-10 border-2 border-[#190087] hover:border-actionOrange/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 overflow-hidden ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ backgroundColor: '#190087', transitionDelay: '600ms' }}
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-actionOrange/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-limeGreen/10 rounded-full blur-3xl"></div>

            <div className="absolute top-4 right-4 md:top-6 md:right-6 z-20">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-actionOrange text-xs font-bold rounded-full text-white">
                <Sparkles className="w-3 h-3" />
                só 10 vagas
              </span>
            </div>

            <div className="relative z-10 flex flex-col md:flex-row md:items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                  <Users className="w-8 h-8 md:w-10 md:h-10" style={{ color: '#ede5d1' }} />
                </div>
              </div>
              <div className="flex-grow space-y-4">
                <div>
                  <span className="inline-block px-3 py-1 bg-white/10 text-xs font-bold rounded-full mb-3" style={{ color: '#ede5d1' }}>
                    inscrições abertas
                  </span>
                  <h2 className="font-editorial text-2xl md:text-3xl font-bold mb-3" style={{ color: '#ede5d1' }}>
                    mentoria roteiro original
                  </h2>
                  <p className="text-base md:text-lg leading-relaxed mb-4" style={{ color: '#ede5d1', opacity: 0.9 }}>
                    a joia da nossa comunidade. uma mentoria coletiva de 12 semanas para você revisitar sua história, ampliar perspectivas e escrever um novo capítulo da sua vida com autonomia e coragem.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm md:text-base" style={{ color: '#ede5d1', opacity: 0.85 }}>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#BEC540' }} />
                    <span>12 encontros ao vivo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#BEC540' }} />
                    <span>convidados especiais</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#BEC540' }} />
                    <span>mentoria em grupo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#BEC540' }} />
                    <span>material exclusivo</span>
                  </div>
                </div>
                <div className="pt-4 flex flex-col sm:flex-row gap-3 items-start">
                  <Link
                    to="/roteirooriginal"
                    className="inline-block px-6 md:px-8 py-3 md:py-4 bg-actionOrange font-bold rounded-full hover:bg-actionOrange/90 transition-all duration-300 hover:shadow-xl hover:scale-105 text-center text-white"
                  >
                    saiba mais
                  </Link>
                  <div className="flex flex-col justify-center text-sm" style={{ color: '#ede5d1', opacity: 0.8 }}>
                    <span className="font-bold">mentoria de 12 semanas</span>
                    <span className="font-editorial text-base" style={{ color: '#ede5d1' }}>roteiro original</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PreLoginFooter />
    </div>
  );
}
