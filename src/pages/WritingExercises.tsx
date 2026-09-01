import { useEffect, useState, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import RichTextEditor from '../components/RichTextEditor';
import EditorSettingsModal, {
  DEFAULT_EDITOR_SETTINGS,
  EditorSettings,
} from '../components/EditorSettingsModal';
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
  Bell,
  BookOpen,
  Send,
  MessageSquare,
  Settings,
  Hourglass,
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

interface CommunityPrompt {
  id: string;
  title: string;
  badge: string;
  category: string;
  author: string;
}

// Convites Poéticos da Comunidade & Admins (Inspirado na Referência)
const COMMUNITY_PROMPTS: CommunityPrompt[] = [
  {
    id: 'p1',
    title: 'escreva uma história com marcações de tempo e/ou datas.',
    badge: 'ao vivo',
    category: 'convite semanal #370',
    author: 'bruna riedel',
  },
  {
    id: 'p2',
    title: 'inclua a frase “não temos tempo para isso” no seu texto.',
    badge: 'ao vivo',
    category: 'convite semanal #371',
    author: 'júlia alvim',
  },
  {
    id: 'p3',
    title: 'descreva uma cena inteira no decurso de poucos minutos, sem saltos no tempo.',
    badge: 'ao vivo',
    category: 'convite semanal #372',
    author: 'comunidade fogueira',
  },
  {
    id: 'p4',
    title: 'escreva sobre uma personagem que descobre uma memória física guardada numa caixa.',
    badge: 'ao vivo',
    category: 'convite semanal #373',
    author: 'comunidade fogueira',
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
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // MODO FOCO (ZEN EDITOR) — ATIVO POR PADRÃO AO CRIAR/EDITAR
  const [isZenMode, setIsZenMode] = useState(false);

  // CONFIGURAÇÕES DO EDITOR COM PERSISTÊNCIA EM LOCALSTORAGE
  const [editorSettings, setEditorSettings] = useState<EditorSettings>(() => {
    try {
      const saved = localStorage.getItem('soltaoverbo_editor_settings');
      return saved ? JSON.parse(saved) : DEFAULT_EDITOR_SETTINGS;
    } catch {
      return DEFAULT_EDITOR_SETTINGS;
    }
  });

  const handleUpdateSettings = (newSettings: Partial<EditorSettings>) => {
    setEditorSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem('soltaoverbo_editor_settings', JSON.stringify(updated));
      } catch (err) {
        console.error('erro ao salvar configurações:', err);
      }
      return updated;
    });
  };

  // Estados de Abas Laterais & Filtros na Vitrina
  const [activeTab, setActiveTab] = useState<'textos' | 'cadernos' | 'tags'>('textos');
  const [activeTagFilter, setActiveTagFilter] = useState<string | null>(null);

  // TEMPORIZADOR DO RITUAL (Sprint de Escrita Manual)
  const [timerSeconds, setTimerSeconds] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerFinished, setTimerFinished] = useState(false);
  const [showTimerPopover, setShowTimerPopover] = useState(false);
  const [customHours, setCustomHours] = useState('0');
  const [customMinutes, setCustomMinutes] = useState('15');
  const timerPopoverRef = useRef<HTMLDivElement>(null);

  // Fechar popover do temporizador ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (timerPopoverRef.current && !timerPopoverRef.current.contains(event.target as Node)) {
        setShowTimerPopover(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    if (h > 0) {
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
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

  // AO CRIAR NOVO TEXTO -> ABRE DIRETO NO MODO FOCO (TELA CHEIA)
  const handleNew = (initialTitle?: string, initialContent?: string) => {
    setCurrentExercise(null);
    setTitle(initialTitle || '');
    setContent(initialContent || '');
    setIsEditing(true);
    setIsZenMode(true);
    setShowTemplatesModal(false);
  };

  const handleApplyTemplate = (tmpl: GuidedTemplate) => {
    handleNew(tmpl.initialTitle, tmpl.initialContent);
  };

  const handleApplyPrompt = (promptText: string) => {
    const initialContent = `<blockquote style="border-left: 3px solid #FD5E32; padding-left: 12px; margin-bottom: 16px; color: #140D82; font-style: italic;">“${promptText}”</blockquote><p></p>`;
    handleNew('convite poético', initialContent);
  };

  // AO EDITAR TEXTO EXISTENTE -> ABRE DIRETO NO MODO FOCO
  const handleEdit = (exercise: WritingExercise) => {
    setCurrentExercise(exercise);
    setTitle(exercise.title);
    setContent(exercise.content);
    setIsEditing(true);
    setIsZenMode(true);
  };

  const handleSave = async () => {
    if (!profile) return;

    // Se o título estiver em branco mas houver conteúdo, gerar um título padrão poético com a data
    const finalTitle = title.trim() || `texto sem título • ${new Date().toLocaleDateString('pt-BR')}`;
    if (!title.trim()) {
      setTitle(finalTitle);
    }

    setSaving(true);
    try {
      if (currentExercise) {
        const { error } = await supabase
          .from('writing_exercises')
          .update({
            title: finalTitle,
            content: content,
          })
          .eq('id', currentExercise.id);

        if (error) throw error;
      } else {
        const { data, error } = await supabase.from('writing_exercises').insert({
          user_id: profile.id,
          title: finalTitle,
          content: content,
          is_published: false,
        }).select().single();

        if (error) throw error;
        if (data) {
          setCurrentExercise(data);
        }
      }

      await loadExercises();
      setIsEditing(false);
    } catch (error) {
      console.error('erro ao salvar:', error);
    } finally {
      setSaving(false);
    }
  };

  // AO SAIR DO MODO FOCO -> SALVA O TEXTO AUTOMATICAMENTE SE HOUVER CONTEÚDO
  const handleExitZenMode = async () => {
    const cleanContent = content.replace(/<[^>]*>/g, '').trim();
    const hasTitle = title.trim().length > 0;

    if (cleanContent.length > 0 || hasTitle) {
      await handleSave();
    }

    setIsZenMode(false);
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
        setIsZenMode(false);
      }
    }
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

  // Marco poético atual com base no número de palavras
  const currentMilestone = useMemo(() => {
    if (!editorSettings.showMilestones || currentWordCount === 0) return null;
    let reached = WORD_MILESTONES[0];
    for (const m of WORD_MILESTONES) {
      if (currentWordCount >= m.minWords) {
        reached = m;
      }
    }
    return reached;
  }, [currentWordCount, editorSettings.showMilestones]);

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
        
        {/* CABEÇALHO LIMPO DA PÁGINA (VITRINA DE ESCRITA & CADERNOS) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-papelKraft/40 pb-4">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-bold font-editorial text-acentoAzul lowercase">
              exercícios de escrita
            </h1>
            <p className="text-base sm:text-lg text-tintaCarvao/85 font-medium font-editorial lowercase leading-relaxed">
              seu espaço protegido para criar, organizar seus cadernos e soltar a voz.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => handleNew()}
              className="btn-pill-primary px-6 py-2.5 text-xs sm:text-sm font-bold shadow-sm inline-flex items-center gap-2 hover:scale-105 transition-transform"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>novo texto (modo foco)</span>
            </button>
          </div>
        </div>

        {/* VITRINA EM BENTO GRID (4 CARDS PRINCIPAIS) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* CARD 1: HERO CTA DE ESCRITA (SPAN 12 DA BENTO GRID) */}
          <div className="lg:col-span-12 bg-papelClaro rounded-3xl p-6 sm:p-8 border border-papelKraft/60 shadow-kraft space-y-4 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-acentoAzul/10 text-acentoAzul text-xs font-bold lowercase">
                <Feather className="w-3.5 h-3.5" />
                <span>estúdio autoral & modo foco</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-editorial text-acentoAzul lowercase">
                pronta para transformar sentimentos em palavras?
              </h2>
              <p className="text-xs sm:text-sm text-tintaCarvao/80 font-editorial lowercase leading-relaxed">
                clique para abrir o modo foco imersivo com tela limpa e sem distrações.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={() => handleNew()}
                className="btn-pill-primary px-7 py-3 text-xs sm:text-sm font-bold lowercase shadow-sm inline-flex items-center gap-2 hover:scale-105 transition-transform"
              >
                <Plus className="w-4 h-4 text-white" />
                <span>criar novo texto</span>
              </button>

              <button
                onClick={() => setShowTemplatesModal(true)}
                className="px-5 py-3 rounded-2xl bg-white hover:bg-bgPlataforma text-acentoAzul border border-papelKraft/50 text-xs font-semibold lowercase transition-all inline-flex items-center gap-1.5 shadow-sm"
              >
                <LayoutTemplate className="w-4 h-4 text-acentoTerracota" />
                <span>rituais guiados →</span>
              </button>
            </div>
          </div>

          {/* CARD 2: MEUS TEXTOS & CADERNOS (SPAN 7 DA BENTO GRID) */}
          <div className="lg:col-span-7 bg-papelClaro rounded-3xl p-5 sm:p-6 border border-papelKraft/60 shadow-kraft space-y-4">
            
            <div className="flex items-center justify-between border-b border-papelKraft/30 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-acentoAzul" />
                <h3 className="text-base font-bold font-editorial text-acentoAzul lowercase">
                  meus textos & cadernos
                </h3>
              </div>
              <span className="text-xs font-gesto text-xl font-normal text-acentoTerracota">
                {exercises.length} textos
              </span>
            </div>

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
                cadernos ({DEFAULT_NOTEBOOKS.length})
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
                    placeholder="buscar nos meus textos..."
                    className="w-full pl-10 pr-3 py-2 bg-bgPlataforma/70 border border-papelKraft/50 rounded-2xl text-xs text-tintaCarvao focus:outline-none focus:border-acentoAzul transition-colors placeholder:text-tintaCarvao/50 lowercase"
                  />
                </div>

                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                  {filteredExercises.map((exercise) => (
                    <div
                      key={exercise.id}
                      onClick={() => handleEdit(exercise)}
                      className="p-3.5 rounded-2xl bg-white border border-papelKraft/50 hover:border-acentoAzul transition-all cursor-pointer group flex items-center justify-between gap-3 shadow-sm"
                    >
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <Feather className="w-3.5 h-3.5 text-acentoTerracota shrink-0" />
                          <h4 className="font-bold text-xs sm:text-sm text-acentoAzul truncate lowercase group-hover:text-acentoTerracota transition-colors">
                            {exercise.title || 'texto sem título'}
                          </h4>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-tintaCarvao/60 font-medium">
                          <span>atualizado em {new Date(exercise.updated_at).toLocaleDateString('pt-BR')}</span>
                          {exercise.is_published && (
                            <span className="px-2 py-0.5 rounded-full bg-acentoOliva/20 text-acentoAzul font-bold lowercase">
                              fogueira
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(exercise);
                          }}
                          className="px-2.5 py-1 rounded-xl bg-bgPlataforma hover:bg-acentoAzul hover:text-white text-acentoAzul text-[11px] font-semibold lowercase transition-colors"
                          title="abrir no modo foco"
                        >
                          abrir no foco →
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(exercise.id);
                          }}
                          className="p-1.5 hover:bg-red-50 text-tintaCarvao/40 hover:text-red-600 rounded-lg transition-colors"
                          title="excluir texto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {filteredExercises.length === 0 && (
                    <div className="text-center py-10 space-y-2 bg-bgPlataforma/50 rounded-2xl border border-papelKraft/40 p-4 shadow-sm">
                      <FileText className="w-8 h-8 text-acentoAzul/30 mx-auto" />
                      <p className="text-xs text-tintaCarvao/70 font-editorial lowercase italic">
                        {searchQuery ? 'nenhum texto encontrado.' : 'nenhum texto criado ainda. crie o seu primeiro texto no modo foco!'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ABA 2: CADERNOS TEMÁTICOS */}
            {activeTab === 'cadernos' && (
              <div className="space-y-3">
                <p className="text-xs text-tintaCarvao/75 lowercase leading-relaxed">
                  organize sua produção literária por diários temáticos:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {DEFAULT_NOTEBOOKS.map((nb) => (
                    <div
                      key={nb.id}
                      onClick={() => handleNew(nb.title)}
                      className="p-3.5 rounded-2xl bg-white border border-papelKraft/50 shadow-sm hover:border-acentoAzul transition-all cursor-pointer group space-y-1.5"
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
                      <p className="text-[11px] text-tintaCarvao/70 lowercase line-clamp-2 leading-relaxed">
                        {nb.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ABA 3: ETIQUETAS POÉTICAS */}
            {activeTab === 'tags' && (
              <div className="space-y-3">
                <p className="text-xs text-tintaCarvao/75 lowercase leading-relaxed">
                  filtre sua escrita por sentimentos ou estilos poéticos:
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  {POETIC_TAGS.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        setActiveTagFilter(activeTagFilter === tag ? null : tag);
                        setActiveTab('textos');
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold lowercase border transition-all ${
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

          {/* CARD 3: CONVITES POÉTICOS DA COMUNIDADE (SPAN 5 DA BENTO GRID - INSPIRADO NA REFERÊNCIA) */}
          <div className="lg:col-span-5 bg-papelClaro rounded-3xl p-5 sm:p-6 border border-papelKraft/60 shadow-kraft space-y-4">
            
            <div className="flex items-center justify-between border-b border-papelKraft/30 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-acentoTerracota" />
                <h3 className="text-base font-bold font-editorial text-acentoAzul lowercase">
                  convites poéticos da comunidade
                </h3>
              </div>
              <span className="text-[10px] font-bold text-acentoTerracota bg-acentoTerracota/10 px-2 py-0.5 rounded-full lowercase">
                desafios semanais
              </span>
            </div>

            <p className="text-xs text-tintaCarvao/80 font-editorial lowercase leading-relaxed">
              provocações diárias e semanais curadas por alunas e admins para inspirar a sua voz:
            </p>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {COMMUNITY_PROMPTS.map((prompt) => (
                <div
                  key={prompt.id}
                  className="bg-white p-3.5 rounded-2xl border border-papelKraft/50 shadow-sm space-y-2.5 hover:border-acentoTerracota transition-all"
                >
                  <h4 className="text-xs sm:text-sm font-bold font-editorial text-tintaCarvao lowercase leading-relaxed">
                    “{prompt.title}”
                  </h4>

                  <div className="flex items-center justify-between pt-1 border-t border-papelKraft/30">
                    <div className="flex items-center gap-1.5 text-[10px] text-tintaCarvao/60 font-medium">
                      <span className="px-2 py-0.5 rounded-full bg-acentoAzul/10 text-acentoAzul font-bold lowercase">
                        {prompt.badge}
                      </span>
                      <span>{prompt.category}</span>
                    </div>

                    <button
                      onClick={() => handleApplyPrompt(prompt.title)}
                      className="text-[11px] font-bold text-acentoTerracota hover:text-acentoAzul transition-colors lowercase flex items-center gap-1"
                    >
                      <span>escrever sobre este tema →</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* CARD 4: RITUAIS GUIADOS & TEMPLATES (SPAN 12 DA BENTO GRID) */}
          <div className="lg:col-span-12 bg-papelClaro rounded-3xl p-6 sm:p-8 border border-papelKraft/60 shadow-kraft space-y-4">
            
            <div className="flex items-center justify-between border-b border-papelKraft/30 pb-3">
              <div className="flex items-center gap-2">
                <LayoutTemplate className="w-5 h-5 text-acentoTerracota" />
                <h3 className="text-xl font-bold font-editorial text-acentoAzul lowercase">
                  rituais guiados de escrita
                </h3>
              </div>
              <span className="text-xs text-tintaCarvao/60 lowercase">
                selecione um modelo para abrir direto no modo foco
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
              {GUIDED_TEMPLATES.map((tmpl) => (
                <div
                  key={tmpl.id}
                  onClick={() => handleApplyTemplate(tmpl)}
                  className="p-4 rounded-2xl bg-white border border-papelKraft/60 shadow-sm hover:border-acentoTerracota transition-all cursor-pointer group space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
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
                    <span className="text-xs font-bold text-acentoTerracota lowercase group-hover:underline flex items-center gap-1">
                      <span>iniciar ritual →</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

        {/* MODAL: RITUAIS GUIADOS (ACESSÍVEL DE QUALQUER LUGAR) */}
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

        {/* MODAL DE CONFIGURAÇÕES DO EDITOR */}
        <EditorSettingsModal
          isOpen={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
          settings={editorSettings}
          onUpdateSettings={handleUpdateSettings}
        />

        {/* MODO FOCO / ZEN EDITOR EM TELA CHEIA (100% COBRINDO A TELA VIA REACT PORTAL NO DOM BODY) */}
        {isZenMode &&
          createPortal(
            <div className="fixed inset-0 z-[999999] w-screen h-screen min-h-screen bg-bgPlataforma text-tintaCarvao p-4 sm:p-8 overflow-y-auto animate-fadeIn flex flex-col justify-between">
              <div className="max-w-5xl mx-auto w-full space-y-4 flex-1 flex flex-col justify-between">
                
                {/* Header Superior Limpo do Modo Foco (Métricas à esquerda, Apenas Ícones de Ação à direita) */}
                <div className="flex items-center justify-between border-b border-papelKraft/30 pb-3">
                  
                  {/* Lado Esquerdo: Contador de Palavras, Timer de Sprint & Selos Poéticos */}
                  <div className="flex items-center gap-3">
                    {editorSettings.showWordCount && (
                      <span className="text-xs font-medium text-tintaCarvao/80 lowercase">
                        produção: <strong className="font-editorial text-lg font-bold text-acentoAzul">{currentWordCount}</strong> palavras
                      </span>
                    )}

                    {/* TEMPORIZADOR DE SPRINT COM ÍCONE DE AMPULHETA (REFERÊNCIA media_1788224288012.png) */}
                    {editorSettings.showTimer && (
                      <div className="relative" ref={timerPopoverRef}>
                        {timerSeconds === null ? (
                          // ESTADO INICIAL: BOTÃO DE AMPULHETA PARA DEFINIR TEMPO MANUALMENTE
                          <button
                            onClick={() => setShowTimerPopover(!showTimerPopover)}
                            className="px-3 py-1.5 rounded-full bg-white hover:bg-bgPlataforma text-acentoTerracota border border-papelKraft/50 transition-all shadow-sm flex items-center gap-1.5 text-xs font-bold font-editorial lowercase active:scale-95"
                            title="definir tempo do sprint"
                          >
                            <Hourglass className="w-4 h-4 text-acentoTerracota" />
                            <span>definir tempo</span>
                          </button>
                        ) : (
                          // ESTADO ATIVO OU PAUSADO: MOSTRA O CRONÔMETRO COM AMPULHETA E CONTROLES
                          <div className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-papelKraft/50 shadow-sm">
                            <Hourglass className={`w-4 h-4 text-acentoTerracota ${isTimerRunning ? 'animate-spin' : ''}`} />
                            <span className="font-editorial text-sm font-bold text-acentoTerracota">
                              {formatTimerStr(timerSeconds)}
                            </span>

                            {isTimerRunning ? (
                              <button
                                onClick={pauseTimer}
                                className="p-1 hover:bg-papelKraft/20 rounded-full text-acentoTerracota"
                                title="pausar"
                              >
                                <Pause className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <button
                                onClick={resumeTimer}
                                className="p-1 hover:bg-papelKraft/20 rounded-full text-acentoTerracota"
                                title="continuar"
                              >
                                <Play className="w-3.5 h-3.5 fill-current" />
                              </button>
                            )}

                            <button
                              onClick={stopTimer}
                              className="p-1 hover:bg-papelKraft/20 rounded-full text-tintaCarvao/50 hover:text-acentoTerracota"
                              title="parar sprint"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}

                        {/* CARD POPOVER DE TEMPO MANUAL DA REFERÊNCIA media_1788224288012.png */}
                        {showTimerPopover && (
                          <div className="absolute top-full mt-2 left-0 z-50 bg-[#EDE6D4] rounded-2xl border border-papelKraft/60 shadow-kraft-lg p-3.5 space-y-3 w-64 animate-fadeIn">
                            <div className="text-xs font-bold font-editorial text-acentoAzul lowercase flex items-center gap-1.5 border-b border-papelKraft/30 pb-1.5">
                              <Hourglass className="w-4 h-4 text-acentoTerracota" />
                              <span>temporizador de sprint poético</span>
                            </div>

                            <div className="flex items-center justify-between gap-2">
                              <div className="flex-1 space-y-1 text-center">
                                <span className="text-[10px] font-bold font-editorial text-tintaCarvao/70 lowercase block">horas</span>
                                <input
                                  type="number"
                                  min="0"
                                  max="23"
                                  value={customHours}
                                  onChange={(e) => setCustomHours(e.target.value)}
                                  className="w-full text-center px-2 py-1.5 bg-white border border-papelKraft/40 rounded-xl text-xs font-bold font-editorial text-acentoAzul focus:outline-none"
                                  placeholder="0"
                                />
                              </div>

                              <span className="text-sm font-bold text-tintaCarvao/50 pt-4">:</span>

                              <div className="flex-1 space-y-1 text-center">
                                <span className="text-[10px] font-bold font-editorial text-tintaCarvao/70 lowercase block">minutos</span>
                                <input
                                  type="number"
                                  min="0"
                                  max="59"
                                  value={customMinutes}
                                  onChange={(e) => setCustomMinutes(e.target.value)}
                                  className="w-full text-center px-2 py-1.5 bg-white border border-papelKraft/40 rounded-xl text-xs font-bold font-editorial text-acentoAzul focus:outline-none"
                                  placeholder="15"
                                />
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                const h = Math.max(0, parseInt(customHours) || 0);
                                const m = Math.max(0, parseInt(customMinutes) || 0);
                                const totalMins = h * 60 + m;
                                if (totalMins > 0) {
                                  startTimer(totalMins);
                                  setShowTimerPopover(false);
                                }
                              }}
                              className="w-full btn-pill-primary py-2 text-xs font-bold lowercase shadow-sm flex items-center justify-center gap-1.5"
                            >
                              <Play className="w-3.5 h-3.5 fill-current text-white" />
                              <span>iniciar sprint</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {currentMilestone && (
                      <span className="text-[11px] font-bold text-acentoAzul bg-acentoAzul/10 px-3 py-1.5 rounded-full border border-acentoAzul/20 lowercase hidden md:inline-flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-acentoAzul" />
                        <span className="font-editorial">{currentMilestone.title}</span>
                      </span>
                    )}
                  </div>

                  {/* Lado Direito: Apenas Ícones de Ação Arredondados com Tooltips em Hover */}
                  <div className="flex items-center gap-2">
                    {/* Ícone de Configurações do Editor */}
                    <div className="relative group">
                      <button
                        onClick={() => setShowSettingsModal(true)}
                        className="p-2.5 rounded-full bg-white hover:bg-bgPlataforma text-acentoAzul border border-papelKraft/50 transition-all shadow-sm active:scale-95 flex items-center justify-center"
                      >
                        <Settings className="w-4 h-4 text-acentoAzul" />
                      </button>
                      <div className="absolute top-full mt-2 right-0 hidden group-hover:block bg-tintaCarvao text-white text-[10px] font-editorial px-2.5 py-1 rounded-md whitespace-nowrap z-50 shadow-sm pointer-events-none lowercase">
                        configurações do editor
                      </div>
                    </div>

                    {/* Ícone de Salvar Texto */}
                    <div className="relative group">
                      <button
                        onClick={handleSave}
                        disabled={saving || !title.trim()}
                        className="p-2.5 rounded-full bg-acentoTerracota hover:bg-acentoTerracota/90 text-white border border-acentoTerracota/40 transition-all shadow-sm active:scale-95 disabled:opacity-50 flex items-center justify-center"
                      >
                        <Save className="w-4 h-4 text-white" />
                      </button>
                      <div className="absolute top-full mt-2 right-0 hidden group-hover:block bg-tintaCarvao text-white text-[10px] font-editorial px-2.5 py-1 rounded-md whitespace-nowrap z-50 shadow-sm pointer-events-none lowercase">
                        {saving ? 'salvando...' : 'salvar texto (ctrl+s)'}
                      </div>
                    </div>

                    {/* Ícone de Sair do Modo Foco */}
                    <div className="relative group">
                      <button
                        onClick={handleExitZenMode}
                        className="p-2.5 rounded-full bg-acentoAzul hover:bg-acentoAzul/90 text-white border border-acentoAzul/40 transition-all shadow-sm active:scale-95 flex items-center justify-center"
                      >
                        <Minimize2 className="w-4 h-4 text-white" />
                      </button>
                      <div className="absolute top-full mt-2 right-0 hidden group-hover:block bg-tintaCarvao text-white text-[10px] font-editorial px-2.5 py-1 rounded-md whitespace-nowrap z-50 shadow-sm pointer-events-none lowercase">
                        sair do modo foco
                      </div>
                    </div>
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
                      onSave={handleSave}
                      placeholder="escreva aqui com calma e sem interrupções..."
                      flat={true}
                      zoomLevel={editorSettings.zoomLevel}
                      onZoomChange={(newZoom) => handleUpdateSettings({ zoomLevel: newZoom })}
                      fontFamily={editorSettings.fontFamily}
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
