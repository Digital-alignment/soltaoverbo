import { useState, useRef, useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
  List,
  ListOrdered,
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  flat?: boolean;
}

export default function RichTextEditor({ value, onChange, placeholder, flat = false }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState('16');
  const [textColor, setTextColor] = useState('#2C2720');
  const [currentFormat, setCurrentFormat] = useState('p');

  useEffect(() => {
    if (editorRef.current && value && !editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value;
    }
  }, []);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
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

  const handleFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const format = e.target.value;
    setCurrentFormat(format);
    executeCommand('formatBlock', format);
  };

  return (
    <div className={`overflow-hidden transition-all ${
      flat ? 'bg-transparent border-none' : 'border border-papelKraft/40 rounded-2xl bg-transparent'
    }`}>
      {/* Barra de Ferramentas com Design System Solta o Verbo */}
      <div className={`p-2.5 sm:p-3 flex flex-wrap items-center gap-1.5 sm:gap-2 ${
        flat ? 'bg-transparent border-b border-papelKraft/30' : 'bg-bgPlataforma/60 border-b border-papelKraft/30'
      }`}>
        <select
          value={currentFormat}
          onChange={handleFormatChange}
          className="px-2.5 py-1.5 bg-white/80 border border-papelKraft/40 rounded-xl text-xs font-semibold text-acentoAzul focus:outline-none focus:border-acentoAzul transition-colors lowercase"
          title="formato de parágrafo"
        >
          <option value="p">parágrafo</option>
          <option value="h1">título 1</option>
          <option value="h2">título 2</option>
          <option value="h3">título 3</option>
          <option value="h4">título 4</option>
        </select>

        <div className="w-px h-5 bg-papelKraft/40 mx-1"></div>

        <button
          type="button"
          onClick={() => executeCommand('bold')}
          className="p-1.5 bg-white/80 hover:bg-acentoAzul text-acentoAzul hover:text-white rounded-xl border border-papelKraft/40 transition-colors"
          title="negrito"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('italic')}
          className="p-1.5 bg-white/80 hover:bg-acentoAzul text-acentoAzul hover:text-white rounded-xl border border-papelKraft/40 transition-colors"
          title="itálico"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('underline')}
          className="p-1.5 bg-white/80 hover:bg-acentoAzul text-acentoAzul hover:text-white rounded-xl border border-papelKraft/40 transition-colors"
          title="sublinhado"
        >
          <Underline className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-papelKraft/40 mx-1"></div>

        <button
          type="button"
          onClick={() => executeCommand('insertUnorderedList')}
          className="p-1.5 bg-white/80 hover:bg-acentoAzul text-acentoAzul hover:text-white rounded-xl border border-papelKraft/40 transition-colors"
          title="lista com marcadores"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('insertOrderedList')}
          className="p-1.5 bg-white/80 hover:bg-acentoAzul text-acentoAzul hover:text-white rounded-xl border border-papelKraft/40 transition-colors"
          title="lista numerada"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-papelKraft/40 mx-1"></div>

        <button
          type="button"
          onClick={() => executeCommand('justifyLeft')}
          className="p-1.5 bg-white/80 hover:bg-acentoAzul text-acentoAzul hover:text-white rounded-xl border border-papelKraft/40 transition-colors"
          title="alinhar à esquerda"
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('justifyCenter')}
          className="p-1.5 bg-white/80 hover:bg-acentoAzul text-acentoAzul hover:text-white rounded-xl border border-papelKraft/40 transition-colors"
          title="centralizar"
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('justifyRight')}
          className="p-1.5 bg-white/80 hover:bg-acentoAzul text-acentoAzul hover:text-white rounded-xl border border-papelKraft/40 transition-colors"
          title="alinhar à direita"
        >
          <AlignRight className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-papelKraft/40 mx-1"></div>

        <div className="flex items-center space-x-1.5">
          <Type className="w-4 h-4 text-acentoAzul" />
          <select
            value={fontSize}
            onChange={handleFontSizeChange}
            className="px-2 py-1 bg-white/80 border border-papelKraft/40 rounded-xl text-xs font-semibold text-acentoAzul focus:outline-none focus:border-acentoAzul transition-colors"
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

        <div className="flex items-center space-x-1.5 pl-1">
          <label className="flex items-center space-x-1.5 cursor-pointer text-xs font-medium text-tintaCarvao/70 lowercase">
            <span>cor:</span>
            <input
              type="color"
              value={textColor}
              onChange={handleColorChange}
              className="w-6 h-6 rounded-lg cursor-pointer border border-papelKraft/40 p-0.5 bg-white"
            />
          </label>
        </div>
      </div>

      {/* ÁREA DE ESCRITA INTEGRA AO BACKGROUND */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="p-4 sm:p-6 min-h-[280px] focus:outline-none font-editorial text-tintaCarvao leading-relaxed text-base sm:text-lg bg-transparent"
        style={{ fontSize: `${fontSize}px`, lineHeight: '1.7', color: textColor }}
        data-placeholder={placeholder}
      />

      <style>{`
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
