import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import UserNavbar from '../components/UserNavbar';
import FloatingNavbar from '../components/FloatingNavbar';
import LoadingPage from '../components/LoadingPage';
import { BookOpen, Crown, ArrowRight, Play, Lock, CheckCircle } from 'lucide-react';
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

      // Carregar total de aulas e progresso por curso
      const coursesWithStats = await Promise.all(
        (coursesData || []).map(async (course) => {
          const { count: lessonCount } = await supabase
            .from('course_lessons')
            .select('*', { count: 'exact', head: true })
            .eq('course_id', course.id);

          return {
            ...course,
            lessonCount: lessonCount || 0,
            userProgress: 0, // Pode ser expandido com histórico do usuário
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
    <div className="min-h-screen bg-bgPlataforma text-tintaCarvao pb-24">
      <UserNavbar />
      <FloatingNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:pl-28 pt-8 space-y-6">
        
        {/* CABEÇALHO DO CATÁLOGO DE OFICINAS (TÍTULO EM MUTHAZLE font-gesto, SEM TEXTO SUPERIOR OU PARÁGRAFO) */}
        <div className="border-b border-papelKraft/40 pb-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-normal font-gesto text-acentoAzul lowercase leading-tight">
            nossas oficinas & cursos
          </h1>
        </div>

        {/* ABAS DE FILTRO EM HELVETICA (MIN 14PX) */}
        <div className="flex items-center gap-2 flex-wrap pb-1">
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

        {/* GRID COMPACTO DE CARDS DAS OFICINAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
          {filteredCourses.length === 0 ? (
            <div className="col-span-full bg-papelClaro rounded-3xl p-10 text-center space-y-3 border border-papelKraft/40 shadow-sm">
              <BookOpen className="w-10 h-10 text-acentoAzul mx-auto" />
              <p className="text-sm font-light font-corpo text-tintaCarvao/70 lowercase">
                nenhuma oficina encontrada para este filtro no momento.
              </p>
            </div>
          ) : (
            filteredCourses.map((course, idx) => {
              const hasAccess = canAccessCourse(course);
              // Simular estado de retomar para o primeiro curso ou com progresso ativo
              const isRetomar = hasAccess && idx === 0;

              return (
                <div
                  key={course.id}
                  className="bg-papelClaro rounded-3xl border border-papelKraft/45 shadow-kraft hover:border-acentoAzul transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                >
                  {/* CAPA COMPACTA DO CURSO */}
                  <div className="relative h-36 sm:h-40 bg-papelKraft/30 overflow-hidden shrink-0">
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

                    {/* BADGE SUPERIOR DE STATUS DE ACESSO */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-normal font-corpo bg-white/95 text-acentoTerracota border border-papelKraft/40 lowercase shadow-sm inline-flex items-center gap-1">
                        <Crown className="w-3.5 h-3.5 text-acentoTerracota" />
                        <span>{course.course_type === 'free' ? 'gratuito' : 'exclusivo premium'}</span>
                      </span>
                    </div>
                  </div>

                  {/* CONTEÚDO EDITORIAL COMPACTO DO CARD */}
                  <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-light font-corpo text-tintaCarvao/60 lowercase">
                        {hasAccess ? (
                          <span className="text-acentoOliva font-normal flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5 text-acentoOliva inline" />
                            <span>acesso liberado</span>
                          </span>
                        ) : (
                          <span className="text-acentoTerracota font-normal">requer plano premium</span>
                        )}
                      </div>

                      <h3 className="text-lg sm:text-xl font-bold font-editorial text-acentoAzul lowercase leading-snug group-hover:text-acentoTerracota transition-colors line-clamp-2">
                        {course.title}
                      </h3>

                      {course.description && (
                        <p className="text-xs font-light font-corpo text-tintaCarvao/75 lowercase leading-relaxed line-clamp-2">
                          {course.description}
                        </p>
                      )}
                    </div>

                    {/* BOTÃO DINÂMICO DE ACORDO COM O ESTADO (LIBERADO / RETOMAR / DESBLOQUEAR) */}
                    <div className="pt-3 border-t border-papelKraft/30">
                      {isRetomar ? (
                        <Link
                          to={`/course/${course.id}`}
                          className="w-full inline-flex items-center justify-center gap-2 px-5 py-2 rounded-2xl bg-acentoOliva text-tintaCarvao font-gesto text-[20px] sm:text-[23px] lowercase shadow-sm hover:bg-acentoOliva/90 transition-transform hover:scale-[1.02] cursor-pointer"
                        >
                          <Play className="w-4 h-4 text-tintaCarvao fill-tintaCarvao" />
                          <span>retomar oficina →</span>
                        </Link>
                      ) : hasAccess ? (
                        <Link
                          to={`/course/${course.id}`}
                          className="w-full inline-flex items-center justify-center gap-2 px-5 py-2 rounded-2xl bg-acentoAzul text-white font-gesto text-[20px] sm:text-[23px] lowercase shadow-sm hover:bg-acentoAzul/90 transition-transform hover:scale-[1.02] cursor-pointer"
                        >
                          <ArrowRight className="w-4 h-4 text-white" />
                          <span>entrar na oficina →</span>
                        </Link>
                      ) : (
                        <a
                          href={course.stripe_payment_link || '/profile'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex items-center justify-center gap-2 px-5 py-2 rounded-2xl bg-acentoTerracota text-white font-gesto text-[20px] sm:text-[23px] lowercase shadow-sm hover:bg-acentoTerracota/90 transition-transform hover:scale-[1.02] cursor-pointer"
                        >
                          <Lock className="w-4 h-4 text-white" />
                          <span>desbloquear oficina →</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </main>
    </div>
  );
}
