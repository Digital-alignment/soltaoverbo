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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Cierra el dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Bloquea el scroll del body cuando el menú móvil está abierto
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
    }
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 200);
  };

  const handleSubItemClick = (subItem: typeof productSubItems[0]) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Header Desktop & Mobile Sticky que se mantiene fijo al hacer scroll */}
      <header
        className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
          scrolled
            ? 'bg-bgPlataforma/95 backdrop-blur-md shadow-kraft border-b border-papelKraft/60 py-3.5'
            : 'bg-bgPlataforma border-b border-papelKraft/40 py-4 sm:py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center transition-all duration-300">
            {/* Logo de Solta o Verbo (Solo la marca horizontal sin espiral) */}
            <Link
              to="/"
              className="flex items-center flex-shrink-0 group"
              onClick={() => setMobileMenuOpen(false)}
            >
              <img
                src={BRAND_ASSETS.logos.horizontal}
                alt="solta o verbo"
                className={`w-auto object-contain transition-all duration-300 group-hover:opacity-90 ${
                  scrolled
                    ? 'h-8 sm:h-9 max-w-[180px] sm:max-w-[210px]'
                    : 'h-10 sm:h-12 max-w-[220px] sm:max-w-[260px]'
                }`}
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
                className={`font-medium transition-colors duration-200 lowercase relative flex items-center gap-2 ${
                  scrolled ? 'text-base' : 'text-lg xl:text-xl'
                } ${
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
                  className={`font-medium transition-colors duration-200 lowercase relative flex items-center gap-2 bg-transparent border-none cursor-pointer p-0 py-1 ${
                    scrolled ? 'text-base' : 'text-lg xl:text-xl'
                  } ${
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

                {/* Sub-menu Dropdown Desplegable */}
                {dropdownOpen && (
                  <div
                    className="absolute top-full left-0 pt-2.5 w-80 z-50"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="bg-papelClaro rounded-3xl p-3.5 border border-papelKraft/70 shadow-kraft-lg animate-fadeIn space-y-1">
                      <div className="px-3 py-1.5 text-[11px] font-bold text-tintaCarvao/50 uppercase tracking-wider">
                        nossos programas de escrita
                      </div>

                      {productSubItems.map((subItem) => {
                        const Icon = subItem.icon;
                        const active = location.pathname === subItem.to;
                        return (
                          <Link
                            key={subItem.to}
                            to={subItem.to}
                            onClick={() => handleSubItemClick(subItem)}
                            className={`flex items-start gap-3.5 p-3 rounded-2xl transition-all ${
                              active
                                ? 'bg-acentoAzul/10 border border-acentoAzul/20 shadow-xs'
                                : 'hover:bg-bgPlataforma border border-transparent hover:border-papelKraft/40'
                            }`}
                          >
                            <div className="w-10 h-10 rounded-xl bg-acentoAzul/10 text-acentoAzul flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Icon className="w-5 h-5 text-acentoAzul" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="font-bold text-sm text-acentoAzul lowercase block truncate">
                                {subItem.label}
                              </span>
                              <p className="text-xs text-tintaCarvao/75 lowercase font-medium line-clamp-1 mt-0.5">
                                {subItem.desc}
                              </p>
                            </div>
                          </Link>
                        );
                      })}

                      <div className="pt-2 mt-1 border-t border-papelKraft/40">
                        <Link
                          to="/programs"
                          onClick={() => handleSubItemClick(productSubItems[0])}
                          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-acentoAzul hover:bg-acentoAzul/10 transition-colors lowercase"
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
                className={`font-medium transition-colors duration-200 lowercase relative flex items-center gap-2 ${
                  scrolled ? 'text-base' : 'text-lg xl:text-xl'
                } ${
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
                className="p-2 rounded-xl text-tintaCarvao hover:text-acentoAzul hover:bg-papelClaro focus:outline-none transition-colors"
                aria-label="menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Menu Off-canvas Móvel */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-acentoAzul/40 backdrop-blur-sm lg:hidden animate-fadeIn">
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-papelClaro border-l border-papelKraft/40 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6 pt-16">
              <div className="flex justify-between items-center pb-4 border-b border-papelKraft/30">
                <span className="font-editorial font-bold text-lg text-acentoAzul lowercase">
                  menu de navegação
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-tintaCarvao/60 hover:text-acentoAzul"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-3">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-lg font-medium lowercase ${
                    isActive('/')
                      ? 'bg-acentoAzul text-white font-bold'
                      : 'text-tintaCarvao hover:bg-bgPlataforma'
                  }`}
                >
                  <Compass className="w-5 h-5" />
                  <span>início</span>
                </Link>

                {/* Sub-itens de Programas no Menu Móvel */}
                <div className="space-y-2 pt-2 border-t border-b border-papelKraft/30 py-3">
                  <span className="px-4 text-xs font-bold text-acentoAzul uppercase tracking-wider block mb-2">
                    nossos programas
                  </span>

                  {productSubItems.map((subItem) => {
                    const Icon = subItem.icon;
                    const active = location.pathname === subItem.to;
                    return (
                      <Link
                        key={subItem.to}
                        to={subItem.to}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-2xl ${
                          active
                            ? 'bg-acentoAzul text-white font-bold'
                            : 'bg-bgPlataforma/70 text-tintaCarvao hover:bg-bgPlataforma'
                        }`}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        <span className="text-base font-medium lowercase">{subItem.label}</span>
                      </Link>
                    );
                  })}
                </div>

                <Link
                  to="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-lg font-medium lowercase ${
                    isActive('/about')
                      ? 'bg-acentoAzul text-white font-bold'
                      : 'text-tintaCarvao hover:bg-bgPlataforma'
                  }`}
                >
                  <Users className="w-5 h-5" />
                  <span>sobre nós</span>
                </Link>
              </div>
            </div>

            <div className="pt-6 border-t border-papelKraft/30 space-y-3">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 text-center font-bold text-acentoAzul bg-bgPlataforma rounded-full border border-papelKraft/40 lowercase"
              >
                <LogIn className="w-4 h-4" />
                <span>entrar na conta</span>
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-pill-primary flex items-center justify-center gap-2 w-full py-3.5 text-center font-bold lowercase text-base"
              >
                <Pencil className="w-4 h-4 text-white" />
                <span>criar conta gratuita</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
