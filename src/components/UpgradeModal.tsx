import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Feather,
  Coffee,
  BookOpen,
  Crown,
  ArrowRight,
  ShieldCheck,
  Tag,
  Ticket,
} from 'lucide-react';
import { validateCoupon, Coupon } from '../lib/coupons';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  reason?: 'trial_expired' | 'fogueira_limit' | 'course_locked' | 'general';
  onSelectProduct?: (productKey: '21dias' | 'cafe' | 'ciclo', couponCode?: string) => void;
}

export default function UpgradeModal({
  isOpen,
  onClose,
  title,
  subtitle,
  reason = 'trial_expired',
  onSelectProduct,
}: UpgradeModalProps) {
  const [couponCode, setCouponCode] = useState('');
  const [validating, setValidating] = useState(false);
  const [validatedCoupon, setValidatedCoupon] = useState<Coupon | null>(null);
  const [couponMessage, setCouponMessage] = useState('');
  const [couponError, setCouponError] = useState('');

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
        setCouponMessage(res.message || 'cupom válido! selecione a jornada abaixo.');
      }
    } catch (err: any) {
      setCouponError(err.message || 'erro ao checar cupom.');
      setValidatedCoupon(null);
    } finally {
      setValidating(false);
    }
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

  return (
    <div className="fixed inset-0 bg-tintaCarvao/60 backdrop-blur-xs flex items-center justify-center z-[99999] p-4">
      <div className="bg-papelClaro rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-kraft-lg border border-papelKraft/60 max-h-[92vh] overflow-y-auto custom-scrollbar relative animate-fade-in">
        
        {/* Fechar */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 hover:bg-papelKraft/40 rounded-full transition-colors text-tintaCarvao/70 hover:text-tintaCarvao cursor-pointer"
          aria-label="fechar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cabeçalho */}
        <div className="space-y-2 text-center max-w-lg mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-acentoTerracota/10 border border-acentoTerracota/30 text-acentoTerracota text-[11px] font-bold font-corpo lowercase tracking-wider">
            <Sparkles className="w-3 h-3" />
            <span>{reasonContent.badge}</span>
          </span>
          <h2 className="font-editorial text-2xl sm:text-3xl text-acentoAzul font-bold lowercase leading-tight">
            {reasonContent.heading}
          </h2>
          <p className="text-xs sm:text-sm font-corpo text-tintaCarvao/80 lowercase leading-relaxed">
            {reasonContent.sub}
          </p>
        </div>

        {/* 3 Opções de Produto */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
          
          {/* 1. Café com Letras (Mensal Recorrente) */}
          <div className="bg-white rounded-2xl border border-papelKraft/60 p-4.5 flex flex-col justify-between space-y-3 hover:border-acentoAzul/60 transition-colors shadow-xs">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-xl bg-acentoAzul/10 text-acentoAzul">
                  <Coffee className="w-4 h-4" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-acentoTerracota bg-acentoTerracota/5 px-2 py-0.5 rounded-full">
                  mais flexível
                </span>
              </div>
              <h3 className="text-lg font-bold font-editorial text-acentoAzul lowercase">
                café com letras
              </h3>
              <p className="text-xs font-corpo text-tintaCarvao/75 lowercase line-clamp-2">
                encontros ao vivo semanais (terças 8h-8h30) e comunidade ativa.
              </p>
              <div className="pt-1">
                <span className="text-xl font-bold font-editorial text-acentoAzul">
                  R$ 97
                </span>
                <span className="text-xs text-tintaCarvao/60 font-corpo lowercase"> / mês</span>
              </div>
            </div>

            <button
              onClick={() => handleSelect('cafe')}
              className="w-full py-2 px-3 rounded-full bg-acentoAzul hover:bg-acentoAzul/90 text-white text-xs font-semibold font-corpo lowercase transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
            >
              <span>escolher café</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 2. 21 Dias de Escrita (Anual Único) */}
          <div className="bg-white rounded-2xl border-2 border-acentoTerracota/40 p-4.5 flex flex-col justify-between space-y-3 relative shadow-xs hover:border-acentoTerracota transition-colors">
            <div className="absolute -top-2.5 right-3 px-2 py-0.5 bg-acentoTerracota text-white text-[9px] font-bold font-corpo uppercase tracking-wider rounded-full shadow-2xs">
              recomendado
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-xl bg-acentoTerracota/10 text-acentoTerracota">
                  <Feather className="w-4 h-4" />
                </span>
              </div>
              <h3 className="text-lg font-bold font-editorial text-acentoAzul lowercase">
                21 dias de escrita
              </h3>
              <p className="text-xs font-corpo text-tintaCarvao/75 lowercase line-clamp-2">
                rituais diários e áudios binaurais para destravar a voz própria.
              </p>
              <div className="pt-1">
                <span className="text-xl font-bold font-editorial text-acentoTerracota">
                  R$ 77
                </span>
                <span className="text-xs text-tintaCarvao/60 font-corpo lowercase"> / ano</span>
              </div>
            </div>

            <button
              onClick={() => handleSelect('21dias')}
              className="w-full py-2 px-3 rounded-full bg-acentoTerracota hover:bg-acentoTerracota/90 text-white text-xs font-semibold font-corpo lowercase transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
            >
              <span>começar agora</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 3. Ciclo de Aprofundamento (Bundle Completo) */}
          <div className="bg-white rounded-2xl border border-papelKraft/60 p-4.5 flex flex-col justify-between space-y-3 hover:border-acentoAzul/60 transition-colors shadow-xs">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-xl bg-acentoOliva/20 text-tintaCarvao">
                  <Crown className="w-4 h-4 text-acentoAzul" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-acentoAzul bg-acentoAzul/5 px-2 py-0.5 rounded-full">
                  experiência completa
                </span>
              </div>
              <h3 className="text-lg font-bold font-editorial text-acentoAzul lowercase">
                ciclo de aprofundamento
              </h3>
              <p className="text-xs font-corpo text-tintaCarvao/75 lowercase line-clamp-2">
                inclui os 21 dias + café com letras + encontros do ciclo.
              </p>
              <div className="pt-1">
                <span className="text-xl font-bold font-editorial text-acentoAzul">
                  R$ 597
                </span>
                <span className="text-xs text-tintaCarvao/60 font-corpo lowercase"> / ano</span>
              </div>
            </div>

            <button
              onClick={() => handleSelect('ciclo')}
              className="w-full py-2 px-3 rounded-full bg-acentoAzul hover:bg-acentoAzul/90 text-white text-xs font-semibold font-corpo lowercase transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
            >
              <span>travessia completa</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Campo de Cupom / Código de Bolsa Comunitária */}
        <div className="bg-white/90 p-4 rounded-2xl border border-papelKraft/50 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-tintaCarvao/70 font-corpo lowercase flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-acentoTerracota" />
              <span>possui um código de bolsa comunitária ou cupom?</span>
            </span>
            {validatedCoupon && (
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full lowercase">
                código aplicado
              </span>
            )}
          </div>

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
              className="flex-1 px-3 py-1.5 bg-bgPlataforma border border-papelKraft/50 rounded-xl text-xs font-corpo uppercase tracking-wider text-tintaCarvao focus:outline-none focus:border-acentoAzul"
            />
            <button
              type="button"
              onClick={handleValidateCoupon}
              disabled={validating || !couponCode.trim()}
              className="px-3.5 py-1.5 bg-acentoAzul hover:bg-acentoAzul/90 text-white rounded-xl text-xs font-bold font-corpo lowercase disabled:opacity-50 transition-all cursor-pointer shrink-0"
            >
              {validating ? 'checando...' : 'aplicar código'}
            </button>
          </div>

          {couponMessage && (
            <p className="text-[11px] text-emerald-700 font-corpo font-medium lowercase">
              ✓ {couponMessage}
            </p>
          )}

          {couponError && (
            <p className="text-[11px] text-acentoTerracota font-corpo lowercase">
              {couponError}
            </p>
          )}
        </div>

        {/* Garantia e Apoio */}
        <div className="pt-2 border-t border-papelKraft/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-tintaCarvao/70 font-corpo text-center sm:text-left">
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
            tem alguma dúvida? fale com a bru
          </a>
        </div>
      </div>
    </div>
  );
}
