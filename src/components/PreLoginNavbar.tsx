import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, Pencil } from 'lucide-react';
import { BRAND_ASSETS } from '../config/brandAssets';

export default function PreLoginNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Bloquea el scroll del cuerpo de la página cuando el menú móvil full-page está abierto
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { to: '/', label: 'início' },
    { to: '/programs', label: 'programas' },
    { to: '/about', label: 'sobre nós' },
    { to: '/login', label: 'entrar' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Header Desktop & Mobile Sticky */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ease-in-out ${
          scrolled
            ? 'bg-bgPlataforma/95 backdrop-blur-md shadow-kraft border-b border-papelKraft/60 py-3.5'
            : 'bg-bgPlataforma border-b border-papelKraft/40 py-5 sm:py-7'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center transition-all duration-300">
            {/* Logo e Ícono Master de Solta o Verbo (Mayor Tamaño) */}
            <Link
              to="/"
              className="flex items-center gap-3.5 sm:gap-4 flex-shrink-0 group"
              onClick={() => setMobileMenuOpen(false)}
            >
              <img
                src={BRAND_ASSETS.logos.icon}
                alt="solta o verbo mark"
                className={`w-auto transition-all duration-300 group-hover:rotate-6 ${
                  scrolled ? 'h-9 sm:h-10' : 'h-12 sm:h-14'
                }`}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/icone.svg';
                }}
              />
              <img
                src={BRAND_ASSETS.logos.horizontal}
                alt="solta o verbo"
                className={`w-auto object-contain transition-all duration-300 ${
                  scrolled
                    ? 'h-7 sm:h-8 max-w-[170px] sm:max-w-[200px]'
                    : 'h-10 sm:h-12 max-w-[220px] sm:max-w-[260px]'
                }`}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/logo_horizontal_4.png';
                }}
              />
            </Link>

            {/* Links de Navegación Desktop (Mayor Tamaño de Texto) */}
            <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
              {navLinks.map(({ to, label }) => {
                const active = isActive(to);
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`font-medium transition-colors duration-200 lowercase relative ${
                      scrolled ? 'text-base' : 'text-lg xl:text-xl'
                    } ${
                      active
                        ? 'text-acentoAzul font-semibold'
                        : 'text-tintaCarvao/80 hover:text-acentoAzul'
                    }`}
                  >
                    {label}
                    {active && (
                      <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-acentoOliva rounded-full" />
                    )}
                  </Link>
                );
              })}

              {/* Botón CTA 'fazer parte' con Ícono de Lápiz */}
              <Link
                to="/register"
                className={`btn-pill-primary font-medium lowercase shadow-sm hover:shadow-md transition-all flex items-center gap-2.5 rounded-full ${
                  scrolled ? 'text-sm px-6 py-2.5' : 'text-base sm:text-lg px-7 py-3'
                }`}
              >
                <span>fazer parte</span>
                <Pencil className={scrolled ? 'w-4 h-4' : 'w-5 h-5'} />
              </Link>
            </nav>

            {/* Botón Menu Hamburguesa Mobile (Sin Fondo Circular, Solo Ícono Limpio) */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden flex items-center justify-center p-2 text-acentoAzul hover:text-acentoAzul/80 transition-all active:scale-95 bg-transparent border-none focus:outline-none"
              aria-label="abrir menu de navegação"
            >
              <Menu className="w-8 h-8 sm:w-9 sm:h-9" />
            </button>
          </div>
        </div>
      </header>

      {/* Menú Mobile Full-Page Modal (Imagen 3) */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-bgPlataforma flex flex-col justify-between p-6 sm:p-8 overflow-y-auto animate-menuOpen">
          {/* Top Bar inside Full-Page Menu: Logo Mayor + Botón X Limpio (Sin Fondo Circular) */}
          <div className="flex justify-between items-center pb-6 border-b border-papelKraft/40">
            <Link
              to="/"
              className="flex items-center gap-3.5"
              onClick={() => setMobileMenuOpen(false)}
            >
              <img
                src={BRAND_ASSETS.logos.icon}
                alt="solta o verbo mark"
                className="h-11 sm:h-13 w-auto"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/icone.svg';
                }}
              />
              <img
                src={BRAND_ASSETS.logos.horizontal}
                alt="solta o verbo"
                className="h-9 sm:h-11 w-auto max-w-[210px] object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/logo_horizontal_4.png';
                }}
              />
            </Link>

            {/* Botón X sin fondo circular */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-tintaCarvao hover:text-acentoAzul transition-colors active:scale-95 bg-transparent border-none focus:outline-none"
              aria-label="fechar menu"
            >
              <X className="w-8 h-8 sm:w-9 sm:h-9" />
            </button>
          </div>

          {/* Links de Navegación Verticales (Estilo Pílulas / Bento Cards) */}
          <div className="my-auto py-8 space-y-4 max-w-md mx-auto w-full">
            {navLinks.map(({ to, label }) => {
              const active = isActive(to);
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between py-4 px-6 rounded-2xl text-xl font-medium lowercase transition-all ${
                    active
                      ? 'bg-papelClaro text-acentoAzul border border-papelKraft/60 shadow-kraft'
                      : 'text-tintaCarvao/90 hover:bg-papelClaro/70 border border-transparent'
                  }`}
                >
                  <span>{label}</span>
                  <ArrowRight className={`w-5 h-5 ${active ? 'text-acentoAzul' : 'text-tintaCarvao/40'}`} />
                </Link>
              );
            })}
          </div>

          {/* Botón CTA Inferior Full-Width con Lápiz */}
          <div className="pt-6 border-t border-papelKraft/40 max-w-md mx-auto w-full">
            <Link
              to="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-pill-primary w-full text-center py-4 rounded-full text-xl flex items-center justify-center gap-3 shadow-md hover:shadow-lg transition-all"
            >
              <span>fazer parte</span>
              <Pencil className="w-5 h-5" />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
