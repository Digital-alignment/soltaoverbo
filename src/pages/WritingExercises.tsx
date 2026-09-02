import { useEffect, useState, useMemo, useRef } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
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
  LayoutGrid,
  List,
  ChevronUp,
  Users,
  Pencil,
  ExternalLink,
  StickyNote,
  Wand2,
  Eye,
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
  description?: string;
}

// Convites Poéticos da Comunidade & Admins
const COMMUNITY_PROMPTS: CommunityPrompt[] = [
  {
    id: 'p1',
    title: 'escreva uma história com marcações de tempo e/ou datas.',
    badge: 'ao vivo',
    category: 'convite semanal #370',
    author: 'bruna riedel',
    description: 'o tempo como elemento poético. registre as horas, os minutos ou as estórias do calendário que marcaram um divisor de águas na sua memória.',
  },
  {
    id: 'p2',
    title: 'inclua a frase “não temos tempo para isso” no seu texto.',
    badge: 'ao vivo',
    category: 'convite semanal #371',
    author: 'júlia alvim',
    description: 'use essa provocação no meio do seu diálogo ou reflexão interna. para o que afinal nunca temos tempo — e o que acontece quando paramos?',
  },
  {
    id: 'p3',
    title: 'descreva uma cena inteira no decurso de poucos minutos, sem saltos no tempo.',
    badge: 'ao vivo',
    category: 'convite semanal #372',
    author: 'comunidade fogueira',
    description: 'desacelere a escrita. observe uma xícara esfriando, o vento na janela ou um olhar sustenido em tempo real.',
  },
  {
    id: 'p4',
    title: 'escreva sobre uma personagem que descobre uma memória física guardada numa caixa.',
    badge: 'ao vivo',
    category: 'convite semanal #373',
    author: 'comunidade fogueira',
    description: 'um bilhete antigo, um lenço ou uma fotografia em branco. o que desperta no corpo ao reencontrar o passado?',
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
    initialTitle: 'carta de desapego: o que deixo ir',
    initialContent: `<blockquote style="border-left: 3px solid #FD5E32; padding-left: 12px; margin-bottom: 16px; color: #140D82; font-style: italic;">“escreva para aquilo que você não precisa mais carregar no peito.”</blockquote><p>estou deixando ir a necessidade de...</p><p></p><p>liberto a mim mesma de...</p>`,
  },
  {
    id: 'gratidao',
    type: 'sparkles',
    title: 'diário de gratidão',
    subtitle: 'pequenos milagres da rotina',
    initialTitle: 'diário de gratidão: pequenos milagres',
    initialContent: `<blockquote style="border-left: 3px solid #FD5E32; padding-left: 12px; margin-bottom: 16px; color: #140D82; font-style: italic;">“nomeie a beleza oculta nas coisas simples do dia.”</blockquote><p>hoje sou grata por...</p><p></p>`,
  },
  {
    id: 'poema4',
    type: 'feather',
    title: 'poema em 4 estrofes',
    subtitle: 'início, meio, pausa e sopro',
    initialTitle: 'poema em 4 estrofes',
    initialContent: `<blockquote style="border-left: 3px solid #FD5E32; padding-left: 12px; margin-bottom: 16px; color: #140D82; font-style: italic;">“4 momentos de sentir: o despertar, a travessia, a pausa e a libertação.”</blockquote><p>I.<br/>[primeira estrofe: a chegada]</p><p></p><p>II.<br/>[segunda estrofe: o sentimento]</p><p></p><p>III.<br/>[terceira estrofe: o silêncio]</p><p></p><p>IV.<br/>[quarta estrofe: o recomeço]</p>`,
  },
];

// Marcos Poéticos de Contagem de Palavras (Metas de Escrita Fluida)
interface WordMilestone {
  minWords: number;
  label: string;
  icon: string;
}

