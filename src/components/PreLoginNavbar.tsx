import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';

export default function PreLoginNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const navLinks = [
    { to: '/about', label: 'sobre nós' },
    { to: '/programs', label: 'programas' },
    { to: '/login', label: 'entrar' },
  ];

  return (
    <>
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? 'shadow-[0_2px_20px_rgba(20,13,130,0.1)]' : ''
        }`}
        style={{
          backgroundColor: scrolled ? 'rgba(237,230,212,0.97)' : '#EDE6D4',
          backdropFilter: scrolled ? 'blur(8px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(8px)' : 'none',
          borderBottom: `1px solid rgba(20,13,130,${scrolled ? '0.12' : '0.06'})`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center" style={{ height: '72px' }}>
            <Link
              to="/"
              className="flex items-center flex-shrink-0"
              onClick={() => setMobileMenuOpen(false)}
            >
              <img
                src="/logo_vertical_tagline_4.png"
                alt="solta o verbo"
                className="h-14 w-auto"
              />
            </Link>

            <div className="hidden lg:flex items-center gap-7">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="nav-link text-darkNeutral font-bold text-[15px]"
                >
                  {label}
                </Link>
              ))}
              <Link
                to="/register"
                className="btn-primary text-[15px] font-bold px-5 py-2.5 rounded-lg"
              >
                fazer parte
              </Link>
            </div>

            <button
              onClick={() => setMobileMenuOpen(v => !v)}
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl transition-all hover:bg-deepBlue/8 active:scale-95"
              aria-label="abrir menu"
            >
              {mobileMenuOpen
                ? <X className="w-5 h-5 text-deepBlue" />
                : <Menu className="w-5 h-5 text-deepBlue" />
              }
            </button>
          </div>
        </div>
      </nav>

      {mobileMenuOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-40 bg-darkNeutral/30 backdrop-blur-sm animate-fadeIn"
            style={{ top: '72px' }}
            onClick={() => setMobileMenuOpen(false)}
          />
          <div
            className="lg:hidden fixed left-0 right-0 z-40 mobile-menu-enter"
            style={{
              top: '72px',
              backgroundColor: '#EDE6D4',
              borderBottom: '1px solid rgba(20,13,130,0.1)',
              boxShadow: '0 16px 40px rgba(20,13,130,0.18)',
            }}
          >
            <div className="max-w-7xl mx-auto px-4 py-3">
              <div className="flex flex-col gap-0.5">
                {navLinks.map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between py-4 px-4 rounded-xl text-deepBlue font-bold text-base hover:bg-deepBlue/6 active:bg-deepBlue/10 transition-colors"
                  >
                    <span>{label}</span>
                    <ArrowRight className="w-4 h-4 opacity-30" />
                  </Link>
                ))}
                <div className="pt-2 pb-2">
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-primary block text-center font-bold py-4 rounded-xl text-base"
                  >
                    fazer parte
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
