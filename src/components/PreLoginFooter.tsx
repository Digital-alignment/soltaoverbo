import { Link } from 'react-router-dom';
import { Instagram, MessageCircle, Mail } from 'lucide-react';
import { useState } from 'react';
import ContactPopup from './ContactPopup';

export default function PreLoginFooter() {
  const [isContactPopupOpen, setIsContactPopupOpen] = useState(false);

  return (
    <>
      <footer
        className="text-white relative overflow-hidden"
        style={{ backgroundColor: '#190087', borderTop: '3px solid #BEC540' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 70% 60% at 100% 100%, rgba(190,197,64,0.07) 0%, transparent 55%)',
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16 relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-12">
            <div>
              <img
                src="/logo_footer_soltaoverbo.png"
                alt="solta o verbo"
                className="h-16 w-auto mb-3"
              />
              <p className="text-white/70 text-sm leading-relaxed max-w-[220px]">
                autodesenvolvimento em coletivo
              </p>
            </div>

            <div>
              <h3 className="text-xs font-bold tracking-[0.18em] mb-5 text-white/50">
                navegação
              </h3>
              <div className="flex flex-col gap-2.5">
                {[
                  { to: '/about', label: 'sobre nós', isLink: true },
                  { to: '/programs', label: 'programas', isLink: true },
                  { to: null, label: 'contato', isLink: false },
                ].map((item, i) =>
                  item.isLink ? (
                    <Link
                      key={i}
                      to={item.to!}
                      className="text-white/65 hover:text-limeGreen transition-colors text-sm font-medium w-fit"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <button
                      key={i}
                      onClick={() => setIsContactPopupOpen(true)}
                      className="text-white/65 hover:text-limeGreen transition-colors text-sm font-medium text-left w-fit"
                    >
                      {item.label}
                    </button>
                  )
                )}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold tracking-[0.18em] mb-5 text-white/50">
                conecte-se
              </h3>
              <div className="flex gap-3 mb-6">
                {[
                  {
                    href: 'https://www.instagram.com/soltaoverbo.coletivo/',
                    icon: Instagram,
                    label: 'instagram',
                  },
                  {
                    href: 'https://wa.link/w67ibp',
                    icon: MessageCircle,
                    label: 'whatsapp',
                  },
                  {
                    href: 'mailto:info@soltaoverbocoletivo.com',
                    icon: Mail,
                    label: 'e-mail',
                  },
                ].map(({ href, icon: Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith('mailto') ? undefined : '_blank'}
                    rel={href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
                    style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#BEC540')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)')}
                    aria-label={label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-10 max-w-xl">
            <Link
              to="/register"
              className="flex-1 py-3.5 px-6 rounded-xl font-bold text-center text-sm transition-all duration-300 hover:brightness-105 hover:scale-[1.02] active:scale-[0.98]"
              style={{ backgroundColor: '#BEC540', color: '#1D1D1B' }}
            >
              registrate
            </Link>
            <Link
              to="/roteirooriginal"
              className="flex-1 py-3.5 px-6 rounded-xl font-bold text-center text-sm transition-all duration-300 hover:bg-white/15 active:scale-[0.98] border"
              style={{ color: 'white', borderColor: 'rgba(255,255,255,0.18)' }}
            >
              mentoria roteiro original
            </Link>
          </div>

          <div
            className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs"
            style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}
          >
            <p className="text-white/45">2025 direitos reservados</p>
            <div className="flex items-center gap-4 text-white/45">
              <Link to="/privacy-policy" className="hover:text-white/70 transition-colors">
                política de privacidade
              </Link>
              <span className="opacity-40">·</span>
              <Link to="/terms-of-service" className="hover:text-white/70 transition-colors">
                termos de serviço
              </Link>
            </div>
            <a
              href="https://www.digital-alignment.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/35 hover:text-white/60 transition-colors"
            >
              made with ❤️ by D.A.
            </a>
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
