import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Feather,
  Coffee,
  Crown,
  ArrowRight,
  ShieldCheck,
  Tag,
  Ticket,
  ChevronDown,
  Check,
} from 'lucide-react';
import { validateCoupon, calculateCouponDiscount, Coupon } from '../lib/coupons';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  reason?: 'trial_expired' | 'fogueira_limit' | 'course_locked' | 'general';
  onSelectProduct?: (productKey: '21dias' | 'cafe' | 'ciclo', couponCode?: string) => void;
}

interface PlanDefinition {
  key: '21dias' | 'cafe' | 'ciclo';
  title: string;
  tag: string;
  isRecommended?: boolean;
  basePriceInCents: number;
  periodLabel: string;
  shortDesc: string;
  fullDesc: string;
  features: string[];
  icon: typeof Feather;
}

const PLANS: PlanDefinition[] = [
  {
    key: '21dias',
    title: '21 dias de escrita',
    tag: 'mais procurado · recomendado',
    isRecommended: true,
    basePriceInCents: 7700,
    periodLabel: '/ ano',
    shortDesc: 'rituais diários e áudios binaurais para destravar a voz própria.',
    fullDesc: 'jornada prática de 3 semanas com 21 rituais de escrita autoral, trilha do olhar e encerramento poético.',
    features: [
      '21 rituais diários de escrita autoral',
      'áudios binaurais guiados para fluência e foco',
      'acesso imediato e contínuo ao atelier',
      'partilhas e trocas na fogueira digital',
    ],
    icon: Feather,
  },
  {
    key: 'cafe',
    title: 'café com letras',
    tag: 'ritual semanal · flexível',
    isRecommended: false,
    basePriceInCents: 9700,
    periodLabel: '/ mês',
    shortDesc: 'encontros ao vivo semanais (terças 8h–8h30) e comunidade ativa.',
    fullDesc: 'espaço semanal de escrita ao vivo no zoom, desbloqueio criativo e conversa afetuosa com a turma.',
    features: [
      '4 encontros ao vivo por mês (terças 8h–8h30)',
      'exercícios curtos para desbloqueio criativo',
      'comunidade no whatsapp e na fogueira',
      'assinatura mensal (cancele quando quiser)',
    ],
    icon: Coffee,
  },
  {
    key: 'ciclo',
    title: 'ciclo de aprofundamento',
    tag: 'experiência completa',
    isRecommended: false,
    basePriceInCents: 59700,
    periodLabel: '/ trimestre',
    shortDesc: 'inclui os 21 dias + café com letras + encontros ao vivo do ciclo.',
    fullDesc: 'travessia imersiva de 3 meses com livro-guia, 3 encontros de fechamento com convidadas e acervo ilimitado.',
    features: [
      '3 encontros ao vivo de fechamento no zoom',
      '100% dos encontros do café com letras inclusos',
      'curso 21 dias de escrita incluso',
      'acervo completo de gravações e materiais',
    ],
    icon: Crown,
  },
];

