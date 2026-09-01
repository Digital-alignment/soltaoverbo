import { Settings, X, Check, Type } from 'lucide-react';

export type EditorFontFamily = 'editorial' | 'sans' | 'garamond' | 'handwriting' | 'palatino';

export interface EditorSettings {
  showTimer: boolean;
  showWordCount: boolean;
  showMilestones: boolean;
  smartQuotes: boolean;
  smartEllipses: boolean;
  markdownShortcuts: boolean;
  doubleSpacePeriod: boolean;
  zoomLevel: number; // 90, 100, 110, 125
  fontFamily: EditorFontFamily;
}

export const FONT_OPTIONS: { id: EditorFontFamily; name: string; description: string; sample: string; css: string }[] = [
  {
    id: 'editorial',
    name: 'editorial serif (solta o verbo)',
    description: 'fonte poética oficial da marca, ideal para literatura e rituais.',
    sample: 'Solta o Verbo • Atelier Autoral',
    css: 'font-editorial',
  },
  {
    id: 'sans',
    name: 'sans-serif moderna',
    description: 'tipografia limpa e neutra, ideal para anotações e diário rápido.',
    sample: 'Solta o Verbo • Atelier Autoral',
    css: 'font-sans',
  },
  {
    id: 'garamond',
    name: 'garamond clássica',
    description: 'serifa clássica de livros, inspirada em romances e contos.',
    sample: 'Solta o Verbo • Atelier Autoral',
    css: 'font-serif',
  },
  {
    id: 'handwriting',
    name: 'manuscrita orgânica',
    description: 'estilo de caligrafia manual, acolhedor para diários íntimos.',
    sample: 'Solta o Verbo • Atelier Autoral',
    css: 'font-editorial italic',
  },
  {
    id: 'palatino',
    name: 'palatino humanista',
    description: 'tipografia nobre e equilibrada para ensaios e crônicas.',
    sample: 'Solta o Verbo • Atelier Autoral',
    css: 'font-serif font-medium',
  },
];

export const DEFAULT_EDITOR_SETTINGS: EditorSettings = {
  showTimer: true,
  showWordCount: true,
  showMilestones: true,
  smartQuotes: true,
  smartEllipses: true,
  markdownShortcuts: true,
  doubleSpacePeriod: false,
  zoomLevel: 100,
  fontFamily: 'editorial',
};

interface EditorSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: EditorSettings;
  onUpdateSettings: (newSettings: Partial<EditorSettings>) => void;
}

