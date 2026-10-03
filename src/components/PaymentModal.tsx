import React, { useState, useEffect } from 'react';
import { X, Loader, CreditCard, MessageCircle, ShieldCheck, Check } from 'lucide-react';
import { createInfinitePayCheckout } from '../lib/infinitepay';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export type ProductKey = '21dias' | 'ciclo' | 'cafe' | 'geral' | 'cafecomletras';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
  userName?: string;
  userPhone?: string;
  product?: ProductKey;
  productKey?: ProductKey | string;
}

export default function PaymentModal({
  isOpen,
  onClose,
  userEmail = '',
  userName = '',
  userPhone = '',
  product = '21dias',
  productKey,
}: PaymentModalProps) {
  const auth = useAuth();
  const user = auth?.user;
  const profile = auth?.profile;

  const [customerName, setCustomerName] = useState(
    userName || profile?.display_name || user?.user_metadata?.full_name || ''
  );
  const [customerEmail, setCustomerEmail] = useState(
    userEmail || user?.email || ''
  );
  const [customerPhone, setCustomerPhone] = useState(
    userPhone || profile?.whatsapp || user?.user_metadata?.phone || ''
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.email && !customerEmail) {
      setCustomerEmail(user.email);
    }
    if ((profile?.display_name || user?.user_metadata?.full_name) && !customerName) {
      setCustomerName(profile?.display_name || user?.user_metadata?.full_name || '');
    }
    if ((profile?.whatsapp || user?.user_metadata?.phone) && !customerPhone) {
      setCustomerPhone(profile?.whatsapp || user?.user_metadata?.phone || '');
    }
  }, [user, profile]);

  const rawKey = (productKey || product) as string;
  const resolvedProductKey: '21dias' | 'ciclo' | 'cafe' | 'geral' =
    rawKey === 'cafecomletras' || rawKey === 'programa_cafe_com_letras'
      ? 'cafe'
      : (rawKey as '21dias' | 'ciclo' | 'cafe' | 'geral');

  const productDetails = {
    '21dias': {
      title: '21 dias de escrita',
      subtitle: 'jornada prática para criar um hábito sustentado de escrita autoral',
      priceText: 'R$ 77,00',
      priceInCents: 7700,
      installmentText: 'ou 2x R$ 38,50',
      directPayUrl: 'https://checkout.infinitepay.io/soltaoverbo',
      isRecurringPlan: false,
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
      directPayUrl: 'https://checkout.infinitepay.io/soltaoverbo',
      isRecurringPlan: false,
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
      installmentText: '/ mês (assinatura mensal recorrente)',
      directPayUrl: 'https://invoice.infinitepay.io/plans/soltaoverbo/ng11CypzK0',
      isRecurringPlan: true,
      whatsappMessage: 'Olá! Quero me inscrever no café com letras (assinatura mensal R$ 97,00/mês) via PIX ou cartão.',
      features: [
        'assinatura mensal recorrente (cancele a qualquer momento)',
        '4 encontros ao vivo por mês (terças-feiras 8h–8h30)',
        'exercícios curtos para desbloqueio criativo semanal',
        'comunidade ativa no whatsapp e plataforma',
      ],
    },
    geral: {
      title: 'plano geral solta o verbo',
      subtitle: 'acesso completo a todas as experiências e comunidade',
      priceText: 'R$ 597,00',
      priceInCents: 59700,
      installmentText: '/ trimestre',
      directPayUrl: 'https://checkout.infinitepay.io/soltaoverbo',
      isRecurringPlan: false,
      whatsappMessage: 'Olá! Gostaria de informações sobre formas de pagamento e matrícula geral.',
      features: [
        'acesso completo a todas as oficinas e rituais',
        'mentorias ao vivo quinzenais com as fundadoras',
        'certificado poético de conclusão de ciclos',
        'suporte prioritário da equipe solta o verbo',
      ],
    },
  }[resolvedProductKey] || {
    title: '21 dias de escrita',
    subtitle: 'jornada prática para criar um hábito sustentado de escrita autoral',
    priceText: 'R$ 77,00',
    priceInCents: 7700,
    installmentText: 'ou 2x R$ 38,50',
    directPayUrl: 'https://checkout.infinitepay.io/soltaoverbo',
    isRecurringPlan: false,
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
    setError('');

    if (!customerEmail.trim()) {
      setError('por favor, informe o seu e-mail para receber as instruções e o acesso.');
      return;
    }

    setLoading(true);

    try {
      // Registrar a tentativa de checkout no Supabase
      try {
        await supabase.from('checkout_attempts').insert({
          email: customerEmail.trim() || userEmail || 'visitante@soltaoverbo.com.br',
          source_page: window.location.pathname,
          plan_type: productDetails.title,
          attempted_at: new Date().toISOString(),
          completed: false,
        });
      } catch (logErr) {
        console.warn('aviso: não foi possível registrar tentativa no supabase:', logErr);
      }

      // Se for plano recorrente da InfinitePay (como o Café com Letras), redireciona direto para a página oficial do plano
      if (productDetails.isRecurringPlan || productDetails.directPayUrl.includes('/plans/')) {
        window.location.href = productDetails.directPayUrl;
        return;
      }

      // Criar sessão de checkout via InfinitePay API para produtos avulsos
      // NUNCA envia 'address' para garantir que não seja solicitada entrega física
      const checkoutUrl = await createInfinitePayCheckout({
        items: [
          {
            quantity: 1,
            price: productDetails.priceInCents,
            description: productDetails.title,
          },
        ],
        customer: {
          name: customerName.trim() || undefined,
          email: customerEmail.trim() || undefined,
          phone_number: customerPhone.trim() || undefined,
        },
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
      className="fixed inset-0 bg-tintaCarvao/60 backdrop-blur-xs flex items-center justify-center z-[99999] p-3 sm:p-5"
      onClick={handleBackdropClick}
    >
      <div className="bg-papelClaro rounded-3xl max-w-lg w-full max-h-[88vh] sm:max-h-[90vh] flex flex-col shadow-kraft-lg border border-papelKraft/60 overflow-hidden relative animate-fade-in">
        {/* Cabeçalho Fixo (Sticky) */}
        <div className="flex items-start justify-between p-5 sm:p-6 border-b border-papelKraft/40 bg-bgPlataforma shrink-0 sticky top-0 z-20">
          <div className="pr-3">
            <span className="text-[10px] sm:text-[11px] font-bold text-acentoTerracota font-corpo lowercase tracking-wider block mb-0.5 sm:mb-1">
              inscrição & checkout seguro
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl text-acentoAzul font-bold lowercase leading-tight">
              {productDetails.title}
            </h2>
            <p className="text-xs sm:text-sm text-tintaCarvao/80 font-corpo font-medium lowercase mt-1 leading-snug">
              {productDetails.subtitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-papelKraft/40 bg-papelKraft/20 rounded-full transition-colors shrink-0 text-tintaCarvao/70 hover:text-tintaCarvao cursor-pointer"
            aria-label="fechar modal"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Conteúdo com Roolagem Interna */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 sm:space-y-5 custom-scrollbar">
          {error && (
            <div className="p-4 bg-acentoTerracota/10 border border-acentoTerracota/40 rounded-2xl text-acentoTerracota text-xs font-corpo font-medium lowercase">
              {error}
            </div>
          )}

          {/* O que está incluso */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-papelKraft/40 space-y-3 shadow-xs">
            <span className="text-[10px] font-bold text-tintaCarvao/60 font-corpo lowercase tracking-wider block">
              o que você recebe na inscrição:
            </span>
            <ul className="space-y-2">
              {productDetails.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-xs sm:text-sm font-corpo text-tintaCarvao/85 lowercase leading-snug">
                  <Check className="w-4 h-4 text-acentoOliva shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Dados Mínimos do Cliente (Apenas Nome, E-mail e Telefone - Sem Endereço de Entrega) */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-papelKraft/40 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-acentoAzul font-corpo lowercase tracking-wider block">
                dados para inscrição & acesso:
              </span>
              <span className="text-[10px] text-acentoOliva font-corpo font-medium lowercase bg-acentoOliva/10 px-2 py-0.5 rounded-full">
                acesso digital · sem frete
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-tintaCarvao/80 font-corpo lowercase mb-1">
                  nome completo *
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="ex: Bruna Silva"
                  className="w-full px-3.5 py-2.5 bg-bgPlataforma border border-papelKraft/50 rounded-xl text-xs sm:text-sm font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul transition-colors placeholder:text-tintaCarvao/40"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-tintaCarvao/80 font-corpo lowercase mb-1">
                    e-mail para acesso *
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="ex: aluna@email.com"
                    className="w-full px-3.5 py-2.5 bg-bgPlataforma border border-papelKraft/50 rounded-xl text-xs sm:text-sm font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul transition-colors placeholder:text-tintaCarvao/40"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-tintaCarvao/80 font-corpo lowercase mb-1">
                    whatsapp / telefone
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="ex: (11) 99999-9999"
                    className="w-full px-3.5 py-2.5 bg-bgPlataforma border border-papelKraft/50 rounded-xl text-xs sm:text-sm font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul transition-colors placeholder:text-tintaCarvao/40"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Opção 1: Valor Principal & Checkout Direct InfinitePay */}
          <div className="bg-bgPlataforma rounded-2xl p-4 sm:p-5 border border-papelKraft/40 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold text-tintaCarvao/60 font-corpo lowercase block">
                  investimento no seu hábito de escrita
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl sm:text-4xl font-bold font-editorial text-acentoAzul">
                    {productDetails.priceText}
                  </span>
                  <span className="text-xs text-tintaCarvao/70 font-corpo lowercase font-medium">
                    {productDetails.installmentText}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-full bg-acentoAzul hover:bg-acentoAzul/90 text-white font-corpo font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 shadow-xs lowercase"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin text-white" />
                  <span>processando...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 shrink-0" />
                  <span>
                    {productDetails.isRecurringPlan
                      ? 'assinar com infinitepay (pix ou cartão)'
                      : 'pagar com infinitepay (pix ou cartão)'}
                  </span>
                </>
              )}
            </button>

            <div className="pt-3 border-t border-papelKraft/30 flex items-center justify-between text-[11px] font-corpo text-tintaCarvao/70 lowercase flex-wrap gap-2">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-acentoOliva shrink-0" />
                pagamento 100% seguro pela infinitepay
              </span>
              <button
                type="button"
                onClick={handleCheckout}
                disabled={loading}
                className="text-acentoAzul font-bold hover:underline flex items-center gap-1 cursor-pointer bg-transparent border-none p-0 text-[11px] lowercase"
              >
                <span>link direto →</span>
              </button>
            </div>
          </div>

          {/* Opção 2: Pagamento Chave PIX & WhatsApp */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-papelKraft/40 shadow-xs space-y-3">
            <div>
              <h4 className="font-bold text-acentoAzul text-sm lowercase font-editorial">
                pagamento via pix ou atendimento humano
              </h4>
              <p className="text-xs text-tintaCarvao/70 font-corpo lowercase mt-0.5">
                receba a chave pix direta e auxílio imediato pela equipe no whatsapp
              </p>
            </div>

            <a
              href={`https://wa.me/5548991823637?text=${encodeURIComponent(
                customerName.trim()
                  ? `Olá! Meu nome é ${customerName.trim()}. Quero garantir minha vaga em ${productDetails.title} (${productDetails.priceText}) via PIX ou cartão.`
                  : productDetails.whatsappMessage
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-acentoTerracota hover:bg-acentoTerracota/90 text-white font-corpo font-bold py-3.5 px-6 rounded-full transition-all flex items-center justify-center gap-2.5 text-xs sm:text-sm shadow-xs cursor-pointer lowercase"
            >
              <MessageCircle className="w-4 h-4 shrink-0" />
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
