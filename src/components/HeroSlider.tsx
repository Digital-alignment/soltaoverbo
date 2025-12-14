import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import WavyLine from './WavyLine';
import Scribble from './Scribble';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  backgroundColor: string;
  textColor: string;
  buttons: Array<{
    label: string;
    to: string;
    bgColor: string;
    textColor: string;
  }>;
}

const slides: Slide[] = [
  {
    id: 1,
    title: 'mentoria coletiva',
    subtitle: 'roteiro original',
    description: 'revisite sua história, amplie perspectivas e abra espaço para escolhas mais conscientes. um convite para questionar narrativas impostas e escrever seu próprio caminho.',
    backgroundColor: '#190087',
    textColor: '#ede5d1',
    buttons: [
      {
        label: 'quero ser parte',
        to: '/register',
        bgColor: '#ede5d1',
        textColor: '#190087',
      },
      {
        label: 'saiba mais',
        to: '/roteirooriginal',
        bgColor: '#bac706',
        textColor: '#000000',
      },
    ],
  },
  {
    id: 2,
    title: 'comunidade viva',
    subtitle: 'solta o verbo',
    description: 'uma comunidade de autodesenvolvimento onde a expressão é caminho para transformar realidades. a escrita é nosso eixo central, mas o encontro, a escuta e a criação coletiva sustentam toda a jornada.',
    backgroundColor: '#140D82',
    textColor: '#ede5d1',
    buttons: [
      {
        label: 'faz parte da comunidade',
        to: '/register',
        bgColor: '#bac706',
        textColor: '#000000',
      },
      {
        label: 'sobre nós',
        to: '/about',
        bgColor: '#ede5d1',
        textColor: '#140D82',
      },
    ],
  },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragCurrent, setDragCurrent] = useState(0);

  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7500);

    return () => clearInterval(interval);
  }, [autoPlay]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setAutoPlay(false);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setAutoPlay(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setAutoPlay(false);
  };

  const handleDragStart = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart(e.clientX);
    setDragCurrent(e.clientX);
    setAutoPlay(false);
  };

  const handleDragMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setDragCurrent(e.clientX);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const dragDistance = dragStart - dragCurrent;
    const dragThreshold = 50;

    if (Math.abs(dragDistance) > dragThreshold) {
      if (dragDistance > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  };

  const handleMouseLeave = () => {
    handleDragEnd();
    setAutoPlay(true);
  };

  const slide = slides[currentSlide];

  return (
    <section
      className="relative py-24 md:py-32 overflow-hidden transition-colors duration-1000 user-select-none"
      style={{
        backgroundColor: slide.backgroundColor,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      onMouseEnter={() => setAutoPlay(false)}
      onMouseDown={handleDragStart}
      onMouseMove={handleDragMove}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleMouseLeave}
    >
      <div className="absolute top-20 right-20 w-40 h-40 opacity-10 pointer-events-none">
        <Scribble variant="circle" color="#FFFFFF" />
      </div>
      <div className="absolute bottom-20 left-10 w-32 h-32 opacity-10 pointer-events-none">
        <Scribble variant="star" color="#FFFFFF" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div key={currentSlide} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="space-y-6">
              <div>
                <h3
                  className="text-lg md:text-xl font-bold tracking-wider mb-2 slide-fade-in-title"
                  style={{ color: slide.textColor }}
                >
                  {slide.title}
                </h3>
                <h1
                  className="font-editorial text-4xl md:text-5xl lg:text-6xl font-bold leading-tight slide-fade-in-subtitle"
                  style={{ color: slide.textColor }}
                >
                  {slide.subtitle}
                </h1>
              </div>

              <div className="pt-4">
                <WavyLine color={slide.buttons[1].bgColor} width={200} />
              </div>

              <p
                className="text-lg md:text-xl leading-relaxed max-w-xl slide-fade-in-description"
                style={{ color: slide.textColor }}
              >
                {slide.description}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-6 slide-fade-in-buttons">
                {slide.buttons.map((button, idx) => (
                  <Link
                    key={idx}
                    to={button.to}
                    className="px-8 py-3 rounded-lg font-bold text-center transition-all duration-500 hover:scale-105 transform"
                    style={{
                      backgroundColor: button.bgColor,
                      color: button.textColor,
                    }}
                  >
                    {button.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 flex justify-center">
            <div
              className="w-full max-w-md h-64 md:h-80 rounded-3xl flex items-center justify-center relative overflow-hidden slide-fade-in-image"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
            >
              {currentSlide === 0 ? (
                <img
                  src="/whatsapp_image_2025-12-08_at_18.13.13_cda3219b.jpg"
                  alt="Roteiro Original"
                  className="w-full h-full object-cover"
                />
              ) : currentSlide === 1 ? (
                <img
                  src="/whatsapp_image_2025-12-08_at_17.50.04_530c541c.jpg"
                  alt="Solta o Verbo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center">
                  <Scribble variant="star" color={slide.textColor} />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-16 pt-8 border-t border-white/20">
          <div className="flex gap-3">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className="transition-all duration-500"
                aria-label={`Go to slide ${idx + 1}`}
              >
                <div
                  className={`rounded-full transition-all duration-500 ${
                    idx === currentSlide ? 'w-8 h-3' : 'w-3 h-3'
                  }`}
                  style={{
                    backgroundColor:
                      idx === currentSlide ? slide.buttons[1].bgColor : 'rgba(255, 255, 255, 0.4)',
                  }}
                />
              </button>
            ))}
          </div>

          <div className="hidden md:flex gap-3">
            <button
              onClick={prevSlide}
              className="p-3 rounded-lg transition-all duration-500 hover:scale-110 border"
              style={{
                borderColor: slide.textColor,
                color: slide.textColor,
              }}
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="p-3 rounded-lg transition-all duration-500 hover:scale-110 border"
              style={{
                borderColor: slide.textColor,
                color: slide.textColor,
              }}
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <div className="md:hidden">
            <span
              className="text-sm font-bold"
              style={{ color: slide.textColor }}
            >
              {currentSlide + 1} / {slides.length}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
