import React, { useState } from 'react';
import { X, Sparkles, BookOpen, Coffee, Users, FileText, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ObserverTourModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ObserverTourModal({ isOpen, onClose }: ObserverTourModalProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'acervo' | 'encontros' | 'comunidade' | 'cadernos'>('acervo');

  if (!isOpen) return null;

  const tabs = [
    {
      id: 'acervo' as const,
      label: 'acervo de prompts',
      icon: BookOpen,
      title: 'biblioteca viva de escrita diária',
      description: 'centenas de provocações poéticas, rituais de escrita e temas estruturados para destravar a sua caneta todos os dias.',
      badge: '+120 exercícios',
      previewItems: [
        'prompts de autorreflexão e desaceleração',
        'exercícios de memória e infância',
        'laboratório de escrita intuitiva',
      ],
    },
    {
      id: 'encontros' as const,
      label: 'rodas ao vivo',
      icon: Coffee,
      title: 'café com letras & mentoria ao vivo',
      description: 'encontros toda terça-feira das 8h às 8h30 para escrever em coletivo e partilhar a caminhada com facilitação de bruna & júlia.',
      badge: 'ao vivo semanal',
      previewItems: [
        'terças-feiras 8h-8h30 via zoom',
        'fogueira voluntária de leitura',
        'gravações 100% disponíveis no acervo',
      ],
    },
    {
      id: 'comunidade' as const,
      label: 'mural da comunidade',
      icon: Users,
      title: 'espaço seguro de escuta & afeto',
      description: 'dois grupos dedicados ("junto e misturado" + "cá entre nós") para trocar impressões, celebrações e acolhimento sem julgamentos.',
      badge: 'rede de apoio',
      previewItems: [
        'trocas diárias entre escritoras',
        'feedback amoroso sem críticas técnicas',
        'comunidade ativa e acolhedora',
      ],
    },
    {
      id: 'cadernos' as const,
      label: 'cadernos guiados',
      icon: FileText,
      title: 'guias em pdf para escrita manual',
      description: 'materiais diagramados com carinho para você baixar, imprimir e preencher no seu ritmo, desconectada das telas.',
      badge: 'impressão & pdf',
      previewItems: [
        'diagramação afetiva em papel kraft',
        'guias de rituais e hábitos',
        'diários de bordo artesanais',
      ],
    },
  ];

  const currentTabData = tabs.find((t) => t.id === activeTab) || tabs[0];

  const handleJoin = () => {
    onClose();
    navigate('/register');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-tintaCarvao/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-papelClaro rounded-3xl border border-papelKraft/60 shadow-kraft-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header do Modal */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-papelKraft/40 bg-bgPlataforma/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-acentoTerracota/10 text-acentoTerracota flex items-center justify-center border border-acentoTerracota/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-acentoTerracota lowercase tracking-wider block">
                modo observador • tour virtual
              </span>
              <h2 className="font-editorial text-2xl font-bold text-acentoAzul lowercase leading-none mt-0.5">
                conheça a área de membros por dentro
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-papelKraft/20 hover:bg-papelKraft/40 text-tintaCarvao transition-colors flex items-center justify-center cursor-pointer"
            aria-label="fechar tour"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navegação por Abas do Tour */}
        <div className="flex border-b border-papelKraft/40 overflow-x-auto bg-papelClaro px-4 pt-3 gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-2xl font-bold text-xs sm:text-sm lowercase transition-all cursor-pointer whitespace-nowrap border-t border-x ${
                  isActive
                    ? 'bg-bgPlataforma border-papelKraft/60 text-acentoAzul border-b-transparent shadow-xs'
                    : 'border-transparent text-tintaCarvao/70 hover:text-acentoAzul hover:bg-papelKraft/10'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-acentoTerracota' : 'text-tintaCarvao/60'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Conteúdo da Aba Selecionada */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1 bg-bgPlataforma/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-acentoAzul/10 text-acentoAzul font-bold text-xs lowercase border border-acentoAzul/30 mb-2">
                {currentTabData.badge}
              </span>
              <h3 className="font-gesto text-3xl font-normal text-acentoTerracota lowercase">
                {currentTabData.title}
              </h3>
            </div>
          </div>

          <p className="text-tintaCarvao/85 text-base sm:text-lg font-medium lowercase leading-relaxed">
            {currentTabData.description}
          </p>

          {/* Card de Preview Interativo */}
          <div className="p-5 bg-papelClaro rounded-2xl border border-papelKraft/60 shadow-xs space-y-3">
            <span className="text-xs font-bold text-tintaCarvao/60 uppercase tracking-wider block border-b border-papelKraft/30 pb-2">
              o que você encontra aqui:
            </span>
            <ul className="space-y-2">
              {currentTabData.previewItems.map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm text-tintaCarvao/90 font-medium lowercase">
                  <CheckCircle2 className="w-4 h-4 text-acentoOliva flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer do Modal com CTAs */}
        <div className="p-6 bg-papelClaro border-t border-papelKraft/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-medium text-tintaCarvao/70 lowercase">
            <ShieldCheck className="w-4 h-4 text-acentoOliva" />
            <span>acesso imediato após a inscrição</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-5 py-3 rounded-full border border-papelKraft/60 hover:bg-bgPlataforma text-tintaCarvao text-sm font-semibold transition-all lowercase cursor-pointer text-center"
            >
              fechar preview
            </button>
            <button
              onClick={handleJoin}
              className="flex-1 sm:flex-none btn-pill-primary text-sm px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer lowercase"
            >
              <span>fazer parte da comunidade</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
