import { useState } from 'react';
import { X, Loader, Check } from 'lucide-react';
import { createCheckoutSession } from '../lib/stripe';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
}

interface InstallmentOption {
  months: number;
  priceId: string;
  monthlyAmount: number;
  isHighlighted?: boolean;
}

const INSTALLMENT_OPTIONS: InstallmentOption[] = [
  { months: 3, priceId: import.meta.env.VITE_STRIPE_PRICE_3X || '', monthlyAmount: 965.66 },
  { months: 6, priceId: import.meta.env.VITE_STRIPE_PRICE_6X || '', monthlyAmount: 482.83 },
  { months: 9, priceId: import.meta.env.VITE_STRIPE_PRICE_9X || '', monthlyAmount: 321.88 },
  { months: 12, priceId: import.meta.env.VITE_STRIPE_PRICE_INSTALLMENT || '', monthlyAmount: 248.00, isHighlighted: true },
];

const PRICE_IDS = {
  ONE_TIME: import.meta.env.VITE_STRIPE_PRICE_ONE_TIME || '',
  INSTALLMENT: import.meta.env.VITE_STRIPE_PRICE_INSTALLMENT || '',
  THREE_INSTALLMENTS: import.meta.env.VITE_STRIPE_PRICE_3X || '',
  SIX_INSTALLMENTS: import.meta.env.VITE_STRIPE_PRICE_6X || '',
  NINE_INSTALLMENTS: import.meta.env.VITE_STRIPE_PRICE_9X || '',
};

export default function PaymentModal({ isOpen, onClose, userEmail }: PaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [selectedInstallment, setSelectedInstallment] = useState<InstallmentOption>(INSTALLMENT_OPTIONS[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  if (!isOpen) return null;

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

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText('primeirissimos');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar código:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl animate-in fade-in zoom-in-95 duration-300">
        <div className="flex justify-between items-center p-8 border-b border-deepBlue/10">
          <h2 className="font-editorial text-3xl text-deepBlue">Escolha Seu Plano</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-deepBlue/5 rounded-lg transition-colors"
            aria-label="Fechar"
          >
            <X className="w-6 h-6 text-deepBlue" />
          </button>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
              {error}
            </div>
          )}

          <div className="flex flex-col items-center justify-center mb-8">
            <div className="relative w-full max-w-sm">
              <button
                onClick={handleCopyCode}
                className="w-full group relative overflow-hidden rounded-2xl transition-all duration-300"
                aria-label="Clique para copiar o código de desconto"
              >
                <img
                  src="/whatsapp_image_2025-12-11_at_6.28.10_pm.jpeg"
                  alt="Código de desconto PRIMEIRÍSSIMOS"
                  className="w-full rounded-2xl group-hover:opacity-75 transition-opacity duration-300 cursor-pointer"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-2xl transition-colors duration-300 flex items-center justify-center">
                  {copied && (
                    <div className="flex flex-col items-center gap-2">
                      <div className="bg-limeGreen rounded-full p-3">
                        <Check className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-white font-bold text-sm bg-deepBlue/80 px-4 py-2 rounded-lg">
                        Código copiado!
                      </p>
                    </div>
                  )}
                </div>
              </button>
            </div>
          </div>

          <div className="space-y-6 mb-8">
            <div className="bg-gradient-to-br from-deepBlue/5 to-deepBlue/10 rounded-2xl p-6 border border-deepBlue/10 hover:border-deepBlue/20 transition-all duration-300">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
                <div className="flex-1">
                  <p className="text-sm text-deepBlue/70 font-medium">Pagamento Único</p>
                  <p className="text-3xl font-bold text-deepBlue mt-1">R$ 2.897,00</p>
                  <p className="text-xs text-deepBlue/50 mt-2">Acesso integral por 1 ano</p>
                </div>
                <button
                  onClick={() => !loading && handleCheckout(PRICE_IDS.ONE_TIME, 'payment')}
                  disabled={loading}
                  className="btn-primary py-3 px-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm md:text-base whitespace-nowrap"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    'Pagar Agora'
                  )}
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50/60 to-blue-100/40 rounded-2xl p-6 border border-blue-200 hover:border-blue-300 transition-all duration-300">
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
                  <div className="flex-1">
                    <p className="text-sm text-deepBlue/70 font-medium mb-4">Parcelas</p>

                    <div className="relative w-full md:w-64">
                      <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        disabled={loading}
                        className="w-full bg-white border-2 border-blue-300 hover:border-blue-400 disabled:opacity-50 disabled:cursor-not-allowed text-deepBlue font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-between"
                      >
                        <span>{selectedInstallment.months}x de R$ {selectedInstallment.monthlyAmount.toFixed(2)}</span>
                        <svg
                          className={`w-5 h-5 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                      </button>

                      {dropdownOpen && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-blue-300 rounded-xl shadow-lg z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                          {INSTALLMENT_OPTIONS.map((option) => (
                            <button
                              key={option.months}
                              onClick={() => {
                                setSelectedInstallment(option);
                                setDropdownOpen(false);
                              }}
                              className={`w-full text-left px-4 py-3 transition-all duration-200 ${
                                selectedInstallment.months === option.months
                                  ? 'bg-blue-100 border-l-4 border-blue-500 text-deepBlue font-semibold'
                                  : 'hover:bg-blue-50 text-deepBlue/80'
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <span>{option.months}x de R$ {option.monthlyAmount.toFixed(2)}</span>
                                {option.isHighlighted && (
                                  <span className="text-xs bg-limeGreen text-white px-2 py-1 rounded-full font-bold">
                                    Melhor opção
                                  </span>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => !loading && handleCheckout(selectedInstallment.priceId, 'subscription')}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm md:text-base whitespace-nowrap md:self-start"
                  >
                    {loading ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      'Parcelar Agora'
                    )}
                  </button>
                </div>

                <p className="text-xs text-deepBlue/50">Acesso integral por 1 ano</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-25 rounded-2xl p-6 border border-green-200 hover:border-green-300 transition-all duration-300">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
                <div className="flex-1">
                  <p className="text-sm text-deepBlue/70 font-medium">Pagar com PIX</p>
                  <p className="text-xs text-limeGreen font-bold mt-2 uppercase tracking-wide">Desconto especial nesta forma de pagamento</p>
                  <p className="text-xs text-deepBlue/50 mt-2">Acesso integral por 1 ano</p>
                </div>
                <a
                  href="https://wa.link/nyiqy2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-limeGreen hover:bg-limeGreen/90 text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 text-sm md:text-base whitespace-nowrap"
                >
                  Pagar via WhatsApp
                </a>
              </div>
            </div>
          </div>

          <div className="text-center text-deepBlue/60 text-sm border-t border-deepBlue/10 pt-6">
            <p>Todas as opções incluem acesso total por 1 ano</p>
          </div>
        </div>
      </div>
    </div>
  );
}
