import { X, UserPlus, LogIn } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthPromptModal({ isOpen, onClose }: AuthPromptModalProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleCreateAccount = () => {
    localStorage.setItem('checkout_intent', JSON.stringify({
      timestamp: Date.now(),
      source: 'roteiro-original',
      action: 'checkout'
    }));
    navigate('/register');
  };

  const handleLogin = () => {
    localStorage.setItem('checkout_intent', JSON.stringify({
      timestamp: Date.now(),
      source: 'roteiro-original',
      action: 'checkout'
    }));
    navigate('/login');
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-3xl max-w-lg w-full my-8 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
        <div className="flex justify-between items-center p-6 md:p-8 border-b border-deepBlue/10">
          <h2 className="font-editorial text-2xl md:text-3xl text-deepBlue">Criar Conta para Continuar</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-deepBlue/10 rounded-lg transition-colors flex-shrink-0"
            aria-label="Fechar modal"
          >
            <X className="w-6 h-6 text-deepBlue" />
          </button>
        </div>

        <div className="p-6 md:p-8">
          <div className="mb-8 text-center">
            <p className="text-lg text-deepBlue/80 leading-relaxed mb-4">
              Para continuar sua compra e garantir acesso aos cursos, você precisa criar uma conta ou fazer login.
            </p>
            <p className="text-base text-deepBlue/60">
              É rápido, seguro e você terá acesso imediato após a confirmação do pagamento.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleCreateAccount}
              className="w-full bg-limeGreen hover:bg-limeGreen/90 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 text-lg group"
            >
              <UserPlus className="w-6 h-6 group-hover:scale-110 transition-transform" />
              Criar Nova Conta
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-deepBlue/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-deepBlue/60">ou</span>
              </div>
            </div>

            <button
              onClick={handleLogin}
              className="w-full bg-white border-2 border-deepBlue hover:bg-deepBlue hover:text-white text-deepBlue font-bold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 text-lg group"
            >
              <LogIn className="w-6 h-6 group-hover:scale-110 transition-transform" />
              Já Tenho Conta
            </button>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-sm text-deepBlue/70 text-center">
              <strong>Por que criar conta?</strong>
              <br />
              Com sua conta, você terá acesso facilitado aos cursos, poderá acompanhar seu progresso e participar da comunidade Solta o Verbo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
