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
  onSave?: () => void;
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

const FONT_SIZES = ['12', '14', '16', '18', '20', '24', '28', '32'];

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
  fontFamily = 'editorial',
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const formatMenuRef = useRef<HTMLDivElement>(null);
  const fontSizeMenuRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState('16');
  const [textColor, setTextColor] = useState('#2C2720');
  const [currentFormat, setCurrentFormat] = useState('p');
  const [showFormatMenu, setShowFormatMenu] = useState(false);
  const [showFontSizeMenu, setShowFontSizeMenu] = useState(false);

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

      // Ctrl+B / Cmd+B -> Negrito
      if (key === 'b') {
        e.preventDefault();
        executeCommand('bold');
      }
      // Ctrl+I / Cmd+I -> Itálico
      else if (key === 'i') {
        e.preventDefault();
        executeCommand('italic');
      }
      // Ctrl+U / Cmd+U -> Sublinhado
      else if (key === 'u') {
        e.preventDefault();
        executeCommand('underline');
      }
      // Ctrl+S / Cmd+S -> Salvar texto
      else if (key === 's') {
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

  // SELEÇÃO DE TAMANHO DE FONTE COM POPUP PERSONALIZADO ARREDONDADO
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

  // Cálculo da escala de fonte baseada no Zoom (90%, 100%, 110%, 125%)
  const scaledFontSize = Math.round(Number(fontSize) * (zoomLevel / 100));

  return (
    <div className="relative min-h-[350px] flex flex-col justify-between">
      
      {/* ÁREA DE ESCRITA DE PAPEL LIMPA E TRANSPARENTE COM SUPORTE A ATALHOS DE TECLADO */}
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

      {/* CONTAINER EXTERNO DA BARRA FLUTUANTE (90% LARGURA EM ESCRITÓRIO, OVERFLOW-VISIBLE PARA OS POPUPS) */}
      <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-[100000] w-[92vw] md:w-[90vw] max-w-5xl overflow-visible">
        
        {/* MENU POPUP DE TIPO DE TEXTO (DESPLEGADO ACIMA DO BOTÃO SEM CORTE) */}
        {showFormatMenu && (
          <div
            ref={formatMenuRef}
            className="absolute bottom-full mb-3 left-2 sm:left-16 z-[100001] w-52 bg-papelClaro rounded-2xl border border-papelKraft/60 shadow-kraft-lg p-2 space-y-1 animate-fadeIn"
          >
            {FORMAT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => selectFormat(opt.value)}
                className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold lowercase transition-all flex items-center justify-between ${
                  currentFormat === opt.value
                    ? 'bg-acentoAzul text-white shadow-sm font-extrabold'
                    : 'text-tintaCarvao hover:bg-bgPlataforma font-semibold'
                }`}
              >
                <span>{opt.label}</span>
                {currentFormat === opt.value && <Check className="w-4 h-4 text-white shrink-0" />}
              </button>
            ))}
          </div>
        )}

        {/* MENU POPUP DE TAMANHO DE FONTE (ARREDONDADO E ELEGANTE) */}
        {showFontSizeMenu && (
          <div
            ref={fontSizeMenuRef}
            className="absolute bottom-full mb-3 right-4 sm:right-16 z-[100001] w-28 bg-papelClaro rounded-2xl border border-papelKraft/60 shadow-kraft-lg p-1.5 space-y-1 animate-fadeIn"
          >
            {FONT_SIZES.map((sz) => (
              <button
                key={sz}
                type="button"
                onClick={() => selectFontSize(sz)}
                className={`w-full text-center py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between px-3 ${
                  fontSize === sz
                    ? 'bg-acentoAzul text-white font-bold shadow-sm'
                    : 'text-tintaCarvao hover:bg-bgPlataforma'
                }`}
              >
                <span className="font-gesto text-sm">{sz}px</span>
                {fontSize === sz && <Check className="w-3.5 h-3.5 text-white shrink-0" />}
              </button>
            ))}
          </div>
        )}

        {/* BARRA FLUTUANTE DE FERRAMENTAS COM 90% DE LARGURA EM DESKTOP E SCROLL COMPACTO EM MOBILE */}
        <div className="bg-papelClaro/95 backdrop-blur-md border border-papelKraft/60 shadow-kraft-lg rounded-3xl p-2 sm:p-3 flex items-center justify-between sm:justify-center gap-1.5 sm:gap-3 overflow-x-auto custom-compact-scrollbar">
          
          {/* GRUPO 1: DESFAZER / REFAZER */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => executeCommand('undo')}
              className="p-2 sm:p-1.5 bg-white/90 hover:bg-acentoAzul text-acentoAzul hover:text-white rounded-xl border border-papelKraft/40 transition-colors shadow-sm active:scale-95"
              title="desfazer (ctrl+z)"
            >
              <Undo className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('redo')}
              className="p-2 sm:p-1.5 bg-white/90 hover:bg-acentoAzul text-acentoAzul hover:text-white rounded-xl border border-papelKraft/40 transition-colors shadow-sm active:scale-95"
              title="refazer (ctrl+y)"
            >
              <Redo className="w-4 h-4" />
            </button>
          </div>

          <div className="w-px h-5 bg-papelKraft/40 mx-0.5 shrink-0"></div>

          {/* GRUPO 2: BOTÃO DISPARADOR DO MENU POPUP DE TIPO DE TEXTO */}
          <div className="shrink-0">
            <button
              type="button"
              onClick={() => setShowFormatMenu(!showFormatMenu)}
              className="px-3 py-1.5 bg-white hover:bg-bgPlataforma border border-papelKraft/50 rounded-xl text-xs font-bold text-acentoAzul flex items-center gap-1.5 shadow-sm transition-all lowercase active:scale-95"
              title="selecionar tipo de texto"
            >
              <span>{FORMAT_OPTIONS.find((o) => o.value === currentFormat)?.label || 'parágrafo'}</span>
              <ChevronUp className="w-3.5 h-3.5 text-acentoAzul shrink-0" />
            </button>
          </div>

          <div className="w-px h-5 bg-papelKraft/40 mx-0.5 shrink-0"></div>

          {/* GRUPO 3: FORMATAÇÃO DE TEXTO (NEGRITO, ITÁLICO, TACHADO, SUBLINHADO, CITAÇÃO) */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => executeCommand('bold')}
              className="p-2 sm:p-1.5 bg-white/90 hover:bg-acentoAzul text-acentoAzul hover:text-white rounded-xl border border-papelKraft/40 transition-colors shadow-sm font-bold active:scale-95"
              title="negrito (ctrl+b)"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('italic')}
              className="p-2 sm:p-1.5 bg-white/90 hover:bg-acentoAzul text-acentoAzul hover:text-white rounded-xl border border-papelKraft/40 transition-colors shadow-sm italic active:scale-95"
              title="itálico (ctrl+i)"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('strikeThrough')}
              className="p-2 sm:p-1.5 bg-white/90 hover:bg-acentoAzul text-acentoAzul hover:text-white rounded-xl border border-papelKraft/40 transition-colors shadow-sm active:scale-95"
              title="tachado"
            >
              <Strikethrough className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('underline')}
              className="p-2 sm:p-1.5 bg-white/90 hover:bg-acentoAzul text-acentoAzul hover:text-white rounded-xl border border-papelKraft/40 transition-colors shadow-sm active:scale-95"
              title="sublinhado (ctrl+u)"
            >
              <Underline className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => selectFormat('blockquote')}
              className="p-2 sm:p-1.5 bg-white/90 hover:bg-acentoAzul text-acentoAzul hover:text-white rounded-xl border border-papelKraft/40 transition-colors shadow-sm active:scale-95"
              title="citação poética"
            >
              <Quote className="w-4 h-4" />
            </button>
          </div>

          <div className="w-px h-5 bg-papelKraft/40 mx-0.5 shrink-0"></div>

          {/* GRUPO 4: LISTAS E ALINHAMENTO */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => executeCommand('insertUnorderedList')}
              className="p-2 sm:p-1.5 bg-white/90 hover:bg-acentoAzul text-acentoAzul hover:text-white rounded-xl border border-papelKraft/40 transition-colors shadow-sm active:scale-95"
              title="lista com marcadores"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('insertOrderedList')}
              className="p-2 sm:p-1.5 bg-white/90 hover:bg-acentoAzul text-acentoAzul hover:text-white rounded-xl border border-papelKraft/40 transition-colors shadow-sm active:scale-95"
              title="lista numerada"
            >
              <ListOrdered className="w-4 h-4" />
            </button>

            <div className="w-px h-5 bg-papelKraft/40 mx-0.5 shrink-0"></div>

            <button
              type="button"
              onClick={() => executeCommand('justifyLeft')}
              className="p-2 sm:p-1.5 bg-white/90 hover:bg-acentoAzul text-acentoAzul hover:text-white rounded-xl border border-papelKraft/40 transition-colors shadow-sm active:scale-95"
              title="alinhar à esquerda"
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('justifyCenter')}
              className="p-2 sm:p-1.5 bg-white/90 hover:bg-acentoAzul text-acentoAzul hover:text-white rounded-xl border border-papelKraft/40 transition-colors shadow-sm active:scale-95"
              title="centralizar"
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('justifyRight')}
              className="p-2 sm:p-1.5 bg-white/90 hover:bg-acentoAzul text-acentoAzul hover:text-white rounded-xl border border-papelKraft/40 transition-colors shadow-sm active:scale-95"
              title="alinhar à direita"
            >
              <AlignRight className="w-4 h-4" />
            </button>
          </div>

          <div className="w-px h-5 bg-papelKraft/40 mx-0.5 shrink-0"></div>

          {/* GRUPO 5: TAMANHO DE FONTE (POPUP PERSONALIZADO ARREDONDADO) E SELETOR DE COR */}
          <div className="flex items-center gap-2 shrink-0">
            
            {/* BOTÃO SELETOR DE TAMANHO DE FONTE */}
            <div className="relative shrink-0" ref={fontSizeMenuRef}>
              <button
                type="button"
                onClick={() => setShowFontSizeMenu(!showFontSizeMenu)}
                className="px-2.5 py-1.5 bg-white hover:bg-bgPlataforma border border-papelKraft/50 rounded-xl text-xs font-bold text-acentoAzul flex items-center gap-1 shadow-sm transition-all active:scale-95"
                title="tamanho da fonte"
              >
                <Type className="w-3.5 h-3.5 text-acentoAzul shrink-0" />
                <span className="font-gesto text-sm">{fontSize}px</span>
                <ChevronUp className="w-3 h-3 text-acentoAzul shrink-0" />
              </button>
            </div>

            {/* SELETOR DE COR DE TEXTO ARREDONDADO */}
            <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-tintaCarvao/80 lowercase bg-white/90 px-2 py-1 rounded-xl border border-papelKraft/40 shadow-sm shrink-0">
              <span className="hidden sm:inline">cor:</span>
              <input
                type="color"
                value={textColor}
                onChange={handleColorChange}
                className="w-5 h-5 rounded-md cursor-pointer border-none p-0 bg-transparent"
              />
            </label>

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
