import { useEffect, useRef, useState } from 'react';
import PreLoginNavbar from '../components/PreLoginNavbar';
import PreLoginFooter from '../components/PreLoginFooter';
import WavyLine from '../components/WavyLine';
import HeroSlider from '../components/HeroSlider';
import CallToActionSection from '../components/CallToActionSection';

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

function PillarCard({ pillar, index, visible }: { pillar: typeof pillars[0]; index: number; visible: boolean }) {
  const num = String(index + 1).padStart(2, '0');
  return (
    <div
      className="group relative rounded-2xl p-6 sm:p-7 overflow-hidden border border-deepBlue/8 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl hover:border-limeGreen/30"
      style={{
        background: 'linear-gradient(140deg, #ffffff 0%, rgba(237,230,212,0.45) 100%)',
        transitionDelay: `${index * 60}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.6s ease ${index * 60}ms, transform 0.6s ease ${index * 60}ms, box-shadow 0.3s ease, border-color 0.3s ease, translate 0.3s ease`,
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl transition-all duration-500"
        style={{
          background: 'linear-gradient(to right, #BEC540, transparent)',
          opacity: 0,
        }}
        data-accent
      />

      <span
        className="absolute top-4 right-5 font-editorial font-bold select-none leading-none pointer-events-none"
        style={{
          fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
          color: '#140D82',
          opacity: 0.05,
        }}
      >
        {num}
      </span>

      <div
        className="w-6 h-[2px] rounded-full mb-5 transition-all duration-500 group-hover:w-10"
        style={{ backgroundColor: '#BEC540' }}
      />

      <h3
        className="font-editorial font-bold text-deepBlue mb-3 leading-tight"
        style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.35rem)' }}
      >
        {pillar.title}
      </h3>

      <p className="text-darkNeutral/75 leading-relaxed text-[14px] sm:text-[15px]">
        {pillar.description}
      </p>
    </div>
  );
}

export default function Landing() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.08 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-paper overflow-x-hidden">
      <PreLoginNavbar />

      <HeroSlider />

      <section ref={sectionRef} className="py-20 md:py-28 bg-paper relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 70% 50% at 90% 20%, rgba(190,197,64,0.07) 0%, transparent 60%)',
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 60% 50% at 5% 80%, rgba(20,13,130,0.04) 0%, transparent 60%)',
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div
            className="text-center mb-14 md:mb-18"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.6s ease, transform 0.6s ease',
            }}
          >
            <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-bold text-deepBlue mb-5">
              pilares do que nos move
            </h2>
            <div className="flex justify-center">
              <WavyLine color="#BEC540" width={200} />
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {pillars.map((pillar, i) => (
              <PillarCard key={i} pillar={pillar} index={i} visible={visible} />
            ))}
          </div>
        </div>
      </section>

      <CallToActionSection />

      <PreLoginFooter />
    </div>
  );
}
