import { Link } from 'react-router-dom';
import { Instagram, MessageCircle, Mail } from 'lucide-react';
import { useState } from 'react';
import ContactPopup from './ContactPopup';

export default function PreLoginFooter() {
  const [isContactPopupOpen, setIsContactPopupOpen] = useState(false);

  return (
    <>
      <footer className="bg-footerPurple text-white py-16 border-t-4 border-limeGreen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
            <div className="text-center md:text-left">
              <div className="inline-block">
                <img
                  src="/logo_footer_soltaoverbo.png"
                  alt="solta o verbo"
                  className="h-20 w-auto mb-4"
                />
              </div>
              <p className="text-white/90 text-lg font-light">
                autodesenvolvimento em coletivo
              </p>
            </div>

            <div className="text-center">
              <h3 className="text-xl font-editorial font-bold mb-6 text-white">
                navegação
              </h3>
              <div className="space-y-3">
                <Link
                  to="/about"
                  className="block text-white/80 hover:text-limeGreen transition-colors text-lg"
                >
                  sobre nós
                </Link>
                <Link
                  to="/programs"
                  className="block text-white/80 hover:text-limeGreen transition-colors text-lg"
                >
                  programas
                </Link>
                <button
                  onClick={() => setIsContactPopupOpen(true)}
                  className="block w-full text-white/80 hover:text-limeGreen transition-colors text-lg"
                >
                  contato
                </button>
              </div>
            </div>

            <div className="text-center md:text-right">
              <h3 className="text-xl font-editorial font-bold mb-6 text-white">
                conecte-se
              </h3>
              <div className="flex gap-4 justify-center md:justify-end mb-6">
                <a
                  href="https://www.instagram.com/soltaoverbo.coletivo/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-white/10 hover:bg-limeGreen rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                  aria-label="instagram"
                >
                  <Instagram className="w-6 h-6" />
                </a>
                <a
                  href="https://wa.link/w67ibp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-white/10 hover:bg-limeGreen rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                  aria-label="whatsapp"
                >
                  <MessageCircle className="w-6 h-6" />
                </a>
                <a
                  href="mailto:info@soltaoverbocoletivo.com"
                  className="w-12 h-12 bg-white/10 hover:bg-limeGreen rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                  aria-label="e-mail"
                >
                  <Mail className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-12 max-w-2xl mx-auto">
            <Link
              to="/register"
              className="flex-1 bg-limeGreen text-darkNeutral px-8 py-4 rounded-lg font-bold text-center hover:bg-limeGreen/90 transition-all duration-300 hover:scale-105 text-lg"
            >
              registrate
            </Link>
            <Link
              to="/roteirooriginal"
              className="flex-1 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-lg font-bold text-center transition-all duration-300 hover:scale-105 text-lg border-2 border-white/20"
            >
              mentoria roteiro original
            </Link>
          </div>

          <div className="pt-8 border-t border-white/20">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
              <p className="text-white/70 text-center md:text-left">
                2025 direitos reservados
              </p>
              <div className="flex flex-wrap gap-4 justify-center items-center text-white/60">
                <Link
                  to="/privacy-policy"
                  className="hover:text-white transition-colors"
                >
                  política de privacidad
                </Link>
                <span className="text-white/40">•</span>
                <Link
                  to="/terms-of-service"
                  className="hover:text-white transition-colors"
                >
                  termos de serviço
                </Link>
              </div>
              <a
                href="https://www.digital-alignment.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-white/80 transition-colors"
              >
                made with ❤️ by D.A.
              </a>
            </div>
          </div>
        </div>
      </footer>

      <ContactPopup
        isOpen={isContactPopupOpen}
        onClose={() => setIsContactPopupOpen(false)}
      />
    </>
  );
}
