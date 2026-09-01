import { Settings, X, Check, Type, Eye, Sparkles, Sliders } from 'lucide-react';

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

// COMPONENTE REUTILIZÁVEL DE INTERRUPTOR / TOGGLE SWITCH ESTILO IOS DA MARCA
function ToggleSwitch({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  description?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5 border-b border-papelKraft/20 last:border-b-0">
      <div className="space-y-0.5 min-w-0 flex-1">
        <span className="text-xs sm:text-sm font-bold font-editorial text-tintaCarvao lowercase block">
          {label}
        </span>
        {description && (
          <span className="text-[11px] sm:text-xs text-tintaCarvao/70 lowercase block leading-relaxed">
            {description}
          </span>
        )}
      </div>

      {/* INTERRUPTOR TIPO SWITCH */}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none active:scale-95 ${
          checked ? 'bg-acentoAzul' : 'bg-papelKraft/40'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
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
    <div className="fixed inset-0 z-[1000000] bg-tintaCarvao/60 backdrop-blur-sm flex items-center justify-center p-0 sm:p-4 animate-fadeIn">
      
      {/* MODAL RESPONSIVA: TELA CHEIA EM MOBILE, MAIS AMARGA (MAX-W-3XL) EM DESKTOP */}
      <div className="bg-papelClaro w-screen h-screen min-h-screen sm:h-auto sm:min-h-0 sm:max-w-3xl sm:rounded-3xl border-0 sm:border border-papelKraft/60 shadow-kraft-lg overflow-hidden flex flex-col justify-between animate-fadeIn">
        
        {/* HEADER DA MODAL DE CONFIGURAÇÕES */}
        <div className="px-5 sm:px-8 py-4 border-b border-papelKraft/40 flex items-center justify-between bg-bgPlataforma/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-acentoAzul/10 rounded-xl border border-acentoAzul/20">
              <Settings className="w-5 h-5 text-acentoAzul" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-editorial text-acentoAzul lowercase">
                configurações do editor
              </h3>
              <span className="text-[11px] text-tintaCarvao/60 lowercase hidden sm:block">
                personalize sua experiência de escrita poética no solta o verbo
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-papelKraft/40 text-tintaCarvao/60 hover:text-tintaCarvao transition-colors border border-papelKraft/40 active:scale-95"
            title="fechar configurações"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CORPO DE OPÇÕES COM DESLOCAMENTO E DUAS COLUNAS EM DESKTOP */}
        <div className="p-5 sm:p-8 space-y-6 flex-1 overflow-y-auto max-h-[calc(100vh-130px)] sm:max-h-[75vh]">
          
          {/* SEÇÃO 1: TIPOGRAFIA DA FOLHA (EM GRID DE 2 COLUNAS NO DESKTOP) */}
          <div className="bg-white/80 p-5 rounded-2xl border border-papelKraft/50 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-papelKraft/30 pb-2.5">
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4 text-acentoAzul" />
                <h4 className="text-sm sm:text-base font-bold font-editorial text-acentoAzul lowercase">
                  tipo de letra (fonte da folha)
                </h4>
              </div>
              <span className="text-xs text-tintaCarvao/60 lowercase font-medium font-editorial">
                5 opções
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {FONT_OPTIONS.map((font) => (
                <button
                  key={font.id}
                  type="button"
                  onClick={() => onUpdateSettings({ fontFamily: font.id })}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 ${
                    settings.fontFamily === font.id
                      ? 'bg-white border-acentoAzul shadow-sm text-acentoAzul font-bold'
                      : 'bg-bgPlataforma/50 border-papelKraft/40 text-tintaCarvao/80 hover:bg-white'
                  }`}
                >
                  <div className="space-y-0.5 min-w-0">
                    <span className="text-xs sm:text-sm font-bold font-editorial lowercase block">
                      {font.name}
                    </span>
                    <span className="text-[11px] text-tintaCarvao/70 lowercase block truncate">
                      {font.description}
                    </span>
                  </div>

                  {settings.fontFamily === font.id && (
                    <div className="w-5 h-5 rounded-full bg-acentoAzul text-white flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* GRID DE DUAS COLUNAS NO DESKTOP PARA VISUALIZAÇÃO E FORMATAÇÃO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* SEÇÃO 2: VISUALIZAÇÃO & MÉTRICAS */}
            <div className="bg-white/80 p-5 rounded-2xl border border-papelKraft/50 space-y-3.5 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 border-b border-papelKraft/30 pb-2.5 mb-2">
                  <Eye className="w-4 h-4 text-acentoAzul" />
                  <h4 className="text-sm sm:text-base font-bold font-editorial text-acentoAzul lowercase">
                    visualização & métricas
                  </h4>
                </div>

                <ToggleSwitch
                  checked={settings.showTimer}
                  onChange={() => toggleSetting('showTimer')}
                  label="temporizador de sprint poético"
                  description="exibe a contagem regressiva de tempo no topo."
                />

                <ToggleSwitch
                  checked={settings.showWordCount}
                  onChange={() => toggleSetting('showWordCount')}
                  label="contador de palavras"
                  description="exibe a contagem de palavras em tempo real."
                />

                <ToggleSwitch
                  checked={settings.showMilestones}
                  onChange={() => toggleSetting('showMilestones')}
                  label="chancela literária poética"
                  description="exibe o marco equivalente (Bashō, Drummond, Clarice)."
                />
              </div>

              {/* SELETOR DE ZOOM EMBUTIDO NA COLUNA */}
              <div className="pt-3 border-t border-papelKraft/30 flex items-center justify-between">
                <span className="text-xs sm:text-sm font-bold font-editorial text-tintaCarvao lowercase">
                  zoom da folha
                </span>
                <select
                  value={settings.zoomLevel}
                  onChange={(e) => onUpdateSettings({ zoomLevel: Number(e.target.value) })}
                  className="px-3 py-1.5 bg-white border border-papelKraft/50 rounded-xl text-xs font-bold font-editorial text-acentoAzul focus:outline-none focus:border-acentoAzul transition-colors cursor-pointer"
                >
                  <option value={90}>90%</option>
                  <option value={100}>100%</option>
                  <option value={110}>110%</option>
                  <option value={125}>125%</option>
                </select>
              </div>
            </div>

            {/* SEÇÃO 3: FORMATAÇÃO INTELIGENTE */}
            <div className="bg-white/80 p-5 rounded-2xl border border-papelKraft/50 space-y-3.5 shadow-sm">
              <div className="flex items-center gap-2 border-b border-papelKraft/30 pb-2.5 mb-2">
                <Sparkles className="w-4 h-4 text-acentoAzul" />
                <h4 className="text-sm sm:text-base font-bold font-editorial text-acentoAzul lowercase">
                  formatação inteligente
                </h4>
              </div>

              <ToggleSwitch
                checked={settings.smartQuotes}
                onChange={() => toggleSetting('smartQuotes')}
                label="aspas poéticas curvas (“ ”)"
                description="converte automaticamente aspas simples em curvas."
              />

              <ToggleSwitch
                checked={settings.smartEllipses}
                onChange={() => toggleSetting('smartEllipses')}
                label="reticências automáticas (…)"
                description="transforma três pontos em caractere poético."
              />

              <ToggleSwitch
                checked={settings.markdownShortcuts}
                onChange={() => toggleSetting('markdownShortcuts')}
                label="atalhos em markdown"
                description="permite usar # para títulos e * para itálicos ao digitar."
              />

              <ToggleSwitch
                checked={settings.doubleSpacePeriod}
                onChange={() => toggleSetting('doubleSpacePeriod')}
                label="espaço duplo insere ponto"
                description="toque duas vezes na barra de espaço para inserir ponto."
              />
            </div>

          </div>

        </div>

        {/* FOOTER DA MODAL */}
        <div className="px-5 sm:px-8 py-4 border-t border-papelKraft/40 bg-bgPlataforma/80 flex items-center justify-between shrink-0">
          <span className="text-xs text-tintaCarvao/60 font-editorial lowercase">
            alterações salvas automaticamente
          </span>
          <button
            type="button"
            onClick={onClose}
            className="btn-pill-primary px-6 py-2 text-xs sm:text-sm font-bold lowercase shadow-sm"
          >
            concluído
          </button>
        </div>

      </div>
    </div>
  );
}
