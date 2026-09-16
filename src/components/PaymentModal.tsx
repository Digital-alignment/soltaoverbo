import React, { useState, useEffect } from 'react';
import { X, Loader, CreditCard, MessageCircle, ShieldCheck, Check } from 'lucide-react';
import { createInfinitePayCheckout } from '../lib/infinitepay';
import { supabase } from '../lib/supabase';

export type ProductKey = '21dias' | 'ciclo' | 'cafe' | 'geral';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
  product?: ProductKey;
}

export default function PaymentModal({
  isOpen,
  onClose,
  userEmail = '',
  product = '21dias',
}: PaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const productDetails = {
    '21dias': {
      title: '21 dias de escrita',
      subtitle: 'jornada prática para criar um hábito sustentado de escrita autoral',
      priceText: 'R$ 77,00',
      priceInCents: 7700,
      installmentText: 'ou 2x R$ 38,50',
      directPayUrl: 'https://infinitepay.io/pay/soltaoverbo/7700',
      whatsappMessage: 'Olá! Quero garantir minha vaga nos 21 dias de escrita por R$ 77,00 via PIX ou cartão.',
      features: [
        'acesso a 21 rituais diários de escrita autoral',
        'áudios binaurais guiados para foco e fluência',
        'acesso imediato à plataforma de alunas',
        'suporte e comunidade na fogueira digital',
      ],
    },
    ciclo: {
      title: 'ciclo de aprofundamento',
      subtitle: 'mentoria ao vivo, rodas quinzenais e acesso contínuo à comunidade',
      priceText: 'R$ 597,00',
      priceInCents: 59700,
      installmentText: '/ trimestre (ou 3x R$ 225,67 sem juros)',
      directPayUrl: 'https://infinitepay.io/pay/soltaoverbo/59700',
      whatsappMessage: 'Olá! Quero fazer parte do ciclo de aprofundamento (R$ 597,00/trimestre) via PIX ou cartão.',
      features: [
        'encontros ao vivo de mentoria & rituais de escrita',
        'rodas quinzenais de troca e feedback em grupo',
        'acesso a todos os encontros do café com letras',
        'acesso ilimitado ao acervo de gravações & materiais',
      ],
    },
    cafe: {
      title: 'café com letras',
      subtitle: 'encontro semanal de escrita ao vivo toda terça-feira 8h–8h30',
      priceText: 'R$ 97,00',
      priceInCents: 9700,
      installmentText: '/ mês (incluso no ciclo de aprofundamento)',
      directPayUrl: 'https://infinitepay.io/pay/soltaoverbo/9700',
      whatsappMessage: 'Olá! Quero me inscrever no café com letras (R$ 97,00/mês) via PIX ou cartão.',
      features: [
        '4 encontros ao vivo por mês (terças-feiras 8h–8h30)',
        'exercícios curtos para desbloqueio criativo semanal',
        'gravações dos encontros anteriores liberadas',
        'comunidade ativa no whatsapp e plataforma',
      ],
    },
    geral: {
      title: 'plano geral solta o verbo',
      subtitle: 'acesso completo a todas as experiências e comunidade',
      priceText: 'R$ 597,00',
      priceInCents: 59700,
      installmentText: '/ trimestre',
      directPayUrl: 'https://infinitepay.io/pay/soltaoverbo/59700',
      whatsappMessage: 'Olá! Gostaria de informações sobre formas de pagamento e matrícula geral.',
      features: [
        'acesso completo a todas as oficinas e rituais',
        'mentorias ao vivo quinzenais com as fundadoras',
        'certificado poético de conclusão de ciclos',
        'suporte prioritário da equipe solta o verbo',
      ],
    },
  }[product] || {
    title: '21 dias de escrita',
    subtitle: 'jornada prática para criar um hábito sustentado de escrita autoral',
    priceText: 'R$ 77,00',
    priceInCents: 7700,
    installmentText: 'ou 2x R$ 38,50',
    directPayUrl: 'https://infinitepay.io/pay/soltaoverbo/7700',
    whatsappMessage: 'Olá! Quero garantir minha vaga no Solta o Verbo.',
    features: ['acesso imediato à plataforma', 'rituais guiados de escrita autoral'],
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

  const handleCheckout = async () => {
    setLoading(true);
    setError('');

    try {
      // Registrar a tentativa de checkout no Supabase
      try {
        await supabase.from('checkout_attempts').insert({
          email: userEmail || 'visitante@soltaoverbo.com.br',
          source_page: window.location.pathname,
          plan_type: productDetails.title,
          attempted_at: new Date().toISOString(),
          completed: false,
        });
      } catch (logErr) {
        console.warn('aviso: não foi possível registrar tentativa no supabase:', logErr);
      }

      // Criar sessão de checkout via InfinitePay API
      const checkoutUrl = await createInfinitePayCheckout({
        items: [
          {
            quantity: 1,
            price: productDetails.priceInCents,
            description: productDetails.title,
          },
        ],
        customer: userEmail ? { email: userEmail } : undefined,
      });

      window.location.href = checkoutUrl;
    } catch (err) {
      console.warn('erro na api da infinitepay, redirecionando para o link direto:', err);
      // Fallback gracioso para o link direto de pagamento da InfinitePay
      window.location.href = productDetails.directPayUrl;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-tintaCarvao/50 backdrop-blur-xs flex items-center justify-center z-[99999] p-4 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div className="bg-papelClaro rounded-3xl max-w-xl w-full my-8 shadow-kraft-lg border border-papelKraft/60 overflow-hidden">
        {/* Cabeçalho */}
        <div className="flex justify-between items-start p-6 sm:p-8 border-b border-papelKraft/40 bg-bgPlataforma">
          <div>
            <span className="text-[11px] font-bold text-acentoTerracota font-corpo lowercase tracking-wider block mb-1">
              inscrição & checkout seguro
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl text-acentoAzul font-bold lowercase">
              {productDetails.title}
            </h2>
            <p className="text-xs sm:text-sm text-tintaCarvao/80 font-corpo font-medium lowercase mt-1">
              {productDetails.subtitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-papelKraft/30 rounded-full transition-colors flex-shrink-0 text-tintaCarvao/60 hover:text-tintaCarvao cursor-pointer"
            aria-label="fechar modal"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {error && (
            <div className="p-4 bg-acentoTerracota/10 border border-acentoTerracota/40 rounded-2xl text-acentoTerracota text-xs font-corpo font-medium lowercase">
              {error}
            </div>
          )}

          {/* O que está incluso */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-papelKraft/40 space-y-2.5 shadow-xs">
            <span className="text-[10px] font-bold text-tintaCarvao/60 font-corpo lowercase tracking-wider block">
              o que você recebe na inscrição:
            </span>
            <ul className="space-y-1.5">
              {productDetails.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-xs font-corpo text-tintaCarvao/85 lowercase">
                  <Check className="w-4 h-4 text-acentoOliva shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Opção 1: Valor Principal & Checkout Direct InfinitePay */}
          <div className="bg-bgPlataforma rounded-2xl p-5 border border-papelKraft/50 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold text-tintaCarvao/60 font-corpo lowercase block">
                  investimento no seu hábito de escrita
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-bold font-editorial text-acentoAzul">
                    {productDetails.priceText}
                  </span>
                  <span className="text-xs text-tintaCarvao/70 font-corpo lowercase font-medium">
                    {productDetails.installmentText}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="py-3 px-6 rounded-full bg-acentoAzul hover:bg-acentoAzul/90 text-white font-corpo font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-xs"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin text-white" />
                    <span>processando...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>pagar com infinitepay (pix ou cartão)</span>
                  </>
                )}
              </button>
            </div>

            <div className="pt-3 border-t border-papelKraft/30 flex items-center justify-between text-[11px] font-corpo text-tintaCarvao/70 lowercase">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-acentoOliva" />
                pagamento 100% seguro pela infinitepay
              </span>
              <a
                href={productDetails.directPayUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-acentoAzul font-bold hover:underline flex items-center gap-1"
              >
                <span>link direto →</span>
              </a>
            </div>
          </div>

          {/* Opção 2: Pagamento Chave PIX & WhatsApp */}
          <div className="bg-white rounded-2xl p-5 border border-papelKraft/50 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-acentoAzul text-sm lowercase font-editorial">
                  pagamento via pix ou atendimento humano
                </h4>
                <p className="text-xs text-tintaCarvao/70 font-corpo lowercase">
                  receba a chave pix direta e auxílio imediato pela equipe no whatsapp
                </p>
              </div>
            </div>

            <a
              href={`https://wa.me/5548991823637?text=${encodeURIComponent(productDetails.whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-corpo font-bold py-3 px-6 rounded-full transition-all flex items-center justify-center gap-2.5 text-xs sm:text-sm shadow-xs cursor-pointer lowercase"
            >
              <MessageCircle className="w-4 h-4" />
              <span>garantir vaga pelo whatsapp</span>
            </a>
          </div>

          {/* Opção 3: Criar Conta / Fazer Login primeiro */}
          <div className="text-center pt-2 border-t border-papelKraft/30">
            <p className="text-xs text-tintaCarvao/60 font-corpo lowercase">
              já tem uma conta?{' '}
              <a href="/login" className="text-acentoAzul font-bold hover:underline">
                fazer login na área de alunas
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
