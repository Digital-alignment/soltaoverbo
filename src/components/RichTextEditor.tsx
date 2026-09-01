import { useState, useRef, useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
  List,
  ListOrdered,
  ChevronUp,
  Check,
  Undo,
  Redo,
  Highlighter,
  Link as LinkIcon,
  Image as ImageIcon,
  ZoomIn,
} from 'lucide-react';
import type { EditorFontFamily } from './EditorSettingsModal';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  onSave?: () => void;
  placeholder?: string;
  flat?: boolean;
  zoomLevel?: number;
  onZoomChange?: (newZoom: number) => void;
  fontFamily?: EditorFontFamily;
}

const FORMAT_OPTIONS = [
  { value: 'p', label: 'parágrafo' },
  { value: 'h1', label: 'título 1' },
  { value: 'h2', label: 'título 2' },
  { value: 'h3', label: 'título 3' },
  { value: 'h4', label: 'título 4' },
  { value: 'blockquote', label: 'cita poética' },
];

const FONT_SIZES = ['12', '14', '16', '18', '20', '24', '28', '32'];
const ZOOM_LEVELS = [90, 100, 110, 125];

const FONT_FAMILY_MAP: Record<EditorFontFamily, string> = {
  editorial: '"Editorial Serif", Georgia, Garamond, serif',
  sans: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  garamond: 'Garamond, "Baskerville Old Face", "Hoefler Text", Merriweather, Georgia, serif',
  handwriting: '"Caveat", "Patrick Hand", "Comic Sans MS", cursive, sans-serif',
  palatino: '"Palatino Linotype", "Book Antiqua", Palatino, Lora, serif',
};

