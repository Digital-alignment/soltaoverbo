import { useState, useEffect } from 'react';
import { X, Loader } from 'lucide-react';
import { createCheckoutSession } from '../lib/stripe';

export type ProductKey = '21dias' | 'ciclo' | 'cafe' | 'geral';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
  product?: ProductKey;
}

interface InstallmentOption {
  months: number;
  priceId: string;
  monthlyAmount: number;
  isHighlighted?: boolean;
}

const INSTALLMENT_OPTIONS: InstallmentOption[] = [
  { months: 2, priceId: import.meta.env.VITE_STRIPE_PRICE_2X || '', monthlyAmount: 38.50 },
  { months: 3, priceId: import.meta.env.VITE_STRIPE_PRICE_3X || '', monthlyAmount: 225.67, isHighlighted: true },
];

const PRICE_IDS = {
  ONE_TIME: import.meta.env.VITE_STRIPE_PRICE_ONE_TIME || '',
  TWO_INSTALLMENTS: import.meta.env.VITE_STRIPE_PRICE_2X || '',
  THREE_INSTALLMENTS: import.meta.env.VITE_STRIPE_PRICE_3X || '',
};

export default function PaymentModal({ isOpen, onClose, userEmail = '', product = '21dias' }: PaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedInstallment, setSelectedInstallment] = useState<InstallmentOption>(INSTALLMENT_OPTIONS[1]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const productDetails = {
    '21dias': {
      title: '21 dias de escrita',
      subtitle: 'jornada prática para criar um hábito sustentado de escrita autoral',
      priceText: 'R$ 77,00',
      installmentText: 'ou 2x R$ 38,50',
      whatsappMessage: 'Olá! Quero garantir minha vaga nos 21 dias de escrita por R$ 77,00 via PIX.',
    },
    ciclo: {
      title: 'ciclo de aprofundamento',
      subtitle: 'mentoria ao vivo, rodas quinzenais e acesso contínuo à comunidade',
      priceText: 'R$ 597,00',
      installmentText: '/ trimestre (ou 3x R$ 225,67 sem juros)',
      whatsappMessage: 'Olá! Quero fazer parte do ciclo de aprofundamento (R$ 597,00/trimestre) via PIX.',
    },
    cafe: {
      title: 'café com letras',
      subtitle: 'rodas temáticas semanais de escrita ao vivo toda terça-feira 8h–8h30',
      priceText: 'R$ 97,00',
      installmentText: '/ mês (incluso no ciclo de aprofundamento)',
      whatsappMessage: 'Olá! Quero me inscrever no café com letras (R$ 97,00/mês) via PIX.',
    },
    geral: {
      title: 'plano de assinatura solta o verbo',
      subtitle: 'acesso completo a todas as experiências e comunidade',
      priceText: 'R$ 597,00',
      installmentText: '/ trimestre',
      whatsappMessage: 'Olá! Gostaria de informações sobre formas de pagamento.',
    },
  }[product] || {
    title: '21 dias de escrita',
    subtitle: 'jornada prática para criar um hábito sustentado de escrita autoral',
    priceText: 'R$ 77,00',
    installmentText: 'ou 2x R$ 38,50',
    whatsappMessage: 'Olá! Quero garantir minha vaga no Solta o Verbo.',
  };

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

  const handleCheckout = async (priceId: string, mode: 'payment' | 'subscription') => {
    if (!priceId) {
      setError('Configuração de preço não disponível. Entre em contato com o suporte.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const checkoutUrl = await createCheckoutSession({
        priceId,
        email: userEmail,
        mode,
      });

      window.location.href = checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao processar pagamento');
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-tintaCarvao/50 backdrop-blur-xs flex items-center justify-center z-[99999] p-4 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div className="bg-papelClaro rounded-3xl max-w-xl w-full my-8 shadow-kraft-lg border border-papelKraft/60 animate-in fade-in zoom-in-95 duration-300 overflow-hidden">
        {/* Cabeçalho */}
        <div className="flex justify-between items-start p-6 sm:p-8 border-b border-papelKraft/40 bg-bgPlataforma">
          <div>
            <span className="text-xs font-bold text-acentoTerracota uppercase tracking-wider block mb-1">
              opções de inscrição
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl text-acentoAzul font-bold lowercase">
              {productDetails.title}
            </h2>
            <p className="text-sm text-tintaCarvao/80 font-medium lowercase mt-1">
              {productDetails.subtitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-papelKraft/20 rounded-full transition-colors flex-shrink-0 text-tintaCarvao/60 hover:text-tintaCarvao"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm font-medium">
              {error}
            </div>
          )}

          {/* Opção 1: Valor Principal & Checkout Direct */}
          <div className="bg-bgPlataforma rounded-2xl p-5 border border-papelKraft/60 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-tintaCarvao/60 uppercase block">
                  investimento
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-bold font-editorial text-acentoAzul">
                    {productDetails.priceText}
                  </span>
                  <span className="text-xs text-tintaCarvao/70 lowercase font-medium">
                    {productDetails.installmentText}
                  </span>
                </div>
              </div>

              {PRICE_IDS.ONE_TIME ? (
                <button
                  onClick={() => !loading && handleCheckout(PRICE_IDS.ONE_TIME, 'payment')}
                  disabled={loading}
                  className="btn-pill-primary text-sm px-6 py-3 rounded-full flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin text-white" />
                      <span>processando...</span>
                    </>
                  ) : (
                    <span>pagar agora</span>
                  )}
                </button>
              ) : null}
            </div>
          </div>

          {/* Opção 2: Pagamento Chave PIX & WhatsApp */}
          <div className="bg-white rounded-2xl p-5 border border-papelKraft/60 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-acentoAzul text-base lowercase font-editorial">
                  pagamento via pix ou atendimento humano
                </h4>
                <p className="text-xs text-tintaCarvao/70 font-medium lowercase">
                  receba a chave pix direta e auxílio imediato pelo whatsapp da equipe
                </p>
              </div>
            </div>

            <a
              href={`https://wa.me/5548991823637?text=${encodeURIComponent(productDetails.whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3 px-6 rounded-full transition-all flex items-center justify-center gap-2.5 text-sm shadow-sm cursor-pointer"
            >
              <span>garantir vaga pelo whatsapp</span>
            </a>
          </div>

          {/* Opção 3: Criar Conta / Fazer Login primeiro */}
          <div className="text-center pt-2 border-t border-papelKraft/30">
            <p className="text-xs text-tintaCarvao/60 font-medium lowercase">
              já tem uma conta?{' '}
              <a href="/login" className="text-acentoAzul font-bold hover:underline">
                fazer login na área de membros
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
