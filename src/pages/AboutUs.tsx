import { Link } from 'react-router-dom';
import { Heart, Users, Pencil, Sparkles, ArrowDown, Edit, UserCheck, Shield } from 'lucide-react';
import PreLoginNavbar from '../components/PreLoginNavbar';
import PreLoginFooter from '../components/PreLoginFooter';
import WavyLine from '../components/WavyLine';
import { useState, useEffect } from 'react';

export default function AboutUs() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToNextSection = () => {
    const element = document.getElementById('arte-section');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-paper overflow-x-hidden">
      <PreLoginNavbar />

      {/* Section 1: Hero - Solta o Verbo */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Title - Centered */}
        <div className={`text-center mb-12 md:mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h1 className="font-editorial text-5xl md:text-6xl lg:text-7xl font-bold text-deepBlue mb-6">
            solta o verbo
          </h1>
          <div className="flex justify-center">
            <WavyLine color="#BEC540" width={250} animate />
          </div>
        </div>

        {/* Two Column Layout: Text Left, Image Right */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Column: Text + Button */}
          <div className={`space-y-6 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <p className="text-xl md:text-2xl text-deepBlue font-medium leading-relaxed">
              uma comunidade viva de autodesenvolvimento, onde a expressão é caminho para transformar realidades.
            </p>

            <p className="text-lg md:text-xl text-deepBlue/80 leading-relaxed">
              a escrita é nosso eixo central — mas o encontro, a escuta e a criação coletiva sustentam toda a jornada.
            </p>

            <button
              onClick={scrollToNextSection}
              className="inline-flex items-center gap-2 px-8 py-4 bg-deepBlue text-white font-bold rounded-full hover:bg-deepBlue/90 transition-all duration-300 hover:shadow-xl hover:scale-105 mt-4"
            >
              descubra mais
              <ArrowDown className="w-5 h-5 animate-bounce" />
            </button>
          </div>

          {/* Right Column: Image */}
          <div className={`transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <img
              src="/whatsapp_image_2025-12-11_at_3.24.18_pm.jpeg"
              alt="um novo olhar"
              className="w-full h-auto rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Section 2: A Arte de Viver Melhor */}
      <section id="arte-section" className="bg-white/60 backdrop-blur-sm py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="text-center mb-12">
              <h2 className="font-editorial text-4xl md:text-5xl font-bold text-deepBlue mb-4">
                a arte de viver melhor
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
                    nós criamos espaços seguros para que cada pessoa exerça sua voz, cultive hábitos de expressão,
                    amplie perspectivas e transforme padrões limitantes em potência criativa.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 md:p-10 shadow-lg border-2 border-deepBlue/10 hover:shadow-2xl transition-all duration-500">
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-actionOrange/20 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-deepBlue" />
                  </div>
                  <p className="text-base md:text-lg text-deepBlue/80 leading-relaxed">
                    acreditamos que todo processo criativo floresce melhor em comunidade. por isso, reunimos pessoas
                    que querem se aprofundar, se fortalecer e caminhar juntas - não pela lógica do "produzir mais",
                    mas pela arte de viver melhor.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Values Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="mb-12 md:mb-16">
          <img
            src="/whatsapp_image_2025-12-11_at_3.35.23_pm copy.jpeg"
            alt="O que nos move"
            className="w-full max-w-4xl mx-auto rounded-lg shadow-lg"
          />
        </div>
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          <div className={`group bg-white/60 backdrop-blur-sm rounded-3xl p-8 md:p-10 border-2 border-deepBlue/10 hover:border-limeGreen/50 transition-all duration-500 hover:shadow-2xl ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '300ms' }}>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-16 h-16 bg-limeGreen/20 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                <Heart className="w-8 h-8 text-deepBlue" />
              </div>
              <div>
                <h3 className="font-editorial text-2xl md:text-3xl font-bold text-deepBlue mb-3">
                  encontros reais
                </h3>
                <p className="text-base md:text-lg text-deepBlue/70 leading-relaxed">
                  onde cada pessoa pode chegar como está. conversas que abrem espaço para o que importa.
                </p>
              </div>
            </div>
          </div>

          <div className={`group bg-white/60 backdrop-blur-sm rounded-3xl p-8 md:p-10 border-2 border-deepBlue/10 hover:border-actionOrange/50 transition-all duration-500 hover:shadow-2xl ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '400ms' }}>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-16 h-16 bg-actionOrange/20 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                <Users className="w-8 h-8 text-deepBlue" />
              </div>
              <div>
                <h3 className="font-editorial text-2xl md:text-3xl font-bold text-deepBlue mb-3">
                  vínculos
                </h3>
                <p className="text-base md:text-lg text-deepBlue/70 leading-relaxed">
                  rituais que fortalecem a confiança e criam uma rede de apoio genuína.
                </p>
              </div>
            </div>
          </div>

          <div className={`group bg-white/60 backdrop-blur-sm rounded-3xl p-8 md:p-10 border-2 border-deepBlue/10 hover:border-limeGreen/50 transition-all duration-500 hover:shadow-2xl ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '500ms' }}>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-16 h-16 bg-limeGreen/20 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                <Pencil className="w-8 h-8 text-deepBlue" />
              </div>
              <div>
                <h3 className="font-editorial text-2xl md:text-3xl font-bold text-deepBlue mb-3">
                  expressão
                </h3>
                <p className="text-base md:text-lg text-deepBlue/70 leading-relaxed">
                  exercícios que nos colocam em movimento e dão forma ao que sentimos.
                </p>
              </div>
            </div>
          </div>

          <div className={`group bg-white/60 backdrop-blur-sm rounded-3xl p-8 md:p-10 border-2 border-deepBlue/10 hover:border-actionOrange/50 transition-all duration-500 hover:shadow-2xl ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '600ms' }}>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-16 h-16 bg-actionOrange/20 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                <Sparkles className="w-8 h-8 text-deepBlue" />
              </div>
              <div>
                <h3 className="font-editorial text-2xl md:text-3xl font-bold text-deepBlue mb-3">
                  potência
                </h3>
                <p className="text-base md:text-lg text-deepBlue/70 leading-relaxed">
                  transformar padrões limitantes em força criativa através da escrita.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Criadoras */}
      <section className="bg-deepBlue py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-editorial text-4xl md:text-5xl font-bold text-white mb-4">
              criadoras
            </h2>
            <p className="text-xl text-white/80">as facilitadoras</p>
            <div className="flex justify-center mt-6">
              <WavyLine color="#BEC540" width={200} animate />
            </div>
          </div>

          {/* Bruna Riedel */}
          <div className="mb-12 md:mb-20">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className={`order-2 md:order-1 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 md:p-10">
                  <div className="mb-6">
                    <h3 className="font-editorial text-3xl md:text-4xl font-bold text-white mb-2">
                      bruna riedel
                    </h3>
                    <p className="text-limeGreen font-semibold text-lg">co-criadora & facilitadora</p>
                  </div>

                  <div className="space-y-4 text-white/90 leading-relaxed">
                    <p>
                      mineira que escolheu viver perto do mar, bruna riedel é geógrafa licenciada, escritora, community manager
                      e designer de conexões e experiências. há dez anos em florianópolis, trabalha criando ambientes onde pessoas
                      possam aprender, se relacionar, trocar e se transformarem juntas.
                    </p>

                    <p>
                      ao longo de sua trajetória, co-criou um comitê de sustentabilidade dentro de uma organização de impacto
                      socioambiental e liderou movimentos de agroecologia. sua atuação sempre buscou aproximar pessoas a partir
                      de práticas do design, que possibilitam a regeneração de territórios internos e externos.
                    </p>

                    <p>
                      atualmente, atua como community manager no instituto amuta e coordena ciclos de estudo sobre saúde social.
                      em 2024, criou a quinta essência, seu projeto artístico pessoal no substack.
                    </p>

                    <p className="font-medium text-white">
                      co-criadora e facilitadora da solta o verbo, bruna desenha experiências em que a escrita se torna uma
                      ferramenta poderosa para gerar consciência, liberdade e autoria.
                    </p>
                  </div>
                </div>
              </div>

              <div className={`order-1 md:order-2 flex justify-center transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
                <img
                  src="/bruna copy copy.png"
                  alt="Bruna Riedel"
                  className="w-64 h-64 md:w-80 md:h-80 object-cover rounded-3xl shadow-2xl"
                />
              </div>
            </div>
          </div>

          {/* Julia Alvim */}
          <div>
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className={`order-1 flex justify-center transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
                <img
                  src="/jo.png"
                  alt="Julia Alvim"
                  className="w-64 h-64 md:w-80 md:h-80 object-cover rounded-3xl shadow-2xl"
                />
              </div>

              <div className={`order-2 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 md:p-10">
                  <div className="mb-6">
                    <h3 className="font-editorial text-3xl md:text-4xl font-bold text-white mb-2">
                      julia alvim
                    </h3>
                    <p className="text-limeGreen font-semibold text-lg">co-criadora & facilitadora</p>
                  </div>

                  <div className="space-y-4 text-white/90 leading-relaxed">
                    <p>
                      de gerente em multinacional para um caminho autoral, julia alvim é contadora de histórias que encontrou
                      na escrita a ferramenta que guiou sua própria transição de vida para um destino mais alinhado com sua verdade.
                    </p>

                    <p>
                      desde que deixou o mundo corporativo, dedica-se a aprofundar seus estudos sobre relações humanas, criatividade
                      e autoconhecimento. produziu eventos, retiros e encontros no brasil e na europa.
                    </p>

                    <p>
                      criou projetos coletivos como o children of the universe e o 'segundas intenções' no substack, uma newsletter
                      para inspirar pessoas a acreditarem que a mudança acontece de dentro para fora.
                    </p>

                    <p className="font-medium text-white">
                      co-criadora e facilitadora do solta o verbo, julia desenha jornadas em que a expressão através da escrita
                      se torna um espaço seguro para reorganizar emoções e ressignificar narrativas.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Platform Features & CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-16">
          <h2 className="font-editorial text-4xl md:text-5xl font-bold text-deepBlue mb-4">
            a plataforma
          </h2>
          <div className="flex justify-center mb-8">
            <WavyLine color="#BEC540" width={200} animate />
          </div>
          <p className="text-lg md:text-xl text-deepBlue/80 max-w-3xl mx-auto leading-relaxed">
            um espaço gratuito e seguro para compartilhar seus textos, ler pessoas que te inspiram e se conectar
            com uma comunidade que sente o mundo através da escrita.
          </p>
          <p className="text-base md:text-lg text-deepBlue/60 max-w-3xl mx-auto leading-relaxed mt-3">
            livre de algoritmos que limitam sua expressão
          </p>
        </div>

        {/* Platform Image */}
        <div className={`mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <img
            src="/whatsapp_image_2025-12-11_at_4.25.25_pm.jpeg"
            alt="solta o verbo plataforma"
            className="w-full max-w-5xl mx-auto h-auto rounded-2xl shadow-2xl"
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border-2 border-deepBlue/10 hover:border-limeGreen/50 hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 bg-limeGreen/20 rounded-xl flex items-center justify-center mb-4">
              <Edit className="w-6 h-6 text-deepBlue" />
            </div>
            <h3 className="font-editorial text-xl font-bold text-deepBlue mb-2">publique</h3>
            <p className="text-deepBlue/70 text-sm leading-relaxed">
              um editor limpo e focado para dar vida aos seus textos e poesias.
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border-2 border-deepBlue/10 hover:border-actionOrange/50 hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 bg-actionOrange/20 rounded-xl flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6 text-deepBlue" />
            </div>
            <h3 className="font-editorial text-xl font-bold text-deepBlue mb-2">interaja</h3>
            <p className="text-deepBlue/70 text-sm leading-relaxed">
              leia e comente em produções profundas. troque vivências reais.
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border-2 border-deepBlue/10 hover:border-limeGreen/50 hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 bg-limeGreen/20 rounded-xl flex items-center justify-center mb-4">
              <UserCheck className="w-6 h-6 text-deepBlue" />
            </div>
            <h3 className="font-editorial text-xl font-bold text-deepBlue mb-2">personalize</h3>
            <p className="text-deepBlue/70 text-sm leading-relaxed">
              crie um perfil que reflete quem você é, não apenas o que você faz.
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border-2 border-deepBlue/10 hover:border-actionOrange/50 hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 bg-actionOrange/20 rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-deepBlue" />
            </div>
            <h3 className="font-editorial text-xl font-bold text-deepBlue mb-2">conecte</h3>
            <p className="text-deepBlue/70 text-sm leading-relaxed">
              conexão real em um ambiente seguro, focado em profundidade.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-deepBlue to-deepBlue/90 rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-limeGreen/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-actionOrange/10 rounded-full blur-3xl"></div>

          <div className="relative z-10 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left side - Text */}
            <div className="flex flex-col justify-center">
              <p className="text-lg md:text-2xl text-white leading-relaxed font-medium">
                venha colocar para fora o que aperta dentro e faça parte dessa comunidade de pessoas que buscam o autodesenvolvimento através da expressão autêntica.
              </p>
              <Link
                to="/register"
                className="inline-block mt-8 px-8 py-4 bg-limeGreen text-deepBlue font-bold rounded-full hover:bg-limeGreen/90 transition-all duration-300 hover:shadow-xl hover:scale-105 w-fit"
              >
                comece agora
              </Link>
            </div>

            {/* Right side - Image */}
            <div className="flex justify-center md:justify-end">
              <img
                src="/whatsapp_image_2025-12-11_at_4.40.55_pm.jpeg"
                alt="e aí, bora soltar o verbo?"
                className="w-full max-w-sm h-auto rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <PreLoginFooter />
    </div>
  );
}