export default function EditorSettingsModal({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}: EditorSettingsModalProps) {
  if (!isOpen) return null;

  const toggleSetting = (key: keyof EditorSettings) => {
    onUpdateSettings({ [key]: !settings[key] });
  };

  return (
    <div className="fixed inset-0 z-[1000000] bg-tintaCarvao/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-papelClaro rounded-3xl border border-papelKraft/60 max-w-lg w-full shadow-kraft-lg overflow-hidden flex flex-col space-y-0">
        
        {/* HEADER DA MODAL DE CONFIGURAÇÕES */}
        <div className="px-6 py-4 border-b border-papelKraft/40 flex items-center justify-between bg-bgPlataforma/60">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-acentoAzul" />
            <h3 className="text-lg font-bold font-editorial text-acentoAzul lowercase">
              configurações do editor
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-papelKraft/40 text-tintaCarvao/60 hover:text-tintaCarvao transition-colors border border-papelKraft/40"
            title="fechar configurações"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* CORPO DE OPÇÕES DE CONFIGURAÇÃO DA REFERÊNCIA */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* SEÇÃO NOVA: TIPOGRAFIA DA FOLHA (5 FONTES POPULARES) */}
          <div className="bg-white/80 p-4 rounded-2xl border border-papelKraft/50 space-y-3.5 shadow-sm">
            <div className="flex items-center justify-between border-b border-papelKraft/30 pb-2">
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4 text-acentoAzul" />
                <h4 className="text-sm font-bold font-editorial text-acentoAzul lowercase">
                  tipo de letra (fonte da folha)
                </h4>
              </div>
              <span className="text-[10px] text-tintaCarvao/60 lowercase font-medium">
                5 estilos selecionados
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2 pt-1">
              {FONT_OPTIONS.map((font) => (
                <button
                  key={font.id}
                  type="button"
                  onClick={() => onUpdateSettings({ fontFamily: font.id })}
                  className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 ${
                    settings.fontFamily === font.id
                      ? 'bg-white border-acentoAzul shadow-sm text-acentoAzul'
                      : 'bg-bgPlataforma/50 border-papelKraft/40 text-tintaCarvao/80 hover:bg-white'
                  }`}
                >
                  <div className="space-y-0.5 min-w-0">
                    <span className="text-xs font-bold lowercase block">
                      {font.name}
                    </span>
                    <span className="text-[11px] text-tintaCarvao/70 lowercase block truncate">
                      {font.description}
                    </span>
                  </div>

                  {settings.fontFamily === font.id && (
                    <div className="w-5 h-5 rounded-full bg-acentoAzul text-white flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* SEÇÃO 1: VISUALIZAÇÃO & MÉTRICAS */}
          <div className="bg-white/80 p-4 rounded-2xl border border-papelKraft/50 space-y-3.5 shadow-sm">
            <h4 className="text-sm font-bold font-editorial text-acentoAzul lowercase border-b border-papelKraft/30 pb-2">
              visualização & métricas
            </h4>

            {/* TOGGLE 1: MOSTRAR TEMPORIZADOR */}
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-tintaCarvao lowercase block">
                  temporizador de sprint poético
                </span>
                <span className="text-[11px] text-tintaCarvao/70 lowercase block">
                  exibe a contagem regressiva de tempo no topo do editor.
                </span>
              </div>
              <button
                type="button"
                onClick={() => toggleSetting('showTimer')}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 border border-papelKraft/40 shrink-0 ${
                  settings.showTimer ? 'bg-acentoAzul' : 'bg-papelKraft/40'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform flex items-center justify-center ${
                    settings.showTimer ? 'translate-x-6' : 'translate-x-0'
                  }`}
                >
                  {settings.showTimer && <Check className="w-2.5 h-2.5 text-acentoAzul" />}
                </div>
              </button>
            </div>

            {/* TOGGLE 2: MOSTRAR CONTADOR DE PALAVRAS */}
            <div className="flex items-center justify-between gap-4 pt-2 border-t border-papelKraft/30">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-tintaCarvao lowercase block">
                  contador de palavras
                </span>
                <span className="text-[11px] text-tintaCarvao/70 lowercase block">
                  exibe a contagem de palavras em tempo real.
                </span>
              </div>
              <button
                type="button"
                onClick={() => toggleSetting('showWordCount')}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 border border-papelKraft/40 shrink-0 ${
                  settings.showWordCount ? 'bg-acentoAzul' : 'bg-papelKraft/40'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform flex items-center justify-center ${
                    settings.showWordCount ? 'translate-x-6' : 'translate-x-0'
                  }`}
                >
                  {settings.showWordCount && <Check className="w-2.5 h-2.5 text-acentoAzul" />}
                </div>
              </button>
            </div>

            {/* TOGGLE 3: MOSTRAR CHANCELA LITERÁRIA */}
            <div className="flex items-center justify-between gap-4 pt-2 border-t border-papelKraft/30">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-tintaCarvao lowercase block">
                  chancela literária
                </span>
                <span className="text-[11px] text-tintaCarvao/70 lowercase block">
                  exibe o marco de produção equivalente (Bashō, Drummond, Clarice).
                </span>
              </div>
              <button
                type="button"
                onClick={() => toggleSetting('showMilestones')}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 border border-papelKraft/40 shrink-0 ${
                  settings.showMilestones ? 'bg-acentoAzul' : 'bg-papelKraft/40'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform flex items-center justify-center ${
                    settings.showMilestones ? 'translate-x-6' : 'translate-x-0'
                  }`}
                >
                  {settings.showMilestones && <Check className="w-2.5 h-2.5 text-acentoAzul" />}
                </div>
              </button>
            </div>
          </div>

          {/* SEÇÃO 2: FORMATAÇÃO INTELIGENTE (REFERÊNCIA DA IMAGEM 1) */}
          <div className="bg-white/80 p-4 rounded-2xl border border-papelKraft/50 space-y-3.5 shadow-sm">
            <h4 className="text-sm font-bold font-editorial text-acentoAzul lowercase border-b border-papelKraft/30 pb-2">
              formatação inteligente
            </h4>

            {/* TOGGLE: ASPAS POÉTICAS */}
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-tintaCarvao lowercase block">
                  aspas poéticas curvas (“ ”)
                </span>
                <span className="text-[11px] text-tintaCarvao/70 lowercase block">
                  converte automaticamente aspas simples em aspas tipográficas.
                </span>
              </div>
              <button
                type="button"
                onClick={() => toggleSetting('smartQuotes')}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 border border-papelKraft/40 shrink-0 ${
                  settings.smartQuotes ? 'bg-acentoAzul' : 'bg-papelKraft/40'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform flex items-center justify-center ${
                    settings.smartQuotes ? 'translate-x-6' : 'translate-x-0'
                  }`}
                >
                  {settings.smartQuotes && <Check className="w-2.5 h-2.5 text-acentoAzul" />}
                </div>
              </button>
            </div>

            {/* TOGGLE: RETICÊNCIAS AUTOMÁTICAS */}
            <div className="flex items-center justify-between gap-4 pt-2 border-t border-papelKraft/30">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-tintaCarvao lowercase block">
                  reticências automáticas (…)
                </span>
                <span className="text-[11px] text-tintaCarvao/70 lowercase block">
                  transforma três pontos seguidos no caractere de reticências.
                </span>
              </div>
              <button
                type="button"
                onClick={() => toggleSetting('smartEllipses')}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 border border-papelKraft/40 shrink-0 ${
                  settings.smartEllipses ? 'bg-acentoAzul' : 'bg-papelKraft/40'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform flex items-center justify-center ${
                    settings.smartEllipses ? 'translate-x-6' : 'translate-x-0'
                  }`}
                >
                  {settings.smartEllipses && <Check className="w-2.5 h-2.5 text-acentoAzul" />}
                </div>
              </button>
            </div>

            {/* TOGGLE: ATALHOS MARKDOWN */}
            <div className="flex items-center justify-between gap-4 pt-2 border-t border-papelKraft/30">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-tintaCarvao lowercase block">
                  atalhos em markdown
                </span>
                <span className="text-[11px] text-tintaCarvao/70 lowercase block">
                  permite usar # para títulos e * para itálicos ao digitar.
                </span>
              </div>
              <button
                type="button"
                onClick={() => toggleSetting('markdownShortcuts')}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 border border-papelKraft/40 shrink-0 ${
                  settings.markdownShortcuts ? 'bg-acentoAzul' : 'bg-papelKraft/40'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform flex items-center justify-center ${
                    settings.markdownShortcuts ? 'translate-x-6' : 'translate-x-0'
                  }`}
                >
                  {settings.markdownShortcuts && <Check className="w-2.5 h-2.5 text-acentoAzul" />}
                </div>
              </button>
            </div>

            {/* TOGGLE: ESPAÇO DUPLO INSERE PONTO */}
            <div className="flex items-center justify-between gap-4 pt-2 border-t border-papelKraft/30">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-tintaCarvao lowercase block">
                  espaço duplo insere ponto
                </span>
                <span className="text-[11px] text-tintaCarvao/70 lowercase block">
                  toque duas vezes na barra de espaço para inserir ponto final.
                </span>
              </div>
              <button
                type="button"
                onClick={() => toggleSetting('doubleSpacePeriod')}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 border border-papelKraft/40 shrink-0 ${
                  settings.doubleSpacePeriod ? 'bg-acentoAzul' : 'bg-papelKraft/40'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform flex items-center justify-center ${
                    settings.doubleSpacePeriod ? 'translate-x-6' : 'translate-x-0'
                  }`}
                >
                  {settings.doubleSpacePeriod && <Check className="w-2.5 h-2.5 text-acentoAzul" />}
                </div>
              </button>
            </div>
          </div>

          {/* SEÇÃO 3: ZOOM DO EDITOR (REFERÊNCIA DA IMAGEM 2) */}
          <div className="bg-white/80 p-4 rounded-2xl border border-papelKraft/50 flex items-center justify-between shadow-sm">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-tintaCarvao lowercase block">
                zoom do editor
              </span>
              <span className="text-[11px] text-tintaCarvao/70 lowercase block">
                escala geral de visualização da folha de escrita.
              </span>
            </div>

            <select
              value={settings.zoomLevel}
              onChange={(e) => onUpdateSettings({ zoomLevel: Number(e.target.value) })}
              className="px-3 py-1.5 bg-white border border-papelKraft/50 rounded-xl text-xs font-bold text-acentoAzul focus:outline-none focus:border-acentoAzul transition-colors"
            >
              <option value={90}>90%</option>
              <option value={100}>100%</option>
              <option value={110}>110%</option>
              <option value={125}>125%</option>
            </select>
          </div>

        </div>

        {/* FOOTER DA MODAL */}
        <div className="px-6 py-3.5 border-t border-papelKraft/40 bg-bgPlataforma/60 flex items-center justify-between">
          <span className="text-[11px] text-tintaCarvao/60 lowercase">
            preferências salvas automaticamente
          </span>
          <button
            type="button"
            onClick={onClose}
            className="btn-pill-primary px-5 py-1.5 text-xs font-bold lowercase"
          >
            concluído
          </button>
        </div>

      </div>
    </div>
  );
}
