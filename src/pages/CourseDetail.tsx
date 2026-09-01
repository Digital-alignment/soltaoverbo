import { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import LoadingPage from '../components/LoadingPage';
import YouTubeEmbed from '../components/YouTubeEmbed';
import RichTextEditor from '../components/RichTextEditor';
import AudioPlayer from '../components/AudioPlayer';
import { isYouTubeUrl } from '../lib/youtubeUtils';
import {
  ArrowLeft,
  BookOpen,
  Download,
  Video,
  CheckCircle,
  Play,
  Maximize2,
  Minimize2,
  Pencil,
  Lock,
  MessageCircle,
  Share2,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Type,
  Heart,
  Crown,
  List
} from 'lucide-react';
import type { Database } from '../lib/database.types';

type Course = Database['public']['Tables']['courses']['Row'];
type Lesson = Database['public']['Tables']['course_lessons']['Row'];
type Material = Database['public']['Tables']['course_materials']['Row'];
type AudioFile = Database['public']['Tables']['lesson_audio_files']['Row'];
type Comment = Database['public']['Tables']['comments']['Row'] & {
  user_profile?: Database['public']['Tables']['users_profiles']['Row'];
  replies?: Comment[];
};

export default function CourseDetail() {
  const { courseId } = useParams();
  const { profile } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showComments, setShowComments] = useState(true);

  // MODO FOCO DA AULA (ZEN READER)
  const [isZenModeOpen, setIsZenModeOpen] = useState(false);
  const [zenFontSize, setZenFontSize] = useState<'sm' | 'md' | 'lg'>('md');

  const desktopContentRef = useRef<HTMLDivElement>(null);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    if (courseId) {
      loadCourse();
    }
  }, [courseId]);

  useEffect(() => {
    if (selectedLesson) {
      loadMaterials(selectedLesson.id);
      loadAudioFiles(selectedLesson.id);
      loadComments(selectedLesson.id);

      if (isInitialLoad.current) {
        isInitialLoad.current = false;
        return;
      }
    }
  }, [selectedLesson]);

  const loadCourse = async () => {
    try {
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();

      if (courseError) throw courseError;
      setCourse(courseData);

      const { data: lessonsData, error: lessonsError } = await supabase
        .from('course_lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true });

      if (lessonsError) throw lessonsError;
      setLessons(lessonsData || []);
      if (lessonsData && lessonsData.length > 0) {
        setSelectedLesson(lessonsData[0]);
      }
    } catch (error) {
      console.error('Erro ao carregar curso:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMaterials = async (lessonId: string) => {
    const { data, error } = await supabase
      .from('course_materials')
      .select('*')
      .eq('lesson_id', lessonId);

    if (!error && data) {
      setMaterials(data);
    } else {
      setMaterials([]);
    }
  };

  const loadAudioFiles = async (lessonId: string) => {
    const { data, error } = await supabase
      .from('lesson_audio_files')
      .select('*')
      .eq('lesson_id', lessonId)
      .order('order_index', { ascending: true });

    if (!error && data) {
      setAudioFiles(data);
    } else {
      setAudioFiles([]);
    }
  };

  const loadComments = async (lessonId: string) => {
    const { data, error } = await supabase
      .from('comments')
      .select(
        `
        *,
        user_profile:users_profiles(*)
      `
      )
      .eq('lesson_id', lessonId)
      .is('parent_comment_id', null)
      .order('created_at', { ascending: false });

    if (!error && data) {
      const commentsWithReplies = await Promise.all(
        data.map(async (comment) => {
          const { data: replies } = await supabase
            .from('comments')
            .select(
              `
              *,
              user_profile:users_profiles(*)
            `
            )
            .eq('parent_comment_id', comment.id)
            .order('created_at', { ascending: true });

          return { ...comment, replies: replies || [] };
        })
      );
      setComments(commentsWithReplies as Comment[]);
    } else {
      setComments([]);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !selectedLesson || !profile) return;

    const { error } = await supabase.from('comments').insert({
      lesson_id: selectedLesson.id,
      user_id: profile.id,
      parent_comment_id: replyTo,
      content: newComment.trim(),
    });

    if (!error) {
      setNewComment('');
      setReplyTo(null);
      loadComments(selectedLesson.id);
    }
  };

  const handleNextLesson = () => {
    if (!selectedLesson) return;
    const currentIndex = lessons.findIndex((l) => l.id === selectedLesson.id);
    if (currentIndex < lessons.length - 1) {
      setSelectedLesson(lessons[currentIndex + 1]);
    }
  };

  const handlePrevLesson = () => {
    if (!selectedLesson) return;
    const currentIndex = lessons.findIndex((l) => l.id === selectedLesson.id);
    if (currentIndex > 0) {
      setSelectedLesson(lessons[currentIndex - 1]);
    }
  };

  const handleOpenAtelierWithPrompt = () => {
    if (!selectedLesson) return;
    navigate('/exercises?new=true');
  };

  if (loading) {
    return <LoadingPage />;
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-bgPlataforma text-tintaCarvao flex items-center justify-center p-6">
        <div className="bg-papelClaro rounded-3xl p-8 border border-papelKraft/60 shadow-kraft max-w-md w-full text-center space-y-4">
          <BookOpen className="w-12 h-12 text-acentoAzul mx-auto" />
          <h2 className="text-2xl font-bold font-editorial text-acentoAzul lowercase">curso não encontrado</h2>
          <Link
            to="/programs"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-2xl bg-acentoTerracota text-white font-gesto text-[20px] sm:text-[23px] lowercase shadow-sm"
          >
            ← voltar às oficinas
          </Link>
        </div>
      </div>
    );
  }

  const currentLessonIndex = selectedLesson ? lessons.findIndex((l) => l.id === selectedLesson.id) : 0;
  const progressPercent = lessons.length > 0 ? Math.round(((currentLessonIndex + 1) / lessons.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-bgPlataforma text-tintaCarvao pb-16">
      
      {/* 1. CABEÇALHO UNIFICADO E FLUIDO (SEM CAIXAS OU BORDES, FUNDO IGUAL À PÁGINA) */}
      <div className="bg-bgPlataforma pt-4 pb-3 px-4 sm:px-6 lg:px-8 border-b border-papelKraft/30 transition-all">
        <div className="max-w-7xl mx-auto space-y-2.5">
          
          {/* Linha 1: Voltar + Metadatos & Ações */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <Link
              to="/programs"
              className="inline-flex items-center gap-2 text-acentoAzul hover:text-acentoTerracota transition-colors text-[20px] sm:text-[23px] font-normal font-gesto lowercase shrink-0"
            >
              <ArrowLeft className="w-4 h-4 text-acentoAzul" />
              <span>voltar aos cursos</span>
            </Link>

            <div className="flex items-center gap-2.5 flex-wrap shrink-0">
              <span className="px-3 py-0.5 rounded-full text-xs font-normal font-corpo bg-white border border-papelKraft/50 text-acentoTerracota lowercase shadow-sm inline-flex items-center gap-1">
                <Crown className="w-3.5 h-3.5 text-acentoTerracota" />
                <span>{course.course_type === 'free' ? 'gratuito' : 'exclusivo premium'}</span>
              </span>

              <div className="flex items-center gap-2 bg-white px-3.5 py-0.5 rounded-full border border-papelKraft/50 shadow-sm">
                <span className="text-xs font-normal font-corpo text-acentoAzul lowercase">
                  aula {currentLessonIndex + 1} de {lessons.length}
                </span>
                <span className="text-tintaCarvao/30 text-xs">•</span>
                <span className="text-xs font-normal font-corpo text-acentoTerracota lowercase">
                  {progressPercent}% concluído
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsZenModeOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-acentoAzul text-white font-gesto text-[20px] sm:text-[23px] lowercase hover:bg-acentoAzul/90 transition-all shadow-sm cursor-pointer"
                title="abrir modo foco em tela cheia"
              >
                <Maximize2 className="w-3.5 h-3.5 text-white" />
                <span>modo foco</span>
              </button>
            </div>
          </div>

          {/* Linha 2: Título e Descrição Compacta no Próprio Fundo da Página */}
          <div className="space-y-1 pt-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-editorial text-acentoAzul lowercase leading-tight">
              {course.title}
            </h1>
            {course.description && (
              <p className="text-xs sm:text-sm font-light font-corpo text-tintaCarvao/75 lowercase leading-relaxed max-w-4xl">
                {course.description}
              </p>
            )}
          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8">

        {/* 3. LAYOUT MASTER EM 2 COLUNAS DE ALTA ELEGÂNCIA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* COLUNA DA ESQUERDA (8 COLS): HUB PRINCIPAL DA AULA */}
          <div className="lg:col-span-8 space-y-6" ref={desktopContentRef}>
            {selectedLesson && (
              <>
                {/* CANVAS DA AULA EM BRANCO PURO / PAPEL FINO */}
                <div className="bg-white rounded-3xl p-6 sm:p-10 border border-papelKraft/40 shadow-kraft space-y-8">

                  {/* CABEÇALHO DA AULA SELECIONADA */}
                  <div className="space-y-3 border-b border-papelKraft/30 pb-6">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-light font-corpo text-acentoTerracota tracking-wide lowercase">
                        capítulo {currentLessonIndex + 1} de {lessons.length}
                      </span>
                      {selectedLesson.tags && selectedLesson.tags.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {selectedLesson.tags.map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className="px-2.5 py-0.5 rounded-full text-xs font-normal font-corpo bg-bgPlataforma text-acentoAzul border border-papelKraft/40 lowercase"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <h2 className="text-3xl sm:text-4xl font-bold font-editorial text-acentoAzul lowercase leading-tight">
                      {selectedLesson.title}
                    </h2>
                  </div>

                  {/* REPRODUTOR DE ÁUDIO DE ESTÚDIO (Se existirem áudios) */}
                  {audioFiles.length > 0 && (
                    <div className="py-2">
                      <AudioPlayer
                        audioFiles={audioFiles.map((a) => ({
                          id: a.id,
                          title: a.title,
                          audio_file_url: a.audio_file_url,
                          duration_seconds: a.duration_seconds,
                        }))}
                      />
                    </div>
                  )}

                  {!audioFiles.length && selectedLesson.audio_url && (
                    <div className="py-2">
                      <AudioPlayer
                        audioFiles={[
                          {
                            id: 'legacy-audio',
                            title: 'áudio da aula',
                            audio_file_url: selectedLesson.audio_url,
                            duration_seconds: 0,
                          },
                        ]}
                      />
                    </div>
                  )}

                  {/* TRANSMISSÃO AO VIVO / VÍDEO DA AULA */}
                  {(selectedLesson.zoom_link || selectedLesson.recording_url) && (
                    <div className="space-y-4">
                      {selectedLesson.zoom_link && (
                        <div className="bg-bgPlataforma rounded-2xl p-5 border border-papelKraft/50 flex items-center justify-between shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="p-3 rounded-2xl bg-white border border-papelKraft/40 text-acentoAzul">
                              <Video className="w-5 h-5 text-acentoAzul" />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold font-editorial text-acentoAzul lowercase">encontro ao vivo</h4>
                              <p className="text-xs font-light font-corpo text-tintaCarvao/60 lowercase">transmissão síncrona meet/zoom</p>
                            </div>
                          </div>
                          <a
                            href={selectedLesson.zoom_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-5 py-2 rounded-2xl bg-acentoAzul text-white font-gesto text-[20px] sm:text-[23px] lowercase shadow-sm hover:bg-acentoAzul/90 transition-colors"
                          >
                            entrar na sala →
                          </a>
                        </div>
                      )}

                      {selectedLesson.recording_url && (
                        <div className="space-y-2">
                          <span className="text-xs font-light font-corpo text-tintaCarvao/60 lowercase block">gravação de vídeo</span>
                          {isYouTubeUrl(selectedLesson.recording_url) ? (
                            <YouTubeEmbed
                              videoUrl={selectedLesson.recording_url}
                              title={`gravação - ${selectedLesson.title}`}
                            />
                          ) : (
                            <a
                              href={selectedLesson.recording_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-tintaCarvao text-white font-gesto text-[20px] sm:text-[23px] lowercase shadow-sm"
                            >
                              <Play className="w-4 h-4 fill-white" />
                              <span>assistir gravação →</span>
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* PROSA & CONTEÚDO EDITORIAL DA AULA */}
                  <div className="space-y-6 pt-2">
                    <div
                      className="prose prose-stone max-w-none text-tintaCarvao/90 font-light font-corpo text-base sm:text-lg leading-[1.85] lowercase space-y-4"
                      dangerouslySetInnerHTML={{ __html: selectedLesson.description || '' }}
                    />
                  </div>

                  {/* BARRA DE AÇÕES FLUTUANTE DA AULA */}
                  <div className="pt-8 border-t border-papelKraft/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={handleOpenAtelierWithPrompt}
                        className="flex-1 sm:flex-initial px-6 py-2.5 rounded-2xl bg-acentoTerracota hover:bg-acentoTerracota/90 text-white font-gesto text-[20px] sm:text-[23px] lowercase shadow-sm transition-all hover:scale-105 inline-flex items-center justify-center gap-2"
                      >
                        <Pencil className="w-4 h-4 text-white" />
                        <span>escrever no atelier →</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsZenModeOpen(true)}
                        className="px-4 py-2.5 rounded-2xl bg-bgPlataforma hover:bg-papelKraft/30 text-acentoAzul font-gesto text-[20px] sm:text-[23px] lowercase border border-papelKraft/50 shadow-sm transition-colors inline-flex items-center justify-center gap-1.5"
                        title="modo foco"
                      >
                        <Maximize2 className="w-4 h-4" />
                        <span>foco</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                      <button
                        type="button"
                        onClick={handlePrevLesson}
                        disabled={currentLessonIndex === 0}
                        className="px-4 py-2 rounded-2xl bg-white border border-papelKraft/50 text-acentoAzul font-gesto text-[20px] sm:text-[23px] lowercase disabled:opacity-40 shadow-sm hover:bg-bgPlataforma transition-all inline-flex items-center gap-1"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>anterior</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleNextLesson}
                        disabled={currentLessonIndex === lessons.length - 1}
                        className="px-5 py-2 rounded-2xl bg-acentoAzul text-white font-gesto text-[20px] sm:text-[23px] lowercase disabled:opacity-40 shadow-sm hover:bg-acentoAzul/90 transition-all inline-flex items-center gap-1"
                      >
                        <span>próxima</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                </div>

                {/* MATERIAIS DE APOIO */}
                {materials.length > 0 && (
                  <div className="bg-papelClaro rounded-3xl p-6 sm:p-7 border border-papelKraft/50 shadow-kraft space-y-4">
                    <h3 className="text-[2.2rem] leading-snug font-normal font-gesto text-acentoAzul lowercase flex items-center gap-2 border-b border-papelKraft/30 pb-3">
                      <Download className="w-5 h-5 text-acentoTerracota" />
                      <span>materiais de apoio ({materials.length})</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {materials.map((mat) => (
                        <a
                          key={mat.id}
                          href={mat.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-4 bg-white rounded-2xl border border-papelKraft/40 hover:border-acentoAzul transition-all shadow-sm group"
                        >
                          <div className="flex items-center gap-3 truncate">
                            <Download className="w-4 h-4 text-acentoTerracota shrink-0 group-hover:scale-110 transition-transform" />
                            <span className="text-sm font-semibold font-corpo text-acentoAzul lowercase group-hover:text-acentoTerracota transition-colors truncate">
                              {mat.title}
                            </span>
                          </div>
                          <span className="text-xs font-normal font-gesto text-acentoTerracota lowercase shrink-0">
                            baixar →
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* SEÇÃO DE PARTILHAS & COMENTÁRIOS DA AULA */}
                <div className="bg-papelClaro rounded-3xl p-6 sm:p-8 border border-papelKraft/50 shadow-kraft space-y-6">
                  <div className="flex items-center justify-between border-b border-papelKraft/30 pb-3">
                    <button
                      type="button"
                      onClick={() => setShowComments(!showComments)}
                      className="text-[2.2rem] leading-snug font-normal font-gesto text-acentoAzul lowercase flex items-center gap-2 hover:text-acentoTerracota transition-colors"
                    >
                      <MessageCircle className="w-5 h-5 text-acentoAzul" />
                      <span>partilhas da aula ({comments.length})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowComments(!showComments)}
                      className="text-xs font-normal font-gesto text-acentoAzul hover:underline lowercase"
                    >
                      {showComments ? 'ocultar ▲' : 'mostrar ▼'}
                    </button>
                  </div>

                  {showComments && (
                    <div className="space-y-6">
                      <form onSubmit={handleCommentSubmit} className="space-y-3">
                        {replyTo && (
                          <div className="text-xs font-corpo text-acentoTerracota flex items-center justify-between bg-white p-2.5 rounded-xl border border-papelKraft/50">
                            <span>respondendo ao comentário...</span>
                            <button
                              type="button"
                              onClick={() => setReplyTo(null)}
                              className="hover:underline font-bold"
                            >
                              cancelar
                            </button>
                          </div>
                        )}
                        <RichTextEditor
                          value={newComment}
                          onChange={setNewComment}
                          placeholder="deixe sua partilha ou reflexão sobre esta aula..."
                        />
                        <div className="flex justify-end">
                          <button
                            type="submit"
                            className="px-6 py-2.5 rounded-2xl bg-acentoAzul text-white font-gesto text-[20px] sm:text-[23px] lowercase shadow-sm hover:bg-acentoAzul/90 transition-colors"
                          >
                            enviar partilha →
                          </button>
                        </div>
                      </form>

                      <div className="space-y-4">
                        {comments.length === 0 ? (
                          <p className="text-xs sm:text-sm font-light font-corpo text-tintaCarvao/60 italic text-center py-4">
                            seja a primeira a partilhar uma reflexão sobre esta aula.
                          </p>
                        ) : (
                          comments.map((comment) => (
                            <div key={comment.id} className="p-4 rounded-2xl bg-white border border-papelKraft/40 space-y-3 shadow-sm">
                              <div className="flex items-center justify-between text-xs font-light font-corpo">
                                <span className="font-normal font-corpo text-acentoAzul lowercase">
                                  {comment.user_profile?.display_name || 'aluna solta o verbo'}
                                </span>
                                <span className="text-tintaCarvao/50">
                                  {new Date(comment.created_at).toLocaleDateString('pt-BR')}
                                </span>
                              </div>

                              <div
                                className="text-xs sm:text-sm font-light font-corpo text-tintaCarvao/85 lowercase leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: comment.content }}
                              />

                              <button
                                type="button"
                                onClick={() => setReplyTo(comment.id)}
                                className="text-xs font-normal font-gesto text-acentoTerracota hover:underline lowercase"
                              >
                                responder →
                              </button>

                              {comment.replies && comment.replies.length > 0 && (
                                <div className="pl-4 border-l-2 border-papelKraft/40 space-y-2 pt-2">
                                  {comment.replies.map((reply) => (
                                    <div key={reply.id} className="p-3 rounded-xl bg-bgPlataforma border border-papelKraft/40 space-y-1">
                                      <div className="flex items-center justify-between text-xs font-light font-corpo">
                                        <span className="font-normal text-acentoAzul lowercase">
                                          {reply.user_profile?.display_name || 'aluna'}
                                        </span>
                                        <span className="text-tintaCarvao/50">
                                          {new Date(reply.created_at).toLocaleDateString('pt-BR')}
                                        </span>
                                      </div>
                                      <div
                                        className="text-xs font-light font-corpo text-tintaCarvao/85 lowercase"
                                        dangerouslySetInnerHTML={{ __html: reply.content }}
                                      />
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* COLUNA DA DIREITA (4 COLS): ÍNDICE DO CURSO & SUMÁRIO ESTILO LIVRO */}
          <div className="lg:col-span-4 bg-papelClaro rounded-3xl p-6 border border-papelKraft/50 shadow-kraft space-y-5 sticky top-20">
            <div className="flex items-center justify-between border-b border-papelKraft/40 pb-3">
              <h3 className="text-[2.2rem] leading-snug font-normal font-gesto text-acentoAzul lowercase flex items-center gap-2">
                <List className="w-5 h-5 text-acentoAzul" />
                <span>sumário de aulas</span>
              </h3>
              <span className="text-xs font-light font-corpo text-tintaCarvao/60 lowercase">
                {currentLessonIndex + 1} de {lessons.length}
              </span>
            </div>

            {/* LISTA ELEGANTE DE AULAS ESTILO SUMÁRIO DE LIVRO */}
            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
              {lessons.map((lesson, idx) => {
                const isSelected = selectedLesson?.id === lesson.id;
                return (
                  <button
                    key={lesson.id}
                    type="button"
                    onClick={() => setSelectedLesson(lesson)}
                    className={`w-full text-left p-4 rounded-2xl transition-all duration-200 border flex items-start gap-3.5 group cursor-pointer ${
                      isSelected
                        ? 'bg-acentoAzul text-white border-acentoAzul shadow-md'
                        : 'bg-white text-tintaCarvao hover:bg-bgPlataforma border-papelKraft/40 shadow-sm'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-normal font-gesto shrink-0 mt-0.5 ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-bgPlataforma text-acentoAzul border border-papelKraft/40'
                      }`}
                    >
                      {String(idx + 1).padStart(2, '0')}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <p className={`text-sm font-semibold font-editorial lowercase leading-snug ${
                        isSelected ? 'text-white' : 'text-acentoAzul group-hover:text-acentoTerracota'
                      }`}>
                        {lesson.title}
                      </p>
                      {lesson.tags && lesson.tags.length > 0 && (
                        <div className="flex items-center gap-1 flex-wrap pt-0.5">
                          {lesson.tags.map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className={`px-2 py-0.5 rounded-full text-[10px] font-normal font-corpo lowercase ${
                                isSelected
                                  ? 'bg-white/20 text-white'
                                  : 'bg-bgPlataforma text-acentoAzul border border-papelKraft/30'
                              }`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {isSelected && <CheckCircle className="w-4 h-4 text-acentoOliva shrink-0 mt-1" />}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* MODO FOCO DA AULA (ZEN READER FULLSCREEN OVERLAY) */}
      {isZenModeOpen && selectedLesson && createPortal(
        <div className="fixed inset-0 z-[999999] bg-bgPlataforma text-tintaCarvao flex flex-col justify-between p-4 sm:p-8 animate-fadeIn overflow-y-auto">
          {/* BARRA SUPERIOR DO MODO FOCO */}
          <div className="max-w-3xl mx-auto w-full flex items-center justify-between border-b border-papelKraft/40 pb-4">
            <div>
              <span className="text-xs font-light font-corpo text-acentoTerracota lowercase block">
                modo foco da aula • {course.title}
              </span>
              <h3 className="text-lg sm:text-xl font-bold font-editorial text-acentoAzul lowercase truncate max-w-md">
                {selectedLesson.title}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-1 bg-white p-1 rounded-full border border-papelKraft/60 shadow-sm text-xs font-corpo">
                <button
                  type="button"
                  onClick={() => setZenFontSize('sm')}
                  className={`px-2.5 py-0.5 rounded-full transition-all ${zenFontSize === 'sm' ? 'bg-acentoAzul text-white' : 'text-tintaCarvao/70'}`}
                >
                  a-
                </button>
                <button
                  type="button"
                  onClick={() => setZenFontSize('md')}
                  className={`px-2.5 py-0.5 rounded-full transition-all ${zenFontSize === 'md' ? 'bg-acentoAzul text-white' : 'text-tintaCarvao/70'}`}
                >
                  a
                </button>
                <button
                  type="button"
                  onClick={() => setZenFontSize('lg')}
                  className={`px-2.5 py-0.5 rounded-full transition-all ${zenFontSize === 'lg' ? 'bg-acentoAzul text-white' : 'text-tintaCarvao/70'}`}
                >
                  a+
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsZenModeOpen(false)}
                className="p-2.5 rounded-full bg-white text-tintaCarvao border border-papelKraft/60 shadow-sm hover:bg-papelKraft/30 transition-colors"
                title="fechar modo foco"
              >
                <Minimize2 className="w-5 h-5 text-acentoAzul" />
              </button>
            </div>
          </div>

          {/* CANVAS DE LEITURA EDITORIAL DE ALTA IMERSÃO */}
          <div className="max-w-2xl mx-auto w-full py-8 space-y-6 flex-1">
            <div className="text-center space-y-2 border-b border-papelKraft/30 pb-6">
              <span className="text-xs font-light font-corpo text-acentoTerracota lowercase block">
                capítulo {currentLessonIndex + 1} de {lessons.length}
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold font-editorial text-acentoAzul lowercase">
                {selectedLesson.title}
              </h1>
            </div>

            {audioFiles.length > 0 && (
              <div className="py-2">
                <AudioPlayer
                  audioFiles={audioFiles.map((a) => ({
                    id: a.id,
                    title: a.title,
                    audio_file_url: a.audio_file_url,
                    duration_seconds: a.duration_seconds,
                  }))}
                />
              </div>
            )}

            <div
              className={`prose prose-stone max-w-none text-tintaCarvao/90 font-light font-corpo lowercase leading-[1.85] space-y-5 ${
                zenFontSize === 'sm'
                  ? 'text-sm sm:text-base'
                  : zenFontSize === 'lg'
                  ? 'text-xl sm:text-2xl'
                  : 'text-lg sm:text-xl'
              }`}
              dangerouslySetInnerHTML={{ __html: selectedLesson.description || '' }}
            />
          </div>

          {/* RODAPÉ DO MODO FOCO */}
          <div className="max-w-3xl mx-auto w-full border-t border-papelKraft/40 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-32 bg-papelKraft/30 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-acentoTerracota h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-xs font-light font-corpo text-tintaCarvao/70 lowercase">
                {progressPercent}% concluído • aula {currentLessonIndex + 1} de {lessons.length}
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsZenModeOpen(false);
                handleOpenAtelierWithPrompt();
              }}
              className="px-5 py-2 rounded-2xl bg-acentoTerracota text-white font-gesto text-[20px] sm:text-[23px] lowercase shadow-sm hover:bg-acentoTerracota/90 transition-transform hover:scale-105 inline-flex items-center justify-center gap-1.5"
            >
              <Pencil className="w-4 h-4 text-white" />
              <span>escrever no atelier →</span>
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
