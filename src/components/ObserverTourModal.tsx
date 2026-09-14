import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  BookOpen,
  Coffee,
  Users,
  FileText,
  Flame,
  Heart,
  Star,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Eye,
  Compass,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePageContent } from '../hooks/usePageContent';
import { BRAND_ASSETS } from '../config/brandAssets';

interface ObserverTourModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ObserverTourModal({ isOpen, onClose }: ObserverTourModalProps) {
  const navigate = useNavigate();
  const { getSection } = usePageContent('tour_modal');

  const headerSec = getSection('header', {
    badge: 'modo observador • tour virtual',
    title: 'conheça a área de membros por dentro',
    icon: 'sparkles',
    button_text: 'fazer parte da comunidade',
    button_link: '/register',
    footer_notice: 'acesso imediato após a inscrição',
  });

  const tabAcervo = getSection('tab_acervo', {
    label: 'acervo de prompts',
    badge: '+120 exercícios',
    title: 'biblioteca viva de escrita diária',
    description: 'centenas de provocações poéticas, rituais de escrita e temas estruturados para destravar a sua caneta todos os dias.',
    image_url: '/brand-assets/deployments/IMG_8846.PNG',
    items: 'prompts de autorreflexão e desaceleração\nexercícios de memória e infância\nlaboratório de escrita intuitiva',
    icon: 'book-open',
  });

  const tabEncontros = getSection('tab_encontros', {
    label: 'rodas ao vivo',
    badge: 'ao vivo semanal',
    title: 'café com letras & mentoria ao vivo',
    description: 'encontros toda terça-feira das 8h às 8h30 para escrever em coletivo e partilhar a caminhada com facilitação de bruna & júlia.',
    image_url: '/brand-assets/deployments/IMG_2864.jpg',
    items: 'terças-feiras 8h-8h30 via zoom\nfogueira voluntária de leitura\ngravações 100% disponíveis no acervo',
    icon: 'coffee',
  });

  const tabComunidade = getSection('tab_comunidade', {
    label: 'mural da comunidade',
    badge: 'rede de apoio',
    title: 'espaço seguro de escuta & afeto',
    description: 'dois grupos dedicados ("junto e misturado" + "cá entre nós") para trocar impressões, celebrações e acolhimento sem julgamentos.',
    image_url: '/brand-assets/deployments/IMG_8066.PNG',
    items: 'trocas diárias entre escritoras\nfeedback amoroso sem críticas técnicas\ncomunidade ativa e acolhedora',
    icon: 'users',
  });

  const tabCadernos = getSection('tab_cadernos', {
    label: 'cadernos guiados',
    badge: 'impressão & pdf',
    title: 'guias em pdf para escrita manual',
    description: 'materiais diagramados com carinho para você baixar, imprimir e preencher no seu ritmo, desconectada das telas.',
    image_url: '/brand-assets/deployments/IMG_8151.PNG',
    items: 'diagramação afetiva em papel kraft\nguias de rituais e hábitos\ndiários de bordo artesanais',
    icon: 'file-text',
  });

  const [activeTabId, setActiveTabId] = useState<'acervo' | 'encontros' | 'comunidade' | 'cadernos'>('acervo');

