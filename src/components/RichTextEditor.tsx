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
} from 'lucide-react';
import type { EditorFontFamily } from './EditorSettingsModal';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  flat?: boolean;
  zoomLevel?: number;
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
  placeholder,
  flat = false,
  zoomLevel = 100,
  fontFamily = 'editorial',
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const formatMenuRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState('16');
  const [textColor, setTextColor] = useState('#2C2720');
  const [currentFormat, setCurrentFormat] = useState('p');
  const [showFormatMenu, setShowFormatMenu] = useState(false);

  useEffect(() => {
    if (editorRef.current && value && !editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value;
    }
  }, []);

  // Fechar menu de formatos ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formatMenuRef.current && !formatMenuRef.current.contains(event.target as Node)) {
        setShowFormatMenu(false);
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

  // SELEÇÃO ROBUSTA DE TIPO DE TEXTO (PARÁGRAFO, TÍTULOS H1-H4, CITAÇÃO)
  const selectFormat = (format: string) => {
    setCurrentFormat(format);
    setShowFormatMenu(false);

    if (editorRef.current) {
      editorRef.current.focus();
    }

    const tagWithAngle = `<${format.toLowerCase()}>`;
    const tagUpper = format.toUpperCase();

    let success = false;

    // 1. Tentar sintaxe com parênteses angulares <h1...>, <h2>... (Padrão moderno WebKit/Blink)
    try {
      success = document.execCommand('formatBlock', false, tagWithAngle);
    } catch {}

    // 2. Tentar sintaxe maiúscula H1, H2, BLOCKQUOTE
    if (!success) {
      try {
        success = document.execCommand('formatBlock', false, tagUpper);
      } catch {}
    }

    // 3. Tentar sintaxe simples h1, h2, blockquote
    if (!success) {
      try {
        success = document.execCommand('formatBlock', false, format);
      } catch {}
    }

    // 4. Fallback direto no DOM caso a seleção do execCommand não aplique
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

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const size = e.target.value;
    setFontSize(size);
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

  // Cálculo da escala de fonte baseada no Zoom (90%, 100%, 110%, 125%)
  const scaledFontSize = Math.round(Number(fontSize) * (zoomLevel / 100));

  return (
    <div className="relative min-h-[350px] flex flex-col justify-between">
      
      {/* ÁREA DE ESCRITA DE PAPEL LIMPA E TRANSPARENTE COM FONTE E ZOOM APLICADOS */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="p-4 sm:p-6 min-h-[300px] focus:outline-none text-tintaCarvao leading-relaxed text-base sm:text-lg bg-transparent pb-28 transition-all"
        style={{
          fontFamily: FONT_FAMILY_MAP[fontFamily] || FONT_FAMILY_MAP.editorial,
          fontSize: `${scaledFontSize}px`,
          lineHeight: '1.7',
          color: textColor,
        }}
        data-placeholder={placeholder}
      />

      {/* BARRA FLUTUANTE DE FERRAMENTAS NO BOTTOM DA PÁGINA (DOCK BOTTOM BAR DA REFERÊNCIA) - RESPONSIVA EM MOBILE */}
      <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-[100000] bg-papelClaro/95 backdrop-blur-md border border-papelKraft/60 shadow-kraft-lg rounded-3xl p-1.5 sm:p-2.5 flex items-center gap-1 sm:gap-2 max-w-[95vw] sm:max-w-fit overflow-x-auto no-scrollbar">
        
        {/* DESFAZER / REFAZER */}
        <button
          type="button"
          onClick={() => executeCommand('undo')}
          className="p-2 sm:p-1.5 bg-white/90 hover:bg-acentoAzul text-acentoAzul hover:text-white rounded-xl border border-papelKraft/40 transition-colors shadow-sm shrink-0 active:scale-95"
          title="desfazer"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('redo')}
          className="p-2 sm:p-1.5 bg-white/90 hover:bg-acentoAzul text-acentoAzul hover:text-white rounded-xl border border-papelKraft/40 transition-colors shadow-sm shrink-0 active:scale-95"
          title="refazer"
        >
          <Redo className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-papelKraft/40 mx-0.5 shrink-0"></div>

        {/* MENU POPUP EM BOTÃO NO BOTTOM (ABRE PARA CIMA NA BARRA FLUTUANTE DE BAIXO) */}
        <div className="relative shrink-0" ref={formatMenuRef}>
          <button
            type="button"
            onClick={() => setShowFormatMenu(!showFormatMenu)}
            className="px-2.5 sm:px-3 py-1.5 bg-white hover:bg-bgPlataforma border border-papelKraft/50 rounded-xl text-xs font-bold text-acentoAzul flex items-center gap-1 sm:gap-1.5 shadow-sm transition-all lowercase active:scale-95"
            title="selecionar tipo de texto"
          >
            <span>{FORMAT_OPTIONS.find((o) => o.value === currentFormat)?.label || 'parágrafo'}</span>
            <ChevronUp className="w-3.5 h-3.5 text-acentoAzul shrink-0" />
          </button>

          {showFormatMenu && (
            <div className="absolute bottom-full left-0 mb-2 z-50 w-44 sm:w-48 bg-papelClaro rounded-2xl border border-papelKraft/60 shadow-kraft-lg p-1.5 space-y-1 animate-fadeIn">
              {FORMAT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => selectFormat(opt.value)}
                  className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold lowercase transition-colors flex items-center justify-between ${
                    currentFormat === opt.value
                      ? 'bg-acentoAzul text-white shadow-sm'
                      : 'text-tintaCarvao hover:bg-bgPlataforma'
                  }`}
                >
                  <span>{opt.label}</span>
                  {currentFormat === opt.value && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="w-px h-5 bg-papelKraft/40 mx-0.5 shrink-0"></div>

        {/* FORMATAÇÃO DE TEXTO: NEGRITO, ITÁLICO, TACHADO, SUBLINHADO, CITAÇÃO */}
        <button
          type="button"
          onClick={() => executeCommand('bold')}
          className="p-2 sm:p-1.5 bg-white/90 hover:bg-acentoAzul text-acentoAzul hover:text-white rounded-xl border border-papelKraft/40 transition-colors shadow-sm font-bold shrink-0 active:scale-95"
          title="negrito"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('italic')}
          className="p-2 sm:p-1.5 bg-white/90 hover:bg-acentoAzul text-acentoAzul hover:text-white rounded-xl border border-papelKraft/40 transition-colors shadow-sm italic shrink-0 active:scale-95"
          title="itálico"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('strikeThrough')}
          className="p-2 sm:p-1.5 bg-white/90 hover:bg-acentoAzul text-acentoAzul hover:text-white rounded-xl border border-papelKraft/40 transition-colors shadow-sm shrink-0 active:scale-95"
          title="tachado"
        >
          <Strikethrough className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('underline')}
          className="p-2 sm:p-1.5 bg-white/90 hover:bg-acentoAzul text-acentoAzul hover:text-white rounded-xl border border-papelKraft/40 transition-colors shadow-sm shrink-0 active:scale-95"
          title="sublinhado"
        >
          <Underline className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => selectFormat('blockquote')}
          className="p-2 sm:p-1.5 bg-white/90 hover:bg-acentoAzul text-acentoAzul hover:text-white rounded-xl border border-papelKraft/40 transition-colors shadow-sm shrink-0 active:scale-95"
          title="citação poética"
        >
          <Quote className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-papelKraft/40 mx-0.5 shrink-0"></div>

        {/* LISTAS E ALINHAMENTO */}
        <button
          type="button"
          onClick={() => executeCommand('insertUnorderedList')}
          className="p-2 sm:p-1.5 bg-white/90 hover:bg-acentoAzul text-acentoAzul hover:text-white rounded-xl border border-papelKraft/40 transition-colors shadow-sm shrink-0 active:scale-95"
          title="lista com marcadores"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('insertOrderedList')}
          className="p-2 sm:p-1.5 bg-white/90 hover:bg-acentoAzul text-acentoAzul hover:text-white rounded-xl border border-papelKraft/40 transition-colors shadow-sm shrink-0 active:scale-95"
          title="lista numerada"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-papelKraft/40 mx-0.5 shrink-0"></div>

        <button
          type="button"
          onClick={() => executeCommand('justifyLeft')}
          className="p-2 sm:p-1.5 bg-white/90 hover:bg-acentoAzul text-acentoAzul hover:text-white rounded-xl border border-papelKraft/40 transition-colors shadow-sm shrink-0 active:scale-95"
          title="alinhar à esquerda"
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('justifyCenter')}
          className="p-2 sm:p-1.5 bg-white/90 hover:bg-acentoAzul text-acentoAzul hover:text-white rounded-xl border border-papelKraft/40 transition-colors shadow-sm shrink-0 active:scale-95"
          title="centralizar"
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('justifyRight')}
          className="p-2 sm:p-1.5 bg-white/90 hover:bg-acentoAzul text-acentoAzul hover:text-white rounded-xl border border-papelKraft/40 transition-colors shadow-sm shrink-0 active:scale-95"
          title="alinhar à direita"
        >
          <AlignRight className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-papelKraft/40 mx-0.5 shrink-0"></div>

        {/* TAMANHO DE FONTE E COR */}
        <div className="flex items-center space-x-1 shrink-0">
          <Type className="w-4 h-4 text-acentoAzul shrink-0" />
          <select
            value={fontSize}
            onChange={handleFontSizeChange}
            className="px-2 py-1 bg-white/90 border border-papelKraft/40 rounded-xl text-xs font-bold text-acentoAzul focus:outline-none focus:border-acentoAzul transition-colors cursor-pointer"
          >
            <option value="12">12</option>
            <option value="14">14</option>
            <option value="16">16</option>
            <option value="18">18</option>
            <option value="20">20</option>
            <option value="24">24</option>
            <option value="28">28</option>
            <option value="32">32</option>
          </select>
        </div>

        <div className="flex items-center space-x-1.5 pl-1 shrink-0">
          <label className="flex items-center space-x-1.5 cursor-pointer text-xs font-semibold text-tintaCarvao/80 lowercase">
            <span className="hidden sm:inline">cor:</span>
            <input
              type="color"
              value={textColor}
              onChange={handleColorChange}
              className="w-6 h-6 rounded-lg cursor-pointer border border-papelKraft/40 p-0.5 bg-white shadow-sm"
            />
          </label>
        </div>

      </div>

      <style>{`
        /* Esconder barra de rolagem mas manter scroll funcional em mobile */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
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
