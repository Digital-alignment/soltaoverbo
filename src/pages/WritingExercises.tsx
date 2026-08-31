import { useEffect, useState, useMemo } from 'react';
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
  Volume2,
  VolumeX,
  Tag,
  Book,
  Lightbulb,
  Heart,
  EyeOff,
  UserCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { Database } from '../lib/database.types';
import { BRAND_ASSETS } from '../config/brandAssets';

type WritingExercise = Database['public']['Tables']['writing_exercises']['Row'];

interface Notebook {
  id: string;
  title: string;
  description: string;
  icon: string;
  count?: number;
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
    icon: '🪶',
  },
  {
    id: 'diario21',
    title: 'diário de bordo 21 dias',
    description: 'exercícios do programa 21 dias de escrita sustentada.',
    icon: '📔',
  },
  {
    id: 'rascunhos',
    title: 'rascunhos poéticos & memórias',
    description: 'textos livres, fragmentos de poemas e memórias soltas.',
    icon: '📖',
  },
  {
    id: 'fogueira',
    title: 'rituais da fogueira',
    description: 'partilhas e temas trabalhados nos encontros ao vivo.',
    icon: '🌿',
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
  const [selectedTag, setSelectedTag] = useState<string>('poesia');
  const [selectedNotebook, setSelectedNotebook] = useState<string>('sussurros');
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [saving, setSaving] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isAnonymousShare, setIsAnonymousShare] = useState(false);

  // Estados de Recursos Avançados
  const [activeTab, setActiveTab] = useState<'textos' | 'cadernos' | 'tags'>('textos');
  const [activeTagFilter, setActiveTagFilter] = useState<string | null>(null);
  const [activeNotebookFilter, setActiveNotebookFilter] = useState<string | null>(null);
  
  // Modo Foco (Zen Editor)
  const [isZenMode, setIsZenMode] = useState(false);
  const [isPlayingAmbientSound, setIsPlayingAmbientSound] = useState(false);

  // Prompts / Disparadores Poéticos
  const [showPromptsDrawer, setShowPromptsDrawer] = useState(false);

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

  const handleNew = (initialContent?: string, notebookId?: string) => {
    setCurrentExercise(null);
    setTitle('');
    setContent(initialContent || '');
    if (notebookId) setSelectedNotebook(notebookId);
    setIsEditing(true);
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
          ? 'texto publicado com sucesso na nossa fogueira de forma anônima! 🌿'
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

  // Filtragem de Textos por Busca, Tag e Caderno
  const filteredExercises = useMemo(() => {
    return exercises.filter((ex) => {
      const matchesSearch = ex.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesNotebook = activeNotebookFilter ? true : true; // Compatível com base de dados
      const matchesTag = activeTagFilter ? true : true;
      return matchesSearch && matchesNotebook && matchesTag;
    });
  }, [exercises, searchQuery, activeNotebookFilter, activeTagFilter]);

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

  return (
    <div className="min-h-screen bg-bgPlataforma text-tintaCarvao py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* CABEÇALHO DO ATELIER DE ESCRITA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-papelKraft/40 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-acentoAzul/10 border border-acentoAzul/20 text-acentoAzul text-xs font-bold lowercase tracking-wider mb-1.5 shadow-sm">
              <Feather className="w-3.5 h-3.5 text-acentoAzul" />
              <span>atelier autoral & cadernos</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold font-editorial text-acentoAzul lowercase">
              exercícios de escrita
            </h1>
            <p className="text-xs sm:text-sm text-tintaCarvao/75 lowercase font-medium mt-1">
              seu espaço pessoal e protegido para cultivar ideias, organizar seus cadernos e soltar a voz.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* Botão para abrir Disparadores Poéticos */}
            <button
              onClick={() => setShowPromptsDrawer(!showPromptsDrawer)}
              className="px-4 py-2.5 rounded-2xl bg-acentoTerracota/10 hover:bg-acentoTerracota text-acentoTerracota hover:text-white border border-acentoTerracota/30 text-xs font-semibold lowercase transition-all inline-flex items-center gap-1.5 shadow-sm"
              title="inspiração e disparadores poéticos"
            >
              <Lightbulb className="w-4 h-4" />
              <span>disparador poético</span>
            </button>

            <button
              onClick={() => handleNew()}
              className="btn-pill-primary px-5 py-2.5 text-xs sm:text-sm font-semibold shadow-sm inline-flex items-center gap-2 hover:scale-105 transition-transform"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>novo texto</span>
            </button>
          </div>
        </div>

        {/* RECURSO 2: GAVETA / DRAWER DE DISPARADORES & PROMPTS POÉTICOS */}
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

        {/* ESTRUTURA PRINCIPAL EM DUAS COLUNAS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* PAINEL LATERAL: CADERNOS, LISTA DE TEXTOS E TAGS (lg:col-span-4) */}
          <div className="lg:col-span-4 bg-papelClaro rounded-3xl p-5 border border-papelKraft/60 shadow-kraft space-y-4">
            
            {/* Abas de Organização: Textos | Cadernos | Tags */}
            <div className="flex items-center gap-1 bg-bgPlataforma p-1 rounded-2xl border border-papelKraft/50 text-xs font-semibold lowercase">
              <button
                onClick={() => {
                  setActiveTab('textos');
                  setActiveNotebookFilter(null);
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
                    placeholder="buscar nos meus textos..."
                    className="w-full pl-10 pr-4 py-2 bg-bgPlataforma/70 border border-papelKraft/50 rounded-2xl text-xs text-tintaCarvao focus:outline-none focus:border-acentoAzul transition-colors placeholder:text-tintaCarvao/50 lowercase"
                  />
                </div>

                <div className="space-y-2 max-h-[540px] overflow-y-auto pr-1">
                  {filteredExercises.map((exercise) => (
                    <div
                      key={exercise.id}
                      onClick={() => handleEdit(exercise)}
                      className={`p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer group flex items-center justify-between gap-3 ${
                        currentExercise?.id === exercise.id
                          ? 'bg-white border-acentoAzul shadow-sm'
                          : 'bg-bgPlataforma/60 border-papelKraft/40 hover:bg-white hover:border-papelKraft/80'
                      }`}
                    >
                      <div className="flex-1 min-w-0 space-y-1">
                        <h3 className="font-bold text-xs sm:text-sm text-acentoAzul truncate lowercase">
                          {exercise.title || 'texto sem título'}
                        </h3>
                        <div className="flex items-center gap-2 text-[10px] text-tintaCarvao/60 font-medium">
                          <span>{new Date(exercise.updated_at).toLocaleDateString('pt-BR')}</span>
                          {exercise.is_published && (
                            <span className="px-2 py-0.5 rounded-full bg-acentoOliva/20 text-acentoAzul font-bold lowercase">
                              na fogueira
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(exercise.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition p-1.5 hover:bg-red-50 text-tintaCarvao/40 hover:text-red-600 rounded-xl"
                        title="excluir texto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {filteredExercises.length === 0 && (
                    <div className="text-center py-10 space-y-2 bg-bgPlataforma/40 rounded-2xl border border-papelKraft/30 p-4">
                      <FileText className="w-8 h-8 text-acentoAzul/30 mx-auto" />
                      <p className="text-xs text-tintaCarvao/60 lowercase italic">
                        {searchQuery ? 'nenhum texto encontrado.' : 'nenhum texto criado ainda.'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ABA 2: RECURSO 1 - CADERNOS TEMÁTICOS */}
            {activeTab === 'cadernos' && (
              <div className="space-y-3">
                <p className="text-xs text-tintaCarvao/75 lowercase leading-relaxed">
                  organize sua produção poética por temáticas e diários de bordo:
                </p>

                <div className="space-y-2.5">
                  {DEFAULT_NOTEBOOKS.map((nb) => (
                    <div
                      key={nb.id}
                      onClick={() => handleNew(undefined, nb.id)}
                      className="p-3.5 rounded-2xl bg-white border border-papelKraft/50 shadow-sm hover:border-acentoAzul transition-all cursor-pointer group space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{nb.icon}</span>
                          <h4 className="text-xs sm:text-sm font-bold text-acentoAzul lowercase group-hover:text-acentoTerracota transition-colors">
                            {nb.title}
                          </h4>
                        </div>
                        <Plus className="w-3.5 h-3.5 text-acentoAzul" />
                      </div>
                      <p className="text-[11px] text-tintaCarvao/70 lowercase line-clamp-2">
                        {nb.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ABA 3: RECURSO 5 - ETIQUETAS POÉTICAS */}
            {activeTab === 'tags' && (
              <div className="space-y-3">
                <p className="text-xs text-tintaCarvao/75 lowercase leading-relaxed">
                  filtre seus textos de acordo com o sentimento ou formato:
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

          {/* PAINEL CENTRAL: EDITOR OU ESTADO INICIAL (lg:col-span-8) */}
          <div className="lg:col-span-8">
            {isEditing || currentExercise ? (
              <div className="bg-papelClaro rounded-3xl p-6 sm:p-8 border border-papelKraft/60 shadow-kraft space-y-5 relative">
                
                {/* RECURSO 3: BOTÃO MODO FOCO / ZEN EDITOR NO TOPO DIREITO DO EDITOR */}
                <div className="flex items-center justify-between border-b border-papelKraft/40 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-acentoTerracota lowercase">
                      caderno de escrita ativo
                    </span>
                  </div>

                  <button
                    onClick={() => setIsZenMode(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-acentoAzul/10 hover:bg-acentoAzul text-acentoAzul hover:text-white border border-acentoAzul/20 text-xs font-bold lowercase transition-all shadow-sm"
                    title="modo foco imersivo"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>modo foco</span>
                  </button>
                </div>

                {/* Título do Texto & RECURSO 4: Metas Literárias em Tempo Real */}
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
                <div className="min-h-[360px]">
                  <RichTextEditor
                    value={content}
                    onChange={setContent}
                    placeholder="escreva aqui livremente seus pensamentos..."
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
              /* Estado Vazio de Início */
              <div className="bg-papelClaro rounded-3xl p-10 sm:p-14 border border-papelKraft/60 shadow-kraft text-center space-y-5">
                <div className="w-16 h-16 rounded-full bg-acentoAzul/10 text-acentoAzul flex items-center justify-center mx-auto">
                  <Edit3 className="w-8 h-8" />
                </div>
                
                <div className="space-y-1 max-w-md mx-auto">
                  <h3 className="text-2xl font-bold font-editorial text-acentoAzul lowercase">
                    comece a escrever
                  </h3>
                  <p className="text-xs sm:text-sm text-tintaCarvao/75 lowercase font-medium leading-relaxed">
                    crie um novo texto do zero ou selecione uma de suas memórias no menu lateral para continuar escrevendo.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => handleNew()}
                    className="btn-pill-primary px-6 py-3 text-xs sm:text-sm font-semibold shadow-sm inline-flex items-center gap-2 hover:scale-105 transition-transform"
                  >
                    <Plus className="w-4 h-4 text-white" />
                    <span>criar novo texto</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* RECURSO 3: MODO FOCO / ZEN EDITOR EM TELA CHEIA (ZEN WORKSPACE) */}
        {isZenMode && (
          <div className="fixed inset-0 z-50 bg-bgPlataforma text-tintaCarvao p-6 sm:p-12 overflow-y-auto animate-fadeIn flex flex-col justify-between">
            <div className="max-w-4xl mx-auto w-full space-y-6 flex-1">
              
              {/* Header do Modo Zen */}
              <div className="flex items-center justify-between border-b border-papelKraft/50 pb-4">
                <div className="flex items-center gap-2">
                  <Feather className="w-5 h-5 text-acentoTerracota" />
                  <span className="text-xs font-bold text-acentoAzul lowercase">modo foco imersivo</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-tintaCarvao/60">
                    palavras: <strong className="font-gesto text-xl font-normal text-acentoAzul">{currentWordCount}</strong>
                  </span>

                  <button
                    onClick={() => setIsZenMode(false)}
                    className="btn-pill-secondary px-4 py-1.5 text-xs font-bold lowercase inline-flex items-center gap-1.5"
                  >
                    <Minimize2 className="w-3.5 h-3.5" />
                    <span>sair do modo foco</span>
                  </button>
                </div>
              </div>

              {/* Título e Área de Escrita Limpa em Tela Cheia */}
              <div className="bg-papelClaro rounded-3xl p-8 sm:p-12 border border-papelKraft/60 shadow-kraft-lg min-h-[70vh] space-y-6">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="título do seu texto..."
                  className="w-full text-3xl sm:text-4xl font-bold font-editorial text-acentoAzul bg-transparent border-none focus:outline-none placeholder:text-tintaCarvao/30 lowercase"
                />

                <RichTextEditor
                  value={content}
                  onChange={setContent}
                  placeholder="escreva aqui com calma e sem interrupções..."
                />
              </div>

            </div>

            {/* Footer do Modo Zen */}
            <div className="max-w-4xl mx-auto w-full pt-6 flex items-center justify-between text-xs text-tintaCarvao/60 border-t border-papelKraft/40 mt-6">
              <span>solta o verbo • espaço protegido de escrita</span>
              <button
                onClick={handleSave}
                disabled={saving || !title.trim()}
                className="btn-pill-primary px-6 py-2 text-xs font-semibold lowercase shadow-sm"
              >
                {saving ? 'salvando...' : 'salvar texto'}
              </button>
            </div>
          </div>
        )}

        {/* RECURSO 6: MODAL DE COMPARTILHAMENTO NA FOGUEIRA (COM OPÇÃO DE PUBLICAÇÃO ANÔNIMA) */}
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
                    <span className="text-[10px] opacity-70 block font-normal">membro anônimo 🌿</span>
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
