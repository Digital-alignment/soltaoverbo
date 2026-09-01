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

      // Carregar estatísticas do curso
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
    <div className="min-h-screen bg-bgPlataforma text-tintaCarvao pb-24">
      <UserNavbar />
      <FloatingNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:pl-28 pt-3 sm:pt-4 space-y-4">
        
        {/* CABEÇALHO DO CATÁLOGO COM COLLAGE ALINHADO À DIREITA EM DESKTOP */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-papelKraft/40 pb-3">
          <div className="space-y-3">
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

          {/* COLLAGE DA ILUSTRAÇÃO NO LADO DIREITO EM DESKTOP */}
          <div className="hidden md:flex justify-end shrink-0">
            <img
              src="/brand-assets/elements/collages/png-person-reading-book-flower-sitting-person.png"
              alt="pessoa lendo livro"
              className="h-28 lg:h-36 max-w-[220px] object-contain"
            />
          </div>
        </div>

        {/* GRID COMPACTO DE CARDS DAS OFICINAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch pt-2">
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
              // Primeiro curso simula estado iniciado (continuar), os demais liberados não iniciados (começar)
              const isStarted = hasAccess && idx === 0;

              return (
                <div
                  key={course.id}
                  className="bg-papelClaro rounded-3xl border border-papelKraft/45 shadow-kraft hover:border-acentoAzul transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                >
                  {/* CAPA COMPACTA DO CURSO COM TAGS DENTRO DA IMAGEM */}
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

                    {/* TAG SUPERIOR ESQUERDO: APENAS O ÍCONE (SEM PALAVRAS) */}
                    <div className="absolute top-2.5 left-2.5">
                      {course.course_type === 'paid' ? (
                        <div
                          className="p-1.5 rounded-full bg-white/95 text-acentoTerracota border border-papelKraft/40 shadow-sm flex items-center justify-center"
                          title="exclusivo premium"
                        >
                          <Crown className="w-3.5 h-3.5 text-acentoTerracota" />
                        </div>
                      ) : (
                        <div
                          className="p-1.5 rounded-full bg-white/95 text-acentoAzul border border-papelKraft/40 shadow-sm flex items-center justify-center"
                          title="oficina gratuita"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-acentoAzul" />
                        </div>
                      )}
                    </div>

                    {/* TAG INFERIOR DIREITO: ÍCONE + APENAS 1 PALAVRA ('liberado' OU 'bloquear') */}
                    <div className="absolute bottom-2.5 right-2.5">
                      {hasAccess ? (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-light font-corpo bg-white/95 text-acentoOliva border border-papelKraft/40 lowercase shadow-sm inline-flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5 text-acentoOliva shrink-0" />
                          <span>liberado</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-light font-corpo bg-white/95 text-acentoTerracota border border-papelKraft/40 lowercase shadow-sm inline-flex items-center gap-1">
                          <Lock className="w-3.5 h-3.5 text-acentoTerracota shrink-0" />
                          <span>bloquear</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* CONTEÚDO EDITORIAL COMPACTO DO CARD */}
                  <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <h3 className="text-lg sm:text-xl font-bold font-editorial text-acentoAzul lowercase leading-snug group-hover:text-acentoTerracota transition-colors line-clamp-2">
                        {course.title}
                      </h3>

                      {course.description && (
                        <p className="text-xs font-light font-corpo text-tintaCarvao/75 lowercase leading-relaxed line-clamp-2">
                          {course.description}
                        </p>
                      )}
                    </div>

                    {/* BOTÕES DE AÇÃO DINÂMICOS COM TEXTO DE 1 PALAVRA E ÍCONE NO LADO DIREITO */}
                    <div className="pt-3 border-t border-papelKraft/30">
                      {isStarted ? (
                        /* CASO B: JÁ COMEOU (CONTINUAR -> TERRACOTA, TEXTO MAIOR, ÍCONE DIREITA) */
                        <Link
                          to={`/course/${course.id}`}
                          className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-acentoTerracota text-white font-gesto text-[22px] sm:text-[24px] lowercase shadow-sm hover:bg-acentoTerracota/90 transition-transform hover:scale-[1.02] cursor-pointer"
                        >
                          <span>continuar</span>
                          <Play className="w-4 h-4 text-white fill-white shrink-0" />
                        </Link>
                      ) : hasAccess ? (
                        /* CASO A: NÃO COMEOU E LIBERADO (COMEÇAR -> VERDE OLIVA, TEXTO BRANCO, ÍCONE DIREITA) */
                        <Link
                          to={`/course/${course.id}`}
                          className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-acentoOliva text-white font-gesto text-[20px] sm:text-[22px] lowercase shadow-sm hover:bg-acentoOliva/90 transition-transform hover:scale-[1.02] cursor-pointer"
                        >
                          <span>começar</span>
                          <ArrowRight className="w-4 h-4 text-white shrink-0" />
                        </Link>
                      ) : (
                        /* CASO C: BLOQUEADO PARA UPGRADE (DESBLOQUEAR -> AZUL, TEXTO BRANCO, ÍCONE DIREITA) */
                        <a
                          href={course.stripe_payment_link || '/profile'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-acentoAzul text-white font-gesto text-[20px] sm:text-[22px] lowercase shadow-sm hover:bg-acentoAzul/90 transition-transform hover:scale-[1.02] cursor-pointer"
                        >
                          <span>desbloquear</span>
                          <Lock className="w-4 h-4 text-white shrink-0" />
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