const WORD_MILESTONES: WordMilestone[] = [
  { minWords: 1, label: 'a semente foi plantada', icon: '🌱' },
  { minWords: 50, label: 'primeiro sopro poético', icon: '🌬️' },
  { minWords: 150, label: 'corrente fluida de sentimentos', icon: '🌊' },
  { minWords: 300, label: 'página autoral viva', icon: '✨' },
  { minWords: 500, label: 'obra em plena floração', icon: '🌸' },
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
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // ABA PRINCIPAL DO TOPO: 'criador' | 'rituais'
  const [mainTab, setMainTab] = useState<'criador' | 'rituais'>('criador');

  // SUB-ABA DO ESTÚDIO DO CRIADOR: 'textos' | 'cadernos' | 'notas' | 'citacoes'
  const [activeTab, setActiveTab] = useState<'textos' | 'cadernos' | 'notas' | 'citacoes'>('textos');

  // MODO DE VISUALIZAÇÃO DA VITRINA: 'grid' | 'list'
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // MODAL PARA CRIAR/EDITAR NOTAS POÉTICAS
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteTitleInput, setNoteTitleInput] = useState('');
  const [noteContentInput, setNoteContentInput] = useState('');

  // MODAL DE DETALHES DE INSPIRAÇÃO DA COMUNIDADE
  const [selectedPromptModal, setSelectedPromptModal] = useState<CommunityPrompt | null>(null);

  // MODO FOCO (ZEN EDITOR) — ATIVO POR PADRÃO AO CRIAR/EDITAR
  const [isZenMode, setIsZenMode] = useState(false);

  // CITAÇÕES E NOTAS DO USUÁRIO
  const [allQuotes, setAllQuotes] = useState<Array<{ id: string; text: string; lessonTitle: string; createdAt: string }>>([]);
  const [allNotes, setAllNotes] = useState<Array<{ id: string; title: string; content: string; updatedAt: string }>>([]);

  // ESTADOS DE UPVOTE E CONCLUSÃO DE DESAFIOS (LOCALSTORAGE)
  const [upvotes, setUpvotes] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('soltaoverbo_prompt_upvotes');
      return saved ? JSON.parse(saved) : { p1: 42, p2: 28, p3: 65, p4: 19 };
    } catch {
      return { p1: 42, p2: 28, p3: 65, p4: 19 };
    }
  });

  const [userUpvoted, setUserUpvoted] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('soltaoverbo_user_upvoted');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [completions, setCompletions] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('soltaoverbo_prompt_completions');
      return saved ? JSON.parse(saved) : { p1: 128, p2: 94, p3: 156, p4: 47 };
    } catch {
      return { p1: 128, p2: 94, p3: 156, p4: 47 };
    }
  });

  const handleToggleUpvote = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isUpvoted = !!userUpvoted[id];
    const newUpvoted = { ...userUpvoted, [id]: !isUpvoted };
    const newUpvotes = { ...upvotes, [id]: (upvotes[id] || 0) + (isUpvoted ? -1 : 1) };
    setUserUpvoted(newUpvoted);
    setUpvotes(newUpvotes);
    try {
      localStorage.setItem('soltaoverbo_user_upvoted', JSON.stringify(newUpvoted));
      localStorage.setItem('soltaoverbo_prompt_upvotes', JSON.stringify(newUpvotes));
    } catch (err) {
      console.error(err);
    }
  };

  const loadQuotesAndNotes = () => {
    const quotes: Array<{ id: string; text: string; lessonTitle: string; createdAt: string }> = [];
    const notes: Array<{ id: string; title: string; content: string; updatedAt: string }> = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('soltaoverbo_quotes_')) {
        try {
          const itemQuotes = JSON.parse(localStorage.getItem(key) || '[]');
          if (Array.isArray(itemQuotes)) {
            quotes.push(...itemQuotes);
          }
        } catch (e) {
          console.error(e);
        }
      }
      if (key && key.startsWith('soltaoverbo_draft_')) {
        const content = localStorage.getItem(key);
        if (content && content.trim()) {
          const lessonId = key.replace('soltaoverbo_draft_', '');
          notes.push({
            id: lessonId,
            title: `rascunho de aula`,
            content: content,
            updatedAt: 'recém-salvo',
          });
        }
      }
    }
    setAllQuotes(quotes);
    setAllNotes(notes);
  };

  useEffect(() => {
    loadQuotesAndNotes();
  }, []);

  const handleSaveNoteModal = () => {
    if (!noteTitleInput.trim() && !noteContentInput.trim()) return;
    const noteId = `note_${Date.now()}`;
    const newNote = {
      id: noteId,
      title: noteTitleInput.trim() || 'nota poética',
      content: noteContentInput.trim(),
      updatedAt: 'hoje',
    };
    try {
      localStorage.setItem(`soltaoverbo_draft_${noteId}`, newNote.content);
      const updatedNotes = [newNote, ...allNotes];
      setAllNotes(updatedNotes);
    } catch (e) {
      console.error(e);
    }
    setShowNoteModal(false);
    setNoteTitleInput('');
    setNoteContentInput('');
  };

  const handleDeleteNote = (noteId: string) => {
    if (!confirm('deseja excluir esta nota?')) return;
    try {
      localStorage.removeItem(`soltaoverbo_draft_${noteId}`);
      setAllNotes(allNotes.filter((n) => n.id !== noteId));
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteQuote = (quoteId: string) => {
    if (!confirm('deseja excluir esta citação?')) return;
    try {
      const updated = allQuotes.filter((q) => q.id !== quoteId);
      setAllQuotes(updated);
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('soltaoverbo_quotes_')) {
          const itemQuotes = JSON.parse(localStorage.getItem(key) || '[]');
          const filtered = itemQuotes.filter((q: any) => q.id !== quoteId);
          localStorage.setItem(key, JSON.stringify(filtered));
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

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

  // Efeito do Temporizador regressivo
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

  const handleStartTimer = (mins: number) => {
    setTimerSeconds(mins * 60);
    setIsTimerRunning(true);
    setTimerFinished(false);
    setShowTimerPopover(false);
  };

  const handleStartCustomTimer = () => {
    const h = parseInt(customHours) || 0;
    const m = parseInt(customMinutes) || 0;
    const totalSecs = h * 3600 + m * 60;
    if (totalSecs > 0) {
      setTimerSeconds(totalSecs);
      setIsTimerRunning(true);
      setTimerFinished(false);
      setShowTimerPopover(false);
    }
  };

  const handleToggleTimer = () => {
    setIsTimerRunning((prev) => !prev);
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(null);
    setTimerFinished(false);
  };

  const formatTimer = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) {
      return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    }
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const location = useLocation();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (profile) {
      loadExercises();
    }
  }, [profile]);

  useEffect(() => {
    const isNewRequested = searchParams.get('new') === 'true' || location.state?.new === true;
    const promptState = location.state?.prompt;
    const sourceType = location.state?.sourceType || 'texto';
    const courseTitle = location.state?.courseTitle || '';
    const lessonTitle = location.state?.lessonTitle || '';

    if (isNewRequested || promptState || lessonTitle) {
      let defaultTitle = '';
      let initialHtml = '';

      if (lessonTitle) {
        const typeLabel = sourceType === 'citacao' ? 'citação' : sourceType === 'rascunho' ? 'rascunho' : 'exercício';
        defaultTitle = `${typeLabel} • ${lessonTitle}`;

        const quoteBlock = promptState
          ? `<blockquote style="border-left: 2px solid #FD5E32; padding-left: 14px; margin: 10px 0 0 0; color: #140D82; font-style: italic; font-size: 15px; line-height: 1.6;">“${promptState.replace(/\n/g, '<br/>')}”</blockquote>`
          : '';

        initialHtml = `<div style="margin-bottom: 24px; padding: 14px 18px; background-color: rgba(20, 13, 130, 0.03); border: 1px solid rgba(20, 13, 130, 0.12); border-radius: 16px;">
          <span style="display: block; font-size: 11px; letter-spacing: 0.05em; color: #FD5E32; font-weight: 600; text-transform: lowercase; margin-bottom: 4px; font-family: sans-serif;">
            origem • ${courseTitle || 'solta o verbo'}
          </span>
          <h4 style="font-size: 15px; color: #140D82; font-weight: 700; text-transform: lowercase; margin: 0 0 4px 0; font-family: sans-serif;">
            ${lessonTitle}
          </h4>
          ${quoteBlock}
        </div><p></p>`;
      } else if (promptState) {
        initialHtml = `<blockquote style="border-left: 3px solid #FD5E32; padding-left: 12px; margin-bottom: 16px; color: #140D82; font-style: italic;">“${promptState.replace(/\n/g, '<br/>')}”</blockquote><p></p>`;
      }

      handleNew(defaultTitle || undefined, initialHtml || undefined);
      window.history.replaceState({}, document.title);
    }
  }, [location.state, searchParams]);

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
  };

  const handleApplyTemplate = (tmpl: GuidedTemplate) => {
    handleNew(tmpl.initialTitle, tmpl.initialContent);
  };

  const handleApplyPrompt = (promptText: string) => {
    const initialContent = `<blockquote style="border-left: 3px solid #FD5E32; padding-left: 12px; margin-bottom: 16px; color: #140D82; font-style: italic;">“${promptText}”</blockquote><p></p>`;
    handleNew('convite poético', initialContent);
  };

  const handleEdit = (exercise: WritingExercise) => {
    setCurrentExercise(exercise);
    setTitle(exercise.title);
    setContent(exercise.content);
    setIsEditing(true);
    setIsZenMode(true);
  };

  const handleSave = async () => {
    if (!profile) return;

    setSaving(true);
    try {
      if (currentExercise) {
        const { error } = await supabase
          .from('writing_exercises')
          .update({
            title: title || 'texto sem título',
            content,
            updated_at: new Date().toISOString(),
          })
          .eq('id', currentExercise.id);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('writing_exercises')
          .insert({
            user_id: profile.id,
            title: title || 'texto sem título',
            content,
          })
          .select()
          .single();

        if (error) throw error;
        if (data) setCurrentExercise(data);
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

  // Dynamic Create Button Label based on Active Sub-Tab
  const getDynamicCreateLabel = () => {
    switch (activeTab) {
      case 'cadernos':
        return '+ criar novo caderno';
      case 'notas':
        return '+ criar nova nota';
      case 'citacoes':
        return '+ adicionar citação';
      case 'textos':
      default:
        return '+ criar novo texto';
    }
  };

  const handleDynamicCreateClick = () => {
    switch (activeTab) {
      case 'cadernos':
        handleNew('novo caderno');
        break;
      case 'notas':
        setShowNoteModal(true);
        break;
      case 'citacoes':
        handleNew('nova citação');
        break;
      case 'textos':
      default:
        handleNew();
        break;
    }
  };

  return (
    <div className="min-h-screen bg-bgPlataforma text-tintaCarvao py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* CABEÇALHO DA PÁGINA: escritas criativas (Muthazle 34px-44px Sem Bold) */}
        <div className="border-b border-papelKraft/40 pb-3">
          <h1 className="font-gesto font-normal text-[34px] sm:text-[44px] text-acentoAzul lowercase leading-tight">
            escrita criativa
          </h1>
        </div>

        {/* DUAS ABAS PRINCIPAIS DO TOPO: ESTÚDIO DO CRIADOR | RITUAIS & PROVOCAÇÕES */}
        <div className="flex items-center gap-2 bg-papelClaro p-1.5 rounded-3xl border border-papelKraft/50 shadow-sm">
          <button
            onClick={() => setMainTab('criador')}
            className={`flex-1 py-3 px-4 rounded-2xl font-gesto text-[20px] sm:text-[24px] lowercase transition-all flex items-center justify-center gap-2 cursor-pointer ${
              mainTab === 'criador'
                ? 'bg-acentoAzul text-white shadow-sm font-normal'
                : 'text-tintaCarvao/70 hover:text-tintaCarvao hover:bg-white/60'
            }`}
          >
            <Feather className="w-5 h-5 shrink-0" />
            <span>estúdio do criador</span>
          </button>

          <button
            onClick={() => setMainTab('rituais')}
            className={`flex-1 py-3 px-4 rounded-2xl font-gesto text-[20px] sm:text-[24px] lowercase transition-all flex items-center justify-center gap-2 cursor-pointer ${
              mainTab === 'rituais'
                ? 'bg-acentoTerracota text-white shadow-sm font-normal'
                : 'text-tintaCarvao/70 hover:text-tintaCarvao hover:bg-white/60'
            }`}
          >
            <Wand2 className="w-5 h-5 shrink-0" />
            <span>rituais & provocações poéticas</span>
          </button>
        </div>

        {/* ABA 1: ESTÚDIO DO CRIADOR */}
        {mainTab === 'criador' && (
          <div className="space-y-5 animate-fadeIn">
            
            {/* SUB-MENU DE ÍCONES + RÓTULO (TEXTOS, CADERNOS, NOTAS, CITAÇÕES) */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-papelClaro p-3 rounded-2xl border border-papelKraft/40 shadow-sm">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={() => setActiveTab('textos')}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold font-corpo lowercase transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === 'textos'
                      ? 'bg-acentoAzul text-white shadow-sm'
                      : 'text-tintaCarvao/75 hover:bg-white/80'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>textos ({exercises.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('cadernos')}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold font-corpo lowercase transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === 'cadernos'
                      ? 'bg-acentoAzul text-white shadow-sm'
                      : 'text-tintaCarvao/75 hover:bg-white/80'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>cadernos ({DEFAULT_NOTEBOOKS.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('notas')}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold font-corpo lowercase transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === 'notas'
                      ? 'bg-acentoAzul text-white shadow-sm'
                      : 'text-tintaCarvao/75 hover:bg-white/80'
                  }`}
                >
                  <StickyNote className="w-4 h-4 text-amber-500" />
                  <span>notas ({allNotes.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('citacoes')}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold font-corpo lowercase transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === 'citacoes'
                      ? 'bg-acentoAzul text-white shadow-sm'
                      : 'text-tintaCarvao/75 hover:bg-white/80'
                  }`}
                >
                  <BookMarked className="w-4 h-4 text-acentoTerracota" />
                  <span>citações ({allQuotes.length})</span>
                </button>
              </div>

              {/* SELETOR DE MODO DE VISUALIZAÇÃO: GRID OU LISTA */}
              <div className="flex items-center gap-1 bg-bgPlataforma p-1 rounded-xl border border-papelKraft/40">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    viewMode === 'grid' ? 'bg-white text-acentoAzul shadow-sm' : 'text-tintaCarvao/50 hover:text-tintaCarvao'
                  }`}
                  title="visualização em grade"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    viewMode === 'list' ? 'bg-white text-acentoAzul shadow-sm' : 'text-tintaCarvao/50 hover:text-tintaCarvao'
                  }`}
                  title="visualização em lista"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* BARRA DE AÇÕES: BOTÃO CRIAR DINÂMICO + CAMPO DE BUSCA */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <button
                onClick={handleDynamicCreateClick}
                className="px-6 py-2.5 rounded-2xl bg-acentoTerracota text-white font-gesto text-[20px] sm:text-[24px] lowercase shadow-sm hover:bg-acentoTerracota/90 hover:scale-105 transition-all inline-flex items-center gap-2 cursor-pointer shrink-0"
              >
                <Plus className="w-5 h-5 text-white" />
                <span>{getDynamicCreateLabel()}</span>
              </button>

              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-tintaCarvao/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="buscar no estúdio do criador..."
                  className="w-full pl-11 pr-4 py-2.5 bg-white border border-papelKraft/45 rounded-2xl text-xs sm:text-sm font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul transition-colors placeholder:text-tintaCarvao/45 lowercase shadow-sm"
                />
              </div>
            </div>

            {/* VITRINA DE CARTÕES RESPONSIVA (4 ITENS DESKTOP / 2 MOBILE NO MODO GRID) */}
            
            {/* SUB-ABA 1: TEXTOS */}
            {activeTab === 'textos' && (
              <div className={viewMode === 'grid' ? "grid grid-cols-2 lg:grid-cols-4 gap-3.5" : "space-y-2.5"}>
                {filteredExercises.map((exercise) => {
                  const titleText = exercise.title || 'texto sem título';
                  const cleanContent = exercise.content.replace(/<[^>]*>/g, '');

                  const titleDesktop = titleText.length > 40 ? titleText.slice(0, 40) + '...' : titleText;
                  const titleMobile = titleText.length > 25 ? titleText.slice(0, 25) + '...' : titleText;

                  const descDesktop = cleanContent.length > 70 ? cleanContent.slice(0, 70) + '...' : cleanContent;
                  const descMobile = cleanContent.length > 20 ? cleanContent.slice(0, 20) + '...' : cleanContent;

                  return (
                    <div
                      key={exercise.id}
                      onClick={() => handleEdit(exercise)}
                      className="p-4 rounded-2xl bg-white border border-papelKraft/45 hover:border-acentoAzul transition-all cursor-pointer group flex flex-col justify-between space-y-3 shadow-sm hover:shadow-md"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] font-corpo text-tintaCarvao/50">
                          <span>{new Date(exercise.updated_at).toLocaleDateString('pt-BR')}</span>
                          {exercise.is_published && (
                            <span className="px-2 py-0.5 rounded-full bg-acentoOliva/20 text-acentoAzul font-bold lowercase text-[9px]">
                              fogueira
                            </span>
                          )}
                        </div>
                        <h4 className="font-editorial text-base sm:text-lg font-bold text-acentoAzul group-hover:text-acentoTerracota transition-colors lowercase">
                          <span className="hidden sm:inline">{titleDesktop}</span>
                          <span className="sm:hidden">{titleMobile}</span>
                        </h4>
                        <p className="text-xs font-light font-corpo text-tintaCarvao/75 lowercase leading-relaxed">
                          <span className="hidden sm:inline">{descDesktop || 'sem conteúdo...'}</span>
                          <span className="sm:hidden">{descMobile || 'sem conteúdo...'}</span>
                        </p>
                      </div>

                      <div className="pt-2 border-t border-papelKraft/25 flex items-center justify-between">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(exercise);
                          }}
                          className="p-2 rounded-xl bg-bgPlataforma hover:bg-acentoAzul hover:text-white text-acentoAzul transition-colors cursor-pointer"
                          title="abrir no modo foco"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(exercise.id);
                          }}
                          className="p-2 hover:bg-red-50 text-tintaCarvao/40 hover:text-red-600 rounded-xl transition-colors cursor-pointer"
                          title="excluir texto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}

                {filteredExercises.length === 0 && (
                  <div className="col-span-full text-center py-12 space-y-2 bg-white/60 rounded-2xl border border-papelKraft/40 p-6 shadow-sm">
                    <FileText className="w-10 h-10 text-acentoAzul/30 mx-auto" />
                    <p className="text-xs text-tintaCarvao/70 font-editorial lowercase italic">
                      {searchQuery ? 'nenhum texto encontrado.' : 'nenhum texto criado ainda. crie o seu primeiro texto no modo foco!'}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* SUB-ABA 2: CADERNOS (VISUAL DE CADERNO COM LOMBADA) */}
            {activeTab === 'cadernos' && (
              <div className={viewMode === 'grid' ? "grid grid-cols-2 lg:grid-cols-4 gap-3.5" : "space-y-2.5"}>
                {DEFAULT_NOTEBOOKS.map((nb) => (
                  <div
                    key={nb.id}
                    onClick={() => handleNew(nb.title)}
                    className="p-4.5 rounded-2xl bg-white border-l-4 border-l-acentoTerracota border-y border-r border-papelKraft/45 shadow-sm hover:border-acentoAzul transition-all cursor-pointer group space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="p-2 rounded-xl bg-papelClaro text-acentoAzul">
                          {renderNotebookIcon(nb.type)}
                        </div>
                        <span className="text-[10px] font-bold text-acentoAzul/80 bg-acentoAzul/10 px-2 py-0.5 rounded-full lowercase">
                          caderno
                        </span>
                      </div>
                      <h4 className="text-sm font-bold font-editorial text-acentoAzul lowercase group-hover:text-acentoTerracota transition-colors line-clamp-2">
                        {nb.title}
                      </h4>
                      <p className="text-[11px] font-light font-corpo text-tintaCarvao/75 lowercase line-clamp-2 leading-relaxed">
                        {nb.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-papelKraft/25 flex items-center justify-between">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNew(nb.title);
                        }}
                        className="p-2 rounded-xl bg-bgPlataforma hover:bg-acentoTerracota hover:text-white text-acentoTerracota transition-colors cursor-pointer"
                        title="escrever neste caderno"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          alert('funcionalidade de excluir caderno próprio reservada para próximas atualizações.');
                        }}
                        className="p-2 hover:bg-red-50 text-tintaCarvao/30 hover:text-red-600 rounded-xl transition-colors cursor-pointer"
                        title="excluir caderno"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* SUB-ABA 3: NOTAS (VISUAL POST-IT ADESIVO) */}
            {activeTab === 'notas' && (
              <div className={viewMode === 'grid' ? "grid grid-cols-2 lg:grid-cols-4 gap-3.5" : "space-y-2.5"}>
                {allNotes.length === 0 ? (
                  <div className="col-span-full text-center py-12 space-y-2 bg-white/60 rounded-2xl border border-papelKraft/40 p-6 shadow-sm">
                    <StickyNote className="w-10 h-10 text-amber-500/40 mx-auto" />
                    <p className="text-xs text-tintaCarvao/70 font-editorial lowercase italic">
                      nenhuma nota criada ainda. clique no botão + nova nota para criar um post-it!
                    </p>
                  </div>
                ) : (
                  allNotes.map((n) => (
                    <div
                      key={n.id}
                      className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer group space-y-3 flex flex-col justify-between relative overflow-hidden"
                    >
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-12 h-3 bg-amber-200/50 rounded-sm rotate-1"></div>
                      
                      <div className="space-y-2 pt-1">
                        <div className="flex items-center justify-between text-[10px] font-corpo text-amber-900/60">
                          <span className="font-bold lowercase truncate max-w-[120px]">{n.title}</span>
                          <span>{n.updatedAt}</span>
                        </div>
                        <p className="text-xs font-corpo text-amber-950/90 line-clamp-3 lowercase leading-relaxed italic">
                          "{n.content}"
                        </p>
                      </div>

                      <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between">
                        <button
                          onClick={() => {
                            handleNew(
                              `nota rápida`,
                              `<blockquote style="border-left: 3px solid #FD5E32; padding-left: 14px; margin: 10px 0 0 0; color: #140D82; font-style: italic; font-size: 15px;">${n.content.replace(/\n/g, '<br/>')}</blockquote><p></p>`
                            );
                          }}
                          className="p-2 rounded-xl bg-amber-100 hover:bg-acentoTerracota hover:text-white text-acentoTerracota transition-colors cursor-pointer"
                          title="abrir nota no atelier"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteNote(n.id)}
                          className="p-2 hover:bg-amber-200/50 text-amber-900/40 hover:text-red-600 rounded-xl transition-colors cursor-pointer"
                          title="excluir nota"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* SUB-ABA 4: CITAÇÕES (VISUAL BILHETE POÉTICO) */}
            {activeTab === 'citacoes' && (
              <div className={viewMode === 'grid' ? "grid grid-cols-2 lg:grid-cols-4 gap-3.5" : "space-y-2.5"}>
                {allQuotes.length === 0 ? (
                  <div className="col-span-full text-center py-12 space-y-2 bg-white/60 rounded-2xl border border-papelKraft/40 p-6 shadow-sm">
                    <BookMarked className="w-10 h-10 text-acentoAzul/30 mx-auto" />
                    <p className="text-xs text-tintaCarvao/70 font-editorial lowercase italic">
                      nenhuma citação salva ainda. você pode guardar citações durante a leitura das aulas!
                    </p>
                  </div>
                ) : (
                  allQuotes.map((q) => {
                    const truncatedText = q.text.length > 80 ? q.text.slice(0, 80) + '...' : q.text;
                    return (
                      <div
                        key={q.id}
                        className="p-4 rounded-2xl bg-papelClaro border border-papelKraft/50 shadow-sm hover:border-acentoAzul transition-all cursor-pointer group space-y-3 flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-[10px] font-corpo text-acentoAzul">
                            <span className="font-bold lowercase truncate max-w-[130px]">{q.lessonTitle}</span>
                            <span className="text-tintaCarvao/40">{q.createdAt}</span>
                          </div>
                          <p className="text-xs font-editorial italic text-tintaCarvao/90 lowercase leading-relaxed border-l-2 border-acentoTerracota pl-2.5 py-0.5">
                            "{truncatedText}"
                          </p>
                        </div>

                        <div className="pt-2 border-t border-papelKraft/30 flex items-center justify-between">
                          <button
                            onClick={() => {
                              handleNew(
                                `citação • ${q.lessonTitle}`,
                                `<blockquote style="border-left: 2px solid #FD5E32; padding-left: 14px; margin: 10px 0 0 0; color: #140D82; font-style: italic; font-size: 15px;">“${q.text}”</blockquote><p></p>`
                              );
                            }}
                            className="p-2 rounded-xl bg-white hover:bg-acentoTerracota hover:text-white text-acentoTerracota border border-papelKraft/40 transition-colors cursor-pointer"
                            title="usar no atelier"
                          >
                            <Plus className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteQuote(q.id)}
                            className="p-2 hover:bg-red-50 text-tintaCarvao/40 hover:text-red-600 rounded-xl transition-colors cursor-pointer"
                            title="excluir citação"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

          </div>
        )}

        {/* ABA 2: RITUAIS & PROVOCAÇÕES POÉTICAS */}
        {mainTab === 'rituais' && (
          <div className="space-y-7 animate-fadeIn">
            
            {/* SUBSEÇÃO 1: RITUAIS GUIADOS */}
            <div className="bg-papelClaro rounded-3xl p-5 sm:p-7 border border-papelKraft/60 shadow-kraft space-y-4">
              <div className="flex items-center justify-between border-b border-papelKraft/30 pb-3">
                <div className="flex items-center gap-2">
                  <Wand2 className="w-5 h-5 text-acentoTerracota" />
                  <h3 className="font-editorial text-xl sm:text-2xl font-bold text-acentoAzul lowercase">
                    rituais guiados de escrita
                  </h3>
                </div>
                <span className="text-xs text-tintaCarvao/60 font-corpo lowercase">
                  estruturas imersivas passo a passo
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
                {GUIDED_TEMPLATES.map((tmpl) => (
                  <div
                    key={tmpl.id}
                    onClick={() => handleApplyTemplate(tmpl)}
                    className="p-4 rounded-2xl bg-white border border-papelKraft/60 shadow-sm hover:border-acentoTerracota transition-all cursor-pointer group space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded-full bg-acentoTerracota/10 text-acentoTerracota text-[10px] font-bold lowercase">
                          guiado
                        </span>
                        {renderTemplateIcon(tmpl.type)}
                      </div>
                      <h4 className="text-sm font-bold font-editorial text-acentoAzul lowercase group-hover:text-acentoTerracota transition-colors">
                        {tmpl.title}
                      </h4>
                      <p className="text-xs text-tintaCarvao/80 lowercase italic font-medium leading-relaxed">
                        “{tmpl.subtitle}”
                      </p>
                    </div>

                    <div className="pt-2 border-t border-papelKraft/30 flex items-center justify-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApplyTemplate(tmpl);
                        }}
                        className="p-2.5 rounded-xl bg-acentoTerracota text-white hover:bg-acentoTerracota/90 hover:scale-105 transition-all shadow-sm cursor-pointer"
                        title="iniciar ritual"
                      >
                        <Play className="w-4 h-4 text-white fill-white" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SUBSEÇÃO 2: INSPIRAÇÕES DA COMUNIDADE (CONVITES POÉTICOS COM UPVOTES E RANKING) */}
            <div className="bg-papelClaro rounded-3xl p-5 sm:p-7 border border-papelKraft/60 shadow-kraft space-y-4">
              <div className="flex items-center justify-between border-b border-papelKraft/30 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-acentoTerracota" />
                  <h3 className="font-editorial text-xl sm:text-2xl font-bold text-acentoAzul lowercase">
                    convites poéticos da fogueira
                  </h3>
                </div>
                <span className="text-xs font-bold text-acentoTerracota bg-acentoTerracota/10 px-3 py-1 rounded-full lowercase">
                  desafios votados pela comunidade
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                {COMMUNITY_PROMPTS.map((prompt) => {
                  const isUpvoted = !!userUpvoted[prompt.id];
                  const upvoteCount = upvotes[prompt.id] || 0;
                  const completionCount = completions[prompt.id] || 42;

                  return (
                    <div
                      key={prompt.id}
                      className="p-4 rounded-2xl bg-white border border-papelKraft/50 shadow-sm hover:border-acentoTerracota transition-all flex items-center justify-between gap-4"
                    >
                      {/* BOTAO DE UPVOTE DA COMUNIDADE */}
                      <button
                        onClick={(e) => handleToggleUpvote(prompt.id, e)}
                        className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all cursor-pointer shrink-0 min-w-[48px] ${
                          isUpvoted
                            ? 'bg-acentoTerracota text-white border-acentoTerracota shadow-sm'
                            : 'bg-papelClaro hover:bg-papelKraft/30 text-acentoAzul border-papelKraft/50'
                        }`}
                        title="votar nesta inspiração"
                      >
                        <ChevronUp className={`w-4 h-4 ${isUpvoted ? 'text-white' : 'text-acentoTerracota'}`} />
                        <span className="text-xs font-bold font-corpo">{upvoteCount}</span>
                      </button>

                      {/* CONTEÚDO PRINCIPAL */}
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full bg-acentoAzul/10 text-acentoAzul text-[10px] font-bold lowercase">
                            {prompt.badge}
                          </span>
                          <span className="text-[10px] text-tintaCarvao/60 font-medium lowercase truncate">
                            {prompt.category} • por {prompt.author}
                          </span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold font-editorial text-tintaCarvao lowercase leading-relaxed">
                          “{prompt.title}”
                        </h4>
                        <div className="flex items-center gap-1.5 text-[10px] text-tintaCarvao/60 font-medium pt-0.5">
                          <Users className="w-3 h-3 text-acentoOliva" />
                          <span>{completionCount} alunas concluíram</span>
                        </div>
                      </div>

                      {/* BOTÃO APENAS COM ÍCONE DE VER / COMEÇAR */}
                      <button
                        onClick={() => setSelectedPromptModal(prompt)}
                        className="p-3 rounded-2xl bg-acentoAzul hover:bg-acentoAzul/90 text-white transition-transform hover:scale-105 cursor-pointer shrink-0 shadow-sm"
                        title="ver detalhes e começar"
                      >
                        <Eye className="w-4.5 h-4.5 text-white" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* MODAL DE CRIAÇÃO RÁPIDA DE NOTA ADESIVA (ESTILO POST-IT) */}
        {showNoteModal && (
          <div className="fixed inset-0 bg-tintaCarvao/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-amber-50 rounded-3xl border border-amber-200 p-6 sm:p-8 max-w-md w-full shadow-kraft-lg space-y-4 relative">
              <button
                onClick={() => setShowNoteModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-amber-100 text-amber-900/60 hover:text-amber-950 transition-colors border border-amber-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <span className="text-xs font-bold text-amber-800 lowercase block">
                  bloco de notas poéticas
                </span>
                <h3 className="text-xl font-bold font-editorial text-amber-950 lowercase">
                  nova nota rápida (post-it)
                </h3>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  value={noteTitleInput}
                  onChange={(e) => setNoteTitleInput(e.target.value)}
                  placeholder="título da nota (ex: ideia de verso)..."
                  className="w-full px-4 py-2.5 bg-white/80 border border-amber-200 rounded-2xl text-xs sm:text-sm font-corpo text-amber-950 placeholder:text-amber-900/40 focus:outline-none focus:border-acentoTerracota lowercase"
                />

                <textarea
                  value={noteContentInput}
                  onChange={(e) => setNoteContentInput(e.target.value)}
                  placeholder="escreva seu rascunho rápido aqui..."
                  rows={4}
                  className="w-full px-4 py-3 bg-white/80 border border-amber-200 rounded-2xl text-xs sm:text-sm font-corpo text-amber-950 placeholder:text-amber-900/40 focus:outline-none focus:border-acentoTerracota lowercase resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-amber-200/60">
                <button
                  onClick={() => setShowNoteModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-amber-900 hover:bg-amber-100 lowercase transition-colors cursor-pointer"
                >
                  cancelar
                </button>
                <button
                  onClick={handleSaveNoteModal}
                  className="px-5 py-2 rounded-xl bg-acentoTerracota hover:bg-acentoTerracota/90 text-white font-gesto text-[18px] lowercase shadow-sm transition-all cursor-pointer"
                >
                  salvar nota
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL DE DETALHES DE INSPIRAÇÃO DA COMUNIDADE */}
        {selectedPromptModal && (
          <div className="fixed inset-0 bg-tintaCarvao/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-papelClaro rounded-3xl border border-papelKraft/60 p-6 sm:p-8 max-w-lg w-full shadow-kraft-lg space-y-5 relative">
              <button
                onClick={() => setSelectedPromptModal(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-bgPlataforma text-tintaCarvao/60 hover:text-tintaCarvao transition-colors border border-papelKraft/40 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-full bg-acentoAzul/10 text-acentoAzul text-xs font-bold lowercase inline-block mb-1">
                  {selectedPromptModal.badge} • {selectedPromptModal.category}
                </span>
                <h3 className="text-2xl font-bold font-editorial text-acentoAzul lowercase">
                  “{selectedPromptModal.title}”
                </h3>
                <p className="text-xs text-tintaCarvao/60 font-medium lowercase">
                  curado por {selectedPromptModal.author}
                </p>
              </div>

              {selectedPromptModal.description && (
                <p className="text-xs sm:text-sm font-corpo text-tintaCarvao/80 leading-relaxed lowercase bg-white p-4 rounded-2xl border border-papelKraft/40">
                  {selectedPromptModal.description}
                </p>
              )}

              <div className="flex items-center justify-between text-xs text-tintaCarvao/70 font-medium pt-1">
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-acentoOliva" />
                  <span>{completions[selectedPromptModal.id] || 42} alunas concluíram este desafio</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-3 border-t border-papelKraft/30">
                <button
                  onClick={() => {
                    alert('comentários do desafio disponíveis na fogueira ao vivo!');
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-white hover:bg-papelKraft/30 text-acentoAzul border border-papelKraft/45 text-xs font-bold lowercase transition-colors cursor-pointer"
                >
                  💬 comentar desafio
                </button>

                <button
                  onClick={() => {
                    const promptText = selectedPromptModal.title;
                    setSelectedPromptModal(null);
                    handleApplyPrompt(promptText);
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-acentoTerracota hover:bg-acentoTerracota/90 text-white font-gesto text-[20px] lowercase shadow-sm transition-all cursor-pointer"
                >
                  🚀 começar desafio
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
                
                {/* Header Superior Limpo do Modo Foco */}
                <div className="flex items-center justify-between border-b border-papelKraft/40 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-acentoTerracota lowercase flex items-center gap-1">
                      <Feather className="w-3.5 h-3.5" />
                      <span>estúdio autoral</span>
                    </span>

                    {/* Temporizador no Topo */}
                    {timerSeconds !== null && (
                      <div className="flex items-center gap-2 bg-acentoAzul/10 text-acentoAzul px-3 py-1 rounded-full text-xs font-mono font-bold">
                        <Timer className="w-3.5 h-3.5" />
                        <span>{formatTimer(timerSeconds)}</span>
                        <button
                          onClick={handleToggleTimer}
                          className="hover:opacity-80 p-0.5"
                          title={isTimerRunning ? 'pausar' : 'retomar'}
                        >
                          {isTimerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                        </button>
                        <button
                          onClick={handleResetTimer}
                          className="hover:opacity-80 p-0.5"
                          title="cancelar temporizador"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Botão de Temporizador */}
                    <div className="relative" ref={timerPopoverRef}>
                      <button
                        onClick={() => setShowTimerPopover((prev) => !prev)}
                        className={`p-2 rounded-xl border text-xs font-semibold lowercase transition-all flex items-center gap-1.5 ${
                          timerSeconds !== null
                            ? 'bg-acentoAzul text-white border-acentoAzul'
                            : 'bg-white hover:bg-papelClaro text-tintaCarvao border-papelKraft/50'
                        }`}
                        title="temporizador de ritual"
                      >
                        <Timer className="w-4 h-4 text-acentoTerracota" />
                        <span className="hidden sm:inline">temporizador</span>
                      </button>

                      {showTimerPopover && (
                        <div className="absolute right-0 mt-2 w-64 bg-papelClaro border border-papelKraft/60 rounded-2xl shadow-kraft-lg p-4 z-50 space-y-3 animate-fadeIn text-tintaCarvao">
                          <div className="flex items-center justify-between border-b border-papelKraft/40 pb-2">
                            <span className="text-xs font-bold text-acentoAzul lowercase flex items-center gap-1">
                              <Timer className="w-3.5 h-3.5 text-acentoTerracota" />
                              <span>sprint de escrita</span>
                            </span>
                            <button
                              onClick={() => setShowTimerPopover(false)}
                              className="text-tintaCarvao/50 hover:text-tintaCarvao"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="grid grid-cols-3 gap-1.5">
                            <button
                              onClick={() => handleStartTimer(5)}
                              className="px-2.5 py-1.5 bg-white hover:bg-acentoAzul hover:text-white border border-papelKraft/50 rounded-xl text-xs font-semibold lowercase transition-colors"
                            >
                              5 min
                            </button>
                            <button
                              onClick={() => handleStartTimer(15)}
                              className="px-2.5 py-1.5 bg-white hover:bg-acentoAzul hover:text-white border border-papelKraft/50 rounded-xl text-xs font-semibold lowercase transition-colors"
                            >
                              15 min
                            </button>
                            <button
                              onClick={() => handleStartTimer(30)}
                              className="px-2.5 py-1.5 bg-white hover:bg-acentoAzul hover:text-white border border-papelKraft/50 rounded-xl text-xs font-semibold lowercase transition-colors"
                            >
                              30 min
                            </button>
                          </div>

                          <div className="space-y-1.5 pt-1 border-t border-papelKraft/30">
                            <span className="text-[11px] text-tintaCarvao/70 lowercase block">
                              tempo personalizado:
                            </span>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                min="0"
                                max="23"
                                value={customHours}
                                onChange={(e) => setCustomHours(e.target.value)}
                                className="w-14 px-2 py-1 bg-white border border-papelKraft/50 rounded-xl text-xs text-center font-mono text-tintaCarvao"
                                placeholder="00h"
                              />
                              <span className="text-xs font-bold text-tintaCarvao/60">h</span>
                              <input
                                type="number"
                                min="1"
                                max="59"
                                value={customMinutes}
                                onChange={(e) => setCustomMinutes(e.target.value)}
                                className="w-14 px-2 py-1 bg-white border border-papelKraft/50 rounded-xl text-xs text-center font-mono text-tintaCarvao"
                                placeholder="15m"
                              />
                              <span className="text-xs font-bold text-tintaCarvao/60">m</span>
                            </div>
                            <button
                              onClick={handleStartCustomTimer}
                              className="w-full mt-2 py-1.5 bg-acentoTerracota hover:bg-acentoTerracota/90 text-white rounded-xl text-xs font-bold lowercase shadow-sm transition-colors"
                            >
                              iniciar temporizador
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => setShowSettingsModal(true)}
                      className="p-2 rounded-xl bg-white hover:bg-papelClaro border border-papelKraft/50 text-tintaCarvao/70 hover:text-tintaCarvao transition-colors"
                      title="configurações do editor"
                    >
                      <Settings className="w-4 h-4" />
                    </button>

                    <button
                      onClick={handleExitZenMode}
                      className="p-2 rounded-xl bg-white hover:bg-papelClaro border border-papelKraft/50 text-tintaCarvao/70 hover:text-tintaCarvao transition-colors flex items-center gap-1.5 text-xs font-semibold lowercase"
                      title="concluir e fechar modo foco"
                    >
                      <Minimize2 className="w-4 h-4" />
                      <span className="hidden sm:inline">concluir</span>
                    </button>
                  </div>
                </div>

                {/* Título Editável do Texto */}
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="título do seu texto..."
                  className="w-full text-2xl sm:text-4xl font-bold font-editorial text-acentoAzul bg-transparent border-b border-papelKraft/30 pb-2 focus:outline-none focus:border-acentoTerracota placeholder:text-tintaCarvao/30 lowercase"
                />

                {/* Editor RichText */}
                <div className="flex-1 my-4">
                  <RichTextEditor
                    content={content}
                    onChange={setContent}
                    placeholder="comece a soltar a sua voz aqui sem interrupções..."
                    editorSettings={editorSettings}
                  />
                </div>

                {/* Rodapé do Modo Foco */}
                <div className="flex items-center justify-between border-t border-papelKraft/40 pt-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-tintaCarvao/60 font-medium lowercase">
                      {currentWordCount} {currentWordCount === 1 ? 'palavra' : 'palavras'}
                    </span>
                    {currentMilestone && (
                      <span className="text-xs font-bold text-acentoTerracota bg-acentoTerracota/10 px-2.5 py-0.5 rounded-full lowercase flex items-center gap-1 animate-fadeIn">
                        <span>{currentMilestone.icon}</span>
                        <span>{currentMilestone.label}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleDownload}
                      className="p-2 rounded-xl bg-white hover:bg-papelClaro text-tintaCarvao/70 border border-papelKraft/40 text-xs font-semibold lowercase transition-colors"
                      title="baixar texto"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setShowShareModal(true)}
                      className="p-2 rounded-xl bg-acentoTerracota hover:bg-acentoTerracota/90 text-white text-xs font-semibold lowercase transition-all shadow-sm"
                      title="partilhar na fogueira"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            </div>,
            document.body
          )}

      </div>
    </div>
  );
}
