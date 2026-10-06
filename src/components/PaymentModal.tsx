import React, { useState, useEffect } from 'react';
import {
  X,
  Loader,
  CreditCard,
  MessageCircle,
  ShieldCheck,
  Check,
  Tag,
  Sparkles,
  Ticket,
  CheckCircle,
} from 'lucide-react';
import { createInfinitePayCheckout } from '../lib/infinitepay';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import {
  Coupon,
  validateCoupon,
  redeemCoupon,
  calculateCouponDiscount,
} from '../lib/coupons';

export type ProductKey = '21dias' | 'ciclo' | 'cafe' | 'geral' | 'cafecomletras';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
  userName?: string;
  userPhone?: string;
  product?: ProductKey;
  productKey?: ProductKey | string;
  initialCouponCode?: string;
}

export default function PaymentModal({
  isOpen,
  onClose,
  userEmail = '',
  userName = '',
  userPhone = '',
  product = '21dias',
  productKey,
  initialCouponCode = '',
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Estados de Cupom Poético / Bolsa Comunitária (Fase 3)
  const [couponInput, setCouponInput] = useState(initialCouponCode || '');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [couponSuccessMessage, setCouponSuccessMessage] = useState('');
  const [freeGrantSuccess, setFreeGrantSuccess] = useState(false);

  useEffect(() => {
    if (user?.email && !customerEmail) {
      setCustomerEmail(user.email);
    }
    if ((profile?.display_name || user?.user_metadata?.full_name) && !customerName) {
      setCustomerName(profile?.display_name || user?.user_metadata?.full_name || '');
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

  // Cálculo de Descontos e Preço Efetivo (Fase 3)
  const basePriceInCents = productDetails.priceInCents;
  const discountInfo = appliedCoupon
    ? calculateCouponDiscount(appliedCoupon, basePriceInCents)
    : { discountInCents: 0, finalPriceInCents: basePriceInCents, percent: 0 };

  const effectivePriceInCents = discountInfo.finalPriceInCents;
  const isFreeGrant = appliedCoupon && (appliedCoupon.type === 'free_access' || effectivePriceInCents === 0);
  const isTrialExtension = appliedCoupon && appliedCoupon.type === 'trial_extension';

  const formattedEffectivePrice = isFreeGrant
    ? 'grátis (100% bolsa)'
    : isTrialExtension
    ? 'extensão de teste gratuita'
    : `R$ ${(effectivePriceInCents / 100).toFixed(2).replace('.', ',')}`;

  const handleApplyCoupon = async (codeToValidate?: string) => {
    const code = (codeToValidate || couponInput).trim();
    if (!code) {
      setCouponError('digite o código do cupom ou bolsa.');
      return;
    }

    setValidatingCoupon(true);
    setCouponError('');
    setCouponSuccessMessage('');

    try {
      const res = await validateCoupon({
        code,
        productKey: resolvedProductKey,
        userId: user?.id,
      });

      if (!res.valid || !res.coupon) {
        setCouponError(res.error || 'cupom inválido ou não encontrado.');
        setAppliedCoupon(null);
      } else {
        setAppliedCoupon(res.coupon);
        setCouponSuccessMessage(res.message || 'cupom aplicado com sucesso!');
      }
    } catch (err: any) {
      setCouponError(err.message || 'erro ao validar cupom.');
      setAppliedCoupon(null);
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError('');
    setCouponSuccessMessage('');
  };

  useEffect(() => {
    if (initialCouponCode && !appliedCoupon) {
      setCouponInput(initialCouponCode);
      handleApplyCoupon(initialCouponCode);
    }
  }, [initialCouponCode]);

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
      // 1. SE FOR BOLSA COMUNITÁRIA 100% GRATUITA OU EXTENSÃO DE TESTE:
      // Não aciona a InfinitePay (evita erro de transação 0 centavos) e registra diretamente
      if (isFreeGrant || isTrialExtension) {
        if (!user?.id) {
          setError('para ativar sua bolsa comunitária ou extensão gratuita, por favor acesse sua conta ou realize o cadastro com seu e-mail.');
          setLoading(false);
          return;
        }

        const redeemRes = await redeemCoupon({
          code: appliedCoupon!.code,
          productKey: resolvedProductKey,
          userId: user.id,
          userEmail: customerEmail.trim(),
        });

        if (!redeemRes.success) {
          setError(redeemRes.error || 'não foi possível concluir a ativação do cupom.');
          setLoading(false);
          return;
        }

        setFreeGrantSuccess(true);
        setLoading(false);
        return;
      }

      // 2. FLUXO NORMAL OU COM DESCONTO VIA INFINITEPAY:
      const orderNsu = `sv-${resolvedProductKey}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

      // Registrar a tentativa de checkout no Supabase com order_nsu e cupom
      try {
        await supabase.from('checkout_attempts').insert({
          order_nsu: orderNsu,
          user_id: user?.id || null,
          email: customerEmail.trim() || userEmail || 'visitante@soltaoverbo.com.br',
          source_page: window.location.pathname,
          plan_type: productDetails.title,
          attempted_at: new Date().toISOString(),
          completed: false,
          metadata: {
            coupon_code: appliedCoupon ? appliedCoupon.code : null,
            original_price: basePriceInCents,
            discount_amount: discountInfo.discountInCents,
            final_price: effectivePriceInCents,
          },
        });
      } catch (logErr) {
        console.warn('aviso: não foi possível registrar tentativa no supabase:', logErr);
      }

      // Se for plano recorrente oficial SEM cupom de desconto (como o Café padrão), redireciona direto para a página do plano
      if (
        (!appliedCoupon || discountInfo.discountInCents === 0) &&
        (productDetails.isRecurringPlan || productDetails.directPayUrl.includes('/plans/'))
      ) {
        window.location.href = productDetails.directPayUrl;
        return;
      }

      // Criar sessão de checkout via InfinitePay API
      // A descrição sempre preserva o título base do produto para casamento 100% determinístico no webhook
      const itemDescription = appliedCoupon
        ? `${productDetails.title} (cupom: ${appliedCoupon.code})`
        : productDetails.title;

      const checkoutUrl = await createInfinitePayCheckout({
        orderNsu,
        items: [
          {
            quantity: 1,
            price: effectivePriceInCents,
            description: itemDescription,
          },
        ],
        customer: {
          name: customerName.trim() || undefined,
          email: customerEmail.trim() || undefined,
        },
      });

      window.location.href = checkoutUrl;
    } catch (err) {
      console.warn('erro na api da infinitepay, redirecionando para o link direto:', err);
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

        {/* Conteúdo com Rolagem Interna */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 sm:space-y-5 custom-scrollbar">
          {freeGrantSuccess ? (
            <div className="p-6 sm:p-8 text-center space-y-4 bg-white rounded-3xl border border-papelKraft/40 shadow-xs animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-2xs">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="font-editorial text-2xl font-bold text-acentoAzul lowercase">
                bolsa comunitária ativada com amor! ✨
              </h3>
              <p className="text-xs sm:text-sm font-corpo text-tintaCarvao/80 lowercase max-w-sm mx-auto leading-relaxed">
                seu código foi validado com sucesso e seu acesso já está completamente liberado em sua conta.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => {
                    onClose();
                    window.location.href = '/courses';
                  }}
                  className="px-6 py-3 rounded-full bg-acentoTerracota text-white font-gesto text-[20px] lowercase shadow-xs hover:bg-acentoTerracota/90 transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <span>começar a escrever agora</span>
                  <CheckCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <>
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

              {/* Dados Mínimos do Cliente */}
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
                </div>
              </div>

              {/* Seção de Cupom Poético / Bolsa Comunitária (Fase 3) */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-papelKraft/40 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-tintaCarvao/70 font-corpo lowercase tracking-wider flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-acentoTerracota" />
                    <span>tem um cupom ou código de bolsa?</span>
                  </span>
                  {appliedCoupon && (
                    <span className="text-[10px] font-bold font-corpo text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full lowercase">
                      cupom ativo
                    </span>
                  )}
                </div>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl text-xs font-corpo">
                    <div className="flex items-center gap-2">
                      <Ticket className="w-4 h-4 text-emerald-600" />
                      <div>
                        <span className="font-bold text-emerald-900 tracking-wider">
                          {appliedCoupon.code}
                        </span>
                        <p className="text-[11px] text-emerald-700 lowercase">
                          {couponSuccessMessage}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-xs text-emerald-800 hover:text-emerald-950 font-bold underline cursor-pointer"
                    >
                      remover
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => {
                          setCouponInput(e.target.value.toUpperCase());
                          setCouponError('');
                        }}
                        placeholder="ex: LIRICA2026, COLETIVO"
                        className="flex-1 px-3 py-2 bg-bgPlataforma border border-papelKraft/50 rounded-xl text-xs font-corpo uppercase tracking-wider text-tintaCarvao focus:outline-none focus:border-acentoAzul"
                      />
                      <button
                        type="button"
                        onClick={() => handleApplyCoupon()}
                        disabled={validatingCoupon || !couponInput.trim()}
                        className="px-4 py-2 bg-acentoAzul hover:bg-acentoAzul/90 text-white rounded-xl text-xs font-bold font-corpo lowercase disabled:opacity-50 transition-all cursor-pointer shrink-0"
                      >
                        {validatingCoupon ? 'validando...' : 'aplicar'}
                      </button>
                    </div>

                    {couponError && (
                      <p className="text-[11px] text-acentoTerracota font-corpo lowercase">
                        {couponError}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Opção 1: Valor Principal & Checkout Direct InfinitePay */}
              <div className="bg-bgPlataforma rounded-2xl p-4 sm:p-5 border border-papelKraft/40 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-tintaCarvao/60 font-corpo lowercase block">
                      investimento no seu hábito de escrita
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                      {appliedCoupon && discountInfo.discountInCents > 0 && (
                        <span className="text-base line-through text-tintaCarvao/40 font-editorial">
                          {productDetails.priceText}
                        </span>
                      )}
                      <span className="text-3xl sm:text-4xl font-bold font-editorial text-acentoAzul">
                        {formattedEffectivePrice}
                      </span>
                      {!isFreeGrant && !isTrialExtension && (
                        <span className="text-xs text-tintaCarvao/70 font-corpo lowercase font-medium">
                          {productDetails.installmentText}
                        </span>
                      )}
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
                  ) : isFreeGrant || isTrialExtension ? (
                    <>
                      <Sparkles className="w-4 h-4 shrink-0 text-amber-300" />
                      <span>resgatar bolsa comunitária agora</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 shrink-0" />
                      <span>
                        {productDetails.isRecurringPlan && (!appliedCoupon || discountInfo.discountInCents === 0)
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
                  {!isFreeGrant && !isTrialExtension && (
                    <button
                      type="button"
                      onClick={handleCheckout}
                      disabled={loading}
                      className="text-acentoAzul font-bold hover:underline flex items-center gap-1 cursor-pointer bg-transparent border-none p-0 text-[11px] lowercase"
                    >
                      <span>link direto →</span>
                    </button>
                  )}
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
                      ? `Olá! Meu nome é ${customerName.trim()}. Quero garantir minha vaga em ${productDetails.title} (${formattedEffectivePrice}) via PIX ou cartão.`
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
