import { useEffect, useState } from 'react';
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
} from 'lucide-react';
import type { Database } from '../lib/database.types';
import { BRAND_ASSETS } from '../config/brandAssets';

type WritingExercise = Database['public']['Tables']['writing_exercises']['Row'];

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

  const handleNew = () => {
    setCurrentExercise(null);
    setTitle('');
    setContent('');
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

      alert('texto publicado com sucesso na nossa fogueira!');
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

  const filteredExercises = exercises.filter((ex) =>
    ex.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calcula quantidade aproximada de palavras do texto atual
  const currentWordCount = useMemo(() => {
    const plainText = content.replace(/<[^>]*>/g, '').trim();
    if (!plainText) return 0;
    return plainText.split(/\s+/).length;
  }, [content]);

  return (
    <div className="min-h-screen bg-bgPlataforma text-tintaCarvao py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* CABEÇALHO DA PÁGINA ESCRITA (Brand Typography strictly lowercase) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-papelKraft/40 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-acentoAzul/10 border border-acentoAzul/20 text-acentoAzul text-xs font-bold lowercase tracking-wider mb-1.5 shadow-sm">
              <Feather className="w-3.5 h-3.5 text-acentoAzul" />
              <span>estúdio autoral</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold font-editorial text-acentoAzul lowercase">
              exercícios de escrita
            </h1>
            <p className="text-xs sm:text-sm text-tintaCarvao/75 lowercase font-medium mt-1">
              seu espaço pessoal e protegido para criar, cultivar e organizar seus textos.
            </p>
          </div>

          <button
            onClick={handleNew}
            className="btn-pill-primary px-5 py-2.5 text-xs sm:text-sm font-semibold shadow-sm inline-flex items-center gap-2 self-start sm:self-auto hover:scale-105 transition-transform"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>novo texto</span>
          </button>
        </div>

        {/* ESTRUTURA PRINCIPAL EM DUA COLUNAS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* PAINEL LATERAL: LISTA DE TEXTOS E BUSCA (lg:col-span-4) */}
          <div className="lg:col-span-4 bg-papelClaro rounded-3xl p-5 border border-papelKraft/60 shadow-kraft space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold font-editorial text-acentoAzul lowercase flex items-center gap-2">
                <BookMarked className="w-4 h-4 text-acentoTerracota" />
                <span>meus textos ({filteredExercises.length})</span>
              </h2>
            </div>

            {/* Campo de Busca Limpo */}
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

            {/* Lista dos Textos Criados */}
            <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
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

          {/* PAINEL CENTRAL: EDITOR OU ESTADO INICIAL (lg:col-span-8) */}
          <div className="lg:col-span-8">
            {isEditing || currentExercise ? (
              <div className="bg-papelClaro rounded-3xl p-6 sm:p-8 border border-papelKraft/60 shadow-kraft space-y-5">
                
                {/* Título do Texto & Contador em Muthazle */}
                <div className="space-y-3 border-b border-papelKraft/40 pb-4">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="título do seu texto..."
                    className="w-full text-2xl sm:text-3xl font-bold font-editorial text-acentoAzul bg-transparent border-none focus:outline-none placeholder:text-tintaCarvao/30 lowercase"
                  />
                  
                  <div className="flex items-center justify-between text-xs text-tintaCarvao/60">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-acentoTerracota" />
                      <span>produção atual: <strong className="font-gesto text-lg font-normal text-acentoAzul">{currentWordCount}</strong> palavras</span>
                    </span>
                    <span>editando em modo seguro</span>
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
                    onClick={handleNew}
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

        {/* MODAL DE COMPARTILHAMENTO NA FOGUEIRA */}
        {showShareModal && (
          <div className="fixed inset-0 bg-tintaCarvao/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-papelClaro rounded-3xl border border-papelKraft/60 p-6 sm:p-8 max-w-md w-full shadow-kraft-lg space-y-4 relative">
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

              <div className="pt-2 flex items-center justify-end gap-2">
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
