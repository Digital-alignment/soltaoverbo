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
      { threshold: 0.08 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-20 md:py-28"
      style={{ backgroundColor: '#140D82' }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 100% 0%, rgba(190,197,64,0.12) 0%, transparent 55%)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 0% 100%, rgba(25,0,135,0.6) 0%, transparent 60%)',
        }}
      />

      <div
        className="absolute right-[-2rem] top-1/2 -translate-y-1/2 font-editorial font-bold select-none pointer-events-none leading-none hidden xl:block"
        style={{
          fontSize: 'clamp(10rem, 18vw, 18rem)',
          color: '#ffffff',
          opacity: 0.025,
        }}
      >
        escreva
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
          }}
        >
          <div className="text-center mb-10 md:mb-12">
            <h2
              className="font-editorial font-bold leading-tight mb-5"
              style={{
                color: '#ede5d1',
                fontSize: 'clamp(2rem, 5vw, 3.2rem)',
              }}
            >
              o diário que sua alma pedia
            </h2>
            <p
              className="text-base sm:text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto"
              style={{ color: '#ede5d1', opacity: 0.72 }}
            >
              criamos este espaço pensando em você: um refúgio onde as palavras fluem sem julgamentos. liberte a voz da sua alma e escreva o que for real.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center mb-14 md:mb-16">
            <Link
              to="/register"
              className="group relative px-7 md:px-9 py-3.5 font-bold text-base rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-lg active:scale-[0.98] flex items-center gap-2 whitespace-nowrap"
              style={{ backgroundColor: '#BEC540', color: '#1D1D1B' }}
            >
              <span>comece a escrever sua nova história</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/programs"
              className="px-7 md:px-9 py-3.5 font-bold text-base rounded-xl transition-all duration-300 hover:bg-white/10 active:scale-[0.98] whitespace-nowrap border"
              style={{ color: '#ede5d1', borderColor: 'rgba(237,229,209,0.25)' }}
            >
              saiba mais
            </Link>
          </div>

          <div
            className="rounded-2xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.4)]"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.98)',
              transition: 'opacity 0.9s ease 0.25s, transform 0.9s ease 0.25s',
            }}
          >
            <img
              src="/ss.jpeg"
              alt="solta o verbo - comunidade de escrita"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
