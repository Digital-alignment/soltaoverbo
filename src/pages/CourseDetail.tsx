import { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import LoadingPage from '../components/LoadingPage';
import YouTubeEmbed from '../components/YouTubeEmbed';
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
  ChevronDown,
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
  const [showComments, setShowComments] = useState(false);

  // MODO FOCO DA AULA (ZEN READER)
  const [isZenModeOpen, setIsZenModeOpen] = useState(false);
  const [zenFontSize, setZenFontSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [activeZenDrawer, setActiveZenDrawer] = useState<'none' | 'sumario' | 'materiais' | 'partilhas'>('none');

  // CONCLUÍDOS DE AULAS & MATERIAIS COLAPSÁVEIS
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [showMaterials, setShowMaterials] = useState(false);
  const materialsRef = useRef<HTMLDivElement>(null);

  const desktopContentRef = useRef<HTMLDivElement>(null);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    if (isZenModeOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isZenModeOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (materialsRef.current && !materialsRef.current.contains(event.target as Node)) {
        setShowMaterials(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
        <div className="bg-white rounded-3xl p-8 border border-papelKraft/40 shadow-sm max-w-md w-full text-center space-y-4">
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
      
      {/* 1. CABEÇALHO UNIFICADO E FLUIDO (LARGURA DE 80% EM DESKTOP) */}
      <div className="bg-bgPlataforma pt-4 pb-3 px-4 sm:px-6 lg:px-8 border-b border-papelKraft/30 transition-all">
        <div className="w-full lg:w-[80%] mx-auto space-y-2.5">
          
          {/* Linha 1: Voltar (apenas a palavra 'voltar' com tamanho maior) */}
          <div className="flex items-center justify-between">
            <Link
              to="/programs"
              className="inline-flex items-center gap-2 text-acentoAzul hover:text-acentoTerracota transition-colors text-[24px] sm:text-[28px] font-normal font-gesto lowercase shrink-0"
            >
              <ArrowLeft className="w-5 h-5 text-acentoAzul shrink-0" />
              <span>voltar</span>
            </Link>
          </div>

          {/* Linha 2: Título e Descrição Compacta do Curso */}
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

      <div className="w-full lg:w-[80%] mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8">

        {/* 2. LAYOUT MASTER EM 2 COLUNAS DE ALTA ELEGÂNCIA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* COLUNA DA ESQUERDA (8 COLS): HUB PRINCIPAL DA AULA */}
          <div className="lg:col-span-8 space-y-4" ref={desktopContentRef}>
            {selectedLesson && (
              <>
                {/* BOTÃO FOCO FORA DO CARD (ACIMA DA AULA SELECIONADA) */}
                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => setIsZenModeOpen(true)}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-2xl bg-white hover:bg-papelKraft/30 text-acentoAzul font-gesto text-[22px] sm:text-[24px] lowercase border border-papelKraft/40 shadow-sm transition-all cursor-pointer"
                    title="modo foco"
                  >
                    <Maximize2 className="w-4 h-4 text-acentoAzul shrink-0" />
                    <span>foco</span>
                  </button>
                </div>

                {/* CANVAS DA AULA EM PAPEL CREME CÁLIDO */}
                <div className="bg-papelClaro rounded-3xl p-6 sm:p-9 border border-papelKraft/40 shadow-sm space-y-6">

                  {/* CABEÇALHO DA AULA SELECIONADA (APENAS O TÍTULO DA AULA) */}
                  <div className="border-b border-papelKraft/25 pb-4">
                    <h2 className="text-xl sm:text-2xl font-bold font-editorial text-acentoAzul lowercase leading-tight">
                      {selectedLesson.title}
                    </h2>
                  </div>

                  {/* REPRODUTOR DE ÁUDIO DE ESTÚDIO */}
                  {audioFiles.length > 0 && (
                    <div>
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
                    <div>
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
                    <div className="space-y-3">
                      {selectedLesson.zoom_link && (
                        <div className="bg-white/80 rounded-2xl p-3.5 sm:p-4 border border-papelKraft/35 flex items-center justify-between shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-bgPlataforma border border-papelKraft/30 text-acentoAzul">
                              <Video className="w-4 h-4 text-acentoAzul" />
                            </div>
                            <div>
                              <h4 className="text-xs sm:text-sm font-bold font-editorial text-acentoAzul lowercase">encontro ao vivo</h4>
                              <p className="text-xs font-light font-corpo text-tintaCarvao/60 lowercase">transmissão síncrona meet/zoom</p>
                            </div>
                          </div>
                          <a
                            href={selectedLesson.zoom_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-1.5 rounded-2xl bg-acentoAzul text-white font-gesto text-[20px] sm:text-[23px] lowercase shadow-sm hover:bg-acentoAzul/90 transition-colors"
                          >
                            entrar na sala →
                          </a>
                        </div>
                      )}

                      {selectedLesson.recording_url && (
                        <div className="space-y-1.5">
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
                  <div className="space-y-4 pt-1">
                    <div
                      className="prose prose-stone max-w-none text-tintaCarvao/90 font-light font-corpo text-base sm:text-lg leading-[1.8] lowercase space-y-3"
                      dangerouslySetInnerHTML={{ __html: selectedLesson.description || '' }}
                    />
                  </div>

                  {/* BARRA UNIFICADA DE AÇÕES DA AULA */}
                  <div className="pt-6 border-t border-papelKraft/25 flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* BOTÃO ESQUERDO: ESCREVER NO ATELIER */}
                    <button
                      type="button"
                      onClick={handleOpenAtelierWithPrompt}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-acentoTerracota hover:bg-acentoTerracota/90 text-white font-gesto text-[24px] sm:text-[26px] lowercase shadow-sm transition-all hover:scale-105 inline-flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Pencil className="w-4 h-4 text-white shrink-0" />
                      <span>escrever →</span>
                    </button>

                    {/* GRUPO DIREITO: NAVEGAÇÃO DE AULAS COM MARCAR COMO CONCLUÍDA EM DESTAQUE NO CENTRO */}
                    <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
                      {/* ÍCONE DA AULA ANTERIOR (ESQUERDA DO CONCLUÍDO) */}
                      <button
                        type="button"
                        onClick={handlePrevLesson}
                        disabled={currentLessonIndex === 0}
                        className="p-3 rounded-2xl bg-white border border-papelKraft/40 text-acentoAzul disabled:opacity-30 shadow-sm hover:bg-bgPlataforma transition-all flex items-center justify-center cursor-pointer shrink-0"
                        title="aula anterior"
                      >
                        <ChevronLeft className="w-5 h-5 text-acentoAzul" />
                      </button>

                      {/* BOTÃO EM DESTAQUE: MARCAR COMO CONCLUÍDA */}
                      <button
                        type="button"
                        onClick={() => {
                          if (selectedLesson) {
                            setCompletedLessonIds((prev) =>
                              prev.includes(selectedLesson.id)
                                ? prev.filter((id) => id !== selectedLesson.id)
                                : [...prev, selectedLesson.id]
                            );
                          }
                        }}
                        className={`px-5 sm:px-6 py-2.5 rounded-2xl font-gesto text-[24px] sm:text-[26px] lowercase transition-all inline-flex items-center justify-center gap-2 shadow-md cursor-pointer ${
                          selectedLesson && completedLessonIds.includes(selectedLesson.id)
                            ? 'bg-acentoOliva text-white border border-acentoOliva'
                            : 'bg-white text-tintaCarvao border border-papelKraft/45 hover:bg-papelKraft/20'
                        }`}
                      >
                        <CheckCircle className={`w-5 h-5 ${selectedLesson && completedLessonIds.includes(selectedLesson.id) ? 'text-white' : 'text-acentoOliva'}`} />
                        <span>
                          {selectedLesson && completedLessonIds.includes(selectedLesson.id)
                            ? 'aula concluída ✓'
                            : 'marcar como concluída'}
                        </span>
                      </button>

                      {/* ÍCONE DA PRÓXIMA AULA (DIREITA DO CONCLUÍDO) */}
                      <button
                        type="button"
                        onClick={handleNextLesson}
                        disabled={currentLessonIndex === lessons.length - 1}
                        className="p-3 rounded-2xl bg-acentoAzul text-white disabled:opacity-30 shadow-sm hover:bg-acentoAzul/90 transition-all flex items-center justify-center cursor-pointer shrink-0"
                        title="próxima aula"
                      >
                        <ChevronRight className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  </div>

                </div>

                {/* MATERIAIS DE APOIO (FUNDO AZUL ACENTO, EXPANDÍVEL/COLAPSÁVEL NO CLIQUE, FECHA AO CLICAR FORA) */}
                {materials.length > 0 && (
                  <div
                    ref={materialsRef}
                    className="bg-acentoAzul text-white rounded-3xl p-5 sm:p-6 shadow-md transition-all cursor-pointer"
                    onClick={() => setShowMaterials(!showMaterials)}
                  >
                    {/* CABEÇALHO DO CARD EM FONTE EXPANDIDA SEM CONTAGEM E ÍCONE DO LADO DIREITO */}
                    <div className={`flex items-center justify-between gap-4 transition-all ${showMaterials ? 'border-b border-white/20 pb-3 mb-4' : ''}`}>
                      <div className="flex items-center gap-3">
                        <Download className="w-6 h-6 sm:w-7 sm:h-7 text-white shrink-0" />
                        <h3 className="text-2xl sm:text-3xl font-normal font-gesto text-white lowercase">
                          materiais de apoio
                        </h3>
                      </div>

                      <div className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all shrink-0">
                        <ChevronDown className={`w-5 h-5 text-white transition-transform duration-300 ${showMaterials ? 'rotate-180' : ''}`} />
                      </div>
                    </div>

                    {/* CONTEÚDO MINIMALISTA DOS ELEMENTOS DISPONÍVEIS */}
                    {showMaterials && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1" onClick={(e) => e.stopPropagation()}>
                        {materials.map((mat) => (
                          <a
                            key={mat.id}
                            href={mat.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3.5 bg-white rounded-2xl border border-white/30 hover:bg-papelClaro transition-all shadow-sm group"
                          >
                            <Download className="w-5 h-5 text-acentoAzul shrink-0 group-hover:scale-110 transition-transform" />
                            <span className="text-xs sm:text-sm font-medium font-corpo text-acentoAzul lowercase truncate">
                              {mat.title}
                            </span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* SEÇÃO DE PARTILHAS & COMENTÁRIOS DA AULA */}
                <div className="bg-papelClaro rounded-3xl p-5 sm:p-6 border border-papelKraft/30 shadow-sm transition-all">
                  <div
                    className={`flex items-center justify-between gap-4 cursor-pointer transition-all ${showComments ? 'border-b border-papelKraft/25 pb-3 mb-4' : ''}`}
                    onClick={() => setShowComments(!showComments)}
                  >
                    <div className="flex items-center gap-3">
                      <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 text-acentoAzul shrink-0" />
                      <h3 className="text-2xl sm:text-3xl font-normal font-gesto text-acentoAzul lowercase">
                        partilhas da aula
                      </h3>
                    </div>

                    <div className="p-2 rounded-full bg-papelKraft/20 hover:bg-papelKraft/30 text-acentoAzul transition-all shrink-0">
                      <ChevronDown className={`w-5 h-5 text-acentoAzul transition-transform duration-300 ${showComments ? 'rotate-180' : ''}`} />
                    </div>
                  </div>

                  {showComments && (
                    <div className="space-y-5 pt-1">
                      <form onSubmit={handleCommentSubmit} className="space-y-3">
                        {replyTo && (
                          <div className="text-xs font-corpo text-acentoTerracota flex items-center justify-between bg-bgPlataforma p-2 rounded-xl border border-papelKraft/40">
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
                        <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          rows={3}
                          placeholder="deixe sua partilha ou reflexão sobre esta aula..."
                          className="w-full bg-bgPlataforma rounded-2xl border border-papelKraft/40 p-4 font-corpo text-sm text-tintaCarvao placeholder:text-tintaCarvao/50 focus:outline-none focus:border-acentoAzul focus:ring-1 focus:ring-acentoAzul shadow-sm transition-all"
                        />
                        <div className="flex justify-end">
                          <button
                            type="submit"
                            className="px-5 py-2 rounded-2xl bg-acentoAzul text-white font-gesto text-[20px] sm:text-[23px] lowercase shadow-sm hover:bg-acentoAzul/90 transition-colors cursor-pointer"
                          >
                            enviar partilha →
                          </button>
                        </div>
                      </form>

                      <div className="space-y-3">
                        {comments.length === 0 ? (
                          <p className="text-xs font-light font-corpo text-tintaCarvao/60 italic text-center py-3">
                            seja a primeira a partilhar uma reflexão sobre esta aula.
                          </p>
                        ) : (
                          comments.map((comment) => (
                            <div key={comment.id} className="p-3.5 rounded-2xl bg-bgPlataforma border border-papelKraft/40 space-y-2 shadow-sm">
                              <div className="flex items-center justify-between text-xs font-light font-corpo">
                                <span className="font-normal font-corpo text-acentoAzul lowercase">
                                  {comment.user_profile?.display_name || 'aluna solta o verbo'}
                                </span>
                                <span className="text-tintaCarvao/50 text-[11px]">
                                  {new Date(comment.created_at).toLocaleDateString('pt-BR')}
                                </span>
                              </div>

                              <p className="text-xs sm:text-sm font-light font-corpo text-tintaCarvao/85 lowercase leading-relaxed">
                                {comment.content}
                              </p>

                              <button
                                type="button"
                                onClick={() => setReplyTo(comment.id)}
                                className="text-xs font-normal font-gesto text-acentoTerracota hover:underline lowercase"
                              >
                                responder →
                              </button>

                              {comment.replies && comment.replies.length > 0 && (
                                <div className="pl-3 border-l-2 border-papelKraft/40 space-y-2 pt-1">
                                  {comment.replies.map((reply) => (
                                    <div key={reply.id} className="p-2.5 rounded-xl bg-white border border-papelKraft/30 space-y-1">
                                      <div className="flex items-center justify-between text-xs font-light font-corpo">
                                        <span className="font-normal text-acentoAzul lowercase">
                                          {reply.user_profile?.display_name || 'aluna'}
                                        </span>
                                        <span className="text-tintaCarvao/50 text-[10px]">
                                          {new Date(reply.created_at).toLocaleDateString('pt-BR')}
                                        </span>
                                      </div>
                                      <p className="text-xs font-light font-corpo text-tintaCarvao/85 lowercase">
                                        {reply.content}
                                      </p>
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

          {/* COLUNA DA DIREITA (4 COLS): ÍNDICE DO CURSO COM BARRA DE PROGRESSO NO TOPO */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-papelKraft/30 shadow-sm space-y-4 sticky top-6">
            
            {/* BARRA DE PROGRESSO DO CURSO ANTES DO TÍTULO DO SUMÁRIO (FUNDO INTEGRADO SEM CAIXA, MUTHASLE 20px/25px, BARRA DINÂMICA) */}
            <div className="space-y-2 pb-1">
              <div className="flex items-center justify-end">
                <span className="font-gesto text-[20px] sm:text-[25px] font-normal text-acentoTerracota lowercase tracking-wide">
                  {progressPercent}% concluído
                </span>
              </div>
              <div className="w-full bg-papelKraft/30 h-2 rounded-full overflow-hidden p-[1px]">
                <div
                  className="bg-acentoOliva h-full rounded-full transition-all duration-700 ease-out relative shadow-sm"
                  style={{ width: `${progressPercent}%` }}
                >
                  <div className="absolute inset-0 bg-white/25 animate-pulse rounded-full" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-b border-papelKraft/25 pb-2.5 pt-1">
              <h3 className="text-[2rem] leading-snug font-normal font-gesto text-acentoAzul lowercase flex items-center gap-2">
                <List className="w-4 h-4 text-acentoAzul" />
                <span>sumário de aulas</span>
              </h3>
            </div>

            {/* LISTA ULTRA-LIMPA E COMPACTA DE AULAS ESTILO ÍNDICE DE LIVRO */}
            <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
              {lessons.map((lesson, idx) => {
                const isSelected = selectedLesson?.id === lesson.id;
                return (
                  <button
                    key={lesson.id}
                    type="button"
                    onClick={() => setSelectedLesson(lesson)}
                    className={`w-full text-left p-3 rounded-2xl transition-all duration-200 border flex items-center justify-between gap-3 group cursor-pointer ${
                      isSelected
                        ? 'bg-acentoAzul text-white border-acentoAzul shadow-sm'
                        : 'bg-bgPlataforma/60 hover:bg-papelKraft/20 text-tintaCarvao border-papelKraft/30'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`text-xs font-normal font-gesto shrink-0 ${
                        isSelected ? 'text-white/80' : 'text-acentoAzul'
                      }`}>
                        {String(idx + 1).padStart(2, '0')}.
                      </span>
                      <p className={`text-xs sm:text-sm font-light font-corpo lowercase truncate ${
                        isSelected ? 'text-white font-medium' : 'text-tintaCarvao/85 group-hover:text-acentoAzul'
                      }`}>
                        {lesson.title}
                      </p>
                    </div>

                    {isSelected && <CheckCircle className="w-4 h-4 text-acentoOliva shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* MODO FOCO DA AULA (ZEN READER FULLSCREEN OVERLAY) */}
      {isZenModeOpen && selectedLesson && createPortal(
        <div className="fixed inset-0 top-0 left-0 w-screen h-screen z-[999999] bg-bgPlataforma text-tintaCarvao flex flex-col justify-between p-4 sm:p-8 animate-fadeIn overflow-y-auto">
          
          {/* BARRA SUPERIOR DO MODO FOCO */}
          <div className="w-full lg:w-[80%] mx-auto flex items-center justify-between pb-4 gap-4">
            
            {/* ESQUERDA (DESKTOP): FERRAMENTAS MINIMALISTAS EM ÍCONES */}
            <div className="hidden sm:flex items-center gap-1 bg-white p-1 rounded-full border border-papelKraft/50 shadow-sm">
              {/* 1. SUMÁRIO */}
              <button
                type="button"
                onClick={() => setActiveZenDrawer(activeZenDrawer === 'sumario' ? 'none' : 'sumario')}
                className={`p-2 rounded-full transition-colors cursor-pointer ${activeZenDrawer === 'sumario' ? 'bg-acentoAzul text-white' : 'text-acentoAzul hover:bg-bgPlataforma'}`}
                title="sumário de aulas"
              >
                <List className="w-4 h-4" />
              </button>

              {/* 2. MATERIAIS */}
              {materials.length > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveZenDrawer(activeZenDrawer === 'materiais' ? 'none' : 'materiais')}
                  className={`p-2 rounded-full transition-colors cursor-pointer ${activeZenDrawer === 'materiais' ? 'bg-acentoAzul text-white' : 'text-acentoAzul hover:bg-bgPlataforma'}`}
                  title="materiais de apoio"
                >
                  <Download className="w-4 h-4" />
                </button>
              )}

              {/* 3. PARTILHAS */}
              <button
                type="button"
                onClick={() => setActiveZenDrawer(activeZenDrawer === 'partilhas' ? 'none' : 'partilhas')}
                className={`p-2 rounded-full transition-colors cursor-pointer ${activeZenDrawer === 'partilhas' ? 'bg-acentoAzul text-white' : 'text-acentoAzul hover:bg-bgPlataforma'}`}
                title="partilhas da aula"
              >
                <MessageCircle className="w-4 h-4" />
              </button>

              {/* 4. ESCREVER */}
              <button
                type="button"
                onClick={() => {
                  setIsZenModeOpen(false);
                  handleOpenAtelierWithPrompt();
                }}
                className="p-2 rounded-full text-acentoTerracota hover:bg-papelKraft/30 transition-colors cursor-pointer"
                title="escrever no atelier"
              >
                <Pencil className="w-4 h-4 text-acentoTerracota" />
              </button>
            </div>

            {/* ESPAÇADOR FLEX NO MOBILE */}
            <div className="sm:hidden flex-1" />

            {/* DIREITA (DESKTOP & MOBILE): TAMANHO DA FONTE E BOTÃO SAIR */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* SELECTOR DE TAMANHO DE FONTE (a- a a+) */}
              <div className="inline-flex items-center gap-1 bg-white p-1 rounded-full border border-papelKraft/50 shadow-sm text-xs font-corpo">
                <button
                  type="button"
                  onClick={() => setZenFontSize('sm')}
                  className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${zenFontSize === 'sm' ? 'bg-acentoAzul text-white' : 'text-tintaCarvao/70'}`}
                >
                  a-
                </button>
                <button
                  type="button"
                  onClick={() => setZenFontSize('md')}
                  className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${zenFontSize === 'md' ? 'bg-acentoAzul text-white' : 'text-tintaCarvao/70'}`}
                >
                  a
                </button>
                <button
                  type="button"
                  onClick={() => setZenFontSize('lg')}
                  className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${zenFontSize === 'lg' ? 'bg-acentoAzul text-white' : 'text-tintaCarvao/70'}`}
                >
                  a+
                </button>
              </div>

              {/* BOTÃO SAIR DO MODO FOCO */}
              <button
                type="button"
                onClick={() => setIsZenModeOpen(false)}
                className="p-2 rounded-full bg-white text-tintaCarvao border border-papelKraft/60 shadow-sm hover:bg-papelKraft/30 transition-colors cursor-pointer"
                title="sair do modo foco"
              >
                <Minimize2 className="w-4 h-4 text-acentoAzul" />
              </button>
            </div>
          </div>

          {/* CANVAS DE LEITURA EDITORIAL DE ALTA IMERSÃO (80% LARGURA EM DESKTOP) */}
          <div className="w-full lg:w-[80%] mx-auto py-6 space-y-6 flex-1">
            <div className="text-center pb-3">
              <h1 className="text-2xl sm:text-4xl font-bold font-editorial text-acentoAzul lowercase leading-tight">
                {selectedLesson.title}
              </h1>
            </div>

            {/* ÁUDIO PLAYER NO MODO FOCO */}
            {audioFiles.length > 0 && (
              <div className="py-2 max-w-3xl mx-auto">
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
              <div className="py-2 max-w-3xl mx-auto">
                <AudioPlayer
                  audioFiles={[
                    {
                      id: 'zen-legacy-audio',
                      title: 'áudio da aula',
                      audio_file_url: selectedLesson.audio_url,
                      duration_seconds: 0,
                    },
                  ]}
                />
              </div>
            )}

            {/* VÍDEO DO YOUTUBE NO MODO FOCO */}
            {selectedLesson.recording_url && isYouTubeUrl(selectedLesson.recording_url) && (
              <div className="py-2 max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-sm border border-papelKraft/35">
                <YouTubeEmbed
                  videoUrl={selectedLesson.recording_url}
                  title={`vídeo - ${selectedLesson.title}`}
                />
              </div>
            )}

            <div
              className={`prose prose-stone max-w-4xl mx-auto text-tintaCarvao/90 font-light font-corpo lowercase leading-[1.85] space-y-4 ${
                zenFontSize === 'sm'
                  ? 'text-sm sm:text-base'
                  : zenFontSize === 'lg'
                  ? 'text-xl sm:text-2xl'
                  : 'text-lg sm:text-xl'
              }`}
              dangerouslySetInnerHTML={{ __html: selectedLesson.description || '' }}
            />
          </div>

          {/* BARRA INFERIOR NO DESKTOP */}
          <div className="hidden sm:flex w-full lg:w-[80%] mx-auto items-center justify-between pt-4 border-t border-papelKraft/30">
            {/* ESQUERDA: MARCAR COMO CONCLUÍDA */}
            <button
              type="button"
              onClick={() => {
                if (selectedLesson) {
                  setCompletedLessonIds((prev) =>
                    prev.includes(selectedLesson.id)
                      ? prev.filter((id) => id !== selectedLesson.id)
                      : [...prev, selectedLesson.id]
                  );
                }
              }}
              className={`px-5 py-2 rounded-2xl font-gesto text-[22px] sm:text-[25px] lowercase transition-all inline-flex items-center gap-2 shadow-sm cursor-pointer ${
                selectedLesson && completedLessonIds.includes(selectedLesson.id)
                  ? 'bg-acentoOliva text-white border border-acentoOliva'
                  : 'bg-white text-tintaCarvao border border-papelKraft/45 hover:bg-papelKraft/20'
              }`}
            >
              <CheckCircle className={`w-5 h-5 ${selectedLesson && completedLessonIds.includes(selectedLesson.id) ? 'text-white' : 'text-acentoOliva'}`} />
              <span>
                {selectedLesson && completedLessonIds.includes(selectedLesson.id)
                  ? 'aula concluída ✓'
                  : 'marcar como concluída'}
              </span>
            </button>

            {/* DIREITA: SELETOR DE NAVEGAÇÃO (< 1/3 >) */}
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-full border border-papelKraft/50 shadow-sm">
              <button
                type="button"
                onClick={handlePrevLesson}
                disabled={currentLessonIndex === 0}
                className="p-1.5 rounded-full hover:bg-bgPlataforma text-acentoAzul disabled:opacity-30 transition-colors cursor-pointer"
                title="aula anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-normal font-corpo text-acentoAzul px-1">
                {currentLessonIndex + 1} / {lessons.length}
              </span>
              <button
                type="button"
                onClick={handleNextLesson}
                disabled={currentLessonIndex === lessons.length - 1}
                className="p-1.5 rounded-full hover:bg-bgPlataforma text-acentoAzul disabled:opacity-30 transition-colors cursor-pointer"
                title="próxima aula"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* BARRA INFERIOR NO MOBILE (ESTILO APP MODERNO E DINÂMICO) */}
          <div className="sm:hidden w-full space-y-3 pt-3 border-t border-papelKraft/30 bg-bgPlataforma/95 backdrop-blur-sm sticky bottom-0">
            {/* LINHA 1: ÍCONES DAS FERRAMENTAS CENTRALIZADOS */}
            <div className="flex items-center justify-center gap-2 bg-white p-1 rounded-full border border-papelKraft/50 shadow-sm max-w-xs mx-auto">
              <button
                type="button"
                onClick={() => setActiveZenDrawer(activeZenDrawer === 'sumario' ? 'none' : 'sumario')}
                className={`p-2 rounded-full transition-colors cursor-pointer ${activeZenDrawer === 'sumario' ? 'bg-acentoAzul text-white' : 'text-acentoAzul hover:bg-bgPlataforma'}`}
                title="sumário de aulas"
              >
                <List className="w-4 h-4" />
              </button>

              {materials.length > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveZenDrawer(activeZenDrawer === 'materiais' ? 'none' : 'materiais')}
                  className={`p-2 rounded-full transition-colors cursor-pointer ${activeZenDrawer === 'materiais' ? 'bg-acentoAzul text-white' : 'text-acentoAzul hover:bg-bgPlataforma'}`}
                  title="materiais de apoio"
                >
                  <Download className="w-4 h-4" />
                </button>
              )}

              <button
                type="button"
                onClick={() => setActiveZenDrawer(activeZenDrawer === 'partilhas' ? 'none' : 'partilhas')}
                className={`p-2 rounded-full transition-colors cursor-pointer ${activeZenDrawer === 'partilhas' ? 'bg-acentoAzul text-white' : 'text-acentoAzul hover:bg-bgPlataforma'}`}
                title="partilhas da aula"
              >
                <MessageCircle className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsZenModeOpen(false);
                  handleOpenAtelierWithPrompt();
                }}
                className="p-2 rounded-full text-acentoTerracota hover:bg-papelKraft/30 transition-colors cursor-pointer"
                title="escrever no atelier"
              >
                <Pencil className="w-4 h-4 text-acentoTerracota" />
              </button>
            </div>

            {/* LINHA 2: MARCAR COMO CONCLUÍDA + NAVEGAÇÃO (< 1/3 >) */}
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  if (selectedLesson) {
                    setCompletedLessonIds((prev) =>
                      prev.includes(selectedLesson.id)
                        ? prev.filter((id) => id !== selectedLesson.id)
                        : [...prev, selectedLesson.id]
                    );
                  }
                }}
                className={`px-3 py-1.5 rounded-2xl font-gesto text-[18px] lowercase transition-all inline-flex items-center gap-1.5 shadow-sm cursor-pointer ${
                  selectedLesson && completedLessonIds.includes(selectedLesson.id)
                    ? 'bg-acentoOliva text-white border border-acentoOliva'
                    : 'bg-white text-tintaCarvao border border-papelKraft/45'
                }`}
              >
                <CheckCircle className={`w-4 h-4 ${selectedLesson && completedLessonIds.includes(selectedLesson.id) ? 'text-white' : 'text-acentoOliva'}`} />
                <span>
                  {selectedLesson && completedLessonIds.includes(selectedLesson.id)
                    ? 'concluída ✓'
                    : 'marcar concluída'}
                </span>
              </button>

              <div className="flex items-center gap-1 bg-white p-1 rounded-full border border-papelKraft/50 shadow-sm">
                <button
                  type="button"
                  onClick={handlePrevLesson}
                  disabled={currentLessonIndex === 0}
                  className="p-1 rounded-full text-acentoAzul disabled:opacity-30"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-normal font-corpo text-acentoAzul px-1">
                  {currentLessonIndex + 1}/{lessons.length}
                </span>
                <button
                  type="button"
                  onClick={handleNextLesson}
                  disabled={currentLessonIndex === lessons.length - 1}
                  className="p-1 rounded-full text-acentoAzul disabled:opacity-30"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* GAVETAS DESLIZANTES LATERAIS NO MODO FOCO (DESIGN EDITORIAL DE LUXO) */}
          {activeZenDrawer !== 'none' && (
            <>
              {/* BACKDROP TRANSLÚCIDO E SUAVE */}
              <div
                className="fixed inset-0 z-[9999998] bg-tintaCarvao/20 backdrop-blur-sm transition-opacity animate-fadeIn"
                onClick={() => setActiveZenDrawer('none')}
              />

              {/* CONTAINER DA GAVETA LATERAL (LARGURA EXPANDIDA EM ESCRITÓRIO: 540px, PAPEL CREME LUXURY) */}
              <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] lg:w-[540px] bg-papelClaro text-tintaCarvao shadow-[0_20px_50px_rgba(0,0,0,0.18)] z-[9999999] border-l border-papelKraft/40 p-6 sm:p-8 overflow-y-auto animate-slideInRight space-y-6 flex flex-col justify-between">
                
                <div className="space-y-6">
                  {/* CABEÇALHO EDITORIAL DE LUXO */}
                  <div className="flex items-center justify-between border-b border-papelKraft/30 pb-4">
                    <div className="flex items-center gap-3">
                      {activeZenDrawer === 'sumario' && <List className="w-6 h-6 text-acentoAzul" />}
                      {activeZenDrawer === 'materiais' && <Download className="w-6 h-6 text-acentoAzul" />}
                      {activeZenDrawer === 'partilhas' && <MessageCircle className="w-6 h-6 text-acentoAzul" />}
                      <h3 className="text-[2.2rem] leading-none font-normal font-gesto text-acentoAzul lowercase">
                        {activeZenDrawer === 'sumario' && 'sumário de aulas'}
                        {activeZenDrawer === 'materiais' && 'materiais de apoio'}
                        {activeZenDrawer === 'partilhas' && 'partilhas da aula'}
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveZenDrawer('none')}
                      className="p-2 rounded-full bg-white hover:bg-papelKraft/30 text-acentoAzul border border-papelKraft/40 shadow-sm transition-all cursor-pointer"
                      title="fechar"
                    >
                      <span className="text-sm font-bold font-corpo px-1">✕</span>
                    </button>
                  </div>

                  {/* PAINEL 1: SUMÁRIO DE AULAS */}
                  {activeZenDrawer === 'sumario' && (
                    <div className="space-y-5">
                      <div className="space-y-2 bg-white/80 p-4 rounded-2xl border border-papelKraft/30 shadow-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-normal font-corpo text-acentoAzul lowercase">progresso do curso</span>
                          <span className="font-gesto text-2xl text-acentoTerracota lowercase">
                            {progressPercent}% concluído
                          </span>
                        </div>
                        <div className="w-full bg-papelKraft/30 h-2 rounded-full overflow-hidden p-[1px]">
                          <div className="bg-acentoOliva h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${progressPercent}%` }} />
                        </div>
                      </div>

                      <div className="space-y-2.5 max-h-[70vh] overflow-y-auto pr-1">
                        {lessons.map((lesson, idx) => {
                          const isSelected = selectedLesson?.id === lesson.id;
                          return (
                            <button
                              key={lesson.id}
                              type="button"
                              onClick={() => {
                                setSelectedLesson(lesson);
                                setActiveZenDrawer('none');
                              }}
                              className={`w-full text-left p-4 rounded-2xl transition-all duration-200 border flex items-center justify-between gap-3 group cursor-pointer shadow-sm ${
                                isSelected
                                  ? 'bg-acentoAzul text-white border-acentoAzul'
                                  : 'bg-white hover:bg-papelKraft/20 text-tintaCarvao border-papelKraft/35'
                              }`}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <span className={`text-sm font-bold font-gesto shrink-0 ${isSelected ? 'text-white/80' : 'text-acentoAzul'}`}>
                                  {String(idx + 1).padStart(2, '0')}.
                                </span>
                                <p className={`text-sm sm:text-base font-light font-corpo lowercase leading-snug ${isSelected ? 'text-white font-medium' : 'text-tintaCarvao/90 group-hover:text-acentoAzul'}`}>
                                  {lesson.title}
                                </p>
                              </div>

                              {isSelected && <CheckCircle className="w-5 h-5 text-acentoOliva shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* PAINEL 2: MATERIAIS DE APOIO */}
                  {activeZenDrawer === 'materiais' && (
                    <div className="space-y-3">
                      {materials.map((mat) => (
                        <a
                          key={mat.id}
                          href={mat.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3.5 p-4 bg-white rounded-2xl border border-papelKraft/40 hover:border-acentoAzul transition-all shadow-sm group"
                        >
                          <Download className="w-5 h-5 text-acentoAzul shrink-0 group-hover:scale-110 transition-transform" />
                          <span className="text-sm font-medium font-corpo text-acentoAzul lowercase truncate">
                            {mat.title}
                          </span>
                        </a>
                      ))}
                    </div>
                  )}

                  {/* PAINEL 3: PARTILHAS DA AULA */}
                  {activeZenDrawer === 'partilhas' && (
                    <div className="space-y-5">
                      <form onSubmit={handleCommentSubmit} className="space-y-3">
                        <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          rows={3}
                          placeholder="deixe sua partilha..."
                          className="w-full bg-white rounded-2xl border border-papelKraft/40 p-4 font-corpo text-sm text-tintaCarvao placeholder:text-tintaCarvao/50 focus:outline-none focus:border-acentoAzul focus:ring-1 focus:ring-acentoAzul shadow-sm"
                        />
                        <div className="flex justify-end">
                          <button
                            type="submit"
                            className="px-6 py-2 rounded-2xl bg-acentoAzul text-white font-gesto text-[22px] lowercase shadow-sm hover:bg-acentoAzul/90 transition-colors cursor-pointer"
                          >
                            enviar partilha →
                          </button>
                        </div>
                      </form>

                      <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
                        {comments.length === 0 ? (
                          <p className="text-xs font-light font-corpo text-tintaCarvao/60 italic text-center py-4">
                            seja a primeira a partilhar uma reflexão sobre esta aula.
                          </p>
                        ) : (
                          comments.map((comment) => (
                            <div key={comment.id} className="p-4 rounded-2xl bg-white border border-papelKraft/35 space-y-2 shadow-sm">
                              <div className="flex items-center justify-between text-xs font-light font-corpo">
                                <span className="font-medium text-acentoAzul lowercase">
                                  {comment.user_profile?.display_name || 'aluna solta o verbo'}
                                </span>
                                <span className="text-tintaCarvao/50 text-[11px]">
                                  {new Date(comment.created_at).toLocaleDateString('pt-BR')}
                                </span>
                              </div>
                              <p className="text-xs sm:text-sm font-light font-corpo text-tintaCarvao/85 lowercase leading-relaxed">
                                {comment.content}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </>
          )}

        </div>,
        document.body
      )}
    </div>
  );
}
