import { useEffect, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import RichTextEditor from '../components/RichTextEditor';
import {
  Plus,
  Save,
  Download,
  Share2,
  Trash2,
  Edit3,
  FileText,
  Search,
  Sparkles,
  BookMarked,
  Feather,
  X,
  Check,
  Maximize2,
  Minimize2,
  Tag,
  Book,
  Lightbulb,
  Heart,
  EyeOff,
  UserCheck,
  Timer,
  Play,
  Pause,
  RotateCcw,
  LayoutTemplate,
  Flame,
  Sun,
  Smile,
  Bell,
  BookOpen,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import type { Database } from '../lib/database.types';
import { BRAND_ASSETS } from '../config/brandAssets';

type WritingExercise = Database['public']['Tables']['writing_exercises']['Row'];

interface Notebook {
  id: string;
  title: string;
  description: string;
  type: 'feather' | 'book' | 'openbook' | 'sparkles';
}

interface GuidedTemplate {
  id: string;
  type: 'sun' | 'flame' | 'sparkles' | 'feather';
  title: string;
  subtitle: string;
  initialTitle: string;
  initialContent: string;
}

// Disparadores / Prompts Poéticos Curados por Bruna & Júlia
const WRITING_PROMPTS = [
  {
    id: '1',
    category: 'presença & corpo',
    text: 'escreva 100 palavras sobre o que você guardou em silêncio esta semana.',
  },
  {
    id: '2',
    category: 'poética & memória',
    text: 'dê nome a uma saudade sem usar a palavra saudade.',
  },
  {
    id: '3',
    category: 'acolhimento',
    text: 'o que o seu corpo sente quando o papel permanece em branco?',
  },
  {
    id: '4',
    category: 'infância & raízes',
    text: 'descreva a textura e o som de uma memória da sua infância.',
  },
  {
    id: '5',
    category: 'visão de futuro',
    text: 'escreva uma carta poética aberta para a sua versão de daqui a 5 anos.',
  },
];

// Cadernos Temáticos Padrão da Plataforma
const DEFAULT_NOTEBOOKS: Notebook[] = [
  {
    id: 'sussurros',
    title: 'caderno de sussurros & presença',
    description: 'práticas diárias de escuta e acolhimento dos sentimentos.',
    type: 'feather',
  },
  {
    id: 'diario21',
    title: 'diário de bordo 21 dias',
    description: 'exercícios do programa 21 dias de escrita sustentada.',
    type: 'book',
  },
  {
    id: 'rascunhos',
    title: 'rascunhos poéticos & memórias',
    description: 'textos livres, fragmentos de poemas e memórias soltas.',
    type: 'openbook',
  },
  {
    id: 'fogueira',
    title: 'rituais da fogueira',
    description: 'partilhas e temas trabalhados nos encontros ao vivo.',
    type: 'sparkles',
  },
];

// Rituais Guiados & Plantillas Poéticas (Templates)
const GUIDED_TEMPLATES: GuidedTemplate[] = [
  {
    id: 'matinal',
    type: 'sun',
    title: 'ritual matinal',
    subtitle: 'o que desperta no meu corpo hoje?',
    initialTitle: 'ritual matinal: o que desperta no meu corpo hoje',
    initialContent: `<blockquote style="border-left: 3px solid #FD5E32; padding-left: 12px; margin-bottom: 16px; color: #140D82; font-style: italic;">“o que o seu corpo e o seu pensamento sentem ao abrir os olhos hoje?”</blockquote><p>ao acordar hoje, percebi que...</p><p></p><p>3 coisas que observo no meu ambiente agora:</p><p>1. </p><p>2. </p><p>3. </p>`,
  },
  {
    id: 'desapego',
    type: 'flame',
    title: 'carta de desapego',
    subtitle: 'o que deixo ir no fogo de hoje?',
    initialTitle: 'carta de desapego: o que deixo ir no fogo de hoje',
    initialContent: `<blockquote style="border-left: 3px solid #FD5E32; padding-left: 12px; margin-bottom: 16px; color: #140D82; font-style: italic;">“escreva sem medo o peso que você decide soltar no fogo de hoje.”</blockquote><p>hoje eu escolho soltar e deixar ir...</p><p></p><p>não preciso mais carregar o peso de...</p><p></p><p>em substituição, abro espaço para...</p>`,
  },
  {
    id: 'gratidao',
    type: 'sparkles',
    title: 'diário de gratidão silenciosa',
    subtitle: '3 milagres imperceptíveis do meu dia.',
    initialTitle: 'diário de gratidão silenciosa',
    initialContent: `<blockquote style="border-left: 3px solid #FD5E32; padding-left: 12px; margin-bottom: 16px; color: #140D82; font-style: italic;">“escreva sobre os pequenos milagres invisíveis da sua rotina.”</blockquote><p>3 pequenos milagres imperceptíveis do meu dia de hoje:</p><p>1. </p><p>2. </p><p>3. </p>`,
  },
  {
    id: 'poema',
    type: 'feather',
    title: 'poema em 4 estrofes',
    subtitle: 'estrutura guiada com versos soltos.',
    initialTitle: 'poema em 4 estrofes: versos soltos',
    initialContent: `<p><strong>estrofe I — a escuta do silêncio</strong></p><p>no primeiro sussurro da casa...</p><p></p><p><strong>estrofe II — a memória do corpo</strong></p><p>um gesto esquecido no tempo...</p><p></p><p><strong>estrofe III — a chama da fogueira</strong></p><p>o fogo que acolhe o peso...</p><p></p><p><strong>estrofe IV — o retorno à presença</strong></p><p>respiro fundo e me reconheço...</p>`,
  },
];

// Tags / Etiquetas Poéticas
const POETIC_TAGS = ['poesia', 'memória', 'desabafo', 'ritual diário', 'ensaio', 'rascunho'];

// Tabela de Chancela Poética em Tempo Real
const WORD_MILESTONES = [
  { minWords: 10, title: 'um haicai poético de bashō' },
  { minWords: 50, title: 'uma estrofe de vinicius de moraes' },
  { minWords: 100, title: "o poema 'no meio do caminho' de drummond" },
  { minWords: 300, title: 'o manifesto antropófago de oswald de andrade' },
  { minWords: 500, title: 'um conto de clarice lispector' },
  { minWords: 1000, title: 'o livro o pequeno príncipe' },
  { minWords: 2500, title: 'o romance a metamorfose de franz kafka' },
  { minWords: 5000, title: 'o banquete de platão' },
];

export default function WritingExercises() {
  const { profile } = useAuth();
  const [exercises, setExercises] = useState<WritingExercise[]>([]);
  const [currentExercise, setCurrentExercise] = useState<WritingExercise | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [saving, setSaving] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isAnonymousShare, setIsAnonymousShare] = useState(false);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);

  // Estado para Colapsar o Menu Lateral (Maior Largura para o Editor)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Estados de Abas Laterais & Filtros
  const [activeTab, setActiveTab] = useState<'textos' | 'cadernos' | 'tags'>('textos');
  const [activeTagFilter, setActiveTagFilter] = useState<string | null>(null);
  
  // Modo Foco (Zen Editor)
  const [isZenMode, setIsZenMode] = useState(false);

  // Congelar o scroll do body quando o Modo Foco estiver ativo
  useEffect(() => {
    if (isZenMode) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isZenMode]);

  // Prompts / Disparadores Poéticos
  const [showPromptsDrawer, setShowPromptsDrawer] = useState(false);

  // TEMPORIZADOR DO RITUAL (Sprint de Escrita Sem Cobrança)
  const [timerSeconds, setTimerSeconds] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerFinished, setTimerFinished] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds !== null && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      setTimerFinished(true);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const startTimer = (minutes: number) => {
    setTimerSeconds(minutes * 60);
    setIsTimerRunning(true);
    setTimerFinished(false);
  };

  const pauseTimer = () => {
    setIsTimerRunning(false);
  };

  const resumeTimer = () => {
    if (timerSeconds !== null && timerSeconds > 0) {
      setIsTimerRunning(true);
    }
  };

  const stopTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(null);
    setTimerFinished(false);
  };

  const formatTimerStr = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  useEffect(() => {
    if (profile) {
      loadExercises();
    }
  }, [profile]);

  const loadExercises = async () => {
    if (!profile) return;

    const { data, error } = await supabase
      .from('writing_exercises')
      .select('*')
      .eq('user_id', profile.id)
      .order('updated_at', { ascending: false });

    if (!error && data) {
      setExercises(data);
    }
  };

  const handleNew = (initialTitle?: string, initialContent?: string) => {
    setCurrentExercise(null);
    setTitle(initialTitle || '');
    setContent(initialContent || '');
    setIsEditing(true);
    setShowTemplatesModal(false);
  };

  const handleApplyTemplate = (tmpl: GuidedTemplate) => {
    handleNew(tmpl.initialTitle, tmpl.initialContent);
  };

  const handleEdit = (exercise: WritingExercise) => {
    setCurrentExercise(exercise);
    setTitle(exercise.title);
    setContent(exercise.content);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!profile || !title.trim()) return;

    setSaving(true);
    try {
      if (currentExercise) {
        const { error } = await supabase
          .from('writing_exercises')
          .update({
            title: title.trim(),
            content: content,
          })
          .eq('id', currentExercise.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from('writing_exercises').insert({
          user_id: profile.id,
          title: title.trim(),
          content: content,
          is_published: false,
        });

        if (error) throw error;
      }

      await loadExercises();
      setIsEditing(false);
    } catch (error) {
      console.error('erro ao salvar:', error);
      alert('erro ao salvar o texto. tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([`${title}\n\n${content.replace(/<[^>]*>/g, '')}`], {
      type: 'text/plain',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title || 'texto'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (!currentExercise || !profile) return;

    try {
      const { data: existingPost } = await supabase
        .from('community_posts')
        .select('id')
        .eq('writing_exercise_id', currentExercise.id)
        .maybeSingle();

      if (existingPost) {
        alert('este texto já foi publicado na nossa fogueira!');
        setShowShareModal(false);
        return;
      }

      const { error: updateError } = await supabase
        .from('writing_exercises')
        .update({ is_published: true })
        .eq('id', currentExercise.id);

      if (updateError) throw updateError;

      const { error: postError } = await supabase.from('community_posts').insert({
        writing_exercise_id: currentExercise.id,
        user_id: profile.id,
      });

      if (postError) throw postError;

      alert(
        isAnonymousShare
          ? 'texto publicado com sucesso na nossa fogueira de forma anônima!'
          : 'texto publicado com sucesso na nossa fogueira!'
      );
      setShowShareModal(false);
      await loadExercises();
    } catch (error) {
      console.error('erro ao compartilhar:', error);
      alert('erro ao compartilhar. tente novamente.');
    }
  };

  const handleDelete = async (exerciseId: string) => {
    if (!confirm('tem certeza que deseja excluir este texto?')) return;

    const { error } = await supabase.from('writing_exercises').delete().eq('id', exerciseId);

    if (!error) {
      await loadExercises();
      if (currentExercise?.id === exerciseId) {
        setCurrentExercise(null);
        setTitle('');
        setContent('');
        setIsEditing(false);
      }
    }
  };

  const insertPromptToContent = (promptText: string) => {
    const quoteHtml = `<blockquote style="border-left: 3px solid #FD5E32; padding-left: 12px; margin-bottom: 16px; color: #140D82; font-style: italic;">“${promptText}”</blockquote><p></p>`;
    setContent((prev) => quoteHtml + prev);
    setShowPromptsDrawer(false);
  };

  // Filtragem de Textos
  const filteredExercises = useMemo(() => {
    return exercises.filter((ex) => {
      const matchesSearch = ex.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [exercises, searchQuery]);

  // Conteo Dinâmico de Palavras e Marco Literário Alcançado
  const currentWordCount = useMemo(() => {
    const plainText = content.replace(/<[^>]*>/g, '').trim();
    if (!plainText) return 0;
    return plainText.split(/\s+/).length;
  }, [content]);

  const currentMilestone = useMemo(() => {
    if (currentWordCount === 0) return null;
    let milestone = WORD_MILESTONES[0];
    for (const m of WORD_MILESTONES) {
      if (currentWordCount >= m.minWords) {
        milestone = m;
      } else {
        break;
      }
    }
    return milestone;
  }, [currentWordCount]);

  const renderTemplateIcon = (type: GuidedTemplate['type']) => {
    switch (type) {
      case 'sun':
        return <Sun className="w-5 h-5 text-acentoTerracota shrink-0" />;
      case 'flame':
        return <Flame className="w-5 h-5 text-acentoTerracota shrink-0" />;
      case 'sparkles':
        return <Sparkles className="w-5 h-5 text-acentoAzul shrink-0" />;
      case 'feather':
      default:
        return <Feather className="w-5 h-5 text-acentoAzul shrink-0" />;
    }
  };

  const renderNotebookIcon = (type: Notebook['type']) => {
    switch (type) {
      case 'feather':
        return <Feather className="w-4 h-4 text-acentoTerracota shrink-0" />;
      case 'book':
        return <Book className="w-4 h-4 text-acentoAzul shrink-0" />;
      case 'openbook':
        return <BookOpen className="w-4 h-4 text-acentoAzul shrink-0" />;
      case 'sparkles':
      default:
        return <Sparkles className="w-4 h-4 text-acentoTerracota shrink-0" />;
    }
  };

  return (
    <div className="min-h-screen bg-bgPlataforma text-tintaCarvao py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* CABEÇALHO LIMPO DA PÁGINA (DESCRITIVO MAIS CURTO E FONTE MAIOR EM EDITORIAL SERIF) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-papelKraft/40 pb-4">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-bold font-editorial text-acentoAzul lowercase">
              exercícios de escrita
            </h1>
            <p className="text-base sm:text-lg text-tintaCarvao/85 font-medium font-editorial lowercase leading-relaxed">
              seu espaço protegido para criar, organizar seus cadernos e soltar a voz.
            </p>
          </div>

          {/* Único Botão de Ação Primário no Cabeçalho da Página */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => handleNew()}
              className="btn-pill-primary px-6 py-2.5 text-xs sm:text-sm font-semibold shadow-sm inline-flex items-center gap-2 hover:scale-105 transition-transform"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>novo texto</span>
            </button>
          </div>
        </div>

        {/* GAVETA / DRAWER DE DISPARADORES & PROMPTS POÉTICOS */}
        {showPromptsDrawer && (
          <div className="bg-papelClaro rounded-3xl p-5 border border-acentoTerracota/40 shadow-kraft space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-acentoTerracota" />
                <h3 className="text-sm font-bold font-editorial text-acentoAzul lowercase">
                  disparadores poéticos curados por bruna & júlia
                </h3>
              </div>
              <button
                onClick={() => setShowPromptsDrawer(false)}
                className="p-1 rounded-lg hover:bg-bgPlataforma text-tintaCarvao/50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              {WRITING_PROMPTS.map((prompt) => (
                <div
                  key={prompt.id}
                  className="bg-white p-3.5 rounded-2xl border border-papelKraft/50 shadow-sm space-y-2 flex flex-col justify-between hover:border-acentoTerracota transition-colors"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-acentoTerracota bg-acentoTerracota/10 px-2 py-0.5 rounded-full lowercase">
                      {prompt.category}
                    </span>
                    <p className="text-xs text-tintaCarvao/85 lowercase italic font-medium leading-relaxed pt-1">
                      “{prompt.text}”
                    </p>
                  </div>

                  <button
                    onClick={() => insertPromptToContent(prompt.text)}
                    className="text-[11px] font-bold text-acentoAzul hover:text-acentoTerracota transition-colors lowercase flex items-center gap-1 pt-1"
                  >
                    <span>usar como disparador →</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ESTRUTURA PRINCIPAL EM DUAS COLUNAS COM MENU LATERAL COLAPSÁVEL */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* PAINEL LATERAL COLAPSÁVEL (lg:col-span-3 quando expandido, lg:col-span-1 quando colapsado) */}
          <div
            className={`transition-all duration-300 ${
              isSidebarCollapsed ? 'lg:col-span-1' : 'lg:col-span-3'
            }`}
          >
            <div className={`bg-papelClaro rounded-3xl border border-papelKraft/60 shadow-kraft relative transition-all duration-300 ${
              isSidebarCollapsed ? 'p-2.5 sm:p-3 space-y-0' : 'p-4 sm:p-5 space-y-4'
            }`}>
              
              {/* HEADER EXPANDIDO OU BARRA RESPONSIVA COLAPSADA (Horizontal em Mobile, Vertical em Desktop) */}
              {!isSidebarCollapsed ? (
                <div className="flex items-center justify-between border-b border-papelKraft/30 pb-2">
                  <span className="text-xs font-bold text-acentoAzul lowercase">
                    estúdio de textos
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsSidebarCollapsed(true)}
                    className="p-1.5 rounded-xl bg-bgPlataforma hover:bg-papelKraft/40 text-acentoAzul transition-colors border border-papelKraft/40"
                    title="colapsar menu para maior espaço de escrita"
                  >
                    <PanelLeftClose className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                /* BARRA COMPACTA COLAPSADA: Horizontal em telas mobile (<lg), Vertical em telas grandes (lg:) */
                <div className="flex flex-row lg:flex-col items-center justify-between lg:justify-center gap-2 lg:gap-3">
                  <button
                    type="button"
                    onClick={() => setIsSidebarCollapsed(false)}
                    className="p-2 rounded-xl bg-bgPlataforma hover:bg-papelKraft/40 text-acentoAzul transition-colors border border-papelKraft/40"
                    title="expandir estúdio de textos"
                  >
                    <PanelLeftOpen className="w-4 h-4" />
                  </button>

                  <div className="flex flex-row lg:flex-col items-center gap-2 lg:gap-3">
                    <button
                      onClick={() => {
                        setIsSidebarCollapsed(false);
                        setActiveTab('textos');
                      }}
                      className="p-2 rounded-2xl bg-white border border-papelKraft/50 text-acentoAzul hover:bg-acentoAzul hover:text-white transition-colors shadow-sm"
                      title="ver todos os textos"
                    >
                      <FileText className="w-4.5 h-4.5" />
                    </button>

                    <button
                      onClick={() => {
                        setIsSidebarCollapsed(false);
                        setActiveTab('cadernos');
                      }}
                      className="p-2 rounded-2xl bg-white border border-papelKraft/50 text-acentoTerracota hover:bg-acentoTerracota hover:text-white transition-colors shadow-sm"
                      title="ver cadernos temáticos"
                    >
                      <Book className="w-4.5 h-4.5" />
                    </button>

                    <button
                      onClick={() => {
                        setIsSidebarCollapsed(false);
                        setActiveTab('tags');
                      }}
                      className="p-2 rounded-2xl bg-white border border-papelKraft/50 text-acentoOliva hover:bg-acentoOliva hover:text-tintaCarvao transition-colors shadow-sm"
                      title="ver etiquetas"
                    >
                      <Tag className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* CONTEÚDO DO MENU LATERAL QUANDO EXPANDIDO */}
              {!isSidebarCollapsed && (
                <div className="space-y-4 animate-fadeIn">
                  {/* Abas de Organização: Textos | Cadernos | Tags */}
                  <div className="flex items-center gap-1 bg-bgPlataforma p-1 rounded-2xl border border-papelKraft/50 text-xs font-semibold lowercase">
                    <button
                      onClick={() => {
                        setActiveTab('textos');
                        setActiveTagFilter(null);
                      }}
                      className={`flex-1 py-1.5 rounded-xl transition-all ${
                        activeTab === 'textos' ? 'bg-acentoAzul text-white shadow-sm font-bold' : 'text-tintaCarvao/70 hover:text-tintaCarvao'
                      }`}
                    >
                      textos ({exercises.length})
                    </button>

                    <button
                      onClick={() => setActiveTab('cadernos')}
                      className={`flex-1 py-1.5 rounded-xl transition-all ${
                        activeTab === 'cadernos' ? 'bg-acentoAzul text-white shadow-sm font-bold' : 'text-tintaCarvao/70 hover:text-tintaCarvao'
                      }`}
                    >
                      cadernos
                    </button>

                    <button
                      onClick={() => setActiveTab('tags')}
                      className={`flex-1 py-1.5 rounded-xl transition-all ${
                        activeTab === 'tags' ? 'bg-acentoAzul text-white shadow-sm font-bold' : 'text-tintaCarvao/70 hover:text-tintaCarvao'
                      }`}
                    >
                      etiquetas
                    </button>
                  </div>

                  {/* ABA 1: LISTA DE TEXTOS E BUSCA */}
                  {activeTab === 'textos' && (
                    <div className="space-y-3">
                      <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-tintaCarvao/40" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="buscar textos..."
                          className="w-full pl-10 pr-3 py-2 bg-bgPlataforma/70 border border-papelKraft/50 rounded-2xl text-xs text-tintaCarvao focus:outline-none focus:border-acentoAzul transition-colors placeholder:text-tintaCarvao/50 lowercase"
                        />
                      </div>

                      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                        {filteredExercises.map((exercise) => (
                          <div
                            key={exercise.id}
                            onClick={() => handleEdit(exercise)}
                            className={`p-3 rounded-2xl border transition-all duration-200 cursor-pointer group flex items-center justify-between gap-2 ${
                              currentExercise?.id === exercise.id
                                ? 'bg-white border-acentoAzul shadow-sm'
                                : 'bg-bgPlataforma/60 border-papelKraft/40 hover:bg-white hover:border-papelKraft/80'
                            }`}
                          >
                            <div className="flex-1 min-w-0 space-y-0.5">
                              <h3 className="font-bold text-xs text-acentoAzul truncate lowercase">
                                {exercise.title || 'texto sem título'}
                              </h3>
                              <div className="flex items-center gap-1.5 text-[10px] text-tintaCarvao/60 font-medium">
                                <span>{new Date(exercise.updated_at).toLocaleDateString('pt-BR')}</span>
                                {exercise.is_published && (
                                  <span className="px-1.5 py-0.2 rounded-full bg-acentoOliva/20 text-acentoAzul font-bold lowercase">
                                    fogueira
                                  </span>
                                )}
                              </div>
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(exercise.id);
                              }}
                              className="opacity-0 group-hover:opacity-100 transition p-1 hover:bg-red-50 text-tintaCarvao/40 hover:text-red-600 rounded-lg"
                              title="excluir texto"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}

                        {filteredExercises.length === 0 && (
                          <div className="text-center py-8 space-y-2 bg-bgPlataforma/50 rounded-2xl border border-papelKraft/40 p-4 shadow-sm">
                            <div className="p-2.5 rounded-xl bg-papelClaro text-acentoAzul/40 inline-flex border border-papelKraft/30">
                              <FileText className="w-6 h-6 text-acentoAzul/40" />
                            </div>
                            <p className="text-xs text-tintaCarvao/70 font-editorial lowercase italic">
                              {searchQuery ? 'nenhum texto encontrado.' : 'nenhum texto criado ainda.'}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ABA 2: CADERNOS TEMÁTICOS */}
                  {activeTab === 'cadernos' && (
                    <div className="space-y-3">
                      <p className="text-[11px] text-tintaCarvao/75 lowercase leading-relaxed">
                        organize sua produção por diários temáticos:
                      </p>

                      <div className="space-y-2">
                        {DEFAULT_NOTEBOOKS.map((nb) => (
                          <div
                            key={nb.id}
                            onClick={() => handleNew(nb.title)}
                            className="p-3 rounded-2xl bg-white border border-papelKraft/50 shadow-sm hover:border-acentoAzul transition-all cursor-pointer group space-y-1"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {renderNotebookIcon(nb.type)}
                                <h4 className="text-xs font-bold text-acentoAzul lowercase group-hover:text-acentoTerracota transition-colors truncate">
                                  {nb.title}
                                </h4>
                              </div>
                              <Plus className="w-3.5 h-3.5 text-acentoAzul shrink-0" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ABA 3: ETIQUETAS POÉTICAS */}
                  {activeTab === 'tags' && (
                    <div className="space-y-3">
                      <p className="text-[11px] text-tintaCarvao/75 lowercase leading-relaxed">
                        filtre seus textos por sentimento ou estilo:
                      </p>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {POETIC_TAGS.map((tag) => (
                          <button
                            key={tag}
                            onClick={() => {
                              setActiveTagFilter(activeTagFilter === tag ? null : tag);
                              setActiveTab('textos');
                            }}
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold lowercase border transition-all ${
                              activeTagFilter === tag
                                ? 'bg-acentoTerracota text-white border-acentoTerracota shadow-sm'
                                : 'bg-white text-acentoAzul border-papelKraft/60 hover:bg-bgPlataforma'
                            }`}
                          >
                            #{tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>

          {/* PAINEL CENTRAL: EDITOR DE ESCRITA DE LARGURA EXPANDIDA (lg:col-span-9 ou lg:col-span-11) */}
          <div
            className={`transition-all duration-300 ${
              isSidebarCollapsed ? 'lg:col-span-11' : 'lg:col-span-9'
            }`}
          >
            {isEditing || currentExercise ? (
              <div className="bg-papelClaro rounded-3xl p-6 sm:p-8 border border-papelKraft/60 shadow-kraft space-y-5 relative">
                
                {/* BARRA DE FERRAMENTAS RE-ESTRUTURADA NO TOPO DO EDITOR */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-papelKraft/40 pb-3">
                  
                  {/* Lado Esquerdo: Temporizador de Sprint Poético */}
                  <div className="flex items-center gap-2 bg-bgPlataforma/80 px-3 py-1.5 rounded-2xl border border-papelKraft/50">
                    <Timer className="w-4 h-4 text-acentoTerracota" />
                    <span className="text-xs font-bold text-acentoAzul lowercase">sprint poético:</span>

                    {timerSeconds === null ? (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => startTimer(5)}
                          className="px-2 py-0.5 rounded-lg bg-white hover:bg-acentoAzul text-acentoAzul hover:text-white border border-papelKraft text-[11px] font-bold lowercase transition-all"
                        >
                          5min
                        </button>
                        <button
                          type="button"
                          onClick={() => startTimer(10)}
                          className="px-2 py-0.5 rounded-lg bg-white hover:bg-acentoAzul text-acentoAzul hover:text-white border border-papelKraft text-[11px] font-bold lowercase transition-all"
                        >
                          10min
                        </button>
                        <button
                          type="button"
                          onClick={() => startTimer(15)}
                          className="px-2 py-0.5 rounded-lg bg-white hover:bg-acentoAzul text-acentoAzul hover:text-white border border-papelKraft text-[11px] font-bold lowercase transition-all"
                        >
                          15min
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="font-gesto text-xl font-normal text-acentoTerracota min-w-[50px]">
                          {formatTimerStr(timerSeconds)}
                        </span>
                        {isTimerRunning ? (
                          <button
                            type="button"
                            onClick={pauseTimer}
                            className="p-1 rounded-lg hover:bg-papelKraft/40 text-acentoAzul"
                            title="pausar sprint"
                          >
                            <Pause className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={resumeTimer}
                            className="p-1 rounded-lg hover:bg-papelKraft/40 text-acentoAzul"
                            title="retomar sprint"
                          >
                            <Play className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={stopTimer}
                          className="p-1 rounded-lg hover:bg-papelKraft/40 text-tintaCarvao/50"
                          title="reiniciar cronômetro"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Lado Direito: Botões de Recursos Re-estruturados (Rituais Guiados, Disparador Poético, Modo Foco) */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowTemplatesModal(true)}
                      className="px-3 py-1.5 rounded-2xl bg-acentoAzul/10 hover:bg-acentoAzul text-acentoAzul hover:text-white border border-acentoAzul/20 text-xs font-semibold lowercase transition-all inline-flex items-center gap-1.5 shadow-sm"
                      title="rituais guiados & templates poéticos"
                    >
                      <LayoutTemplate className="w-3.5 h-3.5 text-acentoAzul" />
                      <span>rituais guiados</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowPromptsDrawer(!showPromptsDrawer)}
                      className="px-3 py-1.5 rounded-2xl bg-acentoTerracota/10 hover:bg-acentoTerracota text-acentoTerracota hover:text-white border border-acentoTerracota/30 text-xs font-semibold lowercase transition-all inline-flex items-center gap-1.5 shadow-sm"
                      title="inspiração e disparadores poéticos"
                    >
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>disparador poético</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsZenMode(true)}
                      className="px-3 py-1.5 rounded-2xl bg-acentoAzul/10 hover:bg-acentoAzul text-acentoAzul hover:text-white border border-acentoAzul/20 text-xs font-bold lowercase transition-all inline-flex items-center gap-1.5 shadow-sm"
                      title="modo foco imersivo"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>modo foco</span>
                    </button>
                  </div>

                </div>

                {/* Notificação de Sprint Concluído */}
                {timerFinished && (
                  <div className="p-3.5 rounded-2xl bg-acentoOliva/20 border border-acentoOliva text-acentoAzul text-xs font-bold lowercase flex items-center justify-between animate-fadeIn">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-acentoTerracota animate-bounce" />
                      <span>ritual concluído com presença! pause e releia o que você escreveu sem julgamentos.</span>
                    </div>
                    <button
                      onClick={() => setTimerFinished(false)}
                      className="p-1 rounded-lg hover:bg-acentoOliva/40"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Título do Texto & Metas Literárias em Tempo Real */}
                <div className="space-y-3">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="título do seu texto..."
                    className="w-full text-2xl sm:text-3xl font-bold font-editorial text-acentoAzul bg-transparent border-none focus:outline-none placeholder:text-tintaCarvao/30 lowercase"
                  />
                  
                  {/* Conteo em Muthazle + Chancela Literária em Tempo Real */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-tintaCarvao/70 bg-bgPlataforma/60 p-2.5 rounded-2xl border border-papelKraft/40">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-acentoTerracota" />
                      <span>produção atual: <strong className="font-gesto text-xl font-normal text-acentoAzul">{currentWordCount}</strong> palavras</span>
                    </span>

                    {currentMilestone && (
                      <span className="text-[11px] font-semibold text-acentoTerracota lowercase flex items-center gap-1">
                        <BookMarked className="w-3.5 h-3.5" />
                        <span>equivalente a {currentMilestone.title}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Editor RichText com Cores e Borda de Papel */}
                <div className="min-h-[380px]">
                  <RichTextEditor
                    value={content}
                    onChange={setContent}
                    placeholder="escreva aqui livremente seus pensamentos..."
                    flat={true}
                  />
                </div>

                {/* Barra de Ações (Salvar, Baixar, Compartilhar) */}
                <div className="pt-4 border-t border-papelKraft/40 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSave}
                      disabled={saving || !title.trim()}
                      className="btn-pill-primary px-5 py-2 text-xs font-semibold shadow-sm inline-flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{saving ? 'salvando...' : 'salvar texto'}</span>
                    </button>

                    <button
                      onClick={() => setIsEditing(false)}
                      className="btn-pill-secondary px-4 py-2 text-xs font-semibold lowercase"
                    >
                      cancelar
                    </button>
                  </div>

                  {currentExercise && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleDownload}
                        className="px-3.5 py-2 rounded-xl bg-bgPlataforma hover:bg-papelKraft/40 text-acentoAzul text-xs font-semibold lowercase transition-colors border border-papelKraft/50 inline-flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>baixar .txt</span>
                      </button>

                      <button
                        onClick={() => setShowShareModal(true)}
                        disabled={currentExercise.is_published}
                        className="px-3.5 py-2 rounded-xl bg-acentoTerracota/10 hover:bg-acentoTerracota text-acentoTerracota hover:text-white text-xs font-semibold lowercase transition-all border border-acentoTerracota/20 inline-flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>{currentExercise.is_published ? 'publicado' : 'compartilhar na fogueira'}</span>
                      </button>
                    </div>
                  )}
                </div>

              </div>
            ) : (
              /* ESTADO VAZIO DE INÍCIO — ULTRA-LIMPIO, ELEGANTE E SEM DISTRAÇÕES */
              <div className="bg-papelClaro rounded-3xl p-10 sm:p-16 border border-papelKraft/60 shadow-kraft text-center space-y-6 min-h-[460px] flex flex-col items-center justify-center">
                <div className="p-4 rounded-2xl bg-bgPlataforma/70 border border-papelKraft/40 text-acentoAzul inline-flex shadow-sm">
                  <Feather className="w-8 h-8 text-acentoAzul" />
                </div>
                
                <div className="space-y-2 max-w-md mx-auto">
                  <h3 className="text-3xl font-bold font-editorial text-acentoAzul lowercase">
                    comece a escrever
                  </h3>
                  <p className="text-sm text-tintaCarvao/80 font-editorial lowercase leading-relaxed">
                    seu espaço protegido para transformar sentimentos e ideias em palavras soltas.
                  </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={() => handleNew()}
                    className="btn-pill-primary px-7 py-3 text-xs sm:text-sm font-bold lowercase shadow-sm inline-flex items-center gap-2 hover:scale-105 transition-transform"
                  >
                    <Plus className="w-4 h-4 text-white" />
                    <span>criar novo texto</span>
                  </button>

                  <button
                    onClick={() => setShowTemplatesModal(true)}
                    className="px-5 py-3 rounded-2xl bg-bgPlataforma/80 hover:bg-papelKraft/40 text-acentoAzul hover:text-acentoTerracota border border-papelKraft/50 text-xs font-semibold lowercase transition-all inline-flex items-center gap-1.5 shadow-sm"
                  >
                    <LayoutTemplate className="w-4 h-4 text-acentoTerracota" />
                    <span>ou escolha um ritual guiado →</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* MODAL: RITUAIS GUIADOS & PLANTILLAS POÉTICAS */}
        {showTemplatesModal && (
          <div className="fixed inset-0 bg-tintaCarvao/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-papelClaro rounded-3xl border border-papelKraft/60 p-6 sm:p-8 max-w-2xl w-full shadow-kraft-lg space-y-5 relative">
              <button
                onClick={() => setShowTemplatesModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-bgPlataforma text-tintaCarvao/60 hover:text-tintaCarvao transition-colors border border-papelKraft/40"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <span className="text-xs font-bold text-acentoTerracota lowercase block">
                  estruturas poéticas guiadas
                </span>
                <h3 className="text-2xl font-bold font-editorial text-acentoAzul lowercase">
                  escolha um ritual guiado de escrita
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {GUIDED_TEMPLATES.map((tmpl) => (
                  <div
                    key={tmpl.id}
                    onClick={() => handleApplyTemplate(tmpl)}
                    className="p-4 rounded-2xl bg-white border border-papelKraft/60 shadow-sm hover:border-acentoTerracota transition-all cursor-pointer group space-y-2 flex flex-col justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {renderTemplateIcon(tmpl.type)}
                        <h4 className="text-sm font-bold font-editorial text-acentoAzul lowercase group-hover:text-acentoTerracota transition-colors">
                          {tmpl.title}
                        </h4>
                      </div>
                      <p className="text-xs text-tintaCarvao/80 lowercase italic font-medium leading-relaxed">
                        “{tmpl.subtitle}”
                      </p>
                    </div>

                    <div className="pt-2 border-t border-papelKraft/30 flex items-center justify-end">
                      <span className="text-xs font-bold text-acentoTerracota lowercase group-hover:underline">
                        iniciar este ritual →
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-end border-t border-papelKraft/40">
                <button
                  onClick={() => setShowTemplatesModal(false)}
                  className="btn-pill-secondary px-5 py-2 text-xs font-semibold lowercase"
                >
                  fechar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODO FOCO / ZEN EDITOR EM TELA CHEIA (100% COBRINDO A TELA VIA REACT PORTAL NO DOM BODY) */}
        {isZenMode &&
          createPortal(
            <div className="fixed inset-0 z-[999999] w-screen h-screen min-h-screen bg-bgPlataforma text-tintaCarvao p-4 sm:p-8 overflow-y-auto animate-fadeIn flex flex-col justify-between">
              <div className="max-w-5xl mx-auto w-full space-y-4 flex-1 flex flex-col justify-between">
                
                {/* Header Superior Limpo do Modo Foco */}
                <div className="flex items-center justify-between border-b border-papelKraft/30 pb-3">
                  {/* Lado Esquerdo: Estatísticas de Palavras & Sprint */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-tintaCarvao/80 lowercase">
                      produção: <strong className="font-gesto text-xl font-normal text-acentoAzul">{currentWordCount}</strong> palavras
                    </span>

                    {timerSeconds !== null && (
                      <span className="text-xs font-bold text-acentoTerracota flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-papelKraft/50 shadow-sm">
                        <Timer className="w-3.5 h-3.5 text-acentoTerracota" />
                        <span className="font-gesto text-lg font-normal">{formatTimerStr(timerSeconds)}</span>
                      </span>
                    )}
                  </div>

                  {/* Lado Direito: Botão 'sair do modo foco' e Botão 'salvar texto' alinhados no topo */}
                  <div className="flex flex-col items-end gap-1.5">
                    <button
                      onClick={() => setIsZenMode(false)}
                      className="btn-pill-secondary px-4 py-1.5 text-xs font-bold lowercase inline-flex items-center gap-1.5 shadow-sm"
                    >
                      <Minimize2 className="w-3.5 h-3.5" />
                      <span>sair do modo foco</span>
                    </button>

                    <button
                      onClick={handleSave}
                      disabled={saving || !title.trim()}
                      className="btn-pill-primary px-4 py-1.5 text-xs font-semibold lowercase shadow-sm inline-flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <Save className="w-3.5 h-3.5 text-white" />
                      <span>{saving ? 'salvando...' : 'salvar texto'}</span>
                    </button>
                  </div>
                </div>

                {/* Área Principal de Escrita Integrada ao Background (Sem caixas nidadas nem bordas internas) */}
                <div className="space-y-4 flex-1 flex flex-col pt-2">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="título do seu texto..."
                    className="w-full text-3xl sm:text-4xl font-bold font-editorial text-acentoAzul bg-transparent border-none focus:outline-none placeholder:text-tintaCarvao/30 lowercase"
                  />

                  <div className="flex-1 flex flex-col min-h-[50vh]">
                    <RichTextEditor
                      value={content}
                      onChange={setContent}
                      placeholder="escreva aqui com calma e sem interrupções..."
                      flat={true}
                    />
                  </div>
                </div>

                {/* Rodapé discreto no Modo Foco */}
                <div className="pt-2 text-center text-[11px] text-tintaCarvao/50 lowercase">
                  <span>solta o verbo • espaço protegido de escrita profunda</span>
                </div>

              </div>
            </div>,
            document.body
          )}

        {/* MODAL DE COMPARTILHAMENTO NA FOGUEIRA */}
        {showShareModal && (
          <div className="fixed inset-0 bg-tintaCarvao/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-papelClaro rounded-3xl border border-papelKraft/60 p-6 sm:p-8 max-w-md w-full shadow-kraft-lg space-y-5 relative">
              <button
                onClick={() => setShowShareModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-bgPlataforma text-tintaCarvao/60 hover:text-tintaCarvao transition-colors border border-papelKraft/40"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <span className="text-xs font-bold text-acentoTerracota lowercase block">
                  partilha poética
                </span>
                <h3 className="text-xl font-bold font-editorial text-acentoAzul lowercase">
                  compartilhar na nossa fogueira
                </h3>
              </div>

              <p className="text-xs text-tintaCarvao/80 lowercase leading-relaxed font-medium bg-bgPlataforma/60 p-4 rounded-2xl border border-papelKraft/40">
                seu texto será publicado no feed da comunidade para que outros membros possam ler, curtir e trocar impressões poéticas com você.
              </p>

              {/* OPÇÃO DE PUBLICAÇÃO PÚBLICA OU ANÔNIMA */}
              <div className="space-y-2 pt-1">
                <span className="text-xs font-bold text-acentoAzul lowercase block">
                  como prefere assinar esta partilha?
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAnonymousShare(false)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      !isAnonymousShare
                        ? 'bg-white border-acentoAzul text-acentoAzul font-bold shadow-sm'
                        : 'bg-bgPlataforma/60 border-papelKraft/40 text-tintaCarvao/70'
                    }`}
                  >
                    <UserCheck className="w-4 h-4 mb-1 text-acentoAzul" />
                    <span className="text-xs block lowercase">com meu nome</span>
                    <span className="text-[10px] opacity-70 block font-normal">{profile?.display_name || 'aluna'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsAnonymousShare(true)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      isAnonymousShare
                        ? 'bg-white border-acentoTerracota text-acentoTerracota font-bold shadow-sm'
                        : 'bg-bgPlataforma/60 border-papelKraft/40 text-tintaCarvao/70'
                    }`}
                  >
                    <EyeOff className="w-4 h-4 mb-1 text-acentoTerracota" />
                    <span className="text-xs block lowercase">de forma anônima</span>
                    <span className="text-[10px] opacity-70 block font-normal">membro anônimo</span>
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-papelKraft/30">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="btn-pill-secondary px-5 py-2 text-xs font-semibold lowercase"
                >
                  cancelar
                </button>
                <button
                  onClick={handleShare}
                  className="btn-pill-primary px-5 py-2 text-xs font-semibold lowercase inline-flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>confirmar e publicar</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* FOOTER DISCRETO */}
        <div className="pt-8 border-t border-papelKraft/40 text-center">
          <img
            src={BRAND_ASSETS.logos.horizontal}
            alt="solta o verbo"
            className="h-9 sm:h-11 w-auto mx-auto opacity-60 hover:opacity-100 transition-opacity"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/logo_horizontal_4.png';
            }}
          />
        </div>

      </div>
    </div>
  );
}
