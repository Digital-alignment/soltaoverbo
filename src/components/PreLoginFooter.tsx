import { Link } from 'react-router-dom';
import { Instagram, MessageCircle, Mail, Pencil } from 'lucide-react';
import { useState } from 'react';
import ContactPopup from './ContactPopup';
import { BRAND_ASSETS } from '../config/brandAssets';

export default function PreLoginFooter() {
  const [isContactPopupOpen, setIsContactPopupOpen] = useState(false);

  return (
    <>
      <footer className="bg-acentoAzul text-white relative overflow-hidden border-t-4 border-acentoOliva">
        {/* Textura Halftone Retícula de Fundo */}
        <div
          className="absolute inset-0 opacity-[0.08] pointer-events-none mix-blend-overlay z-0 bg-repeat"
          style={{
            backgroundImage: "url('/brand-assets/textures/reticula-halftone-padrao-1.png')",
            backgroundSize: '240px 240px',
          }}
        />

        {/* Marca d'água gigantesca no fundo */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10 flex items-center justify-center overflow-hidden z-0"
          style={{
            backgroundImage: `url(${BRAND_ASSETS.logos.footerWatermark})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center right',
            backgroundSize: 'contain',
          }}
        />

        {/* Emblema sv giratório sutil */}
        <div className="absolute top-6 right-6 sm:top-10 sm:right-10 pointer-events-none opacity-20 hidden sm:block z-10">
          <img
            src={BRAND_ASSETS.logos.icon}
            alt="emblema solta o verbo"
            className="w-16 h-16 animate-spin-slow"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-12">
            {/* Esquerda: 3 Colunas de Conteúdo e Links (8 Cols em Desktop) */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8">
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
                <p className="text-white/80 text-sm sm:text-base font-medium leading-relaxed max-w-xs lowercase">
                  autodesenvolvimento em coletivo através da escrita guiada e rituais presenciais.
                </p>
              </div>

              {/* Coluna 2: Navegação Rápida em Pílulas */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-4 text-acentoOliva lowercase">
                  navegação & programas
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Link
                    to="/programs"
                    className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-acentoOliva hover:text-tintaCarvao transition-all text-xs font-medium lowercase"
                  >
                    21 dias de escrita
                  </Link>
                  <Link
                    to="/programs"
                    className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-acentoOliva hover:text-tintaCarvao transition-all text-xs font-medium lowercase"
                  >
                    ciclo de aprofundamento
                  </Link>
                  <Link
                    to="/about"
                    className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-acentoOliva hover:text-tintaCarvao transition-all text-xs font-medium lowercase"
                  >
                    sobre nós
                  </Link>
                  <button
                    onClick={() => setIsContactPopupOpen(true)}
                    className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-acentoOliva hover:text-tintaCarvao transition-all text-xs font-medium lowercase text-left"
                  >
                    contato
                  </button>
                  <Link
                    to="/roteirooriginal"
                    className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-acentoOliva hover:text-tintaCarvao transition-all text-xs font-medium lowercase"
                  >
                    roteiro original
                  </Link>
                </div>
              </div>

              {/* Coluna 3: Redes Sociais & Conexão */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-4 text-acentoOliva lowercase">
                  conecte-se com o coletivo
                </h3>
                <div className="flex items-center gap-3 mb-4">
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
                      className="w-10 h-10 rounded-full bg-white/10 hover:bg-acentoOliva hover:text-tintaCarvao flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
                      aria-label={label}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
                <p className="text-xs text-white/60 lowercase">
                  junte-se à comunidade e transforme sua prática diária de escrita.
                </p>
              </div>
            </div>

            {/* Direita: CARD POLAROID SOLTA O VERBO */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative bg-papelClaro text-tintaCarvao rounded-2xl p-4 sm:p-5 shadow-2xl border border-papelKraft/60 max-w-md w-full transform rotate-1 transition-transform duration-500 hover:rotate-0 hover:scale-[1.02] group select-none">
                {/* Washi Tape Superior Esquerdo */}
                <div className="absolute -top-3 left-6 w-24 h-6 pointer-events-none z-20 opacity-90">
                  <img
                    src="/brand-assets/elements/stickers/fitas-washi-flores-terracota.png"
                    alt="fita washi"
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Washi Tape Inferior Direito */}
                <div className="absolute -bottom-3 right-6 w-24 h-6 pointer-events-none z-20 opacity-90">
                  <img
                    src="/brand-assets/elements/stickers/fitas-washi-realistica-azul.png"
                    alt="fita washi"
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Caixa Azul Interna do Postcard */}
                <div className="bg-[#0D0859] rounded-xl p-5 sm:p-6 text-white space-y-4 relative overflow-hidden">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-acentoOliva tracking-wider">coletivo // 2026</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-acentoTerracota block shadow-sm" />
                  </div>

                  <p className="font-gesto text-2xl sm:text-3xl text-papelClaro leading-snug font-normal my-4">
                    “a escrita cura o que o silêncio aprisiona.”
                  </p>

                  <h4 className="font-editorial font-bold text-2xl sm:text-3xl text-papelClaro lowercase tracking-tight">
                    solta o verbo.
                  </h4>

                  {/* Cuadros de Color en el Pie de la Caja Azul */}
                  <div className="pt-4 border-t border-white/20 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded bg-papelClaro block shadow-sm" />
                      <span className="w-4 h-4 rounded bg-[#0D0859] border border-white/30 block shadow-sm" />
                      <span className="w-4 h-4 rounded bg-acentoTerracota block shadow-sm" />
                      <span className="w-4 h-4 rounded bg-acentoOliva block shadow-sm" />
                    </div>
                  </div>
                </div>

                {/* Área Inferior de Papel do Polaroid */}
                <div className="pt-4 px-1 space-y-2 relative">
                  <p className="font-gesto text-tintaCarvao text-lg sm:text-xl font-normal">
                    — anote no seu diário de bordo hoje
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <p className="text-[11px] text-tintaCarvao/60 font-mono lowercase">
                      comunidade • reflexão • afeto
                    </p>
                    <a
                      href="https://www.instagram.com/soltaoverbo.coletivo/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-acentoAzul font-bold font-mono hover:text-acentoTerracota transition-colors lowercase"
                    >
                      @soltaoverbo.coletivo
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chamadas de Ação Finais (CTAs em Pílula) */}
          <div className="flex flex-col sm:flex-row gap-3 mb-12 max-w-xl">
            <Link
              to="/register"
              className="btn-pill-accent flex-1 py-3.5 px-6 rounded-full text-center text-sm font-semibold flex items-center justify-center gap-2"
            >
              <span>fazer parte agora</span>
              <Pencil className="w-4 h-4" />
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
