import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, Pencil, ChevronDown, BookOpen, Users, Coffee, Building2 } from 'lucide-react';
import { BRAND_ASSETS } from '../config/brandAssets';

export default function PreLoginNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Cierra el dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Bloquea el scroll del cuerpo cuando el menú móvil full-page está abierto
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
  const isProgramsActive = location.pathname.startsWith('/programas') || location.pathname === '/programs';

  const handleSubItemClick = (subItem: typeof productSubItems[0]) => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    if (subItem.isHash) {
      const elem = document.getElementById('experiencias');
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.href = '/#experiencias';
      }
    }
  };

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
            {/* Logo e Ícono Master de Solta o Verbo */}
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

            {/* Links de Navegación Desktop */}
            <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
              <Link
                to="/"
                className={`font-medium transition-colors duration-200 lowercase relative ${
                  scrolled ? 'text-base' : 'text-lg xl:text-xl'
                } ${
                  isActive('/')
                    ? 'text-acentoAzul font-semibold'
                    : 'text-tintaCarvao/80 hover:text-acentoAzul'
                }`}
              >
                início
                {isActive('/') && (
                  <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-acentoOliva rounded-full" />
                )}
              </Link>

              {/* DROPDOWN MENU PARA "PROGRAMAS" (SIN PRECIOS) */}
              <div
                ref={dropdownRef}
                className="relative"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`font-medium transition-colors duration-200 lowercase relative flex items-center gap-1.5 bg-transparent border-none cursor-pointer p-0 ${
                    scrolled ? 'text-base' : 'text-lg xl:text-xl'
                  } ${
                    isProgramsActive
                      ? 'text-acentoAzul font-semibold'
                      : 'text-tintaCarvao/80 hover:text-acentoAzul'
                  }`}
                >
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

                {/* Sub-menu Dropdown Desplegable (Limpio Sin Valores) */}
                {dropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-72 bg-papelClaro rounded-2xl p-3 border border-papelKraft/70 shadow-kraft-lg animate-fadeIn z-50 space-y-1">
                    <div className="px-3 py-1.5 text-[11px] font-bold text-tintaCarvao/50 uppercase tracking-wider">
                      nossos programas de escrita
                    </div>

                    {productSubItems.map((subItem) => {
                      const Icon = subItem.icon;
                      const active = location.pathname === subItem.to;
                      return subItem.isHash ? (
                        <a
                          key={subItem.to}
                          href={subItem.to}
                          onClick={() => handleSubItemClick(subItem)}
                          className="flex items-start gap-3 p-3 rounded-xl transition-all hover:bg-bgPlataforma border border-transparent"
                        >
                          <div className="w-9 h-9 rounded-lg bg-acentoAzul/10 text-acentoAzul flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Icon className="w-4 h-4 text-acentoAzul" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="font-bold text-sm text-acentoAzul lowercase block truncate">
                              {subItem.label}
                            </span>
                            <p className="text-xs text-tintaCarvao/70 lowercase font-medium line-clamp-1 mt-0.5">
                              {subItem.desc}
                            </p>
                          </div>
                        </a>
                      ) : (
                        <Link
                          key={subItem.to}
                          to={subItem.to}
                          onClick={() => handleSubItemClick(subItem)}
                          className={`flex items-start gap-3 p-3 rounded-xl transition-all ${
                            active
                              ? 'bg-acentoAzul/10 border border-acentoAzul/20'
                              : 'hover:bg-bgPlataforma border border-transparent'
                          }`}
                        >
                          <div className="w-9 h-9 rounded-lg bg-acentoAzul/10 text-acentoAzul flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Icon className="w-4 h-4 text-acentoAzul" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="font-bold text-sm text-acentoAzul lowercase block truncate">
                              {subItem.label}
                            </span>
                            <p className="text-xs text-tintaCarvao/70 lowercase font-medium line-clamp-1 mt-0.5">
                              {subItem.desc}
                            </p>
                          </div>
                        </Link>
                      );
                    })}

                    <div className="pt-2 border-t border-papelKraft/40">
                      <Link
                        to="/programs"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center justify-between p-2.5 rounded-xl text-xs font-bold text-acentoAzul hover:bg-bgPlataforma transition-all lowercase"
                      >
                        <span>ver todos os programas</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <Link
                to="/about"
                className={`font-medium transition-colors duration-200 lowercase relative ${
                  scrolled ? 'text-base' : 'text-lg xl:text-xl'
                } ${
                  isActive('/about')
                    ? 'text-acentoAzul font-semibold'
                    : 'text-tintaCarvao/80 hover:text-acentoAzul'
                }`}
              >
                sobre nós
                {isActive('/about') && (
                  <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-acentoOliva rounded-full" />
                )}
              </Link>

              <Link
                to="/login"
                className={`font-medium transition-colors duration-200 lowercase relative ${
                  scrolled ? 'text-base' : 'text-lg xl:text-xl'
                } ${
                  isActive('/login')
                    ? 'text-acentoAzul font-semibold'
                    : 'text-tintaCarvao/80 hover:text-acentoAzul'
                }`}
              >
                entrar
                {isActive('/login') && (
                  <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-acentoOliva rounded-full" />
                )}
              </Link>

              {/* Botón CTA 'fazer parte' */}
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

            {/* Botón Menu Hamburguesa Mobile */}
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

      {/* Menú Mobile Full-Page Modal (UI de Sub-items Rediseñada) */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-bgPlataforma flex flex-col justify-between p-6 sm:p-8 overflow-y-auto animate-menuOpen">
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

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-tintaCarvao hover:text-acentoAzul transition-colors active:scale-95 bg-transparent border-none focus:outline-none"
              aria-label="fechar menu"
            >
              <X className="w-8 h-8" />
            </button>
          </div>

          <div className="py-6 space-y-5 my-auto">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-3xl font-bold font-editorial text-acentoAzul lowercase"
            >
              início
            </Link>

            {/* Sub-menu de Productos Rediseñado en Mobile con Cards Bento */}
            <div className="space-y-3 pt-1 pb-1">
              <span className="block text-2xl font-bold font-editorial text-acentoAzul lowercase">
                programas
              </span>

              <div className="grid grid-cols-1 gap-2.5 pl-2">
                {productSubItems.map((subItem) => {
                  const Icon = subItem.icon;
                  return subItem.isHash ? (
                    <a
                      key={subItem.to}
                      href={subItem.to}
                      onClick={() => handleSubItemClick(subItem)}
                      className="bg-papelClaro p-3.5 rounded-2xl border border-papelKraft/50 flex items-center gap-3.5 active:bg-papelKraft/20 transition-all shadow-sm"
                    >
                      <div className="w-10 h-10 rounded-xl bg-acentoAzul/10 text-acentoAzul flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-acentoAzul" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="block text-base font-bold text-acentoAzul lowercase truncate">
                          {subItem.label}
                        </span>
                        <p className="text-xs text-tintaCarvao/70 lowercase font-medium truncate">
                          {subItem.desc}
                        </p>
                      </div>
                    </a>
                  ) : (
                    <Link
                      key={subItem.to}
                      to={subItem.to}
                      onClick={() => handleSubItemClick(subItem)}
                      className="bg-papelClaro p-3.5 rounded-2xl border border-papelKraft/50 flex items-center gap-3.5 active:bg-papelKraft/20 transition-all shadow-sm"
                    >
                      <div className="w-10 h-10 rounded-xl bg-acentoAzul/10 text-acentoAzul flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-acentoAzul" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="block text-base font-bold text-acentoAzul lowercase truncate">
                          {subItem.label}
                        </span>
                        <p className="text-xs text-tintaCarvao/70 lowercase font-medium truncate">
                          {subItem.desc}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-3xl font-bold font-editorial text-acentoAzul lowercase"
            >
              sobre nós
            </Link>

            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-3xl font-bold font-editorial text-acentoAzul lowercase"
            >
              entrar
            </Link>
          </div>

          <div className="pt-6 border-t border-papelKraft/40">
            <Link
              to="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-pill-primary w-full py-4 rounded-full text-center text-lg font-medium shadow-md flex items-center justify-center gap-2.5 lowercase"
            >
              <span>fazer parte agora</span>
              <Pencil className="w-5 h-5" />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