export default function RichTextEditor({
  value,
  onChange,
  onSave,
  placeholder,
  flat = false,
  zoomLevel = 100,
  onZoomChange,
  fontFamily = 'editorial',
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const formatMenuRef = useRef<HTMLDivElement>(null);
  const fontSizeMenuRef = useRef<HTMLDivElement>(null);
  const zoomMenuRef = useRef<HTMLDivElement>(null);

  const [fontSize, setFontSize] = useState('16');
  const [textColor, setTextColor] = useState('#2C2720');
  const [highlightColor, setHighlightColor] = useState('#F5E6A3');
  const [currentFormat, setCurrentFormat] = useState('p');

  const [showFormatMenu, setShowFormatMenu] = useState(false);
  const [showFontSizeMenu, setShowFontSizeMenu] = useState(false);
  const [showZoomMenu, setShowZoomMenu] = useState(false);

  useEffect(() => {
    if (editorRef.current && value && !editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value;
    }
  }, []);

  // Fechar menus ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formatMenuRef.current && !formatMenuRef.current.contains(event.target as Node)) {
        setShowFormatMenu(false);
      }
      if (fontSizeMenuRef.current && !fontSizeMenuRef.current.contains(event.target as Node)) {
        setShowFontSizeMenu(false);
      }
      if (zoomMenuRef.current && !zoomMenuRef.current.contains(event.target as Node)) {
        setShowZoomMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  // HANDLER DE ATALHOS DE TECLADO (CTRL+B, CTRL+I, CTRL+U, CTRL+S, CMD+B, ETC)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const modifier = isMac ? e.metaKey : e.ctrlKey;

    if (modifier) {
      const key = e.key.toLowerCase();

      if (key === 'b') {
        e.preventDefault();
        executeCommand('bold');
      } else if (key === 'i') {
        e.preventDefault();
        executeCommand('italic');
      } else if (key === 'u') {
        e.preventDefault();
        executeCommand('underline');
      } else if (key === 's') {
        e.preventDefault();
        if (onSave) {
          onSave();
        }
      }
    }
  };

  const executeCommand = (command: string, val?: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    try {
      document.execCommand(command, false, val);
    } catch (err) {
      console.warn('execCommand warning:', err);
    }
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  // SELEÇÃO ROBUSTA DE TIPO DE TEXTO
  const selectFormat = (format: string) => {
    setCurrentFormat(format);
    setShowFormatMenu(false);

    if (editorRef.current) {
      editorRef.current.focus();
    }

    const tagWithAngle = `<${format.toLowerCase()}>`;
    const tagUpper = format.toUpperCase();

    let success = false;
    try {
      success = document.execCommand('formatBlock', false, tagWithAngle);
    } catch {}

    if (!success) {
      try {
        success = document.execCommand('formatBlock', false, tagUpper);
      } catch {}
    }

    if (!success) {
      try {
        success = document.execCommand('formatBlock', false, format);
      } catch {}
    }

    if (!success && editorRef.current) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        let container: Node | null = range.commonAncestorContainer;
        if (container.nodeType === 3) {
          container = container.parentNode;
        }
        if (container && container !== editorRef.current && container.parentNode) {
          const newElem = document.createElement(format);
          newElem.innerHTML = (container as HTMLElement).innerHTML || container.textContent || '';
          container.parentNode.replaceChild(newElem, container);
        }
      }
    }

    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  // SELEÇÃO DE TAMANHO DE FONTE
  const selectFontSize = (size: string) => {
    setFontSize(size);
    setShowFontSizeMenu(false);
    executeCommand('fontSize', '7');
    const fontElements = document.getElementsByTagName('font');
    for (let i = 0; i < fontElements.length; i++) {
      if (fontElements[i].size === '7') {
        fontElements[i].removeAttribute('size');
        fontElements[i].style.fontSize = size + 'px';
      }
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setTextColor(color);
    executeCommand('foreColor', color);
  };

  // HIGHLIGHT DE TEXTO (MARCADOR)
  const handleHighlight = (color: string) => {
    setHighlightColor(color);
    executeCommand('hiliteColor', color);
  };

  // INSERÇÃO DE LINK
  const handleInsertLink = () => {
    const url = prompt('digite ou cole o endereço web (URL):');
    if (url) {
      const formattedUrl = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
      executeCommand('createLink', formattedUrl);
    }
  };

  // INSERÇÃO DE IMAGEM
  const handleInsertImage = () => {
    const url = prompt('digite o endereço da imagem (URL):');
    if (url) {
      executeCommand('insertImage', url);
    }
  };

  // Cálculo da escala de fonte baseada no Zoom (90%, 100%, 110%, 125%)
  const scaledFontSize = Math.round(Number(fontSize) * (zoomLevel / 100));

  return (
    <div className="relative min-h-[350px] flex flex-col justify-between">
      
      {/* ÁREA DE ESCRITA DE PAPEL LIMPA E TRANSPARENTE */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        className="p-4 sm:p-6 min-h-[300px] focus:outline-none text-tintaCarvao leading-relaxed text-base sm:text-lg bg-transparent pb-32 transition-all"
        style={{
          fontFamily: FONT_FAMILY_MAP[fontFamily] || FONT_FAMILY_MAP.editorial,
          fontSize: `${scaledFontSize}px`,
          lineHeight: '1.7',
          color: textColor,
        }}
        data-placeholder={placeholder}
      />

      {/* CONTAINER EXTERNO DA BARRA FLUTUANTE (90% LARGURA EM DESKTOP, COR #EDE6D4, TIPOGRAFIA EDITORIAL SERIF) */}
      <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-[100000] w-[92vw] md:w-[90vw] max-w-5xl overflow-visible">
        
        {/* MENU POPUP DE TIPO DE TEXTO */}
        {showFormatMenu && (
          <div
            ref={formatMenuRef}
            className="absolute bottom-full mb-3 left-2 sm:left-12 z-[100001] w-52 bg-[#EDE6D4] rounded-2xl border border-papelKraft/60 shadow-kraft-lg p-2 space-y-1 animate-fadeIn"
          >
            {FORMAT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => selectFormat(opt.value)}
                className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-editorial font-bold lowercase transition-all flex items-center justify-between ${
                  currentFormat === opt.value
                    ? 'bg-acentoAzul text-white shadow-sm font-extrabold'
                    : 'text-tintaCarvao hover:bg-white/80'
                }`}
              >
                <span className="font-editorial text-xs">{opt.label}</span>
                {currentFormat === opt.value && <Check className="w-4 h-4 text-white shrink-0" />}
              </button>
            ))}
          </div>
        )}

        {/* MENU POPUP DE TAMANHO DE FONTE (FONTE EDITORIAL SERIF) */}
        {showFontSizeMenu && (
          <div
            ref={fontSizeMenuRef}
            className="absolute bottom-full mb-3 right-16 sm:right-28 z-[100001] w-28 bg-[#EDE6D4] rounded-2xl border border-papelKraft/60 shadow-kraft-lg p-1.5 space-y-1 animate-fadeIn"
          >
            {FONT_SIZES.map((sz) => (
              <button
                key={sz}
                type="button"
                onClick={() => selectFontSize(sz)}
                className={`w-full text-center py-1.5 rounded-xl text-xs font-editorial font-bold transition-all flex items-center justify-between px-3 ${
                  fontSize === sz
                    ? 'bg-acentoAzul text-white font-bold shadow-sm'
                    : 'text-tintaCarvao hover:bg-white/80'
                }`}
              >
                <span className="font-editorial text-xs sm:text-sm">{sz}px</span>
                {fontSize === sz && <Check className="w-3.5 h-3.5 text-white shrink-0" />}
              </button>
            ))}
          </div>
        )}

        {/* MENU POPUP DE ZOOM (FONTE EDITORIAL SERIF) */}
        {showZoomMenu && (
          <div
            ref={zoomMenuRef}
            className="absolute bottom-full mb-3 right-2 sm:right-4 z-[100001] w-28 bg-[#EDE6D4] rounded-2xl border border-papelKraft/60 shadow-kraft-lg p-1.5 space-y-1 animate-fadeIn"
          >
            {ZOOM_LEVELS.map((zm) => (
              <button
                key={zm}
                type="button"
                onClick={() => {
                  if (onZoomChange) onZoomChange(zm);
                  setShowZoomMenu(false);
                }}
                className={`w-full text-center py-1.5 rounded-xl text-xs font-editorial font-bold transition-all flex items-center justify-between px-3 ${
                  zoomLevel === zm
                    ? 'bg-acentoAzul text-white font-bold shadow-sm'
                    : 'text-tintaCarvao hover:bg-white/80'
                }`}
              >
                <span className="font-editorial text-xs sm:text-sm">{zm}%</span>
                {zoomLevel === zm && <Check className="w-3.5 h-3.5 text-white shrink-0" />}
              </button>
            ))}
          </div>
        )}

        {/* BARRA FLUTUANTE COM COR DE FUNDO #EDE6D4 E REORGANIZADA DE ESQUERDA A DIREITA POR PRIORIDADE */}
        <div className="bg-[#EDE6D4] backdrop-blur-md border border-papelKraft/60 shadow-kraft-lg rounded-3xl p-2 sm:p-2.5 flex items-center justify-between sm:justify-center gap-1.5 sm:gap-2.5 overflow-x-auto custom-compact-scrollbar">
          
          {/* GRUPO 1: DESFAZER / REFAZER (AÇÕES MAIS USADAS) */}
          <div className="flex items-center gap-1 shrink-0">
            <div className="relative group">
              <button
                type="button"
                onClick={() => executeCommand('undo')}
                className="p-2 sm:p-1.5 bg-white/90 hover:bg-acentoAzul text-acentoAzul hover:text-white rounded-xl border border-papelKraft/40 transition-colors shadow-sm active:scale-95"
              >
                <Undo className="w-4 h-4" />
              </button>
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-tintaCarvao text-white text-[10px] font-editorial px-2 py-0.5 rounded-md whitespace-nowrap z-50 shadow-sm pointer-events-none lowercase">
                desfazer (ctrl+z)
              </div>
            </div>

            <div className="relative group">
              <button
                type="button"
                onClick={() => executeCommand('redo')}
                className="p-2 sm:p-1.5 bg-white/90 hover:bg-acentoAzul text-acentoAzul hover:text-white rounded-xl border border-papelKraft/40 transition-colors shadow-sm active:scale-95"
              >
                <Redo className="w-4 h-4" />
              </button>
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-tintaCarvao text-white text-[10px] font-editorial px-2 py-0.5 rounded-md whitespace-nowrap z-50 shadow-sm pointer-events-none lowercase">
                refazer (ctrl+y)
              </div>
            </div>
          </div>

          <div className="w-px h-5 bg-papelKraft/40 mx-0.5 shrink-0"></div>

          {/* GRUPO 2: ESTILO DE TEXTO (PARÁGRAFO, TÍTULOS 1-4, CITAÇÃO) */}
          <div className="relative group shrink-0">
            <button
              type="button"
              onClick={() => setShowFormatMenu(!showFormatMenu)}
              className="px-3 py-1.5 bg-white hover:bg-bgPlataforma border border-papelKraft/50 rounded-xl text-xs font-editorial font-bold text-acentoAzul flex items-center gap-1.5 shadow-sm transition-all lowercase active:scale-95"
            >
              <span className="font-editorial text-xs">{FORMAT_OPTIONS.find((o) => o.value === currentFormat)?.label || 'parágrafo'}</span>
              <ChevronUp className="w-3.5 h-3.5 text-acentoAzul shrink-0" />
            </button>
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-tintaCarvao text-white text-[10px] font-editorial px-2 py-0.5 rounded-md whitespace-nowrap z-50 shadow-sm pointer-events-none lowercase">
              tipo de texto
            </div>
          </div>

          <div className="w-px h-5 bg-papelKraft/40 mx-0.5 shrink-0"></div>

          {/* GRUPO 3: FORMATAÇÃO BÁSICA (NEGRITO, ITÁLICO, SUBLINHADO, TACHADO) */}
          <div className="flex items-center gap-1 shrink-0">
            <div className="relative group">
              <button
                type="button"
                onClick={() => executeCommand('bold')}
                className="p-2 sm:p-1.5 bg-white/90 hover:bg-acentoAzul text-acentoAzul hover:text-white rounded-xl border border-papelKraft/40 transition-colors shadow-sm font-bold active:scale-95"
              >
                <Bold className="w-4 h-4" />
              </button>
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-tintaCarvao text-white text-[10px] font-editorial px-2 py-0.5 rounded-md whitespace-nowrap z-50 shadow-sm pointer-events-none lowercase">
                negrito (ctrl+b)
              </div>
            </div>

            <div className="relative group">
              <button
                type="button"
                onClick={() => executeCommand('italic')}
                className="p-2 sm:p-1.5 bg-white/90 hover:bg-acentoAzul text-acentoAzul hover:text-white rounded-xl border border-papelKraft/40 transition-colors shadow-sm italic active:scale-95"
              >
                <Italic className="w-4 h-4" />
              </button>
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-tintaCarvao text-white text-[10px] font-editorial px-2 py-0.5 rounded-md whitespace-nowrap z-50 shadow-sm pointer-events-none lowercase">
                itálico (ctrl+i)
              </div>
            </div>

            <div className="relative group">
              <button
                type="button"
                onClick={() => executeCommand('underline')}
                className="p-2 sm:p-1.5 bg-white/90 hover:bg-acentoAzul text-acentoAzul hover:text-white rounded-xl border border-papelKraft/40 transition-colors shadow-sm active:scale-95"
              >
                <Underline className="w-4 h-4" />
              </button>
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-tintaCarvao text-white text-[10px] font-editorial px-2 py-0.5 rounded-md whitespace-nowrap z-50 shadow-sm pointer-events-none lowercase">
                sublinhado (ctrl+u)
              </div>
            </div>

            <div className="relative group">
              <button
                type="button"
                onClick={() => executeCommand('strikeThrough')}
                className="p-2 sm:p-1.5 bg-white/90 hover:bg-acentoAzul text-acentoAzul hover:text-white rounded-xl border border-papelKraft/40 transition-colors shadow-sm active:scale-95"
              >
                <Strikethrough className="w-4 h-4" />
              </button>
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-tintaCarvao text-white text-[10px] font-editorial px-2 py-0.5 rounded-md whitespace-nowrap z-50 shadow-sm pointer-events-none lowercase">
                tachado
              </div>
            </div>
          </div>

          <div className="w-px h-5 bg-papelKraft/40 mx-0.5 shrink-0"></div>

          {/* GRUPO 4: DESTAQUE & COR (HIGHLIGHT & TEXT COLOR) */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* DESTACADOR DE TEXTO (MARCADOR) */}
            <div className="relative group">
              <button
                type="button"
                onClick={() => handleHighlight(highlightColor)}
                className="p-2 sm:p-1.5 bg-white/90 hover:bg-acentoTerracota text-acentoTerracota hover:text-white rounded-xl border border-papelKraft/40 transition-colors shadow-sm active:scale-95"
              >
                <Highlighter className="w-4 h-4" />
              </button>
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-tintaCarvao text-white text-[10px] font-editorial px-2 py-0.5 rounded-md whitespace-nowrap z-50 shadow-sm pointer-events-none lowercase">
                destacar texto
              </div>
            </div>

            {/* SELETOR DE COR DE TEXTO */}
            <div className="relative group">
              <label className="flex items-center gap-1 cursor-pointer text-xs font-editorial font-bold text-tintaCarvao/80 lowercase bg-white/90 px-2 py-1 rounded-xl border border-papelKraft/40 shadow-sm shrink-0">
                <span className="hidden sm:inline font-editorial">cor:</span>
                <input
                  type="color"
                  value={textColor}
                  onChange={handleColorChange}
                  className="w-4 h-4 rounded-md cursor-pointer border-none p-0 bg-transparent"
                />
              </label>
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-tintaCarvao text-white text-[10px] font-editorial px-2 py-0.5 rounded-md whitespace-nowrap z-50 shadow-sm pointer-events-none lowercase">
                cor da fonte
              </div>
            </div>
          </div>

          <div className="w-px h-5 bg-papelKraft/40 mx-0.5 shrink-0"></div>

          {/* GRUPO 5: INSERÇÃO DE MÍDIA (LINK & IMAGEM) */}
          <div className="flex items-center gap-1 shrink-0">
            <div className="relative group">
              <button
                type="button"
                onClick={handleInsertLink}
                className="p-2 sm:p-1.5 bg-white/90 hover:bg-acentoAzul text-acentoAzul hover:text-white rounded-xl border border-papelKraft/40 transition-colors shadow-sm active:scale-95"
              >
                <LinkIcon className="w-4 h-4" />
              </button>
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-tintaCarvao text-white text-[10px] font-editorial px-2 py-0.5 rounded-md whitespace-nowrap z-50 shadow-sm pointer-events-none lowercase">
                inserir link (url)
              </div>
            </div>

            <div className="relative group">
              <button
                type="button"
                onClick={handleInsertImage}
                className="p-2 sm:p-1.5 bg-white/90 hover:bg-acentoAzul text-acentoAzul hover:text-white rounded-xl border border-papelKraft/40 transition-colors shadow-sm active:scale-95"
              >
                <ImageIcon className="w-4 h-4" />
              </button>
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-tintaCarvao text-white text-[10px] font-editorial px-2 py-0.5 rounded-md whitespace-nowrap z-50 shadow-sm pointer-events-none lowercase">
                inserir imagem (url)
              </div>
            </div>
          </div>

          <div className="w-px h-5 bg-papelKraft/40 mx-0.5 shrink-0"></div>

          {/* GRUPO 6: ESTRUTURA (CITAÇÃO, LISTAS, ALINHAMENTO) */}
          <div className="flex items-center gap-1 shrink-0">
            <div className="relative group">
              <button
                type="button"
                onClick={() => selectFormat('blockquote')}
                className="p-2 sm:p-1.5 bg-white/90 hover:bg-acentoAzul text-acentoAzul hover:text-white rounded-xl border border-papelKraft/40 transition-colors shadow-sm active:scale-95"
              >
                <Quote className="w-4 h-4" />
              </button>
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-tintaCarvao text-white text-[10px] font-editorial px-2 py-0.5 rounded-md whitespace-nowrap z-50 shadow-sm pointer-events-none lowercase">
                citação poética
              </div>
            </div>

            <div className="relative group">
              <button
                type="button"
                onClick={() => executeCommand('insertUnorderedList')}
                className="p-2 sm:p-1.5 bg-white/90 hover:bg-acentoAzul text-acentoAzul hover:text-white rounded-xl border border-papelKraft/40 transition-colors shadow-sm active:scale-95"
              >
                <List className="w-4 h-4" />
              </button>
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-tintaCarvao text-white text-[10px] font-editorial px-2 py-0.5 rounded-md whitespace-nowrap z-50 shadow-sm pointer-events-none lowercase">
                lista com marcadores
              </div>
            </div>

            <div className="relative group">
              <button
                type="button"
                onClick={() => executeCommand('insertOrderedList')}
                className="p-2 sm:p-1.5 bg-white/90 hover:bg-acentoAzul text-acentoAzul hover:text-white rounded-xl border border-papelKraft/40 transition-colors shadow-sm active:scale-95"
              >
                <ListOrdered className="w-4 h-4" />
              </button>
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-tintaCarvao text-white text-[10px] font-editorial px-2 py-0.5 rounded-md whitespace-nowrap z-50 shadow-sm pointer-events-none lowercase">
                lista numerada
              </div>
            </div>

            <div className="w-px h-5 bg-papelKraft/40 mx-0.5 shrink-0"></div>

            <div className="relative group">
              <button
                type="button"
                onClick={() => executeCommand('justifyLeft')}
                className="p-2 sm:p-1.5 bg-white/90 hover:bg-acentoAzul text-acentoAzul hover:text-white rounded-xl border border-papelKraft/40 transition-colors shadow-sm active:scale-95"
              >
                <AlignLeft className="w-4 h-4" />
              </button>
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-tintaCarvao text-white text-[10px] font-editorial px-2 py-0.5 rounded-md whitespace-nowrap z-50 shadow-sm pointer-events-none lowercase">
                alinhar à esquerda
              </div>
            </div>

            <div className="relative group">
              <button
                type="button"
                onClick={() => executeCommand('justifyCenter')}
                className="p-2 sm:p-1.5 bg-white/90 hover:bg-acentoAzul text-acentoAzul hover:text-white rounded-xl border border-papelKraft/40 transition-colors shadow-sm active:scale-95"
              >
                <AlignCenter className="w-4 h-4" />
              </button>
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-tintaCarvao text-white text-[10px] font-editorial px-2 py-0.5 rounded-md whitespace-nowrap z-50 shadow-sm pointer-events-none lowercase">
                centralizar
              </div>
            </div>

            <div className="relative group">
              <button
                type="button"
                onClick={() => executeCommand('justifyRight')}
                className="p-2 sm:p-1.5 bg-white/90 hover:bg-acentoAzul text-acentoAzul hover:text-white rounded-xl border border-papelKraft/40 transition-colors shadow-sm active:scale-95"
              >
                <AlignRight className="w-4 h-4" />
              </button>
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-tintaCarvao text-white text-[10px] font-editorial px-2 py-0.5 rounded-md whitespace-nowrap z-50 shadow-sm pointer-events-none lowercase">
                alinhar à direita
              </div>
            </div>
          </div>

          <div className="w-px h-5 bg-papelKraft/40 mx-0.5 shrink-0"></div>

          {/* GRUPO 7: TAMANHO DE FONTE & ZOOM (TIPOGRAFIA EDITORIAL SERIF) */}
          <div className="flex items-center gap-1.5 shrink-0">
            
            {/* TAMANHO DE FONTE */}
            <div className="relative group shrink-0" ref={fontSizeMenuRef}>
              <button
                type="button"
                onClick={() => setShowFontSizeMenu(!showFontSizeMenu)}
                className="px-2.5 py-1.5 bg-white hover:bg-bgPlataforma border border-papelKraft/50 rounded-xl text-xs font-editorial font-bold text-acentoAzul flex items-center gap-1 shadow-sm transition-all active:scale-95"
              >
                <Type className="w-3.5 h-3.5 text-acentoAzul shrink-0" />
                <span className="font-editorial text-xs sm:text-sm font-bold">{fontSize}px</span>
                <ChevronUp className="w-3 h-3 text-acentoAzul shrink-0" />
              </button>
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-tintaCarvao text-white text-[10px] font-editorial px-2 py-0.5 rounded-md whitespace-nowrap z-50 shadow-sm pointer-events-none lowercase">
                tamanho da fonte
              </div>
            </div>

            {/* SELETOR DE ZOOM */}
            <div className="relative group shrink-0" ref={zoomMenuRef}>
              <button
                type="button"
                onClick={() => setShowZoomMenu(!showZoomMenu)}
                className="px-2.5 py-1.5 bg-white hover:bg-bgPlataforma border border-papelKraft/50 rounded-xl text-xs font-editorial font-bold text-acentoAzul flex items-center gap-1 shadow-sm transition-all active:scale-95"
              >
                <ZoomIn className="w-3.5 h-3.5 text-acentoAzul shrink-0" />
                <span className="font-editorial text-xs sm:text-sm font-bold">{zoomLevel}%</span>
                <ChevronUp className="w-3 h-3 text-acentoAzul shrink-0" />
              </button>
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-tintaCarvao text-white text-[10px] font-editorial px-2 py-0.5 rounded-md whitespace-nowrap z-50 shadow-sm pointer-events-none lowercase">
                zoom da folha
              </div>
            </div>

          </div>

        </div>

      </div>

      <style>{`
        /* Barra de rolagem compacta e elegante para dispositivos móveis */
        .custom-compact-scrollbar::-webkit-scrollbar {
          height: 4px;
        }
        .custom-compact-scrollbar::-webkit-scrollbar-track {
          background: rgba(190, 197, 64, 0.15);
          border-radius: 9999px;
        }
        .custom-compact-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(20, 13, 130, 0.4);
          border-radius: 9999px;
        }
        .custom-compact-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(20, 13, 130, 0.8);
        }

        [contenteditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #A39682;
          pointer-events: none;
          font-style: italic;
        }
        [contenteditable] h1 {
          font-size: 2em;
          font-weight: bold;
          color: #140D82;
          margin: 0.67em 0;
        }
        [contenteditable] h2 {
          font-size: 1.5em;
          font-weight: bold;
          color: #140D82;
          margin: 0.75em 0;
        }
        [contenteditable] h3 {
          font-size: 1.17em;
          font-weight: bold;
          color: #140D82;
          margin: 0.83em 0;
        }
        [contenteditable] h4 {
          font-size: 1em;
          font-weight: bold;
          color: #140D82;
          margin: 1em 0;
        }
        [contenteditable] blockquote {
          border-left: 3px solid #FD5E32;
          padding-left: 12px;
          margin: 1em 0;
          color: #140D82;
          font-style: italic;
        }
        [contenteditable] ul {
          list-style-type: disc;
          margin-left: 1.5em;
          margin: 1em 0;
        }
        [contenteditable] ol {
          list-style-type: decimal;
          margin-left: 1.5em;
          margin: 1em 0;
        }
        [contenteditable] li {
          margin: 0.5em 0;
        }
        [contenteditable] p {
          margin: 0.5em 0;
        }
      `}</style>
    </div>
  );
}
