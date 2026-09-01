import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import UserNavbar from '../components/UserNavbar';
import FloatingNavbar from '../components/FloatingNavbar';
import LoadingPage from '../components/LoadingPage';
import { BookOpen, Sparkles, Crown, ArrowRight, Play, CheckCircle } from 'lucide-react';
import type { Database } from '../lib/database.types';

type Course = Database['public']['Tables']['courses']['Row'] & {
  lessonCount?: number;
};

export default function CoursesCatalog() {
  const { profile } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'free' | 'paid'>('all');

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (coursesError) throw coursesError;

      // Buscar a quantidade de aulas por curso
      const coursesWithLessons = await Promise.all(
        (coursesData || []).map(async (course) => {
          const { count } = await supabase
            .from('course_lessons')
            .select('*', { count: 'exact', head: true })
            .eq('course_id', course.id);

          return {
            ...course,
            lessonCount: count || 0,
          };
        })
      );

      setCourses(coursesWithLessons);
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:pl-28 pt-8 space-y-8">
        
        {/* CABEÇALHO DO CATÁLOGO DE OFICINAS */}
        <div className="space-y-3 border-b border-papelKraft/40 pb-6">
          <div className="flex items-center gap-2 text-acentoTerracota text-xs font-normal font-corpo lowercase tracking-wide">
            <Sparkles className="w-4 h-4 text-acentoTerracota" />
            <span>catálogo de oficinas & cursos</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-editorial text-acentoAzul lowercase leading-tight">
            nossas oficinas & cursos
          </h1>

          <p className="text-xs sm:text-sm font-light font-corpo text-tintaCarvao/75 lowercase leading-relaxed max-w-3xl">
            explore os caminhos de escrita, ciclos de aprofundamento poético e imersões da nossa comunidade. cada oficina é um convite para soltar o verbo sem cobrança.
          </p>
        </div>

        {/* ABAS DE FILTRO EM HELVETICA (MIN 14PX) */}
        <div className="flex items-center gap-2 flex-wrap pb-2">
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

        {/* GRID DE CARDS DAS OFICINAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
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

              return (
                <div
                  key={course.id}
                  className="bg-papelClaro rounded-3xl border border-papelKraft/50 shadow-kraft hover:border-acentoAzul transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                >
                  {/* IMAGEM / CAPA DO CURSO */}
                  <div className="relative h-48 sm:h-52 bg-papelKraft/30 overflow-hidden">
                    {course.thumbnail_url ? (
                      <img
                        src={course.thumbnail_url}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-papelKraft/40 to-acentoAzul/20 flex items-center justify-center p-6 text-center">
                        <BookOpen className="w-12 h-12 text-acentoAzul opacity-40" />
                      </div>
                    )}

                    {/* BADGE SUPERIOR DE STATUS DE ACESSO */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-normal font-corpo bg-white/95 text-acentoTerracota border border-papelKraft/40 lowercase shadow-sm inline-flex items-center gap-1">
                        <Crown className="w-3.5 h-3.5 text-acentoTerracota" />
                        <span>{course.course_type === 'free' ? 'gratuito' : 'exclusivo premium'}</span>
                      </span>
                    </div>
                  </div>

                  {/* CONTEÚDO EDITORIAL DO CARD */}
                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-light font-corpo text-tintaCarvao/60 lowercase">
                        <span>{course.lessonCount || 0} aulas disponíveis</span>
                        {hasAccess ? (
                          <span className="text-acentoOliva font-normal flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5 text-acentoOliva inline" />
                            <span>acesso liberado</span>
                          </span>
                        ) : (
                          <span className="text-acentoTerracota font-normal">requer plano premium</span>
                        )}
                      </div>

                      <h3 className="text-xl sm:text-2xl font-bold font-editorial text-acentoAzul lowercase leading-snug group-hover:text-acentoTerracota transition-colors">
                        {course.title}
                      </h3>

                      {course.description && (
                        <p className="text-xs sm:text-sm font-light font-corpo text-tintaCarvao/75 lowercase leading-relaxed line-clamp-3">
                          {course.description}
                        </p>
                      )}
                    </div>

                    {/* BOTÃO DE AÇÃO PRINCIPAL EM MUTHAZLE (23PX DESKTOP / 20PX MOBILE) */}
                    <div className="pt-4 border-t border-papelKraft/30">
                      {hasAccess ? (
                        <Link
                          to={`/course/${course.id}`}
                          className="w-full inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl bg-acentoAzul text-white font-gesto text-[20px] sm:text-[23px] lowercase shadow-sm hover:bg-acentoAzul/90 transition-transform hover:scale-[1.02] cursor-pointer"
                        >
                          <span>entrar na oficina →</span>
                        </Link>
                      ) : (
                        <a
                          href={course.stripe_payment_link || '/profile'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl bg-acentoTerracota text-white font-gesto text-[20px] sm:text-[23px] lowercase shadow-sm hover:bg-acentoTerracota/90 transition-transform hover:scale-[1.02] cursor-pointer"
                        >
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
