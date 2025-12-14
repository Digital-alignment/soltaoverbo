import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function PreLoginNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="border-b border-darkNeutral/10 sticky top-0 z-50" style={{ backgroundColor: '#EDE6D4' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-3 flex-shrink-0">
            <img
              src="/logo_vertical_tagline_4.png"
              alt="solta o verbo"
              className="h-16 w-auto"
            />
          </Link>

          <div className="hidden lg:flex items-center space-x-6">
            <Link
              to="/about"
              className="nav-link text-darkNeutral font-bold hover:text-deepBlue transition-colors"
            >
              sobre nós
            </Link>
            <Link
              to="/programs"
              className="nav-link text-darkNeutral font-bold hover:text-deepBlue transition-colors"
            >
              programas
            </Link>
            <Link
              to="/login"
              className="nav-link text-darkNeutral font-bold hover:text-deepBlue transition-colors"
            >
              entrar
            </Link>
            <Link to="/register" className="btn-primary font-editorial">
              fazer parte
            </Link>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden flex flex-col justify-center items-center w-10 h-10 rounded-lg hover:bg-deepBlue/5 transition-colors ${mobileMenuOpen ? 'hamburger-open' : ''}`}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-deepBlue" />
            ) : (
              <Menu className="w-6 h-6 text-deepBlue" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t-2 border-deepBlue/10 mobile-menu-enter" style={{ backgroundColor: '#EDE6D4' }}>
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-3">
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="nav-link block py-3 px-4 text-deepBlue font-bold hover:bg-deepBlue/5 rounded-lg transition-colors"
            >
              sobre nós
            </Link>
            <Link
              to="/programs"
              onClick={() => setMobileMenuOpen(false)}
              className="nav-link block py-3 px-4 text-deepBlue font-bold hover:bg-deepBlue/5 rounded-lg transition-colors"
            >
              programas
            </Link>
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="nav-link block py-3 px-4 text-deepBlue font-bold hover:bg-deepBlue/5 rounded-lg transition-colors"
            >
              entrar
            </Link>
            <Link
              to="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-primary block py-3 px-4 font-editorial text-center font-bold rounded-lg transition-colors"
            >
              fazer parte
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
