import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import LoadingPage from '../components/LoadingPage';
import YouTubeEmbed from '../components/YouTubeEmbed';
import MobileLessonAccordion from '../components/MobileLessonAccordion';
import RichTextEditor from '../components/RichTextEditor';
import AudioPlayer from '../components/AudioPlayer';
import { isYouTubeUrl } from '../lib/youtubeUtils';
import {
  MessageCircle,
  ArrowLeft,
  Video,
  Calendar,
  Download,
} from 'lucide-react';
import type { Database } from '../lib/database.types';

type Course = Database['public']['Tables']['courses']['Row'];
type Lesson = Database['public']['Tables']['course_lessons']['Row'];
type Material = Database['public']['Tables']['course_materials']['Row'];
type AudioFile = Database['public']['Tables']['lesson_audio_files']['Row'];
type Comment = Database['public']['Tables']['comments']['Row'] & {
  user_profile: Database['public']['Tables']['users_profiles']['Row'];
  replies?: Comment[];
};

export default function CourseDetail() {
  const { courseId } = useParams();
  const { profile } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const desktopContentRef = useRef<HTMLDivElement>(null);
  const mobileContentRef = useRef<HTMLDivElement>(null);
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

      setTimeout(() => {
        if (window.innerWidth >= 1024) {
          desktopContentRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        } else {
          mobileContentRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }, 100);
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

  if (loading) {
    return <LoadingPage />;
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-paper">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Curso não encontrado</h2>
          <Link to="/dashboard" className="text-amber-600 hover:text-amber-700 mt-4 inline-block">
            Voltar ao início
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f0e6d1' }}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8">
        <Link
          to="/dashboard"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar aos cursos
        </Link>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6 lg:mb-8">
          <div
            className="relative px-4 py-8 sm:px-8 sm:py-12 text-white min-h-[200px] sm:min-h-[280px] flex flex-col justify-center"
            style={{ backgroundColor: '#1f008f' }}
          >
            <div className="relative z-10">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-white">{course.title}</h1>
              <div
                className="text-white text-sm sm:text-base md:text-lg leading-relaxed prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: course.description || '' }}
              />
            </div>
          </div>
        </div>

        {/* Mobile Accordion View */}
        <div className="lg:hidden" ref={mobileContentRef}>
          <MobileLessonAccordion
            lessons={lessons}
            selectedLesson={selectedLesson}
            onLessonSelect={setSelectedLesson}
            courseType={course.course_type}
            materials={materials}
            audioFiles={audioFiles}
          >
            <div className="space-y-4">
              <h3 className="text-base font-bold text-gray-900 flex items-center">
                <MessageCircle className="w-4 h-4 mr-2 text-amber-600" />
                Comentários
              </h3>

              <form onSubmit={handleCommentSubmit}>
                {replyTo && (
                  <div className="mb-2 text-xs text-gray-600">
                    Respondendo comentário...{' '}
                    <button
                      type="button"
                      onClick={() => setReplyTo(null)}
                      className="text-amber-600 hover:text-amber-700"
                    >
                      Cancelar
                    </button>
                  </div>
                )}
                <RichTextEditor
                  value={newComment}
                  onChange={setNewComment}
                  placeholder="Deixe seu comentário..."
                />
                <button
                  type="submit"
                  className="mt-2 w-full text-white px-4 py-2 rounded-lg font-medium transition text-sm hover:opacity-90"
                  style={{ backgroundColor: '#1f008f' }}
                >
                  Enviar Comentário
                </button>
              </form>

              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="space-y-3">
                    <div className="flex space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
                        {comment.user_profile?.display_name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-gray-900 text-sm truncate">
                              {comment.user_profile?.display_name}
                            </span>
                            <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                              {new Date(comment.created_at).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                          <div
                            className="text-gray-700 text-sm prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: comment.content }}
                          />
                        </div>
                        <button
                          onClick={() => setReplyTo(comment.id)}
                          className="text-xs text-amber-600 hover:text-amber-700 mt-1"
                        >
                          Responder
                        </button>
                      </div>
                    </div>

                    {comment.replies && comment.replies.length > 0 && (
                      <div className="ml-8 space-y-3">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex space-x-2">
                            <div className="w-7 h-7 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
                              {reply.user_profile?.display_name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="bg-gray-50 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-semibold text-gray-900 text-xs truncate">
                                    {reply.user_profile?.display_name}
                                  </span>
                                  <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                                    {new Date(reply.created_at).toLocaleDateString('pt-BR')}
                                  </span>
                                </div>
                                <div
                                  className="text-gray-700 text-xs prose prose-sm max-w-none"
                                  dangerouslySetInnerHTML={{ __html: reply.content }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </MobileLessonAccordion>
        </div>

        {/* Desktop Sidebar View */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Aulas</h3>
              <div className="space-y-2">
                {lessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    onClick={() => setSelectedLesson(lesson)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition ${
                      selectedLesson?.id === lesson.id
                        ? 'font-semibold'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                    style={
                      selectedLesson?.id === lesson.id
                        ? { backgroundColor: '#f0e6d1', color: '#1f008f' }
                        : {}
                    }
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      {lesson.tags && lesson.tags.length > 0 && (
                        <div className="flex gap-1 flex-wrap">
                          {lesson.tags.map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="px-2 py-0.5 rounded-full text-xs font-medium text-white"
                              style={{ backgroundColor: '#b6c700' }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="mt-1 text-sm">{lesson.title}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-4" ref={desktopContentRef}>
            {selectedLesson && (
              <>
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    {selectedLesson.title}
                  </h2>
                  <div
                    className="prose max-w-none text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: selectedLesson.description || '' }}
                  />

                  {audioFiles.length > 0 && (
                    <div className="mt-6">
                      <AudioPlayer
                        audioFiles={audioFiles.map(a => ({
                          id: a.id,
                          title: a.title,
                          audio_file_url: a.audio_file_url,
                          duration_seconds: a.duration_seconds
                        }))}
                      />
                    </div>
                  )}

                  {!audioFiles.length && selectedLesson.audio_url && (
                    <div className="mt-6">
                      <AudioPlayer
                        audioFiles={[{
                          id: 'legacy',
                          title: 'Áudio da Aula',
                          audio_file_url: selectedLesson.audio_url,
                          duration_seconds: 0
                        }]}
                      />
                    </div>
                  )}

                  {(selectedLesson.zoom_link || selectedLesson.recording_url) && (
                    <div className="mt-6 space-y-3">
                      {selectedLesson.zoom_link && (
                        <div className="bg-blue-50 rounded-xl p-4">
                          <div className="flex items-center space-x-3 mb-2">
                            <Video className="w-5 h-5 text-blue-600" />
                            <h3 className="text-lg font-semibold text-gray-900">
                              Aula ao Vivo
                            </h3>
                          </div>
                          <a
                            href={selectedLesson.zoom_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
                          >
                            Entrar na Aula
                          </a>
                        </div>
                      )}

                      {selectedLesson.recording_url && (
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4">
                          <div className="flex items-center space-x-3 mb-2">
                            <Calendar className="w-5 h-5 text-gray-600" />
                            <h3 className="text-lg font-semibold text-gray-900">Gravação</h3>
                          </div>
                          {isYouTubeUrl(selectedLesson.recording_url) ? (
                            <YouTubeEmbed
                              videoUrl={selectedLesson.recording_url}
                              title={`Gravação - ${selectedLesson.title}`}
                            />
                          ) : (
                            <a
                              href={selectedLesson.recording_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block bg-gray-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition"
                            >
                              Assistir Gravação
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {materials.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <Download className="w-6 h-6 mr-2 text-amber-600" />
                      Materiais para Download
                    </h3>
                    <div className="space-y-3">
                      {materials.map((material) => (
                        <a
                          key={material.id}
                          href={material.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition group"
                        >
                          <span className="font-medium text-gray-900 group-hover:text-amber-600 transition">
                            {material.title}
                          </span>
                          <Download className="w-5 h-5 text-gray-400 group-hover:text-amber-600 transition" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <MessageCircle className="w-6 h-6 mr-2 text-amber-600" />
                    Comentários
                  </h3>

                  <form onSubmit={handleCommentSubmit} className="mb-6">
                    {replyTo && (
                      <div className="mb-2 text-sm text-gray-600">
                        Respondendo comentário...{' '}
                        <button
                          type="button"
                          onClick={() => setReplyTo(null)}
                          className="text-amber-600 hover:text-amber-700"
                        >
                          Cancelar
                        </button>
                      </div>
                    )}
                    <RichTextEditor
                      value={newComment}
                      onChange={setNewComment}
                      placeholder="Deixe seu comentário..."
                    />
                    <button
                      type="submit"
                      className="mt-3 text-white px-6 py-2 rounded-lg font-medium transition hover:opacity-90"
                      style={{ backgroundColor: '#1f008f' }}
                    >
                      Enviar Comentário
                    </button>
                  </form>

                  <div className="space-y-6">
                    {comments.map((comment) => (
                      <div key={comment.id} className="space-y-4">
                        <div className="flex space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                            {comment.user_profile?.display_name?.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className="bg-gray-50 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-semibold text-gray-900">
                                  {comment.user_profile?.display_name}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {new Date(comment.created_at).toLocaleDateString('pt-BR')}
                                </span>
                              </div>
                              <div
                                className="text-gray-700 prose prose-sm max-w-none"
                                dangerouslySetInnerHTML={{ __html: comment.content }}
                              />
                            </div>
                            <button
                              onClick={() => setReplyTo(comment.id)}
                              className="text-sm text-amber-600 hover:text-amber-700 mt-2"
                            >
                              Responder
                            </button>
                          </div>
                        </div>

                        {comment.replies && comment.replies.length > 0 && (
                          <div className="ml-12 space-y-4">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="flex space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                                  {reply.user_profile?.display_name?.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1">
                                  <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="font-semibold text-gray-900 text-sm">
                                        {reply.user_profile?.display_name}
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        {new Date(reply.created_at).toLocaleDateString('pt-BR')}
                                      </span>
                                    </div>
                                    <div
                                      className="text-gray-700 text-sm prose prose-sm max-w-none"
                                      dangerouslySetInnerHTML={{ __html: reply.content }}
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