  // Keydown listener for Esc key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getLucideIcon = (iconName: string) => {
    switch (iconName?.toLowerCase()) {
      case 'book-open':
        return BookOpen;
      case 'coffee':
        return Coffee;
      case 'users':
        return Users;
      case 'file-text':
        return FileText;
      case 'flame':
        return Flame;
      case 'heart':
        return Heart;
      case 'star':
        return Star;
      case 'sparkles':
      default:
        return Sparkles;
    }
  };

  const tabs = [
    { id: 'acervo' as const, data: tabAcervo },
    { id: 'encontros' as const, data: tabEncontros },
    { id: 'comunidade' as const, data: tabComunidade },
    { id: 'cadernos' as const, data: tabCadernos },
  ];

  const currentTab = tabs.find((t) => t.id === activeTabId) || tabs[0];
  const CurrentIcon = getLucideIcon(currentTab.data.icon);
  const HeaderIcon = getLucideIcon(headerSec.icon);

  // Parse checklist items from newline-separated string
  const checklistItems = (currentTab.data.items || '')
    .split('\n')
    .map((s: string) => s.trim())
    .filter(Boolean);

  const handleJoin = () => {
    onClose();
    if (headerSec.button_link?.startsWith('http')) {
      window.location.href = headerSec.button_link;
    } else {
      navigate(headerSec.button_link || '/register');
    }
  };

  return (
    <div className="fixed inset-0 z-50 w-screen h-screen min-h-screen bg-bgPlataforma flex flex-col overflow-hidden animate-fadeIn">
      {/* 1. Header Superior Sticky de Tela Cheia */}
      <header className="flex-shrink-0 bg-papelClaro border-b border-papelKraft/60 px-4 sm:px-8 py-4 flex items-center justify-between shadow-xs relative z-20">
        <div className="flex items-center gap-4">
          <img
            src={BRAND_ASSETS.logos.horizontal}
            alt="solta o verbo"
            className="h-7 sm:h-9 w-auto object-contain hidden sm:block"
          />

          <div className="h-6 w-px bg-papelKraft/40 hidden sm:block" />

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-acentoTerracota/10 text-acentoTerracota flex items-center justify-center border border-acentoTerracota/30 shadow-xs">
              <HeaderIcon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-acentoTerracota lowercase tracking-wider block leading-none">
                {headerSec.badge || 'modo observador • tour virtual'}
              </span>
              <h1 className="font-editorial text-xl sm:text-2xl font-bold text-acentoAzul lowercase leading-tight mt-0.5">
                {headerSec.title || 'conheça a área de membros por dentro'}
              </h1>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full bg-papelKraft/20 hover:bg-papelKraft/40 text-tintaCarvao font-semibold text-xs sm:text-sm transition-all lowercase flex items-center gap-2 cursor-pointer"
          >
            <span>fechar preview</span>
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. Barra de Abas de Navegação em Tela Cheia */}
      <div className="flex-shrink-0 bg-papelClaro/80 backdrop-blur-md border-b border-papelKraft/40 px-4 sm:px-8 pt-3 overflow-x-auto select-none">
        <div className="flex gap-2 max-w-7xl mx-auto">
          {tabs.map((tab) => {
            const TabIcon = getLucideIcon(tab.data.icon);
            const isActive = tab.id === activeTabId;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTabId(tab.id)}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-t-2xl font-bold text-sm lowercase transition-all cursor-pointer whitespace-nowrap border-t border-x ${
                  isActive
                    ? 'bg-bgPlataforma border-papelKraft/60 text-acentoAzul border-b-transparent shadow-xs'
                    : 'border-transparent text-tintaCarvao/70 hover:text-acentoAzul hover:bg-papelKraft/15'
                }`}
              >
                <TabIcon className={`w-4 h-4 ${isActive ? 'text-acentoTerracota' : 'text-tintaCarvao/60'}`} />
                <span>{tab.data.label || tab.id}</span>
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-acentoTerracota ml-1 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Área Conteúdo Principal de Tela Cheia com Rolagem */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-12 bg-bgPlataforma">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[calc(100vh-220px)]">
          {/* Coluna Esquerda: Informações & Prosa */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-acentoAzul/10 text-acentoAzul font-bold text-xs lowercase border border-acentoAzul/30 shadow-xs">
                <Compass className="w-3.5 h-3.5 text-acentoTerracota" />
                <span>{currentTab.data.badge || 'destaque'}</span>
              </span>

              <h2 className="font-gesto text-4xl sm:text-5xl font-normal text-acentoTerracota lowercase leading-tight">
                {currentTab.data.title}
              </h2>
            </div>

            <p className="text-tintaCarvao/85 text-lg sm:text-xl font-medium lowercase leading-relaxed max-w-2xl">
              {currentTab.data.description}
            </p>

            {/* Box Recurso Destaque */}
            <div className="p-6 bg-papelClaro rounded-3xl border border-papelKraft/60 shadow-kraft space-y-4 max-w-2xl">
              <div className="flex items-center justify-between border-b border-papelKraft/30 pb-3">
                <span className="text-xs font-bold text-acentoAzul uppercase tracking-wider block">
                  o que você encontra aqui:
                </span>
                <span className="text-xs font-medium text-tintaCarvao/60 lowercase">
                  {checklistItems.length} recursos inclusos
                </span>
              </div>

              <ul className="space-y-3">
                {checklistItems.map((item: string, idx: number) => (
                  <li key={idx} className="flex items-center gap-3 text-sm sm:text-base text-tintaCarvao/90 font-medium lowercase">
                    <div className="w-5 h-5 rounded-full bg-acentoOliva/20 text-tintaCarvao flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-tintaCarvao" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Coluna Direita: Foto / Screenshot Demonstrativo da Área de Membros */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl bg-papelClaro p-4 sm:p-6 border border-papelKraft/60 shadow-kraft-lg overflow-hidden group">
              {/* Sticker Washi Tape */}
              <div className="absolute -top-2 right-8 w-28 h-7 pointer-events-none z-30 opacity-90">
                <img
                  src="/brand-assets/elements/stickers/fitas-washi-flores-terracota.png"
                  alt="fita washi"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Tag de Preview */}
              <div className="absolute top-8 left-8 z-20 px-3 py-1 rounded-full bg-acentoAzul/90 text-white font-bold text-xs lowercase backdrop-blur-sm border border-white/20 shadow-sm flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-acentoOliva" />
                <span>área de membros em tempo real</span>
              </div>

              <div className="w-full h-72 sm:h-96 lg:h-[420px] rounded-2xl overflow-hidden border border-papelKraft/40 shadow-sm relative group-hover:shadow-md transition-all duration-500">
                <img
                  src={currentTab.data.image_url || '/brand-assets/deployments/IMG_8846.PNG'}
                  alt={currentTab.data.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/brand-assets/gallery/events/13062026-IMG_6581-2.jpg';
                  }}
                />
              </div>

              <div className="pt-4 flex items-center justify-between text-xs text-tintaCarvao/70 font-medium lowercase">
                <span>preview interativo da plataforma</span>
                <span className="font-editorial text-acentoAzul font-bold text-sm">solta o verbo</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 4. Footer Inferior Sticky com CTAs de Tela Cheia */}
      <footer className="flex-shrink-0 bg-papelClaro border-t border-papelKraft/60 px-4 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-kraft z-20">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-tintaCarvao/80 lowercase">
          <ShieldCheck className="w-4 h-4 text-acentoOliva flex-shrink-0" />
          <span>{headerSec.footer_notice || 'acesso imediato após a inscrição'}</span>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          <button
            onClick={onClose}
            className="flex-1 sm:flex-none px-6 py-3 rounded-full border border-papelKraft/60 hover:bg-bgPlataforma text-tintaCarvao text-sm font-semibold transition-all lowercase cursor-pointer text-center"
          >
            fechar preview
          </button>

          <button
            onClick={handleJoin}
            className="flex-1 sm:flex-none btn-pill-primary text-sm sm:text-base px-8 py-3 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2.5 cursor-pointer lowercase font-bold"
          >
            <span>{headerSec.button_text || 'fazer parte da comunidade'}</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </footer>
    </div>
  );
}
