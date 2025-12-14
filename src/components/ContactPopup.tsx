import { X, Instagram, MessageCircle, Mail } from 'lucide-react';
import { useEffect } from 'react';

interface ContactPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactPopup({ isOpen, onClose }: ContactPopupProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', handleEscape);

      return () => {
        document.body.style.overflow = 'unset';
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-popupCream rounded-3xl shadow-2xl max-w-md w-full p-8 relative animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full hover:bg-popupText/10 transition-colors"
          aria-label="close popup"
        >
          <X className="w-6 h-6 text-popupText" />
        </button>

        <div className="text-center mb-8">
          <h2 className="font-editorial text-3xl md:text-4xl font-bold text-popupText mb-4">
            vamos conectar?
          </h2>
          <p className="text-popupText/80 text-lg leading-relaxed">
            escolha a melhor forma de entrar em contato conosco. adoraríamos ouvir você!
          </p>
        </div>

        <div className="space-y-4">
          <a
            href="https://www.instagram.com/soltaoverbo.coletivo/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 rounded-2xl bg-white hover:bg-white/80 transition-all duration-300 hover:scale-105 group"
          >
            <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: '#bac706' }}>
              <Instagram className="w-7 h-7 text-white" />
            </div>
            <div className="text-left flex-1">
              <p className="font-bold text-popupText text-lg">instagram</p>
              <p className="text-popupText/70 text-sm">@soltaoverbo.coletivo</p>
            </div>
          </a>

          <a
            href="https://wa.link/w67ibp"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 rounded-2xl bg-white hover:bg-white/80 transition-all duration-300 hover:scale-105 group"
          >
            <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: '#bac706' }}>
              <MessageCircle className="w-7 h-7 text-white" />
            </div>
            <div className="text-left flex-1">
              <p className="font-bold text-popupText text-lg">whatsapp</p>
              <p className="text-popupText/70 text-sm">envie uma mensagem</p>
            </div>
          </a>

          <a
            href="mailto:info@soltaoverbocoletivo.com"
            className="flex items-center gap-4 p-4 rounded-2xl bg-white hover:bg-white/80 transition-all duration-300 hover:scale-105 group"
          >
            <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: '#bac706' }}>
              <Mail className="w-7 h-7 text-white" />
            </div>
            <div className="text-left flex-1">
              <p className="font-bold text-popupText text-lg">e-mail</p>
              <p className="text-popupText/70 text-sm">info@soltaoverbocoletivo.com</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
