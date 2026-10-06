import React from 'react';
import { Sparkles, Clock, ArrowRight, Lock } from 'lucide-react';
import { useUserAccess } from '../hooks/useUserAccess';

interface TrialBannerProps {
  onUpgradeClick: () => void;
}

export default function TrialBanner({ onUpgradeClick }: TrialBannerProps) {
  const { isPaidMember, isAdmin, isTrialActive, isTrialExpired, trial } = useUserAccess();

  // Usuárias pagas ou administradoras não veem avisos de trial
  if (isPaidMember || isAdmin) {
    return null;
  }

  // 1. Caso: Trial Ativo (Mostra dias restantes poéticos)
  if (isTrialActive) {
    return (
      <div className="bg-gradient-to-r from-papelClaro via-white to-papelClaro rounded-2xl border border-papelKraft/70 p-3.5 sm:p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-tintaCarvao animate-fadeIn">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-acentoTerracota/15 border border-acentoTerracota/30 text-acentoTerracota flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-acentoTerracota" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-acentoTerracota uppercase tracking-wider font-corpo">
                período de experiência livre
              </span>
              <span className="text-xs font-mono font-bold text-acentoAzul bg-acentoAzul/10 px-2 py-0.5 rounded-full">
                {trial.daysRemaining} {trial.daysRemaining === 1 ? 'dia restante' : 'dias restantes'} ({trial.hoursRemaining}h)
              </span>
            </div>
            <p className="text-xs sm:text-sm font-corpo text-tintaCarvao/80 lowercase">
              aproveite o atelier e a fogueira com liberdade total. para garantir seu acesso contínuo por 1 ano, escolha seu plano.
            </p>
          </div>
        </div>

        <button
          onClick={onUpgradeClick}
          className="px-4 py-2 rounded-full bg-acentoTerracota hover:bg-acentoTerracota/90 text-white text-xs font-semibold font-corpo lowercase transition-all shrink-0 flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
        >
          <span>tornar-se membra</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  // 2. Caso: Trial Expirado (Aviso de modo somente leitura e incentivo para upgrade)
  if (isTrialExpired) {
    return (
      <div className="bg-papelKraft/25 rounded-2xl border border-acentoTerracota/40 p-3.5 sm:p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-tintaCarvao animate-fadeIn">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-acentoTerracota/15 border border-acentoTerracota/30 text-acentoTerracota flex items-center justify-center shrink-0">
            <Lock className="w-4 h-4 text-acentoTerracota" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-acentoTerracota uppercase tracking-wider font-corpo block">
              teste de 4 dias encerrado • atelier em modo leitura
            </span>
            <p className="text-xs sm:text-sm font-corpo text-tintaCarvao/80 lowercase">
              seus textos continuam salvos e seguros aqui. para voltar a escrever sem limites e desbloquear todos os cadernos, reative seu acesso.
            </p>
          </div>
        </div>

        <button
          onClick={onUpgradeClick}
          className="px-4 py-2 rounded-full bg-acentoAzul hover:bg-acentoAzul/90 text-white text-xs font-semibold font-corpo lowercase transition-all shrink-0 flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
        >
          <span>escolher meu plano</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return null;
}
