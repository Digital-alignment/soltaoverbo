import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import UserNavbar from '../components/UserNavbar';
import FloatingNavbar from '../components/FloatingNavbar';
import LoadingPage from '../components/LoadingPage';
import { BookOpen, Crown, Sparkles, ArrowRight, Play, Lock, CheckCircle } from 'lucide-react';
import type { Database } from '../lib/database.types';

type Course = Database['public']['Tables']['courses']['Row'] & {
  lessonCount?: number;
  userProgress?: number;
};

export default function CoursesCatalog() {
  const { profile, user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'free' | 'paid'>('all');

  useEffect(() => {
    loadCourses();
  }, [user]);

  const loadCourses = async () => {
    try {
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (coursesError) throw coursesError;

      const coursesWithStats = await Promise.all(
        (coursesData || []).map(async (course) => {
          const { count: lessonCount } = await supabase
            .from('course_lessons')
            .select('*', { count: 'exact', head: true })
            .eq('course_id', course.id);

          return {
            ...course,
            lessonCount: lessonCount || 0,
            userProgress: 0,
          };
        })
      );

      setCourses(coursesWithStats);
    } catch (error) {
      console.error('Erro ao carregar catálogo de oficinas:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter((c) => {
    if (activeFilter === 'free') return c.course_type === 'free';
    if (activeFilter === 'paid') return c.course_type === 'paid';
    return true;
  });

  const canAccessCourse = (course: Course) => {
    if (course.course_type === 'free') return true;
    return profile?.role === 'paid' || profile?.role === 'admin';
  };

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen bg-bgPlataforma text-tintaCarvao pb-28 sm:pb-32">
      <UserNavbar />
      <FloatingNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:pl-28 pt-4 sm:pt-6 space-y-6">
        
        {/* CABEÇALHO DA PÁGINA */}
        <div className="space-y-3 border-b border-papelKraft/40 pb-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-normal font-gesto text-acentoAzul lowercase leading-tight text-left">
            nossas oficinas & cursos
          </h1>

          {/* ABAS DE FILTRO EM HELVETICA (MIN 14PX) */}
          <div className="flex items-center gap-2 flex-wrap pt-1">
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-1.5 rounded-full text-sm font-normal font-corpo lowercase transition-all cursor-pointer shadow-sm ${
                activeFilter === 'all'
                  ? 'bg-acentoAzul text-white font-medium'
                  : 'bg-white text-tintaCarvao/80 hover:bg-papelKraft/30 border border-papelKraft/40'
              }`}
            >
              todos ({courses.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter('free')}
              className={`px-4 py-1.5 rounded-full text-sm font-normal font-corpo lowercase transition-all cursor-pointer shadow-sm ${
                activeFilter === 'free'
                  ? 'bg-acentoAzul text-white font-medium'
                  : 'bg-white text-tintaCarvao/80 hover:bg-papelKraft/30 border border-papelKraft/40'
              }`}
            >
              gratuitos ({courses.filter((c) => c.course_type === 'free').length})
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter('paid')}
              className={`px-4 py-1.5 rounded-full text-sm font-normal font-corpo lowercase transition-all cursor-pointer shadow-sm ${
                activeFilter === 'paid'
                  ? 'bg-acentoAzul text-white font-medium'
                  : 'bg-white text-tintaCarvao/80 hover:bg-papelKraft/30 border border-papelKraft/40'
              }`}
            >
              exclusivos premium ({courses.filter((c) => c.course_type === 'paid').length})
            </button>
          </div>
        </div>

        {/* GRID DE CARDS CLICÁVEIS POR INTEIRO */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 items-stretch pt-2">
          {filteredCourses.length === 0 ? (
            <div className="col-span-full bg-papelClaro rounded-3xl p-12 text-center space-y-3 border border-papelKraft/40 shadow-sm">
              <BookOpen className="w-10 h-10 text-acentoAzul mx-auto" />
              <p className="text-sm font-light font-corpo text-tintaCarvao/70 lowercase">
                nenhuma oficina encontrada para este filtro no momento.
              </p>
            </div>
          ) : (
            filteredCourses.map((course) => {
              const hasAccess = canAccessCourse(course);
              const savedLastLessonId = localStorage.getItem(`soltaoverbo_last_lesson_${course.id}`);
              const isStarted = hasAccess && Boolean(savedLastLessonId);

              // Card Container com Link Dinâmico
              const CardContent = (
                <div className="bg-papelClaro rounded-3xl border border-papelKraft/45 shadow-kraft hover:border-acentoAzul hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden group cursor-pointer h-full">
                  {/* CAPA COMPACTA DO CURSO COM TAGS DENTRO DA IMAGEM */}
                  <div className="relative h-40 sm:h-44 bg-papelKraft/30 overflow-hidden shrink-0">
                    {course.thumbnail_url ? (
                      <img
                        src={course.thumbnail_url}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-papelKraft/40 to-acentoAzul/20 flex items-center justify-center p-4 text-center">
                        <BookOpen className="w-10 h-10 text-acentoAzul opacity-40" />
                      </div>
                    )}

                    {/* TAG SUPERIOR ESQUERDO: APENAS O ÍCONE */}
                    <div className="absolute top-2.5 left-2.5">
                      {course.course_type === 'paid' ? (
                        <div
                          className="p-1.5 rounded-full bg-white/95 text-acentoTerracota border border-papelKraft/40 shadow-md flex items-center justify-center"
                          title="exclusivo premium"
                        >
                          <Crown className="w-3.5 h-3.5 text-acentoTerracota" />
                        </div>
                      ) : (
                        <div
                          className="p-1.5 rounded-full bg-white/95 text-acentoAzul border border-papelKraft/40 shadow-md flex items-center justify-center"
                          title="oficina gratuita"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-acentoAzul" />
                        </div>
                      )}
                    </div>

                    {/* TAG INFERIOR DIREITO: ALTO CONTRASTE */}
                    <div className="absolute bottom-2.5 right-2.5">
                      {hasAccess ? (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold font-corpo bg-acentoOliva text-white border border-white/80 lowercase shadow-md inline-flex items-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-white shrink-0" />
                          <span>liberado</span>
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold font-corpo bg-acentoTerracota text-white border border-white/80 lowercase shadow-md inline-flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-white shrink-0" />
                          <span>bloquear</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* CONTEÚDO EDITORIAL DO CARD */}
                  <div className="p-4 sm:p-5 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <h3 className="text-lg sm:text-xl font-bold font-editorial text-acentoAzul lowercase leading-snug group-hover:text-acentoTerracota transition-colors line-clamp-2">
                        {course.title}
                      </h3>

                      {course.description && (
                        <p className="text-xs font-light font-corpo text-tintaCarvao/75 lowercase leading-relaxed line-clamp-2">
                          {course.description}
                        </p>
                      )}
                    </div>

                    {/* ÁREA DO BOTÃO REATIVO AO HOVER DA CARD INTEIRA */}
                    <div className="pt-3 border-t border-papelKraft/30">
                      {isStarted ? (
                        /* CASO B: JÁ COMEÇOU (CONTINUAR -> TERRACOTA) */
                        <div className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-acentoTerracota text-white font-gesto text-[28px] sm:text-[34px] lowercase shadow-md group-hover:bg-acentoTerracota/90 group-hover:scale-[1.02] transition-transform">
                          <span>continuar</span>
                          <Play className="w-5 h-5 text-white fill-white shrink-0" />
                        </div>
                      ) : hasAccess ? (
                        /* CASO A: NÃO COMEÇOU E LIBERADO (COMEÇAR -> VERDE OLIVA) */
                        <div className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-acentoOliva text-white font-gesto text-[26px] sm:text-[32px] lowercase shadow-md group-hover:bg-acentoOliva/90 group-hover:scale-[1.02] transition-transform">
                          <span>começar</span>
                          <ArrowRight className="w-5 h-5 text-white shrink-0" />
                        </div>
                      ) : (
                        /* CASO C: BLOQUEADO PARA UPGRADE (DESBLOQUEAR -> AZUL) */
                        <div className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-acentoAzul text-white font-gesto text-[26px] sm:text-[32px] lowercase shadow-md group-hover:bg-acentoAzul/90 group-hover:scale-[1.02] transition-transform">
                          <span>desbloquear</span>
                          <Lock className="w-5 h-5 text-white shrink-0" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );

              return hasAccess ? (
                <Link key={course.id} to={`/course/${course.id}`} className="block h-full">
                  {CardContent}
                </Link>
              ) : (
                <a
                  key={course.id}
                  href={course.stripe_payment_link || '/profile'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block h-full"
                >
                  {CardContent}
                </a>
              );
            })
          )}
        </div>

      </main>
    </div>
  );
}
