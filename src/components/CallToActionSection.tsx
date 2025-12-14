import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function CallToActionSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-20 md:py-28 bg-gradient-to-b from-paper via-white/30 to-paper relative overflow-hidden"
    >
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 right-0 w-96 h-96 bg-limeGreen/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          className={`transition-all duration-1000 ${
            isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-12'
          }`}
        >
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-4xl md:text-5xl font-editorial font-bold text-deepBlue mb-6 leading-tight">
              o diário que sua alma pedia
            </h2>
            <p className="text-lg md:text-xl text-darkNeutral/85 font-light leading-relaxed max-w-2xl mx-auto">
              criamos este espaço pensando em você: um refúgio onde as palavras fluem sem julgamentos. liberte a voz da sua alma e escreva o que for real.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center mb-16 md:mb-20">
            <Link
              to="/register"
              className="group relative px-8 md:px-10 py-3 md:py-4 bg-gradient-to-r from-limeGreen to-limeGreen/90 text-deepBlue font-editorial font-bold text-lg rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:scale-105 flex items-center gap-2 whitespace-nowrap"
            >
              <span>comece a escrever sua nova história</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/programs"
              className="group px-8 md:px-10 py-3 md:py-4 border-2 border-deepBlue text-deepBlue font-editorial font-bold text-lg rounded-lg transition-all duration-300 hover:bg-deepBlue hover:text-white hover:shadow-lg hover:-translate-y-1 whitespace-nowrap"
            >
              saiba mais
            </Link>
          </div>

          <div
            className={`transition-all duration-1000 delay-300 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-deepBlue/10">
              <img
                src="/ss.jpeg"
                alt="solta o verbo - comunidade de escrita"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
