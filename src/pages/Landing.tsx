import PreLoginNavbar from '../components/PreLoginNavbar';
import PreLoginFooter from '../components/PreLoginFooter';
import WavyLine from '../components/WavyLine';
import HeroSlider from '../components/HeroSlider';
import CallToActionSection from '../components/CallToActionSection';

export default function Landing() {
  return (
    <div className="min-h-screen bg-paper overflow-x-hidden">
      <PreLoginNavbar />

      <HeroSlider />


      <section className="py-16 md:py-24 bg-paper relative overflow-hidden">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-editorial font-bold text-deepBlue mb-6">
              pilares do que nos move
            </h2>
            <div className="flex justify-center mb-6">
              <WavyLine color="#BEC540" width={200} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                title: "essência humana",
                description: "escrever é mais do que juntar palavras: é um jeito de ouvir o que vive dentro, organizar o caos e dar forma ao que ainda é sussurro."
              },
              {
                title: "disciplina criativa",
                description: "criar hábitos de escrita que não pesem como obrigação, mas que funcionem como pequenos rituais de presença e alívio mental."
              },
              {
                title: "viver em coletivo",
                description: "acreditamos que ninguém deveria atravessar transições sozinha. estar em comunidade protege a saúde mental e reduz a solidão."
              },
              {
                title: "ampliar o olhar",
                description: "escrever e escutar em grupo exercita empatia, alarga perspectivas e ajuda a encontrar novos significados para velhas cenas."
              },
              {
                title: "sair do modo passivo",
                description: "a escrita ajuda a questionar narrativas herdadas, tomar decisões mais conscientes e transformar preocupação em movimento."
              },
              {
                title: "autonomia e coragem",
                description: "o propósito é que cada pessoa se torne autora da própria história, com ferramentas internas e clareza de direção."
              }
            ].map((pillar, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-white to-white/95 rounded-2xl p-7 md:p-8 border border-deepBlue/8 shadow-md hover:shadow-xl transition-all duration-500 ease-out hover:-translate-y-2 hover:border-limeGreen/60 group"
              >
                <div className="relative">
                  <div className="absolute -left-1 -top-1 w-12 h-12 bg-limeGreen/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <h3 className="font-editorial text-xl md:text-2xl font-bold text-deepBlue mb-4 relative transition-colors duration-300 group-hover:text-deepBlue">
                    {pillar.title}
                  </h3>
                </div>
                <p className="text-darkNeutral/90 leading-relaxed text-base md:text-base font-light transition-colors duration-300 group-hover:text-darkNeutral">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CallToActionSection />

      <PreLoginFooter />
    </div>
  );
}
