import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  ArrowRight,
  Pencil,
  ChevronDown,
  BookOpen,
  Users,
  Coffee,
  Building2,
  Compass,
  LogIn,
} from 'lucide-react';
import { BRAND_ASSETS } from '../config/brandAssets';

export default function PreLoginNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const location = useLocation();

  // Escucha el scroll con umbral de histeresis para evitar la oscilación y palpitación del header
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y > 40) {
        setScrolled(true);
      } else if (y < 10) {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Cierra el dropdown al fazer clic fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Bloquea el scroll del body cuando el menú móvil está aberto
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const productSubItems = [
    {
      to: '/programas/21-dias-de-escrita',
      label: '21 dias de escrita',
      desc: 'desafio self-paced de 21 dias',
      icon: BookOpen,
    },
    {
      to: '/programas/ciclo-de-aprofundamento',
      label: 'ciclo de aprofundamento',
      desc: 'mentoria ao vivo & comunidade',
      icon: Users,
    },
    {
      to: '/programas/cafe-com-letras',
      label: 'café com letras',
      desc: 'rodas temáticas de escrita',
      icon: Coffee,
    },
    {
      to: '/experiencias',
      label: 'contrate uma experiência',
      desc: 'oficinas corporativas & eventos',
      icon: Building2,
    },
  ];

  const isActive = (path: string) => location.pathname === path;
  const isProgramsActive =
    location.pathname.startsWith('/programas') ||
    location.pathname === '/programs' ||
    location.pathname === '/experiencias';

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 200);
  };

  const handleSubItemClick = (subItem: typeof productSubItems[0]) => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    if (location.pathname === subItem.to) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Header Desktop & Mobile Sticky com dimensão fixa para eliminar palpitación */}
      <header
        className={`sticky top-0 left-0 right-0 z-50 py-3.5 sm:py-4 transition-all duration-300 ease-in-out ${
          scrolled
            ? 'bg-bgPlataforma/95 backdrop-blur-md shadow-kraft border-b border-papelKraft/60'
            : 'bg-bgPlataforma border-b border-papelKraft/40'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo de Solta o Verbo (Solo la marca horizontal sin espiral) */}
            <Link
              to="/"
              className="flex items-center flex-shrink-0 group"
              onClick={() => setMobileMenuOpen(false)}
            >
              <img
                src={BRAND_ASSETS.logos.horizontal}
                alt="solta o verbo"
                className="h-8 sm:h-9.5 w-auto max-w-[200px] sm:max-w-[240px] object-contain transition-all duration-300 group-hover:opacity-90"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/logo_horizontal_4.png';
                }}
              />
            </Link>

            {/* Links de Navegación Desktop con Íconos a la Izquierda */}
            <nav className="hidden lg:flex items-center gap-7 xl:gap-9">
              {/* Início */}
              <Link
                to="/"
                className={`font-medium transition-colors duration-200 lowercase relative flex items-center gap-2 text-base xl:text-lg ${
                  isActive('/')
                    ? 'text-acentoAzul font-semibold'
                    : 'text-tintaCarvao/80 hover:text-acentoAzul'
                }`}
              >
                <Compass className={`w-4 h-4 ${isActive('/') ? 'text-acentoTerracota' : 'text-acentoTerracota/80'}`} />
                <span>início</span>
                {isActive('/') && (
                  <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-acentoOliva rounded-full" />
                )}
              </Link>

              {/* Programas (con icono BookOpen a la izquierda) */}
              <div
                ref={dropdownRef}
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`font-medium transition-colors duration-200 lowercase relative flex items-center gap-2 bg-transparent border-none cursor-pointer p-0 py-1 text-base xl:text-lg ${
                    isProgramsActive
                      ? 'text-acentoAzul font-semibold'
                      : 'text-tintaCarvao/80 hover:text-acentoAzul'
                  }`}
                >
                  <BookOpen className={`w-4 h-4 ${isProgramsActive ? 'text-acentoAzul' : 'text-acentoAzul/80'}`} />
                  <span>programas</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      dropdownOpen ? 'rotate-180 text-acentoAzul' : 'text-tintaCarvao/60'
                    }`}
                  />
                  {isProgramsActive && (
                    <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-acentoOliva rounded-full" />
                  )}
                </button>

                {/* Sub-menu Dropdown Desplegable Ultra Limpio & Elegante */}
                {dropdownOpen && (
                  <div
                    className="absolute top-full left-0 pt-2.5 w-96 sm:w-[460px] z-50"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="bg-papelClaro rounded-3xl p-4 sm:p-5 border border-papelKraft/60 shadow-kraft-lg animate-fadeIn space-y-2">
                      <div className="flex items-center justify-between px-2 pb-2 border-b border-papelKraft/30">
                        <span className="text-[11px] font-bold text-tintaCarvao/50 lowercase tracking-widest">
                          programas de escrita
                        </span>
                        <span className="text-[11px] font-medium text-acentoTerracota bg-acentoTerracota/10 px-2.5 py-0.5 rounded-full lowercase">
                          4 opções disponíveis
                        </span>
                      </div>

                      {/* Lista Vertical Espaciosa y Limpia */}
                      <div className="space-y-1.5">
                        {productSubItems.map((subItem) => {
                          const Icon = subItem.icon;
                          const active = location.pathname === subItem.to;
                          return (
                            <Link
                              key={subItem.to}
                              to={subItem.to}
                              onClick={() => handleSubItemClick(subItem)}
                              className={`flex items-start gap-4 p-3.5 sm:p-4 rounded-2xl transition-all duration-200 group ${
                                active
                                  ? 'bg-acentoAzul/10 border border-acentoAzul/30 shadow-xs'
                                  : 'hover:bg-bgPlataforma border border-transparent hover:border-papelKraft/40'
                              }`}
                            >
                              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-acentoAzul/10 text-acentoAzul flex items-center justify-center flex-shrink-0 group-hover:bg-acentoAzul group-hover:text-white transition-all duration-200 shadow-xs mt-0.5">
                                <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="font-bold text-base sm:text-lg font-editorial text-acentoAzul group-hover:text-acentoTerracota transition-colors lowercase block">
                                  {subItem.label}
                                </span>
                                <p className="text-xs sm:text-sm text-tintaCarvao/80 lowercase font-medium mt-0.5 leading-snug">
                                  {subItem.desc}
                                </p>
                              </div>
                            </Link>
                          );
                        })}
                      </div>

                      <div className="pt-3 border-t border-papelKraft/30 flex items-center justify-between px-2">
                        <span className="text-xs text-tintaCarvao/60 font-medium lowercase">
                          conheça nosso catálogo
                        </span>
                        <Link
                          to="/programs"
                          onClick={() => handleSubItemClick(productSubItems[0])}
                          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold text-acentoAzul hover:bg-acentoAzul/10 transition-colors lowercase"
                        >
                          <span>ver todos os programas</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sobre Nós */}
              <Link
                to="/about"
                className={`font-medium transition-colors duration-200 lowercase relative flex items-center gap-2 text-base xl:text-lg ${
                  isActive('/about')
                    ? 'text-acentoAzul font-semibold'
                    : 'text-tintaCarvao/80 hover:text-acentoAzul'
                }`}
              >
                <Users className={`w-4 h-4 ${isActive('/about') ? 'text-acentoAzul' : 'text-acentoAzul/80'}`} />
                <span>sobre nós</span>
                {isActive('/about') && (
                  <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-acentoOliva rounded-full" />
                )}
              </Link>
            </nav>

            {/* Ações Direitas Desktop (Entrar & Fazer Parte com UI melhorada e íconos) */}
            <div className="hidden lg:flex items-center gap-3 xl:gap-4">
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-2 rounded-full font-medium text-tintaCarvao/80 hover:text-acentoAzul hover:bg-papelClaro border border-transparent hover:border-papelKraft/40 transition-all lowercase text-base cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-acentoAzul" />
                <span>entrar</span>
              </Link>

              <Link
                to="/register"
                className="btn-pill-primary text-base px-6 py-2.5 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2.5 cursor-pointer"
              >
                <Pencil className="w-4 h-4 text-white" />
                <span>fazer parte</span>
              </Link>
            </div>

            {/* Botão de Menu Hambúrguer Móvel */}
            <div className="flex items-center lg:hidden gap-3">
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-papelClaro border border-papelKraft/50 text-xs font-semibold text-acentoAzul lowercase"
              >
                <LogIn className="w-3.5 h-3.5 text-acentoAzul" />
                <span>entrar</span>
              </Link>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-tintaCarvao hover:text-acentoAzul hover:bg-papelClaro border border-papelKraft/40 transition-colors cursor-pointer"
                aria-label="Abrir menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Drawer do Menu Móvel Off-Canvas com Blur */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Overlay Escuro com Blur */}
          <div
            className="fixed inset-0 bg-acentoAzul/60 backdrop-blur-sm transition-opacity animate-fadeIn"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Painel Lateral */}
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-papelClaro shadow-2xl p-6 flex flex-col justify-between overflow-y-auto animate-slideInRight border-l border-papelKraft/60">
            <div className="space-y-6">
              {/* Header do Menu Móvel */}
              <div className="flex items-center justify-between pb-4 border-b border-papelKraft/40">
                <img
                  src={BRAND_ASSETS.logos.horizontal}
                  alt="solta o verbo"
                  className="h-7 w-auto object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/logo_horizontal_4.png';
                  }}
                />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-full bg-bgPlataforma text-tintaCarvao hover:text-acentoAzul border border-papelKraft/40 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Links Principais Móveis */}
              <nav className="flex flex-col space-y-3">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`p-3 rounded-xl font-medium flex items-center justify-between lowercase transition-all ${
                    isActive('/')
                      ? 'bg-acentoAzul text-white shadow-sm'
                      : 'text-tintaCarvao hover:bg-bgPlataforma'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Compass className="w-4 h-4" />
                    <span>início</span>
                  </div>
                  {isActive('/') && <ArrowRight className="w-4 h-4 text-white" />}
                </Link>

                {/* Sub-itens de Programas no Menu Móvel */}
                <div className="space-y-2 pt-2 border-t border-b border-papelKraft/30 py-3">
                  <span className="px-4 text-xs font-bold text-acentoAzul lowercase tracking-wider block mb-2">
                    nossos programas
                  </span>

                  {productSubItems.map((subItem) => {
                    const Icon = subItem.icon;
                    const active = location.pathname === subItem.to;
                    return (
                      <Link
                        key={subItem.to}
                        to={subItem.to}
                        onClick={() => handleSubItemClick(subItem)}
                        className={`p-3 rounded-xl flex items-center gap-3 transition-all ${
                          active
                            ? 'bg-acentoAzul/10 text-acentoAzul font-semibold border border-acentoAzul/30'
                            : 'text-tintaCarvao/85 hover:bg-bgPlataforma'
                        }`}
                      >
                        <Icon className="w-4 h-4 text-acentoAzul flex-shrink-0" />
                        <span className="text-sm font-medium lowercase">{subItem.label}</span>
                      </Link>
                    );
                  })}
                </div>

                <Link
                  to="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`p-3 rounded-xl font-medium flex items-center justify-between lowercase transition-all ${
                    isActive('/about')
                      ? 'bg-acentoAzul text-white shadow-sm'
                      : 'text-tintaCarvao hover:bg-bgPlataforma'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4" />
                    <span>sobre nós</span>
                  </div>
                  {isActive('/about') && <ArrowRight className="w-4 h-4 text-white" />}
                </Link>
              </nav>
            </div>

            {/* CTAs no Rodapé do Menu Móvel */}
            <div className="space-y-3 pt-6 border-t border-papelKraft/40">
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-pill-primary w-full py-3.5 rounded-full flex items-center justify-center gap-2 text-center text-sm font-semibold shadow-md lowercase"
              >
                <Pencil className="w-4 h-4 text-white" />
                <span>fazer parte</span>
              </Link>

              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 rounded-full flex items-center justify-center gap-2 text-center text-sm font-semibold text-tintaCarvao hover:text-acentoAzul bg-bgPlataforma border border-papelKraft/40 lowercase"
              >
                <LogIn className="w-4 h-4 text-acentoAzul" />
                <span>entrar na plataforma</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
