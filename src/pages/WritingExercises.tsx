import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import RichTextEditor from '../components/RichTextEditor';
import {
  PlusCircle,
  Save,
  Download,
  Share2,
  Trash2,
  Edit,
  FileText,
  Search,
} from 'lucide-react';
import type { Database } from '../lib/database.types';

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
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar o texto. Tente novamente.');
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
        alert('Este texto já foi publicado na Nossa Fogueira!');
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

      alert('Texto publicado com sucesso na Nossa Fogueira!');
      setShowShareModal(false);
      await loadExercises();
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
      alert('Erro ao compartilhar. Tente novamente.');
    }
  };

  const handleDelete = async (exerciseId: string) => {
    if (!confirm('Tem certeza que deseja excluir este texto?')) return;

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

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f0e6d1' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Exercícios de Escrita</h1>
          <p className="text-gray-600">Seu espaço pessoal para criar e organizar seus textos</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <button
                onClick={handleNew}
                className="w-full text-white py-3 rounded-lg font-medium transition shadow-lg mb-6 flex items-center justify-center"
                style={{ backgroundColor: '#1f008f', fontFamily: "'Playpen Sans', cursive" }}
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                Novo Texto
              </button>

              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar textos..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {filteredExercises.map((exercise) => (
                  <div
                    key={exercise.id}
                    className={`p-3 rounded-lg cursor-pointer transition group ${
                      currentExercise?.id === exercise.id
                        ? 'bg-amber-100'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleEdit(exercise)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate text-sm">
                          {exercise.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(exercise.updated_at).toLocaleDateString('pt-BR')}
                        </p>
                        {exercise.is_published && (
                          <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                            Publicado
                          </span>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(exercise.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition p-1 hover:bg-red-100 rounded"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                ))}

                {filteredExercises.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">
                      {searchQuery ? 'Nenhum texto encontrado' : 'Nenhum texto ainda'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            {isEditing || currentExercise ? (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="mb-6">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Título do seu texto..."
                    className="w-full text-3xl font-bold border-none focus:outline-none focus:ring-0 placeholder-gray-300"
                  />
                </div>

                <RichTextEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Comece a escrever..."
                />

                <div className="flex flex-wrap gap-3 mt-6">
                  <button
                    onClick={handleSave}
                    disabled={saving || !title.trim()}
                    className="flex items-center text-white px-6 py-3 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    style={{ backgroundColor: '#1f008f', fontFamily: "'Playpen Sans', cursive" }}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'Salvando...' : 'Salvar'}
                  </button>

                  {currentExercise && (
                    <>
                      <button
                        onClick={handleDownload}
                        className="flex items-center bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition"
                        style={{ fontFamily: "'Playpen Sans', cursive" }}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Baixar
                      </button>

                      <button
                        onClick={() => setShowShareModal(true)}
                        disabled={currentExercise.is_published}
                        className="flex items-center bg-blue-100 text-blue-700 px-6 py-3 rounded-lg font-medium hover:bg-blue-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ fontFamily: "'Playpen Sans', cursive" }}
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        {currentExercise.is_published ? 'Já Publicado' : 'Compartilhar'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <Edit className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Comece a escrever
                </h3>
                <p className="text-gray-600 mb-6">
                  Crie um novo texto ou selecione um existente para editar
                </p>
                <button
                  onClick={handleNew}
                  className="inline-flex items-center text-white px-6 py-3 rounded-lg font-medium transition shadow-lg"
                  style={{ backgroundColor: '#1f008f', fontFamily: "'Playpen Sans', cursive" }}
                >
                  <PlusCircle className="w-5 h-5 mr-2" />
                  Novo Texto
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer Image */}
        <div className="mt-16 mb-8 flex justify-center">
          <img
            src="/logo_horizontal_4.png"
            alt="Solta o Verbo"
            className="w-full max-w-md px-4 sm:max-w-lg md:max-w-xl lg:max-w-2xl opacity-90 hover:opacity-100 transition-opacity duration-300"
          />
        </div>
      </div>

      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Compartilhar na Nossa Fogueira
            </h3>
            <p className="text-gray-600 mb-6">
              Seu texto será publicado na comunidade e outros membros poderão ler, curtir e
              comentar. Deseja continuar?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowShareModal(false)}
                className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition"
                style={{ fontFamily: "'Playpen Sans', cursive" }}
              >
                Cancelar
              </button>
              <button
                onClick={handleShare}
                className="flex-1 text-white px-6 py-3 rounded-lg font-medium transition"
                style={{ backgroundColor: '#1f008f', fontFamily: "'Playpen Sans', cursive" }}
              >
                Publicar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