export default function UpgradeModal({
  isOpen,
  onClose,
  title,
  subtitle,
  reason = 'trial_expired',
  onSelectProduct,
}: UpgradeModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<'21dias' | 'cafe' | 'ciclo'>('21dias');
  const [expandedMobilePlan, setExpandedMobilePlan] = useState<'21dias' | 'cafe' | 'ciclo'>('21dias');
  const [couponCode, setCouponCode] = useState('');
  const [validating, setValidating] = useState(false);
  const [validatedCoupon, setValidatedCoupon] = useState<Coupon | null>(null);
  const [couponMessage, setCouponMessage] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isCouponBoxOpen, setIsCouponBoxOpen] = useState(false);

  if (!isOpen) return null;

  const handleSelect = (productKey: '21dias' | 'cafe' | 'ciclo') => {
    onClose();
    if (onSelectProduct) {
      onSelectProduct(productKey, validatedCoupon?.code || couponCode.trim() || undefined);
    }
  };

  const handleValidateCoupon = async () => {
    const code = couponCode.trim();
    if (!code) {
      setCouponError('digite um código de bolsa ou cupom.');
      return;
    }

    setValidating(true);
    setCouponError('');
    setCouponMessage('');

    try {
      const res = await validateCoupon({ code });
      if (!res.valid || !res.coupon) {
        setCouponError(res.error || 'código não encontrado ou inválido.');
        setValidatedCoupon(null);
      } else {
        setValidatedCoupon(res.coupon);
        setCouponMessage(res.message || 'cupom aplicado com sucesso! valores recalculados abaixo.');
      }
    } catch (err: any) {
      setCouponError(err.message || 'erro ao checar cupom.');
      setValidatedCoupon(null);
    } finally {
      setValidating(false);
    }
  };

  const handleRemoveCoupon = () => {
    setValidatedCoupon(null);
    setCouponCode('');
    setCouponMessage('');
    setCouponError('');
  };

  const reasonContent = {
    trial_expired: {
      badge: 'período de experiência concluído',
      heading: title || 'seus textos continuam seguros aqui',
      sub:
        subtitle ||
        'seu teste livre de 4 dias terminou. para continuar escrevendo no atelier, criando cadernos ilimitados e partilhando na fogueira, escolha a sua travessia.',
    },
    fogueira_limit: {
      badge: 'limite de partilhas da semana atingido',
      heading: title || 'a fogueira acolheu suas palavras',
      sub:
        subtitle ||
        'você atingiu o limite de 3 partilhas semanais da conta gratuita. para publicar sem limites e escrever no atelier livremente, torne-se membra.',
    },
    course_locked: {
      badge: 'conteúdo de aprofundamento',
      heading: title || 'uma travessia guiada espera por você',
      sub:
        subtitle ||
        'esta oficina possui encontros, rituais e materiais exclusivos. escolha o plano que melhor acolhe o seu momento de escrita.',
    },
    general: {
      badge: 'espaço de escrita & comunidade',
      heading: title || 'escolha sua travessia autoral',
      sub:
        subtitle ||
        'participe dos encontros semanais, crie o hábito sustentado de escrever e partilhe suas palavras com quem também escreve com o coração.',
    },
  }[reason];

  const getPriceDisplay = (plan: PlanDefinition) => {
    if (!validatedCoupon) {
      const formatted = (plan.basePriceInCents / 100).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });
      return {
        formattedPrice: formatted,
        originalPrice: null,
        isFree: false,
        discountTag: null,
      };
    }

    const { discountInCents, finalPriceInCents, percent } = calculateCouponDiscount(
      validatedCoupon,
      plan.basePriceInCents
    );

    if (discountInCents > 0) {
      const original = (plan.basePriceInCents / 100).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });
      const formatted =
        finalPriceInCents === 0
          ? 'gratuito'
          : (finalPriceInCents / 100).toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            });
      return {
        formattedPrice: formatted,
        originalPrice: original,
        isFree: finalPriceInCents === 0,
        discountTag: percent === 100 ? 'bolsa 100%' : `${percent}% off`,
      };
    }

    if (validatedCoupon.type === 'trial_extension') {
      const formatted = (plan.basePriceInCents / 100).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });
      return {
        formattedPrice: formatted,
        originalPrice: null,
        isFree: false,
        discountTag: `+${validatedCoupon.benefit_value}d degustação`,
      };
    }

    const formatted = (plan.basePriceInCents / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
    return {
      formattedPrice: formatted,
      originalPrice: null,
      isFree: false,
      discountTag: null,
    };
  };

  const selectedPlanData = PLANS.find((p) => p.key === selectedPlan) || PLANS[0];
  const selectedPriceData = getPriceDisplay(selectedPlanData);

  return (
    <div className="fixed inset-0 bg-tintaCarvao/60 backdrop-blur-xs flex items-end sm:items-center justify-center z-[99999] p-0 sm:p-4">
      {/* Modal Container: Bottom-sheet em mobile e Card flutuante em desktop */}
      <div className="bg-papelClaro rounded-t-3xl sm:rounded-3xl max-w-3xl w-full max-h-[92vh] sm:max-h-[88vh] flex flex-col shadow-kraft-lg border border-papelKraft/50 overflow-hidden relative animate-fade-in">
        
        {/* Cabeçalho Fixo */}
        <div className="p-5 sm:p-6 border-b border-papelKraft/30 bg-bgPlataforma/70 shrink-0 flex items-start justify-between relative">
          <div className="space-y-1.5 pr-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-acentoTerracota text-white text-[11px] font-corpo lowercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              <span>{reasonContent.badge}</span>
            </span>
            <h2 className="font-editorial text-xl sm:text-2xl text-acentoAzul font-bold lowercase leading-snug">
              {reasonContent.heading}
            </h2>
            <p className="text-xs sm:text-sm font-corpo text-tintaCarvao/80 lowercase leading-relaxed line-clamp-2 sm:line-clamp-none">
              {reasonContent.sub}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-papelKraft/30 hover:bg-papelKraft/50 flex items-center justify-center text-tintaCarvao/70 hover:text-tintaCarvao transition-colors shrink-0 cursor-pointer"
            aria-label="fechar modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Corpo com Rolagem Limpa */}
        <div className="overflow-y-auto custom-scrollbar p-4 sm:p-6 space-y-4 flex-1">
          
          {/* Caixa de Cupom / Código de Bolsa Comunitária */}
          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-papelKraft/40 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsCouponBoxOpen(!isCouponBoxOpen)}
                className="text-xs font-medium text-tintaCarvao/80 font-corpo lowercase flex items-center gap-2 hover:text-acentoAzul transition-colors cursor-pointer"
              >
                <Tag className="w-3.5 h-3.5 text-acentoTerracota" />
                <span>possui um código de bolsa ou cupom?</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isCouponBoxOpen ? 'rotate-180' : ''}`} />
              </button>

              {validatedCoupon && (
                <span className="text-[10px] font-bold text-white bg-acentoOliva px-2 py-0.5 rounded-full lowercase">
                  código ativo
                </span>
              )}
            </div>

            {/* Formulário de Cupom Expansível */}
            {(isCouponBoxOpen || validatedCoupon) && (
              <div className="pt-1 space-y-2 animate-fade-in">
                {validatedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 bg-bgPlataforma rounded-xl border border-papelKraft/40 text-xs font-corpo">
                    <div className="flex items-center gap-2">
                      <Ticket className="w-4 h-4 text-acentoTerracota" />
                      <div>
                        <span className="font-bold text-acentoAzul tracking-wider">{validatedCoupon.code}</span>
                        <p className="text-[11px] text-tintaCarvao/70 lowercase">{couponMessage}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-[11px] text-acentoTerracota hover:underline lowercase font-medium cursor-pointer"
                    >
                      remover
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value.toUpperCase());
                        setCouponError('');
                        setCouponMessage('');
                      }}
                      placeholder="ex: LIRICA2026, COLETIVOAFETO"
                      className="flex-1 px-3 py-2 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo uppercase tracking-wider text-tintaCarvao focus:outline-none focus:border-acentoAzul"
                    />
                    <button
                      type="button"
                      onClick={handleValidateCoupon}
                      disabled={validating || !couponCode.trim()}
                      className="px-4 py-2 bg-acentoAzul hover:bg-acentoAzul/90 text-white rounded-xl text-xs font-gesto text-[18px] lowercase disabled:opacity-50 transition-all cursor-pointer shrink-0"
                    >
                      {validating ? 'checando...' : 'aplicar'}
                    </button>
                  </div>
                )}

                {couponError && (
                  <p className="text-[11px] text-acentoTerracota font-corpo lowercase">
                    {couponError}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* VISUALIZAÇÃO MOBILE: Cartões Acordeão (sm:hidden) */}
          <div className="space-y-2.5 sm:hidden">
            {PLANS.map((plan) => {
              const isSelected = selectedPlan === plan.key;
              const isExpanded = expandedMobilePlan === plan.key;
              const priceInfo = getPriceDisplay(plan);
              const IconComp = plan.icon;

              return (
                <div
                  key={plan.key}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden bg-white ${
                    isSelected
                      ? 'border-papelKraft/80 shadow-md ring-1 ring-acentoTerracota'
                      : 'border-papelKraft/40 shadow-xs'
                  }`}
                >
                  {/* Cabeçalho do Acordeão */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPlan(plan.key);
                      setExpandedMobilePlan(isExpanded ? '' as any : plan.key);
                    }}
                    className="w-full p-4 text-left flex items-start justify-between gap-3 cursor-pointer"
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {/* Indicador de Seleção Circular */}
                      <div
                        className={`w-5 h-5 rounded-full border mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-acentoTerracota border-acentoTerracota text-white'
                            : 'border-papelKraft/60 bg-bgPlataforma'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>

                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-editorial font-bold text-base text-acentoAzul lowercase">
                            {plan.title}
                          </h3>
                          {plan.isRecommended && (
                            <span className="text-[9px] font-bold font-corpo text-white bg-acentoTerracota px-1.5 py-0.5 rounded-full lowercase">
                              recomendado
                            </span>
                          )}
                          {priceInfo.discountTag && (
                            <span className="text-[9px] font-bold font-corpo text-white bg-acentoOliva px-1.5 py-0.5 rounded-full lowercase">
                              {priceInfo.discountTag}
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-corpo text-tintaCarvao/70 lowercase line-clamp-1">
                          {plan.shortDesc}
                        </p>
                      </div>
                    </div>

                    {/* Preço e Chevron */}
                    <div className="text-right shrink-0 flex flex-col items-end pl-2">
                      <div className="flex items-baseline gap-1">
                        {priceInfo.originalPrice && (
                          <span className="text-[11px] line-through text-tintaCarvao/40 font-corpo">
                            {priceInfo.originalPrice}
                          </span>
                        )}
                        <span className="font-gesto text-lg text-acentoTerracota font-normal">
                          {priceInfo.formattedPrice}
                        </span>
                      </div>
                      <span className="text-[10px] text-tintaCarvao/60 font-corpo lowercase">
                        {plan.periodLabel}
                      </span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-tintaCarvao/50 mt-1 transition-transform duration-200 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </button>

                  {/* Corpo Expandido do Acordeão */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 border-t border-papelKraft/20 space-y-3 bg-bgPlataforma/30 animate-fade-in">
                      <p className="text-xs font-corpo text-tintaCarvao/80 lowercase leading-relaxed">
                        {plan.fullDesc}
                      </p>

                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-acentoAzul font-corpo lowercase tracking-wider block">
                          o que está incluído:
                        </span>
                        <ul className="space-y-1">
                          {plan.features.map((feat, idx) => (
                            <li
                              key={idx}
                              className="text-xs font-corpo text-tintaCarvao/80 lowercase flex items-start gap-1.5"
                            >
                              <span className="text-acentoTerracota font-bold">·</span>
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* VISUALIZAÇÃO DESKTOP: Grade de 3 Cartões (hidden sm:grid) */}
          <div className="hidden sm:grid sm:grid-cols-3 gap-3.5">
            {PLANS.map((plan) => {
              const isSelected = selectedPlan === plan.key;
              const priceInfo = getPriceDisplay(plan);
              const IconComp = plan.icon;

              return (
                <div
                  key={plan.key}
                  onClick={() => setSelectedPlan(plan.key)}
                  className={`bg-white rounded-2xl border p-4.5 flex flex-col justify-between space-y-3.5 cursor-pointer transition-all duration-200 relative ${
                    isSelected
                      ? 'border-papelKraft/80 shadow-md ring-1 ring-acentoTerracota'
                      : 'border-papelKraft/40 shadow-xs hover:border-papelKraft/60'
                  }`}
                >
                  {/* Badge Superior */}
                  {plan.isRecommended && (
                    <div className="absolute -top-2.5 right-3 px-2 py-0.5 bg-acentoTerracota text-white text-[9px] font-bold font-corpo lowercase tracking-wider rounded-full shadow-2xs">
                      recomendado
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="p-2 rounded-xl bg-bgPlataforma text-acentoAzul border border-papelKraft/40">
                        <IconComp className="w-4 h-4" />
                      </span>
                      {priceInfo.discountTag && (
                        <span className="text-[10px] font-bold font-corpo text-white bg-acentoOliva px-2 py-0.5 rounded-full lowercase">
                          {priceInfo.discountTag}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold font-editorial text-acentoAzul lowercase">
                      {plan.title}
                    </h3>

                    <p className="text-xs font-corpo text-tintaCarvao/75 lowercase line-clamp-2">
                      {plan.shortDesc}
                    </p>

                    <div className="pt-1">
                      {priceInfo.originalPrice && (
                        <span className="text-xs line-through text-tintaCarvao/40 font-corpo block mb-0.5">
                          {priceInfo.originalPrice}
                        </span>
                      )}
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-normal font-gesto text-acentoTerracota">
                          {priceInfo.formattedPrice}
                        </span>
                        <span className="text-xs text-tintaCarvao/60 font-corpo lowercase">
                          {plan.periodLabel}
                        </span>
                      </div>
                    </div>

                    <ul className="pt-2 border-t border-papelKraft/20 space-y-1">
                      {plan.features.slice(0, 3).map((feat, idx) => (
                        <li key={idx} className="text-[11px] font-corpo text-tintaCarvao/70 lowercase flex items-start gap-1">
                          <span className="text-acentoTerracota font-bold">·</span>
                          <span className="line-clamp-1">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(plan.key);
                    }}
                    className={`w-full py-2 px-3 rounded-full text-xs font-gesto text-[18px] lowercase transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer ${
                      isSelected
                        ? 'bg-acentoTerracota hover:bg-acentoTerracota/90 text-white'
                        : 'bg-acentoAzul hover:bg-acentoAzul/90 text-white'
                    }`}
                  >
                    <span>escolher {plan.key === '21dias' ? '21 dias' : plan.key === 'cafe' ? 'café' : 'ciclo'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Garantia e Apoio */}
          <div className="pt-2 border-t border-papelKraft/30 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-tintaCarvao/70 font-corpo text-center sm:text-left">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-acentoOliva shrink-0" />
              <span>seus rascunhos continuam salvos com sigilo absoluto.</span>
            </div>
            <a
              href="https://wa.me/5548991901483"
              target="_blank"
              rel="noopener noreferrer"
              className="text-acentoAzul hover:underline lowercase font-medium"
            >
              dúvidas? fale com a bru no whatsapp
            </a>
          </div>
        </div>

        {/* Barra de Ação Fixa Inferior (Mobile & Desktop) */}
        <div className="p-4 sm:p-5 border-t border-papelKraft/30 bg-bgPlataforma/80 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left">
            <span className="text-[11px] text-tintaCarvao/60 font-corpo lowercase block">
              plano selecionado:
            </span>
            <div className="flex items-baseline gap-2 justify-center sm:justify-start">
              <span className="font-editorial font-bold text-base text-acentoAzul lowercase">
                {selectedPlanData.title}
              </span>
              <span className="font-gesto text-lg text-acentoTerracota font-normal">
                {selectedPriceData.formattedPrice}
              </span>
              <span className="text-xs text-tintaCarvao/60 font-corpo lowercase">
                {selectedPlanData.periodLabel}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleSelect(selectedPlan)}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-acentoTerracota hover:bg-acentoTerracota/90 text-white font-gesto text-[20px] sm:text-[23px] lowercase flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
          >
            <span>
              {selectedPriceData.isFree
                ? 'resgatar bolsa gratuita →'
                : `prosseguir com ${selectedPlan === '21dias' ? '21 dias' : selectedPlan === 'cafe' ? 'café' : 'o ciclo'} →`}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
}
