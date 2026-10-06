import React from 'react';
import { X, Sparkles, Feather, Coffee, BookOpen, Crown, ArrowRight, ShieldCheck } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  reason?: 'trial_expired' | 'fogueira_limit' | 'course_locked' | 'general';
  onSelectProduct?: (productKey: '21dias' | 'cafe' | 'ciclo') => void;
}

export default function UpgradeModal({
  isOpen,
  onClose,
  title,
  subtitle,
  reason = 'trial_expired',
  onSelectProduct,
}: UpgradeModalProps) {
  if (!isOpen) return null;

  const handleSelect = (productKey: '21dias' | 'cafe' | 'ciclo') => {
    onClose();
    if (onSelectProduct) {
      onSelectProduct(productKey);
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
      badge: 'conteúdo exclusivo',
      heading: title || 'um chamado para se aprofundar',
      sub:
        subtitle ||
        'esta oficina é exclusiva para quem deu o passo na jornada. conheça nossos planos e destranque todos os rituais.',
    },
    general: {
      badge: 'faça parte da comunidade',
      heading: title || 'escolha a sua travessia',
      sub:
        subtitle ||
        'desbloqueie o estúdio de escrita ilimitado, cadernos poéticos e encontros ao vivo com o coletivo solta o verbo.',
    },
  }[reason];

  return (
    <div
      className="fixed inset-0 bg-tintaCarvao/60 backdrop-blur-xs flex items-center justify-center z-[999999] p-3 sm:p-5 animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-papelClaro rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto border border-papelKraft/70 shadow-kraft-lg relative p-5 sm:p-8 space-y-6 text-tintaCarvao">
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-papelKraft/30 bg-papelKraft/15 text-tintaCarvao/70 hover:text-tintaCarvao transition-colors cursor-pointer"
          aria-label="fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cabeçalho Poético */}
        <div className="text-center space-y-2 max-w-lg mx-auto pt-2">
          <span className="inline-block px-3.5 py-1 rounded-full bg-acentoTerracota/10 border border-acentoTerracota/30 text-acentoTerracota text-xs font-bold font-corpo lowercase">
            {reasonContent.badge}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-normal font-gesto text-acentoAzul lowercase leading-tight">
            {reasonContent.heading}
          </h2>
          <p className="text-xs sm:text-sm font-corpo text-tintaCarvao/80 lowercase leading-relaxed">
            {reasonContent.sub}
          </p>
        </div>

        {/* Grid de Opções de Planos (3 Camadas da Marca) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2 items-stretch">
          
          {/* 1. Café com Letras (Mensal Recorrente) */}
          <div className="bg-white rounded-2xl border border-papelKraft/60 p-4.5 flex flex-col justify-between space-y-3 hover:border-acentoAzul/60 transition-colors shadow-xs">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-xl bg-acentoAzul/10 text-acentoAzul">
                  <Coffee className="w-4 h-4" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-acentoAzul bg-acentoAzul/5 px-2 py-0.5 rounded-full">
                  mensal
                </span>
              </div>
              <h3 className="text-lg font-bold font-editorial text-acentoAzul lowercase">
                café com letras
              </h3>
              <p className="text-xs font-corpo text-tintaCarvao/75 lowercase line-clamp-2">
                encontros ao vivo toda terça 8h e atelier ilimitado.
              </p>
              <div className="pt-1">
                <span className="text-xl font-bold font-editorial text-acentoTerracota">
                  R$ 97
                </span>
                <span className="text-xs text-tintaCarvao/60 font-corpo lowercase"> / mês</span>
              </div>
            </div>

            <button
              onClick={() => handleSelect('cafe')}
              className="w-full py-2 px-3 rounded-full bg-white hover:bg-acentoAzul hover:text-white border border-acentoAzul text-acentoAzul text-xs font-semibold font-corpo lowercase transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
            >
              <span>entrar na roda</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 2. 21 Dias de Escrita (Destaque Econômico / R$ 77 Anual) */}
          <div className="bg-white rounded-2xl border-2 border-acentoTerracota p-4.5 flex flex-col justify-between space-y-3 shadow-sm relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-acentoTerracota text-white text-[10px] font-bold lowercase tracking-wider shadow-xs">
              mais escolhido
            </div>
            
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-xl bg-acentoTerracota/10 text-acentoTerracota">
                  <Feather className="w-4 h-4" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-acentoTerracota bg-acentoTerracota/10 px-2 py-0.5 rounded-full">
                  1 ano de acesso
                </span>
              </div>
              <h3 className="text-lg font-bold font-editorial text-acentoAzul lowercase">
                21 dias de escrita
              </h3>
              <p className="text-xs font-corpo text-tintaCarvao/75 lowercase line-clamp-2">
                curso completo, áudios guiados e 1 ano de estúdio autoral.
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
