import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import WavyLine from './WavyLine';

interface SlideButton {
  label: string;
  to: string;
  bgColor: string;
  textColor: string;
}

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  backgroundColor: string;
  textColor: string;
  buttons: SlideButton[];
  image: string;
  imageAlt: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: 'mentoria coletiva',
    subtitle: 'roteiro original',
    description:
      'revisite sua história, amplie perspectivas e abra espaço para escolhas mais conscientes. um convite para questionar narrativas impostas e escrever seu próprio caminho.',
    backgroundColor: '#190087',
    textColor: '#ede5d1',
    buttons: [
      { label: 'quero ser parte', to: '/register', bgColor: '#ede5d1', textColor: '#190087' },
      { label: 'saiba mais', to: '/roteirooriginal', bgColor: '#bac706', textColor: '#000000' },
    ],
    image: '/whatsapp_image_2025-12-08_at_18.13.13_cda3219b.jpg',
    imageAlt: 'roteiro original',
  },
  {
    id: 2,
    title: 'comunidade viva',
    subtitle: 'solta o verbo',
    description:
      'uma comunidade de autodesenvolvimento onde a expressão é caminho para transformar realidades. a escrita é nosso eixo central, mas o encontro, a escuta e a criação coletiva sustentam toda a jornada.',
    backgroundColor: '#140D82',
    textColor: '#ede5d1',
    buttons: [
      { label: 'faz parte da comunidade', to: '/register', bgColor: '#bac706', textColor: '#000000' },
      { label: 'sobre nós', to: '/about', bgColor: '#ede5d1', textColor: '#140D82' },
    ],
    image: '/whatsapp_image_2025-12-08_at_17.50.04_530c541c.jpg',
    imageAlt: 'solta o verbo',
  },
];

const DURATION = 7500;

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  useEffect(() => {
    if (!autoPlay) {
      setProgress(0);
      return;
    }

    setProgress(0);
    const t0 = Date.now();

    const iv = setInterval(() => {
      setProgress(Math.min(((Date.now() - t0) / DURATION) * 100, 100));
    }, 50);

    const st = setTimeout(() => {
      setCurrent(c => (c + 1) % slides.length);
    }, DURATION);

    return () => {
      clearInterval(iv);
      clearTimeout(st);
    };
  }, [current, autoPlay]);

  const goTo = (idx: number) => {
    setCurrent(idx);
    setAutoPlay(false);
  };

  const next = () => goTo((current + 1) % slides.length);
  const prev = () => goTo((current - 1 + slides.length) % slides.length);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
    setAutoPlay(false);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const delta = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) delta > 0 ? next() : prev();
    setTouchStart(null);
  };

  const slide = slides[current];

  return (
    <section
      className="relative overflow-hidden flex flex-col transition-colors duration-700 min-h-[90vh] md:min-h-screen"
      style={{ backgroundColor: slide.backgroundColor }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onMouseEnter={() => setAutoPlay(false)}
      onMouseLeave={() => setAutoPlay(true)}
    >
      <div
        key={`desktop-img-${current}`}
        className="hidden lg:block absolute inset-y-0 right-0 w-[45%] slide-fade-in-image"
      >
        <img
          src={slide.image}
          alt={slide.imageAlt}
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(to right, ${slide.backgroundColor} 0%, transparent 30%)`,
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(to top, ${slide.backgroundColor}90 0%, transparent 30%)`,
          }}
        />
      </div>

      <div className="absolute inset-0 lg:hidden pointer-events-none">
        <img
          src={slide.image}
          alt={slide.imageAlt}
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(175deg, ${slide.backgroundColor}d8 0%, ${slide.backgroundColor}f2 55%, ${slide.backgroundColor} 100%)`,
          }}
        />
      </div>

      <div className="relative flex-1 flex items-center z-10">
        <div className="max-w-7xl w-full mx-auto px-5 sm:px-8 lg:px-12 xl:px-16 py-24 lg:py-16">
          <div className="max-w-[540px] lg:max-w-[600px] xl:max-w-[640px]">
            <p
              key={`label-${current}`}
              className="text-[11px] font-bold tracking-[0.22em] mb-5 opacity-55 slide-fade-in-title"
              style={{ color: slide.textColor }}
            >
              {slide.title}
            </p>

            <h1
              key={`h1-${current}`}
              className="font-editorial font-bold leading-[1.02] mb-6 slide-fade-in-subtitle"
              style={{
                color: slide.textColor,
                fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
              }}
            >
              {slide.subtitle}
            </h1>

            <div className="mb-6">
              <WavyLine color="#bac706" width={160} />
            </div>

            <p
              key={`desc-${current}`}
              className="text-[15px] sm:text-base md:text-lg leading-relaxed mb-8 slide-fade-in-description"
              style={{ color: slide.textColor, opacity: 0.85 }}
            >
              {slide.description}
            </p>

            <div className="flex flex-wrap gap-3 slide-fade-in-buttons">
              {slide.buttons.map((btn, i) => (
                <Link
                  key={i}
                  to={btn.to}
                  className="inline-block px-6 py-3 rounded-xl font-bold text-sm sm:text-base transition-all duration-300 hover:scale-[1.04] hover:brightness-105 active:scale-[0.98]"
                  style={{
                    backgroundColor: btn.bgColor,
                    color: btn.textColor,
                  }}
                >
                  {btn.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 pb-8 md:pb-10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 xl:px-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goTo(idx)}
                className="relative rounded-full overflow-hidden"
                style={{
                  height: '2px',
                  width: idx === current ? '48px' : '20px',
                  backgroundColor: `${slide.textColor}28`,
                  transition: 'width 0.4s ease',
                }}
                aria-label={`slide ${idx + 1}`}
              >
                {idx === current && (
                  <div
                    className="absolute left-0 top-0 h-full rounded-full"
                    style={{
                      width: `${progress}%`,
                      backgroundColor: '#bac706',
                    }}
                  />
                )}
              </button>
            ))}
            <span
              className="text-[11px] font-bold ml-1"
              style={{ color: slide.textColor, opacity: 0.45 }}
            >
              {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={prev}
              className="w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-300 hover:scale-110 active:scale-95"
              style={{
                borderColor: `${slide.textColor}28`,
                color: slide.textColor,
              }}
              aria-label="anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={next}
              className="w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-300 hover:scale-110 active:scale-95"
              style={{
                borderColor: `${slide.textColor}28`,
                color: slide.textColor,
              }}
              aria-label="próximo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
