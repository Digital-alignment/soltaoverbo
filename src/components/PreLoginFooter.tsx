import { Link } from 'react-router-dom';
import { Instagram, MessageCircle, Mail, Sparkles } from 'lucide-react';
import { useState } from 'react';
import ContactPopup from './ContactPopup';
import { BRAND_ASSETS } from '../config/brandAssets';

export default function PreLoginFooter() {
  const [isContactPopupOpen, setIsContactPopupOpen] = useState(false);

  return (
    <>
      <footer className="bg-acentoAzul text-white relative overflow-hidden border-t-4 border-acentoOliva">
        {/* Marca d'água gigantesca no fundo */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10 flex items-center justify-center overflow-hidden"
          style={{
            backgroundImage: `url(${BRAND_ASSETS.logos.footerWatermark})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center right',
            backgroundSize: 'contain',
          }}
        />

        {/* Emblema sv giratório sutil */}
        <div className="absolute top-6 right-6 sm:top-10 sm:right-10 pointer-events-none opacity-20 hidden sm:block">
          <img
            src={BRAND_ASSETS.logos.icon}
            alt="emblema solta o verbo"
            className="w-16 h-16 animate-spin-slow"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
            {/* Coluna 1: Logotipo e Manifesto */}
            <div className="space-y-4">
              <img
                src={BRAND_ASSETS.logos.footerWatermark}
                alt="solta o verbo"
                className="h-14 w-auto brightness-200"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/logo_footer_soltaoverbo.png';
                }}
              />
              <p className="text-white/80 text-base font-medium leading-relaxed max-w-xs lowercase">
                autodesenvolvimento em coletivo através da escrita guiada e rituais presenciais.
              </p>
            </div>

            {/* Coluna 2: Navegação Rápida en Pílulas */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-5 text-acentoOliva lowercase">
                navegação & programas
              </h3>
              <div className="flex flex-wrap gap-2.5">
                <Link
                  to="/programs"
                  className="px-4 py-2 rounded-full bg-white/10 hover:bg-acentoOliva hover:text-tintaCarvao transition-all text-xs font-medium lowercase"
                >
                  21 dias de escrita
                </Link>
                <Link
                  to="/programs"
                  className="px-4 py-2 rounded-full bg-white/10 hover:bg-acentoOliva hover:text-tintaCarvao transition-all text-xs font-medium lowercase"
                >
                  ciclo de aprofundamento
                </Link>
                <Link
                  to="/about"
                  className="px-4 py-2 rounded-full bg-white/10 hover:bg-acentoOliva hover:text-tintaCarvao transition-all text-xs font-medium lowercase"
                >
                  sobre nós
                </Link>
                <button
                  onClick={() => setIsContactPopupOpen(true)}
                  className="px-4 py-2 rounded-full bg-white/10 hover:bg-acentoOliva hover:text-tintaCarvao transition-all text-xs font-medium lowercase text-left"
                >
                  contato
                </button>
                <Link
                  to="/roteirooriginal"
                  className="px-4 py-2 rounded-full bg-white/10 hover:bg-acentoOliva hover:text-tintaCarvao transition-all text-xs font-medium lowercase"
                >
                  roteiro original
                </Link>
              </div>
            </div>

            {/* Coluna 3: Redes Sociais & Conexão */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-5 text-acentoOliva lowercase">
                conecte-se com o coletivo
              </h3>
              <div className="flex items-center gap-3 mb-6">
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
                    className="w-11 h-11 rounded-full bg-white/10 hover:bg-acentoOliva hover:text-tintaCarvao flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
                    aria-label={label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
              <p className="text-xs text-white/60 lowercase">
                junte-se à comunidade e transforme sua prática diária de escrita.
              </p>
            </div>
          </div>

          {/* Chamadas de Ação Finais (CTAs em Pílula) */}
          <div className="flex flex-col sm:flex-row gap-3 mb-12 max-w-xl">
            <Link
              to="/register"
              className="btn-pill-accent flex-1 py-3.5 px-6 rounded-full text-center text-sm font-semibold flex items-center justify-center gap-2"
            >
              <span>fazer parte agora</span>
              <Sparkles className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="px-6 py-3.5 rounded-full border border-white/30 text-white hover:bg-white/10 text-center text-sm font-medium transition-all lowercase"
            >
              já tenho uma conta
            </Link>
          </div>

          {/* Linha de Copyright & Legal */}
          <div className="pt-8 border-t border-white/15 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/60 lowercase">
            <p>© {new Date().getFullYear()} solta o verbo colectivo. todos os direitos reservados.</p>
            <div className="flex items-center gap-4">
              <Link to="/privacy-policy" className="hover:text-acentoOliva transition-colors">
                política de privacidade
              </Link>
              <span>·</span>
              <Link to="/terms-of-service" className="hover:text-acentoOliva transition-colors">
                termos de serviço
              </Link>
            </div>
            <a
              href="https://www.digital-alignment.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-acentoOliva transition-colors"
            >
              feito com amor por digital alignment
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
